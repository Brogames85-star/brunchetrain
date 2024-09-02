require('dotenv').config();  // Load environment variables from .env file
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// IDs you provided
const allowedRoleId = '1279368275003838526';  // Role ID with hosting permissions
const channelId = '1279370665656320041';  // Announcement channel ID
const logChannelId = '1279368456453623809';  // Log channel ID

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const user = message.member;

    // Check if user has the required role
    if (!user.roles.cache.has(allowedRoleId)) {
        return message.reply('ERROR: You don’t have permission to host.');
    }

    const targetChannel = client.channels.cache.get(channelId);  // Announcement channel
    const logChannel = client.channels.cache.get(logChannelId);  // Log channel

    // Check if the channels exist
    if (!targetChannel) {
        return message.reply('ERROR: Announcement channel not found.');
    }
    if (!logChannel) {
        return message.reply('ERROR: Log channel not found.');
    }

    if (command === 'shiftstart') {
        // Create the embed for shift start
        const shiftEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('A shift is currently being hosted at the dentist!')
            .setDescription('Attending a shift gives you the opportunity to be promoted up one rank, our management team will be on the lookout for hard-working staff who may be promoted.')
            .addFields({ name: 'Host', value: message.author.toString() })
            .setTimestamp();

        // Create buttons for game link and Roblox profile
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Join Game')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://roblox.com'),  // Roblox game link
                new ButtonBuilder()
                    .setLabel('Host Roblox Profile')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://www.roblox.com/users/${message.author.id}/profile`)
            );

        // Send the embed message in the target channel
        await targetChannel.send({ embeds: [shiftEmbed], components: [row] });

        // Log the event in the log channel
        await logChannel.send(`A shift was started by ${message.author.toString()}.`);

    } else if (command === 'shiftend') {
        // Create the embed for shift end
        const shiftEndEmbed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setTitle('Ending of the shift!')
            .setDescription('The shift has come to an end, thank you all for attending. Please remain in-game as long as you\'d like to show your activity. Once again thank you for attending, and if you were not promoted don\'t fret; there will be other chances in the near future.')
            .setTimestamp();

        // Send the embed message in the target channel
        await targetChannel.send({ embeds: [shiftEndEmbed] });

        // Log the event in the log channel
        await logChannel.send(`The shift hosted by ${message.author.toString()} has ended.`);

    } else if (command === 'trainingstart') {
        // Create the embed for training start
        const trainingEmbed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('A training session is starting!')
            .setDescription('This is your chance to learn and get promoted to the next rank. Please follow all instructions from the host to ensure your success.')
            .addFields({ name: 'Host', value: message.author.toString() })
            .setTimestamp();

        // Button for the Training Center link
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Training Center')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://roblox.com')  // Training center link (same Roblox link)
            );

        // Send the embed message in the target channel
        await targetChannel.send({ embeds: [trainingEmbed], components: [row] });

        // Log the event in the log channel
        await logChannel.send(`A training session was started by ${message.author.toString()}.`);

    } else if (command === 'trainingend') {
        // Create the embed for training end
        const trainingEndEmbed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setTitle('Training has ended!')
            .setDescription('Thank you for attending the training session. Please continue to practice and we look forward to seeing you in future sessions.')
            .setTimestamp();

        // Send the embed message in the target channel
        await targetChannel.send({ embeds: [trainingEndEmbed] });

        // Log the event in the log channel
        await logChannel.send(`The training session hosted by ${message.author.toString()} has ended.`);
    }
});

client.login(process.env.DISCORD_TOKEN);
