import firebase_admin
from firebase_admin import credentials, firestore

# Đường dẫn đến file JSON chứa key của bạn
cred = credentials.Certificate(
    "C:/Users/WINDOWS/source/repos/python_final/backEnd/firebase/firebase-key.json")

# Khởi tạo ứng dụng Firebase
firebase_admin.initialize_app(cred)

# Kết nối với Firestore
db = firestore.client()

# Tạo một document trong collection 'animal'


def create_animal(name, description):
    # Thêm document mới vào collection 'animal'
    doc_ref = db.collection('animal').document()
    doc_ref.set({
        'name': name,
        'description': description
    })
    print(f"Document for {name} added to 'animal' collection.")


# Thêm dữ liệu mẫu vào collection 'animal'
create_animal("Elephant", "A large mammal with a trunk.")
create_animal("Tiger", "A big cat known for its stripes.")
