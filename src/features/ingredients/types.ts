export interface Ingredient {
  id: number
  nombre: string
  descripcion: string
  es_alergeno: boolean
  is_active: boolean
  producto_ids: number[]
}

export interface CreateIngredientDto {
  nombre: string
  descripcion: string
  es_alergeno: boolean
  producto_ids: number[]
}