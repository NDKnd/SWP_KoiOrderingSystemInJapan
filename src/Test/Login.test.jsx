import { expect, describe, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginForm from '../Pages/Login/LoginForm.jsx';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

describe("Login Function", () => {

  it("should render LoginForm component correctly", () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    const element = screen.getAllByRole("heading", {
      level: 1
    });
    expect(element[0]).toBeInTheDocument();
  });


  it("Happy Case: Đăng nhập thành công với username và password đúng", async () => {
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

  it("Unhappy Case: Đăng nhập thất bại với username hoặc password sai", async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Đăng xuất trước khi chạy test
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Nhập username và password sai
    fireEvent.change(screen.getByTestId("username_login"), {
      target: { value: "WrongUsername" },
    });
    fireEvent.change(screen.getByTestId("password_login"), {
      target: { value: "WrongPassword" },
    });

    // Click nút đăng nhập
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Kiểm tra token không được lưu trữ trong localStorage
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull(); // token không lưu
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

});
