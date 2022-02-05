import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import GlobalProvider from './GlobalContext';

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider>
            <GlobalProvider>
                <App />
            </GlobalProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
