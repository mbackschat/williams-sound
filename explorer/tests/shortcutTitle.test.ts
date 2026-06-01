/**
 * Shortcut-aware tooltip composition (`src/web/ui/shortcutTitle.ts`).
 *
 * CLAUDE.md invariant: a control's hover tooltip must ALWAYS mention its
 * keyboard shortcut.  The fragile case is a control whose `.title` is rewritten
 * at runtime (e.g. the scrub Play/Freeze button) — a one-shot annotation at
 * boot gets clobbered.  `setShortcutTitle` re-applies the recorded key every
 * time the base title changes, keeping the binding's single source of truth in
 * `keyboard.ts` (which stamps `data-shortcut`) rather than hardcoding the key.
 */
import { describe, expect, it } from "vitest";

import { composeShortcutTitle, setShortcutTitle } from "../src/web/ui/shortcutTitle.ts";

describe("composeShortcutTitle", () => {
  it("appends the key tag to a base title", () => {
    expect(composeShortcutTitle("Play", "Space")).toBe("Play  [Space]");
  });

  it("is just the tag when the base is empty", () => {
    expect(composeShortcutTitle("", "Space")).toBe("[Space]");
  });

  it("leaves the base untouched when there is no shortcut", () => {
    expect(composeShortcutTitle("Play", undefined)).toBe("Play");
    expect(composeShortcutTitle("Play", null)).toBe("Play");
    expect(composeShortcutTitle("Play", "")).toBe("Play");
  });

  it("is idempotent — never doubles an already-present tag", () => {
    expect(composeShortcutTitle("Play  [Space]", "Space")).toBe("Play  [Space]");
  });
});

describe("setShortcutTitle", () => {
  const fakeEl = (shortcut?: string) =>
    ({ title: "", dataset: shortcut === undefined ? {} : { shortcut } }) as unknown as HTMLElement;

  it("composes the base title with the element's recorded shortcut", () => {
    const el = fakeEl("Space");
    setShortcutTitle(el, "Play at 1× (last used)");
    expect(el.title).toBe("Play at 1× (last used)  [Space]");
  });

  it("keeps a single tag across repeated dynamic title changes", () => {
    const el = fakeEl("Space");
    setShortcutTitle(el, "Play at 1× (last used)");
    setShortcutTitle(el, "Freeze the head");
    expect(el.title).toBe("Freeze the head  [Space]");
  });

  it("falls back to the bare base title for controls without a shortcut", () => {
    const el = fakeEl();
    setShortcutTitle(el, "Toggle layout");
    expect(el.title).toBe("Toggle layout");
  });
});
