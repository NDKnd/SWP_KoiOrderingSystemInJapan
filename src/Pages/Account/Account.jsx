import { useEffect } from "react";
import api from "../../services/axios";
import { Space } from "antd";
import axios from "axios";

function Account() {
  const fetchData = async () => {
    const res = await axios.post(api);

    console.log(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Space></Space>
    </>
  );
}

export default Account;
