import React, { useState, useEffect } from "react";
import { Divider, ConfigProvider, Tabs, Card, Button, message, Row, Col, Spin, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import dayjs from "dayjs";

const statusColors = {
  PENDING_CONFIRMATION: "orange",
  AWAITING_PAYMENT: "blue",
  IN_PROGRESS: "green",
  CHECK_IN: "purple",
  COMPLETED: "green",
  CANCELED: "red",
};

const statusOrder = [
  "PENDING_CONFIRMATION",
  "AWAITING_PAYMENT",
  "IN_PROGRESS",
  "CHECK_IN",
  "COMPLETED",
  "CANCEL",
];

const tabPanels = [
  { key: "All", label: "All", status: "All" },
  ...statusOrder.map((status) => ({
    key: status,
    label: status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()),
    status,
  })),
];


function Trips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingResponse = await api.get("/booking/customer");
        const sortedBookings = bookingResponse.data.sort(
          (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        );
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDetails = (bookingId) => {
    navigate(`/book-status?bookingId=${bookingId}`);
  };

  const filterBookingsByStatus = (status) => {
    return status === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === status);
  };

  return (
    <>
      <Divider orientation="right">
        <h3>Trips</h3>
      </Divider>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              colorPrimary: "var(--purple1)",
              itemHoverColor: "var(--purple2)",
              itemActiveColor: "var(--purple5)",
            },
          },
        }}
      >
        <Tabs>
          {tabPanels.map((panel) => (
            <Tabs.TabPane tab={panel.label} key={panel.key}>
              {loading ? (
                <Spin tip="Loading bookings..." />
              ) : filterBookingsByStatus(panel.status).length > 0 ? (
                <Row gutter={[16, 16]}>
                  {filterBookingsByStatus(panel.status).map((booking) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={booking.id}>
                      <Card
                        hoverable
                        cover={
                          booking.trip.farms && booking.trip.farms[0] && booking.trip.farms[0].image ? (
                            <img
                              alt="trip"
                              src={booking.trip.farms[0].image}
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          ) : (
                            <div>No Image Available</div>
                          )
                        }
                        actions={[
                          <Button
                            key={booking.id}
                            type="primary"
                            onClick={() => handleDetails(booking.id)}
                          >
                            Details
                          </Button>,
                        ]}
                      >
                        <Card.Meta
                          title={`Book Date: ${dayjs(booking.bookingDate).format("YYYY-MM-DD")}`}
                          description={
                            <>
                              <p>
                                <strong>Total Price:</strong> {booking.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
                              </p>
                              <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                              <p>
                                <strong>Status:</strong>{" "}
                                <Tag color={statusColors[booking.status]}>
                                  {booking.status.replace("_", " ")}
                                </Tag>
                              </p>
                              {booking.status === "AWAITING_REFUND" ? (
                                <>
                                  <p><strong>Refund Information</strong></p>
                                  <p>Bank: {booking.note.split(" - ")[0]}</p>
                                  <p>Account Number: {booking.note.split(" - ")[1]}</p>
                                  <p>Account Name: {booking.note.split(" - ")[2]}</p>
                                </>
                              ) : (
                                <p><strong>Note:</strong> {booking.note}</p>
                              )}
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No bookings found.</p>
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </ConfigProvider>
    </>
  );
}

export default Trips;
