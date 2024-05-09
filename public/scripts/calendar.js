let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let dayOfWeek = date.getDay();
let dayOfMonth = date.getDate();

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

//generates html of calendar
function generateDaysOfMonth() {
    let firstDayDate = new Date(year, month, 1);
    let lastDayDate = new Date(year, month + 1, 0);

    let html ='';
    let i;
    for (i = 1; i <= lastDayDate.getDate(); i++) {
        if (i == dayOfMonth) {
            html += `<li><span class="active">${i}</span></li>`;
        } else {
            html += `<li>${i}</li>`;
        }
    }
    // console.log(`${i}, ${lastDayDate}`);
    console.log(`${html}`);
    return html;
}

function x() {
    console.log(`cool!! ${month}`);
}

function y() {
    console.log('not cool!');
}

module.exports = {x, y, generateDaysOfMonth};