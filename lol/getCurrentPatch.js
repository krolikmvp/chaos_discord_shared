const request = require('snekfetch');
const current_patch = require("./current_patch.json");
const getCurrentChampionList = require("./getCurrentChampionList.js");
const superagent = require("superagent");
const fs = require('fs');
const path = require('path');

module.exports.run = async () =>
{

    let {body} = await superagent.get('https://ddragon.leagueoflegends.com/api/versions.json');
    let latest_patch = body[0]
    if (latest_patch != current_patch.patch)
    {
        console.log("Current patch is outdated. Updating the patch")
        current_patch.patch = latest_patch
    
        fs.writeFile("./lol/current_patch.json", JSON.stringify(current_patch), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(current_patch));
        console.log('writing to ' + "./lol/current_patch.json");
        });

        console.log("Getting current champions list")
        getCurrentChampionList.run()
    }
    else
    {
        console.log("Current patch is up to date")
    }

  
  return body

}
