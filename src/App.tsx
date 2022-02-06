/* eslint-disable no-underscore-dangle */
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
import { FC, useContext, useEffect, useState } from 'react';

import { AiFillPlusCircle } from 'react-icons/ai';

import Layer from './Layer';
import Preview from './Preview';
import axios from 'axios';
import { GlobalContext, LayerType } from './GlobalContext';
import { useMoralis, useMoralisFile } from 'react-moralis';

import { HiArrowSmRight, HiCheck } from 'react-icons/hi';

function leftFillNum(num: number, targetLength: number) {
    return num.toString().padStart(targetLength, '0');
}

const createFolderIPFS = async (content: any) => {
    try {
        const res = await axios.post(
            'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
            content,
            {
                headers: {
                    'X-API-Key': 'NNOI1SY6ieKzX3kBRjKHQNMunOVQ8oa66uaW4O18gu8Z2cizt6NNZctPlXPjdj4T',
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
            },
        );

        const exampleUri = res.data[0].path;

        return exampleUri.substr(exampleUri.indexOf('Qm'), 46);
    } catch (error) {
        console.log(error);
    }
};

const getMetadataERC1155 = (imageHash: string, attrs: any[], i: number) => {
    return {
        description: `#${i}`,
        external_url: 'holamundo.com',
        image: `ipfs://${imageHash}/images/${leftFillNum(i, 64)}.png`,
        name: 'Layeralize ETH Global Collection',
        attributes: attrs.map((attr: any) => {
            return {
                name: attr.name,
                value: attr.value,
            };
        }),
    };
};

const MintModal: FC<any> = ({ isOpen, onClose, files, attrs }) => {
    const { error } = useMoralisFile();
    const { account } = useMoralis();

    const toast = useToast();

    const [uploading, setUploading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingMetadata, setUploadingMetadata] = useState(false);
    const [makingTransaction, setMakingTransaction] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (done) {
            setUploadingImage(false);
            setUploadingMetadata(false);
            setMakingTransaction(false);
        }
    }, [done]);

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

    const onMintConfirm = async () => {
        if (done) {
            setDone(false);

            return onClose();
        }

        setUploading(true);

        const ipfsCidImages = await uploadImages();

        const ipfsCidMetadata = await uploadMetadata(ipfsCidImages);

        setUploading(false);

        console.log(ipfsCidMetadata);

        setDone(true);
    };

    const uploadImages = async () => {
        setUploadingImage(true);

        const ipfsContent = [];

        for (let i = 0; i < files.length; i++) {
            ipfsContent.push({
                path: `images/${leftFillNum(i, 64)}.png`,
                content: files[i],
            });
        }

        const ipfsCid = await createFolderIPFS(ipfsContent);

        setUploadingImage(false);

        return ipfsCid;
    };

    const uploadMetadata = async (ipfsCidImages: string) => {
        setUploadingMetadata(true);

        const ipfsContent = [];

        for (let i = 0; i < files.length; i++) {
            ipfsContent.push({
                path: `metadata/${leftFillNum(i, 64)}.json`,
                content: getMetadataERC1155(ipfsCidImages, attrs[i], i),
            });
        }

        const ipfsCid = await createFolderIPFS(ipfsContent);

        setUploadingMetadata(false);

        return ipfsCid;
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
                    <>
                        <VStack display={uploading || done ? 'flex' : 'none'} w="full">
                            <Text color="pink.500" fontWeight="bold" w="full">
                                Uploading resources
                            </Text>
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
                        <VStack display={uploading || done ? 'flex' : 'none'} mt="5" w="full">
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
                    <VStack display={!uploading && !done ? 'flex' : 'none'}>
                        <Text>
                            {files.length} images will integrate the collection. This might take a
                            few minutes. You will be required to sign a transaction as the last
                            operation with a network fee. Please, do not close the tab once
                            confirmed.
                        </Text>
                        <Text mt="2">{account}</Text>
                    </VStack>
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
