import { useProducts } from '../hooks/useProducts'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Product } from '../types'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useIngredients } from '@/features/ingredients/hooks/useIngredients'

export default function ProductsPage() {
  const [open, setOpen] = useState(false) //Modal visible o no
  //Trae datos de productos, categorias e ingredientes
  const { data, isLoading, error, mutate, isPending, update, isUpdating, remove, isDeleting } = useProducts()
  const { data: categories } = useCategories()
  const { data: ingredients } = useIngredients()

  //Guarda el producto que se está editando
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)//Product = editar | null = crear

  const form = useForm({
    defaultValues: {nombre: '', precio_base: 0, descripcion: '', categoria_id: 0, ingrediente_ids: [] as number[]}, //Valores default (ingrediente_ids es array de numeros)
    onSubmit: async({value}) => { //value tiene todos los campos del form
      if (editingProduct) { //Si se está editando
        update({id: editingProduct.id, body:value}) //Patch
      } else { //Si está creando
        mutate({ //Post
          ...value, //Copia los campos de value y agrega los que faltan hardcodeados
          imagenes_url: [],
          disponible: true,
          stock_cantidad: 0,
        })
      }
      //Cierra modal y edición
      setOpen(false)
      setEditingProduct(null)
    },
  })

  const handleEdit = (product: Product) => { //Al editar
    setEditingProduct(product) //Guarda el producto en el state
    //Llena el form con los datos. setFieldValue actualiza cada campo en el estado del form
    form.setFieldValue('nombre', product.nombre)
    form.setFieldValue('precio_base', product.precio_base)
    form.setFieldValue('descripcion', product.descripcion ?? '') //Si no hay descripción guarda ''
    form.setFieldValue('categoria_id', product.categoria_id)
    form.setFieldValue('ingrediente_ids', product.ingrediente_ids)
    setOpen(true)
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
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
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
                <form.Field name="ingrediente_ids">
                  {(field) => (
                    <div className='flex flex-col gap-1 max-h-40 overflow-y-auto'>
                      <label className='font-medium text-sm'>Ingredientes</label>
                      {ingredients?.map((ing) => (
                        <label key={ing.id} className='flex items-center gap-2'>
                          <input
                            type='checkbox'
                            checked={field.state.value.includes(ing.id)} /*Verifica si el checkbox debe estar marcado*/
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.handleChange([...field.state.value, ing.id])
                              } else {
                                field.handleChange(field.state.value.filter((id) => id !== ing.id))
                              }
                            }}
                          />
                          {ing.nombre}
                          {ing.es_alergeno && <span className='text-xs text-red-500'>(alérgeno)</span>}
                        </label>
                      ))}
                    </div>
                  )}
                </form.Field>

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