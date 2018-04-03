import { DOWNLOAD_FAILED } from "../../sharedUtilities/constants"

export default function downloadFailed() {
    return { type: DOWNLOAD_FAILED }
}