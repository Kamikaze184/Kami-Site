const serverCount = document.getElementById('serverCount');
const userCount = document.getElementById('userCount');
const fichasCount = document.getElementById('fichasCount');
const commandsTotal = document.getElementById('commandsTotal');

const severCountValue = document.currentScript.getAttribute('serverCount');
const userCountValue = document.currentScript.getAttribute('userCount');
const fichasCountValue = document.currentScript.getAttribute('fichasCount');
const commandsTotalValue = document.currentScript.getAttribute('commandsTotal');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function count(local, value) {
    var speed = Math.ceil(((value * 0.0001) + ((value * 1.4) / 400)))
    let count = 0;

    while (count < value) {
        local.innerHTML = count;
        count += speed;
        await sleep(10);
    }

    if (count >= value) {
        local.innerHTML = value;
    }
}

count(commandsTotal, commandsTotalValue);
count(userCount, userCountValue);
count(fichasCount, fichasCountValue);
count(serverCount, severCountValue);
