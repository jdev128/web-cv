const MILLISECONDS_IN_A_YEAR = 60 * 1000 * 60 * 24 * 365;

function calculateAge() {
    let age = Math.floor((Date.now() - new Date("November 4, 1994").getTime()) / (MILLISECONDS_IN_A_YEAR));
    document.getElementById("age").innerHTML += `${age} Años`;
}

function calculateSeniority() {
    let seniority = Math.floor((Date.now() - new Date("August 5, 2019").getTime()) / (MILLISECONDS_IN_A_YEAR));
    document.getElementById("seniority").innerHTML = seniority;
}

window.addEventListener("load", calculateAge);
window.addEventListener("load", calculateSeniority);