import { Layout } from "antd";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import React, { useEffect, useState } from "react";
import "./ManagerFarm.css";
import axios from "axios";

const ManagerFarm = () => {
  const [search, setSearch] = useState("");
  const [koiFarmList, setKoiFarmList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKoiFarm, setCurrentKoiFarm] = useState(null);

  const [newFarm, setNewFarm] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchKoiFarmData = async () => {
      try {
        axios.get("https://66faa67eafc569e13a9ca1fc.mockapi.io/farm")
          .then(response => setKoiFarmList(response.data)
          )
      } catch (err) {
        setError("Failed to fetch Koi Farm data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchKoiFarmData();
  }, []);

  if (error) return <p>{error}</p>;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredKoiFarmList = koiFarmList.filter(koiFarm =>
    koiFarm.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (farm) => {
    setCurrentKoiFarm(farm);
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      // Update Koi data via API
      await axios.put(`https://66faa67eafc569e13a9ca1fc.mockapi.io/farm/${currentKoiFarm.id}`, currentKoiFarm);
      setKoiFarmList((prevList) => prevList.map(farm => (farm.id === currentKoiFarm.id ? currentKoiFarm : farm)));
    } catch (err) {
      console.error("Failed to update Koi Farm data", err);
    } finally {
      setIsModalOpen(false);
      setCurrentKoiFarm(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete Koi data via API
      await axios.delete(`https://66faa67eafc569e13a9ca1fc.mockapi.io/farm/${id}`);

      // Update Koi list state to remove the deleted Koi
      setKoiFarmList((prevList) => prevList.filter(farm => farm.id !== id));
    } catch (err) {
      console.error("Failed to delete Koi Farm data", err);
    }
  };

  const handleCreateFarm = () => {
    setIsCreateModalOpen(true);
  }

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`https://66faa67eafc569e13a9ca1fc.mockapi.io/farm`, newFarm);
      setKoiFarmList((prevList) => [...prevList, newFarm]);
    } catch (err) {
      console.error("Failed to create new Koi Farm", err);
    } finally {
      setIsCreateModalOpen(false);
      setNewFarm(null);
    }
  };

  return (
    <>
      <div className="manager-farm-create-search">
        <button
          title="Add new Koi farm"
          className="manager-farm-create-search-button"
          onClick={() => handleCreateFarm()}><MdOutlineCreateNewFolder
            className="manager-farm-create-search-icon" /></button>
        <input
          type="text"
          placeholder="Search Koi farm by name... "
          value={search}
          onChange={handleSearchChange}
          className="search-bar-manager-farm"
        ></input>
      </div>
      <div className="koiFarmList">
        {filteredKoiFarmList.length == 0 && search.length == 0 ?
          <p style={{ display: 'flex', justifyContent: 'center', fontSize: '2em', }}>
            Loading... {search}
          </p> : filteredKoiFarmList.length == 0 ?
            <p style={{ display: 'flex', justifyContent: 'center', fontSize: '2em', }}>
              There are no Koi Farm with name {search}
            </p> : filteredKoiFarmList.map((farm) => (
              <div className="manager-farm-card" key={farm.id}>
                <div className="manager-farm-img">
                  <img src={farm.image}></img>
                </div>
                <div className="manager-farm-text">
                  <div className="manager-farm-content">
                    <div className="manager-farm-name">
                      <h2>{farm.name}</h2>
                    </div>

                    <div className="manager-farm-description">
                      <p>{farm.description}</p>
                    </div>

                    <div className="manager-farm-location">
                      <p>Address: {farm.location}</p>
                    </div>

                    <div className="manager-farm-button">
                      <button onClick={() => handleEdit(farm)}>Edit</button>
                      <button onClick={() => {
                        if (window.confirm("Do you really want to delete?")) {
                          handleDelete(farm.id);
                        }
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

        {isModalOpen && currentKoiFarm && (
          <div className="manager-farm-modal">
            <div className="manager-koi-modal-content">
              <h2 className="manager-farm-title-edit">Edit Koi Farm</h2>
              <form onSubmit={handleSave} className="edit-manager-koi-contents">
                <div className="edit-detail-manager-koi">
                  <label>Koi Farm Name: </label>
                  <input
                    type="text"
                    value={currentKoiFarm.name}
                    onChange={(e) => setCurrentKoiFarm({ ...currentKoiFarm, name: e.target.value })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Description: </label>
                  <textarea
                   value={currentKoiFarm.description}
                   onChange={(e) => setCurrentKoiFarm ({ ...currentKoiFarm, description: e.target.value})}
                   />
                </div>
                <div className="edit-detail-manager-koi">
                    <label>Address: </label>
                    <input 
                      type="text"
                      value={currentKoiFarm.location}
                      onChange={(e) => setCurrentKoiFarm({ ...currentKoiFarm, location: e.target.value})}
                    />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Image URL: </label>
                  <input
                    type="text"
                    value={currentKoiFarm.image}
                    onChange={(e) => setCurrentKoiFarm({ ...currentKoiFarm, image: e.target.value })}
                  />
                </div>
                <div className="popup-but-edit-manager-koi">
                  <button className="manager-farm-button-popup" type="submit">Save</button>
                  <button className="manager-farm-button-popup" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isCreateModalOpen && (
          <div className="manager-farm-modal">
          <div className="manager-koi-modal-content">
            <h2 className="manager-farm-title-edit">Add new Koi Farm</h2>
            <form onSubmit={handleCreate} className="edit-manager-koi-contents">
              <div className="edit-detail-manager-koi">
                <label>Koi Farm Name: </label>
                <input
                  type="text"
                  value={newFarm?.name || ""}
                  onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                />
              </div>
              <div className="edit-detail-manager-koi">
                <label>Description: </label>
                <textarea
                 value={newFarm?.description || ""}
                 onChange={(e) => setNewFarm ({ ...newFarm, description: e.target.value})}
                 />
              </div>
              <div className="edit-detail-manager-koi">
                  <label>Address: </label>
                  <input 
                    type="text"
                    value={newFarm?.location || ""}
                    onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value})}
                  />
              </div>
              <div className="edit-detail-manager-koi">
                <label>Image URL: </label>
                <input
                  type="text"
                  value={newFarm?.image || ""}
                  onChange={(e) => setNewFarm({ ...newFarm, image: e.target.value })}
                />
              </div>
              <div className="popup-but-edit-manager-koi">
                <button className="manager-farm-button-popup" type="submit">Create</button>
                <button className="manager-farm-button-popup" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
        )}
      </div>
    </>
  )
};

export default ManagerFarm;
