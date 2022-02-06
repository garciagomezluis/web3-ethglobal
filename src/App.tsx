/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
    Accordion,
    Button,
    Container,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Image,
    List,
    ListIcon,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    VStack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { FC, useContext, useEffect, useRef, useState } from 'react';

import { AiFillPlusCircle } from 'react-icons/ai';

import Layer from './Layer';
import Preview from './Preview';
import { GlobalContext, LayerType } from './GlobalContext';
import { useMoralis, useMoralisFile } from 'react-moralis';

import { HiArrowSmRight, HiCheck } from 'react-icons/hi';

const getMetaDataObject = (imageHash: string, attrs: any[]) => {
    return {
        description: 'Una linda colección',
        external_url: 'holamundo.com',
        image: `ipfs://${imageHash}`,
        name: 'Hola Mundo Colletion!',
        attributes: attrs.map((attr: any) => {
            return {
                name: attr.name,
                value: attr.value,
            };
        }),
    };
};

const MintModal: FC<any> = ({ isOpen, onClose, files, attrs }) => {
    const { error, moralisFile, saveFile } = useMoralisFile();

    const toast = useToast();
    const imgRef = useRef<HTMLImageElement>(null);

    const [uploading, setUploading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingMetadata, setUploadingMetadata] = useState(false);
    const [makingTransaction, setMakingTransaction] = useState(false);
    const [ipfsImages, setIpfsImages] = useState<any[]>([]);
    const [ipfsMeta, setIpfsMeta] = useState<any[]>([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        setUploading(uploadingImage || uploadingMetadata || makingTransaction);
    }, [uploadingImage, uploadingMetadata, makingTransaction]);

    useEffect(() => {
        if (error) {
            toast({
                title: 'Please, retry',
                description: error?.message,
                status: 'error',
                duration: 3000,
                position: 'top-right',
                variant: 'left-accent',
                isClosable: true,
            });
        }
    }, [error]);

    useEffect(() => {
        console.log(ipfsMeta, ipfsImages);
    }, [ipfsImages, ipfsMeta]);

    useEffect(() => {
        if (moralisFile !== null) {
            if (uploadingImage) {
                setIpfsImages((prev) => [
                    ...prev,
                    { _hash: moralisFile._hash, _ipfs: moralisFile._ipfs },
                ]);
            }

            if (uploadingMetadata) {
                setIpfsMeta((prev) => [
                    ...prev,
                    { _hash: moralisFile._hash, _ipfs: moralisFile._ipfs },
                ]);
            }
        }
    }, [moralisFile]);

    useEffect(() => {
        (async () => {
            if (files.length !== 0 && ipfsImages.length === files.length) {
                uploadMeta();
            }
        })();
    }, [ipfsImages]);

    useEffect(() => {
        (async () => {
            if (files.length !== 0 && ipfsMeta.length === files.length) {
                setDone(true);
            }
        })();
    }, [ipfsMeta]);

    const onMintConfirm = async () => {
        if (done) return onClose();

        await uploadImages();
    };

    const uploadImages = async () => {
        setUploadingImage(true);
        for (let i = 0; i < files.length; i++) {
            if (imgRef.current !== null) {
                imgRef.current.src = files[i];
            }

            await saveFile(`${i}.png`, { base64: files[i] }, { saveIPFS: true });
        }
        setUploadingImage(false);
    };

    const uploadMeta = async () => {
        setUploadingMetadata(true);
        for (let i = 0; i < files.length; i++) {
            if (imgRef.current !== null) {
                imgRef.current.src = files[i];
            }

            const meta = getMetaDataObject(ipfsImages[i]._hash, attrs[i]);

            await saveFile(
                `meta-${i}.json`,
                { base64: btoa(JSON.stringify(meta)) },
                { saveIPFS: true },
            );
        }
        setUploadingMetadata(false);
    };

    return (
        <Modal
            closeOnEsc={!uploading}
            closeOnOverlayClick={!uploading}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Collection minting</ModalHeader>
                <ModalCloseButton disabled={uploading} />
                <ModalBody>
                    {(uploading || done) && (
                        <>
                            <VStack w="full">
                                <Text color="pink.500" fontWeight="bold" w="full">
                                    Uploading resources
                                </Text>
                                <Image ref={imgRef} boxSize="100px" />
                                <List mt="15px !important" spacing={3} w="full">
                                    <ListItem>
                                        {(uploadingImage || done) && (
                                            <ListIcon
                                                as={done ? HiCheck : HiArrowSmRight}
                                                color="pink.500"
                                            />
                                        )}
                                        Uploading image to IPFS
                                    </ListItem>
                                    <ListItem>
                                        {(uploadingMetadata || done) && (
                                            <ListIcon
                                                as={done ? HiCheck : HiArrowSmRight}
                                                color="pink.500"
                                            />
                                        )}
                                        Uploading NFT metadata
                                    </ListItem>
                                </List>
                            </VStack>
                            <VStack mt="5" w="full">
                                <Text color="pink.500" fontWeight="bold" w="full">
                                    Finally
                                </Text>
                                <List spacing={3} w="full">
                                    <ListItem>
                                        {(makingTransaction || done) && (
                                            <ListIcon
                                                as={done ? HiCheck : HiArrowSmRight}
                                                color="pink.500"
                                            />
                                        )}
                                        Transaction sign
                                    </ListItem>
                                </List>
                            </VStack>
                        </>
                    )}
                    {!(uploading || done) && (
                        <VStack>
                            <Text>
                                {files.length} images will integrate the collection. This might take
                                a few minutes. You will be required to sign a transaction as the
                                last operation with a network fee. Please, do not close the tab once
                                confirmed.
                            </Text>
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="pink"
                        isLoading={uploading}
                        loadingText="Loading"
                        onClick={onMintConfirm}
                    >
                        {done ? 'Done' : 'Confirm'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

function App() {
    const { getLayers, createLayer, calculateCombinations, combinations, generalError } =
        useContext(GlobalContext);

    const [toUploadFiles, setToUploadFiles] = useState<string[]>([]);
    const [toUploadAttrs, setToUploadAttrs] = useState<any[]>([]);

    const layers = getLayers();

    const toast = useToast();

    const {
        isOpen: isPreviewOpen,
        onOpen: onPreviewOpen,
        onClose: onPreviewClose,
    } = useDisclosure();

    const { isOpen: isMintOpen, onOpen: onMintOpen, onClose: onMintClose } = useDisclosure();

    const { authenticate, isAuthenticated, logout } = useMoralis();

    const { isUploading } = useMoralisFile();

    useEffect(() => {
        createLayer();
        createLayer();
    }, []);

    const previewClick = () => {
        if (combinations.length !== 0 || calculateCombinations()) {
            onPreviewOpen();
        }
    };

    useEffect(() => {
        if (generalError !== '') {
            toast({
                title: 'Please check',
                description: generalError,
                status: 'warning',
                duration: 3000,
                position: 'top-right',
                variant: 'left-accent',
                isClosable: true,
            });
        }
    }, [generalError]);

    return (
        <>
            <MintModal
                attrs={toUploadAttrs}
                files={toUploadFiles}
                isOpen={isMintOpen}
                onClose={onMintClose}
            />
            <Drawer isOpen={isPreviewOpen} size="md" onClose={onPreviewClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader bg="pink.500" color="white" fontSize="xl">
                        Collection preview
                    </DrawerHeader>
                    <DrawerBody>
                        <Preview
                            attrs={toUploadAttrs}
                            b64Images={toUploadFiles}
                            setAttrs={setToUploadAttrs}
                            setB64Images={setToUploadFiles}
                        />
                    </DrawerBody>
                    <DrawerFooter>
                        {isUploading ? 'cargando...' : ''}
                        <HStack w="full">
                            <Spacer />
                            {!isAuthenticated && (
                                <Button
                                    colorScheme="pink"
                                    variant="solid"
                                    onClick={() => authenticate({ signingMessage: 'Hola mundo!' })}
                                >
                                    Connect wallet
                                </Button>
                            )}
                            {isAuthenticated && (
                                <Button colorScheme="pink" variant="solid" onClick={onMintOpen}>
                                    Mint collection
                                </Button>
                            )}
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Container maxW="container.xl">
                <Accordion>
                    {layers.map((layer: LayerType, i: number) => (
                        <Layer
                            key={layer.id}
                            gallery={layer.gallery}
                            id={layer.id}
                            moveDownAllowed={i < layers.length - 1}
                            moveUpAllowed={i > 0}
                            name={layer.name}
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

                    <Button
                        colorScheme="pink"
                        disabled={generalError !== ''}
                        variant="solid"
                        onClick={previewClick}
                    >
                        Preview
                    </Button>
                    {!isAuthenticated && (
                        <Button
                            colorScheme="pink"
                            variant="solid"
                            onClick={() => authenticate({ signingMessage: 'Hola mundo!' })}
                        >
                            Connect wallet
                        </Button>
                    )}
                    {isAuthenticated && (
                        <Button colorScheme="pink" variant="solid" onClick={() => logout()}>
                            Disconnect
                        </Button>
                    )}
                </HStack>
            </Container>
        </>
    );
}

export default App;
