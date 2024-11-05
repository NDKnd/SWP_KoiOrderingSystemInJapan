import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  List,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import styles from "./ManagerTrip.module.css";
import { useEffect, useState } from "react";
import api from "../../services/axios";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Kích hoạt plugin
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function ManagerTrip() {
  const [tripList, setTripList] = useState([]);
  const [infoTripDefault, setInfoTripDefault] = useState({});

  const [farmsOpts, setFarmsOpts] = useState([]);
  const [isCreateModalOpen, setisCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [searchTrips, setSearchTrips] = useState([]);
  const [searchStartLocation, setSearchStartLocation] = useState("");
  const [searchEndLocation, setSearchEndLocation] = useState("");
  const [searchDateRange, setSearchDateRange] = useState([]);
  const [searchFarms, setSearchFarms] = useState([]);

  const fetchFarms = async () => {
    try {
      const res = await api.get("farm");
      const farmsSelect = res.data;
      setFarmsOpts(farmsSelect);
      console.log("farmsSelect: ", res.data);
    } catch (error) {
      message.error("Error fetching farms");
      console.log(error.message.toString());
    }
  };
  const fetchTrips = async () => {
    try {
      const res = await api.get("trip");
      const data = await res.data;
      console.log("list of trips:", res.data);
      setTripList(data); // Cập nhật trạng thái trips với dữ liệu từ API
    } catch (error) {
      message.error("Error fetching trips");
      console.log(error.message.toString());
    }
  };

  const handleOpenModal = () => {
    setisCreateModalOpen((prevState) => !prevState);
  };
  const handleCreateTrip = async (values) => {
    try {
      // Lấy dữ liệu từ RangePicker
      const formValues = values;
      console.log("formValues: ", formValues);
      // console.log("Date: ", formValues.date);
      const startDate = formValues.date[0].format(dateFormat);
      console.log("startDate: ", startDate);
      const endDate = formValues.date[1].format(dateFormat);
      console.log("endDate: ", endDate);
      const farmIds = formValues.farms;
      console.log("farmIds: ", farmIds);

      const newTrip = {
        startDate: startDate,
        endDate: endDate,
        startLocation: formValues.startLocation,
        endLocation: formValues.endLocation,
        farmIds: farmIds,
      };
      console.log("data for create trip: ", newTrip);

      const res = await api.post("trip", newTrip);
      console.log("res data:", res);
      fetchTrips();
      message.success("Create trip successfully");
    } catch (error) {
      message.error("Error create trips");
      console.log(error.message.toString());
    } finally {
      handleOpenModal();
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      console.log("Delete this trip id: ", tripId);
      const changetoInteger = parseInt(tripId);
      console.log("changetoInteger: ", changetoInteger);
      const res = await api.delete(`trip/${changetoInteger}`);
      console.log("res data:", res);
      message.success("Delete trip successfully");
      fetchTrips();
    } catch (error) {
      message.error("Error delete trips");
      console.log(error.message.data);
    }
  };

  const handleOpenEditModal = (tripId) => {
    console.log("tripIdEdit: ", tripId);
    const tripBef = tripList.find((trip) => trip.id === tripId);
    setInfoTripDefault(tripBef);
    console.log("infoTripDefault: ", infoTripDefault);
    setIsEditModalOpen((prevState) => !prevState);
  };
  const handleEditTrip = async (values) => {
    try {
      console.log("tripBef: ", infoTripDefault);
      const formValues = values;
      console.log("trip after : ", formValues);
      const infoTripForEdit = {
        startDate: formValues.date[0].format(dateFormat),
        endDate: formValues.date[1].format(dateFormat),
        startLocation: formValues.startLocation,
        endLocation: formValues.endLocation,
        farmIds: formValues.farms,
      };
      console.log("Change for edit: ", infoTripForEdit);
      const res = await api.put(`trip/${infoTripDefault.id}`, infoTripForEdit);
      console.log("res data:", res);
      fetchTrips();
      message.success("Edit trip successfully");
    } catch (error) {
      message.error("Error edit trips");
      console.log(error.message.data);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const dispalyListTrips = (trip) => {
    const Eachtrip = {
      id: trip.id,
      startDate: trip.startDate,
      endDate: trip.endDate,
      startLocation: trip.startLocation,
      endLocation: trip.endLocation,
    };
    const EachFarm = trip.farms;
    // console.log("eachTrip: ", Eachtrip);
    // console.log("list farms of the above trip: ", EachFarm);
    return (
      <Card
        className={styles.manager_trip_card}
        title={
          <Row>
            <Col span={12}>
              <p className={styles.manager_trip_title}>
                <b>From: </b>
                <span>{Eachtrip.startLocation}</span>
              </p>
              <p className={styles.manager_trip_title}>
                <b>To: </b>
                <span>{Eachtrip.endLocation}</span>
              </p>
            </Col>
            <Col span={12}>
              <p className={styles.manager_trip_title}>
                <b>Start Date: </b>
                <span>{Eachtrip.startDate}</span>
              </p>
              <p className={styles.manager_trip_title}>
                <b>End Date: </b>
                <span>{Eachtrip.endDate}</span>
              </p>
            </Col>
          </Row>
        }
        bordered={false}
        style={{ width: "100%", marginTop: 16, fontSize: "1.2rem" }}
      >
        <Row>
          <Col span={24}>
            <h2>List of farm</h2>
            <List
              className={styles.manager_trip_list} // Thêm class CSS vào danh sách
              bordered
              dataSource={EachFarm}
              renderItem={(item) => (
                <List.Item className={styles.manager_trip_item}>
                  {/* Hình ảnh của farm */}
                  <img
                    src={item.image || "https://via.placeholder.com/60"} // Hiển thị hình ảnh hoặc placeholder
                    alt={item.farmName}
                    className={styles.manager_trip_image}
                  />
                  {/* Nội dung farm */}
                  <div className={styles.manager_trip_content}>
                    <h3>{item.farmName || "No farm name available"}</h3>
                    {item.location || "No farm location available"}
                    <br />
                    {item.phone || "No farm phone available"}
                    <br />
                    {item.email || "No farm email available"}
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <Row
          justify="center"
          align="middle"
          style={{ marginTop: 16 }}
          className={styles.manager_trip_action}
        >
          <Col span={12} style={{ textAlign: "center" }}>
            <Button
              className={styles.manager_trip_button}
              type="primary"
              onClick={() => handleOpenEditModal(trip.id)}
            >
              Edit
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            <Button
              className={styles.manager_trip_button}
              danger
              onClick={() => handleDeleteTrip(trip.id)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Card>
    );
  };

  const handleSearch = () => {

    const filteredTrips = tripList.filter((trip) => {
      // Check for start location match
      const matchesStartLocation = trip.startLocation
        .toLowerCase()
        .includes(searchStartLocation.toLowerCase());
      console.log(searchStartLocation);
      console.log("matches StartLocation: ", matchesStartLocation);

      // Check for end location match
      const matchesEndLocation = trip.endLocation
        .toLowerCase()
        .includes(searchEndLocation.toLowerCase());
      console.log(searchEndLocation);
      console.log("matches EndLocation: ", matchesEndLocation);

      // Check for date range match
      const matchesDateRange =
        searchDateRange === null ||
          searchDateRange.length === 0
          ? true
          : dayjs(trip.startDate).isSameOrAfter(searchDateRange[0], "day") &&
          dayjs(trip.endDate).isSameOrBefore(searchDateRange[1], "day");
      console.log(searchDateRange);
      console.log("matches DateRange: ", matchesDateRange);

      // Check for farms match
      const matchesFarms =
        searchFarms.length === 0 ||
        searchFarms.every((farmId) =>
          trip.farms.map((farm) => farm.id).includes(farmId)
        );
      console.log(searchFarms);
      console.log("matches Farms: ", matchesFarms);

      return (
        matchesStartLocation &&
        matchesEndLocation &&
        matchesDateRange &&
        matchesFarms
      );
    });

    console.log("filteredTrips: ", filteredTrips);
    filteredTrips.length > 0
      ? setSearchTrips(filteredTrips)
      : setSearchTrips([]);
  };

  useEffect(() => {
    console.log("token", localStorage.getItem("token"));
    fetchTrips();
    fetchFarms();
  }, []);

  return (
    <div className={styles.manager_trip}>
      <Row className={styles.manager_trip_create_search}>
        {/* create button  */}
        <Col xs={24} md={4} className={styles.manager_trip_create}>
          <button
            onClick={handleOpenModal}
            className={styles.manager_trip_create_button}
          >
            <MdOutlineCreateNewFolder
              className={styles.manager_trip_create_button_icon}
            />
          </button>
        </Col>
        {/* search input  */}
        <Col xs={24} md={20} className={styles.manager_trip_search}>
          <Input
            className={styles.manager_trip_search_input}
            placeholder="Start Location"
            value={searchStartLocation}
            onChange={(e) => setSearchStartLocation(e.target.value)}
          />

          <Input
            className={styles.manager_trip_search_input}
            placeholder="End location"
            value={searchEndLocation}
            onChange={(e) => setSearchEndLocation(e.target.value)}
          />

          <RangePicker
            className={styles.manager_trip_search_select}
            value={searchDateRange}
            onChange={(dates) => setSearchDateRange(dates)}
            format={dateFormat}
          />

          <Select
            className={styles.manager_trip_search_select}
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Farms"
            value={searchFarms}
            onChange={(values) => setSearchFarms(values)}
          >
            {farmsOpts.map((farm) => (
              <Select.Option key={farm.id} value={farm.id}>
                {farm.farmName}
              </Select.Option>
            ))}
          </Select>

          <Button
            className={styles.manager_trip_search_button}
            type="primary"
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Col>
      </Row>

      <Row justify="center">
        <Col span={24}>
          <h1>List of trips</h1>
          {(searchTrips.length > 0 ? searchTrips : tripList).map((trip) =>
            dispalyListTrips(trip)
          )}
          {searchTrips.length === 0 && tripList.length === 0 && (
            <p>No trips available</p>
          )}
        </Col>
      </Row>
      {isCreateModalOpen && ( // Modal for creating form trip
        <Modal
          title="Create Trip"
          open={isCreateModalOpen}
          onCancel={handleOpenModal}
          footer={null}
        >
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={handleCreateTrip}
          >
            <Form.Item
              label="Date"
              name="date"
              rules={[
                { required: true, message: "Please select a date range" },
              ]}
              style={{ width: "100%" }}
            >
              <RangePicker minDate={dayjs(new Date())} />
            </Form.Item>
            <Form.Item
              label="Start Location"
              name="startLocation"
              rules={[
                {
                  required: true,
                  message: "Please input your start location!",
                },
              ]}
            >
              <Input style={{ width: 292 }} />
            </Form.Item>
            <Form.Item
              label="End Location"
              name="endLocation"
              rules={[
                { required: true, message: "Please input your end location!" },
              ]}
            >
              <Input style={{ width: 292 }} />
            </Form.Item>
            <Form.Item
              label="Farms"
              name="farms"
              rules={[{ required: true, message: "Please select your farms!" }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: 292 }}
                placeholder="Please select"
              >
                {farmsOpts.map((farm) => (
                  <Select.Option key={farm.id} value={farm.id}>
                    {farm.farmName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {isEditModalOpen && ( // Modal for editing form trip
        <Modal
          title="Edit Trip"
          open={isEditModalOpen}
          onCancel={handleOpenEditModal}
          footer={null}
        >
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            style={{ maxWidth: 600 }}
            initialValues={{
              id: infoTripDefault.id,
              date: [
                dayjs(infoTripDefault.startDate, dateFormat),
                dayjs(infoTripDefault.endDate, dateFormat),
              ],
              startLocation: infoTripDefault.startLocation,
              endLocation: infoTripDefault.endLocation,
              farms: infoTripDefault.farms.map((farm) => farm.id),
            }}
            autoComplete="off"
            onFinish={handleEditTrip}
          >
            <Form.Item
              label="Date"
              name="date"
              rules={[
                { required: true, message: "Please select a date range" },
              ]}
              style={{ width: "100%" }}
            >
              <RangePicker minDate={dayjs(new Date())} />
            </Form.Item>
            <Form.Item
              label="Start Location"
              name="startLocation"
              rules={[
                {
                  required: true,
                  message: "Please input your start location!",
                },
              ]}
            >
              <Input style={{ width: 292 }} />
            </Form.Item>
            <Form.Item
              label="End Location"
              name="endLocation"
              rules={[
                { required: true, message: "Please input your end location!" },
              ]}
            >
              <Input style={{ width: 292 }} />
            </Form.Item>
            <Form.Item
              label="Farms"
              name="farms"
              rules={[{ required: true, message: "Please select your farms!" }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: 292 }}
                placeholder="Please select"
              >
                {farmsOpts.map((farm) => (
                  <Select.Option key={farm.id} value={farm.id}>
                    {farm.farmName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit Edit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default ManagerTrip;
