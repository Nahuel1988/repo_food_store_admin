import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchProductoIngredientes, assignIngrediente, updateProductoIngrediente, removeProductoIngrediente } from '../services'
import type { AsignarIngredienteDto, UpdateProductoIngredienteDto } from '../types'

export const useProductoIngredientes = (productoId?: number) => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['producto-ingredientes', productoId],
    queryFn: () => fetchProductoIngredientes(productoId as number),
    enabled: !!productoId, //la query solo se activa al editar un producto existente
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['producto-ingredientes', productoId] })

  const { mutate: assign, isPending: isAssigning } = useMutation({
    mutationFn: (body: AsignarIngredienteDto) => assignIngrediente(body),
    onSuccess: invalidate,
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ ingredienteId, productoId, body }: { ingredienteId: number; productoId: number; body: UpdateProductoIngredienteDto }) =>
      updateProductoIngrediente(ingredienteId, productoId, body),
    onSuccess: invalidate,
  })

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: ({ ingredienteId, productoId }: { ingredienteId: number; productoId: number }) =>
      removeProductoIngrediente(ingredienteId, productoId),
    onSuccess: invalidate,
  })

  return { data, isLoading, assign, isAssigning, update, isUpdating, remove, isRemoving }
}