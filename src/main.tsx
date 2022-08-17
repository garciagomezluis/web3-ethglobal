// eslint-disable-next-line import/no-unresolved
import '@rainbow-me/rainbowkit/styles.css';

import ReactDOM from 'react-dom';
import React, { FC } from 'react';

import { ChakraProvider, ColorModeScript, useColorModeValue } from '@chakra-ui/react';

import App from './App';
import LayersProvider from './LayersContext';
import { ModalProvider } from './components/Modal';
import theme from './theme';

import { publicProvider } from 'wagmi/providers/public';
import {
    RainbowKitProvider,
    darkTheme,
    getDefaultWallets,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';

const { chains, provider } = configureChains([chain.polygonMumbai], [publicProvider()]);

const { connectors } = getDefaultWallets({
    appName: 'Layeralize',
    chains,
});

const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider,
});

const Web3Provider: FC = ({ children }) => {
    const rainbowTheme = useColorModeValue(lightTheme, darkTheme);

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                theme={rainbowTheme({
                    accentColor: '#d53f8c',
                    borderRadius: 'medium',
                })}
            >
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <Web3Provider>
                <LayersProvider>
                    <ModalProvider>
                        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                        <App />
                    </ModalProvider>
                </LayersProvider>
            </Web3Provider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
