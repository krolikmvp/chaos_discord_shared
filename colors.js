const Discord = require("discord.js");
var COOLDOWN_TIME; //Cooldown time in seconds
var ONE_HOUR = 3600000 //miliseconds
// Module responsible for random role change
// Roles needs to be specified below as RoleID

var discord_role = {
  '402774536786935818' : 'Trupojady',
  '402774586409877504' : 'Drakonidy',
  '402774615371284491' : 'Upiory',
	'403167627477909516' : 'Relikty'
}


var tiara_quotes =
{
  '402774536786935818' : 'Zstępujemy z niebios by zabrać Cię tam skąd pochodzisz Archaniele',
  '402774586409877504' : 'Człowiek o tak mrocznym sercu nie może być nikim innym jak Arcydiabłem',
  '402774615371284491' : 'Z respektem i podziwem ludzie będą Cie postrzegać, boś prawdziwy Tytan z krwi i kości',
  '403167627477909516' : 'Panem świata flory i fauny się stałeś, płynie w tobie prawdziwie dzika krew Hydro'

  // "Gdy ujrzała jego bliznę nie zawahała się o nią zapytać, lecz gdy tylko otworzyła usta usłyszała -  ",
  // "Spójrzmy na to... co za paskudztwo, ",
  // "Brzydki jak ",
  // "Przeglądając się w lustrze zobaczył czym tak naprawdę jest, ",
  // "Ujrzeli zarys postaci wyłaniający się z ciemnej knieji. Uciekając w popłochu zaczeli krzyczeć - ",
  // "Wskazał palcem na poszarpany rysopis i z lękiem w głosie powiedział - "
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

function Setup(cooldownHours) {
	COOLDOWN_TIME = cooldownHours;
}

function listener(message,sql)
{

	let rows = sql.run(`SELECT timestamp FROM colorcd WHERE userID ="${message.author.id}"`);
	if(!checkCooldown(message,rows,sql))
	{
		var prev_role = "brak"
		var keys = Object.keys(discord_role)

		message.member.roles.forEach(function(role){
			if (role.id in discord_role){
				message.member.removeRole(role.id)
				prev_role = role.id
				console.log(message.author.username + ' removieg role ' + role.name )
			}

		});

		sleepFor(2000);

		while (true)
		{
			rng_num=Math.floor((Math.random() * Object.keys(discord_role).length));
			if(keys[rng_num] != prev_role)
				break
		}

		message.member.addRole(keys[rng_num])
		console.log(message.author.username + ' adding role ' + discord_role[keys[rng_num]] )
    var quote = tiara_quotes[keys[rng_num]]

		message.channel.send(quote);
		updateTimeStamp(message,sql)
	}

}

function updateTimeStamp(msg,sql) {

	sql.run(`INSERT INTO colorcd (userID, timestamp) VALUES (?,?)`, [msg.author.id, msg.createdTimestamp]);

}


function checkCooldown(msg, timestamp,sql) {
	var timeStamp = msg.createdTimestamp;
	var usr = msg.author.id;

	if (timestamp.length < 1) {
		updateTimeStamp(msg,sql);
		return false;
	}

	var time_diff=(msg.createdTimestamp-timestamp[0].timestamp);
	console.log(time_diff )
	if (time_diff <= (COOLDOWN_TIME*ONE_HOUR)) {
		msg.channel.send("Pozostało " + (COOLDOWN_TIME-time_diff/ONE_HOUR).toFixed(1) + " h do możliwości zmiany przydzialu");
		return true;
	}

	if ( time_diff > (COOLDOWN_TIME*ONE_HOUR)) {
		sql.run(`DELETE FROM colorcd WHERE userID ="${msg.author.id}"`);
		return false;
	}

	return false;

}

module.exports = {checkCooldown,Setup,updateTimeStamp,listener};
