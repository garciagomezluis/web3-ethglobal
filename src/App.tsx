/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Accordion, Button, Container, HStack, useDisclosure } from '@chakra-ui/react';

import { AiFillPlusCircle } from 'react-icons/ai';
import { FC, useEffect } from 'react';

import Layer from './components/Layer';

import { ConnectButton } from './components/ConnectButton';
import PreviewDrawer from './components/PreviewDrawer';
import useError from './hooks/error';
import { useGlobal } from './GlobalContext';
import useLayers from './hooks/layers';

const AppMenu: FC<{ onPreviewOpen: () => void }> = ({ onPreviewOpen }) => {
    const { createLayer } = useLayers({});
    const { generateImages } = useGlobal();
    const { showError } = useError({ showErrorTitle: 'Please check' });

    const handleOpenPreview = () => {
        generateImages()
            .then(onPreviewOpen)
            .catch(({ message }) => showError(message));
    };

    return (
        <>
            <Button colorScheme="pink" leftIcon={<AiFillPlusCircle />} onClick={createLayer}>
                Add layer
            </Button>
            <Button colorScheme="pink" onClick={handleOpenPreview}>
                Preview
            </Button>
            <ConnectButton />
        </>
    );
};

function App() {
    const { layers } = useLayers({});

    const {
        isOpen: isPreviewOpen,
        onOpen: onPreviewOpen,
        onClose: onPreviewClose,
    } = useDisclosure();

    useEffect(() => console.log('render App'));

    return (
        <>
            <PreviewDrawer isOpen={isPreviewOpen} onClose={onPreviewClose} />
            <Container maxW="container.xl">
                <Accordion>
                    {layers.map(({ id }, i) => (
                        <Layer key={id} id={id} index={i} />
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
