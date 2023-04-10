import React, { useMemo } from 'react';
import { useBlockchainContext } from '../../context';
import NFTList from './nfts';

interface Props {
    address: string
}

const MyNFTs = ({address}: Props) => {
    const [state, {}] = useBlockchainContext() as any;

    const mynfts = useMemo(() => {
        return state.allNFT.filter((item: any) => {
            if (item.owner === address) {
                return item;
            }
        });
    }, [state.allNFT, address]);

    return (
        <div className="row">
            {mynfts && mynfts.length > 0 ? (
                <NFTList data={mynfts} />
            ) : (
                <h1 style={{ textAlign: 'center', padding: '73px' }}>No Data</h1>
            )}
        </div>
    );
}

export default MyNFTs;