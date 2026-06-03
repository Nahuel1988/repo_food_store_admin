import { useQuery } from "@tanstack/react-query"
import { getMe, getRoles } from "../services"

export const useAuth = () => {
    const {data: user, isLoading: isLoadingUser} = useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        retry: false, //Si falla el login no reintenta
    })
    
    const {data: roles, isLoading: isLoadingRoles} = useQuery({
    queryKey: ['roles', user?.id], //Incluye el id en la key, si el usuario cambia, se trata como un caché distinto
    queryFn: () => getRoles(user!.id), //Función flecha para pasar el id
    enabled: !!user, //!! convierte user a booleano. Si hay user, el query se ejecuta
    retry: false
    })

    return{
        user,
        roles,
        isLoading: isLoadingUser || isLoadingRoles, //Si cualquiera de los dos está cargando, es true
    }
}