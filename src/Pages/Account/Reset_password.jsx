// import api from "../../services/axios";
import { Button, Form, Input, message } from "antd";
import { FaLock, FaArrowAltCircleLeft } from "react-icons/fa";
import styles from "./Reset_password.module.css";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";

function Reset_password() {
  const navigate = useNavigate();

  // Lấy URL trên thanh tìm kiếm
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  localStorage.setItem("token", token);
  console.log("Token: ", token);

  const handleReset = async (values) => {
    try {
      console.log("values: ", values);

      // Gọi API để đặt lại mật khẩu
      const response = await api.post("reset-password", {
        password: values.confirm_password.trim(),
      });
      console.log("Response: ", response);
      message.success("Password reset successfully");
    } catch (error) {
      console.error("Error: ", error.response?.data || error.message);
      message.error(
        error.response?.data?.message || "Failed to reset password"
      );
    } finally {
      localStorage.removeItem("token");
      if (!localStorage.getItem("token")) {
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    }
  };

  return (
    <div className={styles.body}>
      <button onClick={() => navigate("/login")} className="back_home_btn">
        <FaArrowAltCircleLeft className="icon" />
      </button>
      <Form className={styles.form} onFinish={handleReset}>
        <h1 className={styles.title}>Reset Password</h1>
        <Form.Item
          name="new_password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            className={styles.input}
            prefix={<FaLock />}
            placeholder="Enter your password"
            id="new_password"
          />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  // console.log("resolve:", Promise.resolve());
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
          dependencies={["new_password"]}
        >
          <Input.Password
            className={styles.input}
            prefix={<FaLock />}
            placeholder="Confirm your password"
            id="confirm_password"
          />
        </Form.Item>
        <Form.Item>
          <Button className={styles.button} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Reset_password;
