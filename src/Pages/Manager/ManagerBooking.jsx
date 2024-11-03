import React, { useState, useEffect } from 'react';
import { Row, Col, DatePicker, Select, Button, Input, Table, Tag } from 'antd';
import styles from './ManagerTrip.module.css';
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import api from "../../services/axios";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function ManagerBooking() {
    const [bookings, setBookings] = useState([]);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [selectedFarms, setSelectedFarms] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [originalBookings, setOriginalBookings] = useState([]);



    useEffect(() => {
        api.get('booking/manager')
            .then(response => {
                console.log("Response data:", response.data);
                if (Array.isArray(response.data)) {
                    setBookings(response.data);
                    setOriginalBookings(response.data);
                } else {
                    console.error("Data format error: Expected an array");
                    setBookings([]);
                }
            })
            .catch(error => console.error("Fail to load bookings", error));
    }, []);

    const columns = [
        {
            title: 'Customer Name',
            key: 'customerName',
            render: (text, record) => `${record.account.firstName} ${record.account.lastName}`,
        },
        {
            title: 'Start Location',
            dataIndex: ['trip', 'startLocation'],
            key: 'startLocation',
        },
        {
            title: 'End Location',
            dataIndex: ['trip', 'endLocation'],
            key: 'endLocation',
        },
        {
            title: 'Booking Date',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            render: date => dayjs(date).format(dateFormat),
            sorter: (a, b) => dayjs(a.bookingDate).isBefore(b.bookingDate) ? -1 : 1,
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Farm Details',
            key: 'farmDetails',
            render: (text, record) => (
                <span>
                    {record.trip.farms.map(farm => (
                        <Tag key={farm.id}>{farm.farmName}</Tag>
                    ))}
                </span>
            ),
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: price => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Completed', value: 'COMPLETED' },
                { text: 'Cancel', value: 'CANCEL' },
                { text: 'In Progress', value: 'IN_PROGRESS' },
                { text: 'Pending Confirmation', value: 'PENDING_CONFIRMATION' }
            ],
            onFilter: (value, record) => record.status === value,
            render: status => {
                const color = status === 'COMPLETED' ? 'green' :
                    status === 'CANCEL' ? 'red' :
                        status === 'IN_PROGRESS' ? 'blue' :
                            'orange';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Feedback Response',
            dataIndex: 'feedbackResponse',
            key: 'feedbackResponse',
            render: feedback => {
                if (!feedback) {
                    return 'N/A';
                }
        
                const { rating, comment } = feedback;
                return (
                    <div>
                        <div>Rating: {rating || 'N/A'}</div>
                        <div>Comment: {comment || 'N/A'}</div>
                    </div>
                );
            }, 
        }
    ];
    

    const handleSearch = () => {
        let filteredBookings = originalBookings;

        if (startLocation) {
            filteredBookings = filteredBookings.filter(booking =>
                booking.trip.startLocation.toLowerCase().includes(startLocation.toLowerCase())
            );
        }

        if (endLocation) {
            filteredBookings = filteredBookings.filter(booking =>
                booking.trip.endLocation.toLowerCase().includes(endLocation.toLowerCase())
            );
        }

        if (customerName) {
            filteredBookings = filteredBookings.filter(booking =>
                `${booking.account.firstName} ${booking.account.lastName}`
                    .toLowerCase()
                    .includes(customerName.toLowerCase())
            );
        }

        if (dateRange.length) {
            filteredBookings = filteredBookings.filter(booking => {
                const bookingDate = dayjs(booking.bookingDate);
                return bookingDate.isSameOrAfter(dayjs(dateRange[0])) && bookingDate.isSameOrBefore(dayjs(dateRange[1]));
            });
        }

        if (selectedFarms.length) {
            filteredBookings = filteredBookings.filter(booking =>
                booking.trip.farms.some(farm => selectedFarms.includes(farm.id.toString()))
            );
        }

        if (selectedStatus.length) {
            filteredBookings = filteredBookings.filter(booking => selectedStatus.includes(booking.status));
        }

        setBookings(filteredBookings);
    };

    return (
        <div>
            <Row className={styles.manager_trip_create_search}>
                <Col xs={24} md={20} className={styles.manager_trip_search} style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Input
                        className={styles.manager_trip_search_input}
                        placeholder="Start Location"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                    />

                    <Input
                        className={styles.manager_trip_search_input}
                        placeholder="End Location"
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                    />

                    <Input
                        className={styles.manager_trip_search_input}
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />

                    <RangePicker
                        className={styles.manager_trip_search_select}
                        format={dateFormat}
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates)}
                    />

                    <Select
                        className={styles.manager_trip_search_select}
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Farms"
                        onChange={setSelectedFarms}
                    >
                        {(() => {
                            const farmSet = new Set();
                            return originalBookings.flatMap(booking =>
                                booking.trip.farms
                                    .filter(farm => {
                                        if (!farmSet.has(farm.id)) {
                                            farmSet.add(farm.id);
                                            return true;
                                        }
                                        return false;
                                    })
                                    .map(farm => (
                                        <Select.Option key={farm.id} value={farm.id.toString()}>{farm.farmName}</Select.Option>
                                    ))
                            );
                        })()}
                    </Select>

                    <Select
                        className={styles.manager_trip_search_select}
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Status"
                        onChange={setSelectedStatus}
                    >
                        <Select.Option value="PENDING_CONFIRMATION">Pending Confirmation</Select.Option>
                        <Select.Option value="COMPLETED">Completed</Select.Option>
                        <Select.Option value="CANCEL">Canceled</Select.Option>
                        <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
                    </Select>

                    <Button
                        className={styles.manager_trip_search_button}
                        type="primary"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={bookings}
                rowKey="id"
                pagination={{ pageSize: 20 }}
                className={styles.manager_trip_table}
            />
        </div>
    );
}

export default ManagerBooking;
