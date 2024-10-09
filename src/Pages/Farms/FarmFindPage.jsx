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

const { Content } = Layout;
const { Option } = Select;

function FarmFindPage() {
  const [koiName, setKoiName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);

  const [farmList, setFarmList] = useState([]);
  const [filterFarmList, setFilterFarmList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [listBookFarm, setListBookFarm] = useState([{}]);

  const [koiTypes, setKoiTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const farmPerPage = 12;

  // Function to fetch all farm
  const fetchFarms = async () => {
    try {
      const response = await api.get("/farm");
      const farmData = response.data;
      setFarmList(farmData);
      setFilterFarmList(farmData);
    } catch (error) {
      console.error("Error fetching farm:", error);
      message.error("Failed to fetch farm data.");
    } finally {
      setLoading(false);
    }
  };

  // Function to search
  const handleSearch = () => {
    // const filtered = farmList.filter((farm) => {
    //   const matchesKoiName = farm.farmName
    //     .toLowerCase()
    //     .includes(koiName.toLowerCase());
    //   const matchesFarmName = farm.farmName
    //     .toLowerCase()
    //     .includes(farmName.toLowerCase());
    //   const matchesType = type ? farm.type === type : true;
    //   const matchesPrice =
    //     farm.price >= priceRange[0] && farm.price <= priceRange[1];
    //   return matchesKoiName && matchesFarmName && matchesType && matchesPrice;
    // });
    // setFilterFarmList(filtered);
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
    console.log("Booking clicked farm name: ", farm);
    setListBookFarm([...listBookFarm, farm]);
    console.log("listBookFarm: ", listBookFarm);
    message.success("Booking completed successfully!");
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
            <Col xs={24} sm={12} md={6}>
              <label>Koi Name</label>
              <Input
                placeholder="Enter Koi Name"
                value={koiName}
                onChange={(e) => setKoiName(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <label>Farm Name</label>
              <Input
                placeholder="Enter Farm Name"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <label>Type</label>
              <Select
                placeholder="Select Type"
                value={type}
                onChange={(value) => setType(value)}
                style={{ width: "100%" }}
              >
                <Option value="">All</Option>
                {koiTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <label>Price Range</label>
              <Slider
                range
                min={0}
                max={500}
                step={10}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
              />
              <div className="price-range">
                <span>{`$${priceRange[0]}`}</span>
                <span>{`$${priceRange[1]}`}</span>
              </div>
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
                            <div>Phone: {farm.phone}</div>
                            <div>Email: ${farm.email}</div>
                          </>
                        }
                      />
                      <div className={styles.search_button}>
                        <Button
                          type="primary"
                          onClick={() => handleBooking(farm)}
                        >
                          Booking
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
