---
name: lovefengis-mcp
description: Connect an agent to the lovefengis MCP server and call its tools. Use when setting up MCP access to lovefengis services and prices, or when an MCP call to lovefengis fails.
license: MIT
---

# lovefengis MCP server

- Endpoint: `https://lovefengis.com/mcp`
- Transport: Streamable HTTP (JSON-RPC 2.0 over POST)
- Authentication: none
- Server card: https://lovefengis.com/.well-known/mcp/server-card.json

## Tools

| Tool | Arguments | Returns |
|---|---|---|
| `list_services` | `query` (optional text filter) | Services with id, name, url |
| `get_service` | `id` | One service with its prices |
| `get_pricing` | `service` (optional id), `period` (optional `one_time`, `monthly`, `yearly`) | Price list |

## Client configuration

```json
{ "mcpServers": { "lovefengis": { "type": "streamable-http", "url": "https://lovefengis.com/mcp" } } }
```

## Troubleshooting

- HTTP 429: wait for the seconds in `RateLimit-Reset`, then retry.
- Unknown service id: call `list_services` first and use an id from its result.
- The same data is available over REST: https://lovefengis.com/openapi.json
