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

const PreviewDrawer: FC<any> = ({ isOpen, onClose, onMintEnd }) => {
    const { isConnected } = useAccount();

    const { open, close, toggleLock } = useModal();

    const { files, images, traits } = useLayers();

    const openModal = () => {
        open({
            element: MintModal,
            props: {
                onMintEnd: () => {
                    close();
                    onMintEnd();
                },
                onMintStart: () => toggleLock(),
                attrs: traits,
                files,
            },
            locked: false,
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
                    <HStack w="full">
                        <Spacer />
                        <Button disabled={!isConnected} onClick={openModal}>
                            Mint collection
                        </Button>
                    </HStack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default PreviewDrawer;
