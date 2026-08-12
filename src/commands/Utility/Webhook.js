import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("webhook")
    .setDescription("Crée un webhook et envoie un message.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Le message à envoyer")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const channel = interaction.channel;
      const message = interaction.options.getString("message");

      if (!channel?.isTextBased() || typeof channel.createWebhook !== "function") {
        return interaction.reply({
          content: "Utilise cette commande dans un salon textuel.",
          flags: MessageFlags.Ephemeral,
        });
      }

      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const webhook = await channel.createWebhook({
        name: "KLIN Webhook",
        reason: `Créé par ${interaction.user.tag}`,
      });

      await webhook.send({
        content: message,
        username: "KLIN Webhook",
        avatarURL: interaction.client.user.displayAvatarURL(),
      });

      await interaction.editReply("Webhook créé et message envoyé.");
    } catch (error) {
      console.error("Erreur commande webhook :", error);

      const reply = {
        content:
          "Impossible de créer le webhook. Vérifie que le bot a la permission « Gérer les webhooks ». ",
        flags: MessageFlags.Ephemeral,
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};
