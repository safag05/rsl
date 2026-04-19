import json
import os
import re
from datetime import datetime
from twilio.rest import Client

# ---- TWILIO CONFIG (Must be at the top) ----
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
from_whatsapp = os.getenv('TWILIO_FROM_NUMBER') # Should be whatsapp:+14155238886
numbers_raw = os.getenv('WHATSAPP_NUMBERS', "")
phone_list = [n.strip() for n in numbers_raw.split(",") if n.strip()]

# Now this check will work because the names are defined
if not account_sid or not auth_token:
    print("⚠️ Missing Twilio Credentials in GitHub Secrets.")
    exit()

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

# ---- LOAD DATA ----
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
message = "⚽ *RSL Match Day Reminder*\n\n"
for i, (home_raw, away_raw, time) in enumerate(today_games, 1):
    home_clean, away_clean = clean_team_name(home_raw), clean_team_name(away_raw)
    home_col, away_col = get_colors(home_clean, away_clean)

    message += f"{i}️⃣ *{home_raw}* vs *{away_raw}*\n"
    message += f"⏰ {time}\n"
    message += f"👕 {home_raw}: {home_col}\n"
    message += f"👕 {away_raw}: {away_col}\n\n"

message += "🚫 *NO GRAY shirts allowed.*\nPlease arrive 15 minutes early."

# ---- SENDING VIA TWILIO ----
if not account_sid or not auth_token:
    print("⚠️ Missing Twilio Credentials.")
    exit()

client = Client(account_sid, auth_token)

# Ensure the FROM number has the correct prefix
if not from_whatsapp.startswith("whatsapp:"):
    # If it doesn't have the prefix, add it. 
    # Also ensure it has the '+' if it's just the digits.
    if not from_whatsapp.startswith("+"):
        from_whatsapp = f"whatsapp:+{from_whatsapp}"
    else:
        from_whatsapp = f"whatsapp:{from_whatsapp}"

for phone in phone_list:
    try:
        # Clean up the receiver number
        target_phone = phone.strip()
        if not target_phone.startswith("whatsapp:"):
            if not target_phone.startswith("+"):
                target_phone = f"whatsapp:+{target_phone}"
            else:
                target_phone = f"whatsapp:{target_phone}"
        
        client.messages.create(
            body=message,
            from_=from_whatsapp,
            to=target_phone
        )
        print(f"✅ Sent to {target_phone}")
    except Exception as e:
        print(f"❌ Failed for {phone}: {e}")