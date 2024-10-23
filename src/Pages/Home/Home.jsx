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
  // const [dataCard, setListDataCard] = useState([]);

  // const [FarmList, setFarmList] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await api.get("farm");
  //       console.log(res.data);
  //       setFarmList(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await api.get("Koi");
  //       console.log(res.data);
  //       setListDataCard(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  console.log("token", localStorage.getItem("token"));

  return (
    <Layout>
      <Header />
      <Layout style={{ padding: "5px 24px 24px" }}>
        <Carousels />

        {/* <ContentCard title="List Farm" dataList={dataCard} /> */}
        {/* for 2 type of list : "koi" and "farm" */}
        {/* <ContentCard title="List Farms" dataList={FarmList} typeList="koi" /> */}

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
