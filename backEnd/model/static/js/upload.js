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

    // Reset trạng thái loa và âm thanh
    const soundIcon = document.getElementById('animalSoundIcon');
    const soundIconImage = document.getElementById('soundIconImage');
    const audioElement = document.getElementById('animalSound');
    const audioSource = document.getElementById('animalSoundSource');
    const soundPlaceholder = document.getElementById('animalSoundPlaceholder');

    soundIcon.style.display = 'none'; // Ẩn biểu tượng loa
    soundPlaceholder.style.display = 'none'; // Ẩn thông báo placeholder
    soundIconImage.src = "https://res.cloudinary.com/dwfmpiozq/image/upload/v1732350144/loa_off_wvkrht.png"; // Đặt lại biểu tượng loa tắt
    audioElement.pause(); // Tắt âm thanh nếu đang phát
    audioElement.currentTime = 0; // Đặt lại âm thanh về thời điểm bắt đầu
    audioSource.src = ""; // Xóa URL âm thanh

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

        const soundUrl = data.animal_info?.sound_url;
        if (soundUrl) {
            audioSource.src = soundUrl; // Gán URL âm thanh
            audioElement.load(); // Tải lại âm thanh
            soundIcon.style.display = 'block'; // Hiển thị biểu tượng loa

            let isPlaying = false; // Đảm bảo loa mặc định là tắt

            // Khi nhấp vào biểu tượng loa, bật/tắt âm thanh
            soundIcon.onclick = () => {
                if (isPlaying) {
                    audioElement.pause(); // Tắt âm thanh
                    soundIconImage.src = "https://res.cloudinary.com/dwfmpiozq/image/upload/v1732350144/loa_off_wvkrht.png";
                } else {
                    audioElement.play(); // Phát âm thanh
                    soundIconImage.src = "https://res.cloudinary.com/dwfmpiozq/image/upload/v1732350142/loa_on_kvhq38.png";
                }
                isPlaying = !isPlaying; // Đảo trạng thái
            };

            // Khi âm thanh kết thúc, tự động chuyển biểu tượng về trạng thái tắt
            audioElement.onended = () => {
                soundIconImage.src = "https://res.cloudinary.com/dwfmpiozq/image/upload/v1732350144/loa_off_wvkrht.png";
                isPlaying = false;
            };
        } else {
            soundPlaceholder.textContent = "Không có tiếng kêu của động vật này";
            soundPlaceholder.style.display = 'block'; // Hiển thị thông báo nếu không có âm thanh
        }

        document.getElementById('animalInfo').style.display = 'block';
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error.message);
        alert(`Đã có lỗi xảy ra: ${error.message}`);
    } finally {
        // Ẩn trạng thái loading
        document.getElementById('loading').style.display = 'none';
    }
});
