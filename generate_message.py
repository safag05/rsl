import json
import os
import re
import requests
import urllib.parse
from datetime import datetime

# ---- PRIVACY CONFIG ----
# Pulls numbers from GitHub Secrets (e.g., "15551234567,15550001111")
numbers_raw = os.getenv('WHATSAPP_NUMBERS', "")
API_KEY = os.getenv('CALLMEBOT_API_KEY')

# Convert the string into a list
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

# ---- DATA LOADING ----
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

# ---- MESSAGE BUILDING ----
message = "⚽ RSL Match Day Reminder\n\n"
for i, (home_raw, away_raw, time) in enumerate(today_games, 1):
    home_clean, away_clean = clean_team_name(home_raw), clean_team_name(away_raw)
    home_col, away_col = get_colors(home_clean, away_clean)

    message += f"{i}️⃣ {home_raw} vs {away_raw}\n"
    message += f"⏰ {time}\n"
    message += f"👕 {home_raw}: {home_col}\n"
    message += f"👕 {away_raw}: {away_col}\n\n"

message += "🚫 NO GRAY shirts allowed.\nArrive 15 mins early!"

# ---- SENDING TO MULTIPLE NUMBERS ----
if not API_KEY or not phone_list:
    print("⚠️ Missing API Key or Phone Numbers in GitHub Secrets.")
    exit()

encoded_msg = urllib.parse.quote(message)

for phone in phone_list:
    url = f"https://api.callmebot.com/whatsapp.php?phone={phone}&text={encoded_msg}&apikey={API_KEY}"
    response = requests.get(url)
    
    # Use masking in logs so your full number isn't visible in the GH Actions history
    masked_phone = f"{phone[:3]}***{phone[-3:]}"
    
    if response.status_code == 200:
        print(f"✅ Message sent to {masked_phone}")
    else:
        print(f"❌ Failed to send to {masked_phone}")