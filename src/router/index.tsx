import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminLayout from '@/shared/layouts/AdminLayout'
import ProductsPage from "@/features/products/pages/ProductsPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout/>,
    children:[
      {index: true, element: <Navigate to="/products" replace/>},
      {path: 'products', element: <ProductsPage/>},
      {path: 'categories', element: <CategoriesPage/>},
      {path: 'ingredients', element: <div className="p-6">Ingredientes</div>},
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router}/>
}