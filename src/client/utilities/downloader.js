import getAccessToken from "../auth/getAccessToken";
import FileSaver from "file-saver";

const downloader = async (path, filename) => {
    try {
        const response = await fetch(path, {
            headers: {
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })

        if (response.status === 200) {
            const blob = await response.blob()
            const fileToDownload = new File([blob], filename)
            FileSaver.saveAs(fileToDownload, filename)
        }
        else {
            console.log(response.status)
        }
    }
    catch (e) {
        console.log(e)
    }
}



export default downloader
