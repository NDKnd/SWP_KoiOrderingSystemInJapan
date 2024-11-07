import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import {
  Divider,
  Layout,
  Input,
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

function FarmFindPage() {
  const navigate = useNavigate();
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmList, setFarmList] = useState([]);
  const [filterFarmList, setFilterFarmList] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
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
    navigate("/TripPage", {
      state: { farmName: farm.farmName },
    });
  };

  // Fetch all farms
  useEffect(() => {
    fetchFarms();
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
                              <p><strong>Description:</strong> {farm.description}</p>
                              <p><strong>Available Koi Fishes:</strong></p>
                              <ul>
                                {farm.koiFishResponseList && farm.koiFishResponseList.length > 0 ? (
                                  farm.koiFishResponseList.map((koi) => (
                                    <li key={koi.id}>
                                      <strong>{koi.koiName}</strong> - {koi.price.toLocaleString()} VND
                                    </li>
                                  ))
                                ) : (
                                  <li>No koi fishes available</li>
                                )}
                              </ul>
                            </div>
                          }
                          title={`Farm Detail`}
                          trigger="hover"
                        >
                          <img alt={farm.farmName} src={farm.image} className="card-image" />
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
                  <p>No farms found matching your search.</p>
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
