import { useCategories } from '@/features/categories/hooks/useCategories'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import type { Category } from '../types'


export default function CategoriesPage() {
    const [open, setOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const {data, isLoading, error, mutate, isPending, update, isUpdating} = useCategories()

    const form = useForm({
        defaultValues: {nombre: '', descripcion: '', imagen_url: ''},
        onSubmit: async ({value}) => {
            if (editingCategory) {
                update({id: editingCategory.id, body: value})
            } else {
                mutate({...value, parent_id: null, imagen_url: value.imagen_url || null})
            }
            setOpen(false)
            setEditingCategory(null)
        },
    })

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        form.setFieldValue('nombre', category.nombre)
        form.setFieldValue('descripcion', category.descripcion)
        form.setFieldValue('imagen_url', category.imagen_url)
        setOpen(true)
    }

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar categorías</div>

    return(
        <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold'>Categorías</h1>
                <button
                    onClick={() => {form.reset(); setEditingCategory(null); setOpen(true) }}
                    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
                    >
                    Nueva Categoría
                </button>
            </div>

            <ul className='flex flex-col gap-2'>
                {data?.map((c) => (
                    <li key={c.id} className='border rounded p-4 flex justify-between items-center'>
                        <div>
                            <span className='font-medium'>{c.nombre}</span>
                            {c.descripcion && <p className='text-gray-500 text-sm'>{c.descripcion}</p>}
                        </div>
                        <button
                            onClick={() => handleEdit(c)}
                            className='text-sm border px-3 py-1 rounded hover:bg-gray-100'>Editar</button>
                    </li>
                ))}
            </ul>

            {open && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <h2 className='text-lg font-bold mb-4'>
                            {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                        </h2>
                        <form
                            onSubmit={(e) => { e.preventDefault(); form.handleSubmit()}}
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
                                <form.Field name="imagen_url">
                                    {(field) => (
                                        <input placeholder='URL de imágen' value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className='border rounded px-3 py-2' />
                                    )}
                                </form.Field>

                                <div className='flex justify-end gap-2'>
                                    <button type='button'
                                        onClick={() => {setOpen(false); setEditingCategory(null)}}
                                        className='px-4 py-2 rounded border hover:bg-gray-100'>
                                        Cancelar
                                    </button>
                                    <button type='submit' disabled={isPending || isUpdating}
                                        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled-opacity-50'>
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