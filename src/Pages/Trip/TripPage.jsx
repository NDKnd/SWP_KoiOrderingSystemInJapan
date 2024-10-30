import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Button, Spin, message, Pagination, Input, DatePicker, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import "./TripPage.css";

const { Content } = Layout;
const { RangePicker } = DatePicker;

function TripPage() {
  const [tripList, setTripList] = useState([]);
  const [filteredTripList, setFilteredTripList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 12;
  const navigate = useNavigate();
  const location = useLocation();

  const [farmName, setFarmName] = useState(location.state?.farmName || "");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [dateRange, setDateRange] = useState([]);

  const fetchTrips = async () => {
    try {
      const response = await api.get("/trip");
      setTripList(response.data);
      setFilteredTripList(response.data);
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

    Modal.confirm({
      title: "Confirm Booking",
      content: "Are you sure you want to book this trip?",
      onCancel: () => { },
      onOk: async () => {
        try {
          const bookingsResponse = await api.get("/booking/customer");

          const incompleteBooking = bookingsResponse.data.some(
            (booking) => booking.status !== "COMPLETED" && booking.status !== "CANCEL"
          );

          if (incompleteBooking) {
            message.error("You already have an active trip is in booking. Complete it before booking another trip.");
            return;
          }

          const response = await api.post(
            "/booking",
            {
              image: "",
              status: "PENDING_CONFIRMATION",
              note: "",
              tripId: trip.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            message.success("Trip booked successfully!");
            localStorage.setItem("bookingId", response.data.id)
            console.log(response.data.id);
            navigate("/book-status");
          } else {
            message.error("Failed to book the trip. Please try again.");
          }
        } catch (error) {
          console.error("Error booking trip:", error);
          message.error("Failed to book the trip. Please try again.");
        }
      }
    })
  };

  const handleSearch = () => {
    const filtered = tripList.filter((trip) => {
      const matchesFarmName = farmName ? trip.farms.some((farm) => farm.farmName.toLowerCase().includes(farmName.toLowerCase())) : true;
      const matchesStartLocation = startLocation ? trip.startLocation.toLowerCase().includes(startLocation.toLowerCase()) : true;
      const matchesEndLocation = endLocation ? trip.endLocation.toLowerCase().includes(endLocation.toLowerCase()) : true;
      const matchesDateRange =
        dateRange.length === 2
          ? new Date(trip.startDate) >= dateRange[0]._d && new Date(trip.endDate) <= dateRange[1]._d
          : true;

      return matchesFarmName && matchesStartLocation && matchesEndLocation && matchesDateRange;
    });
    setFilteredTripList(filtered);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (farmName) {
      handleSearch();
    }
  }, [farmName, tripList]);

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTripList = filteredTripList.slice(indexOfFirstTrip, indexOfLastTrip);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Layout>
      <Header />
      <Content className="layout">
        <h2 className="trip-list-title">Available Trips</h2>

        <div className="search-bar">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <label>Farm Name</label>
              <Input
                placeholder="Enter Farm Name"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <label>Start Location</label>
              <Input
                placeholder="Enter Start Location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <label>End Location</label>
              <Input
                placeholder="Enter End Location"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <label>Date Range</label>
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </Col>

            <Col xs={24} className="search-button">
              <Button type="primary" onClick={handleSearch}>Search</Button>
            </Col>
          </Row>
        </div>

        {loading ? (
          <Spin tip="Loading trips..." />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {currentTripList.map((trip) =>
                trip.farms.map((farm) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={`${trip.tripId}-${farm.id}`}>
                    <Card hoverable className="trip-card">
                      <div className="trip-image">
                        <img src={farm.image} alt={farm.farmName} />
                      </div>
                      <Card.Meta
                        title={`Trip to: ${farm.farmName}`}
                        description={
                          <>
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
                ))
              )}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={tripsPerPage}
              total={filteredTripList.length}
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
