import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { useBlockchainContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import Action from '../../service';
import { toBigNum } from '../../utils';
import { toast } from 'react-toastify';

const DateTimeField = require('@1stquad/react-bootstrap-datetimepicker')

interface Props {
    id: any 
    collection: any
}

export default function Responsive({id, collection}: Props) {
    const navigate = useNavigate();
    const [state, { onsaleNFT, onsaleLazyNFT, translateLang, approveNFT, checkNFTApprove }] =
        useBlockchainContext() as any;
    const [correctCollection, setCorrectCollection] = useState<any>(null);
    const [price, setPrice] = useState('');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [approveFlag, setApproveFlag] = useState(false);
    const [currency, setCurrency] = useState(state.currencies[0].value);

    useEffect(() => {
        const initialDate = new Date();
        initialDate.setDate(initialDate.getDate() + 10);
        setDate(initialDate);
    }, []);

    useEffect(() => {
        (async () => {
            setApproveFlag(correctCollection?.isOffchain);
            if (correctCollection !== null && !correctCollection.isOffchain) {
                const validation = await checkNFTApprove({
                    assetId: correctCollection.tokenID,
                    nftAddress: collection
                });
                setApproveFlag(validation);
            }
        })();
    }, [correctCollection]);

    useEffect(() => {
        for (let i = 0; i < state.collectionNFT.length; i++) {
            if (state.collectionNFT[i].address === collection) {
                var itemData = state.collectionNFT[i].items.find((item: any) => item.tokenID === id);
                if (!itemData) navigate('/Auction');
                else setCorrectCollection(itemData);
                break;
            }
        }
    }, [state.collectionNFT]);

    const handle = (newDate: any) => {
        setDate(newDate);
    };

    const handlelist = async () => {
        if (price === '') return;
        if (!moment(date).isValid()) return;

        try {
            setLoading(true);
            if (!correctCollection.isOffchain) {
                let txOnSale = await onsaleNFT({
                    nftAddress: collection,
                    assetId: correctCollection.tokenID,
                    currency: currency,
                    price: price,
                    expiresAt: moment(date).valueOf()
                });

                if (txOnSale) {
                    // NotificationManager.success(translateLang('listing_success'));
                    toast(translateLang('listing_success'), {position: "top-right", autoClose: 2000})
                    navigate('/explore');
                } else {
                    // NotificationManager.error(translateLang('listingerror'));
                    toast(translateLang('listingerror'), {position: "top-right", autoClose: 2000})
                }
                setLoading(false);
            } else {
                const lazyAction = await Action.lazy_onsale({
                    nftAddress: collection,
                    assetId: correctCollection.tokenID,
                    currency: currency,
                    priceGwei: toBigNum(price, 18),
                    expiresAt: moment(date).valueOf()
                });

                if (!lazyAction.success) {
                    setLoading(false);
                    // NotificationManager.error(translateLang('listingerror'));
                    toast(translateLang('listingerror'), {position: "top-right", autoClose: 2000})
                    return;
                }

                let txOnSale = await onsaleLazyNFT({
                    tokenId: correctCollection.tokenID,
                    priceGwei: toBigNum(price, 18),
                    expiresAt: moment(date).valueOf(),
                    singature: lazyAction.result
                });

                if (txOnSale) {
                    // NotificationManager.success(translateLang('listing_success'));
                    toast(translateLang('listing_success'), {position: "top-right", autoClose: 2000})
                    navigate('/explore');
                } else {
                    // NotificationManager.error(translateLang('listingerror'));
                    toast(translateLang('listingerror'), {position: "top-right", autoClose: 2000})
                }
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            // NotificationManager.error(translateLang('operation_error'));
            toast(translateLang('operation_error'), {position: "top-right", autoClose: 2000})
        }
    };

    const handleApprove = async () => {
        setLoading(true);
        let txOnSale = await approveNFT({
            nftAddress: collection,
            assetId: correctCollection.tokenID
        });

        if (txOnSale) {
            // NotificationManager.success('Successfully Approve');
            toast('Successfully Approve', {position: "top-right", autoClose: 2000})
            setApproveFlag(true);
        } else {
            // NotificationManager.error('Failed Approve');
            toast('Failed Approve', {position: "top-right", autoClose: 2000})
        }
        setLoading(false);
    };

    return (
        <>
            <section className="container" style={{ paddingTop: '20px' }}>
                {correctCollection === null ? (
                    'Loading...'
                ) : (
                    <div className="row">
                        <div className="col-lg-7 offset-lg-1 mb-5">
                            <div id="form-create-item" className="form-border">
                                <div className="field-set">
                                    <div>
                                        <h5>{translateLang('method')}</h5>
                                        <p
                                            className="form-control"
                                            style={{
                                                boxShadow: '0 0 5 0 #d05e3c',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}>
                                            <i
                                                className="arrow_right-up"
                                                style={{
                                                    fontWeight: 'bolder'
                                                }}
                                            />
                                            <span>{translateLang('sellnote')}</span>
                                        </p>
                                        <div className="spacer-single"></div>
                                        <h5>{translateLang('sellprice')}</h5>
                                        <div className="price">
                                            <div
                                                style={{
                                                    flex: '1 1 0'
                                                }}>
                                                <select
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        setCurrency(e.target.value);
                                                    }}>
                                                    {state.currencies.map((currency: any, index: any) => (
                                                        <option value={currency.value} key={index}>
                                                            {currency.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <input
                                                type="number"
                                                name="item_price"
                                                id="item_price"
                                                className="form-control"
                                                style={{
                                                    flex: '4 4 0'
                                                }}
                                                placeholder={translateLang('amount')}
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="spacer-30"></div>
                                        <h5>{translateLang('expiredate')}</h5>
                                        <DateTimeField
                                            dateTime={date}
                                            onChange={handle}
                                            mode={'datetime'}
                                            format={'MM/DD/YYYY hh:mm A'}
                                            inputFormat={'DD/MM/YYYY hh:mm A'}
                                            minDate={new Date()}
                                            showToday={true}
                                            startOfWeek={'week'}
                                            readonly
                                        />
                                    </div>

                                    <div className="spacer-20"></div>
                                    <h5>{translateLang('fees')}</h5>
                                    <div className="fee">
                                        <p>{translateLang('servicefee')}</p>
                                        <p>0%</p>
                                    </div>

                                    <div className="spacer-40"></div>
                                    {loading ? (
                                        <button className="btn-main">
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                aria-hidden="true"></span>
                                        </button>
                                    ) : approveFlag || correctCollection.isOffchain ? (
                                        <button
                                            className="btn-main"
                                            disabled={
                                                price === '' || !moment(date).isValid()
                                                    ? true
                                                    : false
                                            }
                                            onClick={handlelist}>
                                            {translateLang('btn_completelisting')}
                                        </button>
                                    ) : (
                                        <button className="btn-main" onClick={handleApprove}>
                                            {'Approve'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-2-5 col-sm-12 col-xs-12">
                            <div style={{ position: 'sticky', top: '162px' }}>
                                <h5>{translateLang('previewitem')}</h5>
                                <div className="nft__item m-0">
                                    <div className="author_list_pp"></div>
                                    <div className="nft__item_wrap">
                                        <span>
                                            <img
                                                src={
                                                    correctCollection.metadata.image ||
                                                    '../../img/collections/coll-item-3.jpg'
                                                }
                                                id="get_file_2"
                                                className="lazy nft__item_preview"
                                                alt=""
                                            />
                                        </span>
                                    </div>
                                    <div className="nft__item_info">
                                        <div className="sell_preview">
                                            <div>
                                                <p>
                                                    {correctCollection?.metadata?.name.length > 15
                                                        ? correctCollection.metadata?.name.slice(
                                                              0,
                                                              15
                                                          ) + '...'
                                                        : correctCollection.metadata?.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    {price === ''
                                                        ? '0  FTM'
                                                        : price?.length > 15
                                                        ? price.slice(0, 15) + '...' + '  FTM'
                                                        : price + '  FTM'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}
