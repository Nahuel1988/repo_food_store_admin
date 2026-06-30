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

export interface UnidadMedida {
  id: number
  nombre: string
  simbolo: string
  tipo: string
}

export interface ProductoIngrediente {
  ingrediente_id: number
  producto_id: number
  cantidad: string
  unidad_medida_id: number
  es_removible: boolean
}

export interface AsignarIngredienteDto {
  producto_id: number
  ingrediente_id: number
  cantidad: number
  unidad_medida_id: number
  es_removible: boolean
}

export interface UpdateProductoIngredienteDto {
  cantidad: number
  unidad_medida_id: number
  es_removible: boolean
}