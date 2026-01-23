// --- Auth ---
export interface AdminLoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
  last_login_at: string | null
}

// --- Pagination ---
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PaginationParams {
  page?: number
  page_size?: number
  limit?: number
  search?: string
  is_active?: boolean
  sort_by?: string
  sort_order?: "asc" | "desc"
}

// --- Organizations ---
export interface OrganizationListItem {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
  member_count: number
}

// Alias for convenience
export type Organization = OrganizationListItem

export interface OrganizationMember {
  id: string
  email: string
  full_name: string | null
  role: string
  joined_at: string
}

export interface OrganizationDetail {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
  members: OrganizationMember[]
}

export interface OrganizationUpdateRequest {
  name?: string
  slug?: string
  is_active?: boolean
}

// --- Users ---
export interface UserOrganization {
  id: string
  name: string
  slug: string
  role: string
}

export interface UserListItem {
  id: string
  email: string
  full_name: string | null
  is_active: boolean
  created_at: string
  last_login_at: string | null
  organization?: UserOrganization
}

// Alias for convenience
export type User = UserListItem

export interface MembershipInfo {
  organization_id: string
  organization_name: string
  role: string
  joined_at: string
}

export interface UserDetail {
  id: string
  email: string
  full_name: string | null
  is_active: boolean
  email_verified: boolean
  created_at: string
  last_login_at: string | null
  memberships: MembershipInfo[]
}

export interface UserUpdateRequest {
  full_name?: string
  is_active?: boolean
}

// --- Dashboard Stats ---
export interface DashboardStats {
  total_organizations: number
  active_organizations: number
  total_users: number
  active_users: number
}
