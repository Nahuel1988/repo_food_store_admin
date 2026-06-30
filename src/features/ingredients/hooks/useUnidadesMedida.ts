import { useQuery } from '@tanstack/react-query'
import { fetchUnidadesMedida } from '../services'

export const useUnidadesMedida = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['unidades-medida'],
    queryFn: fetchUnidadesMedida,
  })
  return { data, isLoading, error }
}