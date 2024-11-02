import React, { useEffect, useState } from 'react'
import api from '../../services/axios'
import { message, Modal, Popover, Select, Table } from 'antd'
import styles from './account.module.css'
import { Await } from 'react-router-dom'
import dayjs from 'dayjs'

const statusList = [
    "PENDING",
    "ON_DELIVERY",
    "COMPLETED"
]

function Account_order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredOrders, setFilteredOrders] = useState([]);

    const [totalPrice, setTotalPrice] = useState(0);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/order/customer")
            console.log("orders: ", response.data)
            setOrders(response.data)
            setFilteredOrders(response.data)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error)
        }
    }

    useEffect(() => {
        const fetchTransactions = async (id) => {
            console.log("id: ", id)
            try {
                const response = await api.post("transaction/order?orderId=" + id);
                console.log("Transaction", response.data);
                fetchOrders();
            } catch (error) {
                console.error("Error transaction orders:", error)
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
        const orderId = urlParams.get('orderId');
        console.log(vnp_ResponseCode + " " + orderId)
        if (vnp_ResponseCode != null && orderId != null) {
            if (vnp_ResponseCode === '00') {
                fetchTransactions(orderId);
            }
        }

        fetchOrders();
    }, [])

    const handleStatus = (status) => {
        // console.log("status: ", status.toLowerCase().trim())
        return (
            <div
                className={`${styles.status} ${styles[`status_${status.toLowerCase().trim()}`]
                    }`}
            >
                {status}
            </div>
        );
    };

    const handleCheckout = async (orderId) => {
        console.log("order: ", orderId);
        await api.post(`order/payment`, { id: orderId })
            .then((response) => {
                if (response.data) {
                    window.location.href = response.data;
                } else {
                    message.error("Failed to retrieve payment link.");
                }
            })
            .catch((error) => {
                console.error("Error during checkout:", error);
                message.error("Failed to proceed to checkout.");
            });
    };

    const handleFilter = (value) => {
        if (value === 'All') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === value));
        }
    }

    return (
        <div>
            <h1>Order List</h1>
            <Select
                style={{ width: 200 }}
                onChange={handleFilter}
                defaultValue="All"
            >
                <Select.Option value="All">All</Select.Option>
                {statusList.map(status => <Select.Option key={status} value={status}>{status}</Select.Option>)}
            </Select>
            <Table
                loading={loading}
                scroll={{ x: 780 }}
                style={{ width: "100%", overflow: "auto" }}
                dataSource={filteredOrders} columns={
                    [
                        {
                            title: "Order Address",
                            dataIndex: "address",
                            key: "address",
                            render: (address) => (
                                <Popover content={address} title="Order Address">
                                    <span>{address}</span>
                                </Popover>
                            )
                        },
                        {
                            title: "Delivered Date",
                            dataIndex: "deliveredDate",
                            key: "deliveredDate",
                            render: (text) => text ? text : (<p style={{ color: "gray" }}>N/A</p>),
                        },
                        {
                            title: "Expected date",
                            dataIndex: "expectedDate",
                            key: "expectedDate",
                            render: (expectedDate) => (
                                <div style={{ width: "5rem" }}>{dayjs(expectedDate).format("YYYY-MM-DD")}</div>
                            ),
                        },
                        {
                            title: "Order Details",
                            dataIndex: "orderDetailResponseList",
                            key: "orderDetailResponseList",
                            render: (orderDetails) => {
                                let tmpPrice = 0;
                                orderDetails.forEach((orderDetail) => {
                                    tmpPrice += orderDetail.price * orderDetail.quantity;
                                })
                                setTotalPrice(tmpPrice);
                                return orderDetails && orderDetails.length > 0
                                    ? (
                                        <ul style={{ listStyle: "none", padding: 0, width: "25rem" }}>
                                            {orderDetails.map((KoiOrder) =>
                                            (
                                                <li key={KoiOrder.id} style={{ marginBottom: "10px" }}>
                                                    <span style={{ marginRight: "10px" }}><strong>Koi Name:</strong> {KoiOrder.koiFishResponse.koiName}</span>
                                                    <span style={{ marginRight: "10px" }}><strong>Quantity:</strong> {KoiOrder.quantity}</span>
                                                    <span><strong>Price:</strong> {KoiOrder.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")} VND ( 1 Koi )</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                    : 'None'
                            }
                        },
                        {
                            title: "Order Status",
                            dataIndex: "status",
                            key: "status",
                            render: (status) => handleStatus(status),
                        },
                        {
                            title: "Delivery Price",
                            dataIndex: "price",
                            key: "price",
                            render: (price) => {
                                setTotalPrice((prev) => prev + price);
                                return price != null && price != 0
                                    ? (
                                        <div style={{ width: "9em" }}>{price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")} VND</div>
                                    )
                                    : (<div style={{ width: "9em" }}>0 VND</div>);
                            },
                        },
                        {
                            title: "Total Price",
                            dataIndex: "totalPrice",
                            key: "totalPrice",
                            render: () =>
                            (
                                <div style={{ width: "9em" }}>{totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")} VND</div>
                            )

                        },
                        {
                            title: "Action",
                            dataIndex: "action",
                            key: "action",
                            render: (_, record) => (
                                <button
                                    className={styles.update_btn + " " + styles.button}
                                    disabled={record.status !== "PENDING"}
                                    onClick={() => {
                                        Modal.confirm({
                                            title: "Are you sure?",
                                            okText: "Yes",
                                            cancelText: "No",
                                            onOk: () => handleCheckout(record.id),
                                        })
                                    }}
                                >
                                    Check Out
                                </button>
                            ),
                        }
                    ]
                }
            />

        </div>
    )
}

export default Account_order;
