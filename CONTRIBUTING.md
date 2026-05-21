# Contributing to X-Twitter-Filter

Thanks for taking the time to contribute! This is a small, single-file userscript project — every improvement helps.

## Ways to contribute

- **Report bugs** — open an issue with steps to reproduce
- **Suggest features** — describe the use case and expected behavior
- **Submit pull requests** — fix bugs, improve filtering logic, or refine the settings UI

## Getting started

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```sh
   git clone https://github.com/YOUR_USERNAME/X-Twitter-Filter.git
   cd X-Twitter-Filter
   ```
3. Create a branch for your change:
   ```sh
   git checkout -b fix/my-change
   ```
4. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
5. Load `X(Twitter)Filter.js` into your userscript manager (paste the file contents or point to your local copy).

## Making changes

- All application logic lives in **`X(Twitter)Filter.js`** (~1,100 lines).
- Use **vanilla JavaScript** — no frameworks, no build step.
- Match the existing code style: 2-space indent, double quotes, IIFE wrapper.
- Keep changes focused — one logical change per pull request when possible.
- The settings panel UI is in **Turkish**; README and contributor docs are in **English**.

## Testing

Before submitting a PR, verify your changes on a live X/Twitter page:

1. Enable the script in Tampermonkey.
2. Visit [x.com](https://x.com) or [twitter.com](https://twitter.com).
3. Confirm filtering still works (blur/hide modes, keywords, accounts).
4. Open the settings panel (`Alt + Shift + K` or Tampermonkey menu) and save settings.
5. Test import/export if you touched filter config logic.

**Checklist:**

- [ ] Script loads without console errors
- [ ] Filtering works on new posts (scroll the feed)
- [ ] Settings panel opens, saves, and persists after reload
- [ ] Keyboard shortcut `Alt + Shift + K` toggles the panel

## Submitting a pull request

1. Push your branch to your fork.
2. Open a PR against `main` on [dogukannparlak/X-Twitter-Filter](https://github.com/dogukannparlak/X-Twitter-Filter).
3. Fill in the PR template — describe what changed and how you tested it.
4. Link any related issues (e.g. `Fixes #12`).

## Issue guidelines

- Search existing issues before opening a new one.
- Include your browser, userscript manager (Tampermonkey/Violentmonkey), and script version.
- For bugs: exact steps to reproduce, expected vs actual behavior, and console errors if any.
- For features: explain *why* you need it, not just *what* you want.

## Code of conduct

Be respectful and constructive. This is a personal open-source project — keep discussions focused and friendly.

## Questions?

Open an issue or reach out on [X (@dogukanparIak)](https://x.com/dogukanparIak).
