import { useQuery } from '@tanstack/react-query'
import { fetchResumen, fetchVentasPorPeriodo, fetchProductosMasVendidos, fetchPedidosPorEstado, fetchPedidosPorFormaPago } from '../services'

export const useResumen = () => {
  return useQuery({ queryKey: ['stats-resumen'], queryFn: fetchResumen })
}

export const useVentasPorPeriodo = (desde: string, hasta: string, agrupacion: string) => {
  return useQuery({
    queryKey: ['stats-ventas-periodo', desde, hasta, agrupacion],
    queryFn: () => fetchVentasPorPeriodo(desde, hasta, agrupacion),
  })
}

export const useProductosMasVendidos = () => {
  return useQuery({ queryKey: ['stats-productos-top'], queryFn: fetchProductosMasVendidos })
}

export const usePedidosPorEstado = () => {
  return useQuery({ queryKey: ['stats-pedidos-estado'], queryFn: fetchPedidosPorEstado })
}

export const usePedidosPorFormaPago = () => {
  return useQuery({ queryKey: ['stats-pedidos-forma-pago'], queryFn: fetchPedidosPorFormaPago })
}