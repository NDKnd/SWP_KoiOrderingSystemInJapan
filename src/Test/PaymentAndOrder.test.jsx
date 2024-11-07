import { expect, describe, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

import LoginForm from '../Pages/Login/LoginForm.jsx';
import BookingPage from '../Pages/Trip/TripPage.jsx';
import OrderPage from '../Pages/Consulting/Consulting_orders.jsx';
// import PaymentPage from '../Pages/Payment/PaymentPage.jsx';
import { useNavigate } from "react-router-dom";


const fillPaymentForm = (paymentType) => {
    // Nhập thông tin thanh toán chung
    fireEvent.change(screen.getByTestId(`${paymentType}_card_number`), {
        target: { value: "1234567812345678" },
    });
    fireEvent.change(screen.getByTestId(`${paymentType}_expiration_date`), {
        target: { value: "12/24" },
    });
    fireEvent.change(screen.getByTestId(`${paymentType}_cvc`), {
        target: { value: "123" },
    });
};

describe("Payment Function & Order Function", () => {

    it("Đăng nhập trước khi chạy test", async () => {

        // Đăng xuất trước khi chạy test
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Giả lập hành động đăng nhập trước khi đặt Booking
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        // Nhập username và password đúng
        fireEvent.change(screen.getByTestId("username_login"), {
            target: { value: "TestAccount" },
        });
        fireEvent.change(screen.getByTestId("password_login"), {
            target: { value: "TestAccount" },
        });

        // Click nút đăng nhập
        fireEvent.click(screen.getByRole("button", { name: /Login/i }));

        // Kiểm tra lưu trữ token trong localStorage và điều hướng thành công
        await waitFor(() => {
            expect(localStorage.getItem("token")).toBeTruthy(); // token đã lưu
            expect(localStorage.getItem("user")).toContain('"role":"CUSTOMER"');
        });
    });

    it("Happy Case: Đặt Booking Trip thành công", async () => {
        render(
            <MemoryRouter>
                <BookingPage /> {/* Trang Booking Trip */}
            </MemoryRouter>
        );

        // Giả lập hành động đặt Booking

        // FAIL  src/Test/PaymentAndOrder.test.jsx > Payment Function & Order Function 
        // > Happy Case: Đặt Booking Trip thành công
        // TestingLibraryElementError: 
        // Unable to find an accessible element with the role "button" and name `/Book Now/i`


        const bookNowButtons = screen.getAllByRole("button", { name: /Book Now/i });
        fireEvent.click(bookNowButtons[0]);

        // Kiểm tra xem thông tin Booking có hiển thị trên trang Booking-status không
        await waitFor(() => {
            expect(screen.getByText("Trip booked successfully!")).toBeInTheDocument();
            expect(localStorage.getItem("bookingId")).toBeDefined();
            expect(window.location.pathname).toEqual("/book-status");
        });
    });

    // it("Unhappy Case: Đặt Booking Trip thất bại", async () => {
    //     render(
    //         <MemoryRouter>
    //             <BookingPage /> {/* Trang Booking Trip */}
    //         </MemoryRouter>
    //     );

    //     // Giả lập hành động đặt Booking
    //     const bookNowButtons = screen.getAllByRole("button", { name: /Book Now/i });
    //     fireEvent.click(bookNowButtons[0]);

    //     // Kiểm tra xem thông tin Booking có hiển thị trên trang Booking-status không
    //     await waitFor(() => {
    //         expect(screen.getByText("You already have an active trip in booking. Complete it before booking another trip.")).toBeInTheDocument();
    //         expect(screen.queryByText("Trip booked successfully!")).not.toBeInTheDocument();
    //         expect(localStorage.getItem("bookingId")).toBeNull();
    //         expect(window.location.pathname).toEqual("/trips");
    //     });
    // });


});
