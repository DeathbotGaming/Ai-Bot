const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../configs/config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log')
    .setDescription('Send an embed message to one or more log channels')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('Content for the log message')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channels')
        .setDescription('Log channels to send the message to')
        .setRequired(true)),

  async execute(interaction) {
    const content = interaction.options.getString('content');
    const channels = interaction.options.getChannel('channels');

    const embed = new EmbedBuilder()
      .setColor(config.LogColor)
      .setTitle(content)
      .setTimestamp()
      .setFooter(`Logged by ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }));

    try {
      // Iterate over the channels provided and send the message to each one
      for (const channel of channels) {
        // Check if the bot has permissions to send messages to the channel
        if (!channel.permissionsFor(interaction.client.user).has('SEND_MESSAGES')) {
          return interaction.reply(`I don't have permission to send messages to ${channel.toString()}.`);
        }
        await channel.send({ embeds: [embed] });
      }
      return interaction.reply({ content: "Embed message sent to the log channel(s) successfully!", ephemeral: true });
    } catch (error) {
      console.error("Error sending message:", error);
      return interaction.reply({ content: "There was an error sending the message to one or more log channels. Please try again later.", ephemeral: true });
    }
  },
};
