import React, { useMemo, useState } from 'react';
import { useBlockchainContext } from '../../context';
import NFTList from './nfts';

interface Props {
    address: string
}

const SaledNFTs = ({address}: Props) => {
    const [state, {}] = useBlockchainContext() as any;

    const salednfts = useMemo(() => {
        return state.allNFT.filter((item: any) => {
            if (item.marketdata?.owner === address) {
                return item;
            }
        });
    }, [state.allNFT, address]);

    return (
        <div>
            {salednfts && salednfts.length > 0 ? (
                <NFTList data={salednfts} />
            ) : (
                <h1 style={{ textAlign: 'center', padding: '73px' }}>No Data</h1>
            )}
        </div>
    );
}

export default SaledNFTs
