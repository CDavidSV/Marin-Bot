import { ActionRowBuilder, ChatInputCommandInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import guildScheema from "../../../schemas/guildSchema";

export default {
    subCommand: "settings.welcome.message",
    callback: async (interaction: ChatInputCommandInteraction) => {
        const modalId = 'welcomeMessageModal';

        const modal = new ModalBuilder()
            .setCustomId(modalId)
            .setTitle('Configure Welcome message/image');
        
        const welcomeMessageInput = new TextInputBuilder()
            .setCustomId('messageInput')
            .setLabel('welcome text')
            .setPlaceholder('Message that will be sent once the user joins the server')
            .setMaxLength(2000)
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph)

        const imageInput = new TextInputBuilder()
            .setCustomId('imageInput')
            .setLabel('welcome image')
            .setPlaceholder('url for the welcome image')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        
        const syntax = new TextInputBuilder()
            .setCustomId('syntax')
            .setLabel('syntaxes')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setValue(`{username} - User's name\n{mention} - User's mention\n{id} - User's ID\n{server} - Server name\n{members} - Server member count\n`)

        const guildSettings = await guildScheema.findById(interaction.guild?.id).catch(() => null);

        if (guildSettings && guildSettings.welcome?.welcome_message) {
            welcomeMessageInput.setValue(guildSettings.welcome.welcome_message);
        }
        if (guildSettings && guildSettings.welcome?.welcome_image) {
            imageInput.setValue(guildSettings.welcome.welcome_image);
        }

        const firstRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(welcomeMessageInput);
        const secondRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(imageInput);
        const thirdRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(syntax)
        modal.addComponents(firstRow, secondRow, thirdRow);

        await interaction.showModal(modal);
    }
}