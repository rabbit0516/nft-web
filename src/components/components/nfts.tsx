import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlockchainContext } from '../../context';
import InfiniteScroll from 'react-infinite-scroll-component';
import React from 'react';

interface Props {
    data: any
}

const NFTList = ({data}: Props) => {
    const navigate = useNavigate();
    const [state, { getCurrency }] = useBlockchainContext() as any;
    const [renderCount, setRenderCount] = useState(10);
    const [hasMore, setHasMore] = useState(false);

    const NFTs = useMemo(() => {
        if (!data) {
            return [];
        }
        let result = data.slice(0, renderCount);
        if (result.length === data.length) setHasMore(false);
        else setHasMore(true);
        return result;
    }, [data, renderCount]);

    const handleItem = (item: any) => {
        navigate(`/ItemDetail/${item.collectionAddress}/${item.tokenID}`);
    };

    return (
        <InfiniteScroll
            dataLength={NFTs.length}
            next={() => setRenderCount(renderCount + 10)}
            hasMore={hasMore}
            loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
            style={{ overflowX: 'hidden' }}>
            <div className="row">
                {NFTs.map((nft: any, index: any) => (
                    <div
                        key={index}
                        className="d-item col-2-5 col-lg-3 col-md-4 col-sm-6 col-xs-12"
                        onClick={() => handleItem(nft)}>
                        <div className="nft__item m-0">
                            <div className="nft__item_wrap">
                                <span>
                                    <img
                                        src={
                                            nft.metadata.image ||
                                            './img/collections/coll-item-3.jpg'
                                        }
                                        className="lazy nft__item_preview"
                                        alt=""
                                    />
                                    <div className="item__user__info">
                                        <button>
                                            {nft.owner.slice(0, 4) + '...' + nft.owner.slice(-4)}
                                        </button>

                                        <button>
                                            <i className="fa fa-heart-o"></i>
                                        </button>
                                    </div>
                                </span>
                            </div>
                            <div className="nft__item_info">
                                <div className="spacer-20"></div>
                                <span>
                                    <Link to={`/collection/${nft.collectionAddress}`}>
                                        {state.collectionNFT.map((item: any) => {
                                            if (item.address === nft.collectionAddress)
                                                return item.metadata.name;
                                        })}
                                    </Link>
                                </span>
                                <span>
                                    <h4>{nft.metadata.name || `#${nft.tokenID}`}</h4>
                                </span>
                                <div className="spacer-20"></div>
                                <hr />
                                <div className="spacer-10"></div>
                                <div className="nft__item_price">
                                    <span>
                                        {nft.marketdata.price === '' ? (
                                            <div className="spacer-20"></div>
                                        ) : (
                                            nft.marketdata.price +
                                            ' ' +
                                            getCurrency(nft.marketdata.acceptedToken)?.label
                                        )}
                                    </span>

                                    {nft.marketdata.price !== '' ? (
                                        <button>Buy Now</button>
                                    ) : (
                                        <button>Detail</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    );
}

export default NFTList