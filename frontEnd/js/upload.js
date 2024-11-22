// Xử lý khi người dùng chọn ảnh và gửi yêu cầu
document.getElementById('file-upload').addEventListener('change', function (event) {
    const imageInput = document.getElementById('file-upload');
    const file = imageInput.files[0];

    if (file) {
        // Hiển thị hình ảnh đã chọn
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview-image').src = e.target.result;
            document.getElementById('uploaded-image').style.display = 'block'; // Hiển thị phần hình ảnh
        };
        reader.readAsDataURL(file);
        document.getElementById('classify-button').disabled = false; // Kích hoạt nút phân loại
    }
});

document.getElementById('classify-button').addEventListener('click', async function (event) {
    event.preventDefault();

    const imageInput = document.getElementById('file-upload');
    const file = imageInput.files[0];
    if (!file) {
        alert("Vui lòng chọn một hình ảnh!");
        return;
    }

    if (document.getElementById('loading').style.display === 'block') {
        return; // Không gửi yêu cầu nếu đang trong trạng thái loading
    }

    // Hiển thị trạng thái loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('animalInfo').style.display = 'none';  // Ẩn thông tin cũ nếu có

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error("Không thể nhận kết quả từ API!");
        }

        const data = await response.json();

        // Hiển thị kết quả trong giao diện
        document.getElementById('animalNameEng').textContent = data.animal_info?.Name_Eng || "Không rõ";
        document.getElementById('animalNameVie').textContent = data.animal_info?.Name_Vie || "Không rõ";
        document.getElementById('animalDescription').textContent = data.animal_info?.mo_ta || "Không có thông tin chi tiết.";
        document.getElementById('animalConfidence').textContent = `${(data.confidence * 100).toFixed(2)}%` || "0.00%";

        // Hiển thị phần thông tin chi tiết
        document.getElementById('animalInfo').style.display = 'block';
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error);
        alert("Đã có lỗi xảy ra khi gửi yêu cầu.");
    } finally {
        // Ẩn trạng thái loading
        document.getElementById('loading').style.display = 'none';
    }
});
