import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import GlobalProvider from './GlobalContext';
import { ModalProvider } from './components/Modal';
import { MoralisProvider } from 'react-moralis';
import theme from './theme';

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <MoralisProvider
                initializeOnMount
                appId="XpSCFDcLmmYoFwCIWictEjHQYxREfaPLGVbNjNSo"
                serverUrl="https://jkikashbsvld.usemoralis.com:2053/server"
            >
                <GlobalProvider>
                    <ModalProvider>
                        <App />
                    </ModalProvider>
                </GlobalProvider>
            </MoralisProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
