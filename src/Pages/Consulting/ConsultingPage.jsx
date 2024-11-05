import React, { useEffect, useState } from 'react'
import styles from './ConsultingStyle.module.css'
import { Button, Col, Drawer, Layout, List, message, Modal, Row, Select, Table } from 'antd'
import api from "../../services/axios";
import dayjs from "dayjs";
import { FaFilter } from 'react-icons/fa';

const dateFormat = "YYYY-MM-DD";

const CheckInList = [
    "CHECK_IN",
];
const CompleteList = [
    "COMPLETED",
];

const statusList = [
    "CANCEL",
    "COMPLETED"
]

function ConsultingPage() {

    console.log("token", localStorage.getItem("token"));

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [drawerInformation, setDrawerInformation] = useState([]);

    const [listBookings, setListBookings] = useState([]);
    const [bookingList, setBookingList] = useState([]);
    const [bookingListCheckIn, setBookingListCheckIn] = useState([]);

    const [filterList, setFilterList] = useState([]);
    const [filterUser1, setFilterUser1] = useState("All");

    const [filterListCheckIn, setFilterListCheckIn] = useState([]);
    const [filterUser2, setFilterUser2] = useState("All");
    const [filterStatus2, setFilterStatus2] = useState("All");

    const fetchBookingManager = async () => {
        const res = await api.get("booking/manager");
        setLoading(false);
        var list = res.data;
        setListBookings(list);
        setBookingListCheckIn(
            list
                .filter((item) => CheckInList.includes(item.status))
                .map((item) => ({
                    ...item,
                    key: item.id,
                }))
        );
        setBookingList(
            list
                .filter((item) => CompleteList.includes(item.status))
                .map((item) => ({
                    ...item,
                    key: item.id,
                }))
        );
        setFilterList(
            list.filter((item) => CompleteList.includes(item.status))
                .map((item) => ({
                    ...item,
                    key: item.id,
                }))
        );
        console.log(res.data);
    };

    useEffect(() => {
        fetchBookingManager();
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
            fetchBookingManager();
            message.success("Complete trip successfully");
        } catch (error) {
            console.log(error);
            message.error("Failed to complete trip");
        }
    };

    const handleViewDetails = (record) => {
        console.log("values", record);
        setDrawerInformation(record);
        setVisible(true);
    };

    const handlePreview = (record) => {
        Modal.info({
            width: 600,
            aspectRatio: 3 / 2,
            title: <img src={record.image} className={styles.img_Koi} style={{ width: "100%", padding: "15px" }} alt="koi" />,
            maskClosable: true,
            closable: true,
            footer: null,
            icon: null,
        });
    };

    const handleFilter = (type) => {

        const filteredBookingTrips =
            type === 1 ?
                bookingListCheckIn.filter((booking) => {
                    const matchesUser = filterUser1 === "All" ? true
                        : booking.account.username.toLowerCase().includes(filterUser1.toLowerCase());
                    console.log("matchesUser: ", matchesUser + " " + filterUser1);
                    return (matchesUser);
                }
                )
                :
                bookingList.filter((booking) => {
                    const matchesUser = filterUser2 === "All" ? true
                        : booking.account.username.toLowerCase().includes(filterUser2.toLowerCase());
                    const matchesStatus = filterStatus2 === "All" ? true
                        : booking.status.toLowerCase().includes(filterStatus2.toLowerCase());
                    console.log("matchesUser: ", matchesUser + " " + filterUser2);
                    console.log("matchesStatus: ", matchesStatus + " " + filterStatus2);
                    return (matchesUser && matchesStatus);
                });
        console.log("filteredTrips: ", filteredBookingTrips);
        filteredBookingTrips.length > 0
            ? type == 1
                ? setFilterListCheckIn(filteredBookingTrips)
                : setFilterList(filteredBookingTrips)
            : (
                setFilterListCheckIn([]),
                setFilterList([]),
                message.error("No booking found")
            );
    }

    const displayBooking = (booking, title, typeTable) => {
        return (
            <div className={styles.box_table}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.filter}>{/* filter */}
                    {typeTable !== 1 && (
                        <div>{/*filter by status*/}
                            <label htmlFor="filter">Status: </label>
                            <Select
                                id="filter"
                                style={{ width: 200 }}
                                onChange={
                                    typeTable === 1
                                        ? console.log("table 1")
                                        : (value) => setFilterStatus2(value, typeTable)
                                }
                                defaultValue="All"
                            >
                                <Select.Option value="All">All</Select.Option>
                                {statusList.map(status => <Select.Option key={status} value={status}>{status}</Select.Option>)}
                            </Select>
                        </div>
                    )}
                    <div> {/* filter by user */}
                        <label htmlFor="filter1">User: </label>
                        <Select
                            id="filter1"
                            style={{ width: 200 }}
                            onChange={
                                typeTable === 1
                                    ? (value) => setFilterUser1(value, typeTable)
                                    : (value) => setFilterUser2(value, typeTable)
                            }
                            defaultValue="All"
                        >
                            <Select.Option value="All">All</Select.Option>
                            {listBookings.reduce((uniqueUsers, b) => {
                                if (!uniqueUsers.includes(b.account.username)) {
                                    uniqueUsers.push(b.account.username);
                                }
                                return uniqueUsers;
                            }, [])
                                .map((u) => <Select.Option key={u} value={u}>{u}</Select.Option>)}
                        </Select>
                    </div>
                    <div>
                        <Button
                            icon={<FaFilter />}
                            className={styles.filter_button}
                            onClick={() => handleFilter(typeTable)}
                        >
                        </Button>
                    </div>
                </div>
                <Table
                    loading={loading}
                    pagination={{
                        position: ["bottomCenter"],
                        showQuickJumper: true,
                    }}
                    dataSource={booking}
                    columns={[
                        {
                            title: "Checkin Pic",
                            dataIndex: "image",
                            key: "image",
                            render: (image) => (
                                <a onClick={() => handlePreview({ image })}>
                                    <img className={styles.img_first_farm} src={image} alt="img" />
                                </a>
                            ),
                        },
                        {
                            title: "User Name",
                            dataIndex: "account",
                            key: "account",
                            render: (account) => account?.username,
                        },
                        {
                            title: "Booking Date",
                            dataIndex: "bookingDate",
                            key: "bookingDate",
                            render: (date) => (
                                <div style={{ width: "5rem" }}>{dayjs(date).format(dateFormat)}</div>
                            ),
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
                            title: "Total Price",
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
                                        onClick={() => {
                                            Modal.confirm({
                                                title: "Completed Trip",
                                                content: "Are you sure you want to update status?",
                                                onOk: () => {
                                                    handleUpdateStatus(record);
                                                },
                                            });
                                        }}
                                        disabled={CheckInList.includes(record.status) === false}
                                    >
                                        Complete
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
            {filterListCheckIn.length > 0 ?
                displayBooking(filterListCheckIn, "Booking Checked In", 1)
                : displayBooking(bookingListCheckIn, "Booking Checked In", 1)
            }
            {filterList.length > 0 ?
                displayBooking(filterList, "Others Booking", 2)
                : displayBooking(bookingList, "Others Booking", 2)
            }


            <Drawer
                title="Information Details"
                placement="right"
                loading={loading}
                closable={true}
                onClose={() => setVisible(false)}
                open={visible}
                width={800}
            >
                <h1>Booking Information</h1>
                <Row className={styles.booking_info}>
                    <Col span={10}>
                        <p>
                            <b>Booking Date: </b>
                            {dayjs(drawerInformation.bookingDate).format(dateFormat)}
                        </p>
                        <p>
                            <b>Note: </b>
                            {drawerInformation.note}
                        </p>
                    </Col>
                    <Col span={12}>
                        <p className={styles.total_price}>
                            <b>Total: </b>
                            <span>{drawerInformation.totalPrice} VND</span>
                        </p>
                    </Col>
                </Row>
                <h1>Trip Information</h1>
                <Row className={styles.trip_info}>
                    {drawerInformation?.trip && (
                        <>
                            <Row style={{ width: "100%" }}>
                                <Col span={12}>
                                    <p>
                                        <b>Start date: </b>
                                        {drawerInformation.trip.startDate}
                                    </p>
                                    <p>
                                        <b>End date: </b>
                                        {drawerInformation.trip.endDate}
                                    </p>
                                </Col>
                                <Col span={12}>
                                    <p>
                                        <b>Start location: </b>
                                        {drawerInformation.trip.startLocation}
                                    </p>
                                    <p>
                                        <b>End location: </b>
                                        {drawerInformation.trip.endLocation}
                                    </p>
                                </Col>
                            </Row>

                            <Row className={styles.farm_row}>
                                <List
                                    className={styles.farm_list}
                                    bordered
                                    dataSource={drawerInformation.trip.farms}
                                    renderItem={(item) => (
                                        <List.Item className={styles.farm}>
                                            <img
                                                src={item.image || "https://via.placeholder.com/60"}
                                                alt={item.farmName}
                                                className={styles.farm_image}
                                            />
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
            </Drawer>
        </Layout>
    );
}

export default ConsultingPage;
