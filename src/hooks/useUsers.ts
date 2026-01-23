import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type {
  DashboardStats,
  PaginatedResponse,
  PaginationParams,
  UserDetail,
  UserListItem,
  UserUpdateRequest,
} from "@/types/api"

export interface UserPaginationParams extends PaginationParams {
  organization_id?: string
  limit?: number
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>("/admin/users/stats")
      return data
    },
  })
}

export function useUsers(params: UserPaginationParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<UserListItem>>(
        "/admin/users",
        { params }
      )
      return data
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: async () => {
      const { data } = await apiClient.get<UserDetail>(`/admin/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserUpdateRequest }) => {
      const response = await apiClient.put(`/admin/users/${id}`, data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] })
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiClient.patch(`/admin/users/${id}/status`, {
        is_active: isActive,
      })
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] })
    },
  })
}

export function useOrganizationUsers(
  organizationId: string,
  params: { page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["admin", "organizations", organizationId, "users", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<UserListItem>>(
        `/admin/organizations/${organizationId}/users`,
        { params }
      )
      return data
    },
    enabled: !!organizationId,
  })
}
