# GLORY BE TO GOD,
# FORTIS ENCRYPTION LIBRARY,
# BY ISRAEL MAFABI EMMANUEL

# CRYPTOFORTIS

import os

import json
import datetime

from datetime import timezone, timedelta
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

key = os.getenv('CRYPTO_KEY')
cipher_suite = Fernet(key)

# function for encryption
def fortis_encrypt(data:dict)->str:
    try:
        # we'll have to serialize this data into json
        json_data:str = json.dumps(data)
        return cipher_suite.encrypt(json_data.encode("utf-8")).decode("utf-8")
    except Exception as e:
        print(f"error: encryption failed: {e}")
        return None

# function for decryption
def fortis_decrypt(encrypted_data:str)->dict:
    try:
        encrypted_bytes:bytes = encrypted_data.encode("utf-8")
        decrypted_data:bytes  = cipher_suite.decrypt(encrypted_bytes)
        return json.loads(decrypted_data.decode("utf-8"))
    except Exception as e:
        print(f"error: decryption failed: {e}")
        return None

# function for generating the transfer token
def fortis_generate_token(sender:str, value:str, recipient:str, expiry:int = 14400)->str:
    # token expiration period (defaults to one day)
    expiry_time   = datetime.datetime.now(timezone.utc) + timedelta(minutes=expiry)
    # -> creating a dictionary for storing the necessary data
    data:dict = {
        "sender"       : sender,
        "value"        : value,
        "recipient"    : recipient,
        "expiry_time"  : str(expiry_time)
    }
    # concatenated_string:str = f"{sender}|{value}|{recipient}"
    # encrypted_token:str     = fortis_encrypt(concatenated_string)
    return fortis_encrypt(data)

# function for validating the given token, based on time(expiry)
def fortis_validate_token(token:str)->bool:
    decrypted_data = fortis_decrypt(token)
    if decrypted_data:
        expiry_time  = datetime.datetime.fromisoformat(decrypted_data.get("expiry_time")) # extracting the timestamp
        current_time = datetime.datetime.now(timezone.utc) 
        # now checking if the expiry threshold has been surpassed
        if current_time <= expiry_time:
            return True 
    return False

# function for breaking down the transfer token
def fortis_breakdown_token(token:str)->tuple:
    if fortis_validate_token(token):
        decrypted_data:dict = fortis_decrypt(token)
        if decrypted_data:
            sender    = decrypted_data.get("sender")
            value     = decrypted_data.get("value")
            recipient = decrypted_data.get("recipient")

            return sender, value, recipient
    print("error: Invalid token")
    return None, None, None

# Test cases
sender_email:str    = "emmanuel@mafabi.com"
value:str           = "1000000"
recipient_email:str = "wendy@mafabi.com"

token:str = fortis_generate_token(sender_email, value, recipient_email, expiry=2) # expiry set to 2minutes
print(f"Generated Token: {token}")

sender, value, recipient = fortis_breakdown_token(token)
if sender and value and recipient:
    print(f"Sender   : {sender}")
    print(f"Value    : {value}")
    print(f"Recipient: {recipient}")

# token_ = "gAAAAABnnI6LZDynPaUAfEBoVFuawjIiXneDrfwgi8J6-xRRA4OxzgxSoxhSA_Y1_9aLofen8oAtv_rcHCA_6Ou3xZ3GBWNyFxGo7Bf_jPncWh3JqJqTiyr70VXK8OSrGhuyg0osmSHD2cWOHDe5XRTGXDBRPz3kT9t1mAWkzfHfrBc58-Pm9cl1I-JfnEUNJpF6EbzSAxA0aPoLOJRq7l2zJAyikX7uhlvi1euNeB5d7f8GUll6uNi-EsLBd0Aau2-u65KBDTKu"
# s, v, r = fortis_breakdown_token(token_)
# print(f"sender:{s}, value:{v}, reciever:{r}")