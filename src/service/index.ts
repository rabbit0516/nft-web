import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_SERVERENDPOINT;

// NFT manage
const create_collection = async (formData: any) => {
    try {
        var res = await axios.post('/api/create-collection', formData);

        if (!res.data.success) {
            return false;
        }

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const nft_mint = async (formData: any) => {
    try {
        var res = await axios.post('/api/mint-nft', formData);

        if (!res.data.success) {
            return false;
        }

        return res.data;
    } catch (err) {
        return false;
    }
};

const nft_like = async (data: any) => {
    try {
        var res = await axios.post('/api/nft-like', data);

        if (!res.data.success) {
            return false;
        }

        return true;
    } catch (err) {
        return false;
    }
};

const lazy_mint = async (data: any) => {
    try {
        var res = await axios.post('/api/lazy-mint', data);

        if (!res.data.success) {
            return false;
        }

        return res.data;
    } catch (err) {
        return false;
    }
};

const lazy_onsale = async (data: any) => {
    try {
        var res = await axios.post('/api/lazy-onsale', data);

        if (!res.data.success) {
            return false;
        }

        return res.data;
    } catch (err) {
        return false;
    }
};

// User Manage
const user_create = async (account: any) => {
    try {
        var res = await axios.post('/api/user-create', { account: account });
        if (!res.data.status) {
            return false;
        }

        return res.data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const user_login = async (account: any) => {
    try {
        var res = await axios.post('/api/user-login', { address: account });
        if (res.data.status) {
            return res.data.data;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

const buy_credit = async (param: any) => {
    try {
        var res = await axios.post('/api/payment/session-initiate', param);

        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const getRequests = async () => {
    try {
        var res = await axios.post('/api/payment/request');

        return res;
    } catch (err) {
        console.log(err);
        return [];
    }
};

// Export Functions
const Action = {
    create_collection,
    nft_mint,
    nft_like,
    lazy_mint,
    lazy_onsale,
    user_create,
    user_login,
    buy_credit,
    getRequests
};

export default Action;
