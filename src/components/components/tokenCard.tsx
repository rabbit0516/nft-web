import React from "react";

const TokenCard = (props: any) => {
    const { balance, label } = props;
    return (
        <div className="form-control tokencard">
            <span>
                {balance} {label}
            </span>

            <span>{'>'}</span>
        </div>
    );
}

export default TokenCard;
