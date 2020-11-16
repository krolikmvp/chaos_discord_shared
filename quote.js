const Discord = require("discord.js");
var Colors = require("./colors.js")
var Stats = require("./stats.js")
var moment = require('moment');
const config = require("./config.json");
const fs = require("fs");
const Lol = require("./lol/lol_features.js");
const { MIME_JGD } = require("jimp");

moment.locale();
//var ONE_HOUR = 3600000 //miliseconds_


function fileExists(path, timeout,message) {
    var timeout = setInterval(function() {

        const file = path;
        const fileExists = fs.existsSync(file);

        if (fileExists) {
            message.channel.send( {
              files: [
                path
              ]
            })
            clearInterval(timeout);
            return 1;
        }
    }, timeout);
};


function getVoiceChannelUsers(message){
// Gets all users from voice channel
  var users_table = []
  var channel_id = null

  message.guild.channels.forEach(function(channel){
    if(channel.type == 'voice'){
      channel.members.forEach(function(user){
        if ( message.author.username == user.user.username)
          channel_id = channel.id
      });
    }
  });
  message.guild.channels.forEach(function(channel){
    if(channel.id == channel_id){
      channel.members.forEach(function(member){
        users_table.push(member.user.username)
      });
    }

  });
  console.log(users_table)
  return users_table;
}

function listenCommands(message,sql,args,args2,command)
{

  if(command == 'champions' || command == 'champs'|| command == 'champ'|| command == 'champion')
  {
  // Rolls specified number of champions for each team
  // example: champions 12 2 (rolls 12 champions for each team, 2 champions from free rotation)
    Lol.rollChamps(args2).then(teams=>{
      var embed = new Discord.RichEmbed()
      .setColor(12331111)
      .setTitle(' ');
      embed.addField('Team 1:',teams[0],1);
      embed.addField('Team 2:',teams[1],1);
      message.channel.send({embed});
    })
    return;
  }

  if(command == 'mutacja')
  {
  // Changes user role to random one from specified roles
    Colors.listener(message,sql)
    return;
  }

  if(command == 'print')
  {
  // Prints all of the quotes (disabled due to large number of quotes)
    // printQuotes(sql)
    return;
  }

  if(command == 'conatomenel')
  {
  // Sends a message with a random quote
      conatomenel(message,sql)
      return;
  }

  if(command == 'conatohustler')
  {
  // Sends a message with selected quote
      conatohustler(message,sql)
      return;
  }

  if(command == 'start')
  {
  // Creates tables in database if not exists
      createTable(message,sql)
      return;
  }


  // Bans functionality, temporaliy disabled
  // if(command == 'bans')
  //   {
  //       var rows = sql.run('SELECT champion FROM bans');
  //       console.log(rows)
  //       var banned = ""
  //       for ( x in rows)
  //         banned+=capitalizeFirstLetter(rows[x].champion+'\n')

  //       if(banned)
  //         message.channel.send(banned)
  //       return;
  //   }

  //   if(command == 'ban')
  //   {
  //       console.log(args2)
  //       var champ = args2[0].toLowerCase()


  //       if(champ != 'rm' && champ != 'clear'){

  //           //sql.run(SELECT champion FROM bans WHERE champion = ${champ});

  //           sql.run(`INSERT OR REPLACE INTO bans (champion) VALUES (?)`, [champ]);
  //           message.channel.send(`Zbanowano ${champ}!`)

  //       }

  //       if(champ == 'rm')
  //       {
  //         var champion2 = args2[1].toLowerCase()
  //         sql.run(`DELETE FROM bans WHERE champion = "${champion2}"`);
  //         message.channel.send(`${champion2} przywrócony do rotacji!`)
  //       }

  //       if(champ == 'clear')
  //       {
  //           console.log('clearing')
  //           sql.run(`DELETE from bans`);
  //       }

  //       return;
  //   }

  if( command == 'roll'){
  // Takes users from the voice channel and splits them into 2 teams

    var test_table1 = getVoiceChannelUsers(message)
    var team1 = []
    var team2 = []

    var players = test_table1.length

    var initial_length = test_table1.length

    while( players > 0 )
    {
      var pos = Math.floor(Math.random() * players)

      if (team1.length < Math.floor(initial_length/2))
        team1.push(test_table1[pos])
      else {
        team2.push(test_table1[pos])
      }
      test_table1.splice(pos,1)
      players = test_table1.length

    }

    if(team2.length < 1){
      console.log("not enought players")
      return;
    }
    var teams = [team1, team2]
    var marudy = [["deasum", "etf"]]

      for (i=0;i<marudy.length;i++)
      {
        for(j=0;j<teams.length;j++)
        {
          if (teams[j].includes(marudy[i][0]) & teams[j].includes(marudy[i][1]))
          {
            var index_marudy = teams[j].indexOf(marudy[i][0]);
            var maruda = teams[j][index_marudy];
            var team_index = 0;
            var user_replace;
            var index = Math.floor(Math.random() * teams[j].length) ;

            if (j == 0)
            {
              team_index = 1;
            }
            else if (j == 1)
            {
              team_index = -1;
            }

            user_replace = teams[j+team_index][index];
            teams[j].splice(index_marudy,1);
            teams[j+team_index].splice(index,1);
            teams[j+team_index].push(maruda);
            teams[j].push(user_replace);
          }
        }
      }


    console.log("Team1")
    console.log(team1)

    console.log("Team2")
    console.log(team2)

		var embed = new Discord.RichEmbed()
		.setColor(12331111)
		.setTitle(' ');
		embed.addField('Team 1:',team1,1);
		embed.addField('Team 2:',team2,1);
		message.channel.send({embed});


    return;
  }

  if(command == 'clean')
  {
  // removes a number of messages from channel
    if(message.author.id == 243112687624519680 )
    {
      message.channel.bulkDelete(args[1]);
    }
    return;
  }

  if(command =='stats')
  {
  // Statistics command:
  // stats - messages sent today
  // stats month - messages sent this month
  // stats month [month_number] - messages sent during specified month
      Stats.statsListener(message, command, args2, sql)
  }

}

function addQuote(message,sql)
{

  const args = message.content.trim().split(/ +/g);

  if(message.author.id != 273849058265661440 )  //"273849058265661440" id menela
     return;
  else
  {
    var flag = false
    args.forEach(function(row){
      //zabezpieczenie przed oznaczeniami - zapisuje w formacie <@2312381279318273>
      if(row.length > 19)
        flag= true

    });
    if (flag == true)
      return;

    var actualstart = moment().startOf('day').fromNow().split(/ +/g);
    var saturday = moment().format('dddd') == 'Saturday' ? false : true;
    var sunday = moment().format('dddd') == 'Sunday' ? false : true;
    if (actualstart[0] >= 6 && actualstart[0] < 16 && message.content.length > 13 && saturday && sunday)
    {

      if (args[0] != 'pls')
      {
        insertQuote(sql,message.content)
      }
    }
  }

}

function printQuotes(sql)
{

  let rows = sql.run(`SELECT id, cytat, czas FROM menel`);
  console.log(rows.length)
  rows.forEach(function(row){
    console.log(row['id'],row['cytat'])
  });
}

function conatomenel(message,sql)
{
  let rows = sql.run(`SELECT id, cytat, czas FROM menel`);
  rng_num=Math.floor((Math.random() * rows.length) + 1);
  rng_num=rng_num-1;


  var embed = new Discord.RichEmbed()
    .setColor(12331223)
    .setTitle('#' + rows[rng_num]['id']);
    embed.addField(rows[rng_num]['cytat'],rows[rng_num]['czas']);
    message.channel.send({embed});
    message.delete();
}

function conatohustler(message,sql)
{
var embed = new Discord.RichEmbed()
  .setColor(12331223)
  .setTitle('#1');
  embed.addField('XDDDDDDDDDDDDDDDD','~ hustler');
  message.channel.send({embed});
  message.delete();
}

function removeQuote(message,sql,args2)
{
  if(message.author.id == 243112687624519680 )
  {
    args2.forEach(function(row){
      sql.run(`DELETE FROM menel WHERE id ="${row}"`);
      console.log('usuwanie id ' + row)
    });
  }
}

function createTable(message,sql)
{
  if(message.author.id == 243112687624519680 )
  {
    sql.run(`CREATE TABLE IF NOT EXISTS stats (author TEXT, month_num INTEGER, day_num INTEGER, day_week INTEGER, rok INTEGER, godzina INTEGER)`);
    sql.run(`CREATE TABLE IF NOT EXISTS bans (id INTEGER PRIMARY KEY,champion TEXT)`);
    sql.run(`CREATE TABLE IF NOT EXISTS menel (id INTEGER PRIMARY KEY,cytat TEXT, czas TEXT)`);
    sql.run(`CREATE TABLE IF NOT EXISTS colorcd (userID TEXT, timestamp TEXT)`);
    sql.run(`CREATE TABLE IF NOT EXISTS boss (name NAME, hp INTEGER, armor INTEGER)`);
    sql.run(`CREATE TABLE IF NOT EXISTS enemies (id INTEGER PRIMARY KEY, pid TEXT, name NAME, max_hp INTEGER, current_hp INTEGER, gold INTEGER, exp INTEGER, attack INTEGER)`);
    sql.run(`CREATE TABLE IF NOT EXISTS players (player_id TEXT,
                                                level INTEGER,
                                                exp INTEGER,
                                                mlvl INTEGER,
                                                mlvl_exp INTEGER,
                                                attack_lvl INTEGER,
                                                attack_exp INTEGER,
                                                fishing_lvl INTEGER,
                                                fishing_exp INTEGER,
                                                max_hp INTEGER,
                                                current_hp INTEGER,
                                                max_mana INTEGER,
                                                current_mana INTEGER,
                                                mana_reserved INTEGER,
                                                current_zone TEXT,
                                                current_enemy TEXT,
                                                deaths INTEGER,
                                                kills INTEGER,
                                                gold INTEGER
                                                )`);
  }
}

function insertQuote(sql,cytat) {
    czas = moment().format('MMMM Do YYYY, h:mm:ss a');
    sql.run(`INSERT INTO menel (cytat , czas) VALUES (?,?)`, [cytat, czas]);
    //console.log('dodano cytat: ' + cytat)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {listenCommands,addQuote};
