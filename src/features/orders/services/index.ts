import { api } from '@/shared/lib/axios'
import type { Order, UpdateOrderDto } from '../types'

export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<{ data: Order[]; total: number }>('/pedidos/')
  return data.data
}

export const updateOrder = async (id: number, body: UpdateOrderDto): Promise<Order> => {
  const { data } = await api.patch('/pedidos/' + id, body)
  return data
}