const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "feedback",
  aliases: ["suggest", "improve"],
  description: "Provide feedback or suggestions to improve the bot.",

  async execute(client, message, args, cmd) {
    // Check if content is provided for the feedback
    if (!args.length) {
      return message.reply("Please provide your feedback or suggestion.");
    }

    const feedbackChannelId = "1213062524526927892"; // Hardcoded channel ID where feedback will be sent

    const feedbackChannel = client.channels.cache.get(feedbackChannelId);

    if (!feedbackChannel) {
      return message.reply("The feedback channel is not configured or I couldn't find it.");
    }

    // Construct the embed for the feedback
    const embed = new EmbedBuilder()
  .setColor("#00ff00") // Change color if needed
  .setTitle("New Feedback/Suggestion")
  .setDescription(args.join(" "))
  .setTimestamp()

    try {
      await feedbackChannel.send({ embeds: [embed] });
      message.reply("Your feedback/suggestion has been submitted successfully! Thank you for helping us improve the bot.");
    } catch (error) {
      console.error("Error sending feedback:", error);
      message.reply("There was an error submitting your feedback/suggestion. Please try again later.");
    }
  }
};
