# Invariants

1. Cross-platform desktop. Flint targets Windows, Linux, and macOS. Rendering goes through a single Vulkan path on every target. Platform code stays in internal windowing and surface helpers and never leaks into the public API.

