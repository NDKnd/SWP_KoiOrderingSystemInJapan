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

  useEffect(() => {
    const fetchBookingManger = async () => {
      const res = await api.get("booking/manager");

      setLoading(false);
      setBookingList(res.data);
      console.log(res.data);
    };
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

  const handleUpdate = (values) => {
    console.log("update", values);

    Modal.info({
      title: "Update Price",
      maskClosable: true,
      content: (
        <div className={styles.modal_content}>
          <label htmlFor="price">Price</label>
          <input placeholder="Enter price" type="number" id="price" ></input>
        </div>
      ),
      okText: "Submit Price",
      onOk: async () => {
        try {
          const res = await api.put(`booking/${values.id}`, {
            TotalPrice: values.price,
          });
        } catch (error) {
          message.error("Error updating price!");
        }
      },

    });

  };

  const handleDelete = (values) => {
    console.log("delete", values);
    Modal.confirm({
      title: "Are you sure delete this booking?",
      content: `Booking id: ${values}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {


          message.success({
            content: "Delete booking successfully!",
            style: { position: "relative", top: "10px", right: "10px" },
          });
        } catch (error) {
          console.log(error.message?.data || error);
          message.error("Error deleting booking!");
        }
      },
    });
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
              title: "Image",
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
              render: (price) => <span style={{ color: "gray" }}>{price.toFixed(2)}</span>,
            },
            {
              title: "View Detail",
              dataIndex: "viewDetail",
              key: "viewDetail",
              render: (_, record) => (
                <button
                  className={styles.view_btn}
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
                    onClick={() => handleUpdate(record)}
                  >
                    Update Price
                  </button>
                  <button
                    className={styles.delete_btn + " " + styles.button}
                    onClick={() => handleDelete(record)}
                  >
                    Delete
                  </button>
                </>
              ),
            },
          ]}
        />
      </div>
    );
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }} className={styles.container}>
      {displayBooking(bookingList)}
    </Layout>
  );
}

export default Sale_Booking;
