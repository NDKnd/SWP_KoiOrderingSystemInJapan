import { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import { Divider, Layout, Input, Select, Button, Row, Col, message, Card, Spin, Pagination, Popover, Modal, InputNumber } from "antd";
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

  // Fetch all Koi fishes and types
  useEffect(() => {
    fetchAllKoiAndTypes();
    fetchBookingManager();
  }, []);

  const [bookingList, setBookingList] = useState([]);
  const [notInOrderBooking, setNotInOrderBooking] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchBookingManager = async () => {
    const res = await api.get("booking/manager");
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
    await fetchOrders();
    console.log("list: ", list);
    setNotInOrderBooking(
      list
        .filter((item) => item.status === "CHECK_IN" &&
          !orders.some((order) => order.booking.id === item.id))
        .map((item) => ({
          ...item,
          key: item.id,
        }))
    );
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/order/manager");
      setOrders(response.data);
      console.log("orders: ", response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // const recommendFarmForKoi = (values) => { //gợi ý booking theo farm của Koi mún đặt 
  //   if (!values.farm || !values.farm.farmName) {
  //     message.info("No farm information available for this Koi.");
  //     return;
  //   }
  //   message.info(`This Koi fish is located at ${values.farm.farmName}, which is in ${values.farm.location}. Please ensure to book a trip that includes this farm.`);
  // };

  // const handleOpenOrderForm = async (values) => {
  //   console.log("booking list: ", bookingList);
  //   console.log("values is koi: ", values);
  //   // check if booking list is empty
  //   // check xem đã có danh sách Booking hay ch?!
  //   if (bookingList.length == 0) {
  //     message.info("Please booking a trip first.");
  //     recommendFarmForKoi(values);
  //     return;
  //   }

  //   // gợi ý chọn booking trip nào có farm của Koi mún đặt
  //   recommendFarmForKoi(values);

  //   Modal.confirm({
  //     title: "Order Koi",
  //     content: (
  //       <div>
  //         <p>Koi type: {values.type}</p>
  //         <p>Koi Name: {values.koiName}</p>
  //         <p>Farm Name: {values.farm.farmName}</p>
  //         <p>Booking Trip:</p>
  //         <Select
  //           showSearch
  //           style={{ width: 150 }}
  //           placeholder="Select a trip"
  //           optionFilterProp="children"
  //           onChange={(value) => {
  //             console.log("value: ", value); // for view
  //             values.bookingId = value;
  //             console.log("bookingId: ", values.bookingId); // for view
  //           }}
  //           filterOption={(input, option) =>
  //             option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  //           }
  //         >
  //           {notInOrderBooking.length > 0 && notInOrderBooking.map((booking) => (
  //             <Select.Option key={booking.id} value={booking.id}>
  //               {booking.id + " - " + booking.trip.startDate + " - " + booking.trip.endDate}
  //             </Select.Option>
  //           ))
  //           }
  //         </Select>
  //         <p>Quantity:</p>
  //         <Input
  //           type="number"
  //           id="quantity"
  //           defaultValue={1}
  //           min={1}
  //           max={values.quantity}
  //           style={{ width: 150 }}
  //           onChange={(e) => values.quantity = e.target.value}
  //         />
  //       </div>
  //     ),
  //     onOk: async () => {
  //       const quantity = window.document.getElementById("quantity").value;
  //       // check xem người dùng chọn đúng booking trip
  //       // mà có farm của Koi này hay ko???
  //       bookingList.forEach((booking) => {
  //         if (booking.id == values.bookingId) {
  //           console.log("booking: ", booking);
  //           let isFound = false;
  //           booking.trip.farms.forEach((farm) => {
  //             console.log(farm.farmName + " == " + values.farm.farmName);
  //             if (farm.farmName === values.farm.farmName) {
  //               isFound = true;
  //               return;
  //             }
  //           });
  //           if (!isFound) {
  //             recommendFarmForKoi(values);
  //             throw new Error("Koi is not located at this farm");
  //           }
  //         }
  //       })

  //       console.log("booking id choose: ", values.bookingId); // for view
  //       console.log("quantity: ", quantity); // for view

  //       console.log("current order: ",
  //         {
  //           "expectedDate": dayjs().add(10, 'day').format('YYYY-MM-DD'),
  //           "status": "PENDING",
  //           "address": "",
  //           "bookingId": values.bookingId,
  //           "price": "",
  //           "orderDetails": [
  //             {
  //               "koiId": values.id,
  //               "quantity": parseInt(quantity)
  //             }
  //           ]
  //         }
  //       );

  //       // Xóa dữ liệu hiện tại của localStorage
  //       // localStorage.removeItem("AwaitingSubmitOrder");

  //       // Lấy dữ liệu hiện tại từ localStorage
  //       const existingOrders = localStorage.getItem("AwaitingSubmitOrder");
  //       let orders;

  //       // Kiểm tra xem existingOrders có hợp lệ và là mảng hay không
  //       try {
  //         orders = existingOrders ? JSON.parse(existingOrders) : [];
  //         if (!Array.isArray(orders)) {
  //           // Nếu không phải là mảng, khởi tạo lại thành mảng rỗng
  //           orders = [];
  //         }
  //       } catch (error) {
  //         console.error("Lỗi khi parse JSON từ localStorage:", error);
  //         // Nếu xảy ra lỗi khi parse, khởi tạo mảng rỗng
  //         orders = [];
  //       }

  //       // Tạo object order mới
  //       let newOrderDetail = {
  //         "koiId": values.id,
  //         "quantity": parseInt(quantity)
  //       };

  //       // Kiểm tra xem đã có order nào với bookingId đã chọn hay chưa
  //       let existingOrder = orders.find(order => order.bookingId === values.bookingId);

  //       if (existingOrder) {
  //         // Nếu đã có order với bookingId này, thêm orderDetails mới vào
  //         if (!Array.isArray(existingOrder.orderDetails)) {
  //           existingOrder.orderDetails = [];
  //         }

  //         let existingOrderDetail = existingOrder.orderDetails
  //           .find(orderDetail => orderDetail.koiId === newOrderDetail.koiId);
  //         if (existingOrderDetail) {
  //           existingOrderDetail.quantity += newOrderDetail.quantity;
  //         } else {
  //           existingOrder.orderDetails.push(newOrderDetail);
  //         }
  //       } else {
  //         // Nếu chưa có, tạo mới một order và thêm vào mảng orders
  //         let newOrder = {
  //           "expectedDate": dayjs().add(10, 'day').format('YYYY-MM-DD'),
  //           "status": "PENDING",
  //           "address": "",
  //           "bookingId": values.bookingId,
  //           "price": "",
  //           "orderDetails": [newOrderDetail]
  //         };
  //         orders.push(newOrder);
  //       }

  //       // Lưu lại mảng orders đã cập nhật vào localStorage
  //       localStorage.setItem('AwaitingSubmitOrder', JSON.stringify(orders));

  //       // Log ra mảng orders để kiểm tra
  //       console.log("orders: ", orders);

  //       message.success("Add to cart successfully!");

  //     },
  //   });
  // };

  const handleMinPriceChange = (value) => {
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (value) => {
    setPriceRange([priceRange[0], value]);
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
              <div style={{ display: "flex", gap: "8px" }}>
                <InputNumber
                  min={0}
                  max={100000000}
                  value={
                    new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0 })
                      .format(priceRange[0])
                  } đ
                  onChange={handleMinPriceChange}
                  placeholder="Min Price"
                  style={{ width: "100%" }}
                />
                <InputNumber
                  min={0}
                  max={100000000}
                  value={
                    new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0 })
                      .format(priceRange[1])
                  } đ
                  onChange={handleMaxPriceChange}
                  placeholder="Max Price"
                  style={{ width: "100%" }}
                />
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
                          <img alt={koi.koiName} src={koi.image} className="card-image" />
                        </Popover>
                      }
                    >
                      <Card.Meta
                        title={`${koi.koiName} - ${new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0 })
                          .format(koi.price)
                          }đ`}
                        description={
                          <>
                            <div>Farm: {koi.farm.farmName}</div>
                            <div>Type: {koi.type}</div>
                          </>
                        }
                      />
                      {/* <div className="order-button">
                        <Button type="primary"
                          onClick={() => handleOpenOrderForm(koi)}>Order</Button>
                      </div> */}
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