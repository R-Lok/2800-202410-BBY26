// console.log(`isConsecutive.js loaded`)

function isConsecutiveDays(lastDate, currDate) {
    console.log(`\nisConsecutiveDays\n`)

    let d = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
    let d2 = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())
    console.log(`lastDate: ${d}`)
    console.log(`currDate: ${d2}`)

    console.log(`${d.getTime()} ${d2.getTime()}`)

    let msDifferenceBetweenDays = Math.abs(d.getTime() - d2.getTime())
    let dayDifference = msDifferenceBetweenDays / (1000 * 60 * 60 * 24) // converting millisecond difference between dates to days

    console.log(`${dayDifference}`)
    return dayDifference
}

module.exports = { isConsecutiveDays } 