/*
*
*   fceditor.js
*
*   functions for interacting with fightercard editing ui
*   warning some functionality current lazily intermingled with fighterApp
*   functions for html controls to alter fightercard
*/

function getImage(element)
{
    return $(element).find("img")[0];
}


function getLabel(element)
{
    return $(element).prop("labels")[0];
}




// faction runemark selected
// knowing we are getting radB managed button returned
// check target's parent's title for status and current target
// for image (in our case)

function selectFactionRunemark(e){

  // this case specifically cheating radB by placing only one onclick in the form, so knowing that
  // lets ensure we aren't clicking top-level button (we want child)
  const id = "factionRunemarkSelect";
  if (e.target.id == id) return;
  let button = e.target;
  while(button.parentNode.id != id) button = button.parentNode;

  // is currently on, so dont turn off (no fighter should have neutral faction)
  // will break if buttons arent managed on and off at loading/clearing steps elsewhere
  if (button.parentElement.title == e.target.title)
    return;

  // set faction
  fighterCard.faction = button;
  clickRadB(e);
}


function fighterCardToRunemarkSelect(id = "tagRunemarkSelect"){

  let div = document.getElementById("tagRunemarkSelect");
  if (!div) return; // not found?

  forceClearRadB(div);

  let frunes = fighterCard.tagRunemarks;

  list = Array.from(div.children)
          .filter((l) => frunes.find(e => e == l));
  list.forEach((l) => l.className += " active");
}


// work around radB to allow multiple selections
// if toggling runemark produces a change, toggle the button

function selectTagRunemark(e){
    // ensure we have top level
    const id = "tagRunemarkSelect";
    if (e.target.id == id) return;
    let button = e.target;
    while(button.parentNode.id != id) button = button.parentNode;

    let check = fighterCard.toggleTagRunemark(button);
    // something was modified
    if (check){
      if (button.className.search("active")>=0){
        button.className = button.className.replace("active","");}
      else button.className += " active";
    }
}

// continue trend above of overriding radB to enable single onclick, and manage selection
// this option is superficial so dont care if its toggled totally off

function selectWeaponmark(e, weapon){
    // inner buttons will get event, ignore if top-level gets click
    const id = "weaponRunemarkSelect" + weapon;
    if (e.target.id == id){console.log("top found, quit"); return;}

    let button = e.target;
    while(button.parentNode.id != id) button = button.parentNode;

    // set weapon
    fighterCard.setWeaponRune(button,weapon);
    clickRadB(e);
}

function setWeapon(e, weapon){
    const stat = e.target.name;
    const value = e.target.value;
    const fd = fighterCard.fighterData.weapons[weapon];
    switch (stat){
      case "rangeMin":
        fd.range[0] = value; break;
      case "rangeMax":
        fd.range[1] = value; break;
      case "attacks":
        fd.attacks = value;break;
      case "strength":
        fd.strength = value;break;
      case "damageBase":
        fd.damage = value;break;
      case "damageCrit":
        fd.critical = value;break;
    }
    fighterCard.draw();
}

// turn the weapon window invis if weapon is not 'active'
// (not currently used, we keep both weapons on the fighter, just not set to active)

function onWeaponControlsToggled(weaponCheckBox,weapon,set) {
    // set is override, if not passed we want to toggle
    if (set == undefined) set = !weaponCheckBox.active;

    // we want to set but class is off
    if (set && !weaponCheckBox.active) weaponCheckBox.className += " active";
    //flipped
    if (!set && weaponCheckBox.active)
      weaponCheckBox.className = weaponCheckBox.className.replace(" active","");

    weaponCheckBox.active = set;
    fighterCard.setWeaponActive(weapon,set);
    weaponCheckBox.innerHTML = set? "Equipped" : "Equip";
}


/*
*
*     stat setters
*
*/
function setAlliance(e){
  fighterCard.fighterData.alliance = e.value;
  fighterCard.draw();
}

  function setWounds(e){
    fighterCard.fighterData.wounds = e.value;
    fighterCard.draw();
  }

  function setToughness(e){
    fighterCard.fighterData.toughness = e.value;
    fighterCard.draw();
  }

  function setPoints(e){
    fighterCard.fighterData.cost = e.value;
    fighterCard.draw();
  }

  function setMovement(e){
    fighterCard.fighterData.movement = e.value;
  }


// relies on global units list

  function setName(e){

    // we found the unit name already
    if (units.find((u)=>{u.name.toLowerCase() == e.value.toLowerCase()})){
      console.log(e,u)
      if (e.className.search("error")==-1)
      e.className += " error"

    }else{

      if (e.className.search("error")==-1)
      e.className.replace(" error","");
      fighterCard.name = e.value;
    }
  }




// currently editing fightercard placed back into units
// treating unit.name as unique value (really doesn't matter, but might help player organize, also loading a card from
// cards gallery clones it so changing some stats and saving can override it

function fighterCardSave(){

    let pre = units.findIndex( (u) => u.name == fighterCard.fighterData.name );

    // found pre-existing card
    if (pre>=0){
      if (!window.confirm("saving will override card with same name, OK?"))
        return;

      // override existing unit
      let previous = units[pre];
      copyData = JSON.parse(JSON.stringify(fighterCard.fighterData));
      units.splice(pre,1,copyData);

      // check and reconnect fightercard
      let fc = fighterCards.find( (u) => u.fighterData === previous );
      if (fc){ // should always if we always maintain a fighterCard for each unit (when loaded)
              // if we want to more easily create a bunch of cards whenever we list unit groups,
              // we should modify this for gallery cards only, have different lists or canvas references to card, etc.
          console.log("fighterCardSave found fightercard!",fc)
          fc.fighterData = copyData;
          fc.linkImageRunemarks();
          fc.fullDraw();
      }

    // save new
    }else{

      copyData = JSON.parse(JSON.stringify(fighterCard.fighterData));
      units.push(copyData);

      let c = document.createElement("canvas");
      c.width = 1000;

      let fc = new Fightercard(c,copyData,
                                document.getElementById("fighterCards_formatControls").title,
                                document.getElementById("fc_style").title);

      fighterCardsDiv.appendChild(c);

      // keep master list of all units
      fighterCards.push(fc);

      c.addEventListener('click', function(e){
          fighterCardsSelectedSwitch(c,e)
      });
  }
}

/* saving / loading from our fighterCard main editor window card and any lists we want to load from
*/
function fighterCardLoad ( fighterData ){
  // we havent tracked 'changes' made to the fighterCard so lets just always ask for saveOLK?
  if (window.confirm("Do you want to save the working card first?"))
    fighterCardSave();

    copyData = JSON.parse(JSON.stringify(fighterData));

    fighterCard.fighterData = copyData;
    fighterCard.linkImageRunemarks();
    //fighterCard.image = document.getElementById(copyData.fighterImage);

    //fighterCard.linkRunemarks();
    //fighterCard.fullDraw();
    editorControlsReset();
}

function editorControlsReset(){
    if (!fighterCard) return // this would be a problem

    let data = fighterCard.fighterData;
    // background
      //sectionFighterCardFormatTabs();
      //sectionFighterCardStyleTabs();
    //faction runemark

    setRadB("factionRunemarkSelect",data.faction)
    // runemarks
    fighterCardToRunemarkSelect();

    // characteristics
    document.getElementById("alliance").value = data.alliance;
    document.getElementById("fighterName").value = data.name;
    document.getElementById("movement").value = data.movement;
    document.getElementById("toughness").value = data.toughness;
    document.getElementById("numWounds").value = data.wounds;
    document.getElementById("pointCost").value = data.cost;
    document.getElementById("fc_score").innerHTML = data.score;
    let rgb = fighterCard.getColor();
    let colorselect = document.getElementById("colorSliderShow");
    if (rgb)
      colorselect.style.backgroundColor = 'rgb('+rgb.r +','+ rgb.g +','+ rgb.b+')';
    else
      colorselect.style.backgroundColor = "";

    //weapons
    for(let i = 0;i<data.weapons.length;i++){
      setRadB("weaponRunemarkSelect"+i,data.weapons[i].runemark);
      onWeaponControlsToggled(document.getElementById("weaponEnabled"+i),i,data.weapons[i].active)
      document.getElementById("rangeMin"+i).value = data.weapons[i].range[0];
      document.getElementById("rangeMax"+i).value = data.weapons[i].range[1];
      document.getElementById("attacks"+i).value = data.weapons[i].attacks;
      document.getElementById("strength"+i).value = data.weapons[i].strength;
      document.getElementById("damageBase"+i).value = data.weapons[i].damage;
      document.getElementById("damageCrit"+i).value = data.weapons[i].critical;
    }
  }

function resetEditor(){
  fighterCard = new Fightercard($("#fc_canvas")[0],
                        unit("soldier", false, 55, 4, 3, 10, [["Axe",[0,1],3,3,1,3],["Ranged weapon",[1,6],3,3,1,3]], "order","Spire Tyrants",[],undefined,{x:0,y:0,scale:1}))
  editorControlsReset();
  fighterCard.fullDraw();
}



/*
/* add and manipulate buttons for fightercard format/style selection
 *
 *  the section-background for fighters, and later for cards can have autogenerated selection
 *  buttons, taking values from the fighterCardFormatStyles array. extending that array will automatically reflect
 *  in the tab (assuming any dynamic changes re-call function)
*
*   assumes and uses radB functions to swap values
 */

// fcdiv    = the element containing fightercards we want to control format/style of
// buttondiv = first of two divs we want to place our format, then style buttons inside
// only needs to be called on load and when new formats are loaded dynamically
// when player selects a new format option, call clickSectionFighterCardFormatTab(event)

function addFighterCardFormatControls(fcdiv, buttondiv){

  // ensure we have correct elements for both the canvases and the buttons
  if (typeof fcdiv == "string") fcdiv = document.getElementById(fcdiv)
  if (!fcdiv) return;
  if (typeof buttondiv == "string") buttondiv = document.getElementById(buttondiv)
  if (!buttondiv) return;

  buttondiv.innerHTML = ""; // clear all formats buttons
  buttondiv.nextElementSibling.innerHTML = "";  // and style buttons

  //get default format/style from first fightercard canvas found inside fcdiv
  let format = "", style = "";
  let canvases = fcdiv.getElementsByTagName("canvas");
  if (canvases){  canvases = Array.from(canvases).find( c => c.fightercard)}
  if (canvases){  format = canvases.fightercard.format;
                  style = canvases.fightercard.style; }

  // loop through all avaliable formats and make buttons
  Object.keys(fighterCardFormatStyles).forEach((f)=>{
        let b = document.createElement('button');
        b.className = "btn btn-secondary btn-sm";
        b.innerHTML = f;
        b.title = f;
        buttondiv.appendChild(b);
        buttondiv.append("\u00A0");
        // these buttons change the format of all cards inside the fcdiv
        // then change the list of buttons in the next div down to represent the
        // styles avaliable for the selected format
        b.addEventListener('click',(e) =>{clickRadB(e); clickFighterCardFormatControls(fcdiv,buttondiv,e)})
        // manually set radb style titles and active
        if (f == format){
          b.className += " active";
          buttondiv.title = f;
        }
    })
    addFighterCardStyleControls(fcdiv,buttondiv,format, style);
  }

  // when we want to show controls for changing the format/style of a set of fighterCards (in a gallery or fighterCard)
  // we should have in html <div id="[name]format"></div><div id="[name]format"></div>
  // then pass to
  // given a format button set and an expected style buttonset
  // we read current format and create new set of style buttons based on fighterCardFormatStyles
  function addFighterCardStyleControls(fcdiv, buttondiv, format, style){

      let stylediv = buttondiv.nextElementSibling;
      // no idea what format
      if (!format){  stylediv.innerHTML = "<button class='btn btn-info btn-sm'>Select a Format</button>"; return;}
      // let's assume our vars are intact
      stylediv.innerHTML = ""; // clear all
      Object.keys(fighterCardFormatStyles[format]).forEach((f,i)=>{
          let b = document.createElement('button');
          b.className = "btn btn-info btn-sm";
          b.innerHTML = f;
          b.title = f;
          stylediv.appendChild(b);
          stylediv.append("\u00A0");
          // these buttons toggle their group
          b.addEventListener('click',(e) =>{clickRadB(e);   clickFighterCardStyleControls(fcdiv, e);})
          //manually set radb style titles and active
          if (f == style || (!style && i == 0)){
            b.className += " active";
            stylediv.title = f;
          }
      })
  }

  // when user clicks on a card format button, regenerate appropriate style selection buttons
  // for the newly selected format
  function clickFighterCardFormatControls(fcdiv, buttondiv, event){
      let canvases = fcdiv.getElementsByTagName("canvas");
      if (canvases){
        canvases = Array.from(canvases)
                  .filter( c => c.fightercard)
                  .forEach((c) => c.fightercard.setFormat(event.target.title))
      }
      addFighterCardStyleControls(fcdiv, buttondiv,event.target.title);
      //sectionFighterCardStyleControls(fcdiv);
  }

  // when user clicks on a style button, push to
  function clickFighterCardStyleControls(fcdiv, e){
    let canvases = fcdiv.getElementsByTagName("canvas");
    if (canvases){
      Array.from(canvases).filter( c => c.fightercard)
                .forEach( c => c.fightercard.setStyle(event.target.title))
    }
  }

///////END FORMAT BUTTONS ////////////////////////////////////////////////////////////////////


// if attrib is an array, we can go through the elements one after each other
//to drill down to what we want to get
function parseTree(elem,attrib){
  if (!Array.isArray(attrib)) return elem[attrib];

  try{
      attrib.forEach((a)=> elem = elem[a]);
      return elem;

  }catch(e){
    return undefined;
  }
}

// given a div containing children we wish to sort,
// and either the attribute or attribute tree in an array [s,t]= child.s.t
// sort elements on that attribute
function sortElements(div, attrib){

  if (typeof div == "string") div = document.getElementById(div);
  if (!div) return;

  let elem = Array.from(div.children);
  elem = elem.sort((a,b) => {
    //"get elements"
    let ae = parseTree(a,attrib);
    let be = parseTree(b,attrib);
    console.log("compare:",ae,be)
    if(ae < be) return -1;
    if(ae > be) return 1;
    return 0;})
  console.log("sorted:",elem)
  elem.forEach( e => div.appendChild(e));
}



// color slider functions
// for setting a background color for each card
function makeSlider(id,increment){
  //255,0,0 -> 0,255,0 -> 0,0,255 -> 255->0->0
  let div = document.getElementById(id);
  let r = 255, g = 0 , b = 0;
  for(let i = 0; i<255; i += increment){
    div.appendChild(_makeSliderBox(r,g,b));
    r -= increment;  g += increment;  }
  for(let i = 0; i<255; i += increment){
    div.appendChild(_makeSliderBox(r,g,b));
    g -= increment;   b += increment;  }
  for(let i = 0; i<255; i += increment){
    div.appendChild(_makeSliderBox(r,g,b));
    b -= increment;    r += increment;  }
}


function _makeSliderBox(r,g,b){
  // increments can go out of bounds... css can handle it
  // but this is cleaner
  r = Math.max(0,Math.min(255,r));
  g = Math.max(0,Math.min(255,g));
  b = Math.max(0,Math.min(255,b));

  let s = document.createElement("span");

  s.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
  s.onclick = function(event){sliderClick(r + ',' + g + ',' + b)};
  return s;
}


function sliderClick(rgb){
  let show = document.getElementById("colorSliderShow");
  show.style.backgroundColor = 'rgb('+rgb+')';
  fighterCard.setColor(...rgb.split(","))

}

function sliderOff(){
  let show = document.getElementById("colorSliderShow");
  show.style.removeProperty("background-color");
  fighterCard.clearColor();
}




window.addEventListener('load',function(){

    // generate format controls
    addFighterCardFormatControls("fighterCard_container", "fightersSetCardFormatControls");
    addFighterCardFormatControls("fighterCardsDiv","fighterCards_formatControls");
    makeSlider("colorSlider", 10);
    editorControlsReset();


})
