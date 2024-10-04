import { Button, Upload, message } from "antd";
import { useState } from "react";
import upFile from "./file";

function TestUpFile() {
  const [fileList, setFileList] = useState([]);
  // const [imageURLs, setImageURLs] = useState([]);

  const handleChange = (info) => {
    setFileList(info.fileList);
    console.log("list of files:", info.fileList);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("No files selected for upload.");
      return;
    }

    const promises = fileList.map(async (file) => {
      console.log("file:", file);
      if (file.originFileObj) {
        try {
          const downloadURL = await upFile(file.originFileObj); // Upload file lên Firebase
          console.log("file upload:", downloadURL);
          return downloadURL;
        } catch (error) {
          console.error("Upload failed:", error);
          message.error(`${file.name} failed to upload.`);
        }
      } else {
        console.error("File does not have originFileObj:", file);
        message.error(`${file.name} does not have a valid file object.`);
      }
    });

    const urls = await Promise.all(promises);
    console.log("Uploaded file URLs:", urls);
    message.success("All files uploaded successfully!");
  };

  return (
    <div>
      <Upload
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={
          () => false // Ngăn chặn việc upload file tự động
        }
      >
        <Button>Chọn hình ảnh</Button>
      </Upload>
      <Button onClick={handleUpload} disabled={fileList.length === 0}>
        Tải lên
      </Button>
    </div>
  );
}

export default TestUpFile;
