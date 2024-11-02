import {
  Button,
  Divider,
  ConfigProvider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Col,
  Avatar,
} from "antd";
import { useEffect, useState, navigate } from "react";
import api from "../../services/axios";
import styles from "./account.module.css";

function Account_profile() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [visible, setVisible] = useState(false);

  const updateProfile = async (values) => {
    try {
      const formData = {
        profile: values.profile.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        address: values.address.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
      };
      console.log("formData: ", formData);
      const res = await api.put(`${user.id}`, formData);
      console.log("res: ", res.data);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      message.success("Update profile successfully");
    } catch (error) {
      console.log("Error: ", error?.message?.data || error);
      message.error(error?.message?.data || "Failed to update profile");
    } finally {
      setVisible(false);
    }
  };

  const listContent = [
    { label: "First name", content: user?.firstName || "N/A" },
    { label: "Last name", content: user?.lastName || "N/A" },
    { label: "Email", content: user?.email || "N/A" },
    { label: "Phone", content: user?.phone || "N/A" },
    { label: "Address", content: user?.address || "N/A" },
    { label: "Profile", content: user?.profile || "N/A" },
  ];

  return (
    <div className={styles.account_profile}>
      <Divider>Profile</Divider>
      <div className={styles.account_profile_content}>
        <div className={styles.account_profile_content_avatar}>
          <img
            className={styles.account_profile_content_avatar_img}
            src="https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/defAvatar%2Fkoi-4371460.svg?alt=media&token=e7c71b00-3b9f-4b54-af1f-4e4d580f6877"
          />
        </div>
        {listContent.map((item, index) => (
          <div className={styles.account_profile_content_details} key={index}>
            <div className={styles.account_profile_content_label}>
              <span>{item.label}: </span>
            </div>
            <div className={styles.account_profile_content_content}>
              {item.content !== "N/A" ? (
                item.content
              ) : (
                <span style={{ color: "rgba(0, 0, 0, 0.25)" }}>
                  {item.content}
                </span>
              )}
            </div>
          </div>
        ))}

        <div className={styles.account_profile_content_button}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "var(--purple1)",
              },
            }}
          >
            <Button
              type="default"
              onClick={() => setVisible(true)}
            >
              Update Profile
            </Button>
          </ConfigProvider>
        </div>
      </div>

      <Modal
        title="Update profile"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          className={styles.account_profile_form}
          name="update-profile"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
          initialValues={{
            profile: user?.profile || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            address: user?.address || "",
            phone: user?.phone || "",
            email: user?.email || "",
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
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
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
      </Modal>
    </div>
  );
}

export default Account_profile;
