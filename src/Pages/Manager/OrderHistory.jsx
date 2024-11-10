import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import { message, Table, Modal, Button, Spin } from "antd";
import { Card, Typography, Image } from 'antd';
import dayjs from "dayjs";
import upFile from "../../utils/file";

const OrderHistory = () => {
    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedOrderImage, setUploadedOrderImage] = useState(null);
    const [orderFile, setOrderFile] = useState(null);
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

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

    const todayDate = dayjs().format("YYYY-MM-DD");
    const filteredOrderListComplete = orderList
        .filter(order => order.status === "COMPLETED")
        .sort((a, b) => dayjs(b.deliveredDate).diff(dayjs(a.deliveredDate)));

    const handleDetail = (order) => {
        setCurrentOrder(order);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentOrder(null);
    };

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            render: (text, record) => (
                <span style={{ fontSize: '16px' }}>{record.booking.account.firstName} {record.booking.account.lastName}</span>
            ),
        },
        {
            title: 'Koi Ordered',
            dataIndex: 'koiOrdered',
            render: (_, record) => (
                record.orderDetailResponseList.length > 0 ?
                    record.orderDetailResponseList.map((detail, index) => (
                        <div key={index} style={{ fontSize: '16px' }}>{detail.koiFishResponse.koiName}</div>
                    )) : <div style={{ fontSize: '16px' }}>No koi ordered</div>
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
            render: (address) => <span style={{ fontSize: '16px' }}>{address}</span>,
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveredDate',
            render: (date) => <span style={{ fontSize: '16px' }}>{date ? date.split('T')[0] : "N/A"}</span>,
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
            dataIndex: 'action',
            render: (_, record) => (
                <Button onClick={() => handleDetail(record)} type="link">Detail</Button>
            ),
        },
    ];


    return (
        <>
            <div className="deliver-dashboard-home-content">
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <div className="deliver-dashboard-home-content-user">
                        <h3>Completed Order ({filteredOrderListComplete.length})</h3>
                        <Table
                            dataSource={filteredOrderListComplete}
                            columns={columns}
                            rowKey="id"
                        />
                    </div>
                )}
                {isModalOpen && currentOrder && (
                    <Modal
                        title="Order Detail"
                        visible={isModalOpen}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Cancel
                            </Button>
                        ]}
                        width={600} // Đặt chiều rộng của modal
                    >
                        <div className="manager-order-content-detail">
                            <Card bordered={false} style={{ marginBottom: 16 }}>
                                <Typography.Title level={4}>
                                    Customer Information
                                </Typography.Title>
                                <Typography.Paragraph>
                                    <strong>Name:</strong> {currentOrder.booking.account.firstName} {currentOrder.booking.account.lastName}
                                </Typography.Paragraph>
                                <Typography.Paragraph>
                                    <strong>Address:</strong> {currentOrder.address}
                                </Typography.Paragraph>
                                <Typography.Paragraph>
                                    <strong>Delivery Date:</strong> {currentOrder.deliveredDate ? currentOrder.deliveredDate.split('T')[0] : "N/A"}
                                </Typography.Paragraph>
                                <Typography.Paragraph>
                                    <strong>Total Payment:</strong> {currentOrder.price}
                                </Typography.Paragraph>
                            </Card>
                            <Card bordered={false} style={{ textAlign: 'center' }}>
                                <Typography.Title level={4}>
                                    Uploaded Image
                                </Typography.Title>
                                <Image
                                    preview={false}
                                    src={currentOrder.image}
                                    alt="Uploaded"
                                    style={{ cursor: 'pointer', width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                                    onClick={() => setIsImagePopupOpen(true)}
                                />
                            </Card>
                            {isImagePopupOpen && (
                                <div className="deliver-image-popup" onClick={() => setIsImagePopupOpen(false)}>
                                    <Image className="deliver-popup-image" src={currentOrder.image} alt="Popup" />
                                </div>
                            )}
                        </div>
                    </Modal>
                )}

            </div>
        </>
    )
};

export default OrderHistory;
