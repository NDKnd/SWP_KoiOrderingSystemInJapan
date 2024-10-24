import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Spin, message, Tag, Steps, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../services/axios";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import { useLocation } from "react-router-dom";
import "../Trip/BookingStatusPage.css";

const { Content } = Layout;

const statusColors = {
  PENDING_CONFIRMATION: "orange",
  AWAITING_PAYMENT: "blue",
  IN_PROGRESS: "green",
  CHECK_IN: "purple",
  COMPLETED: "green",
  CANCELED: "red",
};

function BookingStatusPage() {
  const [booking, setBooking] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchBookingData = async (bookingId) => {
      try {
        const bookingResponse = await api.get(`/booking/customer`);
        const bookingData = bookingResponse.data;

        if (bookingData && bookingData.length > 0) {
          if (bookingId) {
            const specificBooking = bookingData.find((b) => b.id === parseInt(bookingId));
            setBooking(specificBooking || bookingData[0]);
          } else {
            bookingData.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
            setBooking(bookingData[0]);
          }
        } else {
          message.error("No booking found.");
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
        message.error("Failed to fetch booking data.");
      } finally {
        setLoading(false);
      }
    };

    const checkPaymentStatus = async () => {
      const queryParams = new URLSearchParams(location.search);
      const transactionStatus = queryParams.get("vnp_TransactionStatus");
      const bookingId = queryParams.get("bookingId");

      if (transactionStatus === "00" && bookingId) {
        try {
          await api.put(`/booking/status/${bookingId}`, {
            status: "IN_PROGRESS",
          });
          message.success("Check out successfully.");
        } catch (error) {
          console.error("Error updating booking status:", error);
          message.error("Failed to update booking status.");
        }
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    };

    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get("bookingId");

    fetchBookingData(bookingId);
    checkPaymentStatus();
  }, [location]);

  const getCurrentStep = (status) => {
    const statusIndex = {
      PENDING_CONFIRMATION: 0,
      AWAITING_PAYMENT: 1,
      IN_PROGRESS: 2,
      CHECK_IN: 3,
      COMPLETED: 4,
      CANCELED: 5,
    };
    return statusIndex[status] || 0;
  };

  const handleUploadChange = ({ file }) => {
    if (file.status === "done" || file.status === "uploading") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleCheckout = () => {
    api.post(`/booking/payment`, { id: booking.id })
      .then((response) => {
        if (response.data) {
          window.location.href = response.data;
        } else {
          message.error("Failed to retrieve payment link.");
        }
      })
      .catch((error) => {
        console.error("Error during checkout:", error);
        message.error("Failed to proceed to checkout.");
      });
  };

  return (
    <Layout>
      <Header />
      <Content className="layout">
        <h2 className="trip-status-title">My Trip Status</h2>
        {loading ? (
          <Spin tip="Loading booking status..." />
        ) : booking ? (
          <>
            <Steps
              current={getCurrentStep(booking.status)}
              status={booking.status === "CANCELED" ? "error" : "process"}
            >
              <Steps.Step
                title="Pending Confirmation"
                description={booking.status === "CANCELED" ? "This trip has been canceled" : ""}
              />
              <Steps.Step
                title="Awaiting Payment"
                description={booking.status === "CANCELED" ? "This trip has been canceled" : ""}
              />
              <Steps.Step
                title="In Progress"
                description={booking.status === "CANCELED" ? "This trip has been canceled" : ""}
              />
              <Steps.Step
                title="Check In"
                description={booking.status === "CANCELED" ? "This trip has been canceled" : ""}
              />
              <Steps.Step
                title="Completed"
                description={booking.status === "CANCELED" ? "This trip has been canceled" : ""}
              />
            </Steps>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col xs={24} md={12}>
                <Card
                  title="Trip Information"
                  className="information-card"
                  bordered
                >
                  <div> 
                    <p><strong>Start Date:</strong> {booking.trip.startDate}</p>
                    <p><strong>End Date:</strong> {booking.trip.endDate}</p>
                    <p><strong>Start Location:</strong> {booking.trip.startLocation}</p>
                    <p><strong>End Location:</strong> {booking.trip.endLocation}</p>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title="Booking Information"
                  className="information-card"
                  bordered
                >
                  <p><strong>Booking ID:</strong> {booking.id}</p>
                  <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Tag color={statusColors[booking.status]}>
                      {booking.status.replace("_", " ")}
                    </Tag>
                  </p>
                  <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                  <p><strong>Note:</strong> {booking.note}</p>
                  {booking.status === "AWAITING_PAYMENT" && (
                    <Button className="checkout-button" type="primary" onClick={handleCheckout}>
                      Check Out
                    </Button>
                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: "20px" }}>
              <Col xs={24}>
                <Card title="Upload Ticket Image" bordered> 
                  <Upload onChange={handleUploadChange} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                  {uploadedImage && (
                    <div className="upload-btn">
                      <img className="ticket-img" src={uploadedImage} alt="Uploaded" />
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <p>No trip status available.</p>
        )}
      </Content>
      <Footer />
    </Layout>
  );
}

export default BookingStatusPage;
