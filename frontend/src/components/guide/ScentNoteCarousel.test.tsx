/**
 * @file ScentNoteCarousel.test.tsx
 * @description Scent pyramid carousel behavior regression tests.
 * @lastModified 2026-05-16
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ScentNoteCarousel from "./ScentNoteCarousel";

describe("ScentNoteCarousel", () => {
  it("returns to the selected note when revisiting a pyramid layer", async () => {
    render(<ScentNoteCarousel onNotesChange={vi.fn()} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /middle note/i }));

    for (let i = 0; i < 6; i += 1) {
      await user.click(screen.getByRole("button", { name: /next note/i }));
    }

    expect(screen.getByText("7 / 7")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "카다멈" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /place as middle note/i }));
    await user.click(screen.getByRole("button", { name: /base note/i }));
    await user.click(screen.getByRole("button", { name: /middle note/i }));

    expect(screen.getByText("7 / 7")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "카다멈" })).toBeInTheDocument();
  });
});

// EOF: ScentNoteCarousel.test.tsx
