export interface ResumenStats {
  ventas_hoy: string
  ticket_promedio: string
  pedidos_hoy: number
  mes_actual_ventas: string
}

export interface VentaPorPeriodo {
  periodo: string
  total_ventas: string
  cantidad_pedidos: number
  promedio_ventas: string | null
}

export interface ProductoMasVendido {
  producto: string
  total_ventas: string
  cantidad_pedidos: number
  promedio_ventas: string
}

export interface PedidosPorEstado {
  estado: string
  total_pedidos: number
}

export interface PedidosPorFormaPago {
  forma_pago: string
  total_pedidos: number
}