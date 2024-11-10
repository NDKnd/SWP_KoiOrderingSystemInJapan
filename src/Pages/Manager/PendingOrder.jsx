import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import "./ManagerHome.css";
import { message, Modal, Table, Button, Spin, Upload } from "antd";
import { Card, Typography, Image } from 'antd';
import dayjs from "dayjs";
import upFile from "../../utils/file";

const PendingOrder = () => {
    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [uploadedOrderImage, setUploadedOrderImage] = useState(null);
    const [orderFile, setOrderFile] = useState(null);

    const today = dayjs();
    const currentMonth = today.month() + 1;
    const currentYear = today.year();
    const currentDay = today.date();

    let TotalPrice;

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

    const ordersThisMonth = orderList.filter(order => {
        const deliveryDate = dayjs(order.expectedDate, "YYYY-MM-DD");
        return deliveryDate.month() + 1 === currentMonth && deliveryDate.year() === currentYear;
    });

    const filteredOrderList = ordersThisMonth.filter(order => order.status === "ON_DELIVERY");

    const handleDetail = (order) => {
        setCurrentOrder(order);
        setIsModalOpen(true);
    };

    const handleDetailComplete = async () => {
        const dataToSend = {
            image: uploadedOrderImage || "",
        };

        try {
            const res = await api.put(`order/${currentOrder.id}`, dataToSend);
            if (res.status >= 200 && res.status < 300) {
                setOrderList((prevList) => prevList.filter((order) => order.id !== currentOrder.id));
                message.success("Order completed successfully");
                setIsModalOpen(false);
                setCurrentOrder(null);
            } else {
                message.error("Failed to complete the order");
            }
        } catch (err) {
            message.error(err.response?.data?.message || "Error completing the order");
        }
    };

    const handleOrderUploadChange = (info) => {
        if (info.file.status === 'done') {
            setUploadedOrderImage(info.file.response.url); // Assumes response contains the image URL
            setOrderFile(info.file.originFileObj);
        }
    };

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'booking.account.firstName',
            render: (text, record) => `${record.booking.account.firstName} ${record.booking.account.lastName}`,
        },
        {
            title: 'Koi Ordered',
            dataIndex: 'orderDetailResponseList',
            render: (orderDetails) => (
                orderDetails.map((detail, index) => (
                    <div key={index}>{detail.koiFishResponse.koiName}</div>
                ))
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            render: (_, record) => {
                TotalPrice = record.orderDetailResponseList.reduce((sum, detail) => sum + detail.quantity * detail.koiFishResponse.price, 0);
                console.log("TotalPrice", TotalPrice);
                return (
                    record.orderDetailResponseList.map((detail, index) => (
                        <div key={index} style={{ fontSize: '16px' }}>
                            {detail.quantity}
                        </div>
                    ))
                )
            },
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Expected Date',
            dataIndex: 'expectedDate',
        },
        {
            title: 'Total Payment',
            dataIndex: 'price',
            render: (price) => {
                console.log("price", price);
                TotalPrice += price;
                console.log("TotalPrice", TotalPrice);
                return <span style={{ fontSize: '16px' }}>{TotalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>;
            },
        },
        {
            title: 'Action',
            render: (text, order) => (
                <Button type="link" onClick={() => handleDetail(order)}>
                    Detail
                </Button>
            ),
        },
    ];

    return (
        <>
            <div className="deliver-dashboard-home-content">
                {loading ? (
                    <Spin tip="Loading..." />
                ) : (
                    <>
                        <h3>Pending Orders ({filteredOrderList.length})</h3>
                        <Table
                            dataSource={filteredOrderList}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                        />
                    </>
                )}
            </div>
            <Modal
                title="Order Detail"
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
                ]}
                width={600} // Đặt chiều rộng của modal
            >
                {currentOrder && (
                    <div className="manager-order-content-detail">
                        <Card bordered={false} style={{ marginBottom: 16 }}>
                            <Typography.Title level={4}>
                                Customer Information
                            </Typography.Title>
                            <Typography.Paragraph>
                                <strong>Customer Name:</strong> {currentOrder.booking.account.firstName} {currentOrder.booking.account.lastName}
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                <strong>Address:</strong> {currentOrder.address}
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                <strong>Expected Date:</strong> {currentOrder.expectedDate}
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                <strong>Total Payment:</strong> {currentOrder.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} VND
                            </Typography.Paragraph>
                        </Card>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default PendingOrder;
