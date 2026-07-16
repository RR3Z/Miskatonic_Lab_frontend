import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

describe("shared form controls", () => {
  it("exposes normalized Input and Textarea variants", () => {
    render(
      <>
        <Input align="center" aria-label="Число" size="sm" variant="accent" />
        <Textarea aria-label="Описание" size="lg" variant="inline" />
      </>,
    )

    expect(screen.getByRole("textbox", { name: "Число" })).toHaveAttribute(
      "data-variant",
      "accent",
    )
    expect(screen.getByRole("textbox", { name: "Число" })).toHaveAttribute(
      "data-size",
      "sm",
    )
    expect(screen.getByRole("textbox", { name: "Число" })).toHaveAttribute(
      "data-align",
      "center",
    )
    expect(screen.getByRole("textbox", { name: "Описание" })).toHaveAttribute(
      "data-variant",
      "inline",
    )
  })

  it("keeps invalid and disabled native states", () => {
    render(<Input aria-invalid disabled aria-label="Недоступное поле" />)

    const input = screen.getByRole("textbox", { name: "Недоступное поле" })
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("data-variant", "default")
  })

  it("opens Select and selects an item from keyboard", async () => {
    const user = userEvent.setup()
    render(
      <Select defaultValue="male">
        <SelectTrigger aria-label="Пол" size="xs" variant="inline">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Мужчина</SelectItem>
          <SelectItem value="female">Женщина</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByRole("combobox", { name: "Пол" })
    await user.click(trigger)
    await user.keyboard("{ArrowDown}{Enter}")

    expect(trigger).toHaveAttribute("data-variant", "inline")
    expect(trigger).toHaveAttribute("data-size", "xs")
    expect(trigger).toHaveTextContent("Женщина")
  })

  it("supports file inputs through shared Input", () => {
    render(<Input accept="image/png" aria-label="Портрет" type="file" />)

    expect(screen.getByLabelText("Портрет")).toHaveAttribute(
      "accept",
      "image/png",
    )
  })
})
