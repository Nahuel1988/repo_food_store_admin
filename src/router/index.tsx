import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminLayout from '@/shared/layouts/AdminLayout'
import ProductsPage from "@/features/products/pages/ProductsPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import IngredientsPage from "@/features/ingredients/pages/IngredientsPage";

const router = createBrowserRouter([
  {
    path: '/', //Ruta padre
    element: <AdminLayout/>,
    children:[
      {index: true, element: <Navigate to="/products" replace/>}, //Redirige a productos cuando la URL es "/"
      {path: 'products', element: <ProductsPage/>},
      {path: 'categories', element: <CategoriesPage/>},
      {path: 'ingredients', element: <IngredientsPage/>},
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router}/>
}