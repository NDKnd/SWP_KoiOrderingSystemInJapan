import "./Home.css";
import Header from "../../Components/Header/Header";
import MyTables from "../../Components/Table/Tables";
import Carousels from "../../Components/Carousel/Carousel";
import Footers from "../../Components/Footer/Footers";
import { Divider, Layout } from "antd";
import ContentCard from "../../Components/Content/ContentCard";
import api from "./../../services/axios";
import { useEffect, useState } from "react";

function Home() {
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
            titleCard: Sths.name, // tên của farm
            description: Sths.description, // mô tả của farm
            img: Sths.imageURL, // hình ảnh của farm
          })),
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(); // Thực hiện gọi hàm fetchData khi trang được load
  }, []); // Mảng phụ thuộc rỗng để gọi fetchData chỉ một lần khi trang load
  console.log(ListData);

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
    <Layout>
      <Header />
      <Layout style={{ padding: "5px 24px 24px" }}>
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
      </Layout>
      <Footers style={{ marginTop: "20px" }} />
    </Layout>
  );
}

export default Home;
