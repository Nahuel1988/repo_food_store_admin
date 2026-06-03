import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createIngredient, fetchIngredients, updateIngredient, deleteIngredient } from '../services'
import type { CreateIngredientDto } from '../types'

export const useIngredients = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['ingredients'],
    queryFn: fetchIngredients,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<CreateIngredientDto> }) =>
      updateIngredient(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })

  const { mutate: remove, isPending: isDeleting } = useMutation ({
    mutationFn: (id: number) => deleteIngredient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients']})
    },
  })

  return { data, isLoading, error, mutate, isPending, update, isUpdating, remove, isDeleting }
}