import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import "./ManagerHome.css";
import { FaFishFins, FaUser } from "react-icons/fa6";
import { PiFarmFill } from "react-icons/pi";
import { GiJourney } from "react-icons/gi";

const ManagerHome = () => {
    const [koiFarmList, setKoiFarmList] = useState([]);
    const [koiList, setKoiList] = useState([]);
    const [tripList, setTripList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [farmsResponse, koiResponse, tripsResponse, userResponse] = await Promise.all([
                    api.get("farm"),
                    api.get("koi"),
                    api.get("trip"),
                    api.get("account")
                ]);

                setKoiFarmList(farmsResponse.data);
                setKoiList(koiResponse.data);
                setTripList(tripsResponse.data);
                setUserList(userResponse.data);
            } catch (err) {
                console.error(err);
                message.error("Cannot fetch some of the data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="manager-dashboard-title">
                <h3>WELCOME ADMIN</h3>
            </div>

            <div className="manager-dashboard-card">
                <div className="manager-dashboard-card-item" id="manager-dashboard-card-item-1">
                    <div className="manager-dashborad-card-title">
                        <h3>KOI FARM</h3>
                        <PiFarmFill className="manager-dashborad-card-title-icon" />
                    </div>
                    <h1>{koiFarmList.length}</h1>
                </div>

                <div className="manager-dashboard-card-item" id="manager-dashboard-card-item-2">
                    <div className="manager-dashborad-card-title">
                        <h3>KOI FISH</h3>
                        <FaFishFins className="manager-dashborad-card-title-icon" />
                    </div>
                    <h1>{koiList.length}</h1>
                </div>

                <div className="manager-dashboard-card-item" id="manager-dashboard-card-item-3">
                    <div className="manager-dashborad-card-title">
                        <h3>KOI TRIP</h3>
                        <GiJourney className="manager-dashborad-card-title-icon" />
                    </div>
                    <h1>{tripList.length}</h1>
                </div>
                
                <div className="manager-dashboard-card-item" id="manager-dashboard-card-item-4">
                    <div className="manager-dashborad-card-title">
                        <h3>USERS</h3>
                        <FaUser className="manager-dashborad-card-title-icon" />
                    </div>
                    <h1>{userList.length}</h1>
                </div>
            </div>

            <div className="manager-dashboard-home-content">
                <div className="manager-dashboard-home-content-user">
                    <h3>User List</h3>
                    <table>
                        <thead className="manager-dashboard-home-content-user-header">
                            <tr>
                                <th className="manager-dashboard-home-content-user-header-1">Username</th>
                                <th className="manager-dashboard-home-content-user-header-2">First Name</th>
                                <th className="manager-dashboard-home-content-user-header-3">Last Name</th>
                                <th className="manager-dashboard-home-content-user-header-4">Email</th>
                                <th className="manager-dashboard-home-content-user-header-5">Number of Orders</th>
                                <th className="manager-dashboard-home-content-user-header-6">Total Payment ($)</th>
                            </tr>
                        </thead>
                        <tbody className="manager-dashboard-home-content-user-body">
                            {userList.map((user, index) => (
                                <tr key={user.userid}>{/*kiem tra id da dung chua*/}
                                    <td>{user.username}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.numberOfOrder}</td>
                                    <td>{user.totalPayment}</td>                              
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManagerHome;
