import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import "./DeliverHome.css";
import { MdOutlineCalendarMonth, MdOutlinePendingActions } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { message } from "antd";
import dayjs from "dayjs";

const DeliverHome = () => {
    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mockOrderList = [
        {
            id: 1,
            expectedDate: "2024-10-29",
            deliveredDate: null,
            price: 0,
            address: "123 Test Street, Test City",
            status: "ON_DELIVERY", // Đang giao hàng
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 9,
                        koiName: "Sakai Koi",
                        price: 500,
                        type: "Type A",
                        description: "Beautiful koi fish from Sakai farm",
                        image: "https://example.com/sakai.jpg",
                        farmName: "koiFarm2",
                    },
                    quantity: 2,
                    price: 1000,
                },
            ],
            booking: {
                id: 1,
                totalPrice: 1000,
                account: {
                    firstName: "John",
                    lastName: "Doe",
                    address: "456 Example Ave, Example City",
                    phone: "0943251643",
                    email: "customerTest@gmail.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 2,
            expectedDate: "2024-11-05", // Ngày giao trong tương lai (tháng tới)
            deliveredDate: null,
            price: 0,
            address: "789 Future St, Future City",
            status: "ON_DELIVERY",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 2,
                        koiName: "Marudo Koi",
                        price: 300,
                        type: "Type B",
                        description: "Koi fish with beautiful patterns",
                        image: "https://example.com/marudo.jpg",
                        farmName: "Marudo",
                    },
                    quantity: 1,
                    price: 300,
                },
            ],
            booking: {
                id: 2,
                totalPrice: 300,
                account: {
                    firstName: "Jane",
                    lastName: "Smith",
                    address: "789 Future St, Future City",
                    phone: "0943251644",
                    email: "janesmith@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 3,
            expectedDate: "2024-12-15", // Ngày giao trong tương lai, tháng tới
            deliveredDate: "2024-12-16",
            price: 0,
            address: "123 Delivered Ave, Delivered City",
            status: "COMPLETED",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 3,
                        koiName: "Momotaro Koi",
                        price: 400,
                        type: "Type C",
                        description: "Top-grade koi from Momotaro",
                        image: "https://example.com/momotaro.jpg",
                        farmName: "Momotaro",
                    },
                    quantity: 3,
                    price: 1200,
                },
            ],
            booking: {
                id: 3,
                totalPrice: 1200,
                account: {
                    firstName: "Alice",
                    lastName: "Johnson",
                    address: "123 Delivered Ave, Delivered City",
                    phone: "0943251645",
                    email: "alicejohnson@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 4,
            expectedDate: "2025-01-05", // Ngày giao trong tương lai (năm sau)
            deliveredDate: null,
            price: 0,
            address: "456 New Year Blvd, Future City",
            status: "ON_DELIVERY",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 4,
                        koiName: "Sakai Super Koi",
                        price: 600,
                        type: "Type D",
                        description: "A premium koi from Sakai",
                        image: "https://example.com/sakai_super.jpg",
                        farmName: "Sakai",
                    },
                    quantity: 1,
                    price: 600,
                },
            ],
            booking: {
                id: 4,
                totalPrice: 600,
                account: {
                    firstName: "Tom",
                    lastName: "Clark",
                    address: "456 New Year Blvd, Future City",
                    phone: "0943251646",
                    email: "tomclark@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 5,
            expectedDate: "2024-11-15", // Ngày giao trong tương lai gần
            deliveredDate: "2024-11-15",
            price: 0,
            address: "123 Random St, Random City",
            status: "COMPLETED",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 5,
                        koiName: "Hoshikin Koi",
                        price: 200,
                        type: "Type E",
                        description: "Elegant Hoshikin koi fish",
                        image: "https://example.com/hoshikin.jpg",
                        farmName: "Hoshikin",
                    },
                    quantity: 2,
                    price: 400,
                },
            ],
            booking: {
                id: 5,
                totalPrice: 400,
                account: {
                    firstName: "Sara",
                    lastName: "Connor",
                    address: "123 Random St, Random City",
                    phone: "0943251647",
                    email: "saraconnor@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 6,
            expectedDate: "2024-10-30", // Ngày giao trong tháng hiện tại
            deliveredDate: null,
            price: 0,
            address: "789 Current St, Current City",
            status: "ON_DELIVERY",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 6,
                        koiName: "Koda Koi",
                        price: 350,
                        type: "Type F",
                        description: "Koi fish from Koda farm",
                        image: "https://example.com/koda.jpg",
                        farmName: "Koda",
                    },
                    quantity: 1,
                    price: 350,
                },
            ],
            booking: {
                id: 6,
                totalPrice: 350,
                account: {
                    firstName: "Leo",
                    lastName: "Brown",
                    address: "789 Current St, Current City",
                    phone: "0943251648",
                    email: "leobrown@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 7,
            expectedDate: "2025-04-10", // Ngày giao xa hơn trong năm sau
            deliveredDate: null,
            price: 0,
            address: "456 Future Ave, Future Town",
            status: "ON_DELIVERY",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 7,
                        koiName: "Shinoda Koi",
                        price: 1000,
                        type: "Type G",
                        description: "Rare Shinoda koi fish",
                        image: "https://example.com/shinoda.jpg",
                        farmName: "Shinoda",
                    },
                    quantity: 1,
                    price: 1000,
                },
            ],
            booking: {
                id: 7,
                totalPrice: 1000,
                account: {
                    firstName: "Nina",
                    lastName: "White",
                    address: "456 Future Ave, Future Town",
                    phone: "0943251649",
                    email: "ninawhite@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 13,
            expectedDate: "2024-10-30", // Ngày giao trong tháng hiện tại
            deliveredDate: null,
            price: 0,
            address: "789 Current St, Current City",
            status: "ON_DELIVERY",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 6,
                        koiName: "Koda Koi",
                        price: 350,
                        type: "Type F",
                        description: "Koi fish from Koda farm",
                        image: "https://example.com/koda.jpg",
                        farmName: "Koda",
                    },
                    quantity: 1,
                    price: 350,
                },
            ],
            booking: {
                id: 6,
                totalPrice: 350,
                account: {
                    firstName: "Leo",
                    lastName: "Brown",
                    address: "789 Current St, Current City",
                    phone: "0943251648",
                    email: "leobrown@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        // Trường hợp giao hàng hôm nay
        {
            id: 8,
            expectedDate: "2024-10-29", // Ngày giao hôm nay
            deliveredDate: null,
            price: 0,
            address: "123 Today St, Today City",
            status: "ON_DELIVERY",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 7,
                        koiName: "Asagi Koi",
                        price: 500,
                        type: "Type C",
                        description: "Beautiful Asagi koi fish",
                        image: "https://example.com/asagi.jpg",
                        farmName: "Asagi Farm",
                    },
                    quantity: 2,
                    price: 1000,
                },
            ],
            booking: {
                id: 7,
                totalPrice: 1000,
                account: {
                    firstName: "Anna",
                    lastName: "Smith",
                    address: "123 Today St, Today City",
                    phone: "0943251647",
                    email: "annasmith@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 9,
            expectedDate: "2024-10-29", // Ngày giao hôm nay
            deliveredDate: null,
            price: 0,
            address: "321 Nowhere Rd, Nowhere City",
            status: "ON_DELIVERY",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 8,
                        koiName: "Showa Koi",
                        price: 700,
                        type: "Type D",
                        description: "Rare Showa koi fish",
                        image: "https://example.com/showa.jpg",
                        farmName: "Showa Farm",
                    },
                    quantity: 1,
                    price: 700,
                },
            ],
            booking: {
                id: 8,
                totalPrice: 700,
                account: {
                    firstName: "Michael",
                    lastName: "Johnson",
                    address: "321 Nowhere Rd, Nowhere City",
                    phone: "0943251646",
                    email: "michaeljohnson@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 10,
            expectedDate: "2024-10-29", // Ngày giao hôm nay
            deliveredDate: null,
            price: 0,
            address: "654 Tomorrow St, Tomorrow City",
            status: "COMPLETED",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 9,
                        koiName: "Sanke Koi",
                        price: 450,
                        type: "Type E",
                        description: "Gorgeous Sanke koi fish",
                        image: "https://example.com/sanke.jpg",
                        farmName: "Sanke Farm",
                    },
                    quantity: 1,
                    price: 450,
                },
                {
                    koiFishResponse: {
                        id: 10,
                        koiName: "Shiro Utsuri",
                        price: 500,
                        type: "Type A",
                        description: "Beautiful Shiro Utsuri koi fish",
                        image: "https://example.com/shiro.jpg",
                        farmName: "Utsuri Farm",
                    },
                    quantity: 1,
                    price: 500,
                },
                {
                    koiFishResponse: {
                        id: 11,
                        koiName: "Kohaku Koi",
                        price: 600,
                        type: "Type B",
                        description: "Stunning Kohaku koi fish",
                        image: "https://example.com/kohaku.jpg",
                        farmName: "Kohaku Farm",
                    },
                    quantity: 1,
                    price: 600,
                },
            ],
            booking: {
                id: 9,
                totalPrice: 450 + 500 + 600, // Cập nhật tổng giá
                account: {
                    firstName: "Sophia",
                    lastName: "Williams",
                    address: "654 Tomorrow St, Tomorrow City",
                    phone: "0943251645",
                    email: "sophiawilliams@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        // Trường hợp giao hàng vào tương lai
        {
            id: 11,
            expectedDate: "2024-11-05", // Ngày giao trong tương lai
            deliveredDate: null,
            price: 0,
            address: "987 Future Blvd, Future City",
            status: "ON_DELIVERY",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 10,
                        koiName: "Kohaku Koi",
                        price: 600,
                        type: "Type A",
                        description: "Classic Kohaku koi fish",
                        image: "https://example.com/kohaku.jpg",
                        farmName: "Kohaku Farm",
                    },
                    quantity: 1,
                    price: 600,
                },
            ],
            booking: {
                id: 10,
                totalPrice: 600,
                account: {
                    firstName: "Oliver",
                    lastName: "Jones",
                    address: "987 Future Blvd, Future City",
                    phone: "0943251644",
                    email: "oliverjones@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
        {
            id: 12,
            expectedDate: "2025-01-15", // Ngày giao trong năm sau
            deliveredDate: null,
            price: 0,
            address: "741 Next St, Next City",
            status: "COMPLETED",
            orderDetailResponseList: [
                {
                    koiFishResponse: {
                        id: 11,
                        koiName: "Kiki Koi",
                        price: 800,
                        type: "Type B",
                        description: "Exquisite Kiki koi fish",
                        image: "https://example.com/kiki.jpg",
                        farmName: "Kiki Farm",
                    },
                    quantity: 1,
                    price: 800,
                },
            ],
            booking: {
                id: 11,
                totalPrice: 800,
                account: {
                    firstName: "Emma",
                    lastName: "Davis",
                    address: "741 Next St, Next City",
                    phone: "0943251643",
                    email: "emmadavis@example.com",
                },
                trip: {
                    startLocation: "Vietnam",
                    endLocation: "Japan",
                },
            },
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const orderResponse = await api.get("order/manager");
                setOrderList(orderResponse.data);
                // setOrderList(mockOrderList);
            } catch (err) {
                console.error(err);
                message.error("Cannot fetch some of the data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const today = dayjs();
    const currentMonth = today.month() + 1;
    const currentYear = today.year();
    const currentDay = today.date();

    const ordersThisMonth = orderList.filter(order => {
        const deliveryDate = dayjs(order.expectedDate, "YYYY-MM-DD");
        return deliveryDate.month() + 1 === currentMonth && deliveryDate.year() === currentYear;
    });

    const pendingOrdersThisMonth = ordersThisMonth.filter(order => order.status === "ON_DELIVERY");
    const pendingOrdersToday = pendingOrdersThisMonth.filter(order => {
        const deliveryDate = dayjs(order.expectedDate, "YYYY-MM-DD");
        return deliveryDate.date() === currentDay && deliveryDate.month() + 1 === currentMonth && deliveryDate.year() === currentYear;
    });

    const todayDate = dayjs().format("YYYY-MM-DD");
    const filteredOrderList = orderList.filter(order =>
        order.expectedDate === todayDate && order.status === "ON_DELIVERY"
    );


    const handleDetail = (order) => {
        setCurrentOrder(order);
        setIsModalOpen((prevState) => !prevState);
    }

    const handleDetailComplete = async (event) => {
        event.preventDefault();
        try {
            const res = await api.put(`order/${currentOrder.id}`);
            if (res.status >= 200 && res.status < 300) {
                setOrderList((prevList) => prevList.filter((order) => order.id !== currentOrder.id));
                message.success("Order completed successfully");
            } else {
                message.error("Failed to complete the order");
            }
        } catch (err) {
            message.error(err.response?.data?.message || "Error completing the order");
        }
    };

    return (
        <>
            <div className="manager-dashboard-title">
                <h3>WELCOME DELIVER</h3>
            </div>

            <div className="deliver-dashboard-card">
                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-1">
                    <div className="deliver-dashborad-card-title">
                        <h3>Total Orders For This Month</h3>
                        <MdOutlineCalendarMonth className="deliver-dashborad-card-title-icon" />
                    </div>
                    <h1>{ordersThisMonth.length}</h1>
                </div>

                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-2">
                    <div className="deliver-dashborad-card-title">
                        <h3>Pending Orders This Month</h3>
                        <MdOutlinePendingActions className="deliver-dashborad-card-title-icon" />
                    </div>
                    <h1>{pendingOrdersThisMonth.length}</h1>
                </div>

                <div className="deliver-dashboard-card-item" id="deliver-dashboard-card-item-3">
                    <div className="deliver-dashborad-card-title">
                        <h3>Orders Today</h3>
                        <FaTasks className="deliver-dashborad-card-title-icon" />
                    </div>
                    <h1>{pendingOrdersToday.length}</h1>
                </div>
            </div>

            <div className="deliver-dashboard-home-content">
                {loading ? (
                    <div className="loading-spinner">
                        Loading...
                    </div>
                ) : (
                    <div className="deliver-dashboard-home-content-user">
                        <div className="deliver-dashboard-home-content-user-card-item">
                            <h3>Orders for today</h3>
                        </div>
                        <table>
                            <thead className="deliver-dashboard-home-content-user-header">
                                <tr>
                                    <th className="deliver-dashboard-home-content-user-header-1">Customer name</th>
                                    <th className="deliver-dashboard-home-content-user-header-2">Koi ordered</th>
                                    <th className="deliver-dashboard-home-content-user-header-3">Quantity</th>
                                    <th className="deliver-dashboard-home-content-user-header-4">Address</th>
                                    <th className="deliver-dashboard-home-content-user-header-5">Delivery date</th>
                                    <th className="deliver-dashboard-home-content-user-header-6">Total Payment ($)</th>
                                    <th className="deliver-dashboard-home-content-user-header-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="deliver-dashboard-home-content-user-body">
                                {filteredOrderList.length > 0 ? (
                                    filteredOrderList.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.booking.account.firstName} {order.booking.account.lastName}</td>
                                            <td>
                                                {order.orderDetailResponseList && order.orderDetailResponseList.length > 0 ? (
                                                    order.orderDetailResponseList.map((detail, index) => (
                                                        <div key={index}>{detail.koiFishResponse.koiName}</div>
                                                    ))
                                                ) : (
                                                    <div>No koi ordered</div>
                                                )}
                                            </td>
                                            <td>
                                                {order.orderDetailResponseList.map((detail, index) => (
                                                    <div key={index}>{detail.quantity}</div>
                                                ))}
                                            </td>
                                            <td>{order.booking.account.address}</td>
                                            <td>{order.expectedDate}</td>
                                            <td>{order.booking.totalPrice}</td>
                                            <td className="deliver-dashboard-home-content-user-body-button-box">
                                                <a onClick={() => handleDetail(order)} className="deliver-dashboard-home-content-user-body-button">Detail</a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>No orders for today</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>)}
                {
                    isModalOpen && currentOrder && (
                        <div className="manager-order-modal">
                            <div className="manager-order-modal-content">
                                <h2 className="manager-order-title-detail">Order Detail</h2>
                                <form onSubmit={handleDetailComplete} className="manager-order-edit-detail">
                                    <div className="manager-order-content-detail">
                                        <label>Customer Name: {currentOrder.booking.account.firstName} {currentOrder.booking.account.lastName}</label>
                                    </div>
                                    <div className="manager-order-content-detail">
                                        <label>Address: {currentOrder.booking.account.address}</label>
                                    </div>
                                    <table className="manager-order-table-detail">
                                        <thead>
                                            <tr>
                                                <th>Koi Name</th>
                                                <th>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrder.orderDetailResponseList && currentOrder.orderDetailResponseList.length > 0 ? (
                                                currentOrder.orderDetailResponseList.map((detail, index) => (
                                                    <tr key={index}>
                                                        <td>{detail.koiFishResponse.koiName}</td>
                                                        <td>{detail.quantity}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td>No koi available</td>
                                                    <td>-</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="manager-order-content-detail">
                                        <label>Delivery Date: {currentOrder.expectedDate}</label>
                                    </div>
                                    <div className="manager-order-content-detail">
                                        <label>Total Payment: ${currentOrder.booking.totalPrice}</label>
                                    </div>
                                    <div>
                                        
                                    </div>
                                    <div className="manager-order-content-detail-button">
                                        <button type="submit" className="manager-order-content-detail-button-pop">Complete</button>
                                        <button
                                            className="manager-order-content-detail-button-pop"
                                            onClick={() => {
                                                setIsModalOpen((prevState) => !prevState);
                                                setCurrentOrder(null);
                                            }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
};

export default DeliverHome;
