import { CustomHook } from './utils';
import { getNewID } from '../Commons';
import mergeImages from 'merge-images';
import { CombinationData, GlobalContext } from '../GlobalContext';
import { useContext, useEffect, useState } from 'react';

const getBase64Image = async (combination: CombinationData[]) => {
    const names = [...combination.map((image) => URL.createObjectURL(image.file))];

    const b64 = await mergeImages(names);

    return b64;
};

export const useCombinations: CustomHook<
    {},
    {
        toUploadFiles: string[];
        toUploadAttrs: any[];
    }
> = () => {
    const { combinations, insights } = useContext(GlobalContext);

    const [toUploadFiles, setToUploadFiles] = useState<string[]>([]);
    const [toUploadAttrs, setToUploadAttrs] = useState<any[]>([]);

    useEffect(() => {
        // Promise.all([...combinations.map(getBase64Image)]).then(setB64Images);

        Promise.all([
            ...combinations.map(async (combination: CombinationData[]) => {
                return {
                    base64: await getBase64Image(combination),
                    attrs: combination.map((image, layerIndex) => getTrait(layerIndex, image.idx)),
                };
            }),
        ]).then((results) => {
            const abase64 = [];
            const aattrs = [];

            for (let i = 0; i < results.length; i++) {
                abase64.push(results[i].base64);
                aattrs.push(results[i].attrs);
            }

            setToUploadFiles(abase64);
            setToUploadAttrs(aattrs);
        });
    }, [combinations]);

    const getTrait = (layerIndex: number, traitIndex: number) => {
        return {
            name: insights[layerIndex].name,
            value: insights[layerIndex].traits[traitIndex].name,
            usage: insights[layerIndex].traits[traitIndex].usage,
            id: getNewID(),
        };
    };

    return { toUploadFiles, toUploadAttrs };
};

export default useCombinations;
