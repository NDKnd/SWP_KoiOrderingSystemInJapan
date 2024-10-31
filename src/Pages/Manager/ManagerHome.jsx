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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [farmsResponse, koiResponse, tripsResponse, userResponse, statsResponse, revenueOrderResponse, revenueBookingResponse, revenueAllResponse] = await Promise.all([api.get("farm"),
                api.get("koi"),
                api.get("trip"),
                api.get("account"),
                api.get("dashboard/stats"),
                api.get("dashboard/revenueOrder/month"),
                api.get("dashboard/revenueBooking/month"),
                api.get("dashboard/revenueAll/month")
                ]);

                setKoiFarmList(farmsResponse.data);
                setKoiList(koiResponse.data);
                setTripList(tripsResponse.data);
                setUserList(userResponse.data);
                setDashboardStats(statsResponse.data);
                setRevenueOrder(revenueOrderResponse.data.revenueOrder);
                setRevenueBooking(revenueBookingResponse.data.revenueBooking);
                setRevenueAll(revenueAllResponse.data.revenueAll);
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
        if (!dashboardStats) return {};
        const topKoiSold = dashboardStats.topKoiSold.slice(0, 10);
        const labels = dashboardStats.topKoiSold.map(koi => koi.name);
        const data = dashboardStats.topKoiSold.map(koi => koi.totalSold);

        return {
            labels,
            datasets: [
                {
                    label: 'Total Koi Sold',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        };
    };

    const getRevenueChartData = () => {
        // Lấy tất cả tháng từ 1 đến 12
        const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);

        // Tạo đối tượng doanh thu để dễ dàng truy cập
        const revenueOrderMap = {};
        const revenueBookingMap = {};
        const revenueAllMap = {};

        revenueOrder.forEach(item => {
            revenueOrderMap[item.month] = item.totalOfMonth;
        });

        revenueBooking.forEach(item => {
            revenueBookingMap[item.month] = item.totalOfMonth;
        });

        revenueAll.forEach(item => {
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
                            data={getChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            font: {
                                                size: 14,
                                                family: 'Arial',
                                            },
                                        },
                                    },
                                    title: {
                                        display: true,
                                        text: 'Top Koi Sold',
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
                                            text: 'Koi Name',
                                            font: {
                                                size: 14,
                                            },
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
                                        text: 'Monthly Revenue',
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
