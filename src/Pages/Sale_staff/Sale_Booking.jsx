import { Col, Drawer, Layout, List, message, Modal, Row, Table } from "antd";
import styles from "./SaleLayOut.module.css";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import dayjs from "dayjs";

const dateFormat = "MM-DD-YYYY";
const Able = [
  "PENDING_CONFIRMATION",
];
const Unable = [
  "AWAITING_PAYMENT",
  "IN_PROGRESS",
  "CHECK_IN",
  "COMPLETED",
  "CANCELED",
];


function Sale_Booking() {
  console.log("token", localStorage.getItem("token"));

  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);
  const [drawerInformation, setDrawerInformation] = useState([]);

  const [bookingList, setBookingList] = useState([]);
  const [bookingListAccept, setBookingListAccept] = useState([]);

  const fetchBookingManger = async () => {
    const res = await api.get("booking/manager");
    setLoading(false);
    var list = res.data;

    setBookingListAccept(
      list
        .filter((item) => item.status != "PENDING_CONFIRMATION")
        .map((item) => ({
          ...item,
          key: item.id,
        }))
    )
    setBookingList(
      list
        .filter((item) => item.status === "PENDING_CONFIRMATION")
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

  const handleSearch = () => { };

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
        title: "Update Price",
        maskClosable: true,
        content: (
          <div className={styles.modal_content}>
            <label htmlFor="price">Price</label>
            <input
              placeholder="Enter price" type="number" id="price"
              defaultValue={values.totalPrice.toFixed(2)}
              inputMode="decimal"
              min="0"
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
              totalPrice: price,
            });
            console.log(res.data);
            message.success({
              content: "Update price successfully!",
              style: { position: "relative", top: "10px", right: "10px" },
            });
            fetchBookingManger();
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
  const displayBooking = (booking, title) => {
    return (
      <div className={styles.box_table}>
        <h2 className={styles.title}>{title}</h2>
        <Table
          loading={loading}
          pagination={{
            position: ["bottomCenter"],
            showQuickJumper: true, // Cho phép nhảy tới trang cụ thể
          }}
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
                <button
                  className={styles.update_btn + " " + styles.button}
                  onClick={() => handleUpdatePrice(record)}
                  disabled={Able.includes(record.status) === false}
                >
                  Update Price
                </button>
              )
            },
          ]}
        />
      </div>
    );
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }} className={styles.container}>
      {displayBooking(bookingList, "Booking List")}
      {displayBooking(bookingListAccept, "Booking List Accept")}

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
          <Col span={10} >
            <p>
              <b>Booking Date: </b>
              {dayjs(drawerInformation.bookingDate).format(dateFormat)}
            </p>
            <p>
              <b>Note: </b>
              {drawerInformation.note}
            </p>
          </Col>
          <Col span={11} >
            <p className={styles.total_price}>
              <b>Total: </b>
              <span>{drawerInformation.totalPrice?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")} VND</span>
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
                  dataSource={drawerInformation.trip.farms}
                  renderItem={(item) => (
                    <List.Item className={styles.farm}>
                      {/* Hình ảnh farm */}
                      <img
                        src={item.image || "https://via.placeholder.com/60"}
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

      </Drawer>

    </Layout>
  );
}

export default Sale_Booking;
