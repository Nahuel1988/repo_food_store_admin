import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRouter from '@/router'

const queryClient = new QueryClient() //Guarda datos de los fetch en caché
//Se crea una única vez cuando carga la app para no perder el caché

export default function App(){
  return( //Guarda queryClient en el contexto
    <QueryClientProvider client={queryClient}> {/*Cualquier componente dentro tiene acceso a sus funciones*/}
      <AppRouter/> {/*Importa las páginas del router y les da acceso a React Query*/}
    </QueryClientProvider>
  )
}