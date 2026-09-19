<p align="center">
  <img src="./public/logo.png" alt="Podomy" width="15%">
</p>

<h1 align="center">Podomy</h1>

Marketing site and docs for [podomy.com](https://podomy.com).

Products live in the [podomy GitHub org](https://github.com/podomy).
This repo is only the website.

### Routes

- [`/` About](./src/pages/index.astro)
- [`/concord/` Product summary](./src/pages/concord.astro)
- [`/docs/` Docs, rendered from `docs/`](./docs/overview.md)
- [`/pricing/` Commercial licenses](./src/pages/pricing.astro)
- [`/contact/` Talk to engineering](./src/pages/contact.astro)
- [`/terms/` Terms](./src/pages/terms.astro)

`docs/` mirrors Concord `docs/` (overview, architecture, CLI, Go SDK,
deployment). Keep wording in sync when Concord docs change.

### Structure

```text
src/pages/    Routes, including pricing estimator
src/layouts/  Site chrome
src/components/
src/styles/   Global CSS
docs/         Markdown source for /docs/
public/       Static assets
```

Commands, run from the repo root:

```sh
pnpm install
pnpm dev      # local server
pnpm build    # static output in dist/
pnpm preview  # preview the build
```

Requires Node >=22.12.0.

### Contributing

Discuss your change with the engineering team at [contact@podomy.com](mailto:contact@podomy.com) before opening a PR in order not to waste anybody's effort or time.

Announcements and engineering updates on distributed systems, consensus algorithms, and robotic fleet coordination are shared via our newsletter at [podomy.com](https://podomy.com).
