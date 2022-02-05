/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { LayerType } from './GlobalContext';
import { UsageType, getRandomInt } from './Commons';

interface Candidate {
    idx: number;
    type: UsageType;
}

interface UsageMap {
    [k: string]: number;
}

interface ControlMap {
    [k: string]: UsageMap;
}

export const checkLayerCannotBeEmpty = (layers: LayerType[]) => {
    const failingLayers = layers
        .filter((layer) => layer.gallery.images.length === 0)
        .map((layer) => layer.name);

    return failingLayers;
};

export const checkAtLeastByLayer = (layers: LayerType[]) => {
    const failingLayers = layers
        .filter((layer) => {
            const amountOK = layer.gallery.images.filter((image) => {
                return image.usageType === 'atleast';
            }).length;

            return amountOK === 0;
        })
        .map((layer) => layer.name);

    return failingLayers;
};

export const checkAllImagesWithData = (layers: LayerType[]) => {
    const failingLayers: any = {};

    for (let i = 0; i < layers.length; i++) {
        const currentLayer = layers[i];

        for (let j = 0; j < currentLayer.gallery.images.length; j++) {
            if (currentLayer.gallery.images[j].traitValue === '') {
                failingLayers[i] = failingLayers[i] || [];
                failingLayers[i].push(j);
            }
        }
    }

    return failingLayers;
};

const initializeMap = (layers: LayerType[]) => {
    const map: ControlMap = {};

    for (let i = 0; i < layers.length; i++) {
        for (let j = 0; j < layers[i].gallery.images.length; j++) {
            const image = layers[i].gallery.images[j];

            map[image.usageType] = map[image.usageType] || {};

            map[image.usageType][`${i}-${j}`] = image.usageValue;
        }
    }

    return map;
};

const finishedMapExact = (map: ControlMap) => {
    let exactDone = true;

    for (const k in map.exact) {
        exactDone = exactDone && map.exact[k] === 0;
    }

    return exactDone;
};

const finishedMapAtMost = (map: ControlMap) => {
    let atMostDone = true;

    for (const k in map.atmost) {
        atMostDone = atMostDone && map.atmost[k] >= 0;
    }

    return atMostDone;
};

const finishedMapAtLeast = (map: ControlMap) => {
    let atLeastDone = true;

    for (const k in map.atleast) {
        atLeastDone = atLeastDone && map.atleast[k] <= 0;
    }

    return atLeastDone;
};

const getCombination = (layers: LayerType[]) => {
    return layers.map((layer) => {
        const rnd = getRandomInt(0, layer.gallery.images.length - 1);

        return {
            idx: rnd,
            type: layer.gallery.images[rnd].usageType,
        } as Candidate;
    });
};

export const getAllCombiations = (layers: LayerType[]) => {
    const map = initializeMap(layers);

    const combinations: string[] = [];

    while (!(finishedMapExact(map) && finishedMapAtMost(map) && finishedMapAtLeast(map))) {
        const combination: Candidate[] = getCombination(layers);

        saveCombinationIfValid(map, combination, combinations);
    }

    return combinations;
};

const saveCombinationIfValid = (
    map: ControlMap,
    combination: Candidate[],
    combinations: string[],
) => {
    const stringifiedCombination = combination.map((c) => c.idx).join('');
    let valid = combinations.indexOf(stringifiedCombination) === -1;

    for (let i = 0; i < combination.length && valid; i++) {
        const image = combination[i];

        const value = map[image.type][`${i}-${image.idx}`];

        if (image.type === 'exact' && value === 0) valid = false;

        if (image.type === 'atmost' && value === 0) valid = false;
    }

    if (valid) {
        for (let i = 0; i < combination.length && valid; i++) {
            const image = combination[i];

            map[image.type][`${i}-${image.idx}`]--;
        }

        combinations.push(stringifiedCombination);
    }

    return valid;
};
