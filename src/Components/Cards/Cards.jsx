import { Card, Row, Col, Button, Typography } from 'antd';
import './Cards.css';

const { Title, Paragraph } = Typography;

function Cards(props) {

  const dataListCards = props.dataListCards || [];

  return (
    <Row gutter={[16, 16]}>
      {dataListCards.map((item, index) => (
        <Col span={8} key={index}>
          <Card
          className='cust-card'
            hoverable
            cover={
              <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                  src={item.img} 
                  alt={item.titleCard} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            }
          >
            <Title level={4}>{item.titleCard}</Title>
            <Paragraph>{item.description}</Paragraph>
            <Button type="primary"  style={{ margin: '0 auto', display: 'block' }}>Order</Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

Cards.defaultProps = {
  title: 'Default',
  dataListCards: [
    {
      titleCard: 'Card title hehe',
      description: 'This is the description.',
      img: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    },
  ],
};

export default Cards;
