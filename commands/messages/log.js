const Discord = require('discord.js');
const config = require('../../configs/config.json');
const { Client, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "Log",
  aliases: ["L", "LogMessage"],
  description: "Send an embed message to the log channel",

  async execute(client, message, args, cmd) {
    if (!args.length) {
      return message.reply("Please provide content for the log message.");
    }

    const logChannelId = "1152127763214516284"; // Hardcoded Log Channel ID

    const logChannel = client.channels.cache.get(logChannelId);

    if (!logChannel) {
      return message.reply("I couldn't find the log channel. Please make sure it's configured correctly.");
    }

    // Check if the bot has permissions to send messages to the log channel
    if (!logChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
      return message.reply("I don't have permission to send messages to the log channel.");
    }

    // Construct the embed using MessageEmbed constructor
    const embed = new EmbedBuilder()
      .setTitle(args.join(" "));

    try {
      await logChannel.send({ embeds: [embed] });
      message.reply("Embed message sent to the log channel successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      message.reply("There was an error sending the message to the log channel.");
    }
  }
};
