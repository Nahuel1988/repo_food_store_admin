import { useKitchenOrders } from '../hooks/useKitchenOrders'
import { useOrdersSocket } from '../hooks/useOrdersSocket'

const NEXT_STATE_COCINA: Record<string, string | null> = {
  PENDIENTE: null,
  CONFIRMADO: 'EN_PREP',
  EN_PREP: 'EN_CAMINO',
  EN_CAMINO: null,
  ENTREGADO: null,
  CANCELADO: null,
}

export default function KitchenPage() {
  const { data, isLoading, error, update, isUpdating } = useKitchenOrders()
  useOrdersSocket('kitchen-orders')

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar pedidos</div>

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Cocina</h1>

      <ul className='flex flex-col gap-2'>
        {data?.map((o) => {
          const nextState = NEXT_STATE_COCINA[o.estado_codigo]
          return (
            <li key={o.id} className='border rounded p-4 flex justify-between items-center'>
              <div>
                <span className='font-medium'>Pedido #{o.id}</span>
                <span className='ml-3 text-sm font-medium text-blue-600'>{o.estado_codigo}</span>
                {o.notas && <p className='text-gray-500 text-sm'>{o.notas}</p>}
              </div>
              {nextState && (
                <button
                  disabled={isUpdating}
                  onClick={() => update({ id: o.id, body: { nuevo_estado: nextState } })}
                  className='text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50'>
                  → {nextState}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}