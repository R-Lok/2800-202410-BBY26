const OpenAI = require('openai')
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})
const sharp = require('sharp')

async function generateImage(difficulty, numQuestions, image) {
  try {
      const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          temperature: 1,
          max_tokens: 4096,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          messages: [
              {
                  role: 'system', content: 'You are a assistant that generate flashcards for students studying quizzes and exams',
              },
              {
                  role: 'user',
                  content: [{
                      type: 'text', text: `Given the provided image, Generate an array in json format that contains ${numQuestions} flashcards object elments with ${difficulty} difficulty.
              Question and answer of flashcards should be the keys of each flashcard object element` }, { 'type': 'image_url', 'image_url': { 'url': image } }],
              },
          ],
      })
      return { success: true, data: response.choices[0].message.content }
  } catch (err) {
      console.log(err)
      return { error: true, msg: 'OpenAI api error' }
  }
}

/**
 * Generate flashcards objects in JSON format by calling OpenAI API based on text study material
 * @param {String} difficulty - Difficulty of flashcards: Easy, Medium, or Difficult
 * @param {String} number - Number of flashcards
 * @param {String} material - Study material in text format
 * @return {Object} jsonResult - flashcards objects in JSON format
 */
async function generate(difficulty, number, material) {
  let completion
  try {
      completion = await openai.chat.completions.create({
          messages: [
              {
                  role: 'system',
                  content:
                      'You are a assistant that generates flashcards for students studying quizzes and exam.',
              },
              {
                  role: 'user',
                  content: `Given the following studying material in text: ${material}.
              Generate an array in json format that contains ${number} flashcards object elments with ${difficulty} difficulty.
              Question and answer of flashcards should be the keys of each flashcard object element`,
              },
          ],
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          temperature: 1,
          max_tokens: 4096,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
      })
      const jsonResult = completion.choices[0].message.content
      return { success: true, data: jsonResult }
  } catch (err) {
      console.log(`API Call fails: ${err}`)
      return { error: true, data: 'OpenAI api call error' }
  }
}

/**
 * Convert blob into base64 string
 * @param {object} base64Input - The length of the rectangle
 * @return {Promise} promise - Promise that resolves to a base64 file in string representation
 */
async function convertImageToBase64Jpg(base64Input) {
  try {
      // Decode the base64 input image to a buffer
      const inputBuffer = Buffer.from(base64Input, 'base64')

      // Use sharp to convert the input buffer to JPG format and get the base64 string
      const base64Output = await sharp(inputBuffer)
          .jpeg()
          .toBuffer()
          .then((data) => data.toString('base64'))

      return base64Output
  } catch (error) {
      console.error('Error converting image to base64 JPG:', error)
      throw error
  }
}

module.exports = {
  generateImage,
  generate,
  convertImageToBase64Jpg,
}