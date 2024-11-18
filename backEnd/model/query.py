import firebase_admin
from firebase_admin import credentials, firestore

# Khởi tạo Firebase Admin SDK
cred = credentials.Certificate("./newkey.json")  # Đường dẫn đến tệp JSON
firebase_admin.initialize_app(cred)

def get_animal_by_class_id(class_id):
    try:
        db = firestore.client()  # Kết nối đến Firestore
        animal_ref = db.collection('animals').where('class_id', '==', class_id)
        results = animal_ref.stream()

        for result in results:
            animal = result.to_dict()
            print(f"Tìm thấy dữ liệu: {animal}")  # In ra dữ liệu truy vấn
            return animal

        print("Không tìm thấy tài liệu.")
        return None
    except Exception as e:
        print(f"Lỗi khi truy vấn Firestore: {str(e)}")
        return {"error": str(e)}