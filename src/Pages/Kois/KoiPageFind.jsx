import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";


function KoiPageFind() {

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
            </Space>
            <Footer />
        </>
    );
}