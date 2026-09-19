# Podomy website

Marketing site and docs for [podomy.com](https://podomy.com).

Products live in the [podomy GitHub org](https://github.com/podomy). This repo is only the website.

## Routes

* `/` About
* `/concord/` Product summary
* `/docs/` Docs, rendered from `docs/`
* `/pricing/` Commercial licenses
* `/contact/` Talk to engineering
* `/terms/` Terms

`docs/` mirrors Concord `docs/` (overview, architecture, CLI, Go SDK, deployment). Keep wording in sync when Concord docs change.

## Structure

```text
src/pages/    Routes, including pricing estimator
src/layouts/  Site chrome
src/components/
src/styles/   Global CSS
docs/         Markdown source for /docs/
public/       Static assets
```

## Commands

```sh
pnpm install
pnpm dev      # local server
pnpm build    # static output in dist/
pnpm preview  # preview the build
```

Requires Node >=22.12.0.

## Contributing

Discuss changes with engineering at [contact@podomy.com](mailto:contact@podomy.com) before large edits.
