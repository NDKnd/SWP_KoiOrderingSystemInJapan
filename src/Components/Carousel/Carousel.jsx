import { Carousel } from "antd";
import { useNavigate } from "react-router-dom";

function Carousels() {
  const navigate = useNavigate();

  const contentList = [
    {
      title: "Koi",
      image: "https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/Carousel%2FCnP_30102024_214858.png?alt=media&token=18dbe326-b903-4ae8-898f-5c90d3bebeaf",
      index: 0,
      path: "KoiPageFind",
    },
    {
      title: "Farm",
      image: "https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/Carousel%2FCnP_30102024_215153.png?alt=media&token=3d94e1b9-bbb5-4bc1-ba2f-6e8835003417",
      index: 1,
      path: "FarmFindPage",
    },
    {
      title: "Trip",
      image: "https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/Carousel%2FCnP_30102024_215238.png?alt=media&token=e1529215-d8fe-4647-877a-ac6c32dffe29",
      index: 2,
      path: "TripPage",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const heightSlide = "60vh";

  return (
    <div style={{ height: heightSlide }}>
      <Carousel autoplay fade autoplaySpeed={4000}>
        {contentList.map((content, index) => (
          <div key={index} style={{ position: "relative", height: heightSlide, cursor: "pointer" }} onClick={() => handleNavigation(content.path)}>
            <div
              style={{
                height: heightSlide,
                lineHeight: heightSlide,
                color: "white",
                fontSize: "3em",
                textShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
                textAlign: "center",
                backgroundImage: `url(${content.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>{content.title}</span>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Carousels;
