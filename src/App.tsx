/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Accordion, Button, Container, HStack, useDisclosure } from '@chakra-ui/react';

import { AiFillPlusCircle } from 'react-icons/ai';
import { useEffect } from 'react';

import Layer from './components/Layer';

import { ConnectButton } from './components/ConnectButton';
import PreviewDrawer from './components/PreviewDrawer';
import useError from './hooks/error';
import { useGlobal } from './GlobalContext';
import useLayers from './hooks/layers';

function App() {
    const { generateImages } = useGlobal();
    const { showError } = useError({ showErrorTitle: 'Please check' });

    const { layers, createLayer, removeLayer, moveLayer, allowMoveLayer, renameLayer } = useLayers(
        {},
    );

    const {
        isOpen: isPreviewOpen,
        onOpen: onPreviewOpen,
        onClose: onPreviewClose,
    } = useDisclosure();

    useEffect(() => console.log('render App'));

    const handleOpenPreview = () => {
        generateImages()
            .then(onPreviewOpen)
            .catch((err) => showError(err.message));
    };

    return (
        <>
            <PreviewDrawer isOpen={isPreviewOpen} onClose={onPreviewClose} />
            <Container maxW="container.xl">
                <Accordion>
                    {layers.map((layer, i) => (
                        <Layer
                            key={layer.id}
                            allowDelete={layers.length !== 2}
                            allowMoveDown={allowMoveLayer(i, 'down')}
                            allowMoveUp={allowMoveLayer(i, 'up')}
                            id={layer.id}
                            index={i}
                            onMove={moveLayer}
                            onRemove={removeLayer}
                            onRename={renameLayer}
                        />
                    ))}
                </Accordion>

                <HStack my="5">
                    <Button
                        colorScheme="pink"
                        leftIcon={<AiFillPlusCircle />}
                        variant="solid"
                        onClick={createLayer}
                    >
                        Add layer
                    </Button>

                    <Button colorScheme="pink" variant="solid" onClick={handleOpenPreview}>
                        Preview
                    </Button>
                    <ConnectButton />
                </HStack>
            </Container>
        </>
    );
}

export default App;
