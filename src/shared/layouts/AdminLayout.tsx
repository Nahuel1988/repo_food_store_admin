import { NavLink, Outlet } from 'react-router-dom'
import { Header } from '../Header'

const links = [
  { to: '/products', label: 'Productos' },
  { to: '/categories', label: 'Categorías' },
  { to: '/ingredients', label: 'Ingredientes' },
  { to: '/orders', label: 'Pedidos' },
  { to: '/kitchen', label: 'Cocina' }
]

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <aside className="w-56 bg-gray-900 text-white flex flex-col p-4 gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-800'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
