from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from query import get_animal_by_class_id
from flask_cors import CORS

# Tạo Flask app
app = Flask(__name__)
CORS(app)

# Tải model tại startup
model = load_model('model.h5')

# Thư mục tải lên
upload_folder = './uploads'
os.makedirs(upload_folder, exist_ok=True)

def preprocess_image(img_path):
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0  # Chuẩn hóa
        return img_array
    except Exception as e:
        raise ValueError(f"Error in preprocessing image: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Lưu file
        img_path = os.path.join(upload_folder, file.filename)
        file.save(img_path)

        # Xử lý hình ảnh
        img_array = preprocess_image(img_path)
        predictions = model.predict(img_array)

        # Lấy lớp dự đoán
        predicted_class = np.argmax(predictions[0])
        confidence = predictions[0][predicted_class]

        # Tên các lớp
        class_names = [
            'Ant', 'Antelope', 'Bear', 'Bee', 'Beetle', 'Bull', 'Butterfly', 'Camel',
            'Cat', 'Chicken', 'Crocodile', 'Dog', 'Duck', 'Elephant', 'Fish', 'Frog',
            'Giraffe', 'Goat', 'Horse', 'Kangaroo', 'Leopard', 'Lion', 'Monkey', 'Mouse',
            'Penguin', 'Pig', 'Rabbit', 'Snail', 'Snake', 'Spider', 'Tiger', 'Tortoise', 'Zebra'
        ]
        predicted_class_name = class_names[predicted_class]

        # Lấy thông tin từ Firebase
        animal_info = get_animal_by_class_id(int(predicted_class + 1))

        if not animal_info:
            return jsonify({
                "predicted_class": predicted_class_name,
                "confidence": float(confidence) * 100,
                "animal_info": {
                    "Name_Eng": "Không tìm thấy",
                    "Name_Vie": "Không tìm thấy",
                    "mo_ta": f"Không có thông tin chi tiết cho class_id {predicted_class + 1}"
                }
            }), 404

        # Trả kết quả
        return jsonify({
            "predicted_class": predicted_class_name,
            "confidence": float(confidence) * 100,
            "animal_info": animal_info
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
