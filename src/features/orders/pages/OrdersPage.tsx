import { useOrders } from '../hooks/useOrders'

const NEXT_STATE: Record<string, string | null> = {
  PENDIENTE: 'CONFIRMADO',
  CONFIRMADO: 'EN_PREP',
  EN_PREP: 'EN_CAMINO',
  EN_CAMINO: 'ENTREGADO',
  ENTREGADO: null,
  CANCELADO: null,
}

export default function OrdersPage() {
  const { data, isLoading, error, update, isUpdating } = useOrders()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar pedidos</div>

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Pedidos</h1>

      <ul className='flex flex-col gap-2'>
        {data?.map((o) => {
          const nextState = NEXT_STATE[o.estado_codigo]
          return (
            <li key={o.id} className='border rounded p-4 flex justify-between items-center'>
              <div>
                <span className='font-medium'>Pedido #{o.id}</span>
                <span className='ml-3 text-sm text-gray-500'>Total: ${o.total}</span>
                <span className='ml-3 text-sm font-medium text-blue-600'>{o.estado_codigo}</span>
                {o.notas && <p className='text-gray-500 text-sm'>{o.notas}</p>}
              </div>
              <div className='flex gap-2'>
                {nextState && (
                  <button
                    disabled={isUpdating}
                    onClick={() => update({ id: o.id, body: { estado_codigo: nextState } })}
                    className='text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50'>
                    → {nextState}
                  </button>
                )}
                {o.estado_codigo !== 'CANCELADO' && o.estado_codigo !== 'ENTREGADO' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => update({ id: o.id, body: { estado_codigo: 'CANCELADO' } })}
                    className='text-sm border px-3 py-1 rounded text-red-600 hover:bg-red-50 disabled:opacity-50'>
                    Cancelar
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}