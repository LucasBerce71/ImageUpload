import IFile from "./IFIle";

interface IFileContextData {
    uploadedFiles: IFile[];
    deleteFile(id: string): void;
    handleUpload(file: any): void;
};

export default IFileContextData;