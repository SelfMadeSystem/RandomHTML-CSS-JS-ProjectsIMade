function registerDetectionCallback(callback) {
    console.log(Object.defineProperties(new Error, {
        message: {
            get: function () {
                callback(); // callback for Chrome and Firefox
            }
        },
        toString: {
            value() {
                (new Error).stack.includes('toString@') && callback(); // callback for Safari
            }
        }
    }));
}

const copyPasta = `%c         ▄▄▄▄        \n      ▄%c▀▀   ▀█%c       \n    ▄%c▀  ▄%c██████%c▄     \n   ▄%c█▄█%c▀  ▄ ▄ █%c▀     \n  ▄%c▀ %c██%c▄  ▀ ▀ ▀%c▄     \n  ▀%c▄  ▀ ▄█▄▄  ▄%c█▄    \n    ▀%c█▄▄  ▀▀▀█%c▀      \n   ▄%c▀   ▀%c██%c▀▀█%c▄%c▀▀%c▄   \n  █%c  ▄%c▀▀▀%c▄█%c▄  ▀█%c █%c   \n  ▀%c▄%c█     █▀▀%c▄▄▀%c█    \n   ▄%c▀▀%c▄▄▄%c██%c▄▄%c█▀  %c█   \n  █%c▀ %c█████████%c   %c█   \n  █%c  %c██%c▀▀▀   ▀%c▄▄%c█▀   \n   ▀▀               `;

function style(foreground, background) {
    return `color: ${foreground}; background: ${background}; font-size: 1.5em;`;
}

const bw = style('black', 'transparent');
const br = style('black', '#be4c31');
const bb = style('black', '#f5c3b6');
const b = style('black', 'black');
console.log(copyPasta,
    bw,
    br, bw,
    br, b, bw,
    br, bb, bw,
    bb, b, bb, bw,
    bb, bw,
    bb, bw,
    br, b, br, bw, bb, bw,
    br, bb, br, br, bb, bw,
    br, bb, br, bw,
    br, bb, b, bb, br, bw,
    br, b, br, bw,
    br, b, bw, br, bw
);

registerDetectionCallback(() => {
    alert('a')
    console.log("Howdy developer! This website was proudly made by Shoghi Simon. If you like my work, you can view my GitHub at https://github.com/SelfMadeSystem. Thanks for visiting!");
});
