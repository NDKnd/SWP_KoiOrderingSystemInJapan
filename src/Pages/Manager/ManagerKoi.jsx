// import api from "./../../services/axios";
import "./ManagerKoi.css";
import { useEffect, useState } from "react";
import api from "./../../services/axios";
import upFile from "../../utils/file";
import storage from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { message, Modal, Select, Tooltip } from "antd";
import { Option } from "antd/es/mentions";

const ManagerKoi = () => {
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [koiList, setKoiList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKoi, setCurrentKoi] = useState(null);

  const [newKoi, setNewKoi] = useState({
    koiName: "",
    type: "",
    price: 0,
    description: "",
    image: "",
    farmId: 0,
  });
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
    setIsModalOpen((prevState) => !prevState);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      // Update Koi data via API
      console.log("Koi before edit: ", currentKoi);

      console.log("file:", file);
      const oldImageUrl = koiList.find((koi) => koi.id === currentKoi.id).image;
      console.log("oldImageUrl: ", oldImageUrl);

      const koiEdit = {
        koiName: currentKoi.koiName,
        type: currentKoi.type,
        price: currentKoi.price,
        description: currentKoi.description,
        image: oldImageUrl,
        farmId: currentKoi.farm.id,
      };
      const res = await api.put(`koi/${currentKoi.id}`, koiEdit);

      //after update on database
      console.log("koi after edit: ", res.data);
      const koiEdit2 = {
        id: res.data.id,
        koiName: res.data.koiName,
        type: res.data.type,
        price: res.data.price,
        description: res.data.description,
        image: res.data.image,
        farm: res.data.farm,
      };

      if (file) {
        let failURL = "";
        try {
          const downloadURL = await upFile(file, "kois"); // Tải file lên Firebase
          console.log("new imag URL: ", downloadURL);
          // Cập nhật Koi với URL của ảnh
          if (downloadURL) {
            failURL = downloadURL;
            let KoiForUpImage = {
              id: koiEdit2.id,
              koiName: koiEdit2.koiName,
              type: koiEdit2.type,
              price: koiEdit2.price,
              description: koiEdit2.description,
              image: downloadURL,
              farmId: koiEdit2.farm.id,
            };
            const res = await api.put(`koi/${KoiForUpImage.id}`, KoiForUpImage);
            console.log("koi after edit image: ", res.data);
            const KoiFinalUpImage = res.data;

            console.log("oldImageUrl: ", oldImageUrl);
            console.log("newImageUrl: ", downloadURL);
            //after split
            const oldURL = oldImageUrl.split("&")[0];
            const newURL = downloadURL.split("&")[0];
            console.log("old: ", oldURL);
            console.log("new: ", newURL);
            console.log("is the same ", oldURL === newURL);

            if (oldImageUrl && oldURL !== newURL) {
              deleteImage(oldImageUrl);
            }
            setKoiList((prevList) =>
              prevList.map((koi) =>
                koi.id === KoiFinalUpImage.id ? KoiFinalUpImage : koi
              )
            );
            message.success("Koi updated successfully");
            return;
          }
        } catch (error) {
          failURL !== "" && deleteImage(failURL);
          message.error("Failed to upload image");
          console.error("Failed to upload image", error);
        }
      }

      setKoiList((prevList) =>
        prevList.map((koi) => (koi.id === koiEdit2.id ? koiEdit2 : koi))
      );
      message.success("Koi updated successfully");
    } catch (err) {
      console.error("Failed to update Koi data", err);
    } finally {
      setFile(null);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("koi id: ", id);

      const ImageUrl = koiList.find((koi) => koi.id === id).image;
      // Delete Koi data via API
      const res = await api.delete(`koi/${id}`);

      if (ImageUrl) {
        deleteImage(ImageUrl);
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

  const deleteImage = async (url) => {
    if (url) {
      const ImageRef = ref(storage, url);
      await deleteObject(ImageRef);
    }
  };

  const handleFileChange = async (selectedFile) => {
    console.log("file image: ", selectedFile);
    setFile(selectedFile);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      console.log("newKoi before: ", newKoi);

      console.log("file image: ", file);

      const res = await api.post("koi", newKoi);

      const createdKoi = res.data;
      console.log("created Koi: ", createdKoi);

      const koiUpdate = {
        id: createdKoi.id,
        koiName: createdKoi.koiName,
        type: createdKoi.type,
        price: createdKoi.price,
        description: createdKoi.description,
        image: createdKoi.image,
        farmId: createdKoi.farm.id,
      };
      console.log("created Koi after: ", koiUpdate);

      // //Nếu toạ Koi thành công thì upload ảnh
      if (file) {
        const downloadURL = await upFile(file, "kois"); // Tải file lên Firebase

        if (downloadURL) {
          // Cập nhật Koi với URL của ảnh
          koiUpdate.image = downloadURL;
          console.log("Koi image: ", koiUpdate.image);
          await api.put(`koi/${koiUpdate.id}`, koiUpdate);
        }
      }
      const finalNewKoi = {
        id: koiUpdate.id,
        koiName: koiUpdate.koiName,
        type: koiUpdate.type,
        price: koiUpdate.price,
        description: koiUpdate.description,
        image: koiUpdate.image,
        farm: createdKoi.farm,
      };
      console.log("koi new final: ", finalNewKoi);

      setKoiList((prevList) => [...prevList, finalNewKoi]);
      message.success("Koi created successfully");
    } catch (error) {
      message.error("Failed to create Koi");
      console.error("Failed to create Koi", error);
    } finally {
      setFile(null);
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
                <h2>{koi.koiName}</h2>
              </div>
              <div className="manager-koi-name">
                <h2>{koi.type}</h2>
              </div>
              <div className="manager-koi-name">
                <h2>{koi.price}</h2>
              </div>
              <Tooltip title={koi.description} placement="bottom">
                <p className="manager-koi-description">
                  {koi.description.length > 20
                    ? koi.description.substring(0, 20) + "..."
                    : koi.description}
                </p>
              </Tooltip>

              <div className="manager-koi-name">
                <h2>{koi.farm?.farmName || "No farm"}</h2>
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
                    defaultValue={currentKoi?.farm.farmName || "no farm"}
                    onChange={(value) => {
                      console.log(value);
                      setCurrentKoi({
                        ...currentKoi,
                        farm: koiFarmList.find((f) => f.id == value),
                      });
                      console.log(currentKoi);
                    }}
                    style={{ width: "100%" }}
                  >
                    {koiFarmList.map((farm) => (
                      <Select.Option key={farm.id} value={farm.id}>
                        {farm.farmName}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Image: </label>
                  <input
                    type="file"
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
                      <Select.Option key={farm.id} value={farm.id}>
                        {farm.farmName}
                      </Select.Option>
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
