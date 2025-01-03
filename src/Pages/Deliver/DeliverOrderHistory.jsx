import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import "./DeliverHome.css";
import { message } from "antd";
import dayjs from "dayjs";

const DeliverOrderHistory = () => {
    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const orderResponse = await api.get("order/manager");
                setOrderList(orderResponse.data);
            } catch (err) {
                console.error(err);
                message.error("Cannot fetch some of the data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredOrderListComplete = orderList
        .filter(order => order.status === "COMPLETED")
        .sort((a, b) => dayjs(b.deliveredDate).diff(dayjs(a.deliveredDate)));

    const handleDetail = (order) => {
        setCurrentOrder(order);
        setIsModalOpen((prevState) => !prevState);
    }

    const handleImageClick = () => {
        setIsImagePopupOpen(true);
    };

    const handleCloseImagePopup = (e) => {
        if (e.target === e.currentTarget) {
            setIsImagePopupOpen(false);
        }
    };

    return (
        <>
            <div className="deliver-dashboard-home-content">
                {loading ? (
                    <div className="loading-spinner">
                        Loading...
                    </div>
                ) : (
                    <div className="deliver-dashboard-home-content-user">
                        <div className="deliver-dashboard-home-content-user-card-item-3">
                            <h3>Completed Order ({filteredOrderListComplete.length})</h3>
                        </div>
                        <table>
                            <thead className="deliver-dashboard-home-content-user-header">
                                <tr>
                                    <th className="deliver-dashboard-home-content-user-header-1">Customer name</th>
                                    <th className="deliver-dashboard-home-content-user-header-2">Koi ordered</th>
                                    <th className="deliver-dashboard-home-content-user-header-3">Quantity</th>
                                    <th className="deliver-dashboard-home-content-user-header-4">Address</th>
                                    <th className="deliver-dashboard-home-content-user-header-5">Delivery date</th>
                                    <th className="deliver-dashboard-home-content-user-header-6">Total Payment </th>
                                    <th className="deliver-dashboard-home-content-user-header-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="deliver-dashboard-home-content-user-body">
                                {filteredOrderListComplete.length > 0 ? (
                                    filteredOrderListComplete.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.booking.account.firstName} {order.booking.account.lastName}</td>
                                            <td>
                                                {order.orderDetailResponseList && order.orderDetailResponseList.length > 0 ? (
                                                    order.orderDetailResponseList.map((detail, index) => (
                                                        <div key={index}>{detail.koiFishResponse.koiName}</div>
                                                    ))
                                                ) : (
                                                    <div>No koi ordered</div>
                                                )}
                                            </td>
                                            <td>
                                                {order.orderDetailResponseList.map((detail, index) => (
                                                    <div key={index}>{detail.quantity}</div>
                                                ))}
                                            </td>
                                            <td>{order.address}</td>
                                            <td>{order.deliveredDate ? order.deliveredDate.split('T')[0] : "N/A"}</td>
                                            <td>{order.price}</td>
                                            <td className="deliver-dashboard-home-content-user-body-button-box">
                                                <a onClick={() => handleDetail(order)} className="deliver-dashboard-home-content-user-body-button">Detail</a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>No orders</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>)}
                {
                    isModalOpen && currentOrder && (
                        <div className="manager-order-modal">
                            <div className="manager-order-modal-content">
                                <h2 className="manager-order-title-detail">Order Detail</h2>
                                <form className="manager-order-edit-detail">
                                    <div className="manager-order-content-detail">
                                        <label>Customer Name: {currentOrder.booking.account.firstName} {currentOrder.booking.account.lastName}</label>
                                    </div>
                                    <div className="manager-order-content-detail">
                                        <label>Address: {currentOrder.address}</label>
                                    </div>
                                    <table className="manager-order-table-detail">
                                        <thead>
                                            <tr>
                                                <th>Koi Name</th>
                                                <th>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrder.orderDetailResponseList && currentOrder.orderDetailResponseList.length > 0 ? (
                                                currentOrder.orderDetailResponseList.map((detail, index) => (
                                                    <tr key={index}>
                                                        <td>{detail.koiFishResponse.koiName}</td>
                                                        <td>{detail.quantity}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td>No koi available</td>
                                                    <td>-</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="manager-order-content-detail">
                                        <td>{currentOrder.deliveredDate ? currentOrder.deliveredDate.split('T')[0] : "N/A"}</td>
                                    </div>
                                    <div className="manager-order-content-detail">
                                        <label>Total Payment: {currentOrder.price}</label>
                                    </div>
                                    <div>
                                        <div className="deliver-uploaded-image-container">
                                            <img className="ticket-img" src={currentOrder.image} alt="Uploaded" onClick={handleImageClick} />
                                        </div>
                                        {isImagePopupOpen && (
                                            <div className="deliver-image-popup" onClick={handleCloseImagePopup}>
                                                <img className="deliver-popup-image" src={currentOrder.image} alt="Popup" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="manager-order-content-detail-button">
                                        <button
                                            className="manager-order-content-detail-button-pop"
                                            onClick={() => {
                                                setIsModalOpen((prevState) => !prevState);
                                                setCurrentOrder(null);
                                            }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
};

export default DeliverOrderHistory;
