# Proxy deployment safety checks

The Pages workflow must pass these checks against the prepared `_site` artifact
before uploading or deploying it. A failure leaves the previous deployment live.
Do not move the checks after the deployment step or mark them continue-on-error.

## Incident: blank proxy printer, 2026-11-11

The rarity-icon release (`93b4700`) changed the entry page's JavaScript and CSS
references from `./assets/...` to `/assets/...`. The Vite source configuration had
not persisted the relative base used by earlier releases. A normal build therefore
used Vite's root-relative default. On lorcanatools.com, the proxy app lives below
`/proxy-printer/`; the root asset request returned an HTML page instead of a module.
The app never mounted, leaving a white page.

Type checking and bundling succeeded because the JavaScript itself was valid.
The old workflow only copied and uploaded files. Checking HTTP 200 and the bundle
name in the entry page also did not prove the browser could start the application.
The repository additionally had legacy branch publishing enabled alongside the
custom workflow, allowing a second deployment route to bypass workflow checks.

## Safeguards

- Pages now uses `build_type: workflow`; legacy direct branch publishing is disabled.
  `check-publishing.mjs` verifies that setting on every deployment and refuses to
  publish if the bypass is re-enabled. It also tests rejection of legacy settings.
- The source Vite configuration now fixes `base: "./"` and rejects build overrides
  that change it. This source lives in the separate proxy-tool workspace.
- `check_assets.py` parses the actual release HTML and requires relative module
  and stylesheet URLs, nonempty files, an application root, and paths within the
  asset directory. It works independently of how the build was created.
- `test_assets.py` proves that the original bad path, missing/empty bundles,
  external URLs, missing roots and encoded directory traversal are rejected.
- `smoke.cjs` serves the exact release files at both `/proxy-printer/` and
  `/lorecounter/proxies/`, then launches Chromium. It checks runtime errors, asset
  status/MIME types, visible UI, search, adding a card, preview state and PDF output.
- The browser check deliberately injects an HTML-instead-of-JavaScript response
  and a startup exception, and requires the test to reject both.
- Browser dependencies are version-pinned and installed from the committed lockfile.
  API responses are local fixtures so external catalog downtime cannot block a release.
- Screenshots are uploaded on success and failure for investigation. The
  `failure-mime` and `failure-crash` images are intentional self-test failures.

## Run locally

From the repository root:

```sh
python3 -m unittest discover -s .github/proxy-checks -p 'test_*.py' -v
python3 .github/proxy-checks/check_assets.py proxies
cd .github/proxy-checks
npm ci --ignore-scripts
npx playwright install chromium
npm test -- --site=../..
```

These checks prevent this known path regression and catch several other blank-page
failures. They cannot guarantee that every possible future browser, hosting or
external-service failure is impossible.
