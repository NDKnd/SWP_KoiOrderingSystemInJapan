// import api from "./../../services/axios";
import "./ManagerKoi.css";
import React, { useEffect, useState } from "react";
import api from "./../../services/axios";
import upFile from "../../utils/file";
import storage from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { message, Modal, Select } from "antd";
import { Option } from "antd/es/mentions";

const ManagerKoi = () => {
  const [search, setSearch] = useState("");
  const [koiList, setKoiList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKoi, setCurrentKoi] = useState(null);

  const [newKoi, setNewKoi] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [koiFarmList, setKoiFarmList] = useState([]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        const response = await api.get("farm");
        console.log(response);
        setKoiFarmList(response.data);
        console.log("koiFarmList: ", response.data);
        message.success("Fetch farm data successfully");
      } catch (err) {
        console.log(err);
        message.error("Cannot fetch farm data");
      } finally {
        setLoading(false);
      }
    };
    const fetchKoiData = async () => {
      try {
        setLoading(true);
        const response = await api.get("koi");
        console.log(response);
        setKoiList(response.data);
        console.log("koiList: ", response.data);
        message.success("Fetch Koi data successfully");
      } catch (err) {
        message.error("Cannot fetch Koi data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
    fetchKoiData();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredKoiList = Array.isArray(koiList)
    ? koiList.filter((koi) =>
        koi.koiName.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleEdit = (koi) => {
    setCurrentKoi(koi);
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      // Update Koi data via API
      console.log("currentKoi: ", currentKoi);
      await api.put(`koi/${currentKoi.id}`, currentKoi);

      const oldImageUrl = currentKoi.image;
      if (file) {
        if (oldImageUrl) {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        }

        const downloadURL = await upFile(file, "koi"); // Tải file lên Firebase
        if (downloadURL) {
          // Cập nhật Koi với URL của ảnh
          currentKoi.image = downloadURL;
          await api.put(`koi/${currentKoi.id}`, currentKoi);
        }
      }

      setKoiList((prevList) =>
        prevList.map((koi) => (koi.id === currentKoi.id ? currentKoi : koi))
      );

      message.success("Update Koi data successfully");
    } catch (err) {
      if (err.response.status === 400) {
        message.error(err.response.data.message);
      } else {
        console.error("Failed to update Koi data", err);
        message.error("Failed to update Koi data");
      }
    } finally {
      setIsModalOpen(false);
      setCurrentKoi(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("koi id: ", id);

      const ImageUrl = koiList.find((koi) => koi.id === id).image;
      // Delete Koi data via API
      const res = await api.delete(`koi/${id}`);

      if (ImageUrl) {
        const ImageRef = ref(storage, ImageUrl); // Tham chiếu định nghĩa ảnh trong Firebase
        await deleteObject(ImageRef); // Xóa ảnh
      }
      // Update Koi list state to remove the deleted Koi
      setKoiList((prevList) => prevList.filter((koi) => koi.id !== id));
      message.success("Koi deleted successfully");
      console.log("after delete: ", res.data);
    } catch (err) {
      message.error("Failed to delete Koi data");
      console.error("Failed to delete Koi data", err);
    }
  };
  //update
  const handleCreateKoi = () => {
    setIsCreateModalOpen((prev) => !prev);
  };

  const [file, setFile] = useState(null);

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    const downloadURL = await upFile(selectedFile, "kois");
    if (downloadURL) {
      setNewKoi((prevKoi) => ({ ...prevKoi, image: downloadURL }));
      message.success("File uploaded successfully");
    } else {
      message.error("File upload failed");
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      console.log("newKoi: ", newKoi);
      setNewKoi((prevKoi) => ({ ...prevKoi, farmId: newKoi.farmId }));
      console.log("newKoi: ", newKoi);
      const res = await api.post("koi", newKoi);
      const koicreated = res.data;
      console.log("koicreated: ", koicreated);

      // Sau khi Koi tao thanh cong, tien hanh upload anh vao firebase
      if (file) {
        const downloadURL = await upFile(file, "kois");
        if (downloadURL) {
          koicreated.image = downloadURL;
          console.log("koi created: ", koicreated);
          await api.put(`koi/${koicreated.id}`, koicreated);
        }
      }
      setKoiList((prevList) => [...prevList, newKoi]);
      message.success("Create new Koi successfully");
      setNewKoi(null);
      setFile(null);
    } catch (err) {
      if (err.response.status === 400) {
        message.error("Wrong input data");
      }
      console.error("Failed to create new Koi", err);
    } finally {
      handleCreateKoi();
    }
  };
  return (
    <>
      <div className="manager-koi-create-search">
        <button
          title="Create new Koi"
          className="manager-koi-create-search-button"
          onClick={() => handleCreateKoi()}
        >
          <MdOutlineCreateNewFolder className="manager-koi-create-search-icon" />
        </button>
        <input
          type="text"
          placeholder="Search Koi fish by name... "
          value={search}
          onChange={handleSearchChange}
          className="search-bar-manager-koi"
        ></input>
      </div>

      <div className="koiList">
        {filteredKoiList.length == 0 && search.length == 0 ? (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "2em",
            }}
          >
            There are no Kois
          </p>
        ) : filteredKoiList.length == 0 ? (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "2em",
            }}
          >
            There are no Koi with name {search}
          </p>
        ) : (
          filteredKoiList.map((koi) => (
            <div className="manager-koi-card" key={koi.id}>
              <div className="manager-koi-img">
                <img src={koi.image} alt={koi.koiName}></img>
              </div>
              <div className="manager-koi-name">
                <h2>{koi.name}</h2>
              </div>
              <div className="manager-koi-name">
                <h2>{koi.type}</h2>
              </div>
              <div className="manager-koi-name">
                <h2>{koi.price}</h2>
              </div>
              <div className="manager-koi-name">
                <h2>{koi.description}</h2>
              </div>
              <div className="manager-koi-name">
                <h2>{koi.farm.farmName}</h2>
              </div>
              <div className="manager-koi-button">
                <button onClick={() => handleEdit(koi)}>Edit</button>
                <button
                  onClick={() => {
                    Modal.confirm({
                      title: "Do you want to delete this Koi?",
                      onOk: () => handleDelete(koi.id),
                      okText: "Delete",
                      cancelText: "Cancel",
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
        {isModalOpen && currentKoi && (
          <div className="manager-koi-modal">
            <div className="manager-koi-modal-content">
              <h2 className="manager-koi-title-edit">Edit Koi</h2>
              <form onSubmit={handleSave} className="edit-manager-koi-contents">
                <div className="edit-detail-manager-koi">
                  <label>Koi Name: </label>
                  <input
                    type="text"
                    value={currentKoi.koiName}
                    onChange={(e) =>
                      setCurrentKoi({ ...currentKoi, koiName: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Type: </label>
                  <input
                    type="text"
                    value={currentKoi.type}
                    onChange={(e) =>
                      setCurrentKoi({ ...currentKoi, type: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Price: </label>
                  <input
                    type="number"
                    value={currentKoi.price}
                    onChange={(e) =>
                      setCurrentKoi({
                        ...currentKoi,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Description: </label>
                  <textarea
                    value={currentKoi.description}
                    onChange={(e) =>
                      setCurrentKoi({
                        ...currentKoi,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <Select
                    defaultValue={
                      koiFarmList.find((farm) => farm.id === currentKoi.farmId)
                        ?.farmName
                    }
                    onChange={(e) =>
                      setNewKoi({ ...currentKoi, farmId: e.target.value })
                    }
                    style={{ width: "100%" }}
                  >
                    {koiFarmList.map((farm) => (
                      <Select.Option key={farm.id} value={farm.farmName}>
                        {farm.farmName}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Image: </label>
                  <input
                    type="file"
                    value={currentKoi.image}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </div>
                <div className="popup-but-edit-manager-koi">
                  <button className="manager-koi-button-popup" type="submit">
                    Save
                  </button>
                  <button
                    className="manager-koi-button-popup"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isCreateModalOpen && (
          <div className="manager-koi-modal">
            <div className="manager-koi-modal-content">
              <h2 className="manager-koi-title-edit">Create Koi</h2>
              <form
                onSubmit={handleCreate}
                className="edit-manager-koi-contents"
              >
                <div className="edit-detail-manager-koi">
                  <label>Koi Name: </label>
                  <input
                    type="text"
                    value={newKoi?.koiName || ""}
                    onChange={(e) =>
                      setNewKoi({ ...newKoi, koiName: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Type: </label>
                  <input
                    type="text"
                    value={newKoi?.type || ""}
                    onChange={(e) =>
                      setNewKoi({ ...newKoi, type: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Price: </label>
                  <input
                    type="number"
                    value={newKoi?.price || 0}
                    onChange={(e) =>
                      setNewKoi({ ...newKoi, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Description: </label>
                  <textarea
                    value={newKoi?.description || ""}
                    onChange={(e) =>
                      setNewKoi({ ...newKoi, description: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Farm: </label>
                  <Select
                    defaultValue={newKoi?.farmId || ""}
                    onChange={(value) =>
                      setNewKoi({ ...newKoi, farmId: value })
                    }
                    style={{ width: "100%" }}
                  >
                    {koiFarmList.map((farm) => (
                      <Option key={farm.id} value={farm.id}>
                        {farm.farmName}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Image URL: </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files[0])} // Xử lý file upload
                  />
                </div>
                <div className="popup-but-edit-manager-koi">
                  <button className="manager-koi-button-popup" type="submit">
                    Create
                  </button>
                  <button
                    className="manager-koi-button-popup"
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManagerKoi;
