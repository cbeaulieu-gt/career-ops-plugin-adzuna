# career-ops-plugin-adzuna

An unlisted community provider plugin for [Career-Ops](https://github.com/career-ops-hq/career-ops) that searches the authenticated [Adzuna Jobs API](https://developer.adzuna.com/).

It returns normalized jobs to Career-Ops' scanner. The plugin does not write to the pipeline, submit applications, or use browser automation.

## Install

Choose a reviewed 40-character commit SHA from this repository, then run these commands from the root of your Career-Ops checkout:

```bash
node plugins.mjs add cbeaulieu-gt/career-ops-plugin-adzuna --sha 0123456789abcdef0123456789abcdef01234567
node plugins.mjs enable adzuna
node plugins.mjs enable adzuna --confirm
```

Replace the example SHA with the exact commit you reviewed. Career-Ops refuses a moving branch for direct, off-registry installations.

This plugin intentionally remains unlisted because Career-Ops' current contribution policy excludes universal aggregation indexes from its registry. It will appear with the `community-unverified` trust badge when directly installed.

If your Career-Ops fork already contains `plugins/adzuna`, keep using that bundled reference. An unlisted same-ID plugin does not receive the registry approval needed to supersede a bundled plugin.

## Configure

Create an application through the [Adzuna developer portal](https://developer.adzuna.com/) and add its credentials to your Career-Ops `.env`:

```dotenv
ADZUNA_APP_ID=your-app-id
ADZUNA_APP_KEY=your-app-key
```

Add an explicit, disabled-by-default entry to `portals.yml`:

```yaml
tracked_companies:
  - name: "Adzuna — AI leadership in Canada"
    provider: adzuna
    country: ca
    what: "head of ai"
    where: "Toronto"
    results_per_page: 50
    max_pages: 3
    max_days_old: 14
    enabled: false
```

Review the query and set `enabled: true` when it is ready.

### Portal options

| Option | Meaning | Default / limit |
| --- | --- | --- |
| `country` | Required two-letter Adzuna country code | Required |
| `what` | Search terms; `query` is accepted as an alias | Empty |
| `where` | Search location; `location` is accepted as an alias | Empty |
| `results_per_page` | Results requested per API page | Default 50; maximum 50 |
| `max_pages` | Maximum API pages fetched per scan | Default 1; maximum 20 |
| `max_days_old` | Optional maximum posting age in days | Positive integer |

## Output

Valid API rows are normalized to Career-Ops jobs with these fields:

- `id`
- `title`
- `url`
- `company`
- `location`
- `description`
- `postedAt` when the API timestamp is valid

Rows without an ID, title, or HTTP(S) redirect URL are discarded without aborting the page.

## Security

- Credentials are read only from the scoped `ctx.env` object.
- Requests use Career-Ops' guarded `ctx.fetchJson` function.
- `manifest.json` allows only `api.adzuna.com`.
- Error messages redact both raw and URL-encoded credential values.
- Pagination is bounded to 20 pages and 50 results per page.
- `humanInTheLoop` is mandatory and enabled.

## Development

Requires Node.js 18 or newer. The test suite uses no network access:

```bash
npm test
```

## Provenance

This standalone plugin extracts the Adzuna provider originally developed in [`cbeaulieu-gt/career-ops` issue #44](https://github.com/cbeaulieu-gt/career-ops/issues/44) and PR #46. The implementation is distributed under the original Career-Ops MIT license.

## License

[MIT](LICENSE)
