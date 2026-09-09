import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "@/test/render"
import { LoginPage } from "./LoginPage"

const mutateAsync = vi.fn().mockResolvedValue({ access_token: "a", refresh_token: "r" })
vi.mock("@/hooks/useAdminAuth", () => ({
  useAdminLogin: () => ({ mutateAsync, isPending: false, error: null }),
  useAdminAuth: () => ({ data: undefined, isLoading: false }),
}))

describe("Admin LoginPage", () => {
  it("renders the login form", () => {
    renderWithProviders(<LoginPage />, { route: "/login" })
    expect(screen.getByPlaceholderText("admin@ejemplo.com")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument()
  })

  it("submits credentials", async () => {
    renderWithProviders(<LoginPage />, { route: "/login" })
    await userEvent.type(screen.getByPlaceholderText("admin@ejemplo.com"), "root@x.co")
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "secret123")
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }))
    expect(mutateAsync).toHaveBeenCalledWith({ email: "root@x.co", password: "secret123" })
  })
})
