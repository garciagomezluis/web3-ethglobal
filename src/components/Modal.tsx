/* eslint-disable no-unused-vars */
import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';

import { FC, createContext, useContext, useState } from 'react';

type ModalConfigType = {
    element: FC | null;
    props: any;
    locked?: boolean;
};

const ModalContext = createContext<{
    open: (modalConfig: ModalConfigType) => void;
    close: () => void;
}>({
    open: () => {},
    close: () => {},
});

export const useModal = () => {
    return useContext(ModalContext);
};

const defaultModalConfig: ModalConfigType = {
    element: null,
    props: {},
    locked: false,
};

export const ModalProvider: FC = ({ children }) => {
    const [{ element: Element, props, locked }, setModalConfig] = useState(defaultModalConfig);

    const { isOpen, onClose, onOpen } = useDisclosure();

    const open = ({ element, props, locked = false }: ModalConfigType) => {
        setModalConfig({
            locked,
            element,
            props,
        });
        onOpen();
    };

    const close = () => {
        setModalConfig(defaultModalConfig);
        onClose();
    };

    return (
        <ModalContext.Provider value={{ open, close }}>
            <Modal
                closeOnEsc={!locked}
                closeOnOverlayClick={!locked}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton disabled={locked} />
                    {Element !== null && <Element {...props} />}
                </ModalContent>
            </Modal>
            {children}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
