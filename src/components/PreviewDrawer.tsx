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

import ConnectButton from './ConnectButton';
import MintModal from './MintModal';
import Preview from './Preview';
import { useGlobal } from '../GlobalContext';
import { useModal } from './Modal';
import { useMoralisFile } from 'react-moralis';

const PreviewDrawer: FC<any> = ({ isOpen, onClose }) => {
    const { isUploading } = useMoralisFile();

    const { open, close } = useModal();

    const { images, traits } = useGlobal();

    const openModal = () => {
        open({
            element: MintModal,
            props: {
                onClose: close,
                attrs: traits,
                files: images,
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
                    <Preview images={images} traits={traits} />
                </DrawerBody>
                <DrawerFooter>
                    {isUploading ? 'cargando...' : ''}
                    <HStack w="full">
                        <Spacer />
                        <ConnectButton type="actionable">
                            <Button colorScheme="pink" onClick={openModal}>
                                Mint collection
                            </Button>
                        </ConnectButton>
                    </HStack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default PreviewDrawer;
