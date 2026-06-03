import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminLayout from '@/shared/layouts/AdminLayout'
import ProductsPage from "@/features/products/pages/ProductsPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import IngredientsPage from "@/features/ingredients/pages/IngredientsPage";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import LoginPage from "@/features/auth/pages/LoginPage";

const router = createBrowserRouter([
  {
    path: '/', //Ruta padre
    element: <ProtectedRoute/>,
    children:[
      { element: <AdminLayout/>, children:[
        {index: true, element: <Navigate to="/products" replace/>}, //Redirige a productos cuando la URL es "/"
        {
          path: 'products',
          element: <ProtectedRoute roles={['ADMIN']}/>,
          children:[{index: true, element: <ProductsPage/>}]
        },
        {
          path: 'categories',
          element: <ProtectedRoute roles={['ADMIN']}/>,
          children:[{index: true, element: <CategoriesPage/>}]
        },
        {
          path: 'ingredients',
          element: <ProtectedRoute roles={['ADMIN']}/>,
          children:[{index: true, element: <IngredientsPage/>}]
        },
      ]}
    ],
  },
  {path: '/login', element: <LoginPage/>}
])

export default function AppRouter() {
  return <RouterProvider router={router}/>
}