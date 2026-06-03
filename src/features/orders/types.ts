export interface Order {
  id: number
  usuario_id: number
  direccion_id: number
  estado_codigo: string
  forma_pago_codigo: string
  subtotal: string
  descuento: string
  total: string
  notas: string
  is_active: boolean
}

export interface UpdateOrderDto {
  estado_codigo: string
}