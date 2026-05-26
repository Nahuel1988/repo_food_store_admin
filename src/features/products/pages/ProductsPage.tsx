import { useProducts } from '../hooks/useProducts'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Product } from '../types'
import { useCategories } from '@/features/categories/hooks/useCategories'

export default function ProductsPage() {
  const [open, setOpen] = useState(false)
  const { data, isLoading, error, mutate, isPending, update, isUpdating } = useProducts()
  const {data: categories} = useCategories()

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const form = useForm({
    defaultValues: {nombre: '', precio_base: 0, descripcion: '', categoria_id: 0},
    onSubmit: async({value}) => {
      if (editingProduct) {
        update({id: editingProduct.id, body:value})
      } else {
        mutate({
          ...value,
          imagenes_url: [],
          disponible: true,
          stock_cantidad: 0,
          ingrediente_ids: [],
      })
      }
      setOpen(false)
      setEditingProduct(null)
    },
  })

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    form.setFieldValue('nombre', product.nombre)
    form.setFieldValue('precio_base', product.precio_base)
    form.setFieldValue('descripcion', product.descripcion ?? '')
    form.setFieldValue('categoria_id', product.categoria_id)
    setOpen(true)
  }

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar productos</div>

  return(
    <>
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Productos</h1>
        <button
          onClick={() => {
            form.reset()
            setEditingProduct(null)
            setOpen(true)
          }}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
            Nuevo producto
          </button>
      </div>
      
      <ul className='flex flex-col gap-2'>
        {data?.map((p) => (
          <li key={p.id} className='border rounded p-4 flex justify-between items-center'>
            <div>
              <span className='font-medium'>{p.nombre}</span> - ${p.precio_base}
              {p.descripcion && <p className='text-gray-500 text-sm'>{p.descripcion}</p>}
            </div>
            <button
              onClick={() => handleEdit(p)}
              className='text-sm border px-3 py-1 rounded hover:bg-gray-100'>Editar</button>
          </li>
        ))}
      </ul>

      {open && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-lg font-bold mb-4'>
              {editingProduct ? 'Editar producto' : 'Nuevo Producto'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
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