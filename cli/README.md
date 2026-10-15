# lovefengis CLI

<!-- mcp-name: com.lovefengis/mcp -->

Official command-line client for the [lovefengis REST API](https://lovefengis.com/gelistirici/api). It lists the services and prices of lovefengis, a software studio in Izmir, Turkey. Read-only, no API key, no personal data.

```sh
npx lovefengis services
npx lovefengis service kurumsal-ozel-yazilim
npx lovefengis pricing --period monthly
npx lovefengis pricing --service canliya-tasima --json
npx lovefengis docs
npx lovefengis mcp        # stdio MCP server (bridge to https://lovefengis.com/mcp)
```

`--json` prints the raw API response for scripts and AI agents. Prices are in Turkish lira (TRY) and include VAT.

- Docs: https://lovefengis.com/gelistirici/cli
- OpenAPI 3.1: https://lovefengis.com/openapi.json
- MCP server: https://lovefengis.com/mcp (registry name com.lovefengis/mcp)
- Source and agent kit: https://github.com/systemonster/lovefengis-agents

License: MIT
