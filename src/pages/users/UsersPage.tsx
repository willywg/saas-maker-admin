import { useState } from "react"
import { Link } from 'react-router'
import { useUsers, useToggleUserStatus } from "@/hooks/useUsers"
import { SearchInput } from "@/components/shared/SearchInput"
import { Pagination } from "@/components/shared/Pagination"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
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
import { MoreHorizontal, Eye, Power } from "lucide-react"
import type { User } from "@/types/api"

export function UsersPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    user: User | null
  }>({ open: false, user: null })

  const { data, isLoading } = useUsers({ search, page, limit: 20 })
  const toggleStatus = useToggleUserStatus()

  const handleToggleStatus = () => {
    if (!confirmDialog.user) return
    toggleStatus.mutate(
      {
        id: confirmDialog.user.id,
        isActive: !confirmDialog.user.is_active,
      },
      {
        onSuccess: () => setConfirmDialog({ open: false, user: null }),
      }
    )
  }

  const totalPages = data ? Math.ceil(data.total / 20) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona todos los usuarios del sistema
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-72">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Buscar usuarios..."
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Organización</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.full_name || "-"}</TableCell>
                  <TableCell>
                    {user.organization ? (
                      <Link
                        to={`/organizations/${user.organization.id}`}
                        className="text-primary hover:underline"
                      >
                        {user.organization.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
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
                            setConfirmDialog({ open: true, user })
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
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, user: open ? confirmDialog.user : null })
        }
        title={
          confirmDialog.user?.is_active
            ? "Desactivar usuario"
            : "Activar usuario"
        }
        description={
          confirmDialog.user?.is_active
            ? `¿Estás seguro de desactivar "${confirmDialog.user?.email}"? No podrá acceder al sistema.`
            : `¿Estás seguro de activar "${confirmDialog.user?.email}"?`
        }
        confirmLabel={confirmDialog.user?.is_active ? "Desactivar" : "Activar"}
        onConfirm={handleToggleStatus}
        isLoading={toggleStatus.isPending}
        variant={confirmDialog.user?.is_active ? "destructive" : "default"}
      />
    </div>
  )
}
