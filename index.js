import {
  ChannelType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  PermissionsBitField,
} from 'discord.js';
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

// Submit Question Channel
const handleQuestion = (message) => {
  const guild = message.guild;
  const specificRoleId = '1076368009649721438';

  guild.channels
    .create({
      name: 'Question-' + message.author.username,
      type: ChannelType.GuildText,
      parent: message.channel.parent,
      permissionOverwrites: [
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
};

const handleRejectQuestion = (message, { user, reason }) => {
  message.channel.send(' ❌ Question rejected by <@' + message.author.id + '>, reason: ' + reason);
  const channelId = '1130980204005818408';
  const channel = client.channels.cache.get(channelId);

  const userWhoAsked = channel.members.find(
    (member) => member.user.username === message.channel.name.split('-')[1],
  );

  userWhoAsked.send(' ❌ Question rejected by <@' + message.author.id + '>, reason: ' + reason);
};

const handleAnswerQuestion = (message, { answer }) => {
  const channelId = '1130980204005818408';
  const channel = client.channels.cache.get(channelId);

  const userWhoAsked = channel.members.find(
    (member) => member.user.username === message.channel.name.split('-')[1],
  );

  userWhoAsked.send(' ✅ Question answered by <@' + message.author.id + '>, answer: ' + answer);

  message.channel.send(' ✅ Question answered by <@' + message.author.id + '>, answer: ' + answer);

  addQuestionToGlobalChannel({ message: answer, askedBy: message.channel.name.split('-')[1] });
};

const addQuestionToGlobalChannel = ({ message, askedBy }) => {
  const channelId = '1130980204005818408';
  const channel = client.channels.cache.get(channelId);

  const user = channel.members.find((member) => member.user.username === askedBy);
  console.log('🚀  user:', user.user.avatar);
  const avatar =
    'https://cdn.discordapp.com/avatars/' + user.user.id + '/' + user.user.avatar + '.jpeg';

  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Asked Question')
    .setAuthor({
      name: askedBy || 'Author',
      iconURL: avatar,
    })
    .setDescription(message || 'error')
    .setTimestamp()
    .setFooter({ text: 'Qquestion #1212' });

  channel.send({ embeds: [exampleEmbed] });
};

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.name === 'submit-question') {
    handleQuestion(message);
    return;
  }

  if (message.channel.name.split('-')[0] === 'question') {
    // A user can reject a message by the following command:
    // !reject sorry this question is not relevant
    if (message.content.startsWith('!reject')) {
      handleRejectQuestion(message, {
        reason: message.content.split(' ').slice(1).join(' '),
      });
      return;
    }

    // A user can answer a question by the following command:
    // !answer this is the answer
    if (message.content.startsWith('!answer')) {
      handleAnswerQuestion(message, {
        answer: message.content.split(' ').slice(1).join(' '),
      });
      return;
    }
    return;
  }

  console.log('🚀  message.content:', message.content);
});

client.login(process.env.DISCORD_BOT_TOKEN);
