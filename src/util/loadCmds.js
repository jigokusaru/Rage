const fs = require('fs');
const path = require('path');

// Define the commands folder path
const commandsFolderPath = path.join(__dirname,'..','cmds');

// Initialize an empty object to store the commands
const commands = {};

// Load commands from the specified folder path
function loadCmds(folderPath) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile() && file.endsWith('.js')) {
            // It's a command file
            const command = require(filePath);
            commands[command.name] = command;
        } else if (stat.isDirectory() && (filePath === commandsFolderPath)) {
            console.log(filePath + `   ${path.join(__dirname,"..","cmd")}`);
            // It's a category folder
            loadCmds(filePath);
        }
    }
}

// Start loading commands from the root commands folder
loadCmds(commandsFolderPath);


module.exports = {commands}