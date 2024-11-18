  // Xử lý khi người dùng chọn ảnh và gửi yêu cầu
  document.getElementById('imageInput').addEventListener('change', function (event) {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];

    if (file) {
        // Hiển thị hình ảnh đã chọn
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('selectedImage').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block'; // Hiển thị phần hình ảnh
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('submitButton').addEventListener('click', async function (event) {
    event.preventDefault();

    const imageInput = document.getElementById('imageInput');
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

        // Log dữ liệu trả về
        console.log("API Response:", data);

        // Hiển thị kết quả trong giao diện
        document.getElementById('animalNameEng').textContent = data.animal_info?.Name_Eng || "Không rõ";
        document.getElementById('animalNameVie').textContent = data.animal_info?.Name_Vie || "Không rõ";
        document.getElementById('animalDescription').textContent = data.animal_info?.mo_ta || "Không có thông tin chi tiết.";
        document.getElementById('animalConfidence').textContent = data.confidence?.toFixed(2) || "0.00";

        // Hiển thị phần thông tin chi tiết
        document.getElementById('animalInfo').style.display = 'block';

        // Ẩn trạng thái loading
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error);
        alert("Đã có lỗi xảy ra khi gửi yêu cầu.");
        document.getElementById('loading').style.display = 'none';  // Ẩn trạng thái loading nếu có lỗi
    }

});