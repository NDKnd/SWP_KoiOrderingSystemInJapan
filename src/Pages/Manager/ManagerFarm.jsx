import { message, Modal } from "antd";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { useEffect, useState } from "react";
import "./ManagerFarm.css";
import api from "../../services/axios";
import upFile from "../../utils/file";

const ManagerFarm = () => {
  const [search, setSearch] = useState("");
  const [koiFarmList, setKoiFarmList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKoiFarm, setCurrentKoiFarm] = useState(null);

  const [newFarm, setNewFarm] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchKoiFarmData = async () => {
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
    fetchKoiFarmData();
  }, []);

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
      // Update Koi data via API
      await api.put(`farm/${currentKoiFarm.id}`, currentKoiFarm);
      setKoiFarmList((prevList) =>
        prevList.map((farm) =>
          farm.id === currentKoiFarm.id ? currentKoiFarm : farm
        )
      );
      message.success(
        `Koi Farm ${currentKoiFarm.farmName}
        updated successfully`
      );
    } catch (err) {
      if (err.response.status === 404) {
        message.error("Koi Farm not found");
      }
      message.error("Failed to update Koi Farm data");
    } finally {
      setIsModalOpen(false);
      setCurrentKoiFarm(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("farm id: ", id);
      // Delete Koi data via API
      const response = await api.delete(`farm/${id}`);
      console.log("response: ", response);
      // Remove Koi from state
      setKoiFarmList((prevList) => prevList.filter((farm) => farm.id !== id));
      message.success("Koi Farm deleted successfully");
    } catch (err) {
      message.error("Failed to delete Koi Farm data");
      console.error(err);
    }
  };

  const handleCreateFarm = () => {
    setIsCreateModalOpen((prev) => !prev);
  };

  // State để lưu trữ file trước khi upload
  const [file, setFile] = useState(null);
  // Hàm xử lý khi chọn file
  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile); // Lưu file đã chọn vào state

    const downloadURL = await upFile(selectedFile, "farms"); // Gọi hàm upFile để upload và lấy URL

    if (downloadURL) {
      setNewFarm((prevFarm) => ({ ...prevFarm, image: downloadURL })); // Gán URL vào newFarm.image
      message.success("File uploaded successfully!");
    } else {
      message.error("File upload failed.");
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      console.log("newFarm: ", newFarm);
      const newFarm2 = {
        farmName: newFarm.farmName,
        location: newFarm.location,
        description: newFarm.description,
        phone: newFarm.phone || "",
        email: newFarm.email || "",
        image: newFarm.image,
      };
      console.log("farm after: ", newFarm2);
      const response = await api.post("farm", newFarm2);
      setKoiFarmList((prevList) => [...prevList, response.data]);
      message.success("New farm created successfully");
      // Reset form sau khi submit thành công
      setNewFarm({
        farmName: "",
        location: "",
        description: "",
        phone: "",
        email: "",
        image: "",
      });
    } catch (err) {
      console.error(err.response.data);
      message.error(err.response.data);
    } finally {
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
                    <h2>{farm.farmName}</h2>
                  </div>

                  <div className="manager-farm-description">
                    <p>{farm.description}</p>
                  </div>

                  {/* phone  */}
                  <div className="manager-farm-description">
                    <p>{farm.phone}</p>
                  </div>

                  {/* email  */}
                  <div className="manager-farm-description">
                    <p>{farm.email}</p>
                  </div>

                  <div className="manager-farm-location">
                    <p>Location: {farm.location}</p>
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
                        name: e.target.value,
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
                {/* <div className="edit-detail-manager-koi">
                  <label>Image URL: </label>
                  <input
                    type="text"
                    value={currentKoiFarm.image}
                    onChange={(e) =>
                      setCurrentKoiFarm({
                        ...currentKoiFarm,
                        image: e.target.value,
                      })
                    }
                  />
                </div> */}
                <div className="edit-detail-manager-koi">
                  <label>Upload Image: </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files[0])} // Xử lý file upload
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
                {/* <div className="edit-detail-manager-koi">
                  <label>Image URL: </label>
                  <input
                    type="text"
                    value={newFarm?.image || ""}
                    onChange={(e) =>
                      setNewFarm({ ...newFarm, image: e.target.value })
                    }
                  />
                </div> */}
                <div className="edit-detail-manager-koi">
                  <label>Upload Image: </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files[0])} // Xử lý file upload
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
