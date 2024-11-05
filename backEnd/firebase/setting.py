import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import json

# Tải các biến môi trường từ file .env
load_dotenv()

# Tạo dictionary từ các biến môi trường
firebase_config = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
}

# Khởi tạo credentials từ dictionary cấu hình
cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred)

# Kết nối với Firestore
db = firestore.client()
print("Kết nối thành công với Firestore database!")
