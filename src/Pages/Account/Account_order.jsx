import React, { useEffect, useState } from 'react'
import api from '../../services/axios'
import { message, Table } from 'antd'

function Account_order() {
    const [orders, setOrders] = useState([])

    const fetchOrders = async () => {
        try {
            const response = await api.get("/order/customer")
            console.log(response.data)
            setOrders(response.data)
        } catch (error) {
            console.error("Error fetching orders:", error)
            message.error("Failed to fetch orders.")
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div>
            <h1>Account_order</h1>
            <Table dataSource={orders} columns={
                [
                    {
                        title: "Order ID",
                        dataIndex: "id",
                        key: "id"
                    },
                    {
                        title: "DeliveredDate",
                        dataIndex: "deliveredDate",
                        key: "deliveredDate",
                        render: (text) => text ? text : 'not know',
                    },
                    {
                        title: "Expected date",
                        dataIndex: "expectedDate",
                        key: "expectedDate",
                    },
                    {
                        title: "Booking trip Price",
                        dataIndex: "booking",
                        key: "booking",
                        render: (booking) => booking
                            ? booking.totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                            : 'not know',
                    },
                    {
                        title: "Order Details",
                        dataIndex: "orderDetails",
                        key: "orderDetails",
                        render: (orderDetails) => orderDetails
                            ? orderDetails.map((orderDetail) => ("Koi id:" + orderDetail.id + ", quantity: " + orderDetail.quantity))
                            : 'not know',
                    },
                    {
                        title: "Order Total",
                        dataIndex: "order_total",
                        key: "order_total",
                        render: (text) => text ? text : 'not know',
                    }
                ]
            }
            />
        </div>
    )
}

export default Account_order