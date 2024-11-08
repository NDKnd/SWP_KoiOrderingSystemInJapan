import { expect, describe, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom'; // Import MemoryRouter
import api from "../services/axios";

import LoginForm from '../Pages/Login/LoginForm.jsx';
import BookingPage from '../Pages/Trip/TripPage.jsx';
import BookingStatusPage from '../Pages/Trip/BookingStatusPage.jsx';
import OrderPage from '../Pages/Consulting/Consulting_orders.jsx';
import { message, Modal } from 'antd';

// Mocking API calls
vi.mock("../../services/axios", () => ({
    get: vi.fn(),
    post: vi.fn(),
}));


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

    it("step by step", async () => {

        // Mock các hàm Modal
        const modalConfirmMock = vi.fn().mockImplementation((options) => {
            options.onOk();  // Mô phỏng nhấn nút OK trong Modal.confirm
        });
        Modal.confirm = modalConfirmMock;
        const apiPostMock = vi.fn().mockResolvedValue({ status: 200, data: { id: 123 } });
        api.post = apiPostMock;


        // Đợi cho đến khi tripList được hiển thị trên giao diện
        await waitFor(() => {
            render(
                <MemoryRouter>
                    <BookingPage />
                </MemoryRouter>
            );
            // Kiểm tra danh sách trip hiện tại có độ dài lớn hơn 0
            expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
        });

        // Lấy nút 'Book Now' đầu tiên và đảm bảo rằng phần tử này đã được render
        const bookNowButtons = await screen.findAllByText("Book Now");
        const bookNowButton = bookNowButtons[0];
        expect(bookNowButton).toBeInTheDocument();

        // Tìm phần tử Card chứa nút "Book Now"
        const cardElement = bookNowButton.closest('.trip-card');

        // Đảm bảo rằng phần tử Card không phải là null
        expect(cardElement).not.toBeNull();

        // Lấy trip dữ liệu từ phần tử Card
        const trip = {
            id: cardElement.dataset.tripId,
            startLocation: cardElement.dataset.startLocation,
            endLocation: cardElement.dataset.endLocation,
            startDate: cardElement.dataset.startDate,
            endDate: cardElement.dataset.endDate,
        };

        const handleBookTripMock = vi.fn();

        // Mô phỏng nhấn nút "Book Now"
        fireEvent.click(bookNowButton, { trip });
        // Kiểm tra xem Modal.confirm đã được gọi với tham số đúng
        expect(modalConfirmMock).toHaveBeenCalled();
        expect(modalConfirmMock).toHaveBeenCalledWith(expect.objectContaining({
            title: expect.any(String),  // Kiểm tra rằng title là một chuỗi
            content: expect.any(String), // Kiểm tra content là chuỗi
        }));

        // Giả lập nhấn OK trong Modal.confirm
        await act(async () => {
            modalConfirmMock.mock.calls[0][0].onOk();
        });

        expect(window.location.pathname).toEqual("/book-status");

    });

});
