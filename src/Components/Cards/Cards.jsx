import { Card, List, Row, Col, Popover } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Cards.css';

function Cards(props) {

    const navigate = useNavigate();

    const dataListCards = props.dataListCards || {};

    return (
        <List
            grid={{
                gutter: 16,
                column: 3,
            }}
            dataSource={dataListCards}
            renderItem={(item) => (
                <List.Item>
                    <Card
                        className='cust-card'
                        style={{
                            width: '25rem',
                            height: '6rem',
                            margin: '0 auto',
                        }}
                        hoverable
                    >
                        <Row>
                            <Col span={9}>
                                <img src={item.img} 
                                style={{objectFit: 'cover', width: '100%', height: '100%', }} 
                                />
                            </Col>
                            <Col span={15}>
                                <div style={{ padding: '1em' }}>
                                    <h3>{item.titleCard}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </List.Item>
            )}
        />
    );
}


Cards.defaultProps = {
    title: 'Default',
    dataListCards: [
        {
            titleCard: 'Card title hehe',
            description: 'This is the description.',
            img: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        },
    ],
};

export default Cards;

