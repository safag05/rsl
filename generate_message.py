import json
import os
import re
import requests
import urllib.parse
from datetime import datetime

# ---- CONFIG & SECRETS (Privacy) ----
# This pulls the hidden list from GitHub (e.g., "15551234567,15559876543")
numbers_raw = os.getenv('WHATSAPP_NUMBERS', "")
API_KEY = os.getenv('CALLMEBOT_API_KEY')

# Split the string into an actual list
phone_list = [n.strip() for n in numbers_raw.split(",") if n.strip()]

TEAM_JERSEYS = {
    "GREEN KNIGHTS FC": "Green",
    "TIGERS FC": "Red"
}

def clean_team_name(name):
    return re.sub(r'[^\w\s]', '', name).strip()

def get_colors(home, away):
    if home == "GREEN KNIGHTS FC": return "Green", "Black"
    if away == "GREEN KNIGHTS FC": return "Black", "Green"
    if home == "TIGERS FC": return "Red", "White"
    if away == "TIGERS FC": return "White", "Red"
    return "Black", "White"

# ---- LOAD JSON ----
with open("./data/fixtures.json") as f:
    data = json.load(f)

today_str = datetime.now().strftime("%m/%d/%Y")
today_games = []

for week in data["weeks"]:
    for day in week["days"]:
        if today_str in day["dateHeader"]:
            for game in day["games"]:
                if game["homeScore"] == "BYE": continue
                if "PM" not in game["homeScore"] and "AM" not in game["homeScore"]: continue
                today_games.append((game["home"], game["away"], game["homeScore"]))

if not today_games:
    print("No games today.")
    exit()

# ---- BUILD MESSAGE ----
message = "⚽ RSL Match Day Reminder\n\n"
for i, (home_raw, away_raw, time) in enumerate(today_games, 1):
    home_clean, away_clean = clean_team_name(home_raw), clean_team_name(away_raw)
    home_col, away_col = get_colors(home_clean, away_clean)

    message += f"{i}️⃣ {home_raw} vs {away_raw}\n"
    message += f"⏰ {time}\n"
    message += f"👕 {home_raw}: {home_col}\n"
    message += f"👕 {away_raw}: {away_col}\n\n"

message += "🚫 NO GRAY shirts allowed.\nArrive 15 mins early!"

# ---- SEND TO MULTIPLE WHATSAPP NUMBERS ----
if not API_KEY or not phone_list:
    print("⚠️ Missing API Key or Phone Numbers. Check your Secrets.")
    exit()

encoded_message = urllib.parse.quote(message)

for phone in phone_list:
    url = f"https://api.callmebot.com/whatsapp.php?phone={phone}&text={encoded_message}&apikey={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        print(f"✅ Sent to {phone[:5]}***") # Partially hide number in logs
    else:
        print(f"❌ Failed for {phone[:5]}***")