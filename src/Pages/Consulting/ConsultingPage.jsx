/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import styles from './ConsultingStyle.module.css'
import { Button, Col, Drawer, Image, Layout, List, message, Modal, Row, Select, Spin, Table, Upload } from 'antd'
import api from "../../services/axios";
import dayjs from "dayjs";
import { FaFilter } from 'react-icons/fa';
import { deleteObject, list, ref } from 'firebase/storage';
import upFile from '../../utils/file';
import storage from '../../config/firebase';
import { ImEmbed } from 'react-icons/im';

const dateFormat = "YYYY-MM-DD";

const CheckInList = [
    "CHECK_IN",
    "IN_PROGRESS"
];
const CompleteList = [
    "COMPLETED",
];

const statusList = [
    "CANCEL",
    "IN_PROGRESS",
    "COMPLETED"
]

function ConsultingPage() {

    console.log("token", localStorage.getItem("token"));

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [drawerInformation, setDrawerInformation] = useState([]);

    const [visibleCheckIn, setVisibleCheckIn] = useState(false);
    const [tripCheckIn, setTripCheckIn] = useState([]);
    const [files, setFiles] = useState([]);
    const [listImagePreview, setListPreview] = useState([]);

    const [listBookings, setListBookings] = useState([]);
    const [bookingList, setBookingList] = useState([]);
    const [bookingListCheckIn, setBookingListCheckIn] = useState([]);

    const [filterList, setFilterList] = useState([]);
    const [filterUser1, setFilterUser1] = useState("All");
    const [filterStatus1, setFilterStatus1] = useState("All");
    const [filterTrip, setFilterTrip] = useState("All");

    const [filterListCheckIn, setFilterListCheckIn] = useState([]);
    const [filterUser2, setFilterUser2] = useState("All");
    const [filterStatus2, setFilterStatus2] = useState("All");
    const [filterTrip2, setFilterTrip2] = useState("All");

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

    const handleCompleteTrip = async (record) => {
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

    const handleOpenModalCheckIn = (record) => {
        console.log("values", record);
        setFiles([]);
        setListPreview([]);

        setTripCheckIn(record);
        setVisibleCheckIn((prev) => !prev);
    };

    const handleFileChange = async (selectedFiles) => {
        const filesArray = Array.from(selectedFiles);
        const previewList = await Promise.all(filesArray.map(async (file) => {
            const fileURL = URL.createObjectURL(file);
            if (file.type.startsWith("image/") || file.type === "application/pdf") {
                return {
                    url: fileURL,
                    isPDF: file.type === "application/pdf",
                    fileName: file.name,
                };
            } else {
                console.error("Unsupported file type:", file.type);
                return null;
            }
        }));
        setListPreview(previewList);
        setFiles(filesArray);

        // Cleanup các URL Object khi không dùng nữa
        return () => previewList.forEach((file) => URL.revokeObjectURL(file.url));
    };

    const deleteFile = async (url) => {
        if (url) {
            const ImageRef = ref(storage, url);
            await deleteObject(ImageRef);
        }
    };

    const handleCheckinTicket = async () => {
        setLoading(true);
        setVisibleCheckIn(false);
        console.log("TripCheckIn", tripCheckIn);
        console.log("files", files);

        if (files && files.length > 0) {
            const folderName = `CheckInTickets/${tripCheckIn.id}`; // Thư mục trong Firebase
            const uploadedUrls = await Promise.all(
                files.map(async (file) => {
                    const url = await upFile(file, folderName);
                    if (url) {
                        console.log(`Uploaded ${file.name}: ${url}`);
                        return url;
                    } else {
                        console.error(`Failed to upload ${file.name}`);
                        return null;
                    }
                })
            );
            console.log("Uploaded Files URLs:", uploadedUrls.join(";"));

            if (uploadedUrls && uploadedUrls.length > 0) {
                const urlsFiles = uploadedUrls.join(";").toString();
                try {
                    await api.put(`booking/check-in/${tripCheckIn.id}`, {
                        image: urlsFiles,
                    });
                    await api.put(`booking/status/${tripCheckIn.id}`, {
                        status: "CHECK_IN"
                    });
                    setLoading(true);
                    message.success("Check in successfully");
                    fetchBookingManager();
                } catch (error) {
                    console.error("Error during check in:", error);
                    message.error("Failed to check in");

                    // Xóa các file đã upload lên Firebase
                    const deletePromises = uploadedUrls
                        .filter((url) => url)
                        .map((url) => deleteFile(url));
                    await Promise.allSettled(deletePromises);
                }
            }
        }
        setLoading(true);
    };

    const handleUpdateStatus = async (record) => {
        setFiles([]);
        setListPreview([]);

        console.log("record", record);
        if (record.status === CheckInList[0]) {
            handleCompleteTrip(record);
        } else if (record.status === CheckInList[1]) {
            handleOpenModalCheckIn(record);
        }
    };

    const handleViewDetails = (record) => {
        console.log("values", record);
        setDrawerInformation(record);
        setVisible(true);
    };

    const handlePreview = (record) => {
        if (!record.image) {
            message.error("No image");
            return;
        }

        const urls = record.image.split(";").filter((url) => url);
        console.log("urls", urls);

        Modal.info({
            width: 600,
            aspectRatio: 3 / 2,
            title: "Preview Files",
            content: (
                <List
                    grid={{
                        gutter: 16,
                        column: 3,
                    }}
                    dataSource={urls}
                    renderItem={(url) => {
                        const eachFile = decodeURIComponent(url.split("/").pop().split("?")[0])
                        const isPDF = eachFile.toLowerCase().endsWith(".pdf"); // Kiểm tra đuôi file
                        return (
                            <List.Item>
                                <div className={styles.file_preview}>
                                    <p>{decodeURIComponent(url).split("/").pop().split("?")[0]}</p>
                                    {isPDF ? (
                                        <div className={styles.pdf_preview}>
                                            <Button
                                                type="primary"
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View PDF
                                            </Button>
                                            <Button
                                                type="primary"
                                                href={url}
                                                download={decodeURIComponent(url.split("/").pop().split("?")[0])}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    ) : (
                                        <Image
                                            src={url}
                                            alt="preview"
                                            className={styles.file_preview_image}
                                        />
                                    )}
                                </div>
                            </List.Item>
                        );
                    }}
                />
            ),
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
                    const matchesStatus = filterStatus1 === "All" ? true
                        : booking.status.toLowerCase().includes(filterStatus1.toLowerCase());
                    const matchesTrip = filterTrip === "All" ? true
                        : booking.trip.id === parseInt(filterTrip);
                    console.log("matchesTrip: ", matchesTrip + " " + filterTrip);
                    console.log("matchesUser: ", matchesUser + " " + filterUser1);
                    console.log("matchesStatus: ", matchesStatus + " " + filterStatus1);
                    return (matchesUser && matchesStatus && matchesTrip);
                }
                )
                :
                bookingList.filter((booking) => {
                    const matchesUser = filterUser2 === "All" ? true
                        : booking.account.username.toLowerCase().includes(filterUser2.toLowerCase());
                    const matchesStatus = filterStatus2 === "All" ? true
                        : booking.status.toLowerCase().includes(filterStatus2.toLowerCase());
                    const matchesTrip = filterTrip2 === "All" ? true
                        : booking.trip.id === parseInt(filterTrip2);
                    console.log("matchesTrip: ", matchesTrip + " " + filterTrip2);
                    console.log("matchesUser: ", matchesUser + " " + filterUser2);
                    console.log("matchesStatus: ", matchesStatus + " " + filterStatus2);
                    return (matchesUser && matchesStatus && matchesTrip);
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
                    <div>{/*filter by status*/}
                        <label htmlFor="filter">Status: </label>
                        <Select
                            id="filter"
                            style={{ width: 200 }}
                            onChange={
                                typeTable === 1
                                    ? (value) => setFilterStatus1(value, typeTable)
                                    : (value) => setFilterStatus2(value, typeTable)
                            }
                            defaultValue="All"
                        >
                            <Select.Option value="All">All</Select.Option>
                            {statusList.map(status => <Select.Option key={status} value={status}>{status}</Select.Option>)}
                        </Select>
                    </div>
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
                    <div> {/* filter by trip */}
                        <label htmlFor="filter3">Trip: </label>
                        <Select
                            id="filter3"
                            style={{ width: 240 }}
                            onChange={
                                typeTable === 1
                                    ? (value) => setFilterTrip(value, typeTable)
                                    : (value) => setFilterTrip2(value, typeTable)
                            }
                            defaultValue="All"
                        >
                            <Select.Option value="All">All</Select.Option>
                            {listBookings.reduce((uniqueTrips, b) => {
                                const tripIdentifier = `${b.trip.id}-${b.trip.startLocation}-${b.trip.endLocation}`;
                                if (!uniqueTrips.some(trip => trip.identifier === tripIdentifier)) {
                                    uniqueTrips.push({ identifier: tripIdentifier, ...b.trip });
                                }
                                return uniqueTrips;
                            }, []).map(trip => (
                                <Select.Option key={trip.id} value={trip.id}>
                                    {`${trip.startLocation} - ${trip.endLocation}`}
                                </Select.Option>
                            ))}
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
                                image
                                    ? (<a onClick={() => handlePreview({ image })}>
                                        <p>View Tickets</p>
                                    </a>)
                                    : <p style={{ color: "gray" }}>None</p>
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
                                                title: record.status === CheckInList[1]
                                                    ? "Confirm Update"
                                                    : "Confirm Complete",
                                                content: "Are you sure you want to update?",
                                                onOk: () => {
                                                    handleUpdateStatus(record);
                                                },
                                            });
                                        }}
                                        disabled={CheckInList.includes(record.status) === false}
                                    >
                                        {record.status === CheckInList[1] ? "Check In" : "Complete"}
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

            {/* Modal Checkin Ticket */}
            <Modal
                title="Input Image"
                open={visibleCheckIn}
                onOk={handleCheckinTicket}
                onCancel={() => {
                    setVisibleCheckIn(false);
                    setFiles([]);
                    setListPreview([]);
                }}
                width={files.length > 0 ? "50%" : "35%"}
            >
                <Spin spinning={loading}>
                    <List
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={listImagePreview}
                        renderItem={(item, index) => (
                            <List.Item
                                className={styles.list_item}
                                key={`${item}-${index}`} // Ensures a unique key
                                actions={[
                                    <Button
                                        type="dashed"
                                        danger
                                        onClick={() => {
                                            const newFiles = [...files];
                                            const newPreview = [...listImagePreview];
                                            newFiles.splice(index, 1);
                                            newPreview.splice(index, 1);
                                            setFiles(newFiles);
                                            setListPreview(newPreview);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                ]}
                            >
                                {item.isPDF ? (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <Button type="default" style={{ height: "fit-content", width: "100%" }}>
                                            <div style={{ whiteSpace: "normal", wordWrap: "break-word", width: "100%" }}>
                                                View <b style={{ color: "black" }} >{item.fileName}</b>
                                            </div>
                                        </Button>
                                    </a>
                                ) : (
                                    <Image
                                        src={item.url}
                                        alt="image"
                                        className={styles.image_preview}
                                    />
                                )}
                            </List.Item>
                        )}
                    />

                    <input
                        type="file"
                        multiple
                        style={{ width: "100%", height: "100%" }}
                        onChange={(e) => handleFileChange(e.target.files)}
                        accept=".png, .jpg, .jpeg, .pdf"
                    />
                </Spin>
            </Modal>

            {/* View Detail */}
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
                            <span>
                                {drawerInformation.totalPrice
                                    ? drawerInformation.totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                                    : "N/A"}
                            </span>
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
                                    dataSource={drawerInformation.trip.tripDetails
                                        .sort((a, b) => new Date(a.travelDate) - new Date(b.travelDate))}
                                    renderItem={(item) => (
                                        <List.Item className={styles.farm}>
                                            {/* Hình ảnh farm */}
                                            <a onClick={() => handlePreview(item.farm)}>
                                                <img className={styles.farm_image}
                                                    src={item.farm.image || "https://via.placeholder.com/60"}
                                                    alt="img"
                                                />
                                            </a>
                                            {/* Nội dung farm */}
                                            <div className={styles.farm_content}>
                                                <h3><b>{item.farm.farmName || "No farm name available"}</b></h3>
                                                <b>Travel Date: </b>{item.travelDate || "No travel date available"}
                                                <br />
                                                <b>Location: </b>{item.farm.location || "No farm location available"}
                                                <br />
                                                <b>Phone: </b>{item.farm.phone || "No farm phone available"}
                                                <br />
                                                <b>Email: </b>{item.farm.email || "No farm email available"}
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
