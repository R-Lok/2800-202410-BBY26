# StudyGen | 2800-202410-BBY26

## About Us
### Team Name: 
BBY-26
### Team Members: 
* Kong, Jimmy
* Li, Louise
* Liao, Wei-Yu
* Lin, Joe
* Lok, Ryan

## Project Description
Our project, StudyGen, is a web application developed to alleviate student
stress by simplifying flashcards creation with AI integration.

## Project Technologies

### Frontend
* HTML5
* CSS3
* JavaScript
* Bootstrap
### Backend:
* NodeJS
* ExpressJS
* EJS
### Database:
* MongoDB Atlas
### Library:
* Mongoose
* BCrypt
* Compression
* Connect-Mongo
* Dotenv
* Express-Session
* Joi
* Openai
* Sharp

## Listing of Files

```
Top level files of project folder: 
├── .gitignore               # Git ignore file
├── .jest.config.js          # jest config file
├── .eslintrc.js             # Eslint config file
├── .docker-compose.yml      # Docker-compose file
├── Dockerfile               # Dockerfile for StudyGen
├── Dockerfile_mongodb       # Dockerfile for Mongodb replica set
├── generate-keyfile.sh      # Generate key for Mongodb replica set
├── mongo-init.js            # JS script for setting up Mongodb replica set
├── mongod.cong              # Mongodb config file
├── package.json             # npm config file
└── README.md


Top level folders and their subfolders/files:
├── .vscode                  # Folder for vscode config
├── scripts                  # scripts for management
├── src                      # Folder for all static files
    ├── controllers          # Containing controller files
        *.js                 # Controller files
    ├── models 	             # Contains mongoose models
        *.js                 # Mongoose model files
    ├── public               # Contains all client-side folders
          ├── css            # Contains all style sheets
              *.css          # Style sheets for every page
          ├── fonts          # Contains custom font used
              *.otf          
          ├── images         # Contains all image types used
              *.png
              *.gif
              *.svg
              *.jpeg
          ├── music          # Contains all music used
              *.mp3
          ├── scripts        # Contains all client-side JS files
              *.js           # Client-side JS files for each page
    ├── routers              # Contains all router files
        *.js                 # Routers for endpoints
    ├── services             # Contains all service files
        *.js                 # Functions called by controllers
    ├── utilities            # Contains all utility files
        *.js                 # Common utility functions
    ├── views                # Contains all ejs files
          ├── template       # Contains template ejs files
              *.ejs          # Template ejs used by other ejs
        *.ejs                # EJS files for rendering all pages
    ├── example.env          # example template env file
    ├── expressServer.js     # Express server setup file
    ├── index.js             # Server runtime file
    ├── setupTests.js        # setup file for jest
    ├── setup.sh             # bash file to populate database
├── tests                    #
      ├── controllers        # test for controllers
          .js
      ├── services           # test for services
          .js

```

## Installation
This section contains ordered instructions so a new developer can assemble a DEVELOPMENT ENVIRONMENT to contribute, including a list of tools, versions, and configuration instructions, if any. A separate plaintext file contains ids and passwords.

You will require the following keys/tokens/hashes of your own to start developing:
- openAI api token
- your own mongoDB database tokens, login, password
- your own encryption key for encrypting user emails
- your own session encryption hashing string
- your own database encryption hashing string

You will require the following tools:
- Your IDE of choice
- a local MongoDB instance, or a MongoDB Atlas instance
- Any browser of choice to preview changes you have made 


Instructions to start developing:
1. Fork this repository
2. git clone your fork into your local machine
3. Install dependencies for the project via "npm i" in the project folder
4. Set up your own mongoDB Atlas or local mongoDB instance 
5. Create your own .env file within the /src directory named ".env.local" for local mongoDB instances, or ".env.dev" for mongoDB Atlas instances. 
6. Fill in your own .env with your own tokens listed in /src/example.env
7. Launch the project by typing "npm run local" for local mongoDB instances, or "npm run dev" for mongoDB Atlas instance into your terminal within the project folder
8. Project should running, happy developing!

Fill feel to contact us if you run into any issues.

Testing spreadsheet: https://docs.google.com/spreadsheets/d/1dW8jB15GkY0_NWLoMBVsNXWW5RbtdFe4pqGRXzF1vog/edit?usp=sharing

## Features

### 1. Account Sign Up and Management
#### Registration
To use the application, you must sign up for an account. To do so, go through the following steps:
* Click sign up here on the Login Page
* Fill in your information
* Press Sign Up
* Choose from one of the preset security questions
* Input your security answer to the question
* Press Submit

#### Password Reset
If you forgot your password, follow these steps to reset your password:
* Click the Forgot your password dropdown on the Login Page
* Press Reset password
* Type in your email address in the modal input
* Press Next Step
* Enter the answer to your Security Question 
* Press Next Step
* Enter your new password and confirmation password
* Click Reset
* Click Log in now

#### Account Information Editing
To edit your account information, go through the following steps:
* Sign in to the application with your account credentials
* Go to the User Profile Page by clicking the Profile Picture Icon on the top right of the header
* Click on your profile picture above your name will allow you to edit your profile picture
* Click on any other buttons to edit the corresponding account details.

### 2. Flashcard Generation
The core feature of this application is to generate flashcards from various source materials. Here are some of the ways you can generate flashcards with.
#### Text Upload
* Go to the Generate Your Flashcards page by clicking on the bottom center footer button.
* Select the Text Upload Tab and select your parameters for flashcard generation
* Press the Upload Study Material Button
* Insert your desired text upload * Press Generate
* Preview the flashcards generated
* If desired, input a name for the flashcard set and press Save to collection

#### Image Upload
* Go to the Generate Your Flashcards page by clicking on the bottom center footer button.
* Select the Image Upload Tab and select your parameters for flashcard generation
* Press the Upload Study Material Button
* Drag and Drop an Image or press the middle to browse your file explorer for the desired image 
* Press Generate
* Preview the flashcards generated
* If desired, input a name for the flashcard set and press Save to collection

#### Photo Upload
* Go to the Generate Your Flashcards page by clicking on the bottom center footer button.
* Select the Take Photo Tab and select your parameters for flashcard generation
* Press the Upload Study Material Button
* Press Take Photo on your desired Study Material
* Press Generate
* Preview the flashcards generated
* If desired, input a name for the flashcard set and press Save to collection

### 3. Flashcard Review
The application allows users to view their generated flashcard sets:
* The user can view their flashcard sets by navigating to the collections page (folder icon on footer), and pressing on any of their saved sets
* On the viewing page, users can tap on flashcards to flip the card between prompt and answers
* There are arrows on each side of the flashcard to tap to navigate to the previous or next flashcard
* Users can tap the sharecode at the bottom of the viewing page to copy it and share it with other users

### 4. Sharing your Flashcards
The application allows users to share their flashcard sets and view others' flashcard sets via a sharecode:
* Users can enter a flashcard code on the home screen of the application by pressing "Open by Code"
* Users can see the sharecode of their flashcard set at the bottom of their screen when viewing their flashcard set
* There might be a way to find a secret easter EGG page through the "Open by Code" feature..

### 5. Flashcard Collection
To see your saved flashcard sets, you can go to your flashcard collection. Here are some steps to using the Flashcard Collection page:
* To go to the Flashcard Collection page, click the right-most footer button (shaped like a folder)
* To review any flashcard set, click on the title of the particular flashcard set you want to review to go to their respective review pages
* To search for a particular flashcard set, input your text in the search bar and press the search button (the magnifying glass icon)
* To sort the collection list, use the Sort dropdown menu and select from the sorting choices
* To delete any flashcard set, click on the red Delete button beside each flashcard and press OK when the alert pops up
* To delete all of the flashcard sets, click on the Delete All button below the search bar and press OK when the alert pops up

### 6. Homepage Study Streak Display
The home page contains elements that help motivate the user to study:
* The application keeps a track of the days in which the user has reviewed their generated flashcard sets which is displayed on the calendar on the homepage
* It also keeps track of the consecutive days in which the user has been studying for, which is displayed as a streak counter above the calendar


## Credits
* Easter Egg Confetti Animation - Jonathan Bell - https://codepen.io/jonathanbell/pen/OvYVYw
* Easter Egg Gifs - Palworld
* Easter Egg Music - Slow Jazz Cafe - https://www.youtube.com/watch?v=RelTcUFL8Yk&ab_channel=BGMchannel-Topic
* All footer images - Google Material Symbols & Icons
* All profile icons - Palworld - https://game8.co/games/Palworld
* Logo Icon - Created using Microsoft Copilot
* Streak Fire Image - https://www.svgrepo.com/vectors/fire/
* Logo and Header Fonts - Google Fonts
* OpenAI Chat Completions API - https://platform.openai.com/docs/guides/text-generation/chat-completions-api
* File Drag & Drop or Browser Component - https://futurecodersweb.com/drag-drop-or-browse-file-upload-tutorial-using-html-css-and-javascript/
* MDN Web Docs - https://developer.mozilla.org/en-US/

## AI Usage
#### Did you use AI to help create your app? If so, how? Be specific. [2 marks]
- We used AI to generate the logo for the application - Microsoft Copilot
- We used AI to understand documentation throughout the development process, such as openAI, express, mongoose documentation
- We used AI to get some ideas on how to approach certain coding problems e.g. "does this functionality I'm thinking of already exist in native JavaScript?". We never just copied and pasted code.
- We used AI at times to help debug our code to see what we were doing wrong (e.g backend errors)
#### Did you use AI to create data sets or clean data sets? If so, how? Be specific. [ 2 marks]
- No we did not, all mock data was generated by ourselves.
#### Does your app use AI? If so, how? Be specific. [ 2 marks]
- Yes, the flashcard generation calls on the openai API for GPT-4o model for generating flashcards from text and images.
- GPT4o analyses the text/image and returns flashcard data to the server.
#### Did you encounter any limitations? What were they, and how did you overcome them? Be specific. [ 2 marks]
- Sometimes when asking AI coding related questions, it does not have enough context on the project to provide an answer suitable for our situation. We overcame this by making sure we include the most important contextual details when prompting.

## Contact Information
Kong, Jimmy
* Email: jimmyatwork368@gmail.com

Li, Louise
* Email: louiseli.van@gmail.com
* Phone: 604-781-3673

Liao, Wei-Yu
* Email: wyliao76@gmail.com

Lin, Joe
* Email: jyyunlin@gmail.com

Lok, Ryan
* Email: rlok.pc@gmail.com
