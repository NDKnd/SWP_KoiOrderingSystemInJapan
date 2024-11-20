import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import "./ManagerHome.css";
import { FaFishFins, FaUser } from "react-icons/fa6";
import { PiFarmFill } from "react-icons/pi";
import { GiJourney } from "react-icons/gi";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ManagerHome = () => {
    const [koiFarmList, setKoiFarmList] = useState([]);
    const [koiList, setKoiList] = useState([]);
    const [tripList, setTripList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenueOrder, setRevenueOrder] = useState([]);
    const [revenueBooking, setRevenueBooking] = useState([]);
    const [revenueAll, setRevenueAll] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalBooking, setTotalBooking] = useState([]);
    const [totalOrder, setTotalOrder] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [farmsResponse, koiResponse, tripsResponse, userResponse, statsResponse, revenueOrderResponse, revenueBookingResponse, revenueAllResponse, bookingResponse, orderResponse] = await Promise.all([api.get("farm"),
                api.get("koi"),
                api.get("trip"),
                api.get("account"),
                api.get("dashboard/stats"),
                api.get("dashboard/revenueOrder/month"),
                api.get("dashboard/revenueBooking/month"),
                api.get("dashboard/revenueAll/month"),
                api.get("dashboard/totalBooking/month"),
                api.get("dashboard/totalOrder/month")
                ]);

                setKoiFarmList(farmsResponse.data);
                setKoiList(koiResponse.data);
                setTripList(tripsResponse.data);
                setUserList(userResponse.data);
                setDashboardStats(statsResponse.data);
                setRevenueOrder(revenueOrderResponse.data.revenueOrder);
                setRevenueBooking(revenueBookingResponse.data.revenueBooking);
                setRevenueAll(revenueAllResponse.data.revenueAll);
                setTotalBooking(bookingResponse.data.booking);
                setTotalOrder(orderResponse.data.booking);
            } catch (err) {
                console.error(err);
                message.error("Cannot fetch some of the data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <>
                <p>Loading...</p>
            </>)
    }

    const getChartData = () => {
        const months = [
            '1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12'
        ];

        // Lọc dữ liệu theo năm đã chọn
        const filteredBookingData = totalBooking.filter(item => item.year === selectedYear);
        const filteredOrderData = totalOrder.filter(item => item.year === selectedYear);

        // Khởi tạo mảng bookingData và orderData với giá trị mặc định là 0
        let bookingData = Array(12).fill(0);
        let orderData = Array(12).fill(0);

        // Cập nhật bookingData với dữ liệu từ filteredBookingData
        filteredBookingData.forEach(item => {
            const monthIndex = item.month - 1;
            bookingData[monthIndex] = item.QuantityOfMonth;
        });

        // Cập nhật orderData với dữ liệu từ filteredOrderData
        filteredOrderData.forEach(item => {
            const monthIndex = item.month - 1;
            orderData[monthIndex] = item.QuantityOfMonth;
        });

        return {
            labels: months.map(month => `${month}`),
            datasets: [
                {
                    label: 'Total Booking',
                    data: bookingData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Total Order',
                    data: orderData,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                }
            ]
        };
    };


    const getRevenueChartData = () => {
        const { revenueOrderFiltered, revenueBookingFiltered, revenueAllFiltered } = getRevenueByYear(selectedYear);
        const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);

        const revenueOrderMap = {};
        const revenueBookingMap = {};
        const revenueAllMap = {};

        revenueOrderFiltered.forEach(item => {
            revenueOrderMap[item.month] = item.totalOfMonth;
        });

        revenueBookingFiltered.forEach(item => {
            revenueBookingMap[item.month] = item.totalOfMonth;
        });

        revenueAllFiltered.forEach(item => {
            revenueAllMap[item.month] = item.totalOfMonth;
        });

        const totalOrder = allMonths.map(month => revenueOrderMap[month] || 0);
        const totalBooking = allMonths.map(month => revenueBookingMap[month] || 0);
        const totalAll = allMonths.map(month => revenueAllMap[month] || 0);

        return {
            labels: allMonths,
            datasets: [
                {
                    label: 'Revenue from orders',
                    data: totalOrder,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Revenue from bookings',
                    data: totalBooking,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                },
                {
                    label: 'Total revenue',
                    data: totalAll,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
            ],
        };
    };

    const handleYearChange = (event) => {
        const selectedYear = parseInt(event.target.value);
        setSelectedYear(selectedYear);
    };

    const getRevenueByYear = (year) => {
        const revenueOrderFiltered = revenueOrder.filter(item => item.year === year);
        const revenueBookingFiltered = revenueBooking.filter(item => item.year === year);
        const revenueAllFiltered = revenueAll.filter(item => item.year === year);

        return {
            revenueOrderFiltered,
            revenueBookingFiltered,
            revenueAllFiltered
        };
    };

    const getValidYears = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: currentYear - 2000 + 1 }, (_, index) => 2000 + index);
    };

    return (
        <>
            <div className="manager-dashboard-title">
                <h3>WELCOME ADMIN</h3>
            </div>

            <div className="manager-dashboard-card">
                <div className="manager-dashboard-card-item" id="manager-dashboard-card-item-1">
                    <div className="manager-dashborad-card-title">
                        <h3>KOI FARM</h3>
                        <PiFarmFill className="manager-dashborad-card-title-icon" />
                    </div>
                    <h1>{koiFarmList.length}</h1>
                </div>

                <div className="manager-dashboard-card-item" id="manager-dashboard-card-item-2">
                    <div className="manager-dashborad-card-title">
                        <h3>KOI FISH</h3>
                        <FaFishFins className="manager-dashborad-card-title-icon" />
                    </div>
                    <h1>{koiList.length}</h1>
                </div>

                <div className="manager-dashboard-card-item" id="manager-dashboard-card-item-3">
                    <div className="manager-dashborad-card-title">
                        <h3>KOI TRIP</h3>
                        <GiJourney className="manager-dashborad-card-title-icon" />
                    </div>
                    <h1>{tripList.length}</h1>
                </div>

                <div className="manager-dashboard-card-item" id="manager-dashboard-card-item-4">
                    <div className="manager-dashborad-card-title">
                        <h3>USERS</h3>
                        <FaUser className="manager-dashborad-card-title-icon" />
                    </div>
                    <h1>{userList.length}</h1>
                </div>
            </div>

            <div className="manager-dashboard-home-content">
                <div className="manager-chart-1">
                    {dashboardStats && (
                        <Bar
                            data={{
                                labels: ['Total Orders', 'Total Booking', 'Total Farms', 'Total Accounts'],
                                datasets: [
                                    {
                                        label: 'Total Statistics',
                                        data: [
                                            dashboardStats.totalOrder,
                                            dashboardStats.totalBooking,
                                            dashboardStats.totalFarm,
                                            dashboardStats.totalAccounts
                                        ],
                                        backgroundColor: [
                                            'rgba(75, 192, 192, 0.6)',
                                            'rgba(153, 102, 255, 0.6)',
                                            'rgba(255, 99, 132, 0.6)',
                                            'rgba(255, 159, 64, 0.6)',
                                        ],
                                    }
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Overview of Total Statistics',
                                        font: {
                                            size: 18,
                                            family: 'Arial',
                                            weight: 'bold',
                                        },
                                    },
                                },
                            }}
                        />
                    )}
                </div>
                <div className="manager-chart-3-box">
                    <div className="manager-chart-3">
                        {dashboardStats && dashboardStats.topFarmBooking && (
                            <Bar
                                data={{
                                    labels: dashboardStats.topFarmBooking.slice(0, 10).map(farm => farm.name),  // Giới hạn 15 phần tử
                                    datasets: [
                                        {
                                            label: 'Top Farm Booking',
                                            data: dashboardStats.topFarmBooking.slice(0, 10).map(farm => farm.bookingCount),  // Giới hạn 15 phần tử
                                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                        }
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Top Farm Booking',
                                            font: {
                                                size: 18,
                                                family: 'Arial',
                                                weight: 'bold',
                                            },
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>

                    <div className="manager-chart-3">
                        {dashboardStats && dashboardStats.topKoiSold && (
                            <Bar
                                data={{
                                    labels: dashboardStats.topKoiSold.slice(0, 10).map(koi => koi.name),  // Giới hạn 15 phần tử
                                    datasets: [
                                        {
                                            label: 'Top Koi Order',
                                            data: dashboardStats.topKoiSold.slice(0, 10).map(koi => koi.totalSold),  // Giới hạn 15 phần tử
                                            backgroundColor: 'rgba(153, 102, 255, 0.6)',
                                        }
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Top Koi Order',
                                            font: {
                                                size: 18,
                                                family: 'Arial',
                                                weight: 'bold',
                                            },
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="year-filter">
                    <label htmlFor="year-select">Select Year: </label>
                    <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                        {getValidYears().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="manager-chart-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Bar
                            data={getChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Total Booking & Order by Month',
                                        font: {
                                            size: 18,
                                            family: 'Arial',
                                            weight: 'bold',
                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Month',
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Quantity',
                                        },
                                    },
                                },
                            }}
                        />
                    )}
                </div>

                <div className="manager-chart-2">
                    {revenueOrder.length > 0 && revenueBooking.length > 0 && revenueAll.length > 0 && (
                        <Bar
                            data={getRevenueChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: `Monthly Revenue for ${selectedYear}`,
                                        font: {
                                            size: 18,
                                            family: 'Arial',
                                            weight: 'bold',
                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Month',
                                        },
                                    },
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default ManagerHome;
