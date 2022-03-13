/* eslint-disable no-unused-vars */
import { useCallback } from 'react';

import { CustomHook } from './utils';
import { useToast } from '@chakra-ui/react';

export const useError: CustomHook<
    {
        showErrorTitle?: string;
    },
    {
        showError: (error: string) => void;
    }
> = ({ showErrorTitle = 'Error' }) => {
    const toast = useToast();

    const showError = useCallback(
        (message: string) => {
            toast({
                title: showErrorTitle,
                description: message,
                status: 'warning',
                duration: 3000,
                position: 'top-right',
                variant: 'left-accent',
                isClosable: true,
            });
        },
        [showErrorTitle],
    );

    return { showError };
};

export default useError;
