var age = 0;
const MILLISECONDS_IN_A_YEAR = 60 * 1000 * 60 * 24 * 365;

function calculateAge() {
    age = Math.round((Date.now() - new Date("November 4, 1994").getTime()) / (MILLISECONDS_IN_A_YEAR));
    document.getElementById("age").innerHTML += `${age} Años`;
}

window.addEventListener("load", calculateAge);