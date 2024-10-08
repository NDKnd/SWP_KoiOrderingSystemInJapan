import React, { useEffect, useState } from "react";
import styles from "./FarmFindPage.module.css";
import { Button, Card, Layout, message, Row } from "antd";
import Header from "../../Components/Header/Header";
import Footers from "../../Components/Footer/Footers";
import api from "../../services/axios";

const { Content } = Layout;

function FarmFindPage() {
  const [farmList, setFarmList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("farm");
        console.log(response.data);
        setFarmList(response.data);
      } catch (error) {
        message.error(error.response);
        console.log(error);
      }
    };
    fetchData();
  }, []);

  //   const handleBooking = (farm) => {};

  return (
    <Layout>
      <Header />
      <Content className={styles.layout}>
        <div>
          {farmList.map((farm) => (
            <>
              <Row gutter={[16, 16]}>
                <Card
                  key={farm.id}
                  className={styles.farmCard}
                  hoverable
                  cover={
                    <img
                      alt="example"
                      src={farm.image}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  }
                >
                  <Card.Meta
                    title={farm.name}
                    description={farm.description}
                  ></Card.Meta>
                  <Button type="primary">Booking</Button>
                </Card>
              </Row>
            </>
          ))}
        </div>
      </Content>
      <Footers />
    </Layout>
  );
}

export default FarmFindPage;
