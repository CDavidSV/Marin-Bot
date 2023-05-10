import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ColorResolvable, CommandInteraction, ComponentType, EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import config from "../config.json";

const row = new ActionRowBuilder<ButtonBuilder>()
.addComponents(
    new ButtonBuilder()
        .setCustomId('user')
        .setLabel('View User Avatar')
        .setStyle(ButtonStyle.Primary),
);

const showAvatar = (interaction: CommandInteraction, isEphemeral: boolean) => {
    const channel = interaction.client.channels.cache.get(interaction.channel!.id)! as TextChannel;
    const collector = channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
    const avatarEmbed = new EmbedBuilder();

    let member: GuildMember;
    if(!interaction.options.getUser('user')) {
        member = interaction.guild!.members.cache.get(interaction.member!.user.id)!;
    } else {
        member = interaction.guild!.members.cache.get(interaction.options.getUser('user')!.id) as GuildMember;
    }
    
    avatarEmbed
        .setTitle(`Avatar of ${member.user.tag}`)
        .setImage(member.displayAvatarURL({size: 2048}))
        .setColor(config.embeds.colors.main as ColorResolvable)
        .setDescription(`[Image URL](${member.displayAvatarURL({size: 2048})})`)
    
    if(member.displayAvatarURL({size: 2048}) == member.user.displayAvatarURL({size: 2048})) {
        interaction.reply({embeds: [avatarEmbed], ephemeral: isEphemeral});
    } else {
        interaction.reply({embeds: [avatarEmbed], components: [row], ephemeral: isEphemeral});
    }

    collector.once('collect', async (interactionBtn: ButtonInteraction) => {
        avatarEmbed
            .setTitle(`Avatar of ${member.user.tag}`)
            .setImage(member.user.displayAvatarURL({size: 2048}))
            .setColor(config.embeds.colors.main as ColorResolvable)
            .setDescription(`[Image URL](${member.user.displayAvatarURL({size: 2048})})`)

        interaction.editReply({components: []});
        
        await interactionBtn.reply({embeds: [avatarEmbed], ephemeral: isEphemeral}).catch(() => {});
        collector.removeAllListeners();
        collector.stop();
    });
}

const showBanner = () => {
    return
}

export {
    showAvatar
}