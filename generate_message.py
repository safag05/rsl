# ---- SENDING VIA TWILIO ----
if not account_sid or not auth_token:
    print("⚠️ Missing Twilio Credentials.")
    exit()

client = Client(account_sid, auth_token)

# Ensure the FROM number has the prefix
if not from_whatsapp.startswith("whatsapp:"):
    from_whatsapp = f"whatsapp:{from_whatsapp}"

for phone in phone_list:
    try:
        # 1. Clean the phone number (remove any + if the user added it to secrets)
        clean_phone = phone.replace("+", "").strip()
        
        # 2. Add the whatsapp:+ prefix to the TO number
        to_whatsapp = f"whatsapp:+{clean_phone}"
        
        client.messages.create(
            body=message,
            from_=from_whatsapp,
            to=to_whatsapp
        )
        print(f"✅ Sent to {clean_phone[:5]}***")
    except Exception as e:
        print(f"❌ Failed for {phone[:5]}***: {e}")