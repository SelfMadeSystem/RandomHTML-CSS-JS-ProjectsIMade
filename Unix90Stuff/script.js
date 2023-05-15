const loadingTemplateTag = document.getElementById('loading-template');

function timeAgo (value) {
    const seconds = Math.floor((new Date().getTime() - new Date(value).getTime()) / 1000)
    let result = '';
    let interval = Math.floor(seconds / 31536000);
    if (interval == 1) result += interval + " year ";
    if (interval > 1) result += interval + " years ";
    interval = Math.floor(seconds / 2592000);
    if (interval == 1) result += interval + " month ";
    if (interval > 1) result += interval + " months ";
    interval = Math.floor(seconds / 86400)
    if (interval == 1) result += interval + " day ";
    if (interval > 1) result += interval + " days ";
    interval = Math.floor(seconds / 3600)
    if (interval == 1) result += interval + " hour ";
    if (interval > 1) result += interval + " hours ";
    interval = Math.floor(seconds / 60)
    if (interval == 1) result += interval + " minute ";
    if (interval > 1) result += interval + " minutes ";
    return rtf.format(-Math.floor(interval), 'second')
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const systemInfo = {
    "hostname": "unix90smainframe",
    "uptime": timeAgo('2021-04-20 01:09:24'),
    "kernelname": "badix",
    "kernel": "4.2.0-69-generic",
    "load": "1.01 0.98 1.02",
    "memtotal": "31.8G",
    "memavail": "6.7G",
    "memused": "25.1G",
    "cpu": "Intel(R) Xeon(TM) 6-4200 CPU @ 4.20GHz",
    "cputemp": "69.0°C",
    "cpucount": "69",
    "threadcount": "138",
};

const networkInfo = {
    "ip": "69.42.6.102",
    "mac": "FC:69:01:A4:42:06",
    "gateway": "192.169.1.1",
};

const storageInfo = {
    "fs": "/dev/nvme0n2p4",
    "type": "btrfs",
    "mount": "/",
    "used": "69.4T",
    "avail": "350.4T",
    "total": "419.8T",
    "usedp": "16.5%",
};

const keys = [
    ...Object.keys(systemInfo),
    ...Object.keys(networkInfo),
    ...Object.keys(storageInfo),
];

const values = [
    ...Object.values(systemInfo),
    ...Object.values(networkInfo),
    ...Object.values(storageInfo),
];

for (const key of keys) {
    const element = document.getElementById(key);
    const clone = loadingTemplateTag.content.cloneNode(true);
    if (element) {
        element.appendChild(clone);
    }
}

const randomTime = (() => {
    const minFast = 20;
    const maxFast = 300;

    const minSlow = 500;
    const maxSlow = 3000;

    let fastInARow = 0;

    return () => {
        if (fastInARow > 0) {
            fastInARow--;
            return random(minFast, maxFast);
        }
        fastInARow = random(1, 10);

        return random(minSlow, maxSlow);
    };
})();

function loadInfo(index) {
    if (index < keys.length) {
        const key = keys[index];
        const value = values[index];
        const element = document.getElementById(key);
        if (element) {
            element.innerHTML = value;
        }
        setTimeout(() => loadInfo(index + 1), randomTime());
    }
}

setTimeout(() => loadInfo(0), 500 + randomTime());
