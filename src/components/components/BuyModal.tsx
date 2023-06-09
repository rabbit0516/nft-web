import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { useWallet } from 'use-wallet';
import { toast } from 'react-toastify';
import { useBlockchainContext } from '../../context';

const DateTimeField = require('@1stquad/react-bootstrap-datetimepicker')

interface Props {
    show: any
    setShow: any 
    correctItem: any
}

const BuyModal = ({show, setShow, correctItem}: Props) => {
    const wallet = useWallet();
    const [state, { bidNFT, translateLang }] = useBlockchainContext() as any;
    const [price, setPrice] = useState(0);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handle = (newDate: any) => {
        setDate(newDate);
    };

    const handleBid = async () => {
        if (!state.signer) {
            wallet.connect();
            return;
        }
        try {
            if (!moment(date).isValid()) {
                return;
            }
            if (price < Number(correctItem?.marketdata.bidPrice)) {
                // NotificationManager.warning(translateLang('increasebid_warn'));
                toast(translateLang('increasebid_warn'), {position: "top-right", autoClose: 2000})
                return;
            }

            setLoading(true);
            await bidNFT({
                nftAddress: correctItem?.collectionAddress,
                assetId: correctItem?.tokenID,
                price: price,
                acceptedToken: correctItem?.marketdata.acceptedToken,
                expiresAt: moment(date).valueOf()
            });
            // NotificationManager.success(translateLang('bid_success'));
            toast(translateLang('bid_success'), {position: "top-right", autoClose: 2000})
            setLoading(false);
            setShow(false);
        } catch (err: any) {
            console.log(err.message);
            // NotificationManager.error(translateLang('bid_error'));
            toast(translateLang('bid_error'), {position: "top-right", autoClose: 2000})
            setLoading(false);
        }
    };

    return (
        <Modal
            size="lg"
            show={show}
            onHide={() => setShow(false)}
            contentClassName="add-modal-content"
            centered>
            <Modal.Header>
                <Modal.Title>{translateLang('btn_makeoffer')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span className="spacer-single"></span>
                <p className="text-center">{translateLang('bidnote')}</p>
                <h5>{translateLang('sellprice')}</h5>
                <div className="price">
                    <div
                        className="form-control"
                        style={{
                            flex: '1 1 0'
                        }}>
                        <span>{'FTM'}</span>
                    </div>
                    <input
                        type="number"
                        name="item_price"
                        id="item_price"
                        className="form-control"
                        style={{
                            flex: '4 4 0'
                        }}
                        placeholder="Amount"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value) || 0)}
                    />
                </div>
                <div className="spacer-30"></div>

                <h5>{translateLang('offerexpiration')}</h5>
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
                <div className="spacer-20"></div>
            </Modal.Body>
            <Modal.Footer>
                <div className="spacer-10"></div>
                {loading ? (
                    <button className="btn-main">
                        <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"></span>
                    </button>
                ) : (
                    <button className="btn-main" onClick={handleBid}>
                        {translateLang('btn_makeoffer')}
                    </button>
                )}
                <div className="spacer-10"></div>
            </Modal.Footer>
        </Modal>
    );
}

export default BuyModal