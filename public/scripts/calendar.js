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

//generates days of current month
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
    console.log(`${generateDaysOfPrevMonth()}`);
    return html;
}

function generateDaysOfPrevMonth() {
    let prevMonthLastDate = new Date(year, month, 0);
    let prevMonthLastWeekday = prevMonthLastDate.getDay();
    let prevMonthTotalDays = prevMonthLastDate.getDate();
    console.log(`last weekday of prev month ${prevMonthTotalDays} ${prevMonthLastWeekday}`);
    
    let html = '';
    let i;
    let d = prevMonthTotalDays - prevMonthLastWeekday;
    for (i = 0; i <= prevMonthLastWeekday; i++) {
        html += `<li>${d}</li>`;
        d++;
    }
    return html;
}

function generateDaysOfNextMonth() {
    let html = '';

    return html;
}

function getLastDateOfMonth() {
    let d = 
    console.log(`${d}`);
    return d;
}

function x() {
    console.log(`cool!! ${month}`);
}

function y() {
    console.log('not cool!');
}

module.exports = {x, y, generateDaysOfMonth};