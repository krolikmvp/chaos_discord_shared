const request = require('snekfetch');
const superagent = require("superagent");
const config = require("../config.json");

module.exports.run = async () =>
{

  let {body} = await superagent.get('https://eun1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key='+config.riot_key);

  return body

}
