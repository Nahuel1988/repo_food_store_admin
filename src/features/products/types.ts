export interface Product {
  id: number
  nombre: string
  descripcion?: string
  precio_base: number
  imagenes_url: string[]
  disponible: boolean
  is_active: boolean
  ingrediente_ids: number[]
  categoria_id: number
}

export interface CreateProductDto {
  nombre: string
  descripcion: string
  precio_base: number
  imagenes_url: string[]
  stock_cantidad: number
  disponible: boolean
  categoria_id: number
  ingrediente_ids: number[]
}