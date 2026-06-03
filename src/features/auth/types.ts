export interface User{
    id: number
    nombre: string
    apellido: string
    email: string
    celular: string
    created_at: string
    updated_at: string
}

export interface Role{
    codigo: string
    nombre: string
    descripcion: string
}