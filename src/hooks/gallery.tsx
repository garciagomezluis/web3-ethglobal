/* eslint-disable no-unused-vars */
import { useState } from 'react';

import {
    CustomHook,
    HEIGHT_PX,
    MAX_AMOUNT_IMAGES,
    WIDTH_PX,
    union,
    validImageDimension,
} from '../utils';

import useError from './error';

const checkDimensions = async (
    newFiles: File[],
    width: number = WIDTH_PX,
    height: number = HEIGHT_PX,
) => {
    const objectURLs = newFiles.map(URL.createObjectURL);
    const dimensionsChecks = objectURLs.map((obj) => validImageDimension(obj, width, height));
    const dimensionsOk = (await Promise.all(dimensionsChecks)).every((x) => x);

    if (!dimensionsOk) {
        return `Images must all be of ${width}x${height}`;
    }

    return true;
};

const mergeFiles = (
    newFiles: File[],
    currentFiles: File[],
    maxAmountImages: number = MAX_AMOUNT_IMAGES,
) => {
    const mergedFiles: File[] = union(newFiles, currentFiles, 'name');

    if (mergedFiles.length > maxAmountImages) {
        return `You can upload up to ${maxAmountImages} images by layer`;
    }

    return mergedFiles;
};

export const useGallery: CustomHook<
    {
        width?: number;
        height?: number;
        maxAmountImages?: number;
    },
    {
        files: File[];
        pushFiles: (newFiles: File[]) => void;
        removeFile: (file: File) => void;
        canPushFiles: boolean;
    }
> = ({ width = WIDTH_PX, height = HEIGHT_PX, maxAmountImages = MAX_AMOUNT_IMAGES }) => {
    const [files, setFiles] = useState<File[]>([]);

    const { showError } = useError({ showErrorTitle: 'Try again' });

    const removeFile = (file: File) => {
        setFiles([...files.filter((file1) => file.name !== file1.name)]);
    };

    const pushFiles = async (newFiles: File[]) => {
        const error = await checkDimensions(newFiles, width, height);

        if (typeof error === 'string') return showError(error);

        const mergedFiles = mergeFiles(newFiles, files, maxAmountImages);

        if (typeof mergedFiles === 'string') return showError(mergedFiles);

        setFiles(mergedFiles);
    };

    return { files, pushFiles, removeFile, canPushFiles: files.length === maxAmountImages };
};

export default useGallery;
