import { Form } from "antd";
import { useState } from "react";

function Account_profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const updateProfile = (values) => {
    console.log(values);
  };

  return (
    <>
      <h1>Welcome {user.email}</h1>
      {isModalVisible && <h1>Update Profile</h1>}
    </>
  );
}

export default Account_profile;
