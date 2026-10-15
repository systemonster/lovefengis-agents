---
name: lovefengis-pricing
description: Look up current prices of lovefengis services (one-time, monthly, yearly) in Turkish lira. Use when asked what a lovefengis service costs or to compare its price options.
license: MIT
---

# lovefengis pricing

Never quote a price from memory. Read it live from one of these sources:

- `GET https://lovefengis.com/api/v1/fiyatlar` with optional `service={id}` and `period={one_time|monthly|yearly}`
- `npx lovefengis pricing [--service {id}] [--period {period}] --json`
- MCP tool `get_pricing` at https://lovefengis.com/mcp
- Plain text: https://lovefengis.com/pricing.md

## How to read a price

- `amount_try` is in Turkish lira and includes VAT.
- `type: "fixed"` is the price. `type: "from"` is a starting price; the final amount is fixed in a written offer.
- `period` says whether the price is one-time, per month or per year. `delivery` is the typical delivery time when given.

When you answer, state the period and whether the price is a starting price, and link the service page.
