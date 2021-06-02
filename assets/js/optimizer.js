// function to print results row on row
function writeList(list){
//  if (typeof list == 'array' && list.length>=1 ){
    console.log("points:"+list[0].totalCost + " models:"+list[0].totalModels+" wounds:"+list[0].wounds, " score:"+list[0].score);
    for(let i = 1; i < list.length; i++){
      let u = list[i];
      console.log(""+(u.models>1?u.models+"x ":"   ") + u.name+ " cost:"+u.cost+" group cost:"+u.groupCost );
    }
  console.log("\n");
}


// function to print results row on row
function writeLists(list){
  console.log("+-+-+- Printing " + list.length + " lists -+-+-+")

    list.forEach( (n) => {
      //console.log(n);
      writeList(n);
    });

}


// write single unit in console window with some style
function writeUnit(u){
  console.log(u.name +"  "+ (u.leader?"[Leader]":"") + "  points : " + u.cost+ "("+u.score+") [ " + u.alliance + " | " + u.faction + " | " + (u.runemarks?u.runemarks.toString():"") + " ]");
  let w = u.weapons[0]
  console.log("(R " + w.range+" | A " + w.attacks + " | S " + w.strength + " | " + w.damage + "/" + w.critical + ") [ M "+u.movement+" | T "+u.toughness + " | W "+ u.wounds + " ]")
  if (u.weapons[1]){
    w = u.weapons[1];
    console.log("(R " + w.range+" | A " + w.attacks + " | S " + w.strength + " | " + w.damage + "/" + w.critical + ")");
  }
  console.log("\n");
}


// when passed array of units, print cleanly to console
function writeUnits(u){
  console.log("+-+-+- Print All Units -+-+-+")

    u.forEach( (n) => {
      //console.log(n);
      writeUnit(n);
    });

}




/////////////////////   algorithm  to calculate GW points based on stats   ////////////////////////////
/*
-146.87+7.15*M + 20.59*T + 3.12*W + 2.82*RNG1 + 7.63*ATK1 + 12.71*STR1 + 8.92*DMG1 + 3.11*CRIT1
+ 36.43*ATK2? + 8.13*ATK2 + 0.89*STR2 + 11.88*DMG2 + 5.50*CRIT2 * 20.89*LEADER +4.53*OTHER_TAGS

Where:
    M: Movement
    T: Toughness
    W: Wounds
    RNG1: Range of attack 1
    ATK1: Number of attacks for attack 1
  STR1: Strength of attack 1
    DMG1: Standard damage of attack 1
    CRIT1: Critical damage of attack 1
    ATK2?: This is 1 if there is a second attack in the fighter's profile. Otherwise it's 0
    STR2: Strength of attack 2
    DMG2: Standard damage of attack 1
    CRIT2: Critical damage of attack 2
    LEADER: This is 1 if the unit is a leader, 0 otherwise
    OTHER_TAGS: Any tag or ability besides leader that the unit might have
    */
//




function getScore(u){
  // basics
  let score = -146.87 + 7.15*u.movement + 20.59*u.toughness + 3.12*u.wounds;
  let weapons = u.weapons.filter((w) => w.active);

  if (weapons.length>0){
    // weapon 1 range
    score += 2.82*(Array.isArray(weapons[0].range)?weapons[0].range[1]:weapons[0].range);
    //weapon 1 stats
    score += 7.63 * weapons[0].attacks + 12.71*weapons[0].strength + 8.92*weapons[0].damage + 3.11*weapons[0].critical;
  }

  // second weapon
  if (weapons.length>=2){
    score -= 36.43;
    //score += 8.13*(Array.isArray(u.weapons[1].range)?u.weapons[1].range[1]:u.weapons[1].range);
    score += 8.13*weapons[1].attacks + 0.89*weapons[1].strength + 11.88*weapons[1].damage + 5.50*weapons[1].critical;
  }

  if (u.leader==true)
      score += 20.89 + (u.runemarks && u.runemarks.length>1?4.53:0);
  else
      score += (u.runemarks && u.runemarks.length>0?4.53:0);

  return score;
}

function getScoreVerbose(u){
  // basics
  let score = -146.87 + 7.15*u.movement + 20.59*u.toughness + 3.12*u.wounds;
  console.log("stats",score)
  // weapon 1 range
  score += 2.82*(Array.isArray(u.weapons[0].range)?u.weapons[0].range[1]:u.weapons[0].range);
  console.log("weapon 1 range",score)

  //weapon 1 stats
  score += 7.63 * u.weapons[0].attacks + 12.71*u.weapons[0].strength + 8.92*u.weapons[0].damage + 3.11*u.weapons[0].critical;
  console.log("weapon 1 stats",score)

  // second weapon
  if (u.weapons.length>=2){
    score -= 36.43;
    //score += 8.13*(Array.isArray(u.weapons[1].range)?u.weapons[1].range[1]:u.weapons[1].range);
    score += 8.13*u.weapons[1].attacks + 0.89*u.weapons[1].strength + 11.88*u.weapons[1].damage + 5.50*u.weapons[1].critical;
    console.log("second weapon",score)

  }
  if (u.leader==true)
      score += 20.89 + (u.runemarks && u.runemarks.length>1?4.53:0);
  else
      score += (u.runemarks && u.runemarks.length>0?4.53:0);

  console.log("runemarks", score)

  return score;
}




const units = [
  //{name:"Assassin", leader:true, cost:175, movement:6, toughness:3, wounds:22},
  unit("Assassin", true, 175, 6, 3, 22, [[1,5,4,2,4]], "order","cos",["leader"],"assassin.png",{x:200,y:200,scale:1}),
  unit("sorceress",true, 175,5, 3, 20, [[[3,7],2,4,3,5],[1,3,3,1,3]], "order","cos",["leader","mage"],"assassin.png",{x:200,y:200,scale:1}),
  unit("Shadow Warrior",false, 90, 5, 3, 8, [[[3,16],2,3,1,3],[1,3,3,1,3]], "order","cos",["archer"],"assassin.png",{x:200,y:200,scale:1}),
  unit("Watch Sister", false, 105, 5, 3, 8, [[[3,16],2,4,1,3],[1,3,3,1,3]], "order","cos",["archer"],"assassin.png",{x:200,y:200,scale:1}),
  unit("Corsair w/ VB&WC", false, 65, 5, 3, 8, [[1,4,3,1,3]], "order","cos",undefined,"assassin.png",{x:200,y:200,scale:1}),
  unit("Wildwood Ranger", false, 85, 5, 3, 8, [[1,3,4,2,4]], "order","cos",["strength"],"assassin.png",{x:200,y:200,scale:1}),
  unit("Eternal Guard",false,90, 5, 4, 8, [[2,3,3,1,4]], "order","cos",["shield"],"assassin.png",{x:200,y:200,scale:1}),
]

const unitsLength = units.length;
const maxLeaders = 2;



const listsGetHighest = (lists, stat) => {
  return lists.reduce( (l, u) =>
  {
    if (u[0][stat] > l[0][stat]) return u;
    else return l;
  }
)
}

// for a final list, get sum of a unit stat over all units in list
const listGetSum = (list,stat) => {

  const a = list.reduce( (a,u,i) =>{
     // stat is list level
      if( u.hasOwnProperty(stat))
          return (i==1?0:a) + u[stat];

      // otherwise cross-reference unit
      return (i==1?0:a) + (units[u.index][stat] * u.models);
  })

  return a;
}

var finalList = [];
const attrib = ["wounds"];










// entry for  listbuilder, sorts out appropriate army/allies and performs
// some filtering of data, around main fuction makeLists

function listOptimizer(units, cost, leeway = 5, filters = {}){
//  console.log("//////////////  run optimizer " + cost + "   //////////////////////////")
//  console.log("Units:");
//  writeUnits(units);

// isolate appropriate forces

  var final = [];

  const cheapestCost = units.reduce( (l, u) => {
    if (u.cost < l.cost) return u;
    else return l;
  }).cost;

  makeLists([], cost, 0);

  console.log("+++++++++++++++++ made "+final.length+ " lists ++++++++++++++++++++++++++++")

  return final;

////////////////////////////////////////////
//  return finalList;
//}
// create sets of lists

function makeLists(list, cost, i){


    // all lists have primary object with overall details

    if (list.length == 0)
    list.push({totalCost:0, leaders:0})



    // final call on a list with no space

    if (cost < cheapestCost){
      if (list[0].leaders == 0) return;
      if (list[0].totalCost < cost-leeway) return;

      // create some details in list[0]
      list[0].totalModels = listGetSum(list,"models")
      list[0].wounds = listGetSum(list,"wounds")
      list[0].score = listGetSum(list,"score")
      list[0].avgWounds = list[0].wounds / list[0].number;

      final.push(list);
      return;
    }


    // looking for a unit that doesn't exist

    if (i >= units.length) { // we know a cheaper unit could've fit so subobptimal, end branch
      return;
    }


    // add a branch for all numbers of next model will fit inside the list

    for(let j = 0; j * units[i].cost <= cost; j++){
        // check if filled with too many leaders, quit this unit
        if (units[i].leader==true && list[0].leaders + j > maxLeaders)  break;

        // clone list
        let newlist = JSON.parse(JSON.stringify(list));

        // not the first pass (where we skip to next) and we are adding multiple of current unit at i
        if (j>0) {
          newlist.push({name:units[i].name, index:i, models:j, cost:units[i].cost, groupCost:units[i].cost*j})
          newlist[0].totalCost += units[i].cost*j;

          if (units[i].leader)
            newlist[0].leaders += j;
        }

        // j=0 so we add create branch without any units at i
        makeLists(newlist, cost-(units[i].cost*j), i+1)
    }

    return {done:true}
  }
}


// filter our lists by two variables (match by first then by secound)

Array.prototype.sortBy = function (var1=null,var2=null){
    if (!var1) return this;

    if (var2) return this.sort((a,b) => {
              //console.log("score a"+a[0].score + "score b"+b[0].score)
              if  ((a[0][var1] > b[0][var1]) ||
                (a[0][var1] == b[0][var1] && a[0][var2] > b[0][var2]))

                return 1;
                // otherwise
                return -1;
    })
    // without the second clause var2
    return this.sort((a,b) => (a[0][var1] > b[0][var1]?1:-1))

}





// setup variables and run our optimizer
//writeUnits(units);

// lets make lists and filter it by stats

finalList = listOptimizer(units,1000);


//finalList = finalList.filter(f => f[0].leaders == 2)
//console.log("final list 0",finalList[0])
//console.log("wounds in 0", listGetSum(finalList[0],"wounds") )
//console.log("points in 0", listGetSum(finalList[0],"cost") )
//console.log("models in 0", listGetSum(finalList[0],"models") )

let highestwounds = finalList[0];
let highestscore = finalList[0];
let highestmodels = finalList[0];

finalList.forEach((l) =>{
  if ((highestwounds[0].wounds < l[0].wounds) ||
    (highestwounds[0].wounds == l[0].wounds && highestwounds[0].score > l[0].score)) highestwounds = l;
  if (highestscore[0].score < l[0].score) highestscore = l;
  if (highestmodels[0].totalModels < l[0].totalModels) highestmodels = l;
})
console.log("list with highest wounds\n--------------------------")
writeList(highestwounds)
console.log("list with highest score\n--------------------------")
writeList(highestscore)
console.log("list with highest models\n--------------------------")
writeList(highestmodels)




var nextTest = finalList.filter( f=> f[0].totalModels>9).sortBy("wounds","models");
console.log("\n---------sort by wounds then models---------------------------")
writeList(nextTest[0])
writeList(nextTest[nextTest.length-1])

nextTest = finalList.filter( f=> f[0].totalModels>9).sortBy("score");
console.log("\n---------sort by score-------------------------")
writeList(nextTest[0])
writeList(nextTest[nextTest.length-1])

/*
writeLists(finalList.filter( f => f[0].totalModels>9)
              .sort((a,b) => {
                //console.log("score a"+a[0].score + "score b"+b[0].score)
                return (a[0].score > b[0].score?1:-1)
            }).reverse())//
*/

console.log("write first list and last list (score then wounds)")

writeList(finalList[0])
//writeLists(finalList.slice(0,20));//
writeList(finalList[finalList.length-1])

//console.log("top and bottom main",finalList[0], finalList[finalList.length-1])

//console.log("top and bottom new",finalListTest[0], finalListTest[finalListTest.length-1])
