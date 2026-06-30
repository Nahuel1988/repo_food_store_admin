export interface Order {
  id: number
  usuario_id: number | null
  direccion_id: number | null
  estado_codigo: string
  forma_pago_codigo: string
  subtotal: string
  descuento: string
  total: string
  notas: string | null
  is_active: boolean
}

export interface UpdateOrderDto {
  nuevo_estado: string
  motivo?: string
}