const request = require('snekfetch');
const current_patch = require("./current_patch.json");
const champions = require("./champions.json");
const superagent = require("superagent");
const fs = require('fs');
const path = require('path');

module.exports.run = async () =>
{

    let {body} = await superagent.get(`http://ddragon.leagueoflegends.com/cdn/${current_patch.patch}/data/en_US/champion.json`);


    fs.writeFile("./lol/champions.json", JSON.stringify(body), function writeJSON(err) {
        if (err) return console.log(err);
        console.log('writing to ' + "./lol/champions.json");
    });

  
  return body

}
