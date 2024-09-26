import { Card, List} from 'antd';
import { useNavigate } from 'react-router-dom';

function Cards() {

    const navigate = useNavigate();

    const dataList = [
        {
            title: 'Card title',
            description: 'This is the description.',
            img : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        },
        {
            title: 'Card title 2',
            description: 'This is the description.',
            img : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        },
        {
            title: 'Card title 3',
            description: 'This is the description.',
            img : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        },
        {
            title: 'Card title 4',
            description: 'This is the description.',
            img : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        },
        {
            title: 'Card title 4',
            description: 'This is the description.',
            img : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        },
        {
            title: 'Card title 4',
            description: 'This is the description.',
            img : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        },
        {
            title: 'Card title 4',
            description: 'This is the description.',
            img : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        },
    ];
    return (
        <List
            grid={{
                gutter: 16,
                column: 4,
            }}
            dataSource={dataList}
            renderItem={(item) => (
                <List.Item>
                    <Card
                        title={item.title}
                        style={{
                            width: '100%', 
                            maxWidth: '15rem', 
                            minHeight: '15rem',
                            margin: '0 auto',
                        }}
                        headStyle={{
                            textAlign: 'center'
                        }}
                        cover={
                            <img alt={item.title} src={item.img} className="card-cover" />
                        }
                        hoverable={true}
                    >
                        <p style={{ textAlign: 'center' }}>{item.description}</p>
                    </Card>
                </List.Item>
            )}
        />
    );
}

export default Cards;


