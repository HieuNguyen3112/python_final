from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model 
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from flask_cors import CORS

# Create Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Load the model once at startup to avoid reloading it for each request
model = load_model('model.h5')

# Define the upload folder
upload_folder = './uploads'
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)

def preprocess_image(img_path):
    # Load and preprocess the image
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0  # Rescale
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        img_path = os.path.join(upload_folder, file.filename)
        file.save(img_path)

        img_array = preprocess_image(img_path)
        predictions = model.predict(img_array)

        # Danh sách tên lớp
        class_names = [
            'Ant', 'Antelope', 'Bear', 'Bee', 'Beetle', 'Bull', 'Butterfly', 'Camel',
            'Cat', 'Chicken', 'Crocodile', 'Dog', 'Duck', 'Elephant', 'Fish', 'Frog',
            'Giraffe', 'Goat', 'Horse', 'Kangaroo', 'Leopard', 'Lion', 'Monkey', 'Mouse',
            'Penguin', 'Pig', 'Rabbit', 'Snail', 'Snake', 'Spider', 'Tiger', 'Tortoise', 'Zebra'
        ]

        predicted_class = np.argmax(predictions[0])  # Lấy chỉ số lớp dự đoán
        predicted_class_name = class_names[predicted_class]  # Lấy tên lớp từ chỉ số

        confidence = predictions[0][predicted_class]

        return jsonify({
            "predicted_class": predicted_class_name,  # Trả về tên lớp
            "confidence": float(confidence) * 100  # Đảm bảo hiển thị đúng tỷ lệ phần trăm
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
