import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ColorResolvable, CommandInteraction, ComponentType, EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import config from "../../../config.json";

export default {
    subCommand: "user.avatar",
    callback: (interaction: CommandInteraction) => {
        const channel = interaction.client.channels.cache.get(interaction.channel!.id)! as TextChannel;
        const avatarEmbed = new EmbedBuilder();
        let server = true;
    
        let member: GuildMember;
        if(!interaction.options.getUser('user')) {
            member = interaction.guild!.members.cache.get(interaction.member!.user.id)!;
        } else {
            member = interaction.guild!.members.cache.get(interaction.options.getUser('user')!.id) as GuildMember;
        }
        
        avatarEmbed
            .setTitle(`${member.user.username}'s Server Avatar`)
            .setImage(member.displayAvatarURL({size: 2048}))
            .setColor(config.embeds.colors.main as ColorResolvable)
            .setDescription(`[Image URL](${member.displayAvatarURL({size: 2048})})`)
        
        if(member.displayAvatarURL({size: 2048}) == member.user.displayAvatarURL({size: 2048})) {
            interaction.reply({embeds: [avatarEmbed]});
        } else {
            const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`user${interaction.id}`)
                    .setLabel('View User Avatar')
                    .setStyle(ButtonStyle.Primary),
            );
            
            const collector = channel.createMessageComponentCollector({ componentType: ComponentType.Button });

            interaction.reply({embeds: [avatarEmbed], components: [row]});

            collector.on('collect', async (interactionBtn: ButtonInteraction) => {
                if (interactionBtn.customId === `user${interaction.id}`) {   
                    if (server) {
                        avatarEmbed
                        .setTitle(`${member.user.username}'s Avatar`)
                        .setImage(member.user.displayAvatarURL({size: 2048}))
                        .setColor(config.embeds.colors.main as ColorResolvable)
                        .setDescription(`[Image URL](${member.user.displayAvatarURL({size: 2048})})`)

                        row.components[0].setLabel('View Server Avatar');
                        server = false;
                    } else {
                        avatarEmbed
                        .setTitle(`${member.user.username}'s Server Avatar`)
                        .setImage(member.displayAvatarURL({size: 2048}))
                        .setColor(config.embeds.colors.main as ColorResolvable)
                        .setDescription(`[Image URL](${member.displayAvatarURL({size: 2048})})`)

                        row.components[0].setLabel('View User Avatar');
                        server = true;
                    }

                    interaction.editReply({embeds: [avatarEmbed], components: [row]}).catch(async () =>{
                        await interactionBtn.reply({content: "This interaction has timed out, please run the command again.", ephemeral: true});
                        collector.removeAllListeners();
                        collector.stop();
                        return;
                    });

                    interactionBtn.deferUpdate();
                }
            });
        }
    }
}