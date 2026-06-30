import { useProducts } from '../hooks/useProducts'
import { useState, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Product } from '../types'
import { uploadImage, deleteImage } from '../services'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useIngredients } from '@/features/ingredients/hooks/useIngredients'
import { useUnidadesMedida } from '@/features/ingredients/hooks/useUnidadesMedida'
import { useProductoIngredientes } from '@/features/ingredients/hooks/useProductoIngredientes'

export default function ProductsPage() {
  const [open, setOpen] = useState(false) //Modal visible o no
  //Trae datos de productos, categorias e ingredientes
  const { data, isLoading, error, mutate, isPending, update, isUpdating, remove, isDeleting } = useProducts()
  const { data: categories } = useCategories()
  const { data: ingredients } = useIngredients()
  const { data: unidadesMedida } = useUnidadesMedida()

  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  //Guarda el producto que se está editando
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)//Product = editar | null = crear

  //Relación producto-ingrediente: trae la asignación actual cuando se edita, y expone assign/update/remove
  const { data: productoIngredientesData, assign, update: updateRelacion, remove: removeRelacion } = useProductoIngredientes(editingProduct?.id)

  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<{
    ingrediente_id: number
    cantidad: number
    unidad_medida_id: number
    es_removible: boolean
  }[]>([])

  //Cuando llega la data de ingredientes ya asignados al producto que se edita, precarga el estado local
  useEffect(() => {
    if (productoIngredientesData) {
      setIngredientesSeleccionados(
        productoIngredientesData.map((pi) => ({
          ingrediente_id: pi.ingrediente_id,
          cantidad: Number(pi.cantidad),
          unidad_medida_id: pi.unidad_medida_id,
          es_removible: pi.es_removible,
        }))
      )
    }
  }, [productoIngredientesData])

  const form = useForm({
    defaultValues: {nombre: '', precio_base: 0, descripcion: '', categoria_id: 0}, //Valores default
    onSubmit: async({value}) => { //value tiene todos los campos del form
      if (editingProduct) { //Si se está editando
        const productoId = editingProduct.id
        const originalIds = productoIngredientesData?.map((pi) => pi.ingrediente_id) ?? []
        const currentIds = ingredientesSeleccionados.map((i) => i.ingrediente_id)

        update({id: productoId, body:{...value, imagenes_url: imageUrls}}, { //Patch
          onSuccess: () => {
            //Ingredientes nuevos -> asociar
            ingredientesSeleccionados
              .filter((i) => !originalIds.includes(i.ingrediente_id))
              .forEach((i) => assign({producto_id: productoId, ingrediente_id: i.ingrediente_id, cantidad: i.cantidad, unidad_medida_id: i.unidad_medida_id, es_removible: i.es_removible}))

            //Ingredientes sacados -> quitar relación
            originalIds
              .filter((id) => !currentIds.includes(id))
              .forEach((id) => removeRelacion({ingredienteId: id, productoId}))

            //Ingredientes que ya estaban -> actualizar cantidad/unidad/removible
            ingredientesSeleccionados
              .filter((i) => originalIds.includes(i.ingrediente_id))
              .forEach((i) => updateRelacion({ingredienteId: i.ingrediente_id, productoId, body: {cantidad: i.cantidad, unidad_medida_id: i.unidad_medida_id, es_removible: i.es_removible}}))
          },
        })
      } else { //Si está creando
        mutate({ //Post
          ...value,
          imagenes_url: imageUrls,
          disponible: true,
          stock_cantidad: 0,
          ingrediente_ids: [], //Campo legacy, la asignación real va por separado
        }, {
          onSuccess: (newProduct) => {
            ingredientesSeleccionados.forEach((i) =>
              assign({producto_id: newProduct.id, ingrediente_id: i.ingrediente_id, cantidad: i.cantidad, unidad_medida_id: i.unidad_medida_id, es_removible: i.es_removible})
            )
          },
        })
      }
      //Cierra modal y edición
      setOpen(false)
      setEditingProduct(null)
    },
  })

  const handleEdit = (product: Product) => { //Al editar
    setEditingProduct(product) //Guarda el producto en el state, dispara la query de producto-ingrediente
    //Llena el form con los datos. setFieldValue actualiza cada campo en el estado del form
    form.setFieldValue('nombre', product.nombre)
    form.setFieldValue('precio_base', product.precio_base)
    form.setFieldValue('descripcion', product.descripcion ?? '') //Si no hay descripción guarda ''
    form.setFieldValue('categoria_id', product.categoria_id)
    setImageUrls(product.imagenes_url)
    setOpen(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const { url } = await uploadImage(file)
      setImageUrls((prev) => [...prev, url])
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  //Estados de carga
  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar productos</div>

  return(
    <>
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Productos</h1>
        <button /*Botón de crear producto*/
          onClick={() => {
            form.reset()
            setImageUrls([])
            setIngredientesSeleccionados([])
            setEditingProduct(null)
            setOpen(true)
          }}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
            Nuevo Producto
        </button>
      </div>

      {/*Lista*/}
      <ul className='flex flex-col gap-2'>
        {data?.map((p) => ( /*Si no hay data no llama a .map()*/
          <li key={p.id} className='border rounded p-4 flex justify-between items-center'>
            <div>
              <span className='font-medium'>{p.nombre}</span> - ${p.precio_base}
              {p.descripcion && <p className='text-gray-500 text-sm'>{p.descripcion}</p>} {/*Si no hay descripcion no renderiza el párrafo*/}
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => handleEdit(p)}
                className='text-sm border px-3 py-1 rounded hover:bg-gray-100'>
                  Editar
              </button>
              <button
                onClick={() => remove(p.id)}
                disabled={isDeleting}
                className='text-sm border px-3 py-1 rounded hover:bg-red-50 text-red-600 disabled:opacity-50'>
                  Eliminar
              </button>
            </div>

          </li>
        ))}
      </ul>

      {/*Modal*/}
      {open && ( /*Si open es true*/
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
            <h2 className='text-lg font-bold mb-4'>
              {editingProduct ? 'Editar producto' : 'Nuevo Producto'}</h2>
            <form /*Formulario*/
              onSubmit={(e) => {
                e.preventDefault() /*Evita que el form recargue la página*/
                form.handleSubmit() /*Ejecuta onSubmit*/
              }}
              className='flex flex-col gap-4'>
                <form.Field name="nombre">
                  {(field) => (
                    <input
                      placeholder='Nombre'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className='border rounded px-3 py-2'
                    />
                  )}
                </form.Field>
                <form.Field name="precio_base">
                  {(field) => (
                    <input
                      type="number"
                      step="0.01"
                      placeholder='Precio'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      className='border rounded px-3 py-2'
                    />
                  )}
                </form.Field>
                <form.Field name="descripcion">
                  {(field) => (
                    <input
                      placeholder='Descripción (opcional)'
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className='border rounded px-3 py-2'
                    />
                  )}
                </form.Field>

                <div className='flex flex-col gap-2'>
                  <label className='font-medium text-sm'>Imágenes</label>
                  <label className={`flex items-center justify-center border rounded px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type='file' accept='image/*' className='hidden' onChange={handleFileUpload} disabled={isUploading} />
                    {isUploading ? 'Subiendo...' : 'Elegir imagen'}
                  </label>
                  {imageUrls.map((url, i) => (
                    <div key={i} className='flex items-center gap-2 text-sm'>
                      <img src={url} alt='' className='w-10 h-10 object-cover rounded' />
                      <span className='flex-1 truncate text-gray-600'>{url}</span>
                      <button type='button'
                        onClick={() => {
                          deleteImage(url)
                          setImageUrls(imageUrls.filter((_, j) => j !== i))
                        }}
                        className='text-red-500 hover:text-red-700'>✕</button>
                    </div>
                  ))}
                </div>

                <form.Field name="categoria_id">
                  {(field) => (
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      className='border rounded px-3 py-2'
                    >
                    <option value={0}>Seleccionar categoría</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                    </select>
                  )}
                </form.Field>

                {/*Ingredientes con cantidad/unidad/removible*/}
                <div className='flex flex-col gap-2'>
                  <label className='font-medium text-sm'>Ingredientes</label>
                  <select
                    value={0}
                    onChange={(e) => {
                      const id = Number(e.target.value)
                      if (id && !ingredientesSeleccionados.some((i) => i.ingrediente_id === id)) {
                        setIngredientesSeleccionados([
                          ...ingredientesSeleccionados,
                          { ingrediente_id: id, cantidad: 1, unidad_medida_id: unidadesMedida?.[0]?.id ?? 0, es_removible: false },
                        ])
                      }
                    }}
                    className='border rounded px-3 py-2'
                  >
                    <option value={0}>Agregar ingrediente...</option>
                    {ingredients
                      ?.filter((ing) => !ingredientesSeleccionados.some((i) => i.ingrediente_id === ing.id))
                      .map((ing) => (
                        <option key={ing.id} value={ing.id}>{ing.nombre}</option>
                      ))}
                  </select>

                  {ingredientesSeleccionados.map((item, i) => {
                    const ingrediente = ingredients?.find((ing) => ing.id === item.ingrediente_id)
                    return (
                      <div key={item.ingrediente_id} className='border rounded p-2 flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm font-medium'>{ingrediente?.nombre}</span>
                          <button type='button'
                            onClick={() => setIngredientesSeleccionados(ingredientesSeleccionados.filter((_, j) => j !== i))}
                            className='text-red-500 hover:text-red-700 text-sm'>✕</button>
                        </div>
                        <div className='flex gap-2'>
                          <input
                            type='number'
                            step='0.01'
                            placeholder='Cantidad'
                            value={item.cantidad}
                            onChange={(e) => {
                              const updated = [...ingredientesSeleccionados]
                              updated[i] = { ...item, cantidad: Number(e.target.value) }
                              setIngredientesSeleccionados(updated)
                            }}
                            className='border rounded px-2 py-1 flex-1 text-sm'
                          />
                          <select
                            value={item.unidad_medida_id}
                            onChange={(e) => {
                              const updated = [...ingredientesSeleccionados]
                              updated[i] = { ...item, unidad_medida_id: Number(e.target.value) }
                              setIngredientesSeleccionados(updated)
                            }}
                            className='border rounded px-2 py-1 flex-1 text-sm'
                          >
                            {unidadesMedida?.map((u) => (
                              <option key={u.id} value={u.id}>{u.simbolo}</option>
                            ))}
                          </select>
                        </div>
                        <label className='flex items-center gap-2 text-sm'>
                          <input
                            type='checkbox'
                            checked={item.es_removible}
                            onChange={(e) => {
                              const updated = [...ingredientesSeleccionados]
                              updated[i] = { ...item, es_removible: e.target.checked }
                              setIngredientesSeleccionados(updated)
                            }}
                          />
                          Removible
                        </label>
                      </div>
                    )
                  })}
                </div>

                <div className='flex justify-end gap-2'>
                  <button
                    type='button'
                    onClick={() => {setOpen(false); setEditingProduct(null)}}
                    className='px-4 py-2 rounded border hover:bg-gray-100'>
                      Cancelar
                  </button>
                  <button
                    type='submit'
                    disabled={isPending || isUpdating}
                    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'>
                    {(isPending || isUpdating) ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}