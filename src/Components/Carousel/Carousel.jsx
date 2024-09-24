import { Carousel } from 'antd';

function Carousels() {

    const heigtSlide = '300px';

    const contentStyle = {
        height: {heigtSlide},
        color: '#fff',
        lineHeight: {heigtSlide},
        textAlign: 'center',
        background: '#364d79',
    };

    return (
        <div style={{height: {heigtSlide}}}>
            <Carousel
                pauseOnHover
                autoplaySpeed={4000}
                autoplay
                arrows
            >
                <div>
                    <h3 style={contentStyle}>
                        <img src="./src/image/KoiFish.jpg" alt="" />
                    </h3>
                </div>
                <div>
                    <h3 style={contentStyle}>
                        haha
                    </h3>
                </div>
                <div>
                    <h3 style={contentStyle}>
                        heelo
                    </h3>
                </div>
            </Carousel>
        </div>
    );
}

export default Carousels;
