export interface Category {
  id: number
  nombre: string
  descripcion: string
  imagen_url: string
  parent_id: number
  is_active: boolean
}

export interface CreateCategoryDto {
  nombre: string
  descripcion: string
  imagen_url: string | null
  parent_id: number | null
}