import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import "./DeliverHome.css";
import { message } from "antd";
import dayjs from "dayjs";

const DeliverPendingOrder = () => {
    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    const filteredOrderList = orderList
    .filter(order => order.status === "ON_DELIVERY")
    .sort((a, b) => dayjs(a.expectedDate).diff(dayjs(b.expectedDate)));

    const handleDetail = (order) => {
        setCurrentOrder(order);
        setIsModalOpen((prevState) => !prevState);
    }

    const handleDetailComplete = async (event) => {
        event.preventDefault();
        try {
            const res = await api.put(`order/${currentOrder.id}`);
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

    return (
        <>
            <div className="deliver-dashboard-home-content">
                {loading ? (
                    <div className="loading-spinner">
                        Loading...
                    </div>
                ) : (
                    <div className="deliver-dashboard-home-content-user">
                        <div className="deliver-dashboard-home-content-user-card-item-2">
                            <h3>Pending Order ({filteredOrderList.length})</h3>
                        </div>
                        <table>
                            <thead className="deliver-dashboard-home-content-user-header">
                                <tr>
                                    <th className="deliver-dashboard-home-content-user-header-1">Customer name</th>
                                    <th className="deliver-dashboard-home-content-user-header-2">Koi ordered</th>
                                    <th className="deliver-dashboard-home-content-user-header-3">Quantity</th>
                                    <th className="deliver-dashboard-home-content-user-header-4">Address</th>
                                    <th className="deliver-dashboard-home-content-user-header-5">Delivery date</th>
                                    <th className="deliver-dashboard-home-content-user-header-6">Total Payment ($)</th>
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
                                            <td>{order.booking.account.address}</td>
                                            <td>{order.expectedDate}</td>
                                            <td>{order.booking.totalPrice}</td>
                                            <td className="deliver-dashboard-home-content-user-body-button-box">
                                                <a onClick={() => handleDetail(order)} className="deliver-dashboard-home-content-user-body-button">Detail</a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>No orders on delivery</td>
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
                                        <label>Total Payment: ${currentOrder.booking.totalPrice}</label>
                                    </div>
                                    <div className="manager-order-content-detail-button">
                                        <button type="submit" className="manager-order-content-detail-button-pop">Complete</button>
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

export default DeliverPendingOrder;
