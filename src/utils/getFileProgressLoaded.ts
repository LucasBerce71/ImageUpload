export const getUploadedProgres = (progressEvent: ProgressEvent<EventTarget>) => {
    let progress: number = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
    ); 

    return progress;
};