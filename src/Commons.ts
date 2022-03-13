/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
export const WIDTH_PX = 300;
export const HEIGHT_PX = 300;
export const MAX_AMOUNT_IMAGES = 10;
export type UsageType = 'atmost' | 'atleast' | 'exact';
export type UpDownType = 'up' | 'down';
export const getUsageText = (usageType: UsageType) => {
    if (usageType === 'atleast') return 'At least';
    if (usageType === 'atmost') return 'At most';

    return 'Exact';
};
export const union = (obj1: any[], obj2: any[], key: string) => {
    const diff = [];

    for (const e1 of obj1) {
        let exists = false;

        for (const e2 of obj2) {
            if (e2[key] === e1[key]) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            diff.push(e1);
        }
    }

    return [...diff, ...obj2];
};
export const validImageDimension = async (
    url: string,
    width: number = WIDTH_PX,
    height: number = HEIGHT_PX,
) => {
    const img: HTMLImageElement = document.createElement('img');

    img.src = url;

    return new Promise((resolve, reject) => {
        img.onerror = reject;

        img.onload = () => {
            if (img.naturalWidth === width && img.naturalHeight === height) {
                resolve(true);

                return;
            }
            resolve(false);
        };
    });
};
export const filesToURL = (files: File[]) => files.map((file) => URL.createObjectURL(file));
export const getNewID = () => Math.random().toString().substring(2);

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
