import getAccessToken from "../../auth/getAccessToken";
import FileSaver from "file-saver";
import {push} from "react-router-redux";
import downloadFailed from "../../actionCreators/downloadActionCreators";


const downloader = (path, filename, callback) => async (dispatch) => {
    if (!getAccessToken()) {
        return dispatch(push('/login'))
    }
    try {
        const response = await fetch(path, {
            headers: {
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })

        switch (response.status) {
            case 200:
                const blob = await response.blob()
                const fileToDownload = new File([blob], filename)
                FileSaver.saveAs(fileToDownload, filename)

                if (callback) callback()
                break
            case 401:
                return dispatch(push('/login'))
            default:
                return dispatch(downloadFailed())
        }
    }
    catch (e) {
        dispatch(downloadFailed())
    }
}


export default downloader
