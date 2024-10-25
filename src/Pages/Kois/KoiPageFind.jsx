import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import { Divider, Layout, Input, Select, Slider, Button, Row, Col, message, Card, Spin, Pagination, Popover, Modal } from "antd";
import "./KoiPageFind.css";
import api from "../../services/axios";
import dayjs from "dayjs";
import { FaCogs } from "react-icons/fa";

const { Content } = Layout;
const { Option } = Select;

const dateFormat = "YYYY-MM-DD";

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

  // Function to fetch all Koi fishes and types
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
      const matchesFarmName = koi.farmName.toLowerCase().includes(farmName.toLowerCase());
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

  // Fetch all Koi fishes and types
  useEffect(() => {
    fetchAllKoiAndTypes();
    fetchBookingCustomer();
  }, []);

  const [bookingList, setBookingList] = useState([]);

  const fetchBookingCustomer = async () => {
    const res = await api.get("booking/customer");
    console.log(res.data);
    setLoading(false);
    var list = res.data;

    setBookingList(
      list
        .filter((item) => item.status == "CHECK_IN")
        .map((item) => ({
          ...item,
          key: item.id,
        }))
    );
  };


  const recommendFarmForKoi = (values) => { //gợi ý booking theo farm của Koi mún đặt 
    if (!values.farm || !values.farm.farmName) {
      message.info("No farm information available for this Koi.");
      return;
    }
    message.info(`This Koi fish is located at ${values.farm.farmName}, which is in ${values.farm.location}. Please ensure to book a trip that includes this farm.`);
  };

  const handleOpenOrderForm = async (values) => {
    console.log("booking list: ", bookingList);
    console.log("values is koi: ", values);
    // check if booking list is empty
    // check xem đã có danh sách Booking hay ch?!
    if (bookingList.length == 0) {
      message.info("Please booking a trip first.");
      recommendFarmForKoi(values);
      return;
    }

    // gợi ý chọn booking trip nào có farm của Koi mún đặt
    recommendFarmForKoi(values);

    Modal.confirm({
      title: "Order Koi",
      content: (
        <div>
          <p>Koi type: {values.type}</p>
          <p>Koi Name: {values.koiName}</p>
          <p>Farm Name: {values.farm.farmName}</p>
          <p>Booking Trip:</p>
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="Select a trip"
            optionFilterProp="children"
            onChange={(value) => {
              console.log("value: ", value); // for view
              values.bookingId = value;
              console.log("bookingId: ", values.bookingId); // for view
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {bookingList.length > 0 && bookingList.map((booking) => (
              <Select.Option key={booking.id} value={booking.id}>
                {booking.id + " - " + booking.trip.startDate + " - " + booking.trip.endDate}
              </Select.Option>
            ))
            }
          </Select>
          <p>Quantity:</p>
          <Input
            type="number"
            id="quantity"
            defaultValue={1}
            min={1}
            max={values.quantity}
            style={{ width: 150 }}
            onChange={(e) => values.quantity = e.target.value}
          />
        </div>
      ),
      onOk: async () => {
        const quantity = document.getElementById("quantity").value;
        console.log("booking choose: ", values.bookingId); // for view
        console.log("quantity: ", quantity); // for view
        // check xem người dùng chọn đúng booking trip
        // mà có farm của Koi này hay ko???
        bookingList.forEach((booking) => {
          if (booking.id == values.bookingId) {
            console.log("booking: ", booking);
            booking.trip.farms.forEach((farm) => {
              console.log(farm.farmName + " - " + values.farm.farmName);
              if (farm.farmName != values.farm.farmName) {
                recommendFarmForKoi(values);
                throw new Error("Koi is not located at this farm");
              }
            })
          }
        })

        try {
          const res = await api.post("/order", {
            expectedDate: new Date().toISOString(),
            status: "PENDING",
            bookingId: values.bookingId,
            orderDetails: [
              {
                koiId: values.id,
                quantity: quantity,
              },
            ],
          });
          console.log("res data: ", res.data);
          message.success("Order successful!");
        } catch (error) {
          console.error("Error placing order:", error);
          message.error("Failed to place order.");
        }
      }
    });
  };


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
                            <div>Farm: {koi.farmName}</div>
                            <div>Type: {koi.type}</div>
                            <div>Price: ${koi.price}</div>
                          </>
                        }
                      />
                      <div className="order-button">
                        <Button type="primary"
                          onClick={() => handleOpenOrderForm(koi)}>Order</Button>
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