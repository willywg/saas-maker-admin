import { useState } from "react"
import { useParams, Link } from 'react-router'
import { useUser, useToggleUserStatus } from "@/hooks/useUsers"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Power, Building2, Mail, User, Calendar } from "lucide-react"

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: user, isLoading } = useUser(id!)
  const toggleStatus = useToggleUserStatus()

  const handleToggleStatus = () => {
    if (!user) return
    toggleStatus.mutate(
      { id: user.id, isActive: !user.is_active },
      { onSuccess: () => setConfirmOpen(false) }
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Usuario no encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">
              {user.full_name || user.email}
            </h1>
            <StatusBadge isActive={user.is_active} />
          </div>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Button
          variant={user.is_active ? "destructive" : "default"}
          onClick={() => setConfirmOpen(true)}
        >
          <Power className="mr-2 h-4 w-4" />
          {user.is_active ? "Desactivar" : "Activar"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium capitalize">
              {user.memberships[0]?.role || "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Organización
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.memberships[0] ? (
              <Link
                to={`/organizations/${user.memberships[0].organization_id}`}
                className="font-medium text-primary hover:underline"
              >
                {user.memberships[0].organization_name}
              </Link>
            ) : (
              <p className="text-muted-foreground">Sin organización</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fecha de creación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {new Date(user.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {user.full_name && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información adicional</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">Nombre completo</dt>
                <dd className="font-medium">{user.full_name}</dd>
              </div>
              {user.last_login_at && (
                <div>
                  <dt className="text-sm text-muted-foreground">Último acceso</dt>
                  <dd className="font-medium">
                    {new Date(user.last_login_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={user.is_active ? "Desactivar usuario" : "Activar usuario"}
        description={
          user.is_active
            ? `¿Estás seguro de desactivar "${user.email}"? No podrá acceder al sistema.`
            : `¿Estás seguro de activar "${user.email}"?`
        }
        confirmLabel={user.is_active ? "Desactivar" : "Activar"}
        onConfirm={handleToggleStatus}
        isLoading={toggleStatus.isPending}
        variant={user.is_active ? "destructive" : "default"}
      />
    </div>
  )
}
