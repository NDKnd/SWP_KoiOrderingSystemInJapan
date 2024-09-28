import "./Home.css";
import Header from "../../Components/Header/Header";
import MyTables from "../../Components/Table/Tables";
import Carousels from "../../Components/Carousel/Carousel";
import Footers from "../../Components/Footer/Footers";
import { Space, Divider } from "antd";
import ContentCard from "../../Components/Content/ContentCard";
import api from "./../../services/axios";
import { useEffect, useState } from "react";

function Home() {
  // for getting user token

  const [ListData, setListData] = useState({
    title: "List Farm",
    datalistTest: [],
  });

  // Gọi API từ backend khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/something"); // Gọi API tới endpoint '/gì gì đó'
        const somethingListData = res.data; // Dữ liệu trả về từ API

        // Cập nhật state của ListData với dữ liệu mới của backend
        setListData({
          title: "List of SomeThing",
          datalistTest: somethingListData.map((Sths) => ({
            // dãy thông tin của gì đó
            //example
            titleCard: farm.name, // tên của farm
            description: farm.description, // mô tả của farm
            img: farm.imageURL, // hình ảnh của farm
          })),
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(); // Thực hiện gọi hàm fetchData khi trang được load
  }, []); // Mảng phụ thuộc rỗng để gọi fetchData chỉ một lần khi trang load

  const listTest = {
    title: "List Farm",
    datalistTest: [
      {
        titleCard: "Card title 1",
        description: "This is the description.",
        img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      },
      {
        titleCard: "Card title 2",
        description: "This is the description.",
        img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      },
      {
        titleCard: "Card title 3",
        description: "This is the description.",
        img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      },
    ],
  };

  return (
    <>
      <Header />
      <Space
        direction="vertical"
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "30px",
          backgroundColor: "var(--purple5)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Carousels />

        <ContentCard title={listTest.title} dataList={listTest.datalistTest} />

        <ContentCard title={listTest.title} dataList={listTest.datalistTest} />

        <Divider
          orientation="left"
          style={{ margin: "20px 0", fontSize: "25px" }}
        >
          Famous Table
        </Divider>
        <MyTables />
      </Space>
      <Footers style={{ marginTop: "20px" }} />
    </>
  );
}

export default Home;
