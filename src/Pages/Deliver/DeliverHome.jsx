import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import "./DeliverHome.css";
import { MdOutlineCalendarMonth, MdOutlinePendingActions } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { message } from "antd";
import dayjs from "dayjs";
import upFile from "../../utils/file";
import storage from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";

const DeliverHome = () => {
    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [uploadedOrderImage, setUploadedOrderImage] = useState(null);
    const [orderFile, setOrderFile] = useState(null);


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

    const today = dayjs();
    const currentMonth = today.month() + 1;
    const currentYear = today.year();
    const currentDay = today.date();

    const ordersThisMonth = orderList.filter(order => {
        const deliveryDate = dayjs(order.expectedDate, "YYYY-MM-DD");
        return deliveryDate.month() + 1 === currentMonth && deliveryDate.year() === currentYear;
    });

    const pendingOrdersThisMonth = ordersThisMonth.filter(order => order.status === "ON_DELIVERY");
    const pendingOrdersToday = pendingOrdersThisMonth.filter(order => {
        const deliveryDate = dayjs(order.expectedDate, "YYYY-MM-DD");
        return deliveryDate.date() === currentDay && deliveryDate.month() + 1 === currentMonth && deliveryDate.year() === currentYear;
    });

    const todayDate = dayjs().format("YYYY-MM-DD");
    const filteredOrderList = orderList.filter(order =>
        order.expectedDate === todayDate && order.status === "ON_DELIVERY"
    );


    const handleDetail = (order) => {
        setCurrentOrder(order);
        setIsModalOpen((prevState) => !prevState);
    }

    const handleDetailComplete = async (event) => {
        event.preventDefault();

        const dataToSend = {
            image: uploadedOrderImage || "",
        };

        try {
            const res = await api.put(`order/${currentOrder.id}`, dataToSend);
            if (res.status >= 200 && res.status < 300) {
                setOrderList((prevList) => prevList.filter((order) => order.id !== currentOrder.id));
                message.success("Order completed successfully");
            } else {
                message.error("Failed to complete the order");
            }
        } catch (err) {
            message.error(err.response?.data?.message || "Error completing the order");
        }
    };


    const handleOrderUploadChange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setUploadedOrderImage(reader.result);
        };
        setOrderFile(file);
        console.log("Order image : ", file);
    };

    const handleOrderCheckIn = async () => {
        const downloadURL = await upFile(orderFile, `Orders/${currentOrder.id}`);

        if (downloadURL) {
            try {
                const res = await api.put(`order/${currentOrder.id}`, {
                    image: downloadURL,
                });
                message.success("Image uploaded and order updated successfully!");
            } catch (error) {
                console.error("Error updating order:", error);
            }
        }
        setOrderFile(null);
    };

    const handleCompleteClick = async (e) => {
        e.preventDefault();
        if (orderFile) {
            await handleOrderCheckIn();
        }

        // await handleDetailComplete(e);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="manager-dashboard-title">
                <h3>WELCOME DELIVER</h3>
            </div>

            <div className="deliver-dashboard-card">
                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-1">
                    <div className="deliver-dashborad-card-title">
                        <h3>Total Orders For This Month</h3>
                        <MdOutlineCalendarMonth className="deliver-dashborad-card-title-icon" />
                    </div>
                    <h1>{ordersThisMonth.length}</h1>
                </div>

                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-2">
                    <div className="deliver-dashborad-card-title">
                        <h3>Pending Orders This Month</h3>
                        <MdOutlinePendingActions className="deliver-dashborad-card-title-icon" />
                    </div>
                    <h1>{pendingOrdersThisMonth.length}</h1>
                </div>

                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-3">
                    <div className="deliver-dashborad-card-title">
                        <h3>Orders Today</h3>
                        <FaTasks className="deliver-dashborad-card-title-icon" />
                    </div>
                    <h1>{pendingOrdersToday.length}</h1>
                </div>
            </div>

            <div className="deliver-dashboard-home-content">
                {loading ? (
                    <div className="loading-spinner">
                        Loading...
                    </div>
                ) : (
                    <div className="deliver-dashboard-home-content-user">
                        <div className="deliver-dashboard-home-content-user-card-item">
                            <h3>Orders for today</h3>
                        </div>
                        <table>
                            <thead className="deliver-dashboard-home-content-user-header">
                                <tr>
                                    <th className="deliver-dashboard-home-content-user-header-1">Customer name</th>
                                    <th className="deliver-dashboard-home-content-user-header-2">Koi ordered</th>
                                    <th className="deliver-dashboard-home-content-user-header-3">Quantity</th>
                                    <th className="deliver-dashboard-home-content-user-header-4">Address</th>
                                    <th className="deliver-dashboard-home-content-user-header-5">Delivery date</th>
                                    <th className="deliver-dashboard-home-content-user-header-6">Total Payment</th>
                                    <th className="deliver-dashboard-home-content-user-header-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="deliver-dashboard-home-content-user-body">
                                {filteredOrderList.length > 0 ? (
                                    filteredOrderList.map((order) => (
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
                                            <td>{order?.booking?.account?.address || 'N/A'}</td>
                                            <td>{order.expectedDate}</td>
                                            <td>{order.price} VND</td>
                                            <td className="deliver-dashboard-home-content-user-body-button-box">
                                                <a onClick={() => handleDetail(order)} className="deliver-dashboard-home-content-user-body-button">Detail</a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>No orders for today</td>
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
                                <form onSubmit={handleDetailComplete} className="manager-order-edit-detail">
                                    <div className="manager-order-content-detail">
                                        <label>Customer Name: {currentOrder.booking.account.firstName} {currentOrder.booking.account.lastName}</label>
                                    </div>
                                    <div className="manager-order-content-detail">
                                        <label>Address: {currentOrder.booking.account.address}</label>
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
                                        <label>Delivery Date: {currentOrder.expectedDate}</label>
                                    </div>
                                    <div className="manager-order-content-detail">
                                        <label>Total Payment: {currentOrder.price} VND</label>
                                    </div>
                                    <div>
                                        <input type="file" accept="image/*" onChange={(e) => handleOrderUploadChange(e)} />
                                        {uploadedOrderImage && (
                                            <div className="uploaded-image-container">
                                                <img className="ticket-img" src={uploadedOrderImage} alt="Uploaded" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="manager-order-content-detail-button">
                                        <button
                                            type="submit"
                                            className="manager-order-content-detail-button-pop"
                                            onClick={handleCompleteClick}
                                        >
                                            Complete
                                        </button>
                                        <button
                                            className="manager-order-content-detail-button-pop"
                                            onClick={() => {
                                                setIsModalOpen((prevState) => !prevState);
                                                setCurrentOrder(null);
                                                setUploadedOrderImage(null);
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

export default DeliverHome;
