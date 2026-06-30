import { api } from '@/shared/lib/axios'
import type { Order, UpdateOrderDto } from '../types'

export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>('/pedidos_websocket/api/v1/cajero/pedidos')
  return data
}

export const fetchKitchenOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>('/pedidos_websocket/api/v1/cocina/pedidos')
  return data
}

export const updateOrder = async (id: number, body: UpdateOrderDto): Promise<Order> => {
  const { data } = await api.patch('/pedidos_websocket/api/v1/pedidos/' + id + '/estado', body)
  return data
}