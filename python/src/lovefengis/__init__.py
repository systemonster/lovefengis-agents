"""Official Python client for the lovefengis REST API (https://lovefengis.com/gelistirici/api).

The API is public and read-only. It lists the services and prices of lovefengis,
a software studio in Izmir, Turkey. No API key is needed.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

__all__ = ["Client", "LovefengisError", "DEFAULT_BASE_URL"]
__version__ = "1.0.0"

DEFAULT_BASE_URL = "https://lovefengis.com/api/v1"
PERIODS = ("one_time", "monthly", "yearly")


class LovefengisError(Exception):
    """Raised for non-2xx responses."""

    def __init__(self, status: int, body: str) -> None:
        super().__init__(f"lovefengis: HTTP {status}: {body[:300]}")
        self.status = status
        self.body = body


class Client:
    """Read-only client. Prices are in TRY and include VAT."""

    def __init__(self, base_url: str = DEFAULT_BASE_URL, timeout: float = 15.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _get(self, path: str, params: Optional[Dict[str, str]] = None) -> Any:
        url = self.base_url + path
        if params:
            url += "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(
            url, headers={"Accept": "application/json", "User-Agent": f"lovefengis-python/{__version__}"}
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as res:
                return json.load(res)
        except urllib.error.HTTPError as e:
            raise LovefengisError(e.code, e.read(4096).decode("utf-8", "replace")) from None

    def list_services(self) -> List[Dict[str, Any]]:
        """All services with their prices."""
        return self._get("/hizmetler")["data"]

    def get_service(self, service_id: str) -> Dict[str, Any]:
        """One service by id, e.g. "kurumsal-ozel-yazilim"."""
        return self._get("/hizmetler/" + urllib.parse.quote(service_id, safe=""))["data"]

    def get_pricing(self, service: Optional[str] = None, period: Optional[str] = None) -> List[Dict[str, Any]]:
        """Prices, optionally filtered by service id and period (one_time, monthly, yearly)."""
        if period is not None and period not in PERIODS:
            raise ValueError(f"period must be one of {PERIODS}")
        params = {k: v for k, v in (("service", service), ("period", period)) if v}
        return self._get("/fiyatlar", params)["data"]
