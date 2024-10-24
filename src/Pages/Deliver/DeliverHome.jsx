import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import "./DeliverHome.css";
import { MdOutlineCalendarMonth, MdOutlinePendingActions } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { message } from "antd";
import dayjs from "dayjs";

const DeliverHome = () => {
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
    const filteredOrderList = orderList.filter(order =>
        order.deliveryDate === todayDate && order.status === "pending"
    );

    const handleDetail = (order) => {
        setCurrentOrder(order);
        setIsModalOpen((prevState) => !prevState);
    }

    const handleDetailComplete = async (event) => {
        event.preventDefault();
        try {
            const res = await api.put(`order/complete/${currentOrder.id}`);
            if (res.status === 200) { // Kiểm tra xem API trả về status 200 không
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
            <div className="manager-dashboard-title">
                <h3>WELCOME DELIVER</h3>
            </div>

            <div className="deliver-dashboard-card">
                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-1">
                    <div className="deliver-dashborad-card-title">
                        <h3>Total orders for this month</h3>
                        <MdOutlineCalendarMonth className="deliver-dashborad-card-title-icon" />
                    </div>
                    <h1>{ordersThisMonth.length}</h1>
                </div>

                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-2">
                    <div className="deliver-dashborad-card-title">
                        <h3>Pending Order</h3>
                        <MdOutlinePendingActions className="deliver-dashborad-card-title-icon" />
                    </div>
                    <h1>{pendingOrdersThisMonth.length}</h1>
                </div>

                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-3">
                    <div className="deliver-dashborad-card-title">
                        <h3>Orders today</h3>
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
                                <form onSubmit={handleDetailComplete} className="manager-order-edit-detail">
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

export default DeliverHome;
