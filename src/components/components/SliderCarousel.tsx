import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { useBlockchainContext } from '../../context';

const NewNotable = () => {
    const navigate = useNavigate();
    const [state] = useBlockchainContext() as any;
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 1,
        adaptiveHeight: 400,
        responsive: [
            {
                breakpoint: 1900,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 2,
                    dots: true
                }
            }
        ]
    };

    const handle = (address: any) => {
        navigate(`/collection/${address}`);
    };

    return (
        <div className="nft-big">
            <Slider /* {...settings} */>
                {(state as any).collectionNFT.slice(-5).map((item: any, index: any) => (
                    <div /* index={index + 1} */ key={index}>
                        <div className="nft_pic" onClick={() => handle(item.address)}>
                            <span>
                                <span className="nft_pic_info">
                                    <span className="nft_pic_title">{item.metadata.name}</span>
                                    <span className="nft_pic_by">
                                        {item.items.length + ' items'}
                                    </span>
                                </span>
                            </span>
                            <div className="nft_pic_wrap">
                                <img
                                    src={item.metadata.coverImage}
                                    className="lazy img-fluid"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default NewNotable;

