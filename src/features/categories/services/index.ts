import axios from 'axios'
import type { Category, CreateCategoryDto } from '../types';

const api = axios.create({ baseURL: '/api' })

export const fetchCategories = async (): Promise<Category[]> =>{
  const {data} = await api.get<{data: Category[]; total: number}>('/categorias/')
  return data.data
}

export const createCategory = async (body: CreateCategoryDto): Promise<Category> => {
  const {data} = await api.post('/categorias', body)
  return data
}

export const updateCategory = async (id: number, body: Partial<CreateCategoryDto>): Promise<Category> => {
  const {data} = await api.patch('/categorias/' + id, body)
  return data
}