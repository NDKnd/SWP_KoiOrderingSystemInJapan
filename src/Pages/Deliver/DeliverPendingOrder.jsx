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

    const mockData = [
        {
            id: 1,
            customerName: "John Doe",
            address: "123 Main St",
            deliveryDate: "10/10/2024",
            totalPayment: 500.75,
            status: "pending",
            koiList: [
                { name: "Koi A", quantity: 3 },
                { name: "Koi A", quantity: 3 },
                { name: "Koi A", quantity: 3 },
                { name: "Koi B", quantity: 2 }
            ]
        },
        {
            id: 2,
            customerName: "Jane Smith",
            address: "456 Elm St",
            deliveryDate: "15/10/2024",
            totalPayment: 300.50,
            status: "completed",
            koiList: [
                { name: "Koi C", quantity: 1 },
            ]
        },
        {
            id: 3,
            customerName: "tt3",
            address: "456 Elm St",
            deliveryDate: "24/10/2024",
            totalPayment: 300.50,
            status: "completed",
            koiList: [
                { name: "Koi C", quantity: 1 },
                { name: "Koi C", quantity: 1 },
                { name: "Koi D", quantity: 5 }
            ]
        },
        {
            id: 4,
            customerName: "tt5",
            address: "456 Elm St",
            deliveryDate: "15/11/2024",
            totalPayment: 300.50,
            status: "completed",
            koiList: [
                { name: "Koi C", quantity: 1 },
                { name: "Koi D", quantity: 5 }
            ]
        },
        {
            id: 5,
            customerName: "cccccccc",
            address: "456 Elm St",
            deliveryDate: "24/10/2024",
            totalPayment: 300.50,
            status: "pending",
            koiList: [
                { name: "Koi C", quantity: 1 },
            ]
        },
        {
            id: 6,
            customerName: "ccccccsacacas",
            address: "456 Elm St",
            deliveryDate: "24/10/2024",
            totalPayment: 300.50,
            status: "completed",
            koiList: [
                { name: "Koi C", quantity: 1 },
                { name: "Koi C", quantity: 1 },
                { name: "Koi C", quantity: 1 },
                { name: "Koi C", quantity: 1 },
                { name: "Koi D", quantity: 5 }
            ]
        },
        {
            id: 7,
            customerName: "wwwwwere",
            address: "456 Elm St",
            deliveryDate: "24/10/2024",
            totalPayment: 300.50,
            status: "pending",
            koiList: [
                { name: "Koi C", quantity: 1 },
                { name: "Koi D", quantity: 5 }
            ]
        },
        {
            id: 8,
            customerName: "Jane Smith",
            address: "456 Elm St",
            deliveryDate: "24/10/2024",
            totalPayment: 300.50,
            status: "pending",
            koiList: [
                { name: "Koi C", quantity: 1 },
                { name: "Koi D", quantity: 5 },
                { name: "Koi e", quantity: 5 },
                { name: "Koi f", quantity: 5 },
                { name: "Koi D", quantity: 5 },
                { name: "Koi D", quantity: 5 },
                { name: "Koi D", quantity: 5 }
            ]
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [orderResponse] = await Promise.all([api.get("farm")]);
                // setOrderList(orderResponse.data);
                setOrderList(mockData);
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
        const deliveryDate = dayjs(order.deliveryDate, "DD/MM/YYYY");
        return deliveryDate.month() + 1 === currentMonth && deliveryDate.year() === currentYear;
    });

    const pendingOrdersThisMonth = ordersThisMonth.filter(order => order.status === "pending");
    const pendingOrdersToday = pendingOrdersThisMonth.filter(order => {
        const deliveryDate = dayjs(order.deliveryDate, "DD/MM/YYYY");
        return deliveryDate.date() === currentDay;
    });

    const todayDate = dayjs().format("DD/MM/YYYY");
    const filteredOrderList = orderList.filter(order => order.status === "pending"
    );

    const handleDetail = (order) => {
        setCurrentOrder(order);
        setIsModalOpen((prevState) => !prevState);
    }

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
                                            <td>{order.customerName}</td>
                                            <td>
                                                {order.koiList.map((koi, index) => (
                                                    <div key={index}>{koi.name}</div>
                                                ))}
                                            </td>
                                            <td>
                                                {order.koiList.map((koi, index) => (
                                                    <div key={index}>{koi.quantity}</div>
                                                ))}
                                            </td>
                                            <td>{order.address}</td>
                                            <td>{order.deliveryDate}</td>
                                            <td>{order.totalPayment}</td>
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
                                <form className="manager-order-edit-detail">
                                    <div className="manager-order-content-detail">
                                        <label>Customer Name: {currentOrder?.customerName || "My customername"}</label>
                                    </div>
                                    <div className="manager-order-content-detail">
                                        <label>Address: {currentOrder?.address || "Address"}</label>
                                    </div>
                                    <table className="manager-order-table-detail">
                                        <thead>
                                            <tr>
                                                <th>Koi Name</th>
                                                <th>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrder?.koiList?.length > 0 ? (
                                                currentOrder.koiList.map((koi, index) => (
                                                    <tr key={index}>
                                                        <td>{koi.name || `Koi ${index + 1}`}</td>
                                                        <td>{koi.quantity || "0"}</td>
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
                                        <label>Delivery Date: {currentOrder?.deliveryDate || "-"}</label>
                                    </div>
                                    <div className="manager-order-content-detail">
                                        <label>Total payment money: {currentOrder?.totalPayment || "$0"}</label>
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

export default DeliverPendingOrder;
