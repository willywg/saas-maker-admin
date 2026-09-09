import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("merges conditional classes and resolves tailwind conflicts", () => {
    expect(cn("a", false && "b", "c")).toBe("a c")
    expect(cn("p-2", "p-4")).toBe("p-4")
  })
})
