# lovefengis CLI

Official command-line client for the [lovefengis REST API](https://lovefengis.com/gelistirici/api). It lists the services and prices of lovefengis, a software studio in Izmir, Turkey. Read-only, no API key, no personal data.

```sh
npx lovefengis services
npx lovefengis service kurumsal-ozel-yazilim
npx lovefengis pricing --period monthly
npx lovefengis pricing --service canliya-tasima --json
npx lovefengis docs
```

`--json` prints the raw API response for scripts and AI agents. Prices are in Turkish lira (TRY) and include VAT.

- Docs: https://lovefengis.com/gelistirici/cli
- OpenAPI 3.1: https://lovefengis.com/openapi.json
- MCP server: https://lovefengis.com/mcp

License: MIT
