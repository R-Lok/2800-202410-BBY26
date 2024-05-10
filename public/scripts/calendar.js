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

const totalWeekDays = 7;

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let dayOfWeek = date.getDay();
let dayOfMonth = date.getDate();

let currMonthFirstDate = new Date(year, month, 1);
let currMonthLastDate = new Date(year, month + 1, 0);

//generates days of current month
function generateDaysOfCurrMonth() {
    let html ='';
    let i;
    for (i = 1; i <= currMonthLastDate.getDate(); i++) {
        if (i == dayOfMonth) {
            html += `<li><span class="active">${i}</span></li>`;
        } else {
            html += `<li>${i}</li>`;
        }
    }
    // console.log(`${i}, ${currMonthLastDate}`);
    console.log(`prev month days: ${generateDaysOfPrevMonth()}`);
    console.log(`curr month days: ${html}`);
    console.log(`next month days: ${generateDaysOfNextMonth()}`);
    return html;
}

function generateDaysOfPrevMonth() {
    let prevMonthLastDate = new Date(year, month, 0);
    let prevMonthLastWeekday = prevMonthLastDate.getDay();
    let prevMonthTotalDays = prevMonthLastDate.getDate();    
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
    let nextMonthFirstDate  = new Date(year, month + 1, 1);
    // let nextMonthFirstWeekday = nextMonthFirstDate.getDay();
    let currMonthLastWeekday = currMonthLastDate.getDay();

    let html = '';
    let d = 1;
    for (d; d < totalWeekDays - currMonthLastWeekday; d++) {
        html += `<li>${d}</li>`;
    };

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

module.exports = {x, y, generateDaysOfCurrMonth};