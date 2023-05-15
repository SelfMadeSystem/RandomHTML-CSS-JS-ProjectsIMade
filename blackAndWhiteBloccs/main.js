function doShiet(ortho, diaga, block, corner, instant) {
    const arraySize = 32;
    /**
     * Pixel array with null values for empty pixels. Used internally.
     * @type {Array<Array<null | boolean>>}
     */
    const pixelArray = Array(arraySize)
        .fill(null)
        .map(() => Array(arraySize).fill(null));
    /**
     * Pixel array with null values for empty pixels. Used for drawing.
     * @type {Array<Array<null | boolean>>}
     */
    const livePixelArray = Array(arraySize)
        .fill(null)
        .map(() => Array(arraySize).fill(null));
    /**
     * Queue of pixels to be placed.
     * @type {Array<{x: number, y: number, pixel: boolean}>}
     */
    const pixelQueue = [];

    function outOfRange(x, y) {
        return x < 0 || x >= arraySize || y < 0 || y >= arraySize;
    }

    function getPixel(x, y) {
        if (outOfRange(x, y)) {
            return null;
        }
        return pixelArray[x][y];
    }

    function getLivePixel(x, y) {
        if (outOfRange(x, y)) {
            return null;
        }
        return (instant ? pixelArray : livePixelArray)[x][y];
    }

    function setPixel(x, y, pixel) {
        if (outOfRange(x, y)) {
            return;
        }
        if (getPixel(x, y) !== null) {
            if (pixel === null) {
                pixelArray[x][y] = null;
            }
            return;
        }
        if (pixel === null) {
            return;
        }
        pixelArray[x][y] = pixel;
        pixelQueue.push({ x, y, pixel });
    }

    function setLivePixel(x, y, pixel) {
        if (outOfRange(x, y)) {
            return;
        }
        livePixelArray[x][y] = pixel;
    }

    function dequeuePixel() {
        if (pixelQueue.length === 0) {
            return;
        }
        const { x, y, pixel } = pixelQueue.shift();
        setLivePixel(x, y, pixel);
    }

    function undo() {
        if (pixelQueue.length === 0) {
            return;
        }
        const { x, y } = pixelQueue.pop();
        setPixel(x, y, null);
    }

    function getPixelPoses() {
        const poses = [];
        for (let x = 0; x < arraySize; x++) {
            for (let y = 0; y < arraySize; y++) {
                if (getPixel(x, y) !== null) {
                    poses.push({ x, y });
                }
            }
        }
        return poses;
    }

    function getEdgePixels() {
        const edgePixels = [];
        for (let x = 0; x < arraySize; x++) {
            for (let y = 0; y < arraySize; y++) {
                if (getPixel(x, y) === null) {
                    if (
                        getPixel(x - 1, y) !== null ||
                        getPixel(x + 1, y) !== null ||
                        getPixel(x, y - 1) !== null ||
                        getPixel(x, y + 1) !== null
                    ) {
                        edgePixels.push({ x, y });
                    }
                }
            }
        }
        return edgePixels;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomBoolean() {
        return Math.random() >= 0.5;
    }

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = arraySize * 10;
    canvas.height = arraySize * 10;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let x = 0; x < arraySize; x++) {
            for (let y = 0; y < arraySize; y++) {
                switch (getLivePixel(x, y)) {
                    case null:
                        break;
                    case false:
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(x * 10, y * 10, 10, 10);
                        break;
                    case true:
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(x * 10, y * 10, 10, 10);
                        break;
                }
            }
        }
    }

    function placePixel(x, y, pixel) {
        if (outOfRange(x, y)) {
            return;
        }
        if (getPixel(x, y) !== null) {
            return;
        }

        function houstonWeHaveAProblem() {
            throw new Error('Houston, we have a problem');
        }

        setPixel(x, y, pixel);

        function orthogonallyAdjacentPixelsCheck() {
            if (getPixel(x - 1, y) === pixel) {
                if (getPixel(x + 1, y) === pixel || getPixel(x - 2, y) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x + 1, y, !pixel);
                placePixel(x - 2, y, !pixel);
            }

            if (getPixel(x + 1, y) === pixel) {
                if (getPixel(x - 1, y) === pixel || getPixel(x + 2, y) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x - 1, y, !pixel);
                placePixel(x + 2, y, !pixel);
            }

            if (getPixel(x, y - 1) === pixel) {
                if (getPixel(x, y + 1) === pixel || getPixel(x, y - 2) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x, y + 1, !pixel);
                placePixel(x, y - 2, !pixel);
            }

            if (getPixel(x, y + 1) === pixel) {
                if (getPixel(x, y - 1) === pixel || getPixel(x, y + 2) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x, y - 1, !pixel);
                placePixel(x, y + 2, !pixel);
            }

            if (getPixel(x - 2, y) === pixel) {
                if (getPixel(x - 1, y) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x - 1, y, !pixel);
            }

            if (getPixel(x + 2, y) === pixel) {
                if (getPixel(x + 1, y) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x + 1, y, !pixel);
            }

            if (getPixel(x, y - 2) === pixel) {
                if (getPixel(x, y - 1) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x, y - 1, !pixel);
            }

            if (getPixel(x, y + 2) === pixel) {
                if (getPixel(x, y + 1) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x, y + 1, !pixel);
            }
        }

        function diagonallyAdjacentPixelsCheck() {
            if (getPixel(x - 1, y - 1) === pixel) {
                if (
                    getPixel(x + 1, y + 1) === pixel ||
                    getPixel(x - 2, y - 2) === pixel
                ) {
                    houstonWeHaveAProblem();
                }

                placePixel(x + 1, y + 1, !pixel);
                placePixel(x - 2, y - 2, !pixel);
            }

            if (getPixel(x + 1, y - 1) === pixel) {
                if (
                    getPixel(x - 1, y + 1) === pixel ||
                    getPixel(x + 2, y - 2) === pixel
                ) {
                    houstonWeHaveAProblem();
                }

                placePixel(x - 1, y + 1, !pixel);
                placePixel(x + 2, y - 2, !pixel);
            }

            if (getPixel(x - 1, y + 1) === pixel) {
                if (
                    getPixel(x + 1, y - 1) === pixel ||
                    getPixel(x - 2, y + 2) === pixel
                ) {
                    houstonWeHaveAProblem();
                }

                placePixel(x + 1, y - 1, !pixel);
                placePixel(x - 2, y + 2, !pixel);
            }

            if (getPixel(x + 1, y + 1) === pixel) {
                if (
                    getPixel(x - 1, y - 1) === pixel ||
                    getPixel(x + 2, y + 2) === pixel
                ) {
                    houstonWeHaveAProblem();
                }

                placePixel(x - 1, y - 1, !pixel);
                placePixel(x + 2, y + 2, !pixel);
            }

            if (getPixel(x - 2, y - 2) === pixel) {
                if (getPixel(x - 1, y - 1) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x - 1, y - 1, !pixel);
            }

            if (getPixel(x + 2, y - 2) === pixel) {
                if (getPixel(x + 1, y - 1) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x + 1, y - 1, !pixel);
            }

            if (getPixel(x - 2, y + 2) === pixel) {
                if (getPixel(x - 1, y + 1) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x - 1, y + 1, !pixel);
            }

            if (getPixel(x + 2, y + 2) === pixel) {
                if (getPixel(x + 1, y + 1) === pixel) {
                    houstonWeHaveAProblem();
                }

                placePixel(x + 1, y + 1, !pixel);
            }
        }

        function no2x2BoxCheck() {
            if (getPixel(x - 1, y) === pixel) {
                if (getPixel(x - 1, y - 1) === pixel) {
                    if (getPixel(x, y - 1) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x, y - 1, !pixel);
                }

                if (getPixel(x - 1, y + 1) === pixel) {
                    if (getPixel(x, y + 1) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x, y + 1, !pixel);
                }

                if (getPixel(x, y - 1) === pixel) {
                    if (getPixel(x - 1, y - 1) === pixel) {
                        houstonWeHaveAProblem();
                    }
                    placePixel(x - 1, y - 1, !pixel);
                }

                if (getPixel(x, y + 1) === pixel) {
                    if (getPixel(x - 1, y + 1) === pixel) {
                        houstonWeHaveAProblem();
                    }
                    placePixel(x - 1, y + 1, !pixel);
                }
            }

            if (getPixel(x + 1, y) === pixel) {
                if (getPixel(x + 1, y - 1) === pixel) {
                    if (getPixel(x, y - 1) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x, y - 1, !pixel);
                }

                if (getPixel(x + 1, y + 1) === pixel) {
                    if (getPixel(x, y + 1) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x, y + 1, !pixel);
                }

                if (getPixel(x, y - 1) === pixel) {
                    if (getPixel(x + 1, y - 1) === pixel) {
                        houstonWeHaveAProblem();
                    }
                    placePixel(x + 1, y - 1, !pixel);
                }

                if (getPixel(x, y + 1) === pixel) {
                    if (getPixel(x + 1, y + 1) === pixel) {
                        houstonWeHaveAProblem();
                    }
                    placePixel(x + 1, y + 1, !pixel);
                }
            }

            if (getPixel(x, y - 1) === pixel) {
                if (getPixel(x - 1, y - 1) === pixel) {
                    if (getPixel(x - 1, y) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x - 1, y, !pixel);
                }

                if (getPixel(x + 1, y - 1) === pixel) {
                    if (getPixel(x + 1, y) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x + 1, y, !pixel);
                }
            }

            if (getPixel(x, y + 1) === pixel) {
                if (getPixel(x - 1, y + 1) === pixel) {
                    if (getPixel(x - 1, y) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x - 1, y, !pixel);
                }

                if (getPixel(x + 1, y + 1) === pixel) {
                    if (getPixel(x + 1, y) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x + 1, y, !pixel);
                }
            }
        }

        function noDiagonalOnlyCheck() {
            if (getPixel(x - 1, y) === !pixel) {
                if (getPixel(x, y - 1) === !pixel) {
                    if (getPixel(x - 1, y - 1) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x - 1, y - 1, !pixel);
                }

                if (getPixel(x, y + 1) === !pixel) {
                    if (getPixel(x - 1, y + 1) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x - 1, y + 1, !pixel);
                }
            }

            if (getPixel(x + 1, y) === !pixel) {
                if (getPixel(x, y - 1) === !pixel) {
                    if (getPixel(x + 1, y - 1) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x + 1, y - 1, !pixel);
                }

                if (getPixel(x, y + 1) === !pixel) {
                    if (getPixel(x + 1, y + 1) === pixel) {
                        houstonWeHaveAProblem();
                    }

                    placePixel(x + 1, y + 1, !pixel);
                }
            }

            function c(a, b) {
                if (getPixel(x + a, y + b) === pixel) {
                    if (getPixel(x + a, y) === !pixel) {
                        if (getPixel(x, y + b) === !pixel) {
                            houstonWeHaveAProblem();
                        }

                        placePixel(x, y + b, pixel);
                    }

                    if (getPixel(x, y + b) === !pixel) {
                        if (getPixel(x + a, y) === !pixel) {
                            houstonWeHaveAProblem();
                        }
                        placePixel(x + a, y, pixel);
                    }
                }
            }
            c(1, 1);
            c(1, -1);
            c(-1, 1);
            c(-1, -1);
        }

        if (ortho) orthogonallyAdjacentPixelsCheck();

        if (diaga) diagonallyAdjacentPixelsCheck();

        if (block) no2x2BoxCheck();

        if (corner) noDiagonalOnlyCheck();
    }

    function placeRandomPixel() {
        const pixels = getEdgePixels();
        const randomPixel = pixels[getRandomInt(0, pixels.length - 1)];
        const randomBoolean = getRandomBoolean();
        let queueLength = pixelQueue.length;
        try {
            placePixel(randomPixel.x, randomPixel.y, randomBoolean);
        } catch (e) {
            while (pixelQueue.length > queueLength) {
                undo();
                if (pixelQueue.length === 0) {
                    break;
                }
            }
            placePixel(randomPixel.x, randomPixel.y, !randomBoolean);
        }
    }

    let cancel;

    function update() {
        draw();

        if (pixelQueue.length > 0) {
            dequeuePixel();
        } else {
            return;
        }

        cancel = requestAnimationFrame(update);
    }

    cancel = requestAnimationFrame(update);

    placePixel(
        getRandomInt(0, arraySize - 1),
        getRandomInt(0, arraySize - 1),
        getRandomBoolean()
    );

    let queueLengths = [pixelQueue.length];

    let amnt = 0;

    while (getEdgePixels().length > 0) {
        amnt++;
        if (amnt >= 42069) {
            break;
        }
        try {
            placeRandomPixel();
            queueLengths.push(pixelQueue.length);
        } catch (e) {
            while (pixelQueue.length > queueLengths[queueLengths.length - 1]) {
                undo();
                if (pixelQueue.length === 0) {
                    break;
                }
            }
            queueLengths.pop();
        }
    }

    return () => {
        cancelAnimationFrame(cancel);
    };
}

const orthoCheck = document.getElementById('ortho');
const diagaCheck = document.getElementById('diaga');
const blockCheck = document.getElementById('block');
const instantCheck = document.getElementById('instant');
const cornerCheck = document.getElementById('corner');

const refresh = document.getElementById('refresh');

let cancel = doShiet(
    orthoCheck.checked,
    diagaCheck.checked,
    blockCheck.checked,
    cornerCheck.checked,
    instant.checked
);

refresh.addEventListener('click', () => {
    cancel();

    cancel = doShiet(
        orthoCheck.checked,
        diagaCheck.checked,
        blockCheck.checked,
        cornerCheck.checked,
        instant.checked
    );
});
