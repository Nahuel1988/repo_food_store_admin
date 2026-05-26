import axios from 'axios'
import type { CreateProductDto, Product } from '../types'

const api = axios.create({ baseURL: '/api' })

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<{data: Product[]; total: number}>('/productos')
  return data.data
}

export const createProduct = async (body: CreateProductDto): Promise<Product> => {
  const {data} = await api.post('/productos', body)
  return data
}

export const updateProduct = async (id: number, body: Partial<CreateProductDto>): Promise<Product> => {
  const {data} = await api.patch('/productos/' + id, body)
  return data
}