const { saveFlashcardsService } = require('../services/index')

async function saveFlashCardSet(req, res) {
    let lastShareCode
    // get the latest sharecode from collections
    const fetchLastSharecodeResult = await saveFlashcardsService.getLastSharecode()

    if (fetchLastSharecodeResult.success) {
        lastShareCode = fetchLastSharecodeResult.lastShareCode
    } else {
        res.status(503)
        return res.json({ message: 'Error fetching information from database!' })
    }
    // if the latestSharecode doesn't exist (database has no collections at all), set the shareId to 0 (first collection ever)
    const shareId = lastShareCode === null ? 0 : lastShareCode + 1

    // use map to add the share id to each element of the cards array, to prepare for writing to DB
    const cards = JSON.parse(req.body.cards)
    const inputData = saveFlashcardsService.addShareIdToCards(cards, shareId)

    const writeSetResult = await saveFlashcardsService.writeFlashCardSetToDB(req.body.name, req.session.userId, shareId, inputData)
    if (writeSetResult.success) {
        res.status(200).json(JSON.stringify({ shareId: shareId }))
    } else {
        res.status(503).json({ message: 'Error saving set! Please try again.' })
    }
}

module.exports = { saveFlashCardSet }