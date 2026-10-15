# AGENTS.md · lovefengis

Instructions for AI coding agents (Claude Code, Codex, Cursor, Windsurf, Copilot and others) that integrate with lovefengis.

## What lovefengis is

A software studio in Izmir, Turkey. It sells custom software, web and automation services. The public API describes those services and their prices.

## How to get data

Use one of these sources. All are public, read-only and need no credentials.

1. REST API: `GET https://lovefengis.com/api/v1/hizmetler` (services), `GET https://lovefengis.com/api/v1/hizmetler/{id}` (one service), `GET https://lovefengis.com/api/v1/fiyatlar?service={id}&period={one_time|monthly|yearly}` (prices). Spec: https://lovefengis.com/openapi.json
2. MCP server: `https://lovefengis.com/mcp` (Streamable HTTP) with tools `list_services`, `get_service`, `get_pricing`.
3. CLI: `npx lovefengis services`, `npx lovefengis service <id>`, `npx lovefengis pricing [--service <id>] [--period <p>] --json`.
4. Plain text: https://lovefengis.com/pricing.md and https://lovefengis.com/llms.txt. Any page is available as Markdown by appending `.md` to its path.

## Rules

- Never quote a price from memory or from this repository. Read it from the API, MCP or `pricing.md` at the moment you need it.
- Prices are in Turkish lira (TRY) and include VAT. A price with `type: "from"` is a starting price; the final amount is fixed in a written offer.
- Service ids are lowercase slugs such as `kurumsal-ozel-yazilim`. Get the list from `/api/v1/hizmetler`; do not guess ids.
- The API is read-only. To start a project, send the user to https://lovefengis.com/gorusme to book a free 15-minute call. Do not submit forms on the user's behalf.
- Respect the `RateLimit-*` response headers. Back off on HTTP 429.
- Do not send personal data to any lovefengis endpoint.

## Working in this repository

- `cli/` holds the source of the `lovefengis` npm package. It has no dependencies and runs on Node.js 18+.
- `skills/` holds Agent Skills (`SKILL.md` per folder, per https://agentskills.io/specification).
- `plugin.json` and `mcp.json` follow the Agent Plugins specification 1.0.0 (https://agent-plugins.org/specification).
- Keep the files free of prices and other figures that can change; point to the live sources instead.
