import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { UseWalletProvider } from 'use-wallet';

import ScrollToTopBtn from './menu/ScrollToTop';
import Header from './menu/header';
import Home from './pages/home';
import Explore from './pages/explore';
import Collection from './pages/colection';
import ItemDetail from './pages/ItemDetail';
import Author from './pages/Author';
import Profile from './pages/profile';
import CreateCollection from './pages/createcollection';
import Create from './pages/create';
import LazyCreate from './pages/lazycreate';
import Auction from './pages/Auction';
import Collections from './pages/collections';
import { useBlockchainContext } from '../context';
import Provider from '../context';
import { ToastContainer, toast } from 'react-toastify';
import config from '../config.json'

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPQLENDPOINT
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('marketplace_session');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? token : ''
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const PrivateRoute = ({ children }: {children: any}) => {
    const location = useLocation();

    const [state, {}] = useBlockchainContext() as any;

    if (!state.auth.isAuth) {
        // NotificationManager.warning('Please connect wallet');
        toast('Please connect wallet', {position: "top-right", autoClose: 2000})
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
};

function App() {
    return (
        <div className="wraper">
            <Router>
                <ApolloProvider client={client}>
                    <UseWalletProvider
                        // chainId={config.chainId}
                        connectors={{
                            walletconnect: {
                                rpcUrl: config.rpc
                            }
                        }}>
                        <Provider>
                            <GlobalStyles />
                            <Header />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/explore" element={<Explore />} />
                                <Route path="/Collections" element={<Collections />} />
                                {/* <Route path="/signPage" element={<Wallet />} /> */}
                                <Route path="/collection/:collection" element={<Collection />}/>

                                <Route path="/ItemDetail/:collection/:id" element={<ItemDetail />}/>
                                <Route path="/:address" element={<Author />} />
                                <Route path="/account/profile"
                                    element={
                                        <PrivateRoute>
                                            <Profile />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/create/collection"
                                    element={
                                        <PrivateRoute>
                                            <CreateCollection />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/create/nft"
                                    element={
                                        <PrivateRoute>
                                            <Create />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/lazy-mint"
                                    element={
                                        <PrivateRoute>
                                            <LazyCreate />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/Auction/:collection/:id"
                                    element={
                                        <PrivateRoute>
                                            <Auction />
                                        </PrivateRoute>
                                    }
                                />
                                <Route path="*" element={<Navigate to={'/'} />} />
                            </Routes>
                            <ScrollToTopBtn />
                        </Provider>
                    </UseWalletProvider>
                </ApolloProvider>
            </Router>
        </div>
    );
}

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export default App;