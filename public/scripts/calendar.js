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



function getMonthName(date) {
    return months[date.getMonth()]
}

//generates days of current month
function generateDaysOfCurrMonth(date) {
    let currMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let html ='';
    let i;
    for (i = 1; i <= currMonthLastDate.getDate(); i++) {
        if (i == date.getDate()) {
            html += `<li><span class="active">${i}</span></li>`;
        } else {
            html += `<li>${i}</li>`;
        }
    }
    // console.log(`prev month days: ${generateDaysOfPrevMonth()}`);
    // console.log(`curr month days: ${html}`);
    // console.log(`next month days: ${generateDaysOfNextMonth()}`);
    return html;
}

function generateDaysOfPrevMonth(date) {
    let prevMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0);
    let prevMonthLastWeekday = prevMonthLastDate.getDay();
    let prevMonthTotalDays = prevMonthLastDate.getDate();

    let html = '';
    if (prevMonthLastWeekday == 6) {
        return html;
    } 

    let d = prevMonthTotalDays - prevMonthLastWeekday;
    for (let i = 0; i <= prevMonthLastWeekday; i++) {
        html += `<li>${d}</li>`;
        d++;
    }
    return html;
}

function generateDaysOfNextMonth(date) {
    let currMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let currMonthLastWeekday = currMonthLastDate.getDay();
    let nextMonthFirstWeekday = totalWeekDays - currMonthLastWeekday - 1;

    let html = '';
    if (nextMonthFirstWeekday == 0) {
        return html;
    } 

    for (let d = 1; d <= nextMonthFirstWeekday; d++) {
        html += `<li>${d}</li>`;
    };

    return html;
}

module.exports = { generateDaysOfPrevMonth, generateDaysOfCurrMonth, generateDaysOfNextMonth, getMonthName };