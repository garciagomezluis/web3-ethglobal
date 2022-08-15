/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
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
import { FC, useEffect, useState } from 'react';
import { HiArrowSmRight, HiCheck, HiMinusSm, HiX } from 'react-icons/hi';

import { abi } from '../../artifacts/contracts/LayeralizeFactoryContract.sol/LayeralizeFactoryContract.json';
import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi';

import { usePage } from '../hooks/page';

const CONTRACT_ADDRESS = '0x0BD6166f462896AeaC4ba5cABDbf2c2eDbDD076C';

const pushImages = async (files: File[]) => {
    const formData = new FormData();

    for (const file of files) {
        formData.append(file.name, file);
    }

    const response = await fetch('https://lucho-nft.herokuapp.com/nft/images', {
        method: 'POST',
        body: formData,
    });

    return response.json();
};

const pushMetadata = async (filenames: string[], attrs: any[]) => {
    const metadata = filenames.map((filename, idx) =>
        getMetadataERC1155(filename, attrs[idx], idx),
    );

    const response = await fetch('https://lucho-nft.herokuapp.com/nft/metadata', {
        method: 'POST',
        body: JSON.stringify({
            metadata,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

const getMetadataERC1155 = (filename: string, attrs: any[], i: number) => {
    return {
        description: `Test collection. Layeralize. ETH GLOBAL 2022. Token #${i}`,
        external_url: 'https://github.com/garciagomezluis/web3-ethglobal',
        image: filename,
        name: `Layeralize ETH Global Collection #${i}`,
        attributes: attrs.map((attr: any) => {
            return {
                trait_type: attr.name,
                value: attr.value,
            };
        }),
    };
};

const useJob = (job: (...args: any[]) => any) => {
    const [doing, setDoing] = useState(false);
    const [done, setDone] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState<unknown>();

    const go = async (...args: any[]) => {
        setDone(false);
        setDoing(true);

        setData(null);

        let response = null;

        try {
            response = await job(...args);
        } catch (err) {
            setError(err);
        }

        setDoing(false);
        setDone(true);

        setData(response);

        return response;
    };

    return { go, done, doing, data, error };
};

const useContract = (cid: string | null, amount: number) => {
    const { config } = usePrepareContractWrite({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'createCollection',
        enabled: cid !== null,
        args: [cid, amount],
    });

    const { writeAsync, data } = useContractWrite(config);

    const { status } = useWaitForTransaction({
        hash: data?.hash,
    });

    return {
        writeAsync,
        status,
        txHash: data?.hash,
    };
};

const usePublish = (files: File[], attrs: any[]) => {
    const images = useJob(pushImages);
    const metadata = useJob(pushMetadata);

    const publish = async () => {
        const { filenames } = await images.go(files);

        const { cid } = await metadata.go(filenames, attrs);

        return cid;
    };

    return {
        images,
        metadata,
        publish,
    };
};

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
    const [error, setError] = useState('');

    const { images, metadata, publish } = usePublish(files, attrs);

    const { go: push, done: doneUpload, doing: doingUpload, data: cid } = useJob(publish);

    const { writeAsync, status: statusTx, txHash } = useContract(cid, files.length);

    const errorTx = statusTx === 'error' || error !== '';
    const doneTx = statusTx === 'success' || errorTx;
    const doingTx = doneUpload && !doneTx;

    const tx = {
        error: errorTx,
        done: doneTx,
        doing: doingTx,
        hash: txHash,
    };

    const doing = doingUpload || doingTx;
    const done = doneUpload && doneTx;

    useEffect(() => {
        push(files, attrs);
    }, []);

    useEffect(() => {
        if (doingTx && writeAsync) {
            writeAsync().catch((error) => setError(`Please, try again: ${error.message}`));
        }
    }, [writeAsync]);

    useEffect(() => {
        if (statusTx === 'error') setError('Please, check the transaction and try again');
    }, [statusTx]);

    return (
        <>
            <ModalBody>
                <StepsView images={images} metadata={metadata} tx={tx} />
                {done && <Text mt="5">{error || 'Collection uploaded successfully'}</Text>}
            </ModalBody>
            <ModalFooter>
                <Button isLoading={doing} loadingText="Loading" onClick={onMintEnd}>
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
