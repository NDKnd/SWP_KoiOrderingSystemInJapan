import { Carousel } from 'antd';

function Carousels() {

    const heightSlide = '40vh';
    const urlPicBackGround = './src/image/KoiFish.jpg';

    const contentStyle = {
        height: heightSlide,
        lineHeight: heightSlide,
        color: 'var(--purple5)',
        textAlign: 'center',
        backgroundImage: `url(${urlPicBackGround})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div style={{ height: heightSlide }}>
            <Carousel
                autoplaySpeed={4000}
                autoplay
                arrows
            >
                <div>
                    <h3 style={contentStyle}>
                        <span>p</span>
                    </h3>
                </div>
                <div>
                    <h3 style={contentStyle}>

                        <span>Hello2</span>

                    </h3>
                </div>
                <div>
                    <h3 style={contentStyle}>

                        <span>hello3</span>

                    </h3>
                </div>
            </Carousel>
        </div>
    );
}

export default Carousels;
