import Headers from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footers";
import { Space } from "antd";

function KoiPageFind() {
  return (
    <>
      <Headers />
      <Space
        direction="vertical"
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "30px",
          backgroundColor: "var(--purple5)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      ></Space>
      <Footer />
    </>
  );
}

export default KoiPageFind;
