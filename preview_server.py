import requests
from bs4 import BeautifulSoup
from aiohttp import web
from server import PromptServer
import re

routes = web.RouteTableDef()

preview_cache = {}


def oembed(url):

    try:

        # YouTube
        if "youtube.com" in url or "youtu.be" in url:

            r=requests.get(
                "https://www.youtube.com/oembed",
                params={"url":url,"format":"json"},
                timeout=6
            ).json()

            return {
                "title":r.get("title",""),
                "description":r.get("author_name",""),
                "image":r.get("thumbnail_url",""),
                "date":""
            }

        # Reddit



   
      
        # Twitter / X
        if "twitter.com" in url or "x.com" in url:

            r=requests.get(
                "https://publish.twitter.com/oembed",
                params={"url":url},
                timeout=6
            ).json()

            return {
                "title":"Twitter Post",
                "description":r.get("author_name",""),
                "image":"",
                "date":""
            }

    except:
        pass

    return None


def extract_preview(url):

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html",
        "Accept-Language": "en-US,en;q=0.9"
    }

    # --- REDDIT SPECIAL PARSER ---
 
    # --- GENERIC PARSER ---
    try:

        r = requests.get(url, headers=headers, timeout=8, stream=True)

        html = ""

        for chunk in r.iter_content(chunk_size=2048, decode_unicode=True):

            if not chunk:
                break

            html += chunk

            if "</head>" in html.lower():
                break

        soup = BeautifulSoup(html, "html.parser")

        def meta(prop, attr="property"):
            tag = soup.find("meta", attrs={attr: prop})
            if tag and tag.get("content"):
                return tag["content"]
            return None

        title = meta("og:title")
        desc = meta("og:description")
        image = meta("og:image")

        if not image:
            image = meta("twitter:image", "name")

        date = meta("article:published_time")

        if not title:
            t = soup.find("title")
            if t:
                title = t.text.strip()

        if not desc:
            desc = meta("description", "name")

        return {
            "title": title or "",
            "description": desc or "",
            "image": image or "",
            "date": date or ""
        }

    except Exception as e:

        return {
            "title": "Preview error",
            "description": str(e),
            "image": "",
            "date": ""
        }

@routes.get("/mindmap/preview")
async def preview(request):

    url = request.query.get("url")

    if not url:
        return web.json_response({})

    if url in preview_cache:
        return web.json_response(preview_cache[url])

    data = extract_preview(url)

    preview_cache[url] = data

    return web.json_response(data)


PromptServer.instance.app.add_routes(routes)