import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import { Divider, Layout, Input, Select, Slider, Button, Row, Col, message, Card, Spin, Pagination, Popover } from "antd";
import "./KoiPageFind.css";
import api from "../../services/axios";

const { Content } = Layout;
const { Option } = Select;

function KoiPageFind() {
  const [koiName, setKoiName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [koiList, setKoiList] = useState([]);
  const [filteredKoiList, setFilteredKoiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [koiTypes, setKoiTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const koiPerPage = 12;

  const fetchAllKoiAndTypes = async () => {
    try {
      const response = await api.get("/koi");
      const koiData = response.data;
      setKoiList(koiData);
      setFilteredKoiList(koiData);

      // Extract types from API
      const types = [...new Set(koiData.map((koi) => koi.type))];
      setKoiTypes(types);
    } catch (error) {
      console.error("Error fetching Koi fish:", error);
      message.error("Failed to fetch Koi fish data.");
    } finally {
      setLoading(false);
    }
  };

  // Function to search
  const handleSearch = () => {
    const filtered = koiList.filter((koi) => {
      const matchesKoiName = koi.koiName.toLowerCase().includes(koiName.toLowerCase());
      const matchesFarmName = koi.farm.farmName.toLowerCase().includes(farmName.toLowerCase());
      const matchesType = type ? koi.type === type : true;
      const matchesPrice = koi.price >= priceRange[0] && koi.price <= priceRange[1];
      return matchesKoiName && matchesFarmName && matchesType && matchesPrice;
    });
    setFilteredKoiList(filtered);
    message.success("Search completed successfully!");
  };

  // Pagination
  const indexOfLastKoi = currentPage * koiPerPage;
  const indexOfFirstKoi = indexOfLastKoi - koiPerPage;
  const currentKoiList = filteredKoiList.slice(indexOfFirstKoi, indexOfLastKoi);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOrderClick = async () => {
    try {
      message.success("Order Koi fish completed successfully!");
    } catch (error) {
      console.error("Error order Koi fish:", error);
      message.error("Failed to fetch Koi fish data.");
    }
  };

  // Fetch all Koi fishes and types
  useEffect(() => {
    fetchAllKoiAndTypes();
  }, []);


  return (
    <Layout>
      <Header />
      <Content className="layout">
        <div className="card">
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
                  <Option key={type} value={type}>{type}</Option>
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
              <Button type="primary" onClick={handleSearch}>Search</Button>
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: "20px 0" }} />
        <h2 className="koi-list-title">Koi Fish</h2>

        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {currentKoiList.length > 0 ? (
                currentKoiList.map((koi) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={koi.id}>
                    <Card
                      hoverable
                      cover={
                        <Popover
                          content={
                            <div className="popover-content">
                              Description: {koi.description}
                            </div>
                          }
                          title={koi.koiName}
                          trigger="hover"
                        >
                          <img alt={koi.koiName} src={koi.image} />
                        </Popover>
                      }
                    >
                      <Card.Meta
                        title={koi.koiName}
                        description={
                          <>
                            <div>Farm: {koi.farm.farmName}</div>
                            <div>Type: {koi.type}</div>
                            <div>Price: ${koi.price}</div>
                          </>
                        }
                      />
                      <div className="order-button">
                        <Button type="primary"
                          onClick={() => handleOrderClick(koi)}>Order</Button>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p>No Koi fishes found matching your findings.</p>
                </Col>
              )}
            </Row>

            <Pagination
              current={currentPage}
              pageSize={koiPerPage}
              total={filteredKoiList.length}
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

export default KoiPageFind;