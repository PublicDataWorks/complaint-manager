import {
    CardContent,
    Divider
  } from "@material-ui/core";
import DetailsCard from "../../shared/components/DetailsCard";
import {
    PrimaryButton,
  } from "../../shared/components/StyledButtons";
import FileUpload from "./FileUpload";
import { Component } from "react";
import { CloudUpload } from "@material-ui/icons";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`);

class MassUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachmentValid: false,
            uploadInProgress: false
        };
    }

    onUploadInit = dropzone => {
        this.dropzone = dropzone;
    }

    onUploadSuccess = (file, response) => {
        this.dropzone.removeFile(file);
        this.setState({ attachmentValid: false });
    }
    onUploadSending = async (file, xhr, formData) => {
        let fileName = file.name;
        formData.append("name", fileName);
        formData.append("type", `text/csv`);
    }
    
   

    onUploadComplete = () => {
        console.log(this.state.attachmentValid);
        this.dropzone.processQueue();

        
    }

    render() {
        return (
            <section style={{ minWidth: "50em", padding: "5px" }}>
                <DetailsCard title="Mass Upload">
                    <CardContent style={{display: "flex"}}>
                        <section style={{flex: 1, padding: "16px 16px 24px"}}>
                          <p>
                            Please Note the following before submitting a file for mass upload:  
                        </p>
                        <ul style={{marginTop: "0px"}}> 
                            <li>
                                The headers must match those on this reference spreadsheet. ()
                            </li>
                            <li>
                                Any empty required fields will result in an error.
                            </li>
                            <li>
                                Only CSV files are accepted.
                            </li>
                        </ul>  
                        </section>
                        
                        <Divider orientation="vertical" flexItem />
                        <FileUpload
                            allowedFileTypes={[".csv"]}
                            externalErrorMessage={""}
                            maxSize={1000}
                            onComplete={this.onUploadComplete.bind(this)}
                            onInit={this.onUploadInit.bind(this)}
                            onSending={this.onUploadSending.bind(this)}
                            onSuccess={this.onUploadSuccess.bind(this)}                        
                            postUrl={`${config[process.env.REACT_APP_ENV].backendUrl}/api/person-mass-upload`}
                            setAttachmentValid={attachmentValid =>
                                this.setState({ attachmentValid })
                            }
                            setUploadInProgress={uploadInProgress =>
                                this.setState({ uploadInProgress })
                            }
                            uploadText="Upload a File"
                        />
                        <PrimaryButton
                            style={{paddingTop: "auto", paddingBottom: "auto", marginTop: "auto", maxHeight: "40px"}}
                            onClick={this.onUploadComplete.bind(this)}
                            disabled={!this.state.attachmentValid}
                        ><CloudUpload style={{paddingRight: "7px"}}/>Upload </PrimaryButton>
                    </CardContent>
                </DetailsCard>
            </section>
        )
    }
}

export default MassUpload;