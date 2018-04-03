import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import Auth from "../../auth/Auth";

const handleLogout = async () => {
    const hostname = config[process.env.NODE_ENV].hostname;
    const token = getAccessToken();

    new Auth().logout();
    await fetch(`${hostname}/api/audit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({log: 'Logged Out'})
    }).catch((error) => {
        console.log(error);
    });

};

export default handleLogout;