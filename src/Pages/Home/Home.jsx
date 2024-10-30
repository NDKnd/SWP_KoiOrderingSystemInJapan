import "./Home.css";
import Header from "../../Components/Header/Header";
import Carousels from "../../Components/Carousel/Carousel";
import Footers from "../../Components/Footer/Footers";
import { Card, Col, Layout, Row } from "antd";
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
      <Carousels />
      <Layout style={{ padding: "24px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} md={12}>
            <Card className="info-card">
              <p>
                Welcome to the Koi Ordering System (KOS)! Explore and book trips
                to beautiful Koi farms in Japan, discover various Koi breeds, and
                experience the fascinating world of Koi fish culture.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card cover={<img alt="Introduction" className="fixed-height-image" src={"https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/HomePage%2FCnP_30102024_225431.png?alt=media&token=6f42ba5a-8d7f-464c-98c1-77bacd9088cd"} />}></Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} md={12}>
            <Card cover={<img alt="Purpose" className="fixed-height-image" src={"https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/HomePage%2FCnP_30102024_225516.png?alt=media&token=a905dfe1-f3d1-408e-b99f-206231ec28d7"} />}></Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="info-card">
              <p>
                The purpose of the Koi Ordering System is to provide a seamless
                platform for users to browse, search, and book trips to Koi farms
                in Japan. Users can create custom itineraries, manage bookings,
                and even purchase Koi fish to be shipped home as part of the
                experience.
              </p>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card className="info-card">
              <p>
                Our services include booking trips to renowned Koi farms, creating
                custom trip itineraries, managing booking processes, offering
                optional Koi fish purchasing services, and processing payments. We
                also provide a feedback and rating system to enhance customer
                experience.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card cover={<img alt="Service"  className="fixed-height-image" src={"https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/HomePage%2FCnP_30102024_225634.png?alt=media&token=5630ac78-a5d3-490f-a233-fda3ab55933f"} />}></Card>
          </Col>
        </Row>
      </Layout>
      <Footers style={{ marginTop: "20px" }} />
    </Layout>
  );
}

export default Home;
