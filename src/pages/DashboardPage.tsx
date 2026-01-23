import { useDashboardStats } from "@/hooks/useUsers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, UserCheck, Building } from "lucide-react"

export function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  const statCards = [
    {
      title: "Organizaciones",
      value: stats?.total_organizations ?? 0,
      description: `${stats?.active_organizations ?? 0} activas`,
      icon: Building2,
    },
    {
      title: "Usuarios Totales",
      value: stats?.total_users ?? 0,
      description: `${stats?.active_users ?? 0} activos`,
      icon: Users,
    },
    {
      title: "Usuarios Activos",
      value: stats?.active_users ?? 0,
      description: "Con acceso al sistema",
      icon: UserCheck,
    },
    {
      title: "Orgs Activas",
      value: stats?.active_organizations ?? 0,
      description: "Operando actualmente",
      icon: Building,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general del sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
