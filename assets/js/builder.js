// function to print one list
// to console
function writeList(list){
//  if (typeof list == 'array' && list.length>=1 ){
    console.log("points:"+list[0].totalCost + " models:"+list[0].totalModels+" wounds:"+list[0].totalWounds, " score:"+list[0].totalScore);
    for(let i = 1; i < list.length; i++){
      let u = list[i];
      console.log(""+(u.models>1?u.models+"x ":"   ") + u.unit.name+ " cost:"+u.unit.cost+" group cost:"+u.groupCost );
    }
  console.log("\n");
}


// function to print results row on row
// to console
function writeLists(list){
  console.log("+-+-+- Printing " + list.length + " lists -+-+-+")

    list.forEach( (n) => {
      //console.log(n);
      writeList(n);
    });

}

/*
*   Builder Alliance and faction tabs and tables
*
*   its harder to actually allow all units, with tabs acting as filters, and allowing mixed alliance
*   then if we followed the game and restricted
*   lets follow the game rules and restrict alliance to one option?
*/
const builderAllianceContainer = document.getElementById("builderAllianceContainer");
const builderFactionContainer = document.getElementById("builderFactionContainer");

var builderAlliance = [];  // all selected alliances
var builderFaction = [];  // all selected factions

var builderUnits = [];    // current working list of units, we pass to our makeTable();
var builderAllies = [];   // seperate list for all units with selected alliances


// create the alliance selection tabs
// adds eventlistener that selects and deselects each button
// which manipulates the status of our builder arrays above

function builderAddAllianceTabs(){

    // clear previous
    while(builderAllianceContainer.firstChild)
      builderAllianceContainer.removeChild(builderAllianceContainer.firstChild)

    // no units to make headings for
    if (units.length == 0){
      if (builderAlliance.length > 0) // used to have units, maybe user deleted all
        builderAllianceContainer.innerHTML = "<span>All fighters were removed, create some units!</span>"
      else // likely first click
        builderAllianceContainer.innerHTML = "<span>No fighters have been created, use 'Fighters' to create and save fighters!</span>"

      // reset all our data and quit out
      builderAlliance = [];  // all selected alliances
      builderFaction = [];  // all selected factions
      builderUnits = [];    // current working list of units, we pass to our makeTable();
      builderAllies = [];   // seperate list for all leader units with selected alliances
      while(builderFactionContainer.firstChild)
        builderFactionContainer.removeChild(builderFactionContainer.firstChild)

      return;
    }

    // if this is called, we assume a refresh of the whole system

    // get all alliance names from full units list
    let new_builderAlliance = [];
    let unitAlliances = [...new Set(units.map( u => u.alliance))];

    // each unique alliances gets a button
    unitAlliances.forEach((u) => {

          // generate the button
          let b = document.createElement('button');
          b.className = "btn btn-secondary";
          b.title = u;
          b.innerHTML = u;
          builderAllianceContainer.appendChild(b);

          // toggles button and toggle alliance's place in builderAlliance
          b.addEventListener("click",(e) => {
              builderclickAllianceTabs(b,e); })

          // bring back previous alliance selections if any
          // also filters out alliances that might no longer exist
          if (builderAlliance.length>0){
            if (builderAlliance.find( ba => ba == u)){
              new_builderAlliance.push(u);  // add to new selection list
              b.active = true;              // select this button
              b.className+=" active";
            }
          }
    });
    // complete filtering non-existant alliances
    builderAlliance = new_builderAlliance;
    if (builderAlliance.length>0)
      builderAddFactionTabs();
}

// add faction selection buttons, following the selection of alliances
// 1. we will redraw, so remove previous buttons
// 2. find from the avaliable units (by alliance selections) how many unique factions are avaliable
// 3. create a button for each, use last factionlist to re-click any user had prev selected.
// 4.
function builderAddFactionTabs(){

    // clear previous faction buttons
    while(builderFactionContainer.firstChild)
      builderFactionContainer.removeChild(builderFactionContainer.firstChild)
      // alliance we could use the basic list of units.alliances
      // now we cross sort all those units, then all factions just from them
      // broken down into a set of total avaliable
      let unitFactions = [... new Set( units.map( u => { return {alliance:u.alliance, faction:u.faction};})
                            .filter( u => builderAlliance.find( b => b==u.alliance) )
                            .map( u => u.faction) ) ];

      let new_builderFaction = [];
      unitFactions.forEach((u) => {
            // generate our faction buttons
            let b = document.createElement('button');
            b.className = "btn btn-success";
            b.title = u;
            b.innerHTML = u;
            let factionRune = document.getElementById("fr:"+u).cloneNode();
            factionRune.className = "buttonRune";
            b.appendChild(factionRune);
            builderFactionContainer.appendChild(b);

            // toggle button and toggle alliance's place in builderAlliance
            b.addEventListener("click",(e) => {
                builderclickFactionTabs(b,e); })  // end event listener

            // bring back previous alliance selections if any
            if (builderFaction.length > 0){
              if (builderFaction.find( bf => bf == u)){
                new_builderFaction.push(u);  // add to new selection list
                b.active = true;              // select this button
                b.className+=" active";
              }
            }
      })

      builderFaction = new_builderFaction;

      // if we have factions, draw the table
      if (builderFaction.length>0){
        let table_container = document.getElementById("unitTableContainer")

        // clear the units table
        while(table_container.firstChild)
          table_container.removeChild(table_container.firstChild)

        table_container.appendChild(makeTable(builderUnits));
      }
}


// when sorting/getting list of units by alliance/faction, click on alliance button
// 1. fix our editor list of currently selected alliances
// 2. change button details
// 3. rebuild/fix list of builder Units
function builderclickAllianceTabs(b,e){

  if (b.active == true){  //turn off
    // remove from our builderAlliances
    builderAlliance.splice(builderAlliance.indexOf(b.title),1);
    b.active = false;
    // clear button status
    b.className = b.className.replace(" active","");

    // get rid of all units with this alliance
    builderUnits = builderUnits.filter(bu => bu.alliance != b.title);
    builderAddFactionTabs();


  }else{  // turn on!

    builderAlliance.push( b.title );
    b.className += " active";
    b.active = true;
    // get all units with this alliance(and acceptable factions) from main listing
    builderUnits = builderUnits.concat(units.filter(u =>
                                u.alliance == b.title && builderFaction.find(f => f == u.faction)));
  }

  // refresh builderTabs, as if alliances disappearered, some factions could go too
  builderAddFactionTabs();
  let table_container = document.getElementById("unitTableContainer")
  while(table_container.firstChild)
    table_container.removeChild(table_container.firstChild)
  table_container.appendChild(makeTable(builderUnits));

}




function builderclickFactionTabs(b,e){
  console.log("clicked faction button");
  if (b.active == true){  //turn off
    // remove from our builderfactions
    builderFaction.splice(builderFaction.indexOf(b => b == b.title),1);
    b.active = false;
    // clear button status
    b.className = b.className.replace(" active","");

    // get rid of all units with this alliance
    builderUnits = builderUnits.filter(bu => bu.faction != b.title);

  }else{  // turn on!

    builderFaction.push(b.title);
    b.className+=" active";
    b.active = true;
    // get all units with this alliance(and acceptable factions) from main listing
    builderUnits = builderUnits.concat(units.filter(u =>
                                u.faction == b.title && builderAlliance.find(a => a == u.alliance)));
  }

  // refresh builderTabs, as if alliances disappearered, some factions could go too
  //builderAddFactionTabs();
  let table_container = document.getElementById("unitTableContainer")
  while(table_container.firstChild)
    table_container.removeChild(table_container.firstChild)
  table_container.appendChild(makeTable(builderUnits));

}




// ???
function builderGetUnits(){
  builderUnits = units.filter((u) => { builderAlliance.find(b=>u.alliance == b) });
  if (builderUnits)
    builderUnits = builderUnits.filter((u) => { builderFaction.find(b=>u.faction == b) });
}


// makes and returns an dom element table for all units in units array
function makeTable(units){
    // create header
    const headings = ["Fct","name","leader","points","score","move","toughness","wounds","range","attacks","strength","damage","crit","range 2","attacks 2","strength 2","damage 2","critical 2"];
    let table = document.createElement("table");
    table.className = "table table-hover text-center unitTable";

    runeHistory={};

    let head = table.createTHead().insertRow();
    headings.forEach( ( h )=> {
      let th = document.createElement("th");
      th.scope = "col";
      let text = document.createTextNode(h);
      th.appendChild(text);
      head.appendChild(th);
    })

    let tbody = document.createElement("tbody");
    table.appendChild(tbody);

    //fill with our unit profiles
    units.forEach((u,i)=>{
      let row = tbody.insertRow();
      row.id = "units:"+ i;
      row.insertCell().appendChild(makeTableRune("fr:"+u.faction));
      row.appendChild(document.createElement("th")).innerHTML = u.name;
      u.leader?row.insertCell().appendChild(makeTableRune("rn:Leader"),"active") : row.insertCell();
      row.insertCell().innerHTML = u.cost;
      row.insertCell().innerHTML = u.score;
      row.insertCell().innerHTML = u.movement;
      row.insertCell().innerHTML = u.toughness;
      row.insertCell().innerHTML = u.wounds;

      row.insertCell().innerHTML = ((u.weapons[0]&&u.weapons[0].active)?u.weapons[0].range:"N/A");
      row.insertCell().innerHTML = ((u.weapons[0]&&u.weapons[0].active)?u.weapons[0].attacks:"N/A");
      row.insertCell().innerHTML = ((u.weapons[0]&&u.weapons[0].active)?u.weapons[0].strength:"N/A");
      row.insertCell().innerHTML = ((u.weapons[0]&&u.weapons[0].active)?u.weapons[0].damage:"N/A");
      row.insertCell().innerHTML = ((u.weapons[0]&&u.weapons[0].active)?u.weapons[0].critical:"N/A");

      row.insertCell().innerHTML = ((u.weapons[1]&&u.weapons[1].active)?u.weapons[1].range:"N/A");
      row.insertCell().innerHTML = ((u.weapons[1]&&u.weapons[1].active)?u.weapons[1].attacks:"N/A");
      row.insertCell().innerHTML = ((u.weapons[1]&&u.weapons[1].active)?u.weapons[1].strength:"N/A");
      row.insertCell().innerHTML = ((u.weapons[1]&&u.weapons[1].active)?u.weapons[1].damage:"N/A");
      row.insertCell().innerHTML = ((u.weapons[1]&&u.weapons[1].active)?u.weapons[1].critical:"N/A");

      row.addEventListener('click',unitRowClick);
/*
      row.insertCell().innerHTML = u.strength;
      row.insertCell().innerHTML = u.damage;
      row.insertCell().innerHTML = u.;
      row.insertCell().innerHTML = u.;
      row.insertCell().innerHTML = u.;
      */
    })
    sorttable.makeSortable(table);
    return table;


    // gets and clones the runes in smaller form to display in table
    // use runeHistory to save our adjusted clones for faster recloning each time
    // another fighter in the list has the same (almost always when sorted)
    function makeTableRune(id,alt = "yes"){

          if (runeHistory[id]){ // pre-stored
              return runeHistory[id].cloneNode();

          // not used this list yet
          }else{
              let rune = document.getElementById(id);

              // id was found for image ? element of the node
              // only time we should be finding original.
              // also first call passes back our first clone
              if (rune){
                 rune = rune.cloneNode();
                 rune.className = "listRune";
                 runeHistory[id] = rune;
                 return rune;

              // no element found, create placeholder. also save it to our
              //runeHistory
              }else{
                 //return some quick element to fill
                 rune = document.createElement("span")
                 rune.innerHTML = alt;
                 runeHistory[id] = rune;
                 return rune;
               }
          }
        } // end makeTableRune
    }


function makeListBox(list){
  // function to print a comple list as small div to be flexed
  // together for browsing
  let box = document.createElement('div');
  let head = box.appendChild(document.createElement('div'));
  box.className = "card m-2";
  box.style.width = "400px";
  box.style.flex = "none";
  head.innerHTML = list[0].totalCost
                  + " models: "+list[0].totalModels
                  +" \n Wounds: "+ list[0].totalWounds
                  + "\n score: "+list[0].totalScore;
  let div =  box.appendChild(document.createElement('ul'));
  div.className="list-group ml-3";
  for(let i = 1; i < list.length; i++){
    let u = list[i];
    let li = div.appendChild(document.createElement('li'));
    li.className = "m-1";
    li.innerHTML = (u.models>1?u.models+"x ":"   ") + u.unit.name+ " cost:"+u.unit.cost+" group cost:"+u.groupCost;
  }
  return box;
}



// generate a div with makeListBox for each list in lists
// and append to div (after clearing its own children)

function populateWithListBoxes(div,lists){

  // clear old lists
  while(div.firstChild){ div.removeChild(div.firstChild);}

  lists.forEach((list)=>{
    div.appendChild(makeListBox(list))
  })
}

//TODO **Moustache bullshit (not parsing the variables inside render)

function populateWithListBoxesM(div,lists){
 const boxTemplate = document.querySelector('#list-display-template').innerHTML;
const itemTemplate = document.querySelector('#list-display-item-template').innerHTML;


  lists.forEach((list)=>{ // create the logic needed for moustache to render list
        let box = Mustache.render(boxTemplate, list[0])
        var template = document.createElement('template');
        template.innerHTML = box;
        box = template.content.firstChild;
        console.log(box)
        let ul = box.getElementsByTagName('ul')[0];

        for(let i = 1;i<list.length;i++){
            ul.innerHTML += Mustache.render(itemTemplate, list[i])
        }

        div.appendChild(box);
        })
      }
    /*
}


    //box = div.innerHTML = box;
    console.log(list[0]);
    console.log(box);
    let ul = box.getElementsByTagName('ul')[0];
    for(let i = 1;i<list.length;i++){
      ul.appendChild(Mustache.render(itemTemplate, list[i]))
    }
  })
    div.appendChild(box);
      //div.appendChild(Mustache.render(boxTemplate, i));

      //div.appendChild(makeListBox(i));
      /*  {
          username:message.username,
          message:message.text,
          createdAt:moment(message.createdAt).format("h:mm a")
      })*/


// writes a list to console
  function writeList(list){
  //  if (typeof list == 'array' && list.length>=1 ){
      console.log("points:"+list[0].totalCost + " models:"+list[0].totalModels+" wounds:"+list[0].totalWounds, " score:"+list[0].score);
      for(let i = 1; i < list.length; i++){
        let u = list[i];
        console.log(""+(u.models>1?u.models+"x ":"   ") + u.unit.name+ " cost:"+u.unit.cost+" group cost:"+u.groupCost );
      }
    console.log("\n");
  }


// specifies what className to pop on a row to indicate it was selected
// we will add or remove to designate it for selection when running
// builder functions on the table
const rowSelectedClass = "table-active";

// select a row in a units table, we change the className
// to indicate row is selected or not (see tableSelectAll and more below)
function unitRowClick(){
//  console.log(this);
  if (this.className.includes(rowSelectedClass))

    this.className = this.className.replace(rowSelectedClass, "");
  else
    this.className += rowSelectedClass;
}


// for a given table, select all rows (not in thead)
// do this by setting the className to the const above 'rowSelectedClass'
//  so later on when we know what units array created this table,
//  we can search for those entries, match the indexes and know what units
// were selected

function tableSelectAll(table, unselect = false){

  console.log("do it")
  if (table == undefined) {
      console.log("error no table ",tableid); return null;}

  rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
  for (let i of rows){
      // if not selected
      if (!i.className.includes(rowSelectedClass)){
          if (!unselect) i.className += rowSelectedClass;

      }else if(unselect == true){
        i.className = i.className.replace(rowSelectedClass,"");
      }

  }
}

// seperate option to get all Units currently 'selected'
// we use unitss as our passed, to differ from our global]
// which we will assume for now
function getUnitsClicked(table, unitss = units){


if (table == undefined) {
    console.log("error no table ",tableid); return null;}

  let includeRows = [];
  let rowid =0;
  rows = table.getElementsByTagName("tr");
  for (let i of rows){//Each((i)=>{
    if (i.className.includes(rowSelectedClass)){
      rowid = parseInt(i.id.replace("units:",""));
      if (!isNaN(rowid))
        includeRows.push(unitss[rowid]);
      }
  }
  console.log("units selected:",includeRows)
  return includeRows;
}


function getLists(table){
  let subunits = getUnitsClicked(table,builderUnits);
  console.log("getLists() subunits:",subunits)
  let cost = document.getElementById("cost_input").value;
  let leeway = document.getElementById("leeway_input").value;
  let sort1 = document.getElementById("listSort1").value;
  let sort2 = document.getElementById("listSort2").value;
  console.log("sortBy:",sort1,sort2)

  let lists = listOptimizer(subunits,cost,leeway).sortBy(sort1,sort2);

  let div = document.getElementById("listContainer");
  populateWithListBoxes(div,lists);
  // writeLists() console logging output
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
  // weapon 1 range
  score += 2.82*(Array.isArray(u.weapons[0].range)?u.weapons[0].range[1]:u.weapons[0].range);
  //weapon 1 stats
  score += 7.63 * u.weapons[0].attacks + 12.71*u.weapons[0].strength + 8.92*u.weapons[0].damage + 3.11*u.weapons[0].critical;
  // second weapon
  if (u.weapons.length>=2){
    score -= 36.43;
    //score += 8.13*(Array.isArray(u.weapons[1].range)?u.weapons[1].range[1]:u.weapons[1].range);
    score += 8.13*u.weapons[1].attacks + 0.89*u.weapons[1].strength + 11.88*u.weapons[1].damage + 5.50*u.weapons[1].critical;
  }
  if (u.leader==true)
      score += 20.89 + (u.runemarks && u.runemarks.length>1?4.53:0);
  else
      score += (u.runemarks && u.runemarks.length>0?4.53:0);

  return score;
}

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
      return (i==1?0:a) + (u.unit[stat] * u.models);
  })

  return a;
}


// entry for  listbuilder, sorts out appropriate army/allies and performs
// some filtering of data, around main fuction makeLists

function listOptimizer(units, cost, leeway = 5, filters = {}){
//  console.log("//////////////  run optimizer " + cost + "   //////////////////////////")
//  console.log("Units:");
//  writeUnits(units);

// isolate appropriate forces
  console.log("start list building with units:",units)
  if (!units || units.length == 0) return [];

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
//  makeLists is responsible for taking untis list, some
// create sets of lists

function makeLists(list, cost, i){

    // all lists have primary object with overall details

    if (list.length == 0)
    list.push({totalCost:0, leaders:0, totalWounds:0})


    // final call on a list with no space left

    if (cost < cheapestCost){
      if (list[0].leaders == 0) return;
      if (cost>leeway) return;

      // create some details in list[0]
      list[0].totalModels = listGetSum(list,"models")
      list[0].totalWounds = listGetSum(list,"wounds")
      console.log("Got wounds" , list[0].totalWounds,list)
      list[0].totalScore = listGetSum(list,"score")
      //list[0].avgWounds = list[0].unit.wounds / list[0].number;

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
          newlist.push({unit:units[i], models:j, groupCost:units[i].cost*j})
          newlist[0].totalCost += units[i].cost*j;

          if (units[i].leader)
            newlist[0].leaders += j;
        }

        // j=0 so we add create branch without any units at i
        makeLists(newlist, cost-(units[i].cost*j), i+1)
    }

    return {done:true}
  }

  function makeError(){

  }




}


// filter our lists by two variables (match by first then by secound)

Array.prototype.sortBy = function (var1=null,var2=null){
    if (!var1) return this;

    if (var2) return this.sort((a,b) => {
              if  ((a[0][var1] > b[0][var1]) ||
                (a[0][var1] == b[0][var1] && a[0][var2] > b[0][var2]))

                return 1;
                // otherwise
                return -1;
    })
    // without the second clause var2
    return this.sort((a,b) => (a[0][var1] > b[0][var1]?1:-1))

}



$(document).ready(function() {
  document.getElementById("unitTableContainer").appendChild(makeTable(units));

  //builderAddAllianceTabs();
})



/*  below is various console testing calls for the functions



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
//*/

/*writeLists(finalList.filter( f => f[0].totalModels>9)
              .sort((a,b) => {
                //console.log("score a"+a[0].score + "score b"+b[0].score)
                return (a[0].score > b[0].score?1:-1)
            }).reverse())//
//*/
/*
console.log("write first list and last list (score then wounds)")

writeList(finalList[0])
//writeLists(finalList.slice(0,20));//
writeList(finalList[finalList.length-1])

//console.log("top and bottom main",finalList[0], finalList[finalList.length-1])

//console.log("top and bottom new",finalListTest[0], finalListTest[finalListTest.length-1])
//*/
