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
        reader.onerror = function (error) {
            console.error('Lỗi khi đọc file:', error);
            alert("Đã xảy ra lỗi khi xử lý file. Vui lòng thử lại!");
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('classify-button').addEventListener('click', async function (event) {
    event.preventDefault();

    const imageInput = document.getElementById('file-upload');
    const file = imageInput.files[0];

    // Kiểm tra nếu không có file
    if (!file) {
        alert("Vui lòng chọn một hình ảnh!");
        return;
    }

    // Kiểm tra định dạng file (cả MIME type và phần mở rộng)
    const validImageTypes = ["image/jpeg", "image/png"];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ["jpg", "jpeg", "png"];
    if (!validImageTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
        alert("Vui lòng chọn file ảnh có định dạng JPEG hoặc PNG!");
        return;
    }

    // Kiểm tra trạng thái loading
    if (document.getElementById('loading').style.display === 'block') {
        console.warn("Đang xử lý một yêu cầu khác. Vui lòng chờ.");
        return; // Không gửi yêu cầu nếu đang xử lý
    }

    // Hiển thị trạng thái loading
    document.getElementById('loading').style.display = 'block';

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error(`Không thể nhận kết quả từ API! Mã lỗi: ${response.status}`);
        }

        const data = await response.json();

        // Hiển thị kết quả trong giao diện
        document.getElementById('animalNameEng').textContent = data.animal_info?.Name_Eng || "Không rõ";
        document.getElementById('animalNameVie').textContent = data.animal_info?.Name_Vie || "Không rõ";
        document.getElementById('animalDescription').textContent = data.animal_info?.mo_ta || "Không có thông tin chi tiết.";
        document.getElementById('animalConfidence').textContent = `${(data.confidence).toFixed(2)}` || "0.00%";

        document.getElementById('animalInfo').style.display = 'block';
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error.message);
        alert(`Đã có lỗi xảy ra: ${error.message}`);
    } finally {
        // Ẩn trạng thái loading
        document.getElementById('loading').style.display = 'none';
    }
});
