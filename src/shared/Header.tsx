import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/features/auth/services'

export const Header = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate: handleLogout } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear()   // limpia todo el caché
            navigate('/login')
        },
    })

    return(
        <header className="bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">🍔 Food Store</h1>
            <button
                onClick={() => handleLogout()}
                className="text-sm text-white border border-white px-3 py-1 rounded hover:bg-gray-700">
                Cerrar sesión
            </button>
        </header>
    )
}