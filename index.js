import { ChannelType, Client, GatewayIntentBits, PermissionsBitField } from 'discord.js';
import { config } from 'dotenv';
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.name !== 'submit-question') return;

  // Create the "test" channel
  const guild = message.guild;
  const specificRoleId = '1076368009649721438';

  guild.channels
    .create({
      name: 'Question Asked by ' + message.author.username,
      type: ChannelType.GuildText,
      parent: message.channel.parent,
      permissionOverwrites: [
        // allow everyone else to not view the channel

        {
          id: specificRoleId,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    })
    .then((channel) => {
      let msgContent = `Question asked by <@${message.author.id}>:\n\n\`\`\`${message.content}\`\`\``;

      // check if there are any attachments in the message
      if (message.attachments.size > 0) {
        message.attachments.forEach((attachment) => {
          msgContent += `\n\n${attachment.url}`;
        });
      }

      console.log(`Created a new channel: @${channel.name}`);
      channel.send(msgContent);

      // delete the orignal message
      message.delete();
    })
    .catch((error) => {
      console.error('Error creating a new channel:', error);
    });

  console.log('🚀  message.content:', message.content);
});

client.login(process.env.DISCORD_BOT_TOKEN);
