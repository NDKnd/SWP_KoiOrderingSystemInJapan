import React, { useState, useEffect } from "react";
import { Divider, ConfigProvider, Tabs, Card, Button, message, Row, Col, Spin, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";

const statusColors = {
  PENDING_CONFIRMATION: "orange",
  AWAITING_PAYMENT: "blue",
  IN_PROGRESS: "green",
  CHECK_IN: "purple",
  COMPLETED: "green",
  CANCELED: "red",
};

const tabPanels = [{ id: 1, label: "All", content: <Trips /> }];

function Trips() {
  const [bookings, setBookings] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingResponse = await api.get("/booking/customer");
        setBookings(bookingResponse.data);

        const farmResponse = await api.get("/farm");
        setFarms(farmResponse.data);
      } catch (error) {
        console.error("Error fetching bookings or farms:", error);
        message.error("Failed to fetch bookings or farms.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDetails = (bookingId) => {
    navigate(`/book-status?bookingId=${bookingId}`);
  };

  const getFarmImageByTripId = (tripId) => {
    const farm = farms.find((farm) => farm.trips.some((trip) => trip.id === tripId));
    return farm.image;
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
          <Tabs.TabPane tab="All" key="1">
            {loading ? (
              <Spin tip="Loading bookings..." />
            ) : bookings && bookings.length > 0 ? (
              <Row gutter={[16, 16]}>
                {bookings.map((booking) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={booking.id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt="trip"
                          src={getFarmImageByTripId(booking.trip.id)}
                        />
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
                        title={`Booking ID: ${booking.id}`}
                        description={
                          <>
                            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                            <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                            <p>
                              <strong>Status:</strong>{" "}
                              <Tag color={statusColors[booking.status]}>
                                {booking.status.replace("_", " ")}
                              </Tag>
                            </p>
                            <p><strong>Note:</strong> {booking.note}</p>
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
        </Tabs>
      </ConfigProvider>
    </>
  );
}

export default Trips;
