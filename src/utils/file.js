import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import storage from "../config/firebase";
// Nhập đối tượng storage từ file cấu hình Firebase của bạn

const upFile = async (file, folder) => {
  try {
    console.log("file:", file);
    console.log("file name:", file.name);
    // const storageRef = ref(storage, `Test/${file.name}`); // Tạo 1 tham chiếu đến vị trí mà file sẽ được lưu trữ
    // Tạo 1 tham chí PicKoi folder
    const storageRef = ref(storage, `${folder}/${file.name}`);
    console.log("uploading file: ", file.name);

    const res = await uploadBytes(storageRef, file); // Tải file lên Firebase Storage và lưu kết quả vào biến res
    console.log("file upload:", res);

    const downloadURL = await getDownloadURL(res.ref); // Lấy URL tải xuống của file vừa tải lên
    return downloadURL; // Trả về URL tải xuống
  } catch (error) {
    console.error("Upload error:", error.message || error);
    return null; // Lỗi khi upload file lên Firebase
  }
};

export default upFile;
