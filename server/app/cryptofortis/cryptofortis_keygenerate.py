# GLORY BE TO GOD,
# FORTIS ENCRYPTION LIBRARY,
# BY ISRAEL MAFABI EMMANUEL

# CRYPTOFORTIS - KEY GENERATOR
from cryptography.fernet import Fernet

# Generate a key
key = Fernet.generate_key()
# save the key to a file
with open('cryptofortis.key', 'wb') as key_file:
    key_file.write(key)
