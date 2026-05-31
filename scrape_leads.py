"""
Google Maps lead scraper — businesses WITHOUT a website
Target area: Landau in der Pfalz + surrounding region (Germany)
Uses Apify actor: compass/crawler-google-places
"""

import os
import csv
import time
import json
import requests
from datetime import datetime

APIFY_API_KEY = os.environ.get("APIFY_API_KEY", "")
ACTOR_ID = "compass~crawler-google-places"
BASE_URL = "https://api.apify.com/v2"

SEARCH_QUERIES = [
    "Elektriker Landau in der Pfalz",
    "Klempner Landau in der Pfalz",
    "Maler Landau in der Pfalz",
    "Schreiner Landau in der Pfalz",
    "Sanitär Landau in der Pfalz",
    "Dachdecker Landau in der Pfalz",
    "Kfz Werkstatt Landau in der Pfalz",
    "Schlüsseldienst Landau in der Pfalz",
    "Fliesenleger Landau in der Pfalz",
    "Hausmeisterservice Landau in der Pfalz",
    "Friseur Landau in der Pfalz",
    "Bäckerei Landau in der Pfalz",
    "Metzgerei Landau in der Pfalz",
    "Blumenladen Landau in der Pfalz",
    "Imbiss Landau in der Pfalz",
    "Döner Landau in der Pfalz",
    "Nagelstudio Landau in der Pfalz",
    "Reifenhandel Landau in der Pfalz",
    "Schneider Landau in der Pfalz",
    "Schuster Landau in der Pfalz",
    "Handwerker Annweiler am Trifels",
    "Handwerker Bad Bergzabern",
    "Handwerker Edenkoben",
    "Handwerker Germersheim",
    "Handwerker Herxheim bei Landau",
    "Handwerker Kandel Pfalz",
    "Handwerker Rülzheim",
    "Handwerker Bellheim",
    "Handwerker Offenbach an der Queich",
    "Handwerker Neupotz",
]

OUTPUT_CSV = f"leads_ohne_website_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
CSV_FIELDS = ["name", "address", "city", "phone", "category", "rating",
              "review_count", "google_maps_url", "permanently_closed"]


def run_actor(search_term: str, max_results: int = 100) -> str:
    url = f"{BASE_URL}/acts/{ACTOR_ID}/runs"
    payload = {
        "searchStringsArray": [search_term],
        "maxCrawledPlacesPerSearch": max_results,
        "language": "de",
        "countryCode": "de",
        "includeWebResults": False,
    }
    resp = requests.post(
        url,
        json=payload,
        headers={"Authorization": f"Bearer {APIFY_API_KEY}"},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["data"]["id"]


def wait_for_run(run_id: str, poll_interval: int = 10, timeout: int = 300) -> bool:
    url = f"{BASE_URL}/actor-runs/{run_id}"
    elapsed = 0
    while elapsed < timeout:
        resp = requests.get(
            url,
            headers={"Authorization": f"Bearer {APIFY_API_KEY}"},
            timeout=15,
        )
        resp.raise_for_status()
        status = resp.json()["data"]["status"]
        if status == "SUCCEEDED":
            return True
        if status in ("FAILED", "ABORTED", "TIMED-OUT"):
            print(f"  Run {run_id} ended with status: {status}")
            return False
        time.sleep(poll_interval)
        elapsed += poll_interval
    print(f"  Timeout waiting for run {run_id}")
    return False


def fetch_results(run_id: str) -> list:
    url = f"{BASE_URL}/actor-runs/{run_id}/dataset/items"
    resp = requests.get(
        url,
        headers={"Authorization": f"Bearer {APIFY_API_KEY}"},
        params={"format": "json", "clean": "true"},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()


def extract_lead(item: dict):
    website = (item.get("website") or "").strip()
    if website:
        return None
    if item.get("permanentlyClosed"):
        return None

    address_parts = item.get("address", "") or ""
    city = item.get("city") or ""

    if not city and "," in address_parts:
        parts = [p.strip() for p in address_parts.split(",")]
        last = parts[-1]
        tokens = last.split()
        if len(tokens) >= 2 and tokens[0].isdigit():
            city = " ".join(tokens[1:])

    categories = item.get("categories") or []
    category = categories[0] if categories else item.get("categoryName", "")

    return {
        "name": item.get("title", "").strip(),
        "address": address_parts,
        "city": city,
        "phone": (item.get("phone") or "").strip(),
        "category": category,
        "rating": item.get("totalScore", ""),
        "review_count": item.get("reviewsCount", 0),
        "google_maps_url": item.get("url", ""),
        "permanently_closed": item.get("permanentlyClosed", False),
    }


def main():
    if not APIFY_API_KEY:
        raise SystemExit("ERROR: APIFY_API_KEY not set")

    all_leads = []
    seen_urls = set()

    for i, query in enumerate(SEARCH_QUERIES, 1):
        print(f"[{i}/{len(SEARCH_QUERIES)}] Searching: {query}")
        try:
            run_id = run_actor(query)
            print(f"  Run started: {run_id}")
            success = wait_for_run(run_id)
            if not success:
                continue
            items = fetch_results(run_id)
            batch_leads = 0
            for item in items:
                lead = extract_lead(item)
                if lead and lead["google_maps_url"] not in seen_urls:
                    seen_urls.add(lead["google_maps_url"])
                    all_leads.append(lead)
                    batch_leads += 1
            print(f"  {len(items)} results -> {batch_leads} new leads without website")
        except requests.HTTPError as e:
            print(f"  HTTP error: {e}")
        except Exception as e:
            print(f"  Error: {e}")

        if i < len(SEARCH_QUERIES):
            time.sleep(2)

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(all_leads)

    print(f"\nDone. {len(all_leads)} unique leads saved to: {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
