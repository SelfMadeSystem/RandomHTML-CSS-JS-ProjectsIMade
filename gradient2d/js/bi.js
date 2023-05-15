function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        r * 255,
        g * 255,
        b * 255
    ];
}

function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [
        h,
        s,
        v
    ];
}

var bi = function (resX, resY, container) {

    var arr = [];

    function make(x, y, v) {
        v = RGBtoHSV(...v);
        return { x, y, v, dist: 0, weight: 0 };
    }

    var cnv = document.createElement('canvas');
    cnv.width = resX;
    cnv.height = resY;
    cnv.id = "bilinearGradient";

    container.appendChild(cnv);
    var ctx = cnv.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, resX, resY);

    var imageData = ctx.getImageData(0, 0, resX, resY);
    var rawData = imageData.data;

    function metric(x1, y1, x2, y2) {

        var f = resX / resY;

        var x = (x2 - x1);
        var y = (y2 - y1);


        x = x * x * f;

        y = y * y / f;

        return (1 / (x + y));
    }


    function drawGradient() {


        var p = { x: 0, y: 0 };

        function sortBy(a, b) {


            return a.dist > b.dist;
        }


        function calculateDist(p) {

            var sumDist = 0;
            var maxDist = 0;

            for (var i = 0; i < arr.length; i++) {
                var d = metric(p.x, p.y, arr[i].x, arr[i].y);
                d += 0.001;
                arr[i].dist = d;
            }

            for (i = 0; i < arr.length; i++) {

                sumDist += arr[i].dist;
            }

            for (i = 0; i < arr.length; i++) {
                arr[i].weight = arr[i].dist / sumDist;
            }

        }

        for (y = 0; y < resY; y++) {
            for (x = 0; x < resX; x++) {

                p.x = x / resX;
                p.y = y / resY;

                calculateDist(p);

                var h = 0;
                var s = 0;
                var v = 0;

                for (var i = 0; i < arr.length; i++) {

                    s += arr[i].v[1] * arr[i].weight;
                    v += arr[i].v[2] * arr[i].weight;

                }

                {
                    let r = 0;
                    let g = 0;
                    let b = 0;

                    for (let i = 0; i < arr.length; i++) {
                        let [r1, g1, b1] = HSVtoRGB(arr[i].v[0], arr[i].v[1], arr[i].v[2]);
                        r += r1 * arr[i].weight;
                        g += g1 * arr[i].weight;
                        b += b1 * arr[i].weight;
                    }

                    [h] = RGBtoHSV(r, g, b);
                }

                s = Math.max(0, Math.min(1, s));
                v = Math.max(0, Math.min(1, v));

                let [r, g, b] = HSVtoRGB(h, s, v);

                var index = (x + y * resX) * 4;
                rawData[index] = r;
                rawData[index + 1] = g;
                rawData[index + 2] = b;


            }
        }


        ctx.putImageData(imageData, 0, 0);

    }


    function getCanvas() {
        return cnv;

    }

    function addPoint(x, y, r, g, b) {

        var point = make(x, y, [r, g, b]);

        arr.push(point);
        drawGradient();

        return point;

    }

    function removePoint(point) {
        var index = arr.indexOf(point);
        arr.splice(index, 1);

        drawGradient();
    }

    drawGradient();
    return {

        addPoint: addPoint,
        removePoint: removePoint,
        getCanvas: getCanvas
    };

};










