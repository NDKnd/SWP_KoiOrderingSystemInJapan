import { Button, Col, Drawer, Image, Layout, List, message, Modal, Row, Select, Spin, Table } from "antd";
import styles from "./SaleLayOut.module.css";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import dayjs from "dayjs";
import { FaFilter } from "react-icons/fa";
import upFile from "../../utils/file";
import storage from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";

const dateFormat = "MM-DD-YYYY";
const Able = [
  "PENDING_CONFIRMATION",
];


function Sale_Booking() {
  console.log("token", localStorage.getItem("token"));

  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);
  const [drawerInformation, setDrawerInformation] = useState([]);

  const [bookingList, setBookingList] = useState([]);
  const [bookingListPending, setBookingListPending] = useState([]);
  const [bookingListAccept, setBookingListAccept] = useState([]);


  const [filterList, setFilterList] = useState([]);
  const [filterUser1, setFilterUser1] = useState("All");
  const [filterTrip, setFilterTrip] = useState("All");

  const [filterListPending, setFilterListPending] = useState([]);
  const [filterUser2, setFilterUser2] = useState("All");
  const [filterStatus2, setFilterStatus2] = useState("All");
  const [filterTrip2, setFilterTrip2] = useState("All");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [refundModal, setRefundModal] = useState(false);
  const [file, setFile] = useState(null);
  const [refundImage, setRefundImage] = useState(null);

  const statusOrder = [
    "AWAITING_REFUND",
    "CANCEL",
    "AWAITING_PAYMENT",
    "IN_PROGRESS",
    "CHECK_IN",
    "COMPLETED",
  ];

  const fetchBookingManger = async () => {
    const res = await api.get("booking/manager");
    setLoading(false);
    var list = res.data;

    setBookingListAccept(
      list
        .filter((booking) => statusOrder.includes(booking.status))
        .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
        .map((item) => ({
          ...item,
          key: item.id,
        }))
    )
    setBookingListPending(
      list
        .filter((item) => item.status === "PENDING_CONFIRMATION")
        .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
        .map((item) => ({
          ...item,
          key: item.id,
        }))
    );
    setBookingList(list);
    console.log(list);
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

  const handleUpdatePrice = (values) => {
    console.log("update", values);
    try {

      Modal.info({
        title: "Update Ticket Price",
        closable: true,
        content: (
          <div className={styles.modal_content}>
            <label htmlFor="price">Price</label>
            <input
              placeholder="Enter price" type="number" id="price"
              defaultValue={values.totalPrice.toFixed(2)}
              inputMode="decimal"
            />
          </div>
        ),
        okText: "Submit Price",
        onOk: async () => {
          const price = document.getElementById("price").value;
          console.log("price", price);
          if (price < 10000) {
            message.error("Price must be at least 10,000 VND!");
            return;
          }
          try {
            message.warning("Please wait...");
            const res = await api.put(`booking/price/${values.id}`, {
              ticketPrice: price,
            });
            console.log(res.data);
            message.success({
              content: "Update price successfully!",
              style: { position: "relative", top: "10px", right: "10px" },
            });
            window.location.reload(true);
          } catch (error) {
            message.error("Error updating price!");
            console.log(error.message?.data || error);
          }
        },

      });

    } catch (error) {
      console.log(error.message?.data || error);
      message.error("Error updating price!");
    }
  };

  const handleViewDetails = (values) => {
    console.log("values", values);
    setDrawerInformation(values);
    setVisible(true);
  };

  const handleFilter = (type) => {

    const filteredBookingTrips =
      type === 1 ?
        bookingListPending.filter((booking) => {
          const matchesUser = filterUser1 === "All" ? true
            : booking.account.username.toLowerCase().includes(filterUser1.toLowerCase());
          const matchesTrip = filterTrip === "All" ? true
            : booking.trip.id === parseInt(filterTrip);
          console.log("matchesTrip: ", matchesTrip + " " + filterTrip);
          console.log("matchesUser: ", matchesUser + " " + filterUser1);
          return (matchesUser && matchesTrip);
        }
        )
        :
        bookingListAccept.filter((booking) => {
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
        ? setFilterListPending(filteredBookingTrips)
        : setFilterList(filteredBookingTrips)
      : (
        setFilterListPending([]),
        setFilterList([]),
        message.error("No booking found")
      );
  }

  const handlePreview = (record) => {
    Modal.info({
      width: 600,
      aspectRatio: 3 / 2,
      title: <img src={record.image}
        className={styles.img_Koi} style={{ width: "100%", padding: "15px" }} alt="koi" />,
      maskClosable: true,
      closable: true,
      footer: null,
      icon: null,
    });
  };

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
                    ? console.log("table1")
                    : (value) => setFilterStatus2(value, typeTable)
                }
                defaultValue="All"
              >
                <Select.Option value="All">All</Select.Option>
                {statusOrder.map(status => <Select.Option key={status} value={status}>{status}</Select.Option>)}
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
              {bookingList.reduce((uniqueUsers, b) => {
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
              {bookingList.reduce((uniqueTrips, b) => {
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
          }}
          style={{ overflow: "auto" }}
          dataSource={booking}
          columns={[
            {
              title: "Booking Date",
              dataIndex: "bookingDate",
              key: "bookingDate", width: 150,
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
              title: "User Name",
              dataIndex: "account",
              key: "account",
              render: (account) => account?.username,
            },
            {
              title: "Ticket Price",
              dataIndex: "ticketPrice",
              key: "ticketPrice",
              render: (price) => {
                return price != null && price != 0
                  ? <span style={{ color: "black" }}>
                    {price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} / ticket
                  </span>
                  : <span style={{ color: "gray" }}>{price} / ticket</span>
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
              render: (_, record) => {
                if (record.status === "AWAITING_REFUND") {
                  return (
                    <button
                      className={styles.refund_btn + " " + styles.button}
                      onClick={() => showRefundModal(record)}
                    >
                      Refund
                    </button>
                  );
                } else {
                  return (
                    <button
                      className={styles.update_btn + " " + styles.button}
                      onClick={() => handleUpdatePrice(record)}
                      disabled={Able.includes(record.status) === false}
                    >
                      Update Price
                    </button>
                  );
                }
              },
            },
          ]}
        />
      </div>
    );
  };

  const showRefundModal = (record) => {
    setSelectedRecord(record);
    setRefundModal(true);
  };

  const handleUploadChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setRefundImage(reader.result);
    };
    setFile(file);
  };

  const handleRefund = async () => {
    setLoading(true);
    if (!refundImage) {
      message.error("Please upload an image for the refund.");
      return;
    }
    const downloadURL = await upFile(file, `Bookings/${selectedRecord.id}`);
    if (downloadURL) {
      selectedRecord.image = downloadURL;
      try {
        const res = await api.put(`/booking/cancle/refund/${selectedRecord.id}`, {
          refundImage: downloadURL,
        });
        console.log(res.data);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }} className={styles.container}>
      {filterListPending.length > 0 ?
        displayBooking(filterListPending, "Booking List Pending", 1)
        : displayBooking(bookingListPending, "Booking List Pending", 1)
      }
      {filterList.length > 0 ?
        displayBooking(filterList, "Booking List", 2)
        : displayBooking(bookingListAccept, "Booking List", 2)
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
          <Col span={16} >
            <p>
              <b>Booking Date: </b>
              {dayjs(drawerInformation.bookingDate).format(dateFormat)}
            </p>
            {(drawerInformation.status === "AWAITING_REFUND" || drawerInformation.refundImage) ? (
              <div>
                <p><strong>Refund Information</strong></p>
                <p>Bank: {drawerInformation.note.split(" - ")[0]}</p>
                <p>Account Number: {drawerInformation.note.split(" - ")[1]}</p>
                <p>Account Name: {drawerInformation.note.split(" - ")[2]}</p>
                <p>Refund money: {drawerInformation.trip.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
              </div>
            ) : (
              <p><strong>Note:</strong> {drawerInformation.note}</p>
            )}
          </Col>
          <Col span={4} >
            <p className={styles.total_price}>
              <b>Total: </b>
              {drawerInformation.totalPrice?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </p>
          </Col>
        </Row>
        <h1>Trip Information</h1>
        <Row className={styles.trip_info}>
          {drawerInformation?.trip && (
            <>
              <Row style={{ width: "100%" }}>
                <Col span={12} >
                  <p>
                    <b>Start date: </b>
                    {drawerInformation.trip.startDate}
                  </p>
                  <p>
                    <b>End date: </b>
                    {drawerInformation.trip.endDate}
                  </p>
                </Col>
                <Col span={12} >
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
                  dataSource={drawerInformation.trip.tripDetails}
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
        {drawerInformation.refundImage && (
          <>
            <h1>Refund Image</h1>
            <Row className={styles.trip_info}>
              <div>
                <Image className={styles.refund_image} src={drawerInformation.refundImage} />
              </div>
            </Row>
          </>
        )}
      </Drawer>
      <Modal
        title="Upload Refund Image"
        visible={refundModal}
        onCancel={() => setRefundModal(false)}
        okText="Submit"
        onOk={handleRefund}
      >
        <div>
          <input
            style={{ width: "100%" }}
            type="file"
            accept="image/*"
            onChange={handleUploadChange}
          />
        </div>
        {refundImage && (
          <div>
            <img style={{ width: "100%" }} src={refundImage} alt="Uploaded" />
          </div>
        )}
      </Modal>
    </Layout>
  );
}

export default Sale_Booking;


