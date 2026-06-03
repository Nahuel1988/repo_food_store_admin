import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
//import { useAuth } from '../hooks/useAuth'
import { login } from '../services'

export default function LoginPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {mutate, isPending, isError} = useMutation({
        mutationFn: ({username, password}: {username: string; password: string}) => //Agrupa username y password en un objeto
            login(username, password),
        onSuccess: () => {
            queryClient.clear()
            navigate('/')
        },
    })

    //const {data: roles} = useAuth()

    const form = useForm({
        defaultValues: {username: '', password: ''},
        onSubmit: async({value}) => {
            mutate(value)
        }
    })

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white rounded-lg p-8 w-full max-w-sm shadow'>
                <h1 className='text-2xl font-bold mb-6'>Iniciar sesión</h1>

                {isError && (
                    <p className='text-red-500 text-sm mb-4'>Email o contraseña incorrectos</p>
                )}

                <form
                    onSubmit={(e) => { e.preventDefault(); form.handleSubmit()}}
                    className='flex flex-col gap-4'
                    >
                        <form.Field name="username">
                            {(field) => (
                                <input type="email"
                                placeholder='Email'
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className='border rounded px-3 py-2'
                                />
                            )}
                        </form.Field>
                        <form.Field name="password">
                            {(field) => (
                                <input type="password"
                                placeholder='Contraseña'
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className='border rounded px-3 py-2'
                                />
                            )}
                        </form.Field>

                        <button
                            type='submit'
                            disabled={isPending}
                            className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
                            >
                                {isPending ? 'Ingresando...' : 'Ingresar'}
                        </button>
                </form>
            </div>
        </div>
    )
}