// Resumes song playback.

import { Client, Message } from 'discord.js';
import playercore from '../../player/playercore';
import { getVoiceConnection } from '@discordjs/voice';

export default {
    aliases: ['resume'],
    // Main function.
    async execute(client: Client, message: Message, prefix: string, ...args: string[]) {

        if (!message.member!.voice.channel) {
            message.reply("Necesitas estar dentro de un ****canal de voz****.");
            return;
        }
        if (message.guild!.members.me!.voice.channel && message.member!.voice.channelId != message.guild!.members.me!.voice.channelId) {
            message.reply('Lo siento pero ya estoy dentro de un canal y no pienso moverme. Mejor ven tú UwU.');
            return;
        }
        // Check if there is a voice connection.
        if (!getVoiceConnection(message.guildId!)) {
            message.reply(`No hay un reproductor activo en este servidor \n\`Intenta: ${prefix}play <canción o url>\``);
            return;
        }

        // check if there are songs in the queue.
        const queue = await playercore.getServerQueue(message.guildId!);
        if (queue.length < 1) {
            message.reply(`No hay ninguna canción en la cola. Intenta agragando una usando: \n\`${prefix}play <canción o url>\``);
            return;
        }

        playercore.resume(message.guildId!);
    }
}