import { Component } from "react";
import { DropzoneComponent } from "react-dropzone-component";

const DropzoneComponent = () => {
    const eventHandlers = {
        onDrop: (file) => {},
        onUploadProgress: (progress) => {},
        onSuccess: (file) => {},
        onError: (file, error) => {}
    };
    const config = {
        iconFiletypes: ['.csv'],
        showFiletypeIcon: true,
        postUrl: '/uploadHandler'
    };
    const djsConfig = {
        addRemoveLinks: true,
        maxFiles: 1
    };
    return (
        <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
    );
}