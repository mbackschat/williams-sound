/**
 * Shortcut-aware tooltip composition.
 *
 * CLAUDE.md invariant: every control with a keyboard shortcut shows that key in
 * its hover tooltip.  `keyboard.ts` stamps each control's key onto a
 * `data-shortcut` attribute (single source of truth = the keymap), then both
 * the boot-time annotation and any runtime `.title` rewrite compose through
 * here — so a button whose title changes at runtime (e.g. the scrub
 * Play/Freeze toggle) never loses its `[Key]` tag.
 *
 * Pure (no DOM access at module load) so it's unit-testable under the Node
 * Vitest environment and importable from any browser-layer module.
 */

/** `base` with a ` [Key]` tag appended, idempotently.  No key → `base` as-is. */
export function composeShortcutTitle(base: string, key: string | null | undefined): string {
  if (!key) return base;
  const tag = `[${key}]`;
  if (base.includes(tag)) return base; // already annotated
  return base ? `${base}  ${tag}` : tag;
}

/** Set `el.title` to `base`, preserving the shortcut tag recorded in `data-shortcut`. */
export function setShortcutTitle(el: HTMLElement, base: string): void {
  el.title = composeShortcutTitle(base, el.dataset.shortcut);
}
