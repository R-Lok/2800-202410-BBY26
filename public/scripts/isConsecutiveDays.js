// console.log(`isConsecutive.js loaded`)


function isConsecutiveDays(lastDate, currDate) {
    
    let d = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() - 1)
    let d2 = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())

    console.log(`lastDate: ${d}`)
    console.log(`currDate: ${d2}`)

    console.log(`${d.getTime()} ${d2.getTime()}`)

    let msDifferenceBetweenDays = Math.abs(d.getTime() - d2.getTime())
    let dayDiff = msDifferenceBetweenDays / (1000 * 60 * 60 * 24)

    console.log(`${dayDiff}`)
}

module.exports = { isConsecutiveDays } 