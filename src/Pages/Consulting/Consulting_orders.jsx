import React, { useEffect, useState } from 'react'
import styles from './ConsultingStyle.module.css'
import { Col, Drawer, Input, Layout, List, message, Modal, Row, Select, Table } from 'antd'
import api from "../../services/axios";
import dayjs from "dayjs";
import { IoFish } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const dateFormat = "MM-DD-YYYY";

const Pending_List = [
    "PENDING",
];
const CompleteList = [
    "COMPLETED",
];

function Consulting_orders() {
    // console.log("token", localStorage.getItem("token"));
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [visible, setVisible] = useState(false);
    const [drawerInformation, setDrawerInformation] = useState([]);

    const [orderEdited, setOrderEdited] = useState([]);
    const [awaitngSubmitOrder, setAwaitngSubmitOrder] = useState([]);

    const [allOrders, setAllOrders] = useState([]);
    const [bookingList, setBookingList] = useState([]);
    const [awaitingOrders, setAwaitingOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/order/manager");
            setAllOrders(response.data);
            setOrderEdited(response.data.filter((order) => order.address !== null && order.price !== null));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            message.error("Failed to fetch orders.");
        }
    };

    const handleStatus = (status) => {
        return (
            <div
                className={`${styles.status} ${styles[`status_${status.toLowerCase().trim()}`]
                    }`}
            >
                {status}
            </div>
        );
    };

    const handleViewDetails = (record) => {
        console.log("values", record);
        setDrawerInformation(record);
        setVisible(true);
    };

    const handlePreview = (record) => {
        Modal.info({
            width: 400,
            title: <img src={record.image} className={styles.img_Koi} style={{ width: "100%", padding: "15px" }} alt="koi" />,
            maskClosable: true,
            closable: true,
            footer: null,
            icon: null,
        });
    };

    const recommendFarmForKoi = (values) => { //gợi ý booking theo farm của Koi mún đặt 
        if (!values.farm || !values.farm.farmName) {
            message.info("No farm information available for this Koi.");
            return;
        }
        message.info(`This Koi fish is located at ${values.farm.farmName}, which is in ${values.farm.location}. Please ensure to book a trip that includes this farm.`);
    };

    const getBookinglist = async () => {
        const res1 = await api.get("booking/manager");
        setBookingList(res1.data
            .filter((b) => b.status === "CHECK_IN"
                && !allOrders.some((o) => o.booking.id === b.id)
            ));
    }

    const handleChooseKois = async () => {
        const res = await api.get("/koi");
        const KoiToOrders = res.data;
        console.log("Kois", res.data);

        await getBookinglist();
        console.log("bookinglist", bookingList);

        Modal.confirm({
            title: "Choose Kois",
            icon: null,
            scroll: { y: 400 },
            footer: null,
            width: 800,
            maskClosable: true,
            content: (
                <div>

                    <Table
                        className={styles.table_kois}
                        dataSource={KoiToOrders}
                        columns={
                            [
                                {
                                    title: "Image",
                                    dataIndex: "image",
                                    key: "image",
                                    render: (image) => (
                                        <a onClick={() => handlePreview({ image })}>
                                            <img src={image} className={styles.img_Koi} alt="koi" />
                                        </a>
                                    ),
                                },
                                {
                                    title: "Price",
                                    dataIndex: "price",
                                    key: "price",
                                    render: (price) => price ?
                                        (<p>{price.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')} VND</p>)
                                        : (<p>Null</p>)
                                },
                                {
                                    title: "Koi Name",
                                    dataIndex: "koiName",
                                    key: "koiName",
                                },
                                {
                                    title: "Type",
                                    dataIndex: "type",
                                    key: "type",
                                },
                                {
                                    title: "Farm Name",
                                    dataIndex: "farm",
                                    key: "farm",
                                    render: (f) => (f.farmName)
                                },
                                {
                                    title: "Action",
                                    dataIndex: "action",
                                    key: "action",
                                    render: (_, record) => (
                                        <button
                                            className={styles.update_btn + " " + styles.button}
                                            onClick={() => {
                                                handleOpenOrderForm(record);
                                            }}
                                        >
                                            Choose
                                        </button>
                                    ),
                                },
                            ]}
                    />
                </div >
            ),
        });

    }

    const handleOpenOrderForm = async (values) => {
        setAwaitingOrders(localStorage.getItem("AwaitingSubmitOrder"));

        console.log("booking list: ", bookingList);
        console.log("values is koi: ", values);

        // check xem đã có danh sách Booking hay ch?!
        if (bookingList.length == 0) {
            message.info("You haven't created any booking trips yet or all of them have been ordered.");
            recommendFarmForKoi(values);
            return;
        }

        // gợi ý chọn booking trip nào có farm của Koi mún đặt
        recommendFarmForKoi(values);

        Modal.confirm({
            title: "Order Koi",
            content: (
                <div>
                    <p>Koi type: {values.type}</p>
                    <p>Koi Name: {values.koiName}</p>
                    <p>Farm Name: {values.farm.farmName}</p>
                    <p>Booking Trip:</p>
                    <Select
                        showSearch
                        style={{ width: 150 }}
                        placeholder="Select a trip"
                        optionFilterProp="children"
                        onChange={(value) => {
                            console.log("value: ", value); // for view
                            values.bookingId = value;
                            console.log("bookingId: ", values.bookingId); // for view
                        }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {bookingList.length > 0 && bookingList.map((booking) => (
                            <Select.Option key={booking.id} value={booking.id}>
                                {booking.id + " - " + booking.trip.startDate + " - " + booking.trip.endDate}
                            </Select.Option>
                        ))
                        }
                    </Select>
                    <p>Quantity:</p>
                    <Input
                        type="number"
                        id="quantity"
                        defaultValue={1}
                        min={1}
                        max={values.quantity}
                        style={{ width: 150 }}
                        onChange={(e) => values.quantity = e.target.value}
                    />
                </div>
            ),
            onOk: async () => {
                const quantity = window.document.getElementById("quantity").value;
                // check xem người dùng chọn đúng booking trip
                // mà có farm của Koi này hay ko???
                bookingList.forEach((booking) => {
                    if (booking.id == values.bookingId) {
                        console.log("booking: ", booking);
                        let isFound = false;
                        booking.trip.farms.forEach((farm) => {
                            console.log(farm.farmName + " == " + values.farm.farmName);
                            if (farm.farmName === values.farm.farmName) {
                                isFound = true;
                                return;
                            }
                        });
                        if (!isFound) {
                            recommendFarmForKoi(values);
                            throw new Error("Koi is not located at this farm");
                        }
                    }
                })

                console.log("booking id choose: ", values.bookingId); // for view
                console.log("quantity: ", quantity); // for view

                console.log("current order: ",
                    {
                        "expectedDate": dayjs().add(10, 'day').format('YYYY-MM-DD'),
                        "status": "PENDING",
                        "address": "",
                        "bookingId": values.bookingId,
                        "price": "",
                        "orderDetails": [
                            {
                                "koiId": values.id,
                                "quantity": parseInt(quantity)
                            }
                        ]
                    }
                );

                // Xóa dữ liệu hiện tại của localStorage
                // localStorage.removeItem("AwaitingSubmitOrder");

                // Lấy dữ liệu hiện tại từ localStorage

                const existingOrders = localStorage.getItem("AwaitingSubmitOrder");
                let orders;

                // Kiểm tra xem existingOrders có hợp lệ và là mảng hay không
                try {
                    orders = existingOrders ? JSON.parse(existingOrders) : [];
                    if (!Array.isArray(orders)) {
                        // Nếu không phải là mảng, khởi tạo lại thành mảng rỗng
                        orders = [];
                    }
                } catch (error) {
                    orders = [];
                }

                // Tạo object order mới
                let newOrderDetail = {
                    "koiId": values.id,
                    "quantity": parseInt(quantity)
                };

                // Kiểm tra xem đã có order nào với bookingId đã chọn hay chưa
                let existingOrder = orders.find(order => order.bookingId === values.bookingId);

                if (existingOrder) {
                    // Nếu đã có order với bookingId này, thêm orderDetails mới vào
                    if (!Array.isArray(existingOrder.orderDetails)) {
                        existingOrder.orderDetails = [];
                    }

                    let existingOrderDetail = existingOrder.orderDetails
                        .find(orderDetail => orderDetail.koiId === newOrderDetail.koiId);
                    if (existingOrderDetail) {
                        existingOrderDetail.quantity += newOrderDetail.quantity;
                    } else {
                        existingOrder.orderDetails.push(newOrderDetail);
                    }
                } else {
                    // Nếu chưa có, tạo mới một order và thêm vào mảng orders
                    let newOrder = {
                        "expectedDate": dayjs().add(10, 'day').format('YYYY-MM-DD'),
                        "status": "PENDING",
                        "address": "",
                        "bookingId": values.bookingId,
                        "price": "",
                        "orderDetails": [newOrderDetail]
                    };
                    orders.push(newOrder);
                }

                // Lưu lại mảng orders đã cập nhật vào localStorage
                localStorage.setItem('AwaitingSubmitOrder', JSON.stringify(orders));

                // Log ra mảng orders để kiểm tra
                console.log("orders: ", orders);
                await fetchAwaitngSubmit();
                message.success("Add to cart successfully!");

            },
        });
    };

    const fetchAwaitngSubmit = async () => {
        setLoading(true);
        let list = JSON.parse(localStorage.getItem("AwaitingSubmitOrder"));
        console.log("list order waiting", list);
        setAwaitngSubmitOrder(list);
        setLoading(false);
    };

    const handleUpdate = async (record) => {
        console.log("record", record);

        Modal.confirm({
            title: "Confirm Update",
            content: (
                <div>
                    <p>New Price (above 10,000 VND):</p>
                    <Input
                        type="number"
                        min={10000}
                        onBlur={(e) =>
                            parseInt(e.target.value) <= 10000
                                ? message.error("The price must be above 10,000 VND")
                                : (record.price = parseInt(e.target.value))}

                    />
                    <p>New Address:</p>
                    <Input
                        onChange={(e) => (record.address = e.target.value)
                        }
                    />
                </div>
            ),
            onOk: async () => {
                // let list = JSON.parse(localStorage.getItem("AwaitingSubmitOrder"));
                // console.log("list", list);
                // list = list.filter((item) => item.bookingId !== record.bookingId);
                // localStorage.setItem("AwaitingSubmitOrder", JSON.stringify(list));
                try {
                    console.log("record", record);
                    const response = await api.post("order", record);
                    console.log(response.data);
                    if (localStorage.getItem("AwaitingSubmitOrder")) {
                        let list = JSON.parse(localStorage.getItem("AwaitingSubmitOrder"));
                        console.log("list", list);
                        list = list.filter((item) => item.bookingId !== record.bookingId);
                        localStorage.setItem("AwaitingSubmitOrder", JSON.stringify(list));
                    }
                    message.success("Update order successfully");
                } catch (error) {
                    console.error("Error updating order:", error);
                    message.error("Failed to update order.");
                }
            },
        });
    };

    const displayOrders = (orderList, title) => {
        return (
            <div className={styles.box_table}>
                <h2 className={styles.title}>{title}</h2>
                <Table
                    loading={loading}
                    pagination={{
                        position: ["bottomCenter"],
                        showQuickJumper: true, // Cho phép nhảy tới trang cụ thể
                    }}
                    dataSource={orderList}
                    columns={[
                        {
                            title: "Expected Date",
                            dataIndex: "expectedDate",
                            key: "expectedDate",
                        },
                        {
                            title: "Address",
                            dataIndex: "address",
                            key: "address",
                            render: (address) => address ? <div>{address}</div> : <div style={{ color: "gray" }}>N/A</div>,
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            key: "status",
                            render: (status) => handleStatus(status),
                        },
                        {
                            title: "Price",
                            dataIndex: "price",
                            key: "price",
                            render: (price) => price
                                ? price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                                : <div style={{ color: "gray" }}>N/A</div>
                        },
                        {
                            title: "Order Details",
                            dataIndex: "orderDetails",
                            key: "orderDetails",
                            render: (orderDetails, record) =>
                                orderDetails && orderDetails.length > 0 ? (
                                    <ul>
                                        {orderDetails.map((detail, index) => (
                                            <li key={index}>
                                                <b>Koi ID:</b> {detail.koiId ? detail.koiId : detail.id},{" "}
                                                <b>Quantity:</b> {detail.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div style={{ color: "gray" }}>No details</div>
                                ),
                        },
                        {
                            title: "Action",
                            dataIndex: "action",
                            key: "action",
                            render: (text, record) => (
                                <button
                                    className={styles.button}
                                    onClick={() => handleUpdate(record)}
                                    disabled={record.status !== "PENDING" || record.price > 10000}
                                >
                                    Update
                                </button>
                            ),
                        }
                    ]}
                />
            </div>
        );
    };

    useEffect(() => {
        getBookinglist();
        fetchOrders();
        fetchAwaitngSubmit();
    }, []);

    return (
        <Layout style={{ padding: "0 24px 24px" }} className={styles.container}>
            <div>
                <button className={styles.OrderKois_btn + " " + styles.button}
                    type="primary"
                    icon={<IoFish />}
                    onClick={() => handleChooseKois()}
                >
                    Choose Kois to order
                </button>
            </div>
            {displayOrders(awaitngSubmitOrder, "Awaiting Orders")}
            {displayOrders(orderEdited, "Edited Orders")}
        </Layout>
    )
}

export default Consulting_orders