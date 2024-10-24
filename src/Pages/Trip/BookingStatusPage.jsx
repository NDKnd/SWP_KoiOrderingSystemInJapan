import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Spin, message, Tag, Steps, Upload, Button, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../services/axios";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import { useLocation } from "react-router-dom";
import "../Trip/BookingStatusPage.css";
import upFile from "../../utils/file";
import storage from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";

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
  const [file, setFile] = useState(null);
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

  const handleUploadChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    setFile(file);
    console.log("image : ", file);
  };

  const handleCheckIn = async () => {

    const downloadURL = await upFile(file, `Bookings/${booking.id}`); // Tải file lên Firebase

    if (downloadURL) {
      // Cập nhật booking với URL của ảnh checkin
      booking.image = downloadURL;
      console.log("checkIn.image: ", downloadURL);
      try {
        const res = await api.put(`booking/check-in/${booking.id}`,
          {
            image: downloadURL
          }
        );
        const res2 = await api.put(`booking/status/${booking.id}`, {
          status: "CHECK_IN",
        })
        console.log("res: ", res.data);
        console.log("res2: ", res2.data);
        message.success("Check in successfully.");
      } catch (error) {
        deleteFile(downloadURL);
        message.error("Failed to check in.");
        console.log(error);
      }
    }
    setFile(null);
  };
  const deleteFile = async (url) => {
    if (url) {
      const ImageRef = ref(storage, url);
      await deleteObject(ImageRef);
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
                  title="Trip and Farm Information"
                  className="information-card"
                  bordered
                >
                  <div style={{ marginBottom: "24px" }}>
                    <h3>Trip Information</h3>
                    <p><strong>Start Date:</strong> {booking.trip.startDate}</p>
                    <p><strong>End Date:</strong> {booking.trip.endDate}</p>
                    <p><strong>Start Location:</strong> {booking.trip.startLocation}</p>
                    <p><strong>End Location:</strong> {booking.trip.endLocation}</p>
                  </div>
                  <h3>Farm Information</h3>
                  {booking.trip.farms && booking.trip.farms.length > 0 ? (
                    booking.trip.farms.map((farm) => (
                      <div key={farm.id}>
                        <p><strong>Location:</strong> {farm.location}</p>
                        <p><strong>Phone:</strong> {farm.phone}</p>
                        <p><strong>Email:</strong> {farm.email}</p>
                      </div>
                    ))
                  ) : (
                    <p>No farms selected for this trip.</p>
                  )}
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
                {!booking.image ? (
                  <Card title="Upload Ticket Image" bordered>
                    <input type="file" onChange={(e) => handleUploadChange(e)} />
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    {uploadedImage && (
                      <div className="uploaded-image-container">
                        <div className="upload-btn">
                          <Button
                            icon={<UploadOutlined />}
                            style={{
                              width: "200%",
                              fontSize: "20px",
                            }}
                            type="primary"
                            onClick={() => {
                              Modal.confirm({
                                title: "Check in",
                                content: "Are you sure you want to check in?",
                                onOk: () => handleCheckIn(),
                              })
                            }}
                          >
                            Submit Check In
                          </Button>
                        </div>
                        <div className="upload-btn">
                          <img className="ticket-img" src={uploadedImage} alt="Uploaded" />
                        </div>
                      </div>
                    )}
                  </Card>
                )
                  : (
                    <Card title="Uploaded Ticket Image" bordered>
                      <img className="ticket-img" src={booking.image} alt="Uploaded" />
                    </Card>
                  )
                }
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
