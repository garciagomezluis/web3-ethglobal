import {
    Accordion,
    Button,
    Container,
    HStack,
    IconButton,
    Spacer,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { AiFillPlusCircle } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';

import { FC, Suspense, lazy, useEffect } from 'react';

import { useLayers } from './LayersContext';

import Layer from './components/Layer';
import useError from './hooks/error';
import { version } from '../package.json';

const loadPreviewDrawer = () => import('./components/PreviewDrawer');
const PreviewDrawer = lazy(loadPreviewDrawer);

const AppMenu: FC<{ onPreviewOpen: () => void }> = ({ onPreviewOpen }) => {
    const { combineLayers, createLayer, reset, dirty } = useLayers();
    const { showError } = useError({ showErrorTitle: 'Please check' });

    const handleOpenPreview = () => {
        combineLayers()
            .then(onPreviewOpen)
            .catch(({ message }) => showError(message));
    };

    return (
        <>
            <Button disabled={!dirty} onClick={reset}>
                Clear
            </Button>
            <Spacer />
            <Button leftIcon={<AiFillPlusCircle />} onClick={createLayer}>
                Add layer
            </Button>
            <Button
                onClick={handleOpenPreview}
                onFocus={loadPreviewDrawer}
                onMouseEnter={loadPreviewDrawer}
            >
                Preview
            </Button>
        </>
    );
};

function App() {
    const { layers, reset } = useLayers();

    const {
        isOpen: isPreviewOpen,
        onOpen: onPreviewOpen,
        onClose: onPreviewClose,
    } = useDisclosure();

    useEffect(() => {
        console.log(version);
        reset();
    }, []);

    const onMintEnd = () => {
        onPreviewClose();
        reset();
    };

    const { toggleColorMode } = useColorMode();
    const ModeIcon = useColorModeValue(FaMoon, FaSun);

    return (
        <>
            <Suspense fallback={isPreviewOpen ? <div>Loading...</div> : <></>}>
                <PreviewDrawer
                    isOpen={isPreviewOpen}
                    onClose={onPreviewClose}
                    onMintEnd={onMintEnd}
                />
            </Suspense>

            <Container maxW="container.xl" p="4">
                <HStack>
                    <Spacer />
                    <IconButton
                        aria-label="toggle color mode"
                        icon={<ModeIcon />}
                        mx="10px !important"
                        onClick={toggleColorMode}
                    />
                    <ConnectButton />
                </HStack>
            </Container>

            <Container maxW="container.xl" p="4">
                <Accordion allowToggle>
                    {layers.map(({ id, name }) => (
                        <Layer key={id} id={id} name={name} />
                    ))}
                </Accordion>

                <HStack my="5">
                    <AppMenu onPreviewOpen={onPreviewOpen} />
                </HStack>
            </Container>
        </>
    );
}

export default App;
