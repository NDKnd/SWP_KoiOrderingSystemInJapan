import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Button, Spin, message, Pagination, Input, DatePicker, Modal, List } from "antd";
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [quantity, setQuantity] = useState();
  const [note, setNote] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const fetchTrips = async () => {
    try {
      const response = await api.get("/trip");

      const checkForAvailableTrips = new Date();
      checkForAvailableTrips.setDate(checkForAvailableTrips.getDate() + 2);

      const futureTrips = response.data.filter(trip => new Date(trip.startDate) > checkForAvailableTrips);
      setTripList(futureTrips);
      setFilteredTripList(futureTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
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
      content: (
        <div>
          <h3>Are you sure you want to book this trip?</h3>
          If yes, please choose a number of tickets that you need for this trip:
          <Input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: "100px", marginLeft: "10px" }}
          />
          <p>Note: </p>
          <Input
            type="TextArea"
            placeholder="Enter your note for this trip."
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      ),
      onOk: async () => {
        try {
          const bookingsResponse = await api.get("/booking/customer");

          const incompleteBooking = bookingsResponse.data.some(
            (booking) => booking.status !== "COMPLETED" && booking.status !== "CANCEL"
          );

          if (incompleteBooking) {
            message.error("You already have an active trip in booking. Complete it before booking another trip.");
            return;
          }
          console.log("trip book", trip);
          const response = await api.post(
            "/booking",
            {
              status: "PENDING_CONFIRMATION",
              quantity: parseInt(quantity),
              note: note,
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
            localStorage.setItem("bookingId", response.data.id);
            navigate("/book-status");
          } else {
            message.error("Failed to book the trip. Please try again.");
          }
        } catch (error) {
          console.error("Error booking trip:", error);
          message.error("Failed to book the trip. Please try again.");
        }
      },
    });
  };

  const handleSearch = () => {
    const filtered = tripList.filter((trip) => {
      const matchesFarmName = farmName ? trip.farms.some((farm) => farm.farmName.toLowerCase().includes(farmName.toLowerCase())) : true;
      const matchesStartLocation = startLocation ? trip.startLocation.toLowerCase().includes(startLocation.toLowerCase()) : true;
      const matchesEndLocation = endLocation ? trip.endLocation.toLowerCase().includes(endLocation.toLowerCase()) : true;

      const tripStartDate = new Date(trip.startDate).setHours(0, 0, 0, 0);
      const tripEndDate = new Date(trip.endDate).setHours(0, 0, 0, 0);
      const searchStartDate = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const searchEndDate = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

      const matchesStartDate = searchStartDate ? tripStartDate >= searchStartDate : true;
      const matchesEndDate = searchEndDate ? tripEndDate <= searchEndDate : true;

      return matchesFarmName && matchesStartLocation && matchesEndLocation && matchesStartDate && matchesEndDate;
    });
    setFilteredTripList(filtered);
    setCurrentPage(1);
  };

  const showFarmDetails = (trip) => {
    setSelectedTrip(trip);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTrip(null);
  };

  const handlePreview = (record) => {
    Modal.info({
      width: 400,
      title: <img src={record.image} className="img_preview" style={{ width: "100%", padding: "15px" }} alt="koi" />,
      maskClosable: true,
      closable: true,
      footer: null,
      icon: null,
    });
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
              <label>Depart Location</label>
              <Input
                placeholder="Enter Depart Location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <label>Arrive Location</label>
              <Input
                placeholder="Enter Arrive Location"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} md={3}>
              <label>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={(date) => setStartDate(date ? date : null)}
              />
            </Col>

            <Col xs={24} sm={12} md={3}>
              <label>End Date</label>
              <DatePicker
                value={endDate}
                onChange={(date) => setEndDate(date ? date : null)}
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
              {currentTripList.map((trip) => (
                <Col xs={24} sm={12} md={8} lg={6} key={trip.id}>
                  <Card hoverable className="trip-card">
                    <Card.Meta
                      title={
                        <>
                          Depart location: {trip.startLocation} <br />
                          Arrive location: {trip.endLocation}
                        </>}
                      description={
                        <>
                          <div>From: {trip.startDate}</div>
                          <div>To: {trip.endDate}</div>
                        </>
                      }
                    />
                    <div className="book-button">
                      <Button type="primary" onClick={() => handleBookTrip(trip)}>
                        Book Now
                      </Button>
                      <Button onClick={() => showFarmDetails(trip)} style={{ marginLeft: "10px" }}>
                        Details
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
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

        <Modal
          title="Trip Itinerary"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
        >
          {selectedTrip && (
            <List
              itemLayout="vertical"
              dataSource={selectedTrip.tripDetails}
              renderItem={(tripDetail, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <a onClick={() => handlePreview({ image: tripDetail.farm.image })}>
                        <img src={tripDetail.farm.image} alt={tripDetail.farm.farmName} style={{ width: 50, height: 50 }} />
                      </a>
                    }
                    title={<strong>Destination Order {index + 1}</strong>}
                    description={
                      <>
                        <p><strong>Farm Name:</strong> {tripDetail.farm.farmName}</p>
                        <p><strong>Location:</strong> {tripDetail.farm.location}</p>
                        <p><strong>Description:</strong> {tripDetail.farm.description}</p>
                        <p><strong>Phone:</strong> {tripDetail.farm.phone}</p>
                        <p><strong>Email:</strong> {tripDetail.farm.email}</p>
                        <p><strong>Travel Date:</strong> {tripDetail.travelDate}</p>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Modal>
      </Content>
      <Footer />
    </Layout>
  );
}

export default TripPage;  
