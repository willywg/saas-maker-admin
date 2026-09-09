import { useState } from "react"
import { useParams, Link } from 'react-router'
import { useOrganization, useToggleOrganizationStatus } from "@/hooks/useOrganizations"
import { useOrganizationUsers, useToggleUserStatus } from "@/hooks/useUsers"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Pagination } from "@/components/shared/Pagination"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, MoreHorizontal, Eye, Power } from "lucide-react"
import type { User } from "@/types/api"

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [page, setPage] = useState(1)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    type: "org" | "user"
    item: { id: string; name: string; is_active: boolean } | null
  }>({ open: false, type: "org", item: null })

  const { data: org, isLoading: orgLoading } = useOrganization(id!)
  const { data: usersData, isLoading: usersLoading } = useOrganizationUsers(
    id!,
    { page, limit: 10 }
  )
  const toggleOrgStatus = useToggleOrganizationStatus()
  const toggleUserStatus = useToggleUserStatus()

  const handleConfirm = () => {
    if (!confirmDialog.item) return

    if (confirmDialog.type === "org") {
      toggleOrgStatus.mutate(
        { id: confirmDialog.item.id, isActive: !confirmDialog.item.is_active },
        { onSuccess: () => setConfirmDialog({ open: false, type: "org", item: null }) }
      )
    } else {
      toggleUserStatus.mutate(
        { id: confirmDialog.item.id, isActive: !confirmDialog.item.is_active },
        { onSuccess: () => setConfirmDialog({ open: false, type: "org", item: null }) }
      )
    }
  }

  const totalPages = usersData ? Math.ceil(usersData.total / 10) : 1

  if (orgLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Organización no encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/organizations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{org.name}</h1>
            <StatusBadge isActive={org.is_active} />
          </div>
          <p className="text-muted-foreground">/{org.slug}</p>
        </div>
        <Button
          variant={org.is_active ? "destructive" : "default"}
          onClick={() =>
            setConfirmDialog({
              open: true,
              type: "org",
              item: { id: org.id, name: org.name, is_active: org.is_active },
            })
          }
        >
          <Power className="mr-2 h-4 w-4" />
          {org.is_active ? "Desactivar" : "Activar"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fecha de creación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {new Date(org.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{usersData?.total ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {org.is_active ? "Activa" : "Inactiva"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-medium">Usuarios</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : usersData?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No hay usuarios en esta organización
                  </TableCell>
                </TableRow>
              ) : (
                usersData?.items.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name || "-"}</TableCell>
                    <TableCell className="capitalize">{user.organization?.role || "-"}</TableCell>
                    <TableCell>
                      <StatusBadge isActive={user.is_active} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/users/${user.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                type: "user",
                                item: {
                                  id: user.id,
                                  name: user.email,
                                  is_active: user.is_active,
                                },
                              })
                            }
                          >
                            <Power className="mr-2 h-4 w-4" />
                            {user.is_active ? "Desactivar" : "Activar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({
            open,
            type: confirmDialog.type,
            item: open ? confirmDialog.item : null,
          })
        }
        title={
          confirmDialog.item?.is_active
            ? `Desactivar ${confirmDialog.type === "org" ? "organización" : "usuario"}`
            : `Activar ${confirmDialog.type === "org" ? "organización" : "usuario"}`
        }
        description={
          confirmDialog.item?.is_active
            ? `¿Estás seguro de desactivar "${confirmDialog.item?.name}"?`
            : `¿Estás seguro de activar "${confirmDialog.item?.name}"?`
        }
        confirmLabel={confirmDialog.item?.is_active ? "Desactivar" : "Activar"}
        onConfirm={handleConfirm}
        isLoading={toggleOrgStatus.isPending || toggleUserStatus.isPending}
        variant={confirmDialog.item?.is_active ? "destructive" : "default"}
      />
    </div>
  )
}
