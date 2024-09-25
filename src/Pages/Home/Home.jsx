import './Home.css';
import Header from "../../Components/Header/Header";
import MyTables from "../../Components/Table/Tables";
import Carousels from "../../Components/Carousel/Carousel";
import Footers from "../../Components/Footer/Footers";

import { Space, Divider } from 'antd';
import Cards from "../../Components/Cards/Cards";
// import ContentCard from "../../Components/Content/ContentCard";


function Home() {

    const token = localStorage.getItem("token");

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

                <Divider orientation="left" style={{ margin: '20px 0', fontSize: '25px' }}>Famous Farm</Divider>
                <Cards title="" />

                <Divider orientation="left" style={{ margin: '20px 0', fontSize: '25px' }}>Koi Farm</Divider>
                <Cards title="" />

                <Divider orientation="left" style={{ margin: '20px 0', fontSize: '25px' }}>Famous Table</Divider>
                <MyTables />
            </Space>
            <Footers style={{ marginTop: '20px' }} />
        </>
    );
}

export default Home;