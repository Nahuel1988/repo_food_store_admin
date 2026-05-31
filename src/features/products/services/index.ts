import axios from 'axios' //Libreria para requests HTTP
import type { CreateProductDto, Product } from '../types'

const api = axios.create({ baseURL: '/api' }) //Configura "/api" como la URL base del backend

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<{data: Product[]; total: number}>('/productos')
  return data.data //Un data de axios y el otro es lo que el backend pone en el body
}

export const createProduct = async (body: CreateProductDto): Promise<Product> => {
  const {data} = await api.post('/productos', body)
  return data
}

export const updateProduct = async (id: number, body: Partial<CreateProductDto>): Promise<Product> => { //Partial convierte todos los campos en opcionales
  const {data} = await api.patch('/productos/' + id, body)
  return data
}