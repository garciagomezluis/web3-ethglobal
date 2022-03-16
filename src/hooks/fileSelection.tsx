/* eslint-disable no-unused-vars */
import { CustomHook } from '../utils';
import { useEffect, useRef, useState } from 'react';

const useFileSelection: CustomHook<
    {
        accept: string;
        multiple?: boolean;
        onSelect?: (files: File[]) => void;
    },
    {
        files: File[];
        open: () => void;
    }
> = ({ accept, multiple = false, onSelect = () => {} }) => {
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        input.onchange = (e: any) => {
            const selectedFiles = [...e.target.files];

            setFiles(selectedFiles);
            onSelect(selectedFiles);
        };

        inputRef.current = input;
    }, [accept, multiple, onSelect]);

    const open = () => {
        inputRef.current?.click();
    };

    return { files, open };
};

export default useFileSelection;
