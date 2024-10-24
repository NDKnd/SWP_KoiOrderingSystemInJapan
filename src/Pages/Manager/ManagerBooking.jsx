import React from 'react'
import { Row, Col, DatePicker, Select, Button, Input } from 'antd';
import styles from './ManagerTrip.module.css';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { IoSearchOutline } from "react-icons/io5";
// Kích hoạt plugin
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function ManagerBooking() {
    const [farmsOpts, setFarmsOpts] = useState([]);
    const [isCreateModalOpen, setisCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [searchTrips, setSearchTrips] = useState([]);
    const [searchStartLocation, setSearchStartLocation] = useState("");
    const [searchEndLocation, setSearchEndLocation] = useState("");
    const [searchDateRange, setSearchDateRange] = useState([]);
    const [searchFarms, setSearchFarms] = useState([]);


    const handleOpenModal = () => {
        setisCreateModalOpen((prevState) => !prevState);
    };

    const handleSearch = () => { }


    return (
        <div>
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
        </div>
    )
}

export default ManagerBooking