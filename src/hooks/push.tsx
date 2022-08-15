/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */

import { useEffect, useState } from 'react';

import { CustomHook } from '../utils';

import { abi } from '../../artifacts/contracts/LayeralizeFactoryContract.sol/LayeralizeFactoryContract.json';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

const CONTRACT_ADDRESS = '0x0BD6166f462896AeaC4ba5cABDbf2c2eDbDD076C';

export interface UsePushConfig {
    files: File[];
    attrs: any[];
}

export interface UsePushProps {
    images: any;
    metadata: any;
    tx: any;
    doing: boolean;
    done: boolean;
    error: string;
}

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

export const useJob = (job: (...args: any[]) => any) => {
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

export const usePush: CustomHook<UsePushConfig, UsePushProps> = ({ files, attrs }) => {
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

    return { images, metadata, tx, doing, done, error };
};

export default usePush;
