import { FC } from 'react';
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Spacer,
} from '@chakra-ui/react';
import { useMoralis, useMoralisFile } from 'react-moralis';

import MintModal from './MintModal';
import Preview from './Preview';
import useCombinations from '../hooks/combinations';
import { useModal } from './Modal';

const PreviewDrawer: FC<any> = ({ isOpen, onClose }) => {
    const { enableWeb3, isWeb3Enabled } = useMoralis();

    const { isUploading } = useMoralisFile();

    const { open, close } = useModal();

    const { toUploadFiles, toUploadAttrs } = useCombinations({});

    const openModal = () => {
        open({
            element: MintModal,
            props: {
                onClose: close,
                attrs: toUploadAttrs,
                files: toUploadFiles,
            },
            locked: false,
        });
    };

    return (
        <Drawer isOpen={isOpen} size="md" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader bg="pink.500" color="white" fontSize="xl">
                    Collection preview
                </DrawerHeader>
                <DrawerBody>
                    <Preview attrs={toUploadAttrs} b64Images={toUploadFiles} />
                </DrawerBody>
                <DrawerFooter>
                    {isUploading ? 'cargando...' : ''}
                    <HStack w="full">
                        <Spacer />
                        {!isWeb3Enabled && (
                            <Button
                                colorScheme="pink"
                                variant="solid"
                                onClick={() =>
                                    enableWeb3({
                                        chainId: 80001,
                                    })
                                }
                            >
                                Connect wallet
                            </Button>
                        )}
                        {isWeb3Enabled && (
                            <Button colorScheme="pink" variant="solid" onClick={openModal}>
                                Mint collection
                            </Button>
                        )}
                    </HStack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default PreviewDrawer;
