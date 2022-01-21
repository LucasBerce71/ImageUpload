import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
} from 'react';

import { v4 as uuidv4 } from 'uuid';
import fileSize from 'filesize';

import api from '../services/api';

import IFileContextData from '../models/IFileContextData';
import IFile from '../models/IFIle';
import IPost from '../models/IPost';
import { AxiosError, AxiosResponse } from 'axios';
import { uploadedProgressLog } from '../utils/uploadedProgressLog';

const FileContext = createContext<IFileContextData>({} as IFileContextData);

const FileProvider: React.FC = ({ children }) => {
    const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([]);

    useEffect(() => {
        api.get<IPost[]>('posts').then((response: AxiosResponse) => {
            const postFormatted: IFile[] = response.data.map((post: IPost) => {
                return {
                    ...post,
                    id: post._id,
                    preview: post.url,
                    readableSize: fileSize(post.size),
                    file: null,
                    error: false,
                    uploaded: true,
                };
            });

            setUploadedFiles(postFormatted);
        });
    }, []);

    useEffect(() => {
        return () => {
            uploadedFiles.forEach((file: IFile) => URL.revokeObjectURL(file.preview));
        };
    }, []);

    const updateFile = useCallback((id, data) => {
        setUploadedFiles((oldState: IFile[]) => 
            oldState.map((file: IFile) => 
                (file.id === id ? { ...file, ...data } : file
            )));
    }, []);

    const processUpload = useCallback((uploadedFile: IFile) => {
        const data = new FormData();

        if (uploadedFile.file) {
            data.append('file', uploadedFile.file, uploadedFile.name);
        }

        api.post('posts', data, {
            onUploadProgress: (progressEvent: ProgressEvent<EventTarget>) => {
                let progress: number = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                );

                uploadedProgressLog(uploadedFile.name, progress);

                updateFile(uploadedFile.id, { progress });
            },
        }).then((response: AxiosResponse) => {
            console.log(`A imagem ${uploadedFile.name} já foi enviada para o servidor!`);

            updateFile(uploadedFile.id, {
                upladed: true,
                id: response.data._id,
                url: response.data.url,
            });
        }).catch((exception: AxiosError) => {
            console.error(
                `Houve um proble para realizar o upload da imagem ${uploadedFile.name} no servidor!`
            );

            console.log(exception);

            updateFile(uploadedFile.id, { error: true });
        });
    }, [updateFile]);

    const handleUpload = useCallback((files: File[]) => {
        const newUploadedFiles: IFile[] = files.map((file: File) => ({
            file,
            id: uuidv4(),
            name: file.name,
            readableSize: fileSize(file.size),
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            error: false,
            url: '',
        }));

        setUploadedFiles((oldState: IFile[]) => oldState.concat(newUploadedFiles));

        newUploadedFiles.forEach(processUpload);
    }, [processUpload]);

    const deleteFile = useCallback((id: string) => {
        api.delete(`posts/${id}`);

        setUploadedFiles((oldState: IFile[]) => 
            oldState.filter((file: IFile) => file.id !== id));
    }, []);

    return (
        <FileContext.Provider value={{ uploadedFiles, deleteFile, handleUpload }}>
            {children}
        </FileContext.Provider>
    );
};

const useFiles = (): IFileContextData => {
    const context = useContext(FileContext);

    if (!context) {
        throw new Error('useFiles must be used within FileProvider');
    }

    return context;
};

export { FileProvider, useFiles };