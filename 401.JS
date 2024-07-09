const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const TelegramBot = require('node-telegram-bot-api');

const token = '7158989079:AAHm_OO-dXJG7Tym2ckp8aP1mpEKO4HqNaI';
const bot = new TelegramBot(token, { polling: true });

var serviceAccount = require("./serviceAccountkey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

bot.on('message', function(msg) {
  console.log(msg)
  const text = msg.text.toUpperCase();
  const parts = text.split(" ");
  const command = parts[0];
  
  if (text === '/START') {
    bot.sendMessage(msg.chat.id, ` Hii Mr.${msg.from.first_name}-${msg.chat.id},\n --Welcome to Datastore-All--`, {
      "reply_markup": {
        "keyboard": [["Insert Data"], ["Retrieve data"], ["Retrieve all Info"]]
      }
    });
  } else {
    if (command === 'INSERT' && parts.length >= 3) {
      const key = parts[1];
      const dataValue = parts.slice(2).join(" ");
      
      db.collection('Datastore-all').add({
        key: key,
        dataValue: dataValue,
        userID: msg.from.id
      }).then(() => {
        bot.sendMessage(msg.chat.id, `${key} stored successfully`);
      }).catch(error => {
        console.error("Error adding document: ", error);
        bot.sendMessage(msg.chat.id, "An error occurred while storing the data.");
      });
    } else if (command === 'GET') {
      const requestedKey = parts[1]; // Get the requested key
      db.collection('Datastore-all').where('userID', '==', msg.from.id).where('key', '==', requestedKey).get().then((docs) => {
        if (docs.empty) {
          bot.sendMessage(msg.chat.id, `No data found for key '${requestedKey}'.`);
        } else {
          docs.forEach((doc) => {
            bot.sendMessage(msg.chat.id, `${doc.data().key} ${doc.data().dataValue}`);
          });
        }
      }).catch(error => {
        console.error("Error getting documents: ", error);
        bot.sendMessage(msg.chat.id, "An error occurred while retrieving the data.");
      });
    } else if (text === "RETRIEVE ALL INFO") {
      db.collection('Datastore-all').where('userID', '==', msg.from.id).get().then((docs) => {
        if (docs.empty) {
          bot.sendMessage(msg.chat.id, "No data found.");
        } else {
          docs.forEach((doc) => {
            bot.sendMessage(msg.chat.id, `${doc.data().key} ${doc.data().dataValue}`);
          });
        }
      }).catch(error => {
        console.error("Error getting documents: ", error);
        bot.sendMessage(msg.chat.id, "An error occurred while retrieving the data.");
      });
    } else {
      // Check for specific keywords
      if (text === "INSERT DATA") {
        bot.sendMessage(msg.chat.id, "Please make sure you include 'INSERT' in your message to insert data.\nSyn: insert $Data $Datavalue");
      } else if (text === "RETRIEVE DATA") {
        bot.sendMessage(msg.chat.id, "Please make sure you include 'GET' followed by the key in your message to retrieve data.\n Syn: get $Data");
      } else {
        bot.sendMessage(msg.chat.id, "Please make sure you include 'GET' or 'INSERT' in your message to insert or retrieve data.");
      }
    }
  }
});
