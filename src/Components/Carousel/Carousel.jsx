import { Carousel } from 'antd';
import { useState } from 'react';

function Carousels() {
    const contentList = [
        {
            title: 'Japna Buy Trip',
            indx: 0,
        },
        {
            title: 'Hello',
            indx: 1,
        },
        {
            title: 'hello3',
            indx: 2,
        }
    ];

    const heightSlide = '60vh';
    const urlPicBackGround = './src/image/KoiFish.jpg';

    const contentStyle = {
        height: heightSlide,
        lineHeight: heightSlide,

        color: 'var(--purple5)',
        fontSize: '3em',
        textShadow: '0 0 5px rgba(1, 0, 0, 1)',

        textAlign: 'center',
        backgroundImage: `url(${urlPicBackGround})`,

        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(10px) saturate(200%)',
    };

    return (
        <div style={{ height: heightSlide }}>
            <Carousel
                startIndex={0}
                autoplaySpeed={4000}
                autoplay
                arrows
            >   {
                    contentList.map((content, indx) => (
                        <div key={indx}>
                            <h3 style={contentStyle}>
                                <span>{content.title}</span>
                            </h3>
                        </div>
                    ))
                }
            </Carousel>
        </div>
    );
}

export default Carousels;

