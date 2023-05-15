class Timer {
    constructor() {
        this.startTime = new Date().getTime();
    }

    getTime() {
        return new Date(new Date().getTime() - this.startTime);
    }
}

const hitsEle = document.getElementById('hits');
let hits = 0;

function addHits() {
    hits++;
    hitsEle.innerText = hits.toString();
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {String}          The RGB representation
 */
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return (Math.round(r * 255) * 0x10000 + Math.round(g * 255) * 0x100 + Math.round(b * 255)).toString(16).substr(0, 6);
}

const gravityElement = document.getElementById('gravity');
let gravity = 1;

gravityElement.oninput = () => {
    gravity = Number(gravityElement.value);
};

const resistanceElement = document.getElementById('resistance');
let resistance = 0;

resistanceElement.oninput = () => {
    resistance = Number(resistanceElement.value);
};

const gravDirEle = document.getElementById('grav-dir');
let gravDir = 'down';

gravDirEle.onchange = () => {
    gravDir = gravDirEle.value;
};

const bounceEle = document.getElementById('bounce');
let bounce = true;

bounceEle.oninput = () => {
    bounce = bounceEle.checked;
};

const borderEle = document.getElementById('border');
let border = true;

borderEle.oninput = () => {
    border = borderEle.checked;
};

class Circle {
    /**
     * 
     * @param {Number} x X Position
     * @param {Number} y Y Position
     * @param {Number[]} v Velocity
     * @param {Number} r Radius
     * @param {Number} m Mass
     */
    constructor(x, y, v, r, m) {
        this.x = x;
        this.y = y;
        this.velocity = v;
        this.radius = r;
        this.mass = m;
        this.prevPoses = [];
        this.color = '#' + hslToRgb(Math.random(), Math.random(), Math.random() * 0.5 + 0.5);
    }

    update() {
        switch (gravDir) {
            case 'down': {
                this.velocity[1] += gravity * timeSpeed;
                break;
            }
            case 'balls': {
                for (const circle of circles) {
                    if (circle !== this) this.updateVelocity(circle);
                }
                break;
            }
            case 'center': {
                const center = border ? [
                    canvas.width / zoom / 2 - offset[0],
                    canvas.height / zoom / 2 - offset[1],
                ] : [0, 0];
                const d = [
                    this.x - center[0],
                    this.y - center[1]
                ];
                const dLen = Math.hypot(...d);

                const dNorm = [d[0] / dLen, d[1] / dLen];

                this.velocity[0] -= dNorm[0] * gravity * timeSpeed;
                this.velocity[1] -= dNorm[1] * gravity * timeSpeed;
                break;
            }
            case 'mass': { // center of mass of all balls
                let x = 0;
                let y = 0;
                let totalMass = 0;

                for (const circle of circles) {
                    x += circle.x * circle.mass;
                    y += circle.y * circle.mass;
                    totalMass += circle.mass;
                }

                x /= totalMass;
                y /= totalMass;

                const d = [
                    this.x - x,
                    this.y - y
                ];

                const dLen = Math.hypot(...d);

                const dNorm = [d[0] / dLen, d[1] / dLen];

                this.velocity[0] -= dNorm[0] * gravity * timeSpeed;
                this.velocity[1] -= dNorm[1] * gravity * timeSpeed;
                break;
            }
        }
        if (Math.abs(this.velocity[0]) > 0) {
            this.velocity[0] -= Math.min(Math.abs(this.velocity[0]), resistance * timeSpeed) * Math.sign(this.velocity[0]);
        }
        if (Math.abs(this.velocity[1]) > 0) {
            this.velocity[1] -= Math.min(Math.abs(this.velocity[1]), resistance * timeSpeed) * Math.sign(this.velocity[1]);
        }
    }

    /**
     * 
     * @param {Circle} other 
     */
    updateVelocity(other) {
        const influence = this.getInfluence(other);
        let dX = this.x - other.x;
        let dY = this.y - other.y;
        const div = Math.abs(dX) + Math.abs(dY);

        dX /= div;
        dY /= div;

        this.velocity[0] -= dX * influence * timeSpeed * gravity;
        this.velocity[1] -= dY * influence * timeSpeed * gravity;
    }

    move(i) {
        if (this.velocity[0] !== this.velocity[0] || this.velocity[1] !== this.velocity[1]) { return; }
        this.x += this.velocity[0] * timeSpeed;
        this.y += this.velocity[1] * timeSpeed;
        if (border) {
            if (this.x - this.radius < -offset[0]) {
                this.x = this.radius - offset[0];
                this.velocity[0] = -this.velocity[0];
            }
            if (this.x + this.radius > canvas.width / zoom - offset[0]) {
                this.x = canvas.width / zoom - this.radius - offset[0];
                this.velocity[0] = -this.velocity[0];
            }
            if (this.y - this.radius < -offset[1]) {
                this.y = this.radius - offset[1];
                this.velocity[1] = -this.velocity[1];
            }
            if (this.y + this.radius > canvas.height / zoom - offset[1]) {
                this.y = canvas.height / zoom - this.radius - offset[1];
                this.velocity[1] = -this.velocity[1];
            }
        }
        for (; i < circles.length; i++) {
            const circle = circles[i];
            if (this.intersects(circle)) {
                addHits();
                this.resolveCollision(circle);
            }
        }
    }

    /**
     * 
     * @param {Circle} other 
     * @returns {Number}
     */
    getDistSqr(other) {
        const dX = this.x - other.x;
        const dY = this.y - other.y;
        return dX * dX + dY * dY;
    }

    /**
     * 
     * @param {Circle} other 
     * @returns {Number}
     */
    getInfluence(other) {
        const dist = 1 / (this.getDistSqr(other) * 2) / 2;
        const mass = other.mass;

        return dist * mass * mass;
    }

    /**
     * 
     * @param {Circle} other 
     * @returns {Boolean}
     */
    intersects(other) {
        return other !== this && this.getDistSqr(other) < (other.radius + this.radius) * (other.radius + this.radius);
    }

    /**
     * Resolves collision between two circles.
     * 
     * First, the two circles are moved apart so that they no longer intersect.
     * Then, the two circles bounce off each other.
     * @param {Circle} ball 
     */
    resolveCollision(ball) {
        // Move circles apart
        let dX = this.x - ball.x;
        let dY = this.y - ball.y;
        const div = Math.hypot(dX, dY);
        const dist = this.radius + ball.radius - div;
        if (dist > 0.000001) {
            const overlap = dist / 2;
            const overlapV = [dX / div * overlap, dY / div * overlap];
            this.x += overlapV[0];
            this.y += overlapV[1];
            ball.x -= overlapV[0];
            ball.y -= overlapV[1];

            dX = this.x - ball.x;
            dY = this.y - ball.y;
        }

        // Bounce off each other

        if (!bounce) {
            return;
        }

        // thanks to https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects

        // v1 and v2 are the scalar sizes of the two original speeds of the objects
        const v1 = Math.hypot(this.velocity[0], this.velocity[1]);
        const v2 = Math.hypot(ball.velocity[0], ball.velocity[1]);

        // m1 and m2 are the masses of the two objects
        const m1 = this.mass * this.mass;
        const m2 = ball.mass * ball.mass;

        // θ1 and θ2 are the angles of the two original speeds of the objects
        const θ1 = Math.atan2(this.velocity[1], this.velocity[0]);
        const θ2 = Math.atan2(ball.velocity[1], ball.velocity[0]);

        // φ is the contact angle between the two objects
        const φ = Math.atan2(dY, dX);

        // v′1x, v′1y, v′2x, and v′2y are the new speeds of the two objects
        const v1x = (v1 * Math.cos(θ1 - φ) * (m1 - m2) + 2 * m2 * v2 * Math.cos(θ2 - φ)) / (m1 + m2) * Math.cos(φ) + v1 * Math.sin(θ1 - φ) * Math.cos(φ + Math.PI / 2);
        const v1y = (v1 * Math.cos(θ1 - φ) * (m1 - m2) + 2 * m2 * v2 * Math.cos(θ2 - φ)) / (m1 + m2) * Math.sin(φ) + v1 * Math.sin(θ1 - φ) * Math.sin(φ + Math.PI / 2);

        const v2x = (v2 * Math.cos(θ2 - φ) * (m2 - m1) + 2 * m1 * v1 * Math.cos(θ1 - φ)) / (m1 + m2) * Math.cos(φ) + v2 * Math.sin(θ2 - φ) * Math.cos(φ + Math.PI / 2);
        const v2y = (v2 * Math.cos(θ2 - φ) * (m2 - m1) + 2 * m1 * v1 * Math.cos(θ1 - φ)) / (m1 + m2) * Math.sin(φ) + v2 * Math.sin(θ2 - φ) * Math.sin(φ + Math.PI / 2);

        // apply new speeds
        this.velocity[0] = v1x;
        this.velocity[1] = v1y;

        ball.velocity[0] = v2x;
        ball.velocity[1] = v2y;

        // thanks to https://stackoverflow.com/a/345863/1098564

        // get the mtd
        // const dx = this.x - ball.x;
        // const dy = this.y - ball.y;

        // const d = Math.sqrt(dx * dx + dy * dy);
        // const mult = ((this.radius + ball.radius) - d) / d;

        // // minimum translation distance to push balls apart after intersecting
        // const mtd = [dx * mult, dy * mult];
        // const mtdSize = Math.sqrt(mtd[0] * mtd[0] + mtd[1] * mtd[1]);
        // const mtdNorm = [mtd[0] / mtdSize, mtd[1] / mtdSize];

        // // resolve intersection --
        // // inverse mass quantities
        // const im1 = 1 / this.mass;
        // const im2 = 1 / ball.mass;

        // // push-pull them apart based off their mass
        // const mtdV = [mtdNorm[0] * mtdSize * im1 / (im1 + im2), mtdNorm[1] * mtdSize * im1 / (im1 + im2)];
        // const mtdV2 = [mtdNorm[0] * mtdSize * im2 / (im1 + im2), mtdNorm[1] * mtdSize * im2 / (im1 + im2)];

        // this.x += mtdV[0];
        // this.y += mtdV[1];
        // ball.x -= mtdV2[0];
        // ball.y -= mtdV2[1];

        // // impact speed
        // const v = [this.velocity[0] - ball.velocity[0], this.velocity[1] - ball.velocity[1]];
        // const vn = v[0] * mtdNorm[0] + v[1] * mtdNorm[1];

        // // sphere intersecting but moving away from each other already
        // if (vn > 0.0) return;

        // // collision impulse
        // const i = (-(1.0 + 0.5) * vn) / (im1 + im2);
        // const impulse = [mtdNorm[0] * i, mtdNorm[1] * i];

        // // change in momentum
        // this.velocity[0] += impulse[0] * im1;
        // this.velocity[1] += impulse[1] * im1;
        // ball.velocity[0] -= impulse[0] * im2;
        // ball.velocity[1] -= impulse[1] * im2;
    }

    // /**
    //  * 
    //  * @param {Number[]} normal
    //  */
    // bounce(normal) {
    // console.log(normal)
    // const dot = this.velocity[0] * normal[0] + this.velocity[1] * normal[1];
    // const x = this.velocity[0] - normal[0] * dot * 2;
    // const y = this.velocity[1] - normal[1] * dot * 2;
    // this.velocity[0] = x;
    // this.velocity[1] = y;
    // }

    /**
     * Finds the normal of the collision between two circles.
     * @param {Circle} other 
     */
    findNormal(other) {
        const dX = this.x - other.x;
        const dY = this.y - other.y;
        const div = Math.hypot(dX, dY);
        return [dX / div, dY / div];
    }

    draw() {
        this.prevPoses.push([this.x, this.y]);
        if (this.prevPoses.length >= 100) this.prevPoses.shift();
        ctx.fillStyle = this.color + "aa";
        ctx.strokeStyle = this.color;
        drawCircle(this.x, this.y, this.radius);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (const pos of this.prevPoses) {
            let x = pos[0];
            let y = pos[1];
            ctx.lineTo((x + offset[0]) * zoom, (y + offset[1]) * zoom);
        }
        ctx.stroke();
    }
}

const canvas = document.getElementById("test");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const timer = new Timer();

let timeSpeed = 0.05;

const speedElem = document.getElementById("speed");

speedElem.oninput = () => {
    timeSpeed = Number(speedElem.value);
};

let steps = 1;

const stepsElem = document.getElementById("steps");
const fastElem = document.getElementById("fast");
const gigaFastElem = document.getElementById("giga-fast");

fastElem.oninput = stepsElem.oninput = gigaFastElem.oninput = () => {
    steps = Number(stepsElem.value);
    if (fastElem.checked) {
        steps *= 50;
    }
    if (gigaFastElem.checked) {
        steps *= 100;
    }
};

/** @type {Circle[]} */
const circles = [
    // new Circle(250, 250, [-0.01, 0.005], 100, 50),
    // new Circle(50, 50, [-0.01, 0], 100, 50),
    /* new Circle(350, 350, [0, 0], 100, 100),
    new Circle(350, 50, [0.24, -0.01], 10, 5),
    new Circle(350, 0, [0.24, -0.01], 15, 7.5),
    new Circle(175, 300, [-0.2, 0.27], 10, 5),
    new Circle(0, 0, [0.2, -0.000], 15, 7.5) */
];
let zoom = 0.125;
let offset = [0, 0];


for (let i = 0; i < 12; i++) {
    const size = Math.random() * 260 + 20;
    const mass = size * Math.PI;
    circles.push(new Circle(Math.random() * canvas.width / zoom, Math.random() * canvas.height / zoom, [Math.random() * 2 - 1, Math.random() * 2 - 1], size, mass));
}

function update() {
    for (let i = 0; i < steps; i++) {
        for (const circle of circles) {
            circle.update();
        }
        for (let i = 0; i < circles.length; i++) {
            circles[i].move(i);
        }
    }
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    for (const circle of circles) {
        circle.draw();
    }
}

function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc((x + offset[0]) * zoom, (y + offset[1]) * zoom, r * zoom, 0, Math.PI * 2, false);
    ctx.fill();
}

function load() {
    const cb = () => {
        update();
        requestAnimationFrame(cb);
    };
    requestAnimationFrame(cb);
}

canvas.onwheel = function (e) {
    const zoomSpeed = 1.02;
    if (e.deltaY > 0) {
        zoom *= zoomSpeed;
    } else {
        zoom /= zoomSpeed;
    }
};

canvas.onmousemove = function (e) {
    if (e.buttons & 1) {
        offset[0] += e.movementX * 1 / zoom;
        offset[1] += e.movementY * 1 / zoom;
    }
};