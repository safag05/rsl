import json
from datetime import datetime
import re

# ---- CONFIG ----
TEAM_JERSEYS = {
    "GREEN KNIGHTS FC": "Green",
    "TIGERS FC": "Red"
}

# ---- HELPERS ----
def clean_team_name(name):
    # remove emojis to match with our logic dictionary
    return re.sub(r'[^\w\s]', '', name).strip()

def get_colors(home, away):
    home_has = home in TEAM_JERSEYS
    away_has = away in TEAM_JERSEYS

    # 🔥 Special Rules
    if home == "GREEN KNIGHTS FC":
        return "Green", "Black"
    if away == "GREEN KNIGHTS FC":
        return "Black", "Green"

    if home == "TIGERS FC":
        return "Red", "White"
    if away == "TIGERS FC":
        return "White", "Red"

    # Default
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
                # skip BYE games
                if game["homeScore"] == "BYE":
                    continue

                # only future games (time format)
                if "PM" not in game["homeScore"] and "AM" not in game["homeScore"]:
                    continue

                # Keep the raw names with emojis for the final message
                home_raw = game["home"]
                away_raw = game["away"]
                time = game["homeScore"]

                today_games.append((home_raw, away_raw, time))

# ---- BUILD MESSAGE ----
if not today_games:
    print("No games today")
    exit()

message = "⚽ RSL Match Day Reminder\n\n"

for i, (home_raw, away_raw, time) in enumerate(today_games, 1):
    # Clean the names JUST to check the colors
    home_clean = clean_team_name(home_raw)
    away_clean = clean_team_name(away_raw)

    home_color, away_color = get_colors(home_clean, away_clean)

    # Use the raw names (with emojis) for the printout
    message += f"{i}️⃣ {home_raw} vs {away_raw}\n"
    message += f"⏰ {time}\n"
    message += f"👕 {home_raw}: {home_color}\n"
    message += f"👕 {away_raw}: {away_color}\n\n"

# 🔥 Add global note
message += "🚫 NO GRAY shirts allowed.\n"
message += "Please arrive 15 minutes early."

print(message)