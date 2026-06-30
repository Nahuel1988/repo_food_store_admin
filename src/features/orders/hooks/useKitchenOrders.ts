import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchKitchenOrders, updateOrder } from '../services'
import type { UpdateOrderDto } from '../types'

export const useKitchenOrders = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({ queryKey: ['kitchen-orders'], queryFn: fetchKitchenOrders })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateOrderDto }) => updateOrder(id, body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] }) },
  })

  return { data, isLoading, error, update, isUpdating }
}