import json
import os
import re
import requests
from datetime import datetime

# ---- CALLMEBOT CONFIG ----
numbers_raw = os.getenv('WHATSAPP_NUMBERS', "")
keys_raw = os.getenv('CALLMEBOT_API_KEYS', "")

phone_list = [n.strip() for n in numbers_raw.split(",") if n.strip()]
key_list = [k.strip() for k in keys_raw.split(",") if k.strip()]

if not phone_list or not key_list:
    print("⚠️ Missing Phone Numbers or API Keys in GitHub Secrets.")
    exit()

# Create a mapping of phone numbers to their respective API keys
user_configs = list(zip(phone_list, key_list))

def clean_team_name(name):
    return re.sub(r'[^\w\s]', '', name).strip()

def get_colors(home_raw, away_raw):
    home = clean_team_name(home_raw).upper()
    away = clean_team_name(away_raw).upper()

    # Set standard defaults for the rest of the league
    home_col = "*Black*"
    away_col = "*White*"

    # Special Case: Tigers play Green Knights
    if home == "TIGERS FC" and away == "GREEN KNIGHTS FC":
        home_col = "*Red*"
        away_col = "*Green*"
    elif home == "GREEN KNIGHTS FC" and away == "TIGERS FC":
        home_col = "*Green*"
        away_col = "*Red*"
        
    # Tigers play any other team
    elif home == "TIGERS FC":
        home_col = "*Red*"
        away_col = "*White*"  # Opponent wears white
    elif away == "TIGERS FC":
        away_col = "*Red*"
        home_col = "*White*"  # Opponent wears white
        
    # Green Knights play any other team
    elif home == "GREEN KNIGHTS FC":
        home_col = "*Green*"
        away_col = "*Black*"  # Opponent wears black
    elif away == "GREEN KNIGHTS FC":
        away_col = "*Green*"
        home_col = "*Black*"  # Opponent wears black

    return home_col, away_col

# ---- LOAD DATA ----
try:
    with open("./data/fixtures.json") as f:
        data = json.load(f)
except FileNotFoundError:
    print("❌ Error: fixtures.json not found.")
    exit()

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
    print(f"No games found for today ({today_str}).")
    exit()

# ---- BUILD MESSAGE ----
message = "⚽ *RSL Match Day Reminder & Jersey Color*\n\n"
for i, (home_raw, away_raw, time) in enumerate(today_games, 1):
    home_clean, away_clean = clean_team_name(home_raw), clean_team_name(away_raw)
    home_col, away_col = get_colors(home_raw, away_raw)

    message += f"{i}️⃣ *{home_raw}* vs *{away_raw}*\n"
    message += f"⏰ {time}\n"
    message += f"*JERSEYS:*\n"
    message += f"👕 {home_raw}: {home_col}\n"
    message += f"👕 {away_raw}: {away_col}\n\n"

message += "🚫 *NO GRAY shirts allowed.*\nPlease arrive 15 minutes early."

# ---- SENDING VIA CALLMEBOT ----
for phone, apikey in user_configs:
    try:
        # CallMeBot API Endpoint
        url = "https://api.callmebot.com/whatsapp.php"
        params = {
            "phone": phone,
            "text": message,
            "apikey": apikey
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            print(f"✅ Sent successfully to {phone}")
        else:
            print(f"❌ Failed for {phone}: Status {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Connection error for {phone}: {e}")