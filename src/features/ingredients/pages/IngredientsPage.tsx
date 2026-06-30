import { useIngredients } from '../hooks/useIngredients'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Ingredient } from '../types'

export default function IngredientsPage() {
  const [open, setOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const { data, isLoading, error, mutate, isPending, update, isUpdating, remove, isDeleting } = useIngredients()

  const form = useForm({
    defaultValues: { nombre: '', descripcion: '', es_alergeno: false, stock_cantidad: 0 },
    onSubmit: async ({ value }) => {
      if (editingIngredient) {
        update({ id: editingIngredient.id, body: value })
      } else {
        mutate({ ...value, producto_ids: [] })
      }
      setOpen(false)
      setEditingIngredient(null)
    },
  })

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    form.setFieldValue('nombre', ingredient.nombre)
    form.setFieldValue('descripcion', ingredient.descripcion)
    form.setFieldValue('es_alergeno', ingredient.es_alergeno)
    form.setFieldValue('stock_cantidad', ingredient.stock_cantidad)
    setOpen(true)
  }

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar ingredientes</div>

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Ingredientes</h1>
        <button
          onClick={() => { form.reset(); setEditingIngredient(null); setOpen(true) }}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Nuevo Ingrediente
        </button>
      </div>

      <ul className='flex flex-col gap-2'>
        {data?.map((i) => (
          <li key={i.id} className='border rounded p-4 flex justify-between items-center'>
            <div>
              <span className='font-medium'>{i.nombre}</span>
              {i.es_alergeno && <span className='ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded'>Alérgeno</span>}
              {i.descripcion && <p className='text-gray-500 text-sm'>{i.descripcion}</p>}
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => handleEdit(i)}
                className='text-sm border px-3 py-1 rounded hover:bg-gray-100'>
                Editar
              </button>
              <button
                onClick={() => remove(i.id)}
                disabled={isDeleting}
                className='text-sm border px-3 py-1 rounded hover:bg-red-50 text-red-600 disabled:opacity-50'>
                  Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {open && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-lg font-bold mb-4'>
              {editingIngredient ? 'Editar ingrediente' : 'Nuevo ingrediente'}
            </h2>
            <form
              onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}
              className='flex flex-col gap-4'
            >
              <form.Field name="nombre">
                {(field) => (
                  <input placeholder='Nombre' value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className='border rounded px-3 py-2' />
                )}
              </form.Field>

              <form.Field name="descripcion">
                {(field) => (
                  <input placeholder='Descripción' value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className='border rounded px-3 py-2' />
                )}
              </form.Field>

              <form.Field name="stock_cantidad">
                {(field) => (
                  <input type='number' placeholder='Stock' value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className='border rounded px-3 py-2' />
                )}
              </form.Field>

              <form.Field name="es_alergeno">
                {(field) => (
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                    />
                    Es alérgeno
                  </label>
                )}
              </form.Field>

              <div className='flex justify-end gap-2'>
                <button type='button'
                  onClick={() => { setOpen(false); setEditingIngredient(null) }}
                  className='px-4 py-2 rounded border hover:bg-gray-100'>
                  Cancelar
                </button>
                <button type='submit' disabled={isPending || isUpdating}
                  className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'>
                  {(isPending || isUpdating) ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}