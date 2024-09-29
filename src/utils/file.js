import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

const upFile = async (file) => {
  const storageRef = ref(storage, file.name); // Lưu file lên Firebase Storage
  const res = await uploadBytes(storageRef, file); //=> Lấy cái đường dẫn đến file vừa tạo
  const downloadURL = await getDownloadURL(res.ref);
  return downloadURL;
};

export default upFile;
