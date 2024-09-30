import { Divider, Row, Col, Card, Typography, Button, Pagination } from "antd";
import PropTypes from "prop-types";
// import { useState } from "react";

// Import các thành phần cần thiết từ antd
const { Title, Paragraph } = Typography;

function ContentCard({
  title = "Default",
  dataList = [
    {
      titleCard: "Default Card",
      description: "This is the default description for the card.",
      img: "https://source.unsplash.com/random/200x300",
    },
  ],
}) {
  const currentData = dataList.slice(0, 6);
  return (
    <>
      <Divider
        orientation="left"
        style={{ margin: "20px 0", fontSize: "25px" }}
      >
        {title}
      </Divider>
      <Row gutter={[16, 16]}>
        {currentData.map((item, index) => (
          <Col span={8} key={index}>
            <Card
              className="cust-card"
              hoverable
              cover={
                <div
                  style={{
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.titleCard}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              }
            >
              <Title level={4}>{item.titleCard}</Title>
              <Paragraph>{item.description}</Paragraph>
              <Button
                type="primary"
                style={{ margin: "0 auto", display: "block" }}
              >
                Order
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

ContentCard.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.arrayOf(
    PropTypes.shape({
      titleCard: PropTypes.string,
      description: PropTypes.string,
      img: PropTypes.string,
    }).isRequired
  ),
};

export default ContentCard;
