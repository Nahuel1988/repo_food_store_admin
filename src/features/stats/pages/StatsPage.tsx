import { useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts'
import {
  useResumen, useVentasPorPeriodo, useProductosMasVendidos,
  usePedidosPorEstado, usePedidosPorFormaPago
} from '../hooks/useStats'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function StatsPage() {
  const [desde, setDesde] = useState('2026-06-01')
  const [hasta, setHasta] = useState('2026-06-30')
  const [agrupacion, setAgrupacion] = useState('day')

  const { data: resumen } = useResumen()
  const { data: ventasPeriodo, isLoading: loadingVentas } = useVentasPorPeriodo(desde, hasta, agrupacion)
  const { data: productosTop } = useProductosMasVendidos()
  const { data: pedidosEstado } = usePedidosPorEstado()
  const { data: pedidosFormaPago } = usePedidosPorFormaPago()

  return (
    <div className='p-6 flex flex-col gap-8'>
      <h1 className='text-2xl font-bold'>Estadísticas</h1>

      <div className='grid grid-cols-4 gap-4'>
        <div className='bg-white border rounded-lg p-4 shadow-sm'>
          <p className='text-sm text-gray-500'>Ventas hoy</p>
          <p className='text-2xl font-bold'>${resumen?.ventas_hoy ?? '-'}</p>
        </div>
        <div className='bg-white border rounded-lg p-4 shadow-sm'>
          <p className='text-sm text-gray-500'>Pedidos hoy</p>
          <p className='text-2xl font-bold'>{resumen?.pedidos_hoy ?? '-'}</p>
        </div>
        <div className='bg-white border rounded-lg p-4 shadow-sm'>
          <p className='text-sm text-gray-500'>Ticket promedio</p>
          <p className='text-2xl font-bold'>${resumen ? Number(resumen.ticket_promedio).toFixed(2) : '-'}</p>
        </div>
        <div className='bg-white border rounded-lg p-4 shadow-sm'>
          <p className='text-sm text-gray-500'>Ventas del mes</p>
          <p className='text-2xl font-bold'>${resumen?.mes_actual_ventas ?? '-'}</p>
        </div>
      </div>

      <div className='bg-white border rounded-lg p-4 shadow-sm'>
        <h2 className='text-lg font-bold mb-4'>Ventas por periodo</h2>
        <div className='flex gap-2 mb-4'>
          <input type='date' value={desde} onChange={(e) => setDesde(e.target.value)} className='border rounded px-3 py-2 text-sm' />
          <input type='date' value={hasta} onChange={(e) => setHasta(e.target.value)} className='border rounded px-3 py-2 text-sm' />
          <select value={agrupacion} onChange={(e) => setAgrupacion(e.target.value)} className='border rounded px-3 py-2 text-sm'>
            <option value='day'>Día</option>
            <option value='week'>Semana</option>
            <option value='month'>Mes</option>
            <option value='year'>Año</option>
          </select>
        </div>
        {loadingVentas ? <p>Cargando...</p> : (
          <ResponsiveContainer width='100%' height={250}>
            <LineChart data={ventasPeriodo?.map((v) => ({ ...v, total_ventas: Number(v.total_ventas) }))}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='periodo' tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(val) => `$${val}`} />
              <Legend />
              <Line type='monotone' dataKey='total_ventas' name='Ventas' stroke='#3b82f6' dot={false} />
              <Line type='monotone' dataKey='cantidad_pedidos' name='Pedidos' stroke='#22c55e' dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className='bg-white border rounded-lg p-4 shadow-sm'>
        <h2 className='text-lg font-bold mb-4'>Productos más vendidos</h2>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={productosTop?.map((p) => ({ ...p, total_ventas: Number(p.total_ventas) }))}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='producto' tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip formatter={(val) => `$${val}`} />
            <Bar dataKey='total_ventas' name='Ventas' fill='#3b82f6' />
            <Bar dataKey='cantidad_pedidos' name='Pedidos' fill='#22c55e' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-white border rounded-lg p-4 shadow-sm'>
          <h2 className='text-lg font-bold mb-4'>Pedidos por estado</h2>
          <ResponsiveContainer width='100%' height={220}>
            <PieChart>
              <Pie data={pedidosEstado} dataKey='total_pedidos' nameKey='estado'
               label={(props: any) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}>
                {pedidosEstado?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white border rounded-lg p-4 shadow-sm'>
          <h2 className='text-lg font-bold mb-4'>Pedidos por forma de pago</h2>
          <ResponsiveContainer width='100%' height={220}>
            <PieChart>
              <Pie data={pedidosFormaPago} dataKey='total_pedidos' nameKey='forma_pago'
                label={(props: any) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}>
                {pedidosFormaPago?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}