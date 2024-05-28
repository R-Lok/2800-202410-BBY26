const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

const totalWeekDays = 7

function getMonthName(date) {
    return months[date.getMonth()]
}

// generates days of current month
function generateDaysOfCurrMonth(date) {
    const currMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    let html = ''
    let i
    for (i = 1; i <= currMonthLastDate.getDate(); i++) {
        if (i === date.getDate()) {
            html += `<li id="${currMonthLastDate.getMonth()}${i}"><span class="active">${i}</span></li>`
        } else {
            html += `<li id="${currMonthLastDate.getMonth()}${i}">${i}</li>`
        }
    }
    // console.log(`prev month days: ${generateDaysOfPrevMonth()}`);
    // console.log(`curr month days: ${html}`);
    // console.log(`next month days: ${generateDaysOfNextMonth()}`);
    return html
}

function getPrevMonthLastDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), 0)
}

function generateDaysOfPrevMonth(date) {
    const prevMonthLastDate = getPrevMonthLastDate(date)
    const prevMonthLastWeekday = prevMonthLastDate.getDay()
    const prevMonthTotalDays = prevMonthLastDate.getDate()

    let html = ''
    if (prevMonthLastWeekday === 6) {
        return html
    }

    let d = prevMonthTotalDays - prevMonthLastWeekday
    for (let i = 0; i <= prevMonthLastWeekday; i++) {
        html += `<li id="${prevMonthLastDate.getMonth()}${d}">${d}</li>`
        d++
    }
    return html
}

function generateDaysOfNextMonth(date) {
    const currMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const currMonthLastWeekday = currMonthLastDate.getDay()
    const nextMonthFirstWeekday = totalWeekDays - currMonthLastWeekday - 1

    let html = ''
    if (nextMonthFirstWeekday === 0) {
        return html
    }

    for (let d = 1; d <= nextMonthFirstWeekday; d++) {
        html += `<li id="${currMonthLastDate.getMonth()}${d}">${d}</li>`
    }

    return html
}

module.exports = { getPrevMonthLastDate, generateDaysOfPrevMonth, generateDaysOfCurrMonth, generateDaysOfNextMonth, getMonthName }
