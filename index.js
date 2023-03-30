const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'say') {
    if (!message.member.voice.channel) {
      return message.reply('ボイスチャンネルに接続してください。');
    }
    if (!args.length) {
      return message.reply('再生する音声ファイル名を指定してください。');
    }
    const connection = await message.member.voice.channel.join();
    try {
      for (const arg of args) {
        const dispatcher = connection.play(fs.createReadStream(`./${arg}.mp3`));
        dispatcher.on('finish', () => {
          console.log(`${arg}.mp3 was played`);
        });
      }
    } catch (error) {
      console.log(error);
    }
    connection.disconnect();
  }
});

client.login(config.token);
