import React, { useEffect, useState } from 'react'
import styles from './ConsultingStyle.module.css'
import { Col, Drawer, Input, Layout, List, message, Modal, Row, Table } from 'antd'
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
    console.log("token", localStorage.getItem("token"));
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [visible, setVisible] = useState(false);
    const [drawerInformation, setDrawerInformation] = useState([]);

    const [orderEdited, setOrderEdited] = useState([]);
    const [awaitngSubmitOrder, setAwaitngSubmitOrder] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/order/manager");
            console.log(response.data);
            setOrderEdited(response.data.filter((order) => order.address !== null && order.price !== null));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            message.error("Failed to fetch orders.");
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchAwaitngSubmit();
    }, []);

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
                            title: "Booking ID",
                            dataIndex: "bookingId",
                            key: "bookingId",
                            render: (bookingId, record) => record.booking ? record.booking.id : bookingId,
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

    return (
        <Layout style={{ padding: "0 24px 24px" }} className={styles.container}>
            <div>
                <button className={styles.navigate_btn + " " + styles.button}
                    type="primary"
                    icon={<IoFish />}
                    onClick={() => navigate("/koipagefind")}
                >
                    Navigate to KoiPageFind
                </button>
            </div>
            {displayOrders(awaitngSubmitOrder, "Awaiting Orders")}
            {displayOrders(orderEdited, "Edited Orders")}
            <Drawer
                title="Information Details"
                placement="right"
                loading={loading}
                closable={true}
                onClose={() => setVisible(false)}
                open={visible}
                width={800}
            >
                <Row className={styles.booking_info}>
                    <Col span={10} >
                        <Row className={styles.booking_info_row}>
                            <p>
                                <b>Order ID: </b>
                                {drawerInformation.id}
                            </p>
                            <p>
                                <b>Delivered Date: </b>
                                {drawerInformation.deliveredDate ? dayjs(drawerInformation.deliveredDate).format(dateFormat) : "Null"}
                            </p>
                            <p>
                                <b>Expected Date: </b>
                                {drawerInformation.expectedDate ? dayjs(drawerInformation.expectedDate).format(dateFormat) : "Null"}
                            </p>
                            <p>
                                <b>Address: </b>
                                {drawerInformation?.address || "Null"}
                            </p>
                            <p>
                                <b>Status: </b>
                                {drawerInformation.status}
                            </p>
                        </Row>
                        <Row className={styles.booking_info_row}>
                            <h2>Order Details</h2>
                            <p className={styles.details}>
                                {drawerInformation.orderDetails &&
                                    drawerInformation.orderDetails.map((item, index) => (
                                        <div key={index}>
                                            <p>
                                                <b>Koi ID: </b>
                                                {item.id}
                                            </p>
                                            <p>
                                                <b>Quantity: </b>
                                                {item.quantity}
                                            </p>
                                        </div>
                                    ))
                                }
                            </p>
                        </Row>
                        {
                            drawerInformation.booking &&
                            (
                                <>
                                    <Row className={styles.booking_info_row}>
                                        <h2>Customer Information:</h2>
                                        <p className={styles.details}>
                                            <p>
                                                <b>ID: </b>
                                                {drawerInformation.booking.account.id || "Null"}
                                            </p>
                                            <p><b>UserName: </b>
                                                {drawerInformation.booking.account.username || "Null"}</p>
                                        </p>
                                    </Row>
                                    <Row className={styles.booking_info_row} >
                                        <h2>Booking Information:</h2>
                                        <p className={styles.details}>
                                            <p>
                                                <b>Booking ID: </b>
                                                {drawerInformation.booking.id || "Null"}
                                            </p>
                                            <p>
                                                <b>Booking Date: </b>
                                                {drawerInformation.booking.bookingDate ? dayjs(drawerInformation.booking.bookingDate).format(dateFormat) : "Null"}
                                            </p>
                                            <p>
                                                <b>Booking Total Price: </b>
                                                {drawerInformation.booking.totalPrice.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                                                    || "Null"}
                                            </p>
                                        </p>
                                    </Row>
                                </>
                            )
                        }
                    </Col>
                    <Col span={14} >
                        <Row className={styles.booking_info_row}>
                            <p className={styles.order_checked}>
                                <b>Order checked: </b>
                                {drawerInformation.img ? (
                                    <img className={styles.img_order_checked} src={drawerInformation.image} alt="img" />
                                )
                                    : (
                                        <div className={styles.img_order_checked_null}>
                                            <p>No Image</p>
                                        </div>
                                    )
                                }
                            </p>
                        </Row>
                        <Row className={styles.booking_info_row}>
                            <h2>Farms Information:</h2>
                            <p className={styles.details}>
                                {drawerInformation.booking &&
                                    drawerInformation.booking.trip.farms.map((item, index) => (
                                        <div key={index} className={styles.farm_list}>
                                            <p>
                                                <b>Farm ID: </b>
                                                {item.id}
                                            </p>
                                            <p>
                                                <b>Farm Name: </b>
                                                {item.farmName || "Null"}
                                            </p>
                                        </div>
                                    ))
                                }
                            </p>
                        </Row>
                    </Col>
                </Row>

            </Drawer>
        </Layout>
    )
}

export default Consulting_orders