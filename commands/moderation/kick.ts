// Kicks a guild member.
import config from '../../config.json';
import { Client, Message, Permissions, EmbedBuilder, AttachmentBuilder, ColorResolvable, PermissionsBitField } from 'discord.js';

export default {
    aliases: ['kick'],
    execute(client: Client, message: Message, prefix: string, ...args: string[]) {

        // Convert args to lowercase.
        args = args.map(arg => arg.toLowerCase());
        // error and success images.
        const errorImg = new AttachmentBuilder(config.embeds.errorImg);
        // Get guild 
        const { guild } = message;
        // Create message embed.
        const kickEmbed = new EmbedBuilder();
        // Kick reason.
        let kickReason = 'No especificada';

        // Validate that the user requesting the action has enough Permissions.
        if (!message.member!.permissions.has([PermissionsBitField.Flags.KickMembers])) {
            kickEmbed
                .setColor(config.embeds.errorColor as ColorResolvable)
                .setAuthor({ name: 'No tienes permiso para usar este comando.', iconURL: 'attachment://error-icon.png' })
            message.reply({ embeds: [kickEmbed], files: [errorImg] });
            return;
        }

        // In case the no member is mentioned.
        if (args.length < 2) {
            kickEmbed
                .setColor(config.embeds.errorColor as ColorResolvable)
                .setAuthor({ name: 'Debes de mencionar al miembro.', iconURL: 'attachment://error-icon.png' })
                .setDescription(`Intenta ingresando \`${prefix}kick <@miembro> (razón opcional)\``)
            message.reply({ embeds: [kickEmbed], files: [errorImg] });
            return;
        }

        // No reason specified.
        if (args.length > 2) {
            kickReason = String(args.slice(2)).replace(/,/g, ' ');
        }

        // Get member object.
        const userID = args[1].replace(/[<@!&>]/g, '');
        const member = guild!.members.cache.get(userID);

        // member does not exist
        if (!member) {
            kickEmbed
                .setColor(config.embeds.errorColor as ColorResolvable)
                .setAuthor({ name: 'Ese miembro no existe.', iconURL: 'attachment://error-icon.png' })
            message.reply({ embeds: [kickEmbed], files: [errorImg] });
            return;
        }

        // Avoids user from banning moderators and administrators.
        if ((member!.permissions.has([PermissionsBitField.Flags.Administrator]) || !member!.kickable) && message.member!.id !== guild!.ownerId) {
            kickEmbed
                .setColor(config.embeds.errorColor as ColorResolvable)
                .setAuthor({ name: 'No puedes expulsar a un administrador.', iconURL: 'attachment://error-icon.png' })
            message.reply({ embeds: [kickEmbed], files: [errorImg] });
            return;
        }

        if (!guild!.members.me!.permissions.has([PermissionsBitField.Flags.KickMembers])) {
            kickEmbed
                .setColor(config.embeds.errorColor as ColorResolvable)
                .setAuthor({ name: 'No tengo permisos para realizar esta acción.', iconURL: 'attachment://error-icon.png' })
            message.reply({ embeds: [kickEmbed], files: [errorImg] });
            return;
        }

        message.delete();
        // Attempts to ban the mentioned user.
        member!.kick(kickReason).then(() => {
            kickEmbed
                .setColor(config.embeds.defaultColor as ColorResolvable)
                .setAuthor({ name: `${member!.user.tag} fue expulsad@ del servidor.`, iconURL: String(member!.user.avatarURL()) })
                .setDescription(`****Razón:**** ${kickReason}`)
            message.channel.send({ embeds: [kickEmbed] });
        }).catch(() => {
            kickEmbed
                .setColor(config.embeds.errorColor as ColorResolvable)
                .setAuthor({ name: 'No puedo hacer eso porque mi rol más alto está demasiado bajo en la jerarquía.', iconURL: 'attachment://error-icon.png' })
            message.channel.send({ embeds: [kickEmbed], files: [errorImg] });
        });
    }
}