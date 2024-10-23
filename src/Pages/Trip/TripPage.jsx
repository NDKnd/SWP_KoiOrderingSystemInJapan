import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Button, Spin, message, Pagination, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import "./TripPage.css";

const { Content } = Layout;

function TripPage() {
  const [tripList, setTripList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 12;
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const response = await api.get("/trip");
      setTripList(response.data);
    } catch (error) {
      message.error("Failed to fetch trips.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookTrip = async (trip) => {
    const token = localStorage.getItem("token");

    if (!token) {
      Modal.info({
        title: "Please log in",
        content: "You need to log in to book a trip.",
        onOk: () => navigate("/login"),
      });
      return;
    }

    try {
      const response = await api.post(
        "/booking",
        {
        image: "",
        status: "PENDING_CONFIRMATION",
        note: "",
        tripId: trip.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Trip booked successfully!");
        navigate("/book-status");
      } else {
        message.error("Failed to book the trip. Please try again.");
      }
    } catch (error) {
      console.error("Error booking trip:", error);
      message.error("Failed to book the trip. Please try again.");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTripList = tripList.slice(indexOfFirstTrip, indexOfLastTrip);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Layout>
      <Header />
      <Content className="layout">
        <h2 className="trip-list-title">Available Trips</h2>
        {loading ? (
          <Spin tip="Loading trips..." />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {currentTripList.map((trip) => (
                <Col xs={24} sm={12} md={8} lg={6} key={trip.tripId}>
                  <Card hoverable className="trip-card">
                    <div className="trip-image">
                      <img src={trip.image} alt={trip.farms.farmName} />
                    </div>
                    <Card.Meta
                      title={trip.farms.farmName}
                      description={
                        <>
                        <div>farm: {trip.id}</div>
                          <div>From: {trip.startDate}</div>
                          <div>To: {trip.endDate}</div>
                          <div>Depart location: {trip.startLocation}</div>
                          <div>Apart location: {trip.endLocation}</div>
                        </>
                      }
                    />
                    <div className="book-button">
                      <Button type="primary" onClick={() => handleBookTrip(trip)}>
                        Book Now
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={tripsPerPage}
              total={tripList.length}
              onChange={handlePageChange}
              style={{ marginTop: "20px" }}
            />
          </>
        )}
      </Content>
      <Footer />
    </Layout>
  );
}

export default TripPage;