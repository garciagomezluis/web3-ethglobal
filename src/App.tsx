import { Accordion, Button, Container, HStack, Spacer, useDisclosure } from '@chakra-ui/react';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { AiFillPlusCircle } from 'react-icons/ai';
import { FC, useEffect } from 'react';

import { useLayers } from './LayersContext';

import Layer from './components/Layer';
import PreviewDrawer from './components/PreviewDrawer';
import useError from './hooks/error';

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
            <Button colorScheme="pink" disabled={!dirty} onClick={reset}>
                Clear
            </Button>
            <Spacer />
            <Button colorScheme="pink" leftIcon={<AiFillPlusCircle />} onClick={createLayer}>
                Add layer
            </Button>
            <Button colorScheme="pink" onClick={handleOpenPreview}>
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
        reset();
    }, []);

    const onMintEnd = () => {
        onPreviewClose();
        reset();
    };

    return (
        <>
            <PreviewDrawer isOpen={isPreviewOpen} onClose={onPreviewClose} onMintEnd={onMintEnd} />

            <Container maxW="container.xl" p="4">
                <HStack>
                    <Spacer />
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
