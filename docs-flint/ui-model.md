# UI model

Declarative code-first UI on a retained
runtime, with built-in docking and workspaces and
a dedicated GPU viewport.

## What app code declares

App code describes structure: panels, trees,
tables, property inspectors, toolbars, tab
groups, splitters, and viewport placement. The
framework owns layout, resizing, spacing, panel
relationships, scrolling, focus, keyboard
navigation, typography defaults, and docking
behavior. App code configures exceptions only.
No markup file, no stylesheet, no mandatory
visual editor. UI description stays in version
controlled code.

## What the runtime owns

Layout, input, state, text, accessibility,
docking, and workspace serialization. Declaring
the UI must not rebuild it per frame. The
runtime retains components, assigns stable
identity to panels and rows, updates only what
changed, and virtualizes large lists and tables.

## Viewport separation

The central canvas gets a dedicated GPU path
through the same Vulkan backend. The framework
manages window, input, sizing, HiDPI, and frame
pacing across UI and viewport as one system, so
a heavy viewport frame never blocks panel input.
UI controls and viewport content have separate
performance budgets.

## Rejected alternatives

- HTML, CSS, DOM: workable but too much
  separate machinery for dense native desktop
  tooling.
- Immediate-mode only: good for quick tools,
  weak for persistent state, text, keyboard
  workflow, and accessibility in full
  application shells.
- Verbose retained widgets without a
  declarative layer: sound runtime, but too
  much app code per panel.
- Visual editor as core model: acceptable as
  an optional addition, not the programming
  model.

