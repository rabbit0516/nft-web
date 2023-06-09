import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Breakpoint, BreakpointProvider, setDefaultBreakpoints } from 'react-socks';
import { Link, useNavigate } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useBlockchainContext } from '../../context';
import { useWallet } from 'use-wallet';
import SearchModal from '../components/searchModal';
import { changeNetwork } from '../../utils';

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const NavLink = (props: any) => (
    <Link
        {...props}
        getProps={({ isCurrent }: {isCurrent: any}) => {
            // the object returned here is passed to the
            // anchor element's props
            return {
                className: isCurrent ? 'active' : 'non-active'
            };
        }}
    />
);



const Header = () => {
    const [state, { dispatch, translateLang }] = useBlockchainContext() as any;
    const [openMenu1, setOpenMenu1] = useState(false);
    const [openMenu2, setOpenMenu2] = useState(false);
    const [openMenu3, setOpenMenu3] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [focused, setFocused] = useState(false);
    const [switchFocus, setSwitchFocus] = useState(false);
    const wallet = useWallet();

    useEffect(() => {
        if (searchKey.trim() !== '' && focused) {
            setSearchModal(true);
        } else {
            setTimeout(() => {
                setSearchModal(false);
            }, 200);
        }
    }, [searchKey, focused]);

    const collectionFilter = useCallback(
        (item: any) => {
            const searchParams = ['address', 'name', 'description'];
            return searchParams.some((newItem) => {
                try {
                    return (
                        item['metadata'][newItem]
                            ?.toString()
                            .toLowerCase()
                            .indexOf(searchKey.toLowerCase()) > -1
                    );
                } catch (err) {
                    return false;
                }
            });
        },
        [searchKey]
    );

    const nftFilter = useCallback(
        (item: any) => {
            const searchParams = ['owner', 'name', 'description', 'collectionAddress'];
            return searchParams.some((newItem) => {
                try {
                    return (
                        item[newItem]?.toString().toLowerCase().indexOf(searchKey.toLowerCase()) >
                            -1 ||
                        item['metadata'][newItem]
                            ?.toString()
                            .toLowerCase()
                            .indexOf(searchKey.toLowerCase()) > -1
                    );
                } catch (err) {
                    return false;
                }
            });
        },
        [searchKey]
    );

    const collectionDatas = useMemo(() => {
        try {
            return state.collectionNFT.filter(collectionFilter).splice(0, 20);
        } catch (err) {
            return [];
        }
    }, [state.collectionNFT, collectionFilter]);

    const nftDatas = useMemo(() => {
        try {
            return state.allNFT.filter(nftFilter).splice(0, 20);
        } catch (err) {
            return [];
        }
    }, [state.allNFT, nftFilter]);

    const handleConnect = () => {
        if (wallet.status == 'connected') {
            wallet.reset();
            dispatch({
                type: 'auth',
                payload: {
                    isAuth: false,
                    name: '',
                    email: '',
                    bio: '',
                    address: '',
                    image: null,
                    bannerImage: null
                }
            });
            localStorage.setItem('isConnected', "0");
        } else {
            wallet.connect()

            // wallet.connect().then((res) => {
            //     (async () => {
            //         try {
            //             //if metamask is connected and wallet is not connected ( chain error))
            //             if (wallet.status === 'error') {
            //                 var accounts = await window.ethereum.request({
            //                     method: 'eth_accounts'
            //                 });
            //                 if (accounts.length > 0) {
            //                     await changeNetwork('fantom');
            //                     wallet.connect();
            //                 }
            //             }
            //             localStorage.setItem('isConnected', "1");
            //         } catch (err) {
            //             console.log((err as any).message);
            //         }
            //     })();
            // });
        }
    };

    const handleBtnClick1 = () => {
        setOpenMenu1(!openMenu1);
    };
    const handleBtnClick2 = () => {
        setOpenMenu2(!openMenu2);
    };
    const handleBtnClick3 = () => {
        setOpenMenu3(!openMenu3);
    };
    const closeMenu1 = () => {
        setOpenMenu1(false);
    };
    const closeMenu2 = () => {
        setOpenMenu2(false);
    };
    const closeMenu3 = () => {
        setOpenMenu3(false);
    };
    const ref1 = useOnclickOutside(() => {
        closeMenu1();
    });
    const ref2 = useOnclickOutside(() => {
        closeMenu2();
    });
    const ref3 = useOnclickOutside(() => {
        closeMenu3();
    });

    useEffect(() => {

        console.log("wallet-status", wallet.status)
        if (wallet.status==='disconnected' && localStorage.getItem('isConnected')==="1") {
            localStorage.setItem('isConnected', "0")
            // wallet.connect();
        } else if (wallet.status==='connected' && localStorage.getItem('isConnected')==="0") {
            localStorage.setItem('isConnected', "1")
        }
    }, [wallet.status]);

    const [showmenu, btn_icon] = useState(false);


    useEffect(() => {
        
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const onScroll = () => {
        btn_icon(false);
        const header = document.getElementById('myHeader');
        const totop = document.getElementById('scroll-to-top');
        const sticky = (header as any).offsetTop;
        if (window.pageYOffset > sticky) {
            (header as any).classList.add('sticky');
            (totop as any).classList.add('show');
        } else {
            (header as any).classList.remove('sticky');
            (totop as any).classList.remove('show');
        }
        if (window.pageYOffset > sticky) {
            closeMenu1();
        }
    }

    return (
        <>
            <header id="myHeader" className="navbar white">
                <div className="container">
                    <div className="row w-100-nav">
                        <div className="logo px-0">
                            <div className="navbar-title navbar-item">
                                <NavLink to="/">
                                    <img src="/img/logo.png" className="d-block" alt="#" />
                                    <img src="/img/logo.png" className="d-3" alt="#" />
                                    <img src="/img/logo.png" className="d-none" alt="#" />
                                </NavLink>
                            </div>
                        </div>

                        <div className="search">
                            <input
                                type="text"
                                id="quick_search"
                                className="xs-hide"
                                placeholder={translateLang('seachtext')}
                                value={searchKey}
                                onChange={(e) => setSearchKey(e.target.value.trim())}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                            />

                            {searchModal && (
                                <SearchModal
                                    className="xs-hide"
                                    collectionDatas={collectionDatas}
                                    nftDatas={nftDatas}
                                />
                            )}
                        </div>

                        <BreakpointProvider>
                            <Breakpoint l down>
                                {showmenu && (
                                    <div className="menu">
                                        <button
                                            className="btn-main sm-style"
                                            onClick={handleConnect}>
                                            {wallet.status == 'connected'
                                                ? wallet.account?.slice(0, 4) +
                                                  '...' +
                                                  wallet.account?.slice(-4)
                                                : 'Connect'}
                                        </button>

                                        <div className="navbar-item">
                                            <div ref={ref1}>
                                                <div
                                                    className="dropdown-custom dropdown-toggle btn"
                                                    onClick={handleBtnClick1}>
                                                    {translateLang('explore')}
                                                    <span className="lines"></span>
                                                </div>
                                                {openMenu1 && (
                                                    <div className="item-dropdown">
                                                        <div
                                                            className="dropdown"
                                                            onClick={closeMenu1}>
                                                            <NavLink
                                                                to="/explore"
                                                                onClick={() => btn_icon(!showmenu)}>
                                                                {translateLang('allnfts')}
                                                            </NavLink>
                                                            <NavLink
                                                                to="/Collections"
                                                                onClick={() => btn_icon(!showmenu)}>
                                                                {translateLang('collection')}
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="navbar-item">
                                            <NavLink
                                                to={`/${state.auth.address}`}
                                                onClick={() => btn_icon(!showmenu)}>
                                                {translateLang('profile')}
                                                <span className="lines"></span>
                                            </NavLink>
                                        </div>
                                        <div className="navbar-item">
                                            <div ref={ref2}>
                                                <div
                                                    className="dropdown-custom dropdown-toggle btn"
                                                    onClick={handleBtnClick2}>
                                                    {translateLang('create')}
                                                    <span className="lines"></span>
                                                </div>
                                                {openMenu2 && (
                                                    <div className="item-dropdown">
                                                        <div
                                                            className="dropdown"
                                                            onClick={closeMenu2}>
                                                            <NavLink
                                                                to="/create/nft"
                                                                onClick={() => btn_icon(!showmenu)}>
                                                                {translateLang('createnft')}
                                                            </NavLink>
                                                            <NavLink
                                                                to="/create/collection"
                                                                onClick={() => btn_icon(!showmenu)}>
                                                                {translateLang('createcollection')}
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* <div className="navbar-item">
                                        <NavLink
                                            to="/lazy-mint"
                                            onClick={() => btn_icon(!showmenu)}
                                        >
                                            {translateLang('lazymint')}
                                            <span className="lines"></span>
                                        </NavLink>
                                    </div> */}
                                        <div className="spacer-single"></div>
                                        <div className="search">
                                            <input
                                                type="text"
                                                id="quick_search"
                                                className="lg-hide"
                                                placeholder={translateLang('seachtext')}
                                                value={searchKey}
                                                onChange={(e) =>
                                                    setSearchKey(e.target.value.trim())
                                                }
                                                onFocus={() => setFocused(true)}
                                                onBlur={() => setFocused(false)}
                                            />
                                            {searchModal && (
                                                <SearchModal
                                                    collectionDatas={collectionDatas}
                                                    nftDatas={nftDatas}
                                                />
                                            )}
                                        </div>
                                        <div className="spacer-single"></div>
                                    </div>
                                )}
                            </Breakpoint>

                            <Breakpoint xl>
                                <div className="menu">
                                    <div className="navbar-item">
                                        <div ref={ref1}>
                                            <div
                                                className="dropdown-custom dropdown-toggle btn"
                                                onMouseEnter={handleBtnClick1}
                                                onMouseLeave={closeMenu1}>
                                                {translateLang('explore')}
                                                <span className="lines"></span>
                                                {openMenu1 && (
                                                    <div className="item-dropdown">
                                                        <div
                                                            className="dropdown"
                                                            onClick={closeMenu1}>
                                                            <NavLink to="/explore">
                                                                {translateLang('allnfts')}
                                                            </NavLink>
                                                            <NavLink to="/Collections">
                                                                {translateLang('collection')}
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="navbar-item">
                                        <NavLink to={`/${state.auth.address}`}>
                                            {translateLang('profile')}
                                            <span className="lines"></span>
                                        </NavLink>
                                    </div>
                                    <div className="navbar-item">
                                        <div ref={ref2}>
                                            <div
                                                className="dropdown-custom dropdown-toggle btn"
                                                onMouseEnter={handleBtnClick2}
                                                onMouseLeave={closeMenu2}>
                                                {translateLang('create')}
                                                <span className="lines"></span>
                                                {openMenu2 && (
                                                    <div className="item-dropdown">
                                                        <div
                                                            className="dropdown"
                                                            onClick={closeMenu2}>
                                                            <NavLink to="/create/nft">
                                                                {translateLang('createnft')}
                                                            </NavLink>
                                                            <NavLink to="/create/collection">
                                                                {translateLang('createcollection')}
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mainside lg-style">
                                    {wallet.status == 'connected' && (
                                        <div
                                            className="switch_network"
                                            onBlur={() =>
                                                setTimeout(() => setSwitchFocus(false), 100)
                                            }>
                                            <button
                                                className="btn-main"
                                                onClick={() => setSwitchFocus(!switchFocus)}>
                                                Switch Network
                                            </button>
                                            {switchFocus && (
                                                <div>
                                                    <span>Bitcoin evm</span>
                                                    <span>Spagetti testnet</span>
                                                    <span>Fantom</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <button className="btn-main" onClick={handleConnect}>
                                        {wallet.status==='connecting' ? 'Connecting...' : (
                                            (wallet.status == 'connected' && wallet.account) ? `${wallet.account.slice(0, 4)}...${wallet.account.slice(-4)}` : 'Connect'
                                        )}
                                    </button>
                                </div>
                            </Breakpoint>
                        </BreakpointProvider>
                    </div>

                    <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
                        <div className="menu-line white"></div>
                        <div className="menu-line1 white"></div>
                        <div className="menu-line2 white"></div>
                    </button>
                </div>
            </header>
        </>
    );
}

export default Header
