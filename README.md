# lovefengis agent kit

Official agent tooling for [lovefengis](https://lovefengis.com), a software studio in Izmir, Turkey: the `lovefengis` CLI, Agent Skills, an Agent Plugin manifest and the MCP configuration.

Everything here talks to public, read-only endpoints. No API key, no sign-up, no personal data.

| Surface | Where |
|---|---|
| REST API (OpenAPI 3.1) | https://lovefengis.com/api/v1 · [openapi.json](https://lovefengis.com/openapi.json) |
| MCP server (Streamable HTTP) | https://lovefengis.com/mcp · registry: [com.lovefengis/mcp](https://registry.modelcontextprotocol.io/v0/servers?search=com.lovefengis) |
| Docs MCP server | https://lovefengis.com/mcp/docs · registry: com.lovefengis/docs |
| CLI (npm) | [`lovefengis`](https://www.npmjs.com/package/lovefengis) · source in [`cli/`](cli/) |
| Agent Skills | [`skills/`](skills/) |
| Go SDK | [lovefengis-go](https://github.com/systemonster/lovefengis-go) |
| Python SDK | [`python/`](python/) |
| Agent Plugin | [`plugin.json`](plugin.json) + [`mcp.json`](mcp.json) |
| Developer docs | https://lovefengis.com/gelistirici |
| Overview for agents | https://lovefengis.com/llms.txt |

## Quick start

```sh
npx lovefengis services
npx lovefengis pricing --period monthly --json
```

Install the skills into your coding agent:

```sh
npx skills add systemonster/lovefengis-agents
```

Add the MCP server to a client that supports Streamable HTTP:

```json
{ "mcpServers": { "lovefengis": { "type": "streamable-http", "url": "https://lovefengis.com/mcp" } } }
```

## Rules for agents

See [AGENTS.md](AGENTS.md).

## License

MIT. See [LICENSE](LICENSE).
