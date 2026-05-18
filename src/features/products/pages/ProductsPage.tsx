import React from 'react'
import { useProducts } from '../hooks/useProducts'

const ProductsPage: React.FC = () => {
  const { items, loading } = useProducts()

  if (loading) return <div>Cargando...</div>
  if (!items) return <div>No hay productos</div>

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {items.map((p) => (
          <li key={p.id}>{p.name} — ${p.price}</li>
        ))}
      </ul>
    </div>
  )
}

export default ProductsPage
