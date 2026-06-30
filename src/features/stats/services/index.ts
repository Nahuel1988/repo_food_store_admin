import { api } from '@/shared/lib/axios'
import type { ResumenStats, VentaPorPeriodo, ProductoMasVendido, PedidosPorEstado, PedidosPorFormaPago } from '../types'

export const fetchResumen = async (): Promise<ResumenStats> => {
  const { data } = await api.get<ResumenStats>('/estadisticas/resumen/')
  return data
}

export const fetchVentasPorPeriodo = async (desde: string, hasta: string, agrupacion: string): Promise<VentaPorPeriodo[]> => {
  const { data } = await api.get<VentaPorPeriodo[]>('/estadisticas/ventas-por-periodo/', { params: { desde, hasta, agrupacion } })
  return data
}

export const fetchProductosMasVendidos = async (): Promise<ProductoMasVendido[]> => {
  const { data } = await api.get<ProductoMasVendido[]>('/estadisticas/productos-mas-vendidos/')
  return data
}

export const fetchPedidosPorEstado = async (): Promise<PedidosPorEstado[]> => {
  const { data } = await api.get<PedidosPorEstado[]>('/estadisticas/pedidos-por-estado/')
  return data
}

export const fetchPedidosPorFormaPago = async (): Promise<PedidosPorFormaPago[]> => {
  const { data } = await api.get<PedidosPorFormaPago[]>('/estadisticas/pedidos-por-forma-pago/')
  return data
}