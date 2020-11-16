const Discord = require("discord.js");
var moment = require('moment');
const execSync = require('child_process').execSync;

dni = {

    1 : 'Ponidziałek',
    2 : 'Wtorek',
    3 : 'Środa',
    4 : 'Czwartek',
    5 : 'Piątek',
    6 : 'Sobota',
    7 : 'Niedziela'

}

miesiace = {

    1 : 'Styczeń',
    2 : 'Luty',
    3 : 'Marzec',
    4 : 'Kwiecień',
    5 : 'Maj',
    6 : 'Czerwiec',
    7 : 'Lipiec',
    8 : 'Sierpień',
    9 : 'Wrzesień',
    10: 'Październik',
    11: 'Listopad',
    12: 'Grudzień'

}

function dailyStats(message,sql)
{

    month_num = moment().format('M');
    day_num = moment().format('D');
    rok = moment().format('YYYY');

    let rows = sql.run(`SELECT * FROM stats WHERE month_num ="${month_num}" AND day_num="${day_num}" AND rok="${rok}"`);
    messages_today = rows.length
    //console.log(rows.length)
    hours = {}

    rows.forEach(function(row){
        hours[row["godzina"]] = (hours[row["godzina"]] || 0) + 1;
    });
    keys = Object.keys(hours)

    first_key = Number(keys[0])
    last_key = Number(keys[keys.length-1])

    graph_size = last_key - first_key
    graph_dict = {}
	//console.log(hours)
	//console.log("First key = " + first_key)
	//console.log("Last key = " + last_key)
    for (i = first_key; i <= last_key; i++)
    {
		//console.log("hours i : " + hours[i])
        if (hours[i] )
            graph_dict[i] = hours[i]
        else
            graph_dict[i] = 0

    }

    //tile = Math.ceil(100/(messages_today))
    //console.log(hours)
    graph_hours = ""
    graph_messages = ""
    graph_keys = Object.keys(graph_dict)
    key_iter = 0

    for (i = first_key; i <= last_key; i++)
    {
        graph_hours += graph_keys[key_iter]+',';
        repeat_times = 0
        graph_messages += graph_dict[i]+',';
        key_iter +=1
    }

    graph_hours=graph_hours.slice(0,-1)
    graph_messages=graph_messages.slice(0,-1)
    // console.log(graph_dict)
    //console.log(graph_hours)
    //console.log(graph_messages)
    message.channel.send('Wiadomości dzisiaj: '+ messages_today)

    //import { execSync } from 'child_process';  // replace ^ if using ES modules
    try{
        const output = execSync(`python ./plot.py ${graph_hours} ${graph_messages} dzien`, { encoding: 'utf-8' });  // the default is 'buffer'
        message.channel.send( {
          files: [
            "./demo.png"
          ]
        })
    }
    catch(error)
    {
        message.channel.send('Błąd podczas tworzenia wykresu')
    }
}

function monthlyStats(message,sql, month)
{
    if (month)
        month_num = month
    else
        month_num = moment().format('M');
    
    day_num = moment().format('D');
    rok = moment().format('YYYY');

    let rows = sql.run(`SELECT * FROM stats WHERE month_num ="${month_num}" AND rok="${rok}"`);
    messages_this_month = rows.length
    days_in_month = moment(rok + '-'+ month_num, "YYYY-MM").daysInMonth()
    days={}

    rows.forEach(function(row){
        days[row["day_num"]] = (days[row["day_num"]] || 0)+1;
    });


    days_filled = {}
    for (i=1; i <= days_in_month;i+=1)
    {
        days_filled[i] = 0
        if (days[i])
        days_filled[i] = days[i]
    }
    keys = Object.keys(days_filled)

    first_key = Number(keys[0])
    last_key = Number(keys[keys.length-1])

    graph_size = last_key - first_key
    graph_dict = {}
	//console.log(days)
	//console.log("First key = " + first_key)
	//console.log("Last key = " + last_key)
    for (i = first_key; i <= last_key; i++)
    {
		//console.log("hours i : " + hours[i])
        if (days[i] )
            graph_dict[i] = days_filled[i]
        else
            graph_dict[i] = 0

    }

    graph_days = ""
    graph_messages = ""
    graph_keys = Object.keys(graph_dict)
    key_iter = 0

    for (i = first_key; i <= last_key; i++)
    {
        graph_days += graph_keys[key_iter]+',';
        repeat_times = 0
        graph_messages += graph_dict[i]+',';
        key_iter +=1
    }

    graph_days=graph_days.slice(0,-1)
    graph_messages=graph_messages.slice(0,-1)
    // console.log(graph_dict)
    //console.log(graph_hours)
    //console.log(graph_messages)
    message.channel.send('Wiadomości w miesiącu '+ miesiace[month_num] + ': ' + messages_this_month)

    //import { execSync } from 'child_process';  // replace ^ if using ES modules
    try{
        const output = execSync(`python ./plot.py ${graph_days} ${graph_messages} month`, { encoding: 'utf-8' });  // the default is 'buffer'
        message.channel.send( {
          files: [
            "./demo.png"
          ]
        })
    }
    catch(error)
    {
        message.channel.send('Błąd podczas tworzenia wykresu')
    }
}

function statsListener(message, command, args, sql) {

    if (args.length == 0)
        dailyStats(message,sql)
    else {
        if (args[0] == 'week' || args[0] == 'weekly' || args[0] == 'tydzien' || args[0] == 'w')
            message.channel.send(`Coming soon!`)
        else if (args[0] == 'month' || args[0] == 'mies' || args[0] == 'miesiac' || args[0] == 'm'){
            if (args[1] < 1 || args[1] > 12)
                message.channel.send('No i co świrujesz pawiana')
            else
                monthlyStats(message,sql, args[1])
        }
        else if (args[0] == 'year' || args[0] == 'rok' || args[0] == 'y' || args[0] == 'r'){
            message.channel.send(`Coming soon!`)
        }  else {
            message.channel.send(`No i co świrujesz pawiana`)
        }
    }

}

function addMessage(message,sql) {

    month_num = moment().format('M');
    day_num = moment().format('D');
    day_week = moment().format('d');
    rok = moment().format('YYYY');
    godzina = moment().format('H');

    sql.run(`INSERT INTO stats (author , month_num , day_num , day_week , rok , godzina) VALUES (?,?,?,?,?,?)`, [message.author.username , month_num, day_num, day_week, rok, godzina]);
    //console.log('dodano wiadomosc do statystyk')

}

module.exports = {addMessage,statsListener};
