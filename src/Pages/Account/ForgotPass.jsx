import { FaEnvelope } from "react-icons/fa";

import styles from "./Forgot.module.css";
import { Button, Form, Input, message } from "antd";
import api from "../../services/axios";
import { Navigate, useNavigate } from "react-router-dom";

function ForgotPass() {
  const navigate = useNavigate();
  const handleForgot = (values) => {
    try {
      console.log("Email: ", values.email);
      const res = api.post("forgot-password", { email: values.email });
      console.log("res: ", res);
      message.success("Email sent successfully");
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      navigate("/");
    }
  };

  return (
    <div className={styles.body}>
      <Form className={styles.form} onFinish={handleForgot}>
        <h1 className={styles.title}>Forgot Password</h1>
        <Form.Item name="email">
          <Input
            className={styles.input}
            prefix={<FaEnvelope />}
            placeholder="Enter your email"
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

export default ForgotPass;
