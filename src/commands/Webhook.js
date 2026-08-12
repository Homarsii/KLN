// commands/webhook.js
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  WebhookClient,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("webhook")
    .setDescription("Crée un webhook et envoie un message.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Message à envoyer via le webhook")
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.channel;
    const message = interaction.options.getString("message");

    if (!channel?.isTextBased() || !channel.createWebhook) {
      return interaction.reply({
        content: "Cette commande doit être utilisée dans un salon textuel.",
        ephemeral: true,
      });
    }

    try {
      const webhook = await channel.createWebhook({
        name: "Mon Webhook",
        reason: `Créé par ${interaction.user.tag}`,
      });

      const client = new WebhookClient({ url: webhook.url });

      await client.send({
        content: message,
        username: "Bot Webhook",
        avatarURL: interaction.client.user.displayAvatarURL(),
      });

      await interaction.reply({
        content: `Webhook créé et message envoyé dans ${channel}.`,
        ephemeral: true,
      });

      // À éviter dans un serveur public : l’URL donne le droit d’envoyer des messages.
      // console.log(webhook.url);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "Impossible de créer le webhook. Vérifie que le bot possède la permission « Gérer les webhooks ». ",
        ephemeral: true,
      });
    }
  },
};
