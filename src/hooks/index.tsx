import React from 'react';
import { FileProvider } from './useFiles';

const GlobalContext: React.FC = ({ children }) => {
    return (
        <FileProvider>
            { children }
        </FileProvider>
    );
};

export default GlobalContext;