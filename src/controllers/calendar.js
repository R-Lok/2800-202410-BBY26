// Array of months
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

// Total number of days in a week
const totalWeekDays = 7

// isToday checkes if a given timestamp corresponds to today's date
function isToday(timestamp) {
    // Create a new Date object with the timestamp's year, month, date, time is defaulted to 0
    const timestampDate = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate())
    const today = new Date()
    // Set the time of today's date to 0
    today.setHours(0, 0, 0, 0)
    // Compare today's date to the timestamp's date
    return today.getTime() === timestampDate.getTime()
}

// getStudiedDays returns the studied dates from the user's auditLogs in the past month
function getStudiedDays(auditLogResult) {
    // Creates a Set to store the unique dates of the user's auditLogs
    const studiedDaysSet = new Set(auditLogResult.map((log) => {
        // Retrieves the date the log was created
        const date = new Date(log.createdAt)
        // Returns a string concatenating the month and date
        return `${date.getMonth()}${date.getDate()}`
    }))
    // Converts studiedDaysSet to an array and returns it
    return Array.from(studiedDaysSet)
}

// getStreakDays returns the streak dates from the user's streak count, last activity timestamp, and current date
function getStreakDays(lastActivityTimestamp, date, streak) {
    const streakDays = []
    // Checks if the user has a streak to be displayed
    if (streak === 0) return streakDays
    if (lastActivityTimestamp === null) return streakDays
    // Checks if user did an activity today
    let i = isToday(lastActivityTimestamp) ? 0 : 1
    if (i === 1) streak++
    // Loops to retrieve the streak dates
    for (i; i < streak; i++) {
        // Create a new Date object for each iteration
        const d = new Date(date)
        // Modify the date for the specific streak day
        d.setDate(date.getDate() - i)
        // Adds a string concatenating the month and date to streakDays
        streakDays[i] = `${d.getMonth()}${d.getDate()}`
    }
    return streakDays
}

// getMonthName retrieves the month name of a date from the months array
function getMonthName(date) {
    return months[date.getMonth()]
}

// generateDaysOfCurrMonth returns the days of the current month as HTML
function generateDaysOfCurrMonth(date) {
    // Returns a Date object with the current month's last date
    const currMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    let html = ''
    // Loops through the total days of the current month to append each day to the HTML
    for (let i = 1; i <= currMonthLastDate.getDate(); i++) {
        // Checks for the current date
        if (i === date.getDate()) {
            // Appends an <li> element as the current date
            html += `<li class="active" id="${currMonthLastDate.getMonth()}${i}">${i}</li>`
        } else {
            // Appends an <li> element as the non-current date
            html += `<li id="${currMonthLastDate.getMonth()}${i}">${i}</li>`
        }
    }
    return html
}

// getPrevMonthLastDate retrieves the previous month's last date
function getPrevMonthLastDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), 0)
}

// generateDaysOfPrevMonth returns the days of the previous month as HTML
function generateDaysOfPrevMonth(date) {
    const prevMonthLastDate = getPrevMonthLastDate(date)
    const prevMonthLastWeekday = prevMonthLastDate.getDay()
    const prevMonthTotalDays = prevMonthLastDate.getDate()
    let html = ''
    // Ensures an extra week is not printed to the calendar
    if (prevMonthLastWeekday === 6) return html
    // Calculates the first date of the previous month that is visible on the calendar
    let d = prevMonthTotalDays - prevMonthLastWeekday
    // Loops through the visible dates of the calendar and appends them to HTML
    for (let i = 0; i <= prevMonthLastWeekday; i++) {
        html += `<li class="prevMonthDays" id="${prevMonthLastDate.getMonth()}${d}">${d}</li>`
        d++
    }
    return html
}

// generateDaysOfNextMonth returns the days of the next month as HTML
function generateDaysOfNextMonth(date) {
    // Returns a Date object with the current month's last date
    const currMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    const currMonthLastWeekday = currMonthLastDate.getDay()
    // Retrieves the next month's first weekday
    const nextMonthFirstWeekday = totalWeekDays - currMonthLastWeekday - 1
    let html = ''
    // Ensures an extra week is not printed to the calendar
    if (nextMonthFirstWeekday === 0) return html
    // Iterates through the days of next month and appends them to HTML
    for (let d = 1; d <= nextMonthFirstWeekday; d++) {
        html += `<li class="nextMonthDays" id="${currMonthLastDate.getMonth()}${d}">${d}</li>`
    }
    return html
}

module.exports = {
    getPrevMonthLastDate,
    generateDaysOfPrevMonth,
    generateDaysOfCurrMonth,
    generateDaysOfNextMonth,
    getMonthName,
    getStudiedDays,
    getStreakDays,
}
