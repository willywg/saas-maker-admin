import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type {
  OrganizationDetail,
  OrganizationListItem,
  OrganizationUpdateRequest,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api"

export function useOrganizations(params: PaginationParams = {}) {
  return useQuery({
    queryKey: ["admin", "organizations", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<OrganizationListItem>>(
        "/admin/organizations",
        { params }
      )
      return data
    },
  })
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ["admin", "organizations", id],
    queryFn: async () => {
      const { data } = await apiClient.get<OrganizationDetail>(
        `/admin/organizations/${id}`
      )
      return data
    },
    enabled: !!id,
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: OrganizationUpdateRequest
    }) => {
      const response = await apiClient.put(`/admin/organizations/${id}`, data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations", id] })
    },
  })
}

export function useDeactivateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/organizations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] })
    },
  })
}

export function useToggleOrganizationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiClient.patch(`/admin/organizations/${id}/status`, {
        is_active: isActive,
      })
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations", id] })
    },
  })
}
