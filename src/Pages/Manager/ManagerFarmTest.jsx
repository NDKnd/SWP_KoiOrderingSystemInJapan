import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import { Button, Form, Input, message, Modal } from "antd";
import { FaFolderPlus } from "react-icons/fa";

function ManagerFarmTest() {
  const [koiFarmList, setKoiFarmList] = useState([]);
  const [search, setSearch] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    console.log("ManagerFarmTest");
    const fetch = async () => {
      try {
        const response = await api.get("farm");
        console.log(response.data);
        setKoiFarmList(response.data);
        console.log("koiFarmList: ", koiFarmList);
      } catch (error) {
        message.error("cannot fetch farm data");
        console.log(error);
      }
    };
    fetch();
    message.success("fetch farm data successfully");
  }, []);

  const filteredKoiFarmList = Array.isArray(koiFarmList)
    ? koiFarmList.filter((koiFarm) =>
        koiFarm.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleModalCreate = () => {
    setIsCreateModalOpen((prev) => !prev);
  };
  const handleCreate = async (values) => {
    event.preventDefault();
    try {
      const newFarm = {
        farmName: values.farmName, // Lấy giá trị từ form
        location: "string", // Thay thế bằng giá trị thực tế nếu cần
        description: values.description,
        phone: "8484050805840584070|0536043082",
        email: "string",
        image: "string",
      };

      const response = await api.post("farm", newFarm);
      setKoiFarmList((prevList) => [...prevList, newFarm]);
      message.success("New farm created successfully!");
    } catch (err) {
      console.error("Failed to create new Koi Farm", err);
      message.error("Failed to create new farm");
    } finally {
      handleModalCreate(); // Đóng modal
    }
  };

  return (
    <>
      <div className="manager-farm-create-search">
        <button
          title="Add new Koi farm"
          className="manager-farm-create-search-button"
          onClick={() => handleModalCreate()}
        >
          <FaFolderPlus className="manager-farm-create-search-icon" />
        </button>
        <input
          type="text"
          placeholder="Search Koi farm by name... "
          // value={search}
          // onChange={handleSearchChange}
          className="search-bar-manager-farm"
        ></input>
      </div>
      <div className="koiFarmList">
        {search.length == 0 ? (
          filteredKoiFarmList == 0 ? (
            <h2 style={{ display: "flex", justifyContent: "center" }}>
              None found
            </h2>
          ) : (
            <h2 style={{ display: "flex", justifyContent: "center" }}>
              Loading...
            </h2>
          )
        ) : filteredKoiFarmList.length == 0 ? (
          <h2>There are no Koi Farm with name {search}</h2>
        ) : (
          filteredKoiFarmList.map((koiFarm) => (
            <h2 key={koiFarm.id}>{koiFarm.name}</h2>
          ))
        )}
      </div>
      {isCreateModalOpen && (
        <Modal title="Create New Farm" open={isCreateModalOpen} footer={null}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={handleCreate}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="farmName"
              rules={[{ required: true, message: "Please input farm name!" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input farm description!" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={handleModalCreate}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}

export default ManagerFarmTest;
