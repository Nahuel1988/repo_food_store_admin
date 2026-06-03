import { api } from "@/shared/lib/axios"
import type { User, Role } from "../types"
import axios from 'axios'

const authApi = axios.create({ //Api propia de Auth
    baseURL: '/usuarios/api/v1',
    withCredentials: true,
})

export const login = async(username: string, password: string) => {
    const form = new FormData()
    //Mete nombre y contraseña en el FormData
    form.append('username', username)
    form.append('password', password)
    await authApi.post('/auth/token' , form)
}

export const getMe = async(): Promise<User> => { //Get del usuario
    const { data } = await authApi.get('/auth/me')
    return data
}

export const getRoles = async(usuarioId: number): Promise<Role[]> => { //Get de los roles
    const {data} = await api.get('/roles/usuarios/' + usuarioId)
    return data
}

export const logout = async() => { //Cierra la sesión. El back elimina la cookie
    await authApi.post('/auth/logout')
}