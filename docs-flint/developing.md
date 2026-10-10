# Developing

## Install dependencies

Flint needs the Wayland client libraries, the
xdg-shell protocol definitions, and the Vulkan
headers and loader.

Fedora:

```sh
sudo dnf install wayland-devel \
  wayland-protocols-devel vulkan-headers \
  vulkan-loader-devel libxkbcommon-devel
```

Ubuntu (matches CI):

```sh
sudo apt-get install libwayland-dev \
  wayland-protocols libvulkan-dev
```

Check the install with:

```sh
pkg-config --modversion wayland-client \
  wayland-scanner vulkan xkbcommon
which wayland-scanner
```

## Build and check

```sh
make        # build ./bin/flint
make check  # build and run the smoke check
make clean  # remove bin/ and dist/
```

## Protocol code

The `xdg-shell` XML ships with
`wayland-protocols-devel` under
`/usr/share/wayland-protocols/stable/` as
`xdg-shell/xdg-shell.xml`.
Generate the client header and private code
with `wayland-scanner` into `bin/` at build
time. Never commit generated files.

## Style

C11, warnings as errors (`-Wall -Wextra
-Werror`). Format with `clang-format`
(`ColumnLimit: 60`). Public API lives in
`include/flint/`, internals in `src/`.
