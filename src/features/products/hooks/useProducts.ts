import { useEffect, useState } from 'react'
import type { Product } from '../types'
import { fetchProducts } from '../services'

export const useProducts = () => {
  const [items, setItems] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchProducts()
      .then((data) => setItems(data))
      .finally(() => setLoading(false))
  }, [])

  return { items, loading }
}
