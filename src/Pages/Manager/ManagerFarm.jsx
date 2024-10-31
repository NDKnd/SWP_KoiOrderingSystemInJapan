import { message, Modal, Tooltip } from "antd";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { useEffect, useState } from "react";
import "./ManagerFarm.css";
import api from "../../services/axios";
import upFile from "../../utils/file";
import storage from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";

const ManagerFarm = () => {
  const [file, setFile] = useState(null); // State để lưu trữ file trước khi upload
  const [search, setSearch] = useState("");
  const [koiFarmList, setKoiFarmList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKoiFarm, setCurrentKoiFarm] = useState(null);

  const [newFarm, setNewFarm] = useState({
    farmName: "",
    location: "",
    description: "",
    phone: "",
    email: "",
    image: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchKoiFarmData = async () => {
      try {
        setLoading(true);
        const response = await api.get("farm");
        console.log(response);
        setKoiFarmList(response.data);
        console.log("koiFarmList: ", response.data);
        // message.success("Fetch farm data successfully");
      } catch (err) {
        console.log(err);
        message.error("Cannot fetch farm data");
      } finally {
        setLoading(false);
      }
    };
    fetchKoiFarmData();
  }, []);

  const deleteImage = async (url) => {
    if (url) {
      const ImageRef = ref(storage, url);
      await deleteObject(ImageRef);
    }
  };
  // const handleCancelCreate = () => {

  // };

  // if (error) return <p>{error}</p>;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredKoiFarmList = Array.isArray(koiFarmList)
    ? koiFarmList.filter((koiFarm) =>
      koiFarm.farmName.toLowerCase().includes(search.toLowerCase())
    )
    : [];
  // const filteredKoiFarmList = koiFarmList.filter((koiFarm) =>
  //   koiFarm.name.toLowerCase().includes(search.toLowerCase())
  // );

  const handleEdit = (farm) => {
    setCurrentKoiFarm(farm);
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      console.log("KoiFarm before edit: ", currentKoiFarm);

      // Lưu lại URL của ảnh cũ
      let oldImageUrl = koiFarmList.find(
        (koiFarm) => koiFarm.id === currentKoiFarm.id
      ).image;
      console.log("file:", file);
      console.log("oldImageUrl: ", oldImageUrl);

      const response = await api.put(
        `farm/${currentKoiFarm.id}`,
        currentKoiFarm
      );
      console.log("res after edit: ", response.data);
      // Nếu edit farm này thanh cong, tiến hành upload ảnh
      if (file) {
        let failURL = "";
        try {
          const newImageUrl = await upFile(file, "farms");
          console.log("newImageUrl: ", newImageUrl);
          // Cập nhật farm với URL ảnh
          if (newImageUrl) {
            // Cập nhật farm với URL ảnh
            failURL = newImageUrl;
            currentKoiFarm.image = newImageUrl;
            const res = await api.put(
              `farm/${currentKoiFarm.id}`,
              currentKoiFarm
            );
            const newFarmWithNewImage = res.data;
            console.log(
              "after edit farm with new image: ",
              newFarmWithNewImage
            );

            console.log("oldImageUrl: ", oldImageUrl);
            console.log("newImageUrl: ", newImageUrl);
            //after split
            const oldURL = oldImageUrl.split("&")[0];
            const newURL = newImageUrl.split("&")[0];
            console.log("old: ", oldURL);
            console.log("new: ", newURL);
            console.log("is the same ", oldURL === newURL);
            // Xóa ảnh cũ nếu có
            if (oldImageUrl && oldURL !== newURL) {
              deleteImage(oldImageUrl);
            }
            setKoiFarmList((prevList) =>
              prevList.map((farm) =>
                farm.id === newFarmWithNewImage.id ? newFarmWithNewImage : farm
              )
            );
            message.success("Koi Farm updated successfully");
            return;
          }
        } catch (error) {
          failURL !== "" && deleteImage(failURL);
          message.error("Failed to upload image");
          console.error("Error uploading image:", error);
        }
      }
      setKoiFarmList((prevList) =>
        prevList.map((farm) =>
          farm.id === currentKoiFarm.id ? currentKoiFarm : farm
        )
      );
      console.log("KoiFarm after edit final: ", currentKoiFarm);
      message.success("Koi Farm updated successfully");
    } catch (err) {
      if (err.response.status === 404) {
        message.error("Koi Farm not found");
      }
      message.error("Failed to update Koi Farm data");
    } finally {
      setIsModalOpen(false);
      setFile(null);
      setCurrentKoiFarm(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("farm id: ", id);
      // Lưu lại URL của ảnh
      const ImageUrl = koiFarmList.find((farm) => farm.id === id).image;
      console.log("ImageUrl of farm to delete: ", ImageUrl);
      // Delete Koi data via API
      const response = await api.delete(`farm/${id}`);
      console.log("res after delete: ", response.data);
      // Xóa ảnh cũ nếu có
      if (ImageUrl) {
        deleteImage(ImageUrl);
      }
      // Remove farm from state
      setKoiFarmList((prevList) => prevList.filter((farm) => farm.id !== id));
      message.success("Koi Farm deleted successfully");
    } catch (err) {
      setFile(null);
      message.error("Failed to delete Koi Farm data");
      console.error(err);
    }
  };

  const handleCreateFarm = () => {
    setIsCreateModalOpen((prev) => !prev);
  };

  const handleFileChange = async (selectedFile) => {
    console.log("file image: ", selectedFile);
    setFile(selectedFile);
  };
  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      console.log("newfarm before: ", newFarm);

      console.log("file:", file);

      const response = await api.post("farm", newFarm);

      const createdFarm = response.data;
      console.log("created farm: ", createdFarm);

      // Nếu tạo farm thành công, tiến hành upload ảnh
      // Kiểm tra có file để upload hay không?
      if (file) {
        const downloadURL = await upFile(file, `farms/${newFarm.id}`); // Tải file lên Firebase

        if (downloadURL) {
          // Cập nhật farm với URL của ảnh
          createdFarm.image = downloadURL;
          console.log("createdFarm.image: ", createdFarm.image);
          await api.put(`farm/${createdFarm.id}`, createdFarm); // Cập nhật lại farm với URL ảnh
        }
      }

      setKoiFarmList((prevList) => [...prevList, createdFarm]);
      message.success("Koi Farm created successfully");
    } catch (err) {
      console.error(err.response.data);
      message.error(err.response.data + " ! ");
    } finally {
      setFile(null);
      setNewFarm(null);
      handleCreateFarm(); //dong modal create farm
    }
  };

  return (
    <>
      <div className="manager-farm-create-search">
        <button
          title="Add new Koi farm"
          className="manager-farm-create-search-button"
          onClick={() => handleCreateFarm()}
        >
          <MdOutlineCreateNewFolder className="manager-farm-create-search-icon" />
        </button>
        <input
          type="text"
          placeholder="Search Koi farm by name... "
          value={search}
          onChange={handleSearchChange}
          className="search-bar-manager-farm"
        ></input>
      </div>
      <div className="koiFarmList">
        {filteredKoiFarmList.length == 0 && search.length == 0 ? (
          <h3
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "2em",
            }}
          >
            There are no Koi Farm
          </h3>
        ) : filteredKoiFarmList.length == 0 ? (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "2em",
            }}
          >
            There are no Koi Farm with name {search}
          </p>
        ) : (
          filteredKoiFarmList.map((farm) => (
            <div className="manager-farm-card" key={farm.id}>
              <div className="manager-farm-img">
                <img src={farm.image}></img>
              </div>
              <div className="manager-farm-text">
                <div className="manager-farm-content">
                  <div className="manager-farm-name">
                    <h1>{farm.farmName}</h1>
                  </div>

                  <Tooltip title={farm.description} placement="bottom">
                    <p className="manager-farm-description">
                      <b>Descriptions: </b>
                      {farm.description.length > 40
                        ? farm.description.substring(0, 40) + "..."
                        : farm.description}
                    </p>
                  </Tooltip>

                  {/* phone  */}
                  <div className="manager-farm-description">
                    <p>
                      <b>Phone: </b> {farm.phone}
                    </p>
                  </div>

                  {/* email  */}
                  <div className="manager-farm-description">
                    <p>
                      <b>Email: </b> {farm.email}
                    </p>
                  </div>

                  <div className="manager-farm-location">
                    <p>
                      <b>Location: </b> {farm.location}
                    </p>
                  </div>

                  <div className="manager-farm-button">
                    <button onClick={() => handleEdit(farm)}>Edit</button>
                    <button
                      onClick={() => {
                        Modal.confirm({
                          title: "Do you really want to delete?",
                          onOk: () => handleDelete(farm.id),
                          okText: "Delete",
                          cancelText: "Cancel",
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isModalOpen && currentKoiFarm && (
          <div className="manager-farm-modal">
            <div className="manager-koi-modal-content">
              <h2 className="manager-farm-title-edit">Edit Koi Farm</h2>
              <form onSubmit={handleSave} className="edit-manager-koi-contents">
                <div className="edit-detail-manager-koi">
                  <label>Koi Farm Name: </label>
                  <input
                    type="text"
                    value={currentKoiFarm.farmName}
                    onChange={(e) =>
                      setCurrentKoiFarm({
                        ...currentKoiFarm,
                        farmName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Location: </label>
                  <input
                    type="text"
                    value={currentKoiFarm.location}
                    onChange={(e) =>
                      setCurrentKoiFarm({
                        ...currentKoiFarm,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Description: </label>
                  <textarea
                    value={currentKoiFarm.description}
                    onChange={(e) =>
                      setCurrentKoiFarm({
                        ...currentKoiFarm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="edit-detail-manager-koi">
                  <label>Phone: </label>
                  <input
                    type="text"
                    value={currentKoiFarm.phone}
                    onChange={(e) =>
                      setCurrentKoiFarm({
                        ...currentKoiFarm,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Email: </label>
                  <input
                    type="text"
                    value={currentKoiFarm.email}
                    onChange={(e) =>
                      setCurrentKoiFarm({
                        ...currentKoiFarm,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Upload Image: </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </div>
                <div className="popup-but-edit-manager-koi">
                  <button className="manager-farm-button-popup" type="submit">
                    Save
                  </button>
                  <button
                    className="manager-farm-button-popup"
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
          <div className="manager-farm-modal">
            <div className="manager-koi-modal-content">
              <h2 className="manager-farm-title-edit">Add new Koi Farm</h2>
              <form
                onSubmit={handleCreate}
                className="edit-manager-koi-contents"
              >
                <div className="edit-detail-manager-koi">
                  <label>Koi Farm Name: </label>
                  <input
                    type="text"
                    value={newFarm?.farmName || ""}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, farmName: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Koi Farm location: </label>
                  <input
                    type="text"
                    value={newFarm?.location || ""}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, location: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Description: </label>
                  <textarea
                    value={newFarm?.description || ""}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, description: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Phone: </label>
                  <input
                    type="text"
                    value={newFarm?.phone || ""}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, phone: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Email: </label>
                  <input
                    type="text"
                    value={newFarm?.email || ""}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, email: e.target.value })
                    }
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Upload Image: </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </div>
                <div className="popup-but-edit-manager-koi">
                  <button className="manager-farm-button-popup" type="submit">
                    Create
                  </button>
                  <button
                    className="manager-farm-button-popup"
                    type="button"
                    onClick={() => handleCreateFarm()}
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

export default ManagerFarm;
