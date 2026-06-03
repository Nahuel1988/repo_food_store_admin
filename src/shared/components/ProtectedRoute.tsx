import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({roles}: {roles?:string[]}) {
  const { user, roles: userRoles, isLoading } = useAuth() //Llama a /me para ver si hay sesión activa
  if (isLoading) return <div>Cargando...</div>
  if (!user) return <Navigate to="/login" replace/> //Si no hay usuario redirige a /login

  if (roles && !userRoles?.some((r) => roles.includes(r.codigo))){
    return <Navigate to="/login" replace/>
  }
  return <Outlet/> //Si hay usuario renderiza el Outlet
}