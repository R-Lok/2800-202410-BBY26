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

function isToday(timestamp) {
    timestampDate = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate())
    today = new Date()
    today.setHours(0, 0, 0, 0)
    return today.getTime() === timestampDate.getTime()
}

function getStudiedDays(auditLogResult) {
    // makes and uses a set to store unique dates
    let studiedDaysSet = new Set(auditLogResult.map(log => {
        let date = new Date(log.createdAt)
        return `${date.getMonth()}${date.getDate()}`
    }));
    // returns array back from the set
    return Array.from(studiedDaysSet)
}

function getStreakDays(timestamp, date, streak) {
    if (streak == 0) return;
    if (timestamp == null) return;
    let streakDays = []
    let i = isToday(timestamp) ? 0 : 1
    if (i == 1 && streak == 1) {
        streak++
    }
    let d = new Date(date)
    for (i; i < streak; i++) {
        d.setDate(date.getDate() - i)
        streakDays[i] = `${d.getMonth()}${d.getDate()}`
    }

    return streakDays
}

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
            html += `<li id="${currMonthLastDate.getMonth()}${i}"><span class="active">${i}</span></li>`;
        } else {
            html += `<li id="${currMonthLastDate.getMonth()}${i}">${i}</li>`;
        }
    }
    // console.log(`prev month days: ${generateDaysOfPrevMonth()}`);
    // console.log(`curr month days: ${html}`);
    // console.log(`next month days: ${generateDaysOfNextMonth()}`);
    return html;
}

function getPrevMonthLastDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), 0);
} 

function generateDaysOfPrevMonth(date) {
    let prevMonthLastDate = getPrevMonthLastDate(date);
    let prevMonthLastWeekday = prevMonthLastDate.getDay();
    let prevMonthTotalDays = prevMonthLastDate.getDate();

    let html = '';
    if (prevMonthLastWeekday == 6) {
        return html;
    } 

    let d = prevMonthTotalDays - prevMonthLastWeekday;
    for (let i = 0; i <= prevMonthLastWeekday; i++) {
        html += `<li id="${prevMonthLastDate.getMonth()}${d}">${d}</li>`;
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
        html += `<li id="${currMonthLastDate.getMonth()}${d}">${d}</li>`;
    };

    return html;
}

module.exports = {
    getPrevMonthLastDate, 
    generateDaysOfPrevMonth, 
    generateDaysOfCurrMonth, 
    generateDaysOfNextMonth, 
    getMonthName, 
    getStudiedDays, 
    getStreakDays 
};