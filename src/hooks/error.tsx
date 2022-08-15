/* eslint-disable no-unused-vars */

import { CustomHook } from '../utils';
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

    const showError = (message: string) => {
        toast({
            title: showErrorTitle,
            description: message,
            status: 'warning',
            duration: 3000,
            position: 'bottom-right',
            variant: 'left-accent',
            isClosable: true,
        });
    };

    return { showError };
};

export default useError;
