import './Home.css';
import Header from "../../Components/Header/Header";
import MyTables from "../../Components/Table/Tables";
import Carousels from "../../Components/Carousel/Carousel";
import Footers from "../../Components/Footer/Footers";

import { Space, Divider } from 'antd';
import Cards from "../../Components/Cards/Cards";
import ContentCard from "../../Components/Content/ContentCard";


function Home() {

    const token = localStorage.getItem("token");

    const listTest = 
        {
            title: 'List Farm',
            datalistTest: [
                {
                    titleCard: 'Card title 1',
                    description: 'This is the description.',
                    img: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
                },
                {
                    titleCard: 'Card title 2',
                    description: 'This is the description.',
                    img: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
                },
                {
                    titleCard: 'Card title 3',
                    description: 'This is the description.',
                    img: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
                }
            ],
        };

    return (
        <>
            <Header />
            <Space
                direction="vertical"
                size="large"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '30px',
                    backgroundColor: 'var(--purple5)',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Carousels />

                <ContentCard title={listTest.title} dataList={listTest.datalistTest} />

                <ContentCard title={listTest.title} dataList={listTest.datalistTest} />

                <Divider orientation="left" style={{ margin: '20px 0', fontSize: '25px' }}>Famous Table</Divider>
                <MyTables />
            </Space>
            <Footers style={{ marginTop: '20px' }} />
        </>
    );
}

export default Home;