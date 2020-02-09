const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML");
const convertFactory = require('electron-html-to');

init();

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

function init() {
    
    const data = {};
    
    inquirer
    .prompt(questions)
    .then(answers => {
        // Use user feedback for... whatever!!
        //we want to save answers.colorChoice for later and pass it to the generateHTML function
        data.color = answers.colorChoice;
        
        //we wanna use answers.username to make an axios call to the "/users/{USERNAME}" github api, which will give us the user's github data.
        data.username = answers.username;
        const ghURL = `https://api.github.com/users/${data.username}`;
        axios.get(ghURL).then(response => {
            //take properties from the response and add them to our data object
            data.name = response.data.name;
            data.followers = response.data.followers;
            
            //we want to also use answers.username to make an axios call to a different "users/{USERNAME}/repos"
            const ghReposURL = //build url the same way we did above except for the repose endpoint^^^
            axios.get(ghReposURL).then(response => {
                //figure out the
            })
        })
         
        
        // for each
        // data.public_repo.forEach(data.public_repo, star) {
        //     if ()
        // }

        // after we get all of that data, then we can pass it all to generateHTML()

        //but we'll need to actually add html to generateHTML and put data in the appropriate spots

        // const generatedHTML = generateHTML.generateHTML(data);  
        fs.writeFile("./index2.html", generateHTML(data), "UTF8", function(error) {
            if (error) console.log(err);
        });
    });
    
    // axios
    // .prompt( => {
    //     const ghURL = `https://api.github.com/users/${USERNAME}`;
    // }
    // // axios 
    // .prompt
    // 2 prompts
    // - data.followers
    // data.public
    // save to data object
    
}
var conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
  });
   
  conversion({ html: generateHTML(data) }, function(err, result) {
    if (err) {
      return console.error(err);
    }
   

    result.stream.pipe(fs.createWriteStream('/path/to/anywhere.pdf'));
    conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
  });

function writeToFile(fileName, data) {

}
