import { Button, Divider, ConfigProvider, Form, Input, message } from "antd";
import { useEffect, useState, navigate } from "react";
import api from "../../services/axios";
import styles from "./account.module.css";

function Account_profile() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("token: ", token);
  console.log("user: ", user);

  const [lastestUser, setLastestUser] = useState({});
  console.log("lastestUser: ", lastestUser);

  const updateProfile = (values) => {
    try {
      const formData = {
        profile: values.profile,
        firstName: values.firstName,
        lastName: values.lastName,
        address: values.address,
        phone: values.phone,
        email: values.email,
      };
      console.log("formData: ", formData);
      const res = api.put(`${user.id}`, formData);
      console.log("res: ", res.data);
      setLastestUser(res.data);
      message.success("Update profile successfully");
    } catch (error) {
      message.error(error.message.data);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`${user.id}`);
        console.log("res: ", res.data);
        
        setLastestUser();
      } catch (error) {
        console.log(error.message.data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className={styles.account_profile}>
      <Divider>Profile</Divider>
      <Form
        className={styles.account_profile_form}
        name="update-profile"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        initialValues={{
          profile: lastestUser.profile,
          firstName: lastestUser.firstName,
          lastName: lastestUser.lastName,
          address: lastestUser.address,
          phone: lastestUser.phone,
          email: lastestUser.email,
        }}
        onFinish={updateProfile}
        autoComplete="off"
        labelWrap
      >
        <Form.Item
          label="Profile"
          name="profile"
          rules={[{ required: true, message: "Please input your profile!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="First name"
          name="firstName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last name"
          name="lastName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 9, span: 15 }}>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: "var(--purple1)",
                  colorPrimaryHover: "var(--purple2)",
                },
              },
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className={styles.account_profile_form_button}
            >
              Update
            </Button>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Account_profile;
