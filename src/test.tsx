/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
// @ts-ignore

const getImage = (type) => {
    const rndType = Math.floor(Math.random() * 3);
    const rndValue = 1 + Math.floor(Math.random() * 4);

    if (type === '' && rndType === 0) type = 'al';
    if (type === '' && rndType === 1) type = 'e';
    if (type === '' && rndType === 2) type = 'am';

    return {
        id: Math.random().toString().substring(2),
        type,
        value: rndValue,
    };
};

const createExample = () => {
    const layers = [];

    const AMOUNT_LAYERS = 3;
    const MAX_AMOUNT_IMAGES = 5;

    for (let i = 0; i < AMOUNT_LAYERS; i++) {
        const imagesAmount = Math.floor(Math.random() * MAX_AMOUNT_IMAGES);

        const layer = [];

        for (let j = 0; j < imagesAmount; j++) {
            layer.push(getImage(''));
        }

        if (layer.every((image) => image.type !== 'al')) layer.push(getImage('al'));

        layers.push(layer);
    }

    return layers;
};

const removeItem = (arr, i) => arr.splice(i, 1);

const getDistribution = (images, percentages = false) => {
    const distribution = {};

    for (let i = 0; i < images.length; i++) {
        const image = images[i];

        for (let j = 0; j < image.length; j++) {
            const layer = image[j];

            distribution[layer.id] = (distribution[layer.id] || 0) + 1;
        }
    }

    if (percentages) {
        for (const id in distribution) {
            distribution[id] = (distribution[id] * 100) / images.length;
        }
    }

    return distribution;
};

const checkConfigs = (layers, images) => {
    const invalid = [];

    const distribution = getDistribution(images);

    const allConfigs = layers.flat();

    for (const id in distribution) {
        const config = allConfigs.find((c) => c.id === id);

        if (
            !(
                (config.type === 'e' && distribution[id] === config.value) ||
                (config.type === 'al' && distribution[id] >= config.value) ||
                (config.type === 'am' && distribution[id] <= config.value)
            )
        )
            invalid.push(id);
    }

    return { invalid, distribution };
};

const combineLayers = (layersCopy, k, type) => {
    const images = [];

    const currentLayer = layersCopy[k];

    for (let i = 0; i < currentLayer.length; i++) {
        // imagen de layer principal
        const currentImage = currentLayer[i];

        if (currentImage.type !== type) continue;

        while (currentImage.value > 0) {
            // repeticiones de imagen
            const image = [];

            for (let j = 0; j < layersCopy.length; j++) {
                // otras layers

                if (j === k) {
                    image.push(currentImage);

                    currentImage.value--;

                    continue;
                }

                const idx = Math.floor(Math.random() * layersCopy[j].length);

                const rndImage = layersCopy[j][idx];

                if (--rndImage.value === 0 && rndImage.type !== 'al') {
                    removeItem(layersCopy[j], idx);
                }

                image.push(rndImage);
            }

            images.push(image);
        }

        if (currentImage.type !== 'al') {
            removeItem(currentLayer, i);
            --i;
        }
    }

    return images;
};

const combine = (layers) => {
    const layersCopy = JSON.parse(JSON.stringify(layers));
    let images = [];

    for (let i = 0; i < layersCopy.length; i++) {
        images = [...images, ...combineLayers(layersCopy, i, 'e')];
    }

    for (let i = 0; i < layersCopy.length; i++) {
        images = [...images, ...combineLayers(layersCopy, i, 'al')];
    }

    return images;
};

const layers = createExample();

console.log(`layers`, layers);

const resultChecks = [];

for (let i = 0; i < 2; i++) {
    const images = combine(layers);

    // console.log(`images`, images);
    const check = checkConfigs(layers, images);

    console.log(check);
    console.log(images);
    console.log(getDistribution(images, true));

    resultChecks.push(check);
}

console.log(resultChecks.every((x) => x));
