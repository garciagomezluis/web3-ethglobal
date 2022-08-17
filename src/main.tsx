// eslint-disable-next-line import/no-unresolved
import '@rainbow-me/rainbowkit/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import App from './App';
import LayersProvider from './LayersContext';
import { ModalProvider } from './components/Modal';
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
                            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                            <App />
                        </ModalProvider>
                    </LayersProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
