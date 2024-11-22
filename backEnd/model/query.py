from pymongo import MongoClient

# Kết nối tới MongoDB
mongo_uri = "mongodb+srv://zunpom2209:minhhieu31122004@cluster0.aqc7n.mongodb.net/"
client = MongoClient(mongo_uri)

# Chọn database và collection
db = client['AnimalDatabase']  
animal_collection = db['Animals']  

def get_animal_by_class_id(class_id):
    try:
        # Truy vấn document theo class_id
        animal = animal_collection.find_one({"class_id": class_id})
        if animal:
            return {
                "Name_Eng": animal.get("Name_Eng", "Unknown"),
                "Name_Vie": animal.get("Name_Vie", "Không rõ"),
                "mo_ta": animal.get("mo_ta", "Không có thông tin chi tiết")
            }
        return None
    except Exception as e:
        print(f"Error querying MongoDB: {str(e)}")
        return None
