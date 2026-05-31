import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, fetchProducts, updateProduct } from '../services'
import type { CreateProductDto } from '../types'

export const useProducts = () => {
  const queryClient = useQueryClient() //Accede a QueryClient de App para poder llamar invalidateQueries

  const { data, isLoading, error } = useQuery({ //Maneja ciclo de vida de un fetch
    queryKey: ['products'], //Identificador del caché
    queryFn: fetchProducts, //Trae los datos
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }) //Actualiza el caché
    },
  })

  const { mutate: update, isPending: isUpdating } = useMutation({ //Renombra mutate e isPending
    mutationFn: ({ id, body }: { id: number; body: Partial<CreateProductDto> }) =>
      updateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }) //Actualiza el caché
    },
  })

  return { data, isLoading, error, mutate, isPending, update, isUpdating }
}