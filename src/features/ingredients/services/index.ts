import axios from 'axios'
import type { Ingredient, CreateIngredientDto, UnidadMedida, ProductoIngrediente, AsignarIngredienteDto, UpdateProductoIngredienteDto } from '../types'
import { api } from '@/shared/lib/axios';

export const fetchIngredients = async (): Promise<Ingredient[]> => {
  const { data } = await api.get<{ data: Ingredient[]; total: number }>('/ingredientes/')
  return data.data
}

export const createIngredient = async (body: CreateIngredientDto): Promise<Ingredient> => {
  const { data } = await api.post('/ingredientes/', body)
  return data
}

export const updateIngredient = async (id: number, body: Partial<CreateIngredientDto>): Promise<Ingredient> => {
  const { data } = await api.patch('/ingredientes/' + id, body)
  return data
}

export const deleteIngredient = async (id: number): Promise<void> => {
  await api.delete('/ingredientes/' + id)
}

export const fetchUnidadesMedida = async (): Promise<UnidadMedida[]> => {
  const { data } = await api.get<{ data: UnidadMedida[]; total: number }>('/unidades-medida/')
  return data.data
}

export const fetchProductoIngredientes = async (productoId: number): Promise<ProductoIngrediente[]> => {
  const { data } = await api.get<{ data: ProductoIngrediente[]; total: number }>('/ingredientes/producto-ingrediente/producto/' + productoId)
  return data.data
}

export const assignIngrediente = async (body: AsignarIngredienteDto): Promise<ProductoIngrediente> => {
  const { data } = await api.post('/ingredientes/producto-ingrediente', body)
  return data
}

export const updateProductoIngrediente = async (ingredienteId: number, productoId: number, body: UpdateProductoIngredienteDto): Promise<ProductoIngrediente> => {
  const { data } = await api.patch('/ingredientes/producto-ingrediente/' + ingredienteId + '/' + productoId, body)
  return data
}

export const removeProductoIngrediente = async (ingredienteId: number, productoId: number): Promise<void> => {
  await api.delete('/ingredientes/producto-ingrediente/' + ingredienteId + '/' + productoId)
}