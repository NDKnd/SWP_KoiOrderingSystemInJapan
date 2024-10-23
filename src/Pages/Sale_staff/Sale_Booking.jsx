import { Divider, Layout, List, message, Table } from "antd";
import styles from "./SaleLayOut.module.css";
import { useEffect, useState } from "react";
import api from "../../services/axios";

function Sale_Booking() {
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    const fetchBookingManger = async () => {
      const res = await api.get("booking/manager");

      setBookingList(res.data);
      console.log(res.data);
    };
    fetchBookingManger();
  }, []);

  const displayBooking = (booking) => {
    console.log(booking);
    return <h1>troll</h1>;
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }} className={styles.container}>
      <div className={styles.box}>
        <Divider className={styles.divider} orientation="left">
          Booking list
        </Divider>
        {bookingList
          ? displayBooking(bookingList)
          : message.error("No booking found")}
      </div>

      <div className={styles.box}>
        <Divider className={styles.divider} orientation="left">
          Booking list
        </Divider>
        <List
          className={styles.list}
          itemLayout="horizontal"
          dataSource={[]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    </Layout>
  );
}

export default Sale_Booking;
