import { Divider, Drawer, Layout, message, Modal, Table } from "antd";
import styles from "./SaleLayOut.module.css";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import dayjs from "dayjs";

const dateFormat = "MM-DD-YYYY";
const statusIndex = {
  PENDING_CONFIRMATION: 0,
  AWAITING_PAYMENT: 1,
  IN_PROGRESS: 2,
  CHECK_IN: 3,
  COMPLETED: 4,
  CANCELED: 5,
};

function Sale_Booking() {
  console.log("token", localStorage.getItem("token"));

  const [loading, setLoading] = useState(true);

  const [bookingList, setBookingList] = useState([]);
  const [bookingListAccept, setBookingListAccept] = useState([]);
  // const [recommendPrice, setRecommendPrice] = useState([]);

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

  // const fetchRecommendPrice = async () => {
  //   const res = await api.get("booking/manager");
  //   setLoading(false);
  //   var list = res.data;
  //   setRecommendPrice(
  //     list
  //       .filter((trip) => trip.status === "PENDING_CONFIRMATION")
  //       .map((trip) => (
  //         {
  //           id: trip.id,
  //           recommend_price: 0.00,
  //         }
  //       ))
  //   );
  //   console.log("recoPriceList", list
  //     .filter((trip) => trip.status === "PENDING_CONFIRMATION")
  //     .map((trip) => (
  //       {
  //         id: trip.id,
  //         recommend_price: 0.00,
  //       }
  //     )))
  // };

  useEffect(() => {
    // fetchRecommendPrice();
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
            />
          </div>
        ),
        okText: "Submit Price",
        onOk: async () => {
          const price = document.getElementById("price").value;
          console.log("price", price);
          try {
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
    console.log("view details", values);
  };

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
                    onClick={() => handleUpdatePrice(record)}
                  >
                    Update Price
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
      {displayBooking(bookingList)}
      {displayBooking(bookingListAccept)}
    </Layout>
  );
}

export default Sale_Booking;
