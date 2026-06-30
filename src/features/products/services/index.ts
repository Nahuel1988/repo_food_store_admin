import axios from 'axios' //Libreria para requests HTTP
import type { CreateProductDto, Product } from '../types'
import { api } from '@/shared/lib/axios' //Ahora se importa la instancia compartida

//const api = axios.create({ baseURL: '/api' }) <-- Asi estaba antes en cada service

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<{data: Product[]; total: number}>('/productos/')
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

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete('/productos/' + id)
}

export const uploadImage = async (file: File): Promise<{ url: string; public_id: string }> => {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/api/v1/upload/', form)
  return data
}

export const deleteImage = async (url: string): Promise<void> => {
  await api.delete('/api/v1/upload/', { params: { url } })
}