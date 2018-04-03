import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import Auth from "../../auth/Auth";

const handleLogout = async () => {
    const hostname = config[process.env.NODE_ENV].hostname;
    const token = getAccessToken();
    await fetch(`${hostname}/api/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(() => {
        new Auth().logout();
    }).catch((error) => {
        console.log(error);
    })
};

export default handleLogout;