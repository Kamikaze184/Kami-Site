const serverCount = document.getElementById('serverCount');
const userCount = document.getElementById('userCount');
const fichasCount = document.getElementById('fichasCount');
const commandsTotal = document.getElementById('commandsTotal');

const severCountValue = document.currentScript.getAttribute('serverCount');
const userCountValue = document.currentScript.getAttribute('userCount');
const fichasCountValue = document.currentScript.getAttribute('fichasCount');
const commandsTotalValue = document.currentScript.getAttribute('commandsTotal');

const formatter = Intl.NumberFormat("br", { notation: "compact", maximumSignificantDigits: 3 })

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function count(local, value) {
    var speed = (value * 0.0001) + ((value * 1.4) / 400)
    let count = 0;

    while (count < value) {
        count += speed;

        local.innerHTML = formatter.format(count.toFixed(0));

        await sleep(10);
    }

    if (count >= value) {
        local.innerHTML = formatter.format(value.toFixed(0));
    }
}

count(commandsTotal, parseInt(commandsTotalValue));
count(userCount, parseInt(userCountValue));
count(fichasCount, parseInt(fichasCountValue));
count(serverCount, parseInt(severCountValue));
