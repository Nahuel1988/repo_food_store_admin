import axios from 'axios'
import type { Ingredient, CreateIngredientDto } from '../types'

const api = axios.create({ baseURL: '/api' })

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