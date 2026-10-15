# lovefengis (Python)

Official Python client for the [lovefengis REST API](https://lovefengis.com/gelistirici/api): the services and prices of lovefengis, a software studio in Izmir, Turkey. Public, read-only, no API key, no dependencies.

```sh
pip install lovefengis
```

```python
from lovefengis import Client

c = Client()
services = c.list_services()
service = c.get_service("kurumsal-ozel-yazilim")
monthly = c.get_pricing(period="monthly")
```

Prices are in TRY and include VAT; `type == "from"` is a starting price.

- OpenAPI 3.1: https://lovefengis.com/openapi.json
- MCP server: https://lovefengis.com/mcp
- Homepage: https://lovefengis.com
