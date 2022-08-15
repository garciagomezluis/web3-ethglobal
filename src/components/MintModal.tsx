import {
    Button,
    Code,
    Link,
    List,
    ListIcon,
    ListItem,
    ModalBody,
    ModalFooter,
    Text,
    VStack,
} from '@chakra-ui/react';
import { HiArrowSmRight, HiCheck, HiMinusSm, HiX } from 'react-icons/hi';

import { FC } from 'react';
import { useAccount } from 'wagmi';
import { usePage } from '../hooks/page';
import { usePush } from '../hooks/push';

const Item: FC<{ doing: boolean; done: boolean; error: boolean }> = ({
    doing,
    done,
    error,
    children,
}) => {
    let Icon = HiMinusSm;

    if (doing) Icon = HiArrowSmRight;
    if (done) Icon = HiCheck;
    if (error) Icon = HiX;

    return (
        <ListItem>
            {Icon && <ListIcon as={Icon} color="pink.500" />}
            {children}
        </ListItem>
    );
};

const StepsView: FC<{
    images: any;
    metadata: any;
    tx: any;
}> = ({ images, metadata, tx }) => {
    const { doing: doingImages, done: doneImages, error: errorImages } = images;
    const { doing: doingMetadata, done: doneMetadata, error: errorMetadata } = metadata;
    const { doing: doingTx, done: doneTx, error: errorTx, hash } = tx;

    return (
        <>
            <VStack w="full">
                <Text color="pink.500" fontWeight="bold" w="full">
                    Uploading resources
                </Text>
                <List mt="15px !important" spacing={3} w="full">
                    <Item doing={doingImages} done={doneImages} error={errorImages}>
                        Uploading images to IPFS
                    </Item>
                    <Item doing={doingMetadata} done={doneMetadata} error={errorMetadata}>
                        Uploading NFTs metadata
                    </Item>
                </List>
            </VStack>
            <VStack mt="5" w="full">
                <Text color="pink.500" fontWeight="bold" w="full">
                    Finally
                </Text>
                <List spacing={3} w="full">
                    <Item doing={doingTx} done={doneTx} error={errorTx}>
                        Transaction sign
                        {hash && (
                            <Link
                                color="pink.500"
                                href={`https://mumbai.polygonscan.com/tx/${hash}`}
                                ml="20"
                                target="_blank"
                            >
                                View on block explorer
                            </Link>
                        )}
                    </Item>
                </List>
            </VStack>
        </>
    );
};

const DisclaimerView: FC<any> = ({ files, onMintConfirm }) => {
    const { address } = useAccount();

    return (
        <>
            <ModalBody>
                <VStack>
                    <Text>
                        {files.length} images will integrate the collection. This might take a few
                        minutes. You will be required to sign a transaction as the last operation
                        with a network fee. Please, do not close the tab once confirmed.
                    </Text>
                    <Code mt="2" p="1">
                        {address}
                    </Code>
                </VStack>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onMintConfirm}>Confirm</Button>
            </ModalFooter>
        </>
    );
};

const ProgressView: FC<any> = ({ files, attrs, onMintEnd }) => {
    const { images, metadata, tx, doing, done, error } = usePush({ files, attrs });

    return (
        <>
            <ModalBody>
                <StepsView images={images} metadata={metadata} tx={tx} />
                {done && <Text mt="5">{error || 'Collection uploaded successfully'}</Text>}
            </ModalBody>
            <ModalFooter>
                <Button isLoading={doing} loadingText="Loading" onClick={() => onMintEnd(error)}>
                    Done
                </Button>
            </ModalFooter>
        </>
    );
};

export const MintModal: FC<any> = ({ onMintStart, onMintEnd, files, attrs }) => {
    // TODO: probar supabase pushear la data a nftstorage
    // TODO: factorizar en un hook
    // TODO: i18n
    // TODO: config metadata
    // TODO: show link a collection

    const { page, setPage } = usePage({ pages: ['disclaimer', 'progress'] });

    const onMintConfirm = async () => {
        onMintStart();

        setPage('progress');
    };

    if (page === 'disclaimer')
        return <DisclaimerView files={files} onMintConfirm={onMintConfirm} />;

    if (page === 'progress')
        return <ProgressView attrs={attrs} files={files} onMintEnd={onMintEnd} />;

    return <></>;
};

export default MintModal;
