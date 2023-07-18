# Discord Question Bot

Discord Question Bot is a bot developed using [discord.js](https://discord.js.org/#/) library in Node.js. It listens for messages in a specific channel (in this case "submit-question") and then creates a new text channel for each message, while deleting the original message. The bot also checks if there are any attachments in the message and includes them in the new channel. 

The created channels are only visible to a specific role and invisible to everyone else.

## Prerequisites

Before you begin, make sure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/en/) and npm.
- You have a Windows/Linux/Mac machine.
- You have a basic understanding of JavaScript and discord.js library.
- You have created a Discord Bot and have its token.

