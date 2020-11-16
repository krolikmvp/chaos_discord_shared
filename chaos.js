const config = require("./config.json");
const Discord = require("discord.js");
var sql = require('sqlite-sync');
sql.connect("./chaos.sqlite");
const client = new Discord.Client();
const fs = require("fs");
var Colors = require("./colors.js")
var Quote = require("./quote.js")
var Stats = require("./stats.js")


var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var COOLDOWN_HOURS = 48; //one hour


client.on("message", (message) => {

  if(!message.content.startsWith(config.prefix))
  {
    Quote.addQuote(message,sql)
    Stats.addMessage(message,sql)
  }
  else
  {

      const args = message.content.trim().split(/ +/g);
      var args2 = message.content.slice(config.prefix.length).trim().split(/ +/g);
      let nickname = args[1];
      const command = args2.shift().toLowerCase();

      Quote.listenCommands(message,sql,args,args2,command)
  }
});

client.on("ready", () => {

  Colors.Setup(COOLDOWN_HOURS)
  console.log("I am ready!");

});


client.login(config.token);
