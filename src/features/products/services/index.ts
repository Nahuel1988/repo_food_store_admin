import axios from 'axios'
import type { Product } from '../types'

const api = axios.create({ baseURL: '/api' })

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/products')
  return data
}
