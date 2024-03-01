

const Discord = require('discord.js');
const chalk = require('chalk');
const fs = require('node:fs');
const config = require('./configs/config.json');

// Discord Client Constructor
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent
  ]
});

// Event Handler
console.log(chalk.bold.yellowBright('Loading Events'));
const events = fs.readdirSync(`./events/`).filter(file => file.endsWith('.js'));
for (const file of events) {
  const event = require(`./events/${file}`);
  client.on(file.split('.')[0], event.bind(null, client));
  delete require.cache[require.resolve(`./events/${file}`)];
};

// Message Command Handler
console.log(chalk.bold.yellowBright('Loading Message Commands'));
client.MessageCommands = new Discord.Collection();
const messageCommands = fs.readdirSync(`./commands/messages/`).filter(files => files.endsWith('.js'));
for (const file of messageCommands) {
  const command = require(`./commands/messages/${file}`);
  client.MessageCommands.set(command.name.toLowerCase(), command);
  delete require.cache[require.resolve(`./commands/messages/${file}`)];
};

// Slash Command Handler
console.log(chalk.bold.yellowBright('Loading Slash Commands'));
client.SlashCommands = new Discord.Collection();
const slashCommands = fs.readdirSync(`./commands/interactions/`).filter(files => files.endsWith('.js'));

// Create an array to hold all slash commands
const commands = [];

for (const file of slashCommands) {
    const command = require(`./commands/interactions/${file}`);
    client.SlashCommands.set(command.data.name, command);
    commands.push(command.data.toJSON()); // Convert to JSON and add to commands array
}

// Initialize REST
const rest = new Discord.REST({ version: '9' }).setToken(config.Token);

// Define an async function to handle the registration of slash commands
async function registerSlashCommands() {
    try {
        console.log('Started registering slash commands.');

        await rest.put(
            '/applications/1199858077655126188/commands', // Replace {applicationId} with your bot's application ID
            { body: commands },
        );

        console.log('Successfully registered slash commands.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
}

// Call the async function to register slash commands
registerSlashCommands();

// GitHub repository details
const repositoryOwner = 'DeathbotGaming';
const repositoryName = 'Ai-Bot';
const branch = 'main'; // Or the branch where your bot's code resides

// Function to update the bot from GitHub repository
async function updateBotFromGitHub() {
    try {
        console.log('Checking for updates from GitHub...');

        // Fetch latest commit hash of the main branch from GitHub
        const response = await fetch(`https://api.github.com/repos/${repositoryOwner}/${repositoryName}/commits/${branch}`);
        const data = await response.json();
        const latestCommitHash = data.sha;

        // Check if the latest commit hash is different from the current one
        const currentCommitHash = fs.readFileSync('.git/refs/heads/main', 'utf-8').trim(); // Adjust the path if your branch is different
        if (latestCommitHash !== currentCommitHash) {
            console.log('Updating bot from GitHub...');

            // Pull changes from the GitHub repository
            await exec('git pull origin main'); // Adjust the branch name if necessary

            // Restart the bot to apply changes
            process.exit();
        } else {
            console.log('Bot is up to date.');
        }
    } catch (error) {
        console.error('Error updating bot from GitHub:', error);
    }
}

// Function to check for updates at regular intervals
function checkForUpdates() {
    // Set an interval to check for updates (e.g., every 24 hours)
    const interval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    setInterval(updateBotFromGitHub, interval);

    // Perform initial check for updates on bot startup
    updateBotFromGitHub();
}

// Call the function to check for updates
checkForUpdates();

// Anti Crash
process.on('unhandledRejection', (reason, p) => {
  console.log(chalk.bold.redBright('[antiCrash] :: Unhandled Rejection/Catch'));
  console.log(reason?.stack, p);
});

process.on("uncaughtException", (err, origin) => {
  console.log(chalk.bold.redBright('[antiCrash] :: ncaught Exception/Catch'));
  console.log(err?.stack, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(chalk.bold.redBright('[antiCrash] :: Uncaught Exception/Catch (MONITOR)'));
  console.log(err?.stack, origin);
});

// Discord Client login
client.login(config.Token);