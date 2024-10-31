import { Col, Row } from "antd";
import { Footer } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

function Footers() {
    return (
        <Footer style={{ textAlign: 'center', backgroundColor: "gray" }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <h2>Contact for any issues/questions</h2>
                    <Link to={"https://zalo.me/g/kfbwen136"}>
                        <img style={{height: "100px"}} src="https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/HomePage%2FCnP_31102024_210550.png?alt=media&token=94ce9c9f-7ddc-4d1d-9d11-08cea0bbf880"/>
                    </Link>
                </Col>
                <Col xs={24} md={12}>
                    Ant Design ©2022 Created by Ant UED
                </Col>
            </Row>
        </Footer>
    );
}

export default Footers;