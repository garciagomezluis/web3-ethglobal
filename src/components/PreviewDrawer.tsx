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

import MintModal from './MintModal';
import Preview from './Preview';
import { useAccount } from 'wagmi';
import { useLayers } from '../LayersContext';
import { useModal } from './Modal';

const PreviewDrawer: FC<any> = ({ isOpen, onClose }) => {
    const { isUploading } = { isUploading: false };

    const { isConnected } = useAccount();

    const { open, close } = useModal();

    const { files, images, traits } = useLayers();

    const openModal = () => {
        open({
            element: MintModal,
            props: {
                onClose: close,
                attrs: traits,
                files,
            },
            locked: true,
            title: 'Collection minting',
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
                    <Preview images={images} traits={traits} />
                </DrawerBody>
                <DrawerFooter>
                    {isUploading ? 'loading...' : ''}
                    <HStack w="full">
                        <Spacer />
                        <Button colorScheme="pink" disabled={!isConnected} onClick={openModal}>
                            Mint collection
                        </Button>
                    </HStack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default PreviewDrawer;
