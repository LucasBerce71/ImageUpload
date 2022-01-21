import React, { useCallback } from 'react';

import { useDropzone } from 'react-dropzone';
import { validFiles } from '../../config/dropZoneAcceptedFiles';

import { DropContainer, UploadMessage } from './styles';

const Upload: React.FC = () => {
    const onDrop = useCallback((files) => {
        //handle upload call
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
    } = useDropzone({
        accept: validFiles,
        onDrop,
    });

    const renderDragMessage = useCallback(() => {
        if (!isDragActive) {
            return <UploadMessage>Arraste imagens aqui...</UploadMessage>;
        }

        if (isDragReject) {
            return (
                <UploadMessage type='error'>
                    Tipo de arquivo não suportado
                </UploadMessage>
            );
        }

        return <UploadMessage type='success'>Solte as imagens aqui</UploadMessage>;
    }, [isDragActive, isDragReject]);

    return (
        <DropContainer {...getRootProps()}>
            <input {...getInputProps()} />
            {renderDragMessage()}
        </DropContainer>
    );
};

export default Upload;