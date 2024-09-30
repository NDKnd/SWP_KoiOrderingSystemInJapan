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
  // Gọi API từ backend khi component được mount
  const [dataCard, setListDataCard] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("Koi");
        console.log(res.data);
        setListDataCard(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // const listTest = {
  //   title: "List Farm",
  //   datalistTest: [
  //     {
  //       titleCard: "Card title 1",
  //       description: "This is the description.",
  //       img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  //     },
  //     {
  //       titleCard: "Card title 2",
  //       description: "This is the description.",
  //       img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  //     },
  //     {
  //       titleCard: "Card title 3",
  //       description: "This is the description.",
  //       img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  //     },
  //   ],
  // };

  return (
    <Layout>
      <Header />
      <Layout style={{ padding: "5px 24px 24px" }}>
        <Carousels />

        <ContentCard title="List Farm" dataList={dataCard} />

        <ContentCard title="List Koi" dataList={dataCard} />

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
