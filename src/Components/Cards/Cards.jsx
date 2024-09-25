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
                        style={{width: 300, margin: '0 auto'}}
                        cover={
                            <img alt={item.title} src={item.img} />
                        }
                        hoverable={true}
                    >
                        <p>{item.description}</p>
                    </Card>
                </List.Item>
            )}
        />
    );
}

export default Cards;


