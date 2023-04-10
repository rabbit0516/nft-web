import React from "react";

interface Props {
    type: any
    percent: any
    per: any
}

const M_ItemdetailRedex = ({type, percent, per}: Props) => {
    return (
        <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="nft_attr">
                <span>{type}</span>
                <div>
                    <div>{per}</div>
                    <p>{percent}</p>
                </div>
            </div>
        </div>
    );
};

export default M_ItemdetailRedex;
