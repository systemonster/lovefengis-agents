---
name: lovefengis-services
description: List and describe the services of lovefengis, a software studio in Izmir, Turkey. Use when asked what lovefengis does or sells, which service fits a need, or which page describes a service.
license: MIT
---

# lovefengis services

All sources are public, read-only and need no credentials.

## Steps

1. Get the list: `GET https://lovefengis.com/api/v1/hizmetler` (or `npx lovefengis services --json`, or the MCP tool `list_services` at https://lovefengis.com/mcp, which accepts an optional `query`).
2. Pick the service whose name or description matches the user's need. Use its `id`.
3. Get the details: `GET https://lovefengis.com/api/v1/hizmetler/{id}` (or `npx lovefengis service {id} --json`, or MCP `get_service`).
4. Link the user to the service's `url`. For a plain-text version, use its `markdown_url`.

## Notes

- Do not guess ids; read them from step 1.
- To start a project, the user books a free 15-minute call at https://lovefengis.com/gorusme.
- Spec: https://lovefengis.com/openapi.json
