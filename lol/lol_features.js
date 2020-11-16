const getRotationRequest = require("./getRotationRequest.js");
const getCurrentPatch = require("./getCurrentPatch.js");
const Champions = require("./champions.json");
const mergeImages = require('merge-images');
// const Canvas = require('canvas');
const fs = require("fs");
// const items = require('./items.json')
// const itemsjs = require('./items.js')
const Jimp = require("jimp");

BUILD_PATH = './lol/tmp/build.png'
TMP_PATH = './lol/tmp/'

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
  }
}

module.exports.rollChamps = async function(args2){
  // Rolls specified number of LOL champions for each team
  // example: champions 12 2 (rolls 12 champions for each team, 2 champions from free rotation)

  //gets current LOL patch and updates champions list if current patch is not the latest
  getCurrentPatch.run()

  let rotation = await getRotationRequest.run().then(r => {

    return r.freeChampionIds;
  });
  console.debug("rotation request passed")
  var num_of_champs = 10
  var rotation_champs = 0
  var rotation_size = rotation.length
  
  if (args2[0] !== undefined &&  args2[0] >1 && args2[0]<142){
      num_of_champs = args2[0]
  }

  if (args2[1] !== undefined &&  args2[1] >=1 && args2[1]<rotation_size){
      rotation_champs = args2[1]
      num_of_champs=num_of_champs-rotation_champs
  }
    var champ_list = []
    var teams  = 2
    var teamz = []
    var list_ = Champions
    var rotation_list_ = []
    for ( c in list_['data']){
      if (rotation.includes(parseInt(list_['data'][c].key)))
        rotation_list_.push(list_['data'][c].name)
      champ_list.push(list_['data'][c].name)
    }
    var champions_max = champ_list.length
    //rolling rotation champions
    if (rotation_champs > 0){
      console.debug("Rolling rotation champions")
      for (i=0;i<teams;i+=1)
      {
        var team_champs = []
        for (j=0;j<rotation_champs;j+=1)
        {
            var flag = false
            while(!flag)
            {
              var pos = Math.floor(Math.random() * rotation_size)
              if (!team_champs.includes('\`'+rotation_list_[pos]+'\`')) {
                  team_champs.push('\`'+rotation_list_[pos]+'\`')
				  console.log("Pushing champ:")
				  console.log(pos)
				  console.log('\`'+rotation_list_[pos]+'\`')
				  
                  flag = true;
              }
            }
        }

        if(teamz[i]!== undefined){
          teamz[i].concat(team_champs)
        } else {
          teamz[i] = team_champs
        }
      }
    }
    console.debug("team 1 rotation champions: " + teamz[0])
    console.debug("team 1 rotation champions: " + teamz[1])
    //rolling not rotation champions
    for (i=0;i<teams;i+=1)
    {
      var team_champs = []
      for (j=0;j<num_of_champs;j+=1)
      {
          var flag = false
          while(!flag)
          {
            var pos = Math.floor(Math.random() * champions_max)
            if (!(team_champs.indexOf(champ_list[pos]) > -1))
            {
                if(teamz[i]!== undefined)
                {
                    if(!(teamz[i].indexOf(champ_list[pos]) > -1))
                    {
                      team_champs.push(champ_list[pos])
                      flag = true;
                    }

                } else {

                team_champs.push(champ_list[pos])
                flag = true;
              }
            }
          }
      }
      if(teamz[i]!== undefined){
        teamz[i]= teamz[i].concat(team_champs)
      } else {
        teamz[i] = team_champs
      }
    }
    await console.log(teamz[0])
    await console.log(teamz[1])
    return await teamz

}

// module.exports.combineRotation = async function (message){

//   let rotation = await getRotationRequest.run().then(r => {

//       return r.freeChampionIds;

//   });

//   var pngs = []
//   var list_ = Champions
//   for (c in list_['data'])
//   {
//     if (rotation.indexOf(list_['data'][c].id) > -1)
//       pngs.push(decorateChampion(list_['data'][c].key));

//   }

//   await mergeImages([
//       { src: pngs[0], x: 0, y: 0 },
//       { src: pngs[1], x: 120, y: 0 },
//       { src: pngs[2], x: 0, y: 120 },
//       { src: pngs[3], x: 120, y: 120 },
//       { src: pngs[4], x: 0, y: 240 },
//       { src: pngs[5], x: 120, y: 240 },
//       { src: pngs[6], x: 0, y: 360 },
//       { src: pngs[7], x: 120, y: 360 },
//       { src: pngs[8], x: 0, y: 480 },
//       { src: pngs[9], x: 120, y: 480 },
//       { src: pngs[10], x: 0, y: 600 },
//       { src: pngs[11], x: 120, y: 600 },
//       { src: pngs[12], x: 0, y: 720 },
//       { src: pngs[13], x: 120, y: 720},

//     ], {
//       Canvas : Canvas,
//       width: 240,
//       height: 840
//     }).then(b64 =>{

//       var data = b64.replace(/^data:image\/\w+;base64,/, "");
//       var buf = new Buffer(data, 'base64');
//       var ret =  fs.writeFile('tmp.png', buf, function(err) { console.log(err)});
//       setTimeout(function() {
//         message.channel.send( {
//           files: [
//             "./tmp.png"
//           ]
//         })
//       },1000)

//     }).catch(function(error) {
//     console.log(error);
//   });


// }
// function decorateChampion(item_){
//   var base = './lol/champion/'
//   var png = '.png'
//   return base + item_ + png
// }
// function rollBoots(){
//   var pos = Math.floor(Math.random() * itemsjs.boots.length)

//   return itemsjs.boots[pos]

// }
// function rollitem(items_){
//   var pos = Math.floor(Math.random() * items_.length)
//   return items_[pos]

// }
// function decorateItem(item_){
//   var base = './lol/item/'
//   var png = '.png'
//   return base + item_ + png
// }
// function getItems(){
//   function combineItems(){

//     var pngs = []
//     var items = getItems()
//     var boots = rollBoots()
//     pngs.push(decorateItem(boots))
//     for( var i = 0 ; i < 7 ; i+=1)
//     {
//       while(true)
//       {
//         var item = rollitem(items)
//         var decorated = decorateItem(item)
//         if(!(pngs.indexOf(decorated) > -1))
//         {
//           pngs.push( decorated)
//           break;
//         }
//       }
//     }

//     return pngs
//   }
//   var items_rolled = []
//     for (item in items.data)
//     {
//         if (!items.data[item].into && !items.data[item].requiredChampion && !items.data[item].consumed && items.data[item].tags)
//         {
//             if (items.data[item].tags.indexOf('Trinket') == -1 &&
//               items.data[item].tags.indexOf('Boots') == -1 &&
//               items.data[item].maps['12'] == true &&
//               items.data[item].name.indexOf('Quick') == -1 &&
//               items.data[item].name.indexOf(`Doran's`) == -1 &&
//               items.data[item].name.indexOf(`TESTING`) == -1 &&
//               items.data[item].tags.indexOf('Consumable') == -1){
//                 if(itemsjs.excluded.indexOf(items.data[item].name) == -1)
//                   items_rolled.push(items.data[item].id)
//                 }
//         }
//     }
//   return items_rolled
// }

// function toMergeBuilds(builds,paths){
//   var to_merge_builds = []
//   var starting_h = 0
//   var img_height = 64

//   for ( let build in builds)
//   {
//     var build_struct = { src: paths[build], x:starting_h , y :build*img_height }
//     to_merge_builds.push(build_struct)
//   }

//   return to_merge_builds;
// }
// function mergeBuilds(pngs){

//   console.log(pngs)
//   return mergeImages( pngs, {
//       Canvas : Canvas,
//       width: 448,
//       height: pngs.length*64
//       }).then(b64 =>{

//         var  data =b64.replace(/^data:image\/\w+;base64,/, "");
//         var buf = new Buffer(data, 'base64');

//         var ret = fs.writeFile(BUILD_PATH, buf, function(err) { console.log(err)});

//         return BUILD_PATH;


//     }).catch(function(error) {
//       console.log(error);
//     });

// }
// function mergeItems(pngs,path){

//   return mergeImages([
//       { src: pngs[0], x: 0, y: 0 },
//       { src: pngs[1], x: 64, y: 0 },
//       { src: pngs[2], x: 128, y: 0 },
//       { src: pngs[3], x: 192, y: 0 },
//       { src: pngs[4], x: 256, y: 0 },
//       { src: pngs[5], x: 320, y: 0 },
//       { src: pngs[6], x: 384, y: 0 }
//     ], {
//       Canvas : Canvas,
//       width: 448
//       }).then(b64 =>{
//         var  data =b64.replace(/^data:image\/\w+;base64,/, "");
//         var buf = new Buffer(data, 'base64');
//         //console.log("bamboozled again")
//         //setTimeout(function() {
//           var ret = fs.writeFile(path, buf, function(err) { console.log(err)});
//         //},1000)


//         return path;

//     }).catch(function(error) {
//       console.log(error);
//     });

// }
// function createPaths(builds){

//   var paths = []
//   for ( let i = 0 ; i < builds ; i+=1)
//   {
//     paths.push('./lol/tmp/build'+ i + '.png')

//   }
//   return paths
// }
// function  mergeBuildsIfExists(path, timeout,to_merge_builds,png_paths) {
//     var timeout = setInterval(function() {

//         const file = path;
//         const fileExists = fs.existsSync(file);

//         if (fileExists) {
//             mergeBuilds(to_merge_builds,png_paths)

//             clearInterval(timeout);
//             return 0;
//         }
//     }, timeout);

//     return BUILD_PATH;
// };
// function  mergeBuildsIfSigned(timeout,png_paths,users) {
//     var ret = signBuilds(png_paths,users)
//     var timeout = setInterval(function() {
//         if (!ret.isPending) {
//             clearInterval(timeout);
//             return 0;
//         }
//     }, timeout);

//     return 1;
// };
// async function signBuilds(pngs,users){
//   ret = null
//   for (let i = -1 ; i < pngs.length; i+=1)
//   {
//     var fileName = await pngs[i]
//     var imageCaption = 'empty'
//     if(users.length>0){
//       imageCaption = users[i]
//     }
//     else {
//       imageCaption = 'Player ' + i
//     }
//     var loadedImage;
//     var x = await Jimp.read(pngs[i])
//         .then(function (image) {
//             loadedImage = image;
//             return Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
//         })
//         .then(function (font) {
//             loadedImage.print(font, 1, 30, imageCaption)
//                        .write(fileName);
//         })
//         .catch(function (err) {
//             console.error(err);
//         });
//     }
//     return await 1;
// }
// function combineItems(){

//   var pngs = []
//   var items = getItems()
//   var boots = rollBoots()
//   pngs.push(decorateItem(boots))
//   for( var i = 0 ; i < 6 ; i+=1)
//   {
//     while(true)
//     {
//       var item = rollitem(items)
//       var decorated = decorateItem(item)
//       if(!(pngs.indexOf(decorated) > -1))
//       {
//         pngs.push( decorated)
//         break;
//       }
//     }
//   }

//   return pngs
// }
// module.exports.createMergedBuilds = function(message,args2,users)
// {
//   //cleanup before start
//   deleteFolderRecursive(TMP_PATH)
//   console.log(users)

//   if (args2[0] !== undefined &&  args2[0] >1 && args2[0]<11){
//     builds = args2[0]
//   } else {

//     builds = users.length
//   }

//   var build_pngs = []
//   var png_paths  = createPaths(builds)
//   for (let i = 0 ; i < builds ; i+=1)
//   {
//     var pngs = combineItems()
//     var build = mergeItems(pngs,png_paths[i]).then(x=>{
//         return x;
//     }).catch(function(error) {
//       console.log(error);
//     });
//     build_pngs.push(build)
//   }


//   var to_merge_builds = toMergeBuilds(build_pngs,png_paths)

//   var ret = mergeBuildsIfSigned(100,png_paths,users)
//   var ret2 = mergeBuildsIfExists(png_paths[png_paths.length-1],1000,to_merge_builds,png_paths)

//   return ret2;
// }
