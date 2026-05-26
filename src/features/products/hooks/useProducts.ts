import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, fetchProducts, updateProduct } from '../services'
import type { CreateProductDto } from '../types'

export const useProducts = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<CreateProductDto> }) =>
      updateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return { data, isLoading, error, mutate, isPending, update, isUpdating }
}