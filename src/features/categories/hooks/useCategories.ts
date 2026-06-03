import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCategory, fetchCategories, updateCategory, deleteCategory } from '../services'
import type { CreateCategoryDto } from '../types'

export const useCategories = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<CreateCategoryDto> }) =>
      updateCategory(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories']})
    }
  })

  return { data, isLoading, error, mutate, isPending, update, isUpdating, remove, isDeleting }
}