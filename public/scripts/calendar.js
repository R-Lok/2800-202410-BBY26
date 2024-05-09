let date = new Date();
let month = date.getMonth();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

function x() {
    console.log(`cool!! ${month}`);
}

function y() {
    console.log('not cool!');
}

module.exports = {x, y};