"""WebMapApp backend — FastAPI skeleton.

Serves the JSON API under ``/api`` and the built frontend (the Vite ``dist``
build, copied to ``./static`` on every ``vite build``) as the web root, with
SPA fallback so client-side routes (/leaflet, /maplibre, /cesium) work.

Run (from the backend/ directory):
    uvicorn main:app --reload
"""

from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.types import Scope

BASE_DIR = Path(__file__).resolve().parent
WEBROOT = BASE_DIR / "static"

app = FastAPI(title="WebMapApp API")


@app.get("/api/health")
def health() -> dict[str, str]:
    """Liveness check."""
    return {"status": "ok"}


class SPAStaticFiles(StaticFiles):
    """StaticFiles that falls back to index.html for client-side routes."""

    async def get_response(self, path: str, scope: Scope):
        try:
            return await super().get_response(path, scope)
        except StarletteHTTPException as exc:
            if exc.status_code == 404:
                return await super().get_response("index.html", scope)
            raise


# Mount the built frontend as the web root. Declared after the API routes so
# /api/* keeps working. Guarded so the app still starts before the first build.
if WEBROOT.is_dir():
    app.mount("/", SPAStaticFiles(directory=WEBROOT, html=True), name="webroot")
