import React, { useMemo } from 'react';
import { useBlockchainContext } from '../../context';
import NFTList from './nfts';

interface Props {
    filter1: any
    filter2: any
    filter3: any
    sortBy: any
}

const NFTLists = ({filter1, filter2, filter3, sortBy}: Props) => {
    const [state, {}] = useBlockchainContext() as any;

    const NFTs = useMemo(() => {
        return state.allNFT.filter(filter1).filter(filter2).filter(filter3).sort(sortBy);
    }, [state.allNFT, filter1, filter2, filter3, sortBy]);

    return (
        <div>
            {NFTs && NFTs.length > 0 ? (
                <NFTList data={NFTs} />
            ) : (
                <h1 style={{ textAlign: 'center', padding: '73px' }}>No Data</h1>
            )}
            <div className="spacer-30"></div>
        </div>
    );
}

export default NFTLists