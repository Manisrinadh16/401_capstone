const request = require('request');
const TelegramBot = require('node-telegram-bot-api');

const unsplashAccessKey = 'chp6T5tuiU6M-i677Rnm1PKhkoYh4ai9Aar1tT6J44I';
const token = 'Y6629668009:AAHgV0GklZqbDIxy66WFZLr_tWEN97mz4Uo'; // Replace with your bot token

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    console.log(msg);
    
    if (msg.text === '/start') {
        bot.sendMessage(msg.chat.id, "Welcome to text-to-image generator***");
        bot.sendMessage(msg.chat.id, "Enter required prompt:");
        bot.sendPhoto(msg.chat.id, "https://backendless.com/wp-content/uploads/2023/10/open-ai-image-service.png");
    } else {
        const category = msg.text.toLowerCase();
        const unsplashUrl = `https://api.unsplash.com/photos/random?query=${category}&client_id=${unsplashAccessKey}`;

        request(unsplashUrl, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                bot.sendMessage(msg.chat.id, "Error. Try again😉:");
                return;
            }
            
            const data = JSON.parse(body);
            if (data && data.urls && data.urls.regular) {
                bot.sendPhoto(msg.chat.id, data.urls.regular, { caption: "Here's your prompt image 💞." });
                bot.sendMessage(msg.chat.id, "If not matched, Please Try again😉:");
            } else {
                bot.sendMessage(msg.chat.id, "Failed to fetch a random image.");
            }
        });
    }
});
