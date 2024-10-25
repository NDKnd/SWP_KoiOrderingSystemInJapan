import React, { useEffect, useState } from 'react'
import styles from './ConsultingStyle.module.css'
import { Col, Drawer, Layout, List, message, Row, Table } from 'antd'
import api from "../../services/axios";
import dayjs from "dayjs";

const dateFormat = "MM-DD-YYYY";

const CheckInList = [
    "CHECK_IN",
];
const CompleteList = [
    // "PENDING_CONFIRMATION",
    // "AWAITING_PAYMENT",
    // "IN_PROGRESS",

    "COMPLETED",
    // "CANCELED",
];

function ConsultingPage() {

    console.log("token", localStorage.getItem("token"));

    const [loading, setLoading] = useState(true);

    const [visible, setVisible] = useState(false);
    const [drawerInformation, setDrawerInformation] = useState([]);

    const [bookingList, setBookingList] = useState([]);
    const [bookingListCompleted, setBookingListCompleted] = useState([]);

    const fetchBookingManger = async () => {
        const res = await api.get("booking/manager");
        setLoading(false);
        var list = res.data;

        setBookingListCompleted(
            list
                .filter((item) => CheckInList.includes(item.status))
                .map((item) => ({
                    ...item,
                    key: item.id,
                }))
        )
        setBookingList(
            list
                .filter((item) => CompleteList.includes(item.status))
                .map((item) => ({
                    ...item,
                    key: item.id,
                }))
        );
        console.log(res.data);
    };

    useEffect(() => {
        fetchBookingManger();
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

    const handleUpdateStatus = async (record) => {
        console.log("values", record);
        try {
            const res = await api.put(`/booking/status/${record.id}`, {
                status: "COMPLETED",
            });
            console.log(res);
            fetchBookingManger();
            message.success("Complete trip successfully");
        } catch (error) {
            console.log(error);
            message.error("Failed to complete trip");
        }
    }

    const handleViewDetails = (record) => {
        console.log("values", record);
        setDrawerInformation(record);
        setVisible(true);
    }

    const displayBooking = (booking) => {
        return (
            <div className={styles.box_table}>
                <h2 className={styles.title}>Booking List</h2>
                <Table
                    loading={loading}
                    pagination={{
                        position: ["bottomCenter"],
                        showQuickJumper: true, // Cho phép nhảy tới trang cụ thể
                    }}
                    dataSource={booking}
                    columns={[
                        {
                            title: "ID",
                            dataIndex: "id",
                            key: "id",
                        },
                        {
                            title: "Checkin Pic",
                            dataIndex: "image",
                            key: "image",
                            render: (image) => (
                                <img className={styles.img_first_farm} src={image} alt="img" />
                            ),
                        },
                        {
                            title: "Booking Date",
                            dataIndex: "bookingDate",
                            key: "bookingDate",
                            render: (date) => dayjs(date).format(dateFormat),
                        },
                        {
                            title: "Note",
                            dataIndex: "note",
                            key: "note",
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            key: "status",
                            render: (status) => handleStatus(status),
                        },
                        {
                            title: "Total",
                            dataIndex: "totalPrice",
                            key: "totalPrice",
                            render: (price) => {
                                return price != null && price != 0
                                    ? <span style={{ color: "black" }}>
                                        {price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                                    </span>
                                    : <span style={{ color: "gray" }}>{price}</span>
                            }
                        },
                        {
                            title: "View Detail",
                            dataIndex: "viewDetail",
                            key: "viewDetail",
                            render: (_, record) => (
                                <button
                                    className={styles.view_btn + " " + styles.button}
                                    onClick={() => handleViewDetails(record)}
                                >
                                    View Detail
                                </button>
                            )
                        },
                        {
                            title: "Action",
                            dataIndex: "action",
                            key: "action",
                            render: (_, record) => (
                                <>
                                    <button
                                        className={styles.update_btn + " " + styles.button}
                                        onClick={() => handleUpdateStatus(record)}
                                        disabled={CheckInList.includes(record.status) === false}
                                    >
                                        Update Status
                                    </button>
                                </>
                            )
                        },
                    ]}
                />
            </div>
        );
    };

    return (
        <Layout style={{ padding: "0 24px 24px" }} className={styles.container}>
            {displayBooking(bookingListCompleted)}
            {displayBooking(bookingList)}
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
                    <Col span={14} >
                        <p>
                            <b>Booking ID: </b>
                            {drawerInformation.id}
                        </p>
                        <p>
                            <b>Booking Date: </b>
                            {dayjs(drawerInformation.bookingDate).format(dateFormat)}
                        </p>
                        <p>
                            <b>Note: </b>
                            {drawerInformation.note}
                        </p>
                    </Col>
                    <Col span={8} >
                        <p className={styles.total_price}>
                            <b>Total: </b>
                            <span>{drawerInformation.totalPrice} VND</span>
                        </p>
                    </Col>
                </Row>

                <Row className={styles.trip_info}>
                    {drawerInformation?.trip && (
                        <>
                            <Row>
                                <p>
                                    <b>Trip ID: </b>
                                    {drawerInformation.trip.id}
                                </p>
                                <p>
                                    <b>Start date: </b>
                                    {drawerInformation.trip.startDate}
                                </p>
                                <p>
                                    <b>Start location: </b>
                                    {drawerInformation.trip.startLocation}
                                </p>
                                <p>
                                    <b>End location: </b>
                                    {drawerInformation.trip.endLocation}
                                </p>
                            </Row>

                            <Row className={styles.farm_list} >
                                <List
                                    bordered
                                    dataSource={drawerInformation.trip.farms}
                                    renderItem={(item) => (
                                        <List.Item className={styles.farm}>
                                            {/* Hình ảnh của farm */}
                                            <img
                                                src={item.image || "https://via.placeholder.com/60"} // Hiển thị hình ảnh hoặc placeholder
                                                alt={item.farmName}
                                                className={styles.farm_image}
                                            />
                                            {/* Nội dung farm */}
                                            <div className={styles.farm_content}>
                                                <h3>{item.farmName || "No farm name available"}</h3>
                                                {item.location || "No farm location available"}
                                                <br />
                                                {item.phone || "No farm phone available"}
                                                <br />
                                                {item.email || "No farm email available"}
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </Row>
                        </>
                    )}
                </Row>

                <Row className={styles.drawer_image}>
                    <img src={drawerInformation.image} alt="checkInImage" />
                </Row>

            </Drawer>
        </Layout>
    )
}

export default ConsultingPage