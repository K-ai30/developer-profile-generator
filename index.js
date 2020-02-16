const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML");
const convertFactory = require('electron-html-to');

console.log('Process PID: ', process.pid);

const questions = [
  {
      type: "input",
      message: "What's your GitHub Username?",
      name: "username"
  },
  {
      type: "list",
      message: "What is your favorite color?",
      name: "colorChoice",
      choices: ["red", "blue", "green", "pink"]
  }
];

init();

function init() {

    const data = {};
    
    inquirer
    .prompt(questions)
    .then(answers => {
        console.log("Answers: ", answers);
        // Use user's data to populate HTML and PDF
        // Use "answers.colorChoice" to save data for later and pass it to the generateHTML function
        data.color = answers.colorChoice;
        
        // Uses "answers.username" to make an axios call to the "/users/{USERNAME}" github api, which will give us the user's github data.
        data.username = answers.username;

        const ghURL = `https://api.github.com/users/${data.username}`;

        // Execute function
        let githubUser = axios.get(ghURL);
        let githubStars = axios.get(`https://api.github.com/users/` + data.username + `/starred`);
        axios.all([githubUser, githubStars])
        .then(axios.spread(function(user, stars){
            //take properties from the response and add them to our data object
            data.avatar_url = user.data.avatar_url;
            data.name = user.data.name == undefined ? "GitHub User" : user.data.name;
            data.company = user.data.company == undefined ? "Unknown" : user.data.company;
            data.location = user.data.location;
            data.bio = user.data.bio;
            data.blog = user.data.blog;
            data.public_repos = user.data.public_repos;
            data.followers = user.data.followers;
            data.following = user.data.following;
            data.stars = stars.data.length;

            const htmlResult = generateHTML(data);

            conversion = convertFactory({
                converterPath: convertFactory.converters.PDF
            });
            
            conversion({ html: htmlResult}, function(err, result) {
                if (err) {
                    return console.error(err);
                }
            
                result.stream.pipe(fs.createWriteStream('developerProfile.pdf'));
                conversion.kill(); // necessary if you use the electron-server strategy, see below for details
            });
        }))
    })
}