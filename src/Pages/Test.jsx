import { useEffect } from "react";
import { useState } from "react";
import { Table, Modal, Form } from "antd";
import axios from "axios";
import upFile from "../utils/file";

function Test() {
  const api = "https://66f6b940436827ced9783796.mockapi.io/Student";
  const [data, setData] = useState([]); // danh sach mãng rỗng
  const [openModal, setOpenModal] = useState(false);
  const [fileList, setFileList] = useState([]);

  const fetchData = async () => {
    //upload ảnh
    if (fileList.length > 0) {
      const file = fileList[0];

      const url = await upFile(file.originalFileObj);
      console.log(url);
    }

    // async =>
    try {
      //Lấy dữ liệu từ back-end
      //promise => funct bất đồng bộ => cần thời gian để thực hiện
      // axios.get(api);
      const res = await axios.get(api); // await : đợi tới khi API trả về kết quả

      console.log(res.data);
      setData(res.data);
      //GET => lấy dữ liệu
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // hành động chạy gì đó
    // dựa vào điều kiện : dependency array
    // [] => chạy khi load trang lần đầu
    //[condition] => chạy mỗi khi number thay đổi
    // fetchData();
    fetchData();
  }, []); // dependency array

  const cols = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const handleModal = () => {
    setFileList([]);
    //open modal
    setOpenModal(!openModal);
  };

  return (
    <div>
      <h1>Testing </h1>
      <button onClick={() => handleModal()}>Open Modal</button>
      <hr />
      <Table dataSource={data} columns={cols} />
      <hr />
      {/* pop up form */}
      <Modal
        title="Form register"
        open={openModal}
        onCancel={() => handleModal()}
      >
        <Form>
          {/* name là tên biến cần để truyền dữ liệu */}
          <Form.Item
            label="Name"
            name="nameVal"
            rules={[
              {
                required: true,
                message: "Input now OR you GAYYY",
              },
            ]}
          >
            <input type="text" />
          </Form.Item>
          <Form.Item>
            <input type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Test;
