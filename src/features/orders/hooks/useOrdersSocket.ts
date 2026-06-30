import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const WS_URL = import.meta.env.VITE_API_URL.replace(/^http/, 'ws') + '/pedidos_websocket/api/v1/cocina/ws'

export const useOrdersSocket = (queryKey: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = new WebSocket(WS_URL)

    socket.onmessage = () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    }

    return () => {
      socket.close()
    }
  }, [queryClient, queryKey])
}