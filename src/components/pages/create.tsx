import React, { useState, useEffect } from 'react';

import { FaDiscord } from 'react-icons/fa';

import Footer from '../menu/footer';
import Action from '../../service';
import { useBlockchainContext } from '../../context';
import Addresses from '../../contracts/contracts/addresses.json';
const { NotificationManager } = require('react-notifications');

export default function Createpage() {
    const [state, { mintNFT, translateLang }] = useBlockchainContext() as any;
    const [image, _setImage] = useState(null);
    const [selectedFile, setSeletedFile] = useState<any>(null);
    const [name, setName] = useState('');
    const [extLink1, setExtLink1] = useState('');
    const [extLink2, setExtLink2] = useState('');
    const [extLink3, setExtLink3] = useState('');
    const [extLink4, setExtLink4] = useState('');
    const [extLink5, setExtLink5] = useState('');
    const [desc, setDesc] = useState('');
    const [attrItem, setAttrItem] = useState<any>({ 0: { key: '', value: '' } });
    const [count, setCount] = useState(1);
    const [collections, setCollections] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [currentCollection, setCurrentCollection] = useState('');

    useEffect(() => {

        // setCollections([
        //     {
        //         name: state.collectionNFT[0]?.metadata?.name || '',
        //         owner: state.collectionNFT[0]?.address || ''
        //     }
        // ]);
        const data = [] as Array<{name: string, owner: string}>
        for (let i = 0; i < state.collectionNFT.length; i++) {
            if (state.collectionNFT[i].metadata.fee_recipent === state.auth.address) {
                data.push({
                    name: state.collectionNFT[i].metadata.name,
                    owner: state.collectionNFT[i].address
                });
                
            }
        }
        setCollections((state: any) => [...data]);
        setCurrentCollection(data[0]?.owner || '')
    }, [state]);

    const handleSubmit = async () => {
        try {
            if (!selectedFile) {
                NotificationManager.error(translateLang('chooseimage_error'));
                return;
            }
            if (selectedFile.size > 1024 * 1024 * 100) {
                NotificationManager.error(translateLang('bigfileupload_error'));
                return;
            }
            if (name.trim() === '') {
                NotificationManager.error(translateLang('fillname'));
                (document.getElementById('item_name') as any).focus();
                return;
            }
            for (let x in attrItem) {
                if (Object.keys(attrItem).length === 1) {
                    if (attrItem[x].key === '' && attrItem[x].value === '') {
                    } else {
                        if (attrItem[x].key === '' || attrItem[x].value === '') {
                            NotificationManager.error(translateLang('fillattribute'));
                            return;
                        }
                    }
                } else {
                    if (attrItem[x].key === '' || attrItem[x].value === '') {
                        NotificationManager.error(translateLang('fillattribute'));
                        return;
                    }
                }
            }
            setLoading(true);
            var formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('name', name);
            formData.append('extlink1', extLink1);
            formData.append('extlink2', extLink2);
            formData.append('extlink3', extLink3);
            formData.append('extlink4', extLink4);
            formData.append('extlink5', extLink5);
            formData.append('desc', desc);
            formData.append('attribute', JSON.stringify(attrItem));

            const uploadData = await Action.nft_mint(formData);
            if (uploadData.success) {
                await mintNFT(uploadData.url, currentCollection);
                NotificationManager.success(translateLang('imageupload_success'));
                reset();
            } else {
                NotificationManager.error(translateLang('uploadfail'));
            }
            setLoading(false);
        } catch (err: any) {
            console.log(err.code);
            if (err.code === 4001) {
                NotificationManager.error(translateLang('uploadreject'));
            } else if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
                NotificationManager.error(translateLang('checkBalance'));
            } else {
                NotificationManager.error(translateLang('operation_error'));
            }
            setLoading(false);
        }
    };

    const reset = () => {
        cleanup();
        _setImage(null);
        setSeletedFile(null);
        setName('');
        setExtLink1('');
        setExtLink2('');
        setExtLink3('');
        setExtLink4('');
        setDesc('');
        setCount(1);
        setAttrItem({ 0: { key: '', value: '' } });
    };

    const handleImgChange = async (event: any) => {
        if (image) {
            setImage(null);
            setSeletedFile(null);
        }
        const newImage = event.target?.files?.[0];
        if (newImage) {
            try {
                setImage(URL.createObjectURL(newImage));
                setSeletedFile(newImage);
            } catch (err) {
                console.log(err);
                NotificationManager.error(translateLang('imageloading_error'));
            }
        }
    };

    const handleCollectionChange = async (e: any) => {
        setCurrentCollection(e.target.value);
    };

    const cleanup = () => {
        URL.revokeObjectURL(image || '');
    };

    const setImage = (newImage: any) => {
        if (image) {
            cleanup();
        }
        _setImage(newImage);
    };

    const addItem = () => {
        setCount(count + 1);
        setAttrItem({
            ...attrItem,
            [count]: { key: '', value: '' }
        });
    };

    const deleteItem = (param: any) => {
        let bump = Object.assign({}, attrItem);
        if (Object.keys(attrItem).length > 1) {
            delete bump[param];
            setAttrItem(bump);
        } else {
            bump[param].key = '';
            bump[param].value = '';
            setAttrItem(bump);
        }
    };

    return (
        <div style={{ paddingBottom: '500px' }}>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">{translateLang('createnft_title')}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row">
                    <div className="col-lg-7 offset-lg-1 mb-5">
                        <div id="form-create-item" className="form-border">
                            <div className="field-set">
                                <h5>
                                    {translateLang('uploadmedia')} <b style={{ color: 'red' }}>*</b>
                                </h5>
                                <p>File types supported: all image and video Max size: 100 MB</p>
                                <div className="d-create-file">
                                    <p className="file_name">
                                        {image ? (
                                            selectedFile.name
                                        ) : (
                                            <i className="bg-color-2 i-boxed icon_image"></i>
                                        )}
                                    </p>
                                    <div className="browse">
                                        <input
                                            type="button"
                                            className="btn-main"
                                            value={translateLang('browse')}
                                        />
                                        <input
                                            id="upload_file"
                                            type="file"
                                            multiple
                                            accept="image/*, video/*"
                                            onChange={handleImgChange}
                                        />
                                    </div>
                                </div>
                                <div className="spacer-single"></div>
                                <h5>
                                    {translateLang('name')} <b style={{ color: 'red' }}>*</b>
                                </h5>
                                <input
                                    type="text"
                                    name="item_name"
                                    id="item_name"
                                    className="form-control"
                                    placeholder="your nft name"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />

                                <div className="spacer-30"></div>

                                <h5>{translateLang('externallink')}</h5>
                                <p>
                                    CLOUD9 will include a link to this URL on this item{"'"}s detail
                                    page, so that users can click to learn more about it. You are
                                    welcome to link to your own webpage with more details.
                                </p>
                                <div className="social">
                                    <span>
                                        <i className="fa fa-twitter-square"></i>
                                        <input
                                            type="text"
                                            name="item_link"
                                            className="form-control"
                                            placeholder="https://twitter.com/"
                                            onChange={(e) => setExtLink1(e.target.value)}
                                            value={extLink1}
                                        />
                                    </span>
                                    <span>
                                        <i className="fa fa-facebook-square"></i>
                                        <input
                                            type="text"
                                            name="item_link"
                                            className="form-control"
                                            placeholder="https://facebook.com/"
                                            onChange={(e) => setExtLink2(e.target.value)}
                                            value={extLink2}
                                        />
                                    </span>
                                    <span>
                                        <i className="fa fa-instagram"></i>
                                        <input
                                            type="text"
                                            name="item_link"
                                            className="form-control"
                                            placeholder="https://instagram.com/"
                                            onChange={(e) => setExtLink3(e.target.value)}
                                            value={extLink3}
                                        />
                                    </span>
                                    <span>
                                        <FaDiscord />
                                        <input
                                            type="text"
                                            name="item_link"
                                            className="form-control"
                                            placeholder="https://discord.com/"
                                            onChange={(e) => setExtLink4(e.target.value)}
                                            value={extLink4}
                                        />
                                    </span>
                                    <span>
                                        <i className="fa fa-telegram"></i>
                                        <input
                                            type="text"
                                            name="item_link"
                                            className="form-control"
                                            placeholder="https://telegram.org/"
                                            onChange={(e) => setExtLink5(e.target.value)}
                                            value={extLink5}
                                        />
                                    </span>
                                </div>

                                <div className="spacer-30"></div>

                                <h5>{translateLang('description')}</h5>
                                <p>
                                    The description will be included on the item{"'"}s detail page
                                    underneath its image. Markdown syntax is supported.
                                </p>
                                <textarea
                                    data-autoresize
                                    name="item_desc"
                                    className="form-control"
                                    placeholder="provide a detailed description of your nft item"
                                    onChange={(e) => setDesc(e.target.value)}
                                    value={desc}
                                />

                                <div className="spacer-30"></div>

                                <h5>{translateLang('choosecollection')}</h5>
                                <p>This is the collection where your item will appear.</p>
                                <select
                                    className="form-control"
                                    onChange={(e) => handleCollectionChange(e)}>
                                    {collections.map((item: any, index: any) => (
                                        <option key={index} value={item.owner}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="spacer-30"></div>

                                <h5>{translateLang('attribute')}</h5>
                                <p>Textual traits that show up as rectangles</p>
                                {Object.keys(attrItem).map((item, index) => (
                                    <div className="attribute" key={index}>
                                        <button
                                            type="button"
                                            className="form-control-button"
                                            style={{ flex: '1 1 0' }}
                                            onClick={() => deleteItem(item)}>
                                            <i className="bg-color-2 i-boxed icon_close" />
                                        </button>
                                        <input
                                            type="input"
                                            className="form-control"
                                            style={{ flex: '5 5 0' }}
                                            placeholder="Character"
                                            onChange={(e) => {
                                                setAttrItem({
                                                    ...attrItem,
                                                    [item]: {
                                                        ...attrItem[item],
                                                        key: e.target.value
                                                    }
                                                });
                                            }}
                                            value={attrItem[item].key}
                                        />
                                        <input
                                            type="input"
                                            className="form-control"
                                            style={{ flex: '5 5 0' }}
                                            placeholder="Value"
                                            onChange={(e) => {
                                                setAttrItem({
                                                    ...attrItem,
                                                    [item]: {
                                                        ...attrItem[item],
                                                        value: e.target.value
                                                    }
                                                });
                                            }}
                                            value={attrItem[item].value}
                                        />
                                        <button
                                            type="button"
                                            className="form-control-button"
                                            style={{ flex: '1 1 0' }}
                                            onClick={addItem}>
                                            <i className="bg-color-2 i-boxed icon_plus" />
                                        </button>
                                    </div>
                                ))}

                                <div className="spacer-30"></div>
                                {!loading ? (
                                    <input
                                        type="button"
                                        id="submit"
                                        className="btn-main"
                                        value={translateLang('btn_createitem')}
                                        onClick={handleSubmit}
                                    />
                                ) : (
                                    <button className="btn-main">
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            aria-hidden="true"></span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-2-5 col-sm-12 col-xs-12">
                        <h5>{translateLang('previewitem')}</h5>
                        <div className="nft__item m-0">
                            <div className="nft__item_wrap">
                                <span>
                                    <img
                                        src={image || './../img/collections/coll-item-3.jpg'}
                                        id="get_file_2"
                                        className="lazy nft__item_preview"
                                        alt=""
                                    />
                                </span>
                            </div>
                            <div className="nft__item_info">
                                <span>
                                    <p>
                                        {name.trim() === ''
                                            ? translateLang('unknown')
                                            : name.length > 20
                                            ? name.slice(0, 20) + '...'
                                            : name}
                                    </p>
                                </span>
                                <div className="spacer-10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
