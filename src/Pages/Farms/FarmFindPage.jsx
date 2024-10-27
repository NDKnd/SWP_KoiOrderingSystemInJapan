import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import {
  Divider,
  Layout,
  Input,
  Select,
  Slider,
  Button,
  Row,
  Col,
  message,
  Card,
  Spin,
  Pagination,
  Popover,
} from "antd";
import styles from "./FarmFindPage.module.css";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;

function FarmFindPage() {
  const navigate = useNavigate();
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmList, setFarmList] = useState([]);
  const [filterFarmList, setFilterFarmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmRatings, setFarmRatings] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const farmPerPage = 12;

  // Function to fetch all farms
  const fetchFarms = async () => {
    try {
      const response = await api.get("/farm");
      const farmData = response.data;
      setFarmList(farmData);
      setFilterFarmList(farmData);
    } catch (error) {
      console.error("Error fetching farms:", error);
      message.error("Failed to fetch farm data.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch feedback and calculate average ratings for each farm
  const fetchFeedbackRatings = async () => {
    try {
      const response = await api.get("/feedback");
      const feedbackData = response.data;

      const ratings = feedbackData.reduce((acc, feedback) => {
        const farms = feedback.booking.trip.farms;

        farms.forEach((farm) => {
          if (!acc[farm.id]) {
            acc[farm.id] = { total: 0, count: 0 };
          }
          acc[farm.id].total += feedback.rating;
          acc[farm.id].count += 1;
        });

        return acc;
      }, {});

      const avgRatings = Object.keys(ratings).reduce((acc, farmId) => {
        acc[farmId] = (ratings[farmId].total / ratings[farmId].count).toFixed(1);
        return acc;
      }, {});

      setFarmRatings(avgRatings);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      message.error("Failed to fetch feedback data.");
    }
  };


  // Function to search farms
  const handleSearch = () => {
    const filtered = farmList.filter((farm) => {
      const matchesFarmName = farm.farmName
        .toLowerCase()
        .includes(farmName.toLowerCase());
      const matchesLocation = farm.location
        .toLowerCase()
        .includes(farmLocation.toLowerCase());
      return matchesFarmName && matchesLocation;
    });
    setFilterFarmList(filtered);
    message.success("Search completed successfully!");
  };

  // Pagination
  const indexOfLastFarm = currentPage * farmPerPage;
  const indexOfFirstFarm = indexOfLastFarm - farmPerPage;
  const currentFarmList = filterFarmList.slice(
    indexOfFirstFarm,
    indexOfLastFarm
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBooking = (farm) => {
    message.success("Trips to that farm are shown!");
    navigate("/TripPage", {
      state: { farmName: farm.farmName },
    });
  };

  // Fetch all farms and feedbacks
  useEffect(() => {
    fetchFarms();
    fetchFeedbackRatings();
  }, []);

  return (
    <Layout>
      <Header />
      <Content className={styles.layout}>
        <div className={styles.card}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12}>
              <label>Farm Name</label>
              <Input
                placeholder="Enter Farm Name"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} md={12}>
              <label>Farm Location</label>
              <Input
                placeholder="Enter Farm Location"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
              />
            </Col>

            <Col xs={24} className="search-button">
              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: "20px 0" }} />
        <h2 className="koi-list-title">Koi Farms</h2>

        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {currentFarmList.length > 0 ? (
                currentFarmList.map((farm) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={farm.id}>
                    <Card
                      hoverable
                      cover={
                        <Popover
                          content={
                            <div className={styles.popover_content}>
                              Description: {farm.description}
                            </div>
                          }
                          title={farm.farmName}
                          trigger="hover"
                        >
                          <img alt={farm.farmName} src={farm.image} />
                        </Popover>
                      }
                    >
                      <Card.Meta
                        title={farm.farmName}
                        description={
                          <>
                            <div>Farm: {farm.farmName}</div>
                            <div>Location: {farm.location}</div>
                            <div>Phone: {farm.phone}</div>
                            <div>Email: {farm.email}</div>
                            <div>
                              Rating:{" "}
                              {farmRatings[farm.id] ? `${farmRatings[farm.id]} / 5` : "No ratings"}
                            </div>
                          </>
                        }
                      />
                      <div className={styles.search_button}>
                        <Button
                          type="primary"
                          onClick={() => handleBooking(farm)}
                        >
                          Book a trip
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p>No farm fishes found matching your findings.</p>
                </Col>
              )}
            </Row>

            <Pagination
              current={currentPage}
              pageSize={farmPerPage}
              total={filterFarmList.length}
              onChange={handlePageChange}
              className="pagination"
              style={{ marginTop: "20px" }}
            />
          </>
        )}
      </Content>
      <Footer style={{ marginTop: "20px" }} />
    </Layout>
  );
}

export default FarmFindPage;
