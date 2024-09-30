
// import api from "./../../services/axios";
import "./ManagerKoi.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerKoi = () => {

  const [koiList, setKoiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKoi, setCurrentKoi] = useState(null);

  const [search, setSearch] = useState("");

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

  return (
    <>
      <input
        type="text"
        placeholder="Search Koi by name..."
        value={search}
        onChange={handleSearchChange}
        className="search-bar"
      ></input>
      <div className="koiList">
        {filteredKoiList.length == 0 && search.length == 0 ?
          <p style={{ display: 'flex', justifyContent: 'center', fontSize: '2em', }}>
            Loading... {search}
          </p> : filteredKoiList.length == 0 ?
            <p style={{ display: 'flex', justifyContent: 'center', fontSize: '2em', }}>
              There are no Koi with name {search}
            </p> : filteredKoiList.map((koi) => (
              <div className="koi-card" key={koi.id}>
                <div className="koi-img">
                  <img src={koi.image} alt={koi.name}></img>
                </div>
                <div className="koi-name">
                  <h2>{koi.name}</h2>
                </div>
                <div className="button">
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
          <div className="modal">
            <div className="modal-content">
              <h2 className="title">Edit Koi</h2>
              <form onSubmit={handleSave} className="edit-contents">
                <div className="edit-detail">
                  <label>ID: </label>
                  <input type="number" value={currentKoi.id} readOnly />
                </div>
                <div className="edit-detail">
                  <label>Koi Name: </label>
                  <input
                    type="text"
                    value={currentKoi.name}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, koiName: e.target.value })}
                  />
                </div>
                <div className="edit-detail">
                  <label>Type: </label>
                  <input
                    type="text"
                    value={currentKoi.type}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, type: e.target.value })}
                  />
                </div>
                <div className="edit-detail">
                  <label>Price: </label>
                  <input
                    type="number"
                    value={currentKoi.price}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, price: Number(e.target.value) })}
                  />
                </div>
                <div className="edit-detail">
                  <label>Description: </label>
                  <textarea
                    value={currentKoi.description}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, description: e.target.value })}
                  />
                </div>
                <div className="edit-detail">
                  <label>Image URL: </label>
                  <input
                    type="text"
                    value={currentKoi.image}
                    onChange={(e) => setCurrentKoi({ ...currentKoi, image: e.target.value })}
                  />
                </div>
                <div className="popup-but">
                  <button className="button-popup" type="submit">Save</button>
                  <button className="button-popup" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
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
