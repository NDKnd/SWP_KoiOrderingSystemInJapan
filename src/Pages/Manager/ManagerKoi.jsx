
// import api from "./../../services/axios";
import "./ManagerKoi.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineCreateNewFolder } from "react-icons/md";

const ManagerKoi = () => {

  const [koiList, setKoiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKoi, setCurrentKoi] = useState(null);

  const [search, setSearch] = useState("");
  const [newKoi, setNewKoi] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  useEffect(() => {
    const fetchKoiData = async () => {
      try {
        axios.get("https://66faa67eafc569e13a9ca1fc.mockapi.io/koi")
          .then(response => setKoiList(response.data)
          )
      } catch (err) {
        setError("Failed to fetch Koi data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchKoiData();
  }, []);

  if (error) return <p>{error}</p>;

  const handleEdit = (koi) => {
    setCurrentKoi(koi);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // Delete Koi data via API
      await axios.delete(`https://66faa67eafc569e13a9ca1fc.mockapi.io/koi/${id}`);

      // Update Koi list state to remove the deleted Koi
      setKoiList((prevList) => prevList.filter(koi => koi.id !== id));
    } catch (err) {
      console.error("Failed to delete Koi data", err);
    }
  };
  //update
  const handleSave = async (event) => {
    event.preventDefault();
    try {
      // Update Koi data via API
      await axios.put(`https://66faa67eafc569e13a9ca1fc.mockapi.io/koi/${currentKoi.id}`, currentKoi);
      setKoiList((prevList) => prevList.map(koi => (koi.id === currentKoi.id ? currentKoi : koi)));
    } catch (err) {
      console.error("Failed to update Koi data", err);
    } finally {
      setIsModalOpen(false);
      setCurrentKoi(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredKoiList = koiList.filter(koi =>
    koi.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateKoi = () => {
    setIsCreateModalOpen(true);
  }

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`https://66faa67eafc569e13a9ca1fc.mockapi.io/koi`, newKoi);
      setKoiList((prevList) => [...prevList, newKoi]);
    } catch (err) {
      console.error("Failed to create new Koi", err);
    } finally {
      setIsCreateModalOpen(false);
      setNewKoi(null);
    }
  };
  return (
    <>
      <div className="manager-koi-create-search">
        <button title="Create new Koi" className="manager-koi-create-search-button" onClick={() => handleCreateKoi()}><MdOutlineCreateNewFolder className="manager-koi-create-search-icon" /></button>
        <input
          type="text"
          placeholder="Search Koi by name... "
          value={search}
          onChange={handleSearchChange}
          className="search-bar-manager-koi"
        ></input>
      </div>

      <div className="koiList">
        {filteredKoiList.length == 0 && search.length == 0 ?
          <p style={{ display: 'flex', justifyContent: 'center', fontSize: '2em', }}>
            Loading... {search}
          </p> : filteredKoiList.length == 0 ?
            <p style={{ display: 'flex', justifyContent: 'center', fontSize: '2em', }}>
              There are no Koi with name {search}
            </p> : filteredKoiList.map((koi) => (
              <div className="manager-koi-card" key={koi.id}>
                <div className="manager-koi-img">
                  <img src={koi.image} alt={koi.name}></img>
                </div>
                <div className="manager-koi-name">
                  <h2>{koi.name}</h2>
                </div>
                <div className="manager-koi-button">
                  <button onClick={() => handleEdit(koi)}>Edit</button>
                  <button onClick={() => {
                    if (window.confirm("Do you really want to delete?")) {
                      handleDelete(koi.id);
                    }
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
        {isModalOpen && currentKoi && (
          <div className="manager-koi-modal">
            <div className="manager-koi-modal-content">
              <h2 className="manager-koi-title-edit">Edit Koi</h2>
              <form onSubmit={handleSave} className="edit-manager-koi-contents">
                <div className="edit-detail-manager-koi">
                  <label>Koi Name: </label>
                  <input
                    type="text"
                    value={currentKoi.name}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, name: e.target.value })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Type: </label>
                  <input
                    type="text"
                    value={currentKoi.type}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, type: e.target.value })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Price: </label>
                  <input
                    type="number"
                    value={currentKoi.price}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, price: Number(e.target.value) })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Description: </label>
                  <textarea
                    value={currentKoi.description}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, description: e.target.value })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Image URL: </label>
                  <input
                    type="text"
                    value={currentKoi.image}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, image: e.target.value })}
                  />
                </div>
                <div className="popup-but-edit-manager-koi">
                  <button className="manager-koi-button-popup" type="submit">Save</button>
                  <button className="manager-koi-button-popup" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isCreateModalOpen && (
          <div className="manager-koi-modal">
            <div className="manager-koi-modal-content">
              <h2 className="manager-koi-title-edit">Create Koi</h2>
              <form onSubmit={handleCreate} className="edit-manager-koi-contents">
                <div className="edit-detail-manager-koi">
                  <label>Koi Name: </label>
                  <input
                    type="text"
                    value={newKoi?.name || ""}
                    onChange={(e) => setNewKoi({ ...newKoi, name: e.target.value })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Type: </label>
                  <input
                    type="text"
                    value={newKoi?.type || ""}
                    onChange={(e) => setNewKoi({ ...newKoi, type: e.target.value })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Price: </label>
                  <input
                    type="number"
                    value={newKoi?.price || 0}
                    onChange={(e) => setNewKoi({ ...newKoi, price: Number(e.target.value) })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Description: </label>
                  <textarea
                    value={newKoi?.description || ""}
                    onChange={(e) => setNewKoi({ ...newKoi, description: e.target.value })}
                  />
                </div>
                <div className="edit-detail-manager-koi">
                  <label>Image URL: </label>
                  <input
                    type="text"
                    value={newKoi?.image || ""}
                    onChange={(e) => setNewKoi({ ...newKoi, image: e.target.value })}
                  />
                </div>
                <div className="popup-but-edit-manager-koi">
                  <button className="manager-koi-button-popup" type="submit">Create</button>
                  <button className="manager-koi-button-popup" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
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
