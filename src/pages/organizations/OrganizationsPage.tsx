import { useState } from "react"
import { Link } from "react-router-dom"
import { useOrganizations, useToggleOrganizationStatus } from "@/hooks/useOrganizations"
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
import type { Organization } from "@/types/api"

export function OrganizationsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    org: Organization | null
  }>({ open: false, org: null })

  const { data, isLoading } = useOrganizations({ search, page, limit: 20 })
  const toggleStatus = useToggleOrganizationStatus()

  const handleToggleStatus = () => {
    if (!confirmDialog.org) return
    toggleStatus.mutate(
      {
        id: confirmDialog.org.id,
        isActive: !confirmDialog.org.is_active,
      },
      {
        onSuccess: () => setConfirmDialog({ open: false, org: null }),
      }
    )
  }

  const totalPages = data ? Math.ceil(data.total / 20) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Organizaciones</h1>
        <p className="text-muted-foreground">
          Gestiona las organizaciones del sistema
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
            placeholder="Buscar organizaciones..."
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creación</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron organizaciones
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {org.slug}
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={org.is_active} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(org.created_at).toLocaleDateString("es-ES")}
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
                          <Link to={`/organizations/${org.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setConfirmDialog({ open: true, org })
                          }
                        >
                          <Power className="mr-2 h-4 w-4" />
                          {org.is_active ? "Desactivar" : "Activar"}
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
          setConfirmDialog({ open, org: open ? confirmDialog.org : null })
        }
        title={
          confirmDialog.org?.is_active
            ? "Desactivar organización"
            : "Activar organización"
        }
        description={
          confirmDialog.org?.is_active
            ? `¿Estás seguro de desactivar "${confirmDialog.org?.name}"? Los usuarios no podrán acceder.`
            : `¿Estás seguro de activar "${confirmDialog.org?.name}"?`
        }
        confirmLabel={confirmDialog.org?.is_active ? "Desactivar" : "Activar"}
        onConfirm={handleToggleStatus}
        isLoading={toggleStatus.isPending}
        variant={confirmDialog.org?.is_active ? "destructive" : "default"}
      />
    </div>
  )
}
