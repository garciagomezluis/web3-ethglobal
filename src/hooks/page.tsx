/* eslint-disable no-unused-vars */
import warning from 'warning';
import { useEffect, useState } from 'react';

import { CustomHook } from '../utils';
import useStepper from './stepper';

export interface UsePageConfig {
    pages: string[];
    initialPage?: string;
}

export interface UsePageProps {
    setPage: (page: string) => void;
    page: string;
    next: () => void;
    prev: () => void;
}

export const usePage: CustomHook<UsePageConfig, UsePageProps> = ({ pages, initialPage }) => {
    if (process.env.NODE_ENV !== 'production') {
        useEffect(() => {
            warning(Array.isArray(pages), 'pages must be an string[]');
            warning(pages.length > 0, 'pages must have at least one element');
        }, [pages]);
    }

    if (typeof initialPage === 'undefined') [initialPage] = pages;

    const [currentPage, setCurrentPage] = useState(initialPage);

    const {
        value,
        increment: next,
        decrement: prev,
    } = useStepper({
        minValue: 0,
        maxValue: pages.length,
    });

    useEffect(() => {
        setCurrentPage(pages[value]);
    }, [value]);

    const setPage = (page: string) => {
        if (!pages.includes(page)) throw new Error('page must be declared');

        setCurrentPage(page);
    };

    return {
        setPage,
        page: currentPage,
        next,
        prev,
    };
};

export default usePage;
