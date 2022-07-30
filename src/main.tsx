// eslint-disable-next-line import/no-unresolved
import '@rainbow-me/rainbowkit/styles.css';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import LayersProvider from './LayersContext';
import { ModalProvider } from './components/Modal';
import { MoralisProvider } from 'react-moralis';
import theme from './theme';

import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';

const { chains, provider } = configureChains([chain.polygonMumbai], [publicProvider()]);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <MoralisProvider
                initializeOnMount
                appId="XpSCFDcLmmYoFwCIWictEjHQYxREfaPLGVbNjNSo"
                serverUrl="https://jkikashbsvld.usemoralis.com:2053/server"
            >
                <WagmiConfig client={wagmiClient}>
                    <RainbowKitProvider
                        chains={chains}
                        theme={lightTheme({
                            accentColor: '#d53f8c',
                            borderRadius: 'medium',
                        })}
                    >
                        <LayersProvider>
                            <ModalProvider>
                                <App />
                            </ModalProvider>
                        </LayersProvider>
                    </RainbowKitProvider>
                </WagmiConfig>
            </MoralisProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
