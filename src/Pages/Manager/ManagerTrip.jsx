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
import { FaDeleteLeft, FaRegCircleXmark } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";

// Kích hoạt plugin
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function ManagerTrip() {
  const [loading, setLoading] = useState(false);

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

  const [optionsLocation, setOptionLocation] = useState([]);
  const [optionsLocationJapan, setOptionLocationJapan] = useState([]);
  const [farmAvailable, setFarmAvailable] = useState([]);
  const [fieldForFarm, setFieldForFarms] = useState([]);
  const [rangeDate, setRangeDate] = useState([]);

  const fetchFarms = async () => {
    try {
      const res = await api.get("farm");
      const farmsSelect = res.data;
      setFarmsOpts(farmsSelect);
      // console.log("farmsSelect: ", res.data);
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
    setFieldForFarms([]);
    setFarmAvailable(farmsOpts);
    setisCreateModalOpen((prevState) => !prevState);
  };
  const handleCreateTrip = async (values) => {
    // try {
    // Lấy dữ liệu từ RangePicker
    const formValues = values;
    values.tripDetailRequests = fieldForFarm;
    console.log("formValues: ", formValues);

    const startDate = formValues.date[0].format(dateFormat);
    console.log("startDate: ", startDate);
    const endDate = formValues.date[1].format(dateFormat);
    console.log("endDate: ", endDate);
    const farmIds = formValues.farms;
    console.log("farmIds: ", farmIds);
    const tripsDetails = fieldForFarm.map(field => ({
      farmId: field.farmId,
      travelDate: field.travelDate.format(dateFormat)
    }));

    const newTrip = {
      startDate: startDate,
      endDate: endDate,
      startLocation: formValues.startLocation,
      endLocation: formValues.endLocation,
      tripDetailRequests: tripsDetails,
    };
    console.log("data for create trip: ", newTrip);
    try {
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

  const handlePreview = (record) => {
    Modal.info({
      width: 600,
      aspectRatio: 3 / 2,
      title: <img src={record.image}
        className={styles.img_Koi} style={{ width: "100%", padding: "15px" }} alt="koi" />,
      maskClosable: true,
      closable: true,
      footer: null,
      icon: null,
    });
  };

  const dispalyListTrips = (trip) => {
    const Eachtrip = {
      id: trip.id,
      startDate: trip.startDate,
      endDate: trip.endDate,
      startLocation: trip.startLocation,
      endLocation: trip.endLocation,
    };
    const EachFarm = trip.tripDetails;
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
                  <a onClick={() => handlePreview(item.farm)}>
                    <img className={styles.manager_trip_image}
                      src={item.farm.image || "https://via.placeholder.com/60"}
                      alt="img"
                    />
                  </a>
                  {/* Nội dung farm */}
                  <div className={styles.manager_trip_content}>
                    <h3>{item.farm.farmName || "No farm name available"}</h3>
                    {item.farm.location || "No farm location available"}
                    <br />
                    {item.farm.phone || "No farm phone available"}
                    <br />
                    {item.farm.email || "No farm email available"}
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

  const handleFetchLocation = async () => {
    setLoading(true);
    try {
      // Fetch vị trí địa lý Việt Nam
      const response = await fetch("https://provinces.open-api.vn/api/");
      const data = Array.from(await response.json());
      console.log("data", data);
      setOptionLocation(data);

      // Fetch vị trí địa lý Nhật Bản
      const response1 = await fetch(`http://api.geonames.org/searchJSON?formatted=true&q=Japan&maxRows=95&username=coconut&lang=ja`);
      const data1 = await response1.json();
      // Lọc các đối tượng có fcl là "L" và fcode là "RGN"
      const filteredData = data1.geonames.filter(location => location.fcl === "P");
      // Cập nhật state với dữ liệu đã lọc
      console.log("dataJapn", filteredData);
      setOptionLocationJapan(filteredData);
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("token", localStorage.getItem("token"));
    fetchTrips();
    fetchFarms();
    handleFetchLocation();
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
            labelWrap={{ style: { width: 150 } }}
            wrapperCol={{ span: 15 }}
            style={{ maxWidth: 700 }}
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
              <RangePicker minDate={dayjs(new Date())}
                onChange={(dates) => {
                  setRangeDate({
                    startDate: dates ? dates[0] : null,
                    endDate: dates ? dates[1] : null,
                  });
                }} />
            </Form.Item>
            <Form.Item
              label="Start Location (Province of VietNam)"
              name="startLocation"
              rules={[
                {
                  required: true,
                  message: "Please select start location!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a location"
                style={{ width: 292 }}
                loading={loading}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.trim().toLowerCase())
                }
              >
                {optionsLocation.map((option) => (
                  <Select.Option key={option.code} value={option.name}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>

            </Form.Item>

            <Form.List name="tripDetailRequests">
              {(fields, { add, remove }) => (
                <div className={styles.selector_farms}>
                  {fields.map(({ key, name, ...restField }) => (
                    <Form.Item {...restField} label="Farms" required={false} key={key}>
                      <Form.Item
                        {...restField}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[{ required: true, whitespace: true, message: "Please select your farm!" }]}
                        noStyle
                      >
                        <Select
                          placeholder="Please select"
                          style={{ width: 292 }}
                          onChange={(value) => {
                            setFieldForFarms((prev) => {
                              const index = prev.findIndex((farm) => farm.name === name);
                              if (index !== -1) {
                                const updatedFarms = [...prev];
                                updatedFarms[index].farmId = value;
                                return updatedFarms;
                              }
                              return [...prev, { farmId: value, name, travelDate: null }];
                            });
                          }}
                        >
                          {farmsOpts.map((farm) => (
                            <Select.Option key={farm.id} value={farm.id}
                              disabled={fieldForFarm.some((selectedFarm) => selectedFarm.farmId === farm.id)}>
                              {farm.farmName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[{ required: true, message: "Please input your travel date!" }]}
                        noStyle
                      >
                        <DatePicker
                          format={dateFormat}
                          style={{ width: 200 }}
                          placeholder="Please select your travel date"
                          disabledDate={(current) => {
                            const { startDate, endDate } = rangeDate;
                            const index = fieldForFarm.findIndex((farm) => farm.name === name);
                            const previousFarm = fieldForFarm[index - 1];
                            return (
                              current && (
                                current < dayjs() || // Không cho chọn ngày trước hôm nay
                                (previousFarm && current < dayjs(previousFarm.travelDate)) || // Ngày đi của farm sau phải lớn hơn ngày đi của farm trước
                                (startDate && current < dayjs(startDate)) || // Ngày đi phải lớn hơn ngày bắt đầu
                                (endDate && current > dayjs(endDate).add(-1, "day"))  // Ngày đi phải nhỏ hơn ngày về
                              )
                            );
                          }}
                          onChange={(date) => {
                            setFieldForFarms((prev) =>
                              prev.map((farm) =>
                                farm.name === name ? { ...farm, travelDate: date } : farm
                              )
                            );
                          }}
                        />
                      </Form.Item>

                      <FaRegCircleXmark
                        style={{ fontSize: "1.5rem" }}
                        className="dynamic-delete-button"
                        onClick={() => {
                          console.log("BeforeDelete", fieldForFarm);
                          // Tìm farm theo name để lấy farmId và travelDate
                          const fieldRemoved = fieldForFarm.find((f) => f.name === name);
                          console.log("the one removed", fieldRemoved);
                          if (fieldRemoved) {
                            const index = fieldForFarm.indexOf(fieldRemoved);
                            // Các trường cần xóa từ trường hiện tại trở đi
                            const fieldsToRemove = fieldForFarm.slice(index);
                            if (fieldsToRemove.length > 1) {
                              // Nếu có nhiều hơn một trường, yêu cầu xác nhận xóa
                              const confirmRemove = window.confirm(`Remove ${fieldsToRemove.length} fields after this field?`);
                              if (confirmRemove) {
                                setFieldForFarms((prev) =>
                                  prev.filter((farm, idx) => idx < index)
                                );

                                remove(fieldsToRemove.map(f => f.name)); // Remove by their 'name'
                              }
                            } else {
                              setFieldForFarms((prev) =>
                                prev.filter((farm) => farm.farmId !== fieldRemoved.farmId)
                              );
                              remove(name);
                            }
                          }
                        }}
                      />
                    </Form.Item>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        console.log("BeforeAdd", fieldForFarm);
                        const farmAvailableFiltered = farmAvailable.filter(
                          (farm) => !fieldForFarm.some((f) => f.farmId === farm.id)
                        );
                        if (farmAvailableFiltered.length === 0) {
                          message.warning("No farms available!");
                          return;
                        }
                        add();
                      }}
                      block
                      className={styles.button_addFarms}
                    >
                      <FaPlusCircle /> Add farm
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.Item
              label="End Location (Province of Japan)"
              name="endLocation"
              rules={[
                { required: true, message: "Please input your end location!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a location"
                style={{ width: 292 }}
                loading={loading}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.trim().toLowerCase())
                }
              >
                {optionsLocationJapan.map((option) => (
                  <Select.Option key={option.toponymName} value={option.toponymName}>
                    {option.toponymName}
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
              tripDetails: infoTripDefault.tripDetails.map((dt) => dt.farm.id),
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
              <Select
                showSearch
                placeholder="Select a location"
                style={{ width: 292 }}
                loading={loading}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.trim().toLowerCase())
                }
              >
                {optionsLocation.map((option) => (
                  <Select.Option key={option.code} value={option.name}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="End Location"
              name="endLocation"
              rules={[
                { required: true, message: "Please input your end location!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a location"
                style={{ width: 292 }}
                loading={loading}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.trim().toLowerCase())
                }
              >
                {optionsLocationJapan.map((option) => (
                  <Select.Option key={option.toponymName} value={option.toponymName}>
                    {option.toponymName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.List name="tripDetails">
              {(fields, { add, remove }) => (
                <div className={styles.selector_farms}>
                  {fields.map(({ key, name, ...restField }) => (
                    <Form.Item {...restField} label="Farms" required={false} key={key}>
                      <Form.Item
                        {...restField}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[{ required: true, whitespace: true, message: "Please select your farm!" }]}
                        noStyle
                      >
                        <Select
                          placeholder="Please select"
                          style={{ width: 292 }}
                          onChange={(value) => {
                            setFieldForFarms((prev) => {
                              const index = prev.findIndex((farm) => farm.name === name);
                              if (index !== -1) {
                                const updatedFarms = [...prev];
                                updatedFarms[index].farmId = value;
                                return updatedFarms;
                              }
                              return [...prev, { farmId: value, name, travelDate: null }];
                            });
                          }}
                        >
                          {farmsOpts.map((farm) => (
                            <Select.Option key={farm.id} value={farm.id}
                              disabled={fieldForFarm.some((selectedFarm) => selectedFarm.farmId === farm.id)}>
                              {farm.farmName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[{ required: true, message: "Please input your travel date!" }]}
                        noStyle
                      >
                        <DatePicker
                          format={dateFormat}
                          style={{ width: 200 }}
                          placeholder="Please select your travel date"
                          disabledDate={(current) => {
                            const { startDate, endDate } = rangeDate;
                            const index = fieldForFarm.findIndex((farm) => farm.name === name);
                            const previousFarm = fieldForFarm[index - 1];
                            return (
                              current && (
                                current < dayjs() || // Không cho chọn ngày trước hôm nay
                                (previousFarm && current < dayjs(previousFarm.travelDate)) || // Ngày đi của farm sau phải lớn hơn ngày đi của farm trước
                                (startDate && current < dayjs(startDate)) || // Ngày đi phải lớn hơn ngày bắt đầu
                                (endDate && current > dayjs(endDate).add(-1, "day"))  // Ngày đi phải nhỏ hơn ngày về
                              )
                            );
                          }}
                          onChange={(date) => {
                            setFieldForFarms((prev) =>
                              prev.map((farm) =>
                                farm.name === name ? { ...farm, travelDate: date } : farm
                              )
                            );
                          }}
                        />
                      </Form.Item>

                      <FaRegCircleXmark
                        style={{ fontSize: "1.5rem" }}
                        className="dynamic-delete-button"
                        onClick={() => {
                          console.log("BeforeDelete", fieldForFarm);
                          // Tìm farm theo name để lấy farmId và travelDate
                          const fieldRemoved = fieldForFarm.find((f) => f.name === name);
                          console.log("the one removed", fieldRemoved);
                          if (fieldRemoved) {
                            const index = fieldForFarm.indexOf(fieldRemoved);
                            // Các trường cần xóa từ trường hiện tại trở đi
                            const fieldsToRemove = fieldForFarm.slice(index);
                            if (fieldsToRemove.length > 1) {
                              // Nếu có nhiều hơn một trường, yêu cầu xác nhận xóa
                              const confirmRemove = window.confirm(`Remove ${fieldsToRemove.length} fields after this field?`);
                              if (confirmRemove) {
                                setFieldForFarms((prev) =>
                                  prev.filter((farm, idx) => idx < index)
                                );

                                remove(fieldsToRemove.map(f => f.name)); // Remove by their 'name'
                              }
                            } else {
                              setFieldForFarms((prev) =>
                                prev.filter((farm) => farm.farmId !== fieldRemoved.farmId)
                              );
                              remove(name);
                            }
                          }
                        }}
                      />
                    </Form.Item>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        console.log("BeforeAdd", fieldForFarm);
                        const farmAvailableFiltered = farmAvailable.filter(
                          (farm) => !fieldForFarm.some((f) => f.farmId === farm.id)
                        );
                        if (farmAvailableFiltered.length === 0) {
                          message.warning("No farms available!");
                          return;
                        }
                        add();
                      }}
                      block
                      className={styles.button_addFarms}
                    >
                      <FaPlusCircle /> Add farm
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

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
