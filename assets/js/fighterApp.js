/*
*   fighterApp - controller for fightercard, editor for warcry data app
*   handles image gallery, zip package loading/saving
*   keep application global variables here
*/

// Initialize Gloabal variables /////////////////////

// our central editor fighterCard
var fighterCard = new Fightercard($("#fc_canvas")[0],
                      unit( "soldier", false, 55, 4, 3, 10, [["Axe",[0,1],3,3,1,3],["Ranged weapon",[1,6],3,3,1,3]],
                            "order","Spire Tyrants",[],"soldier.png",{x:0,y:0,scale:1}))

var images = [];  // our array of fighterImages/Others? after loading from file. loading is multi-stage process so global for now

var fighterImageData = {}  // stores data about our images and helps track for duplicates (all fighter images in gallery)
var imageNameChanges = []; // so we can correct duplicate images/units mid-loading

var customWeapons = [];   // images/data for custom icons (and associated values)
var weaponNameChanges = [];   // so we can correct duplicate images/units mid-loading

var customRunemarks = [];
var runemarkNameChanges = [];   // so we can correct duplicate images/units mid-loading

var customFactions = [];
var factionNameChanges = [];   // so we can correct duplicate images/units mid-loading


var units = []; // all units created/loaded from file

var loadingUnits = null; // when loading new files, keep seperate from full list, until duplicate names are dealt with


loadingImagesTotal = 0; // helps identify when all the latest images/custom elements are loaded and complete, before creating new unit cards

var fighterCards = [];  // whenever a unit has a fighterCard generated for it, keep in this list.
                        // note canvas-Fightercard link eachother, not data (can be 1 to many)

// divs
//  our main gallery div for images
var imagesDiv = document.getElementById("fighterImageGallery");//document.createElement("div");

// our main gallery for fightercards. NOTE fighterCard, as used by fceditor is a clone and seperate
var fighterCardsDiv = document.getElementById("fighterCardsDiv"); //document.createElement("div"); // gallery of fighterCards

/*
 *  Unit functions
 *
 */

  // 'constructor' for our units (pseudo-constructor)

  function unit(name, leader, cost, movement, toughness, wounds, weapons, alliance, faction, runemarks,imageName,imagePosition){
      function weaponIn(att){
        return {runemark:att[0], range:att[1], attacks:att[2], strength:att[3], damage:att[4], critical:att[5], active:true}
      }

      function weaponsIn(weapons){
        let wt = []
        weapons.forEach( a => wt.push(weaponIn(a)));
        return wt;
      }

      let obj = {name, leader, cost, movement, toughness, wounds, alliance, faction,imageName,imagePosition};
      obj.weapons = weaponsIn(weapons);
      if(runemarks) obj.runemarks = runemarks;

      obj.score = getUnitScore(obj);
      return obj;
  }


  // function generates a balanced score for a unit roughly in line with
  // their points system

  function getUnitScore(u){
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

    return Number(score.toFixed(2));
  }


// when we want to generate all the tabs for factions, get unique list
function getUniqueAlliance(units){
  let names =[]
  let unitAlliance = units.map((u)=>{ names.push(u.alliance)});
  var seen = {};
  return names.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function getUniqueAllianceFaction(units, alliance){
  // if we dont define alliance, make a list of all factions(no alliance sort)
  // this helps when we are already passing a pre-filtered list or looking for every
  // faction irregardess of its alliance
  let names = []
  let unitFaction = units.map((u)=>{
      if (!alliance || alliance == u.alliance) names.push(u.faction)});
  var seen = {};
  return names.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}


  // called from multi-file loading input
  // determine what we are loading and call appropriate set.
  // the custom runemarks are loaded seperately in their own dialogs
  // as they would be confused with fighter images

  function loadFile(input){
      let data = input.files[0];

      // check which type of file
      // image
      var re = /(.jpg|.png|.gif|.ps|.jpeg)$/;
      if (re.test(data.name.toLowerCase())){

        data = [data.name, data]
        getDuplicateImageNames(data,images,imageNameChanges);
        console.log("imageNameChanges returned:",imageNameChanges);

        images.push(data);
        return loadFighterImageFromFile(data);
      }
      // else zip
      loadzip(data);

  }


  // total structure of Promise fun stuff taken from here: https://github.com/Stuk/jszip/issues/399

  // load from user file, check for either fighterImage or zip package
  // for zip, traverse zip with JSZip, all photos regardless of folder path (weapons, factions)
  // are kept as [filename.jpg,blob,"foldername" (default / is "fighters")]
  // ignore all further folders beyond one level (so weapons/pointy/... saves as "weapons")
  // generate images, then when complete, generate data.

  function loadzip(data){

          // thanks to the following  for this zip opening function
          // https://github.com/Stuk/jszip/issues/399

          JSZip.loadAsync(data).then(function (zip) {

            // get our datafiles first

            // units data
            if (zip.files.hasOwnProperty("data.txt"))
              try{
                loadDataFromFile(zip.files["data.txt"])
              }catch(e){console.log("couldn't load data",e.message)}


            // get our images
            var re = /(.jpg|.png|.gif|.ps|.jpeg)$/;
            var newImages = {};
            var promises = Object.keys(zip.files).filter(function (fileName) {
              // don't consider non image files
              return re.test(fileName.toLowerCase());
            }).map(function (fileName) {
              var file = zip.files[fileName];
              return file.async("blob").then(function (blob) {
                // break down the folder/name.extension
                let folderFile = fileName.split("/");
                if (folderFile.length == 1)
                    return [
                        fileName,  // keep the link between the file name and the content
                        blob,"fighters"];// create an url. img.src = URL.createObjectURL(...) will work
                else
                    return [
                        folderFile[folderFile.length-1],
                        blob,
                        folderFile[0]];

              });
            });
            // `promises` is an array of promises, `Promise.all` transforms it
            // into an array
            return Promise.all(promises);
          }).then(function (result) {

               // load all images (including rename checks and inserting into galleries and button groups)
                loadImagesFromZipAsync(result)
                  .then(()=>{
                    console.log("Images loaded, load Data");  // then create fightercards
                    completeLoadingZip();
                  });
                return result;
          }).catch(function (e) {
            console.error(e);
          });
  }

  /*
   *  generating image gallery cards for loaded images
   */

  // check out the data passed from loadzip below
  // once we have a list of [["name.jpg",<data>],...]
  // process each one into a gallery
  // there is a possible user bug where loading in multiple zips together
  // will cause file problems, we will need to check for duplicates, rename second
  // then adjust new cards coming in
    /////// array version of data passed from loadzip

  async function loadImagesFromZipAsync (data){

    let promise = new Promise((result,reject)=>{

        loadingImagesTotal = data.length; // length of all loaded images

        // sort out the customWeapons,customfactions, fighter etc
        let sortedData={}
        data.forEach(d=>{
              if(!sortedData[d[2]])
                sortedData[d[2]] = [d];
              else
                sortedData[d[2]].push(d);
        })
        // check for filename clashes
        getDuplicateImageNames(sortedData.fighters,images,imageNameChanges);
        getDuplicateImageNames(sortedData.factions,customFactions,factionNameChanges);
        getDuplicateImageNames(sortedData.weapons,customWeapons,weaponNameChanges);
        getDuplicateImageNames(sortedData.runemarks,customRunemarks,runemarkNameChanges);

        // if we have fighter images
        if( sortedData.fighters){
          sortedData.fighters.forEach((d) =>{ loadFighterImageFromFile(d);});
          images = images.concat(sortedData.fighters);
        }

        // Factions push to customFactions and our fighter selection div
        zipRunemarksToRadB(sortedData.factions,"factionRunemarkSelect", customFactions,"fr:");
        // Runemarks push to customFactions and our fighter selection div
        zipRunemarksToRadB(sortedData.weapons,"tagRunemarkSelect", customRunemarks, "rn:");
        // Weapons push to customWeapons and our fighter selection div
        zipRunemarksToRadB(sortedData.weapons,["weaponRunemarkSelect0","weaponRunemarkSelect1"], customWeapons, "wr:");

        result();
    })
  }


  // whether from zip or from file, this takes an image from data and
  // generates a gallery Image element for it
  function loadFighterImageFromFile(d){

        // creation of each image, with various listeners, sliders etc
        let img = new Image();  //htmlImageElement

        img.onload = function(){
            // our format is <div class="galleryImageBox"><div><img></img></div></div>
            imagesDiv.appendChild(containerDiv);
            containerDiv.appendChild(document.createElement('div')).appendChild(img);
            addGalleryImageListeners(containerDiv,img)

            // no data associated with this image
            if(!fighterImageData[img.title])
              fighterImageData[img.title] = {x:.5,y:.5,scale:1}

            img.style.transformOrigin = (fighterImageData[img.title].x*100)+"%"+(fighterImageData[img.title].y*100)+"%";
            img.style.scale = fighterImageData[img.title].scale;


            // hack to confirm all images loaded (when from zip) so we can continue
            // with generating zip file fightercards
            loadingImagesTotal--;
            if (loadingImagesTotal == 0){
              completeLoadingZip();
              sortElements("fighterImageGallery",["firstChild","firstChild","title"]);}
        }

        // this all happens before onload event listener /////////////////////////

        let containerDiv = document.createElement("div");
        containerDiv.className = "galleryImageBox";

        img.id = "gz:"+ d[0];
        img.title = d[0]; // filename

        //get our metadata for user adjusted origin and scale from loaded data
        if (!fighterImageData[d[0]])
          fighterImageData[d[0]] = {x:0, y:0, scale:1};
          console.log("img to load:",d);
          //img.src = d[1];
        img.src = URL.createObjectURL(d[1]);
        // create scale slider
        //containerDiv.innerHTML = "<input id='image slider' class='hideshow' style='position:absolute;max-width:120px' type='range' min='0' max='4' step='.2'"+
        //                "data-slider-value='"+ fighterImageData[d[0]] + "'"+
        //                "onchange='setImageScale(this)' title='" + d[0] + "'/>"
  }



  // zip file only, get zip data sorted in loadImagesFromZipAsync and push to
  // button groups (radB  icon galleries like faction, weapon etc.)

  function zipRunemarksToRadB(files, buttonDivId, customArray, prefix){
    if (!files) return;
    // get the dom elements for the buttonDivId's (user clicking grids container div)
    var groups = [];
    if (Array.isArray(buttonDivId)){ // lets cover where a loaded rune goes in several radB galleries
      buttonDivId.forEach((bd,i) => groups[i] = document.getElementById(bd))
    }else{
        groups[0] = document.getElementById(buttonDivId);
    }
    // process multiple files?
    files.forEach((file) =>{
      console.log("runemark file:",file, buttonDivId);
      let names = getNameExtension(file[0]);
      //let imageURL =file[1]//
      let imageURL =URL.createObjectURL(file[1])
      let image;
      // create and add to multiple button groups as passed in buttonDivId stored in groups
      groups.forEach(group => {
        image = addImageToRadB(imageURL, names[0], group);
          if (image)
        // set id to its ideal filename of 'actual faction name'.existing extension
            image.id = prefix + names[0];
      });
      // save the file with extension somewhere
      //customArray.push({name:names[0], filename:file[0], image:file[1]});
      customArray.push(file);
    })
  }

//*/



  // when we know all our images are loaded
  // we can create the fightercards for Each
  // fighterData listing

//TODO make the fighterData variable to be changed applied by above, for
// various imageName, faction, runemarks

  function completeLoadingZip(){
    if (loadingUnits){
    if (imageNameChanges){
      imageNameChanges.forEach((i)=>{
        loadingUnits.forEach((l)=> { if (l.imageName == i[0])
                                         l.imageName = i[1];})
      })
      imageNameChanges = [];
    }

      if(factionNameChanges.length>0){ // faction (icon)
        factionNameChanges.forEach((i)=>{
          loadingUnits.forEach((l)=> { if (l.faction == i[0])
                                          l.faction = i[1];})
      })
      factionNameChanges = [];
    }

    if(runemarkNameChanges.length>0){ // runemarks
      runemarkNameChanges.forEach((i)=>{
          loadingUnits.forEach((l)=> {
              l.runemarks.forEach((m,index) => {
                 if (l.runemarks[index] == i[0]) l.runemarks[index] = i[1];
              })
          })
      })
      runemarkNameChanges = [];
    }

    if( weaponNameChanges.length>0){ // weapons
      weaponNameChanges.forEach((i)=>{
        loadingUnits.forEach((l)=> {  console.log("check unit for Name Change",l)
                                      if (l.weapons[0].runemark == i[0]) l.weapons[0].runemark = i[1];
                                      if (l.weapons[1].runemark == i[0]) l.weapons[1].runemark = i[1];

        })
      })
      weaponNameChanges = [];
    }

    makeFighterCards(loadingUnits);
    units = units.concat(loadingUnits);
    loadingUnits = [];
  }else{
        imageNameChanges = [];
        weaponNameChanges = [];
        runemarkNameChanges = [];
        factionNameChanges = [];
  }
}

  // create a fightercard for each unit in array
  // and push it to div referenced in fighterCardsDiv.

  function makeFighterCards(units){
    if (!units) return;
    units.forEach((u)=>{
      let c = document.createElement("canvas");
      c.width = 1000;
      let fc = new Fightercard(c,u, document.getElementById("fighterCards_formatControls").title,
                                    document.getElementById("fc_style").title);
      fighterCardsDiv.appendChild(c);
      fighterCards.push(fc);

      c.addEventListener('click', function(e){
          fighterCardsSelectedSwitch(c,e)
      });
    })
  }


// zip func retrieves the data file for our units, images
// or if txt is read (let's catch errors)
// then uses filereader on the blobed file to get a string
// pass that string to loadUnits() to get our fighterData, images etc from file

function loadDataFromFile(file){

 		var reader = new FileReader();

 		reader.addEventListener('load', function (e) {
      // if we want to string more variables into the file
      // adjust loadData to perform several operations
      loadData(e.target.result);
 		})

    file.async("blob").then(function (blob) {
      reader.readAsText(blob);
    });
}


// when data.txt or similiar is extracted from zip, or cookie passed,
// break down the variables through Json into objects
// units, factions etc.
function loadData(decoded = null){

	//if (decoded == null)  // loading from cookie
	// decoded = decodeURIComponent(document.cookie);

	if (decoded == "") return;

  // loadingUnits holds data until new images are loaded.
  // when they all complete, we will generate cards
  loadingUnits = JSON.parse(getVarInCookie(decoded,"units"));

  fighterImageData = JSON.parse(getVarInCookie(decoded,"fighterImageData"))
  //we can load more objects from same file by replicating the line above (add custom runes)
}


// when given a long string of JSON variables
// we can pick out one as an object to return

function getVarInCookie(decoded,cname) {
  var name = cname + "=";
  var ca = decoded.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


//UNUSED? now we changed our image data format
function setImageScale (e){
  fighterImageData[e.title].scale = e.value;
  const r = document.getElementById("gz:"+e.title);
  r.style.scale = e.value;
  updateAllCanvas(r);
}


// splits "image.png" and returns ["image","png"]
function getNameExtension(name){
   pos = name.lastIndexOf(".");       // get last position of `.`
   return [name.slice(0,pos),name.slice(pos + 1)];            // extract extension ignoring `.`
}

// given an array ["image","png"] combine to "image.png" and return
function addNameExtension(nameExtension){
   if (nameExtension)
    return nameExtension[0]+"."+ nameExtension[1];

    console.log("ERROR addNameExtension recieved null")
}


// for runemarks and player images
// when first loading keep in seperate list of data = [name,data]
// when compared to old full list compare = [name,data]
// any time duplicate name is found, find unique one, change data[0]
// and store a pair [oldname,newname] in changelist
// function directly changes data and changelist, (or omit changelist and get returned)

//WORKING but requires the different image types to be sorted before hand, and is a better stand-alone function

function getDuplicateImageNames(data, compare, changelist){

  if (!changelist) changelist = [];
  if (!data) return;
  if (!Array.isArray(data[0])) data = [[data]]
  data.forEach((d) =>{
    // if we discovered a duplicate name

    if ( compare.find((c) => c[0] == d[0])){
      // check for same name in package, and change its name if already found
      //(counting up till successful)
      let checkName = getNameExtension(d[0]);
      let original = checkName[0];
      let i = 1;
      while (compare.find((c) => c[0] == addNameExtension(checkName))){
          checkName[0] = original + "("+i+")";
          i++;
      }
      messages.add("changed "+d[0] +" to "+ addNameExtension(checkName),"success");
      changelist.push( [d[0] , addNameExtension(checkName) ])
      d[0] = addNameExtension(checkName);
    }
    })

    return changelist;
}




function saveToZip(e,callback){
  // want to save units and others into one file,
  // then our images arrays

  var zip = new JSZip();
  zip.file("data.txt", "units="+JSON.stringify(units)+";fighterImageData="+JSON.stringify(fighterImageData));

  // save fighterImages
  images.forEach(i=>zip.file(i[0], i[1]));

  // save runemarks
  customWeapons.forEach(i=>zip.file("weapons/"+i[0], i[1]));//forEach(i=>zip.file("weapons/"+i.filename, i.image));
  customRunemarks.forEach(i=>zip.file("runemarks/"+i[0], i[1]));
  customFactions.forEach(i=>zip.file("factions/"+i[0], i[1]));

  zip.generateAsync({type:"blob"})
  .then(function(content) {
    console.log(content)
      //see FileSaver.js
      saveAs(content, "data.zip");
      callback(e);
  });
}


// pass canvas Element, fighterCard,
function saveCanvasAsImage(canvas) {

    // default call asumes current working image
    if (!canvas) canvas = fighterCard.canvas;

    // if recieved string, assume its canvas element id
    if (typeof canvas == "string")
      canvas = document.getElementById(canvas);

    if (!canvas) return;

    var element = document.createElement('a');

    element.setAttribute('href', canvas.toDataURL('image/png'));
    //TODO: adjust save file name
    element.setAttribute('download', canvas.fightercard.fighterData.name + '.png');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
} //





// when we change an image scale, or transformOrigin,
// lets update any open fightercards using that image

function updateAllCanvas(img){
  let all = document.querySelectorAll("canvas");
  all.forEach(function (c){
    if (c.fightercard && c.fightercard.image === img)
      c.fightercard.fullDraw();
  })
}


// testing function? push all open fighterCard canvass to specified or loop
// container is the outer container for a group of canvases you have
// built for gallery view of cards, but if we start duplicating canvases for
// list views should work there too
function changeAllCanvasFormat(container,newFormat){
  let all;
  if (container) {
    container = document.getElementById(container);

    if (container) all = container.querySelectorAll("canvas");
    console.log(all);
  }
  if (!container)
    all = document.querySelectorAll("canvas");

  if (all){
      all.forEach(function (c){
        if (c.fightercard){ // dealing with a fighterCard canvas

          // passed a correct format

          if (newFormat && fighterCardFormatStyles.hasOwnProperty(newFormat)){
            c.fightercard.setFormat(newFormat);

          // failed or no new format specified

          } else { //try to get next in key order
            let formatlist = Object.keys(fighterCardFormatStyles);
            let index = formatlist.findIndex((f) => f == c.fightercard.format)
            console.log(formatlist,index)
            if (index == -1 || index >= formatlist.length-1) index = 0
            else index++;
            c.fightercard.setFormat(formatlist[index]);

          }
        }
      })
      // set currentformat to first found
      //currentFormat = value? value:(all[0].fightercard?all[0].fightercard.format:0);
    }
}

// testing function? push all open fighterCard canvass to specified or loop
function changeAllCanvasStyle(container,newStyle){
  let all;
  if (container) {
    container = document.querySelectorAll(container);
    if (container) all = document.querySelectorAll("canvas");
  }
  if (!container)
  all = document.querySelectorAll("canvas");

  if (all){
      all.forEach(function (c){
        if (c.fightercard){
          if (!value)
            c.fightercard.setFormat(c.fightercard.format+1)
          else
            c.fightercard.setFormat(value);
        }
      })
      // set currentformat to first found
      currentFormat = value? value:(all[0].fightercard?all[0].fightercard.format:0);
    }
}






// mouse operations for image gallery

// finds the coords of the current clicked element within the full window
function FindPosition(e){
  if(typeof( e.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; e; e = e.offsetParent)
    {
      posX += e.offsetLeft;
      posY += e.offsetTop;
    }
      return [ posX, posY ];
    }
    else
    {
      return [ e.x, e.y ];
    }
}

function getElementClickCoordinates(e,image){
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(image);
  if (!e) var e = window.event;
  if (e.pageX || e.pageY)
  {
    PosX = e.pageX;
    PosY = e.pageY;
  }
  else if (e.clientX || e.clientY)
    {
      PosX = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      PosY = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
  PosX = PosX - ImgPos[0];
  PosY = PosY - ImgPos[1];
  PosX = Number(PosX/image.clientWidth).toFixed(2);
  PosY = Number(PosY/image.clientHeight).toFixed(2);
  return {x:PosX,y:PosY}
}



// return the transformOrigin x,y and scale directly from image values

function getImageOriginScale(image){
   let old = [.5,.5];// havent selected, assume from load we are centered
   if (image.style.transformOrigin){
       old = image.style.transformOrigin
                       .split(" ").slice(0,2)
                       .map((e)=> Number(e.replace("%",""))*.01 );
   }
   return { x:			old[0],
            y:			old[1],
            scale:	(image.style.scale? image.style.scale:1)}
}



// based on clicking element with a style scale and style.transformOrigin,
// return correct pixel position on the actual image/element

function getScaledElementClickCoordinates(e,image){
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(image);
  if (!e) var e = window.event;

  if (e.pageX || e.pageY){
    PosX = e.pageX;
    PosY = e.pageY;
  }

  else if (e.clientX || e.clientY){
      PosX = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      PosY = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
  }

  PosX = PosX - ImgPos[0];
  PosY = PosY - ImgPos[1];

  // this gives us within its DOM box 0,0 top left down to bottom right
  PosX = Number(PosX/image.clientWidth).toFixed(2); // return as percent
  PosY = Number(PosY/image.clientHeight).toFixed(2);

   let old; // get its current scale and focusOrigin

   // havent selected, assume from load we are centered
    if (!image.style.transformOrigin){
        old = [.5,.5];
    }else{
        old = image.style.transformOrigin
                        .split(" ").slice(0,2)
                        .map((e)=> Number(e.replace("%",""))*.01 );
    }

    let scale = (image.style.scale? image.style.scale:1);

    // Here comes some viewport magic!

    // find starting point image pixel to 0,0 window
    old[0] -= old[0]/scale;	// imagine scale 1 anywhere, old value goes to 0
    old[1] -= old[1]/scale;	// otherwise scale 2 at 50 50. middle zoom means 0,0 is image 25 25

    // Now we want add our clicked x,y percent, scaled down in range
    // (window shows image region width of 100%/scale)
    PosX = old[0] + (PosX/scale);
    PosY = old[1] + (PosY/scale);

  return {x:PosX,y:PosY}
}



// when a fightercard in the gallery is clicked

function fighterCardsSelectedSwitch(canv,e){

		// check what we want to do from fighterCards_input controls
		// fighterCards_input controls are using my radB functions
		let select = getRadB("fighterCards_input");

		if (select){
			switch(select){

				case "focus": // get percentage location of window/image
					saveCanvasAsImage(canv);
				break;

				case "add": //
        fighterCardLoad(canv.fightercard.fighterData);
        editorControlsReset();
        fighterCard.fullDraw();
        messages.add("Now editing "+canv.fightercard.fighterData.name,"success");
        break;

				case "delete": console.log("delete fc");
					if (confirm("Really delete this fighterCard?")){

              let i = fighterCards.findIndex((fc)=> fc === canv.fightercard);
              if (i>=0)   fighterCards.splice(i,1);

              i = units.findIndex((u) =>u === canv.fightercard.fighterData);
              if (i>=0)   units.splice(i,1);

              canv.parentNode.removeChild(canv);
              messages.add("successfully deleted fighter card","success");
          }
			    break;

				default: break;
			}
		}
}

// when an image in the gallery is clicked

// tied to the gallery controls found at gallery_input
// we can do things like add to card, delete image, open it for scrolling etc.
function galleryImageSelectedSwitch(img,e){

		// check what we want to do from gallery controls
		// gallery controls are using my radB functions
		let select = getRadB("gallery_input");

		if (select){
			switch(select){

				case "focus": // get percentage location of window/image
					let pos = getScaledElementClickCoordinates(e,img);
					// set style zoom point where scale roller focuses on :85% 10%
					img.style.transformOrigin = (pos.x*100)+"%"+(pos.y*100)+"%";
          fighterImageData[img.title].x = pos.x;
          fighterImageData[img.title].y = pos.y;
          updateAllCanvas(img)
				break;

				case "add":
        fighterCard.setFighterImage(img);
        fighterCard.fullDraw();
        messages.add("added image to editor","success");
        break;

				case "delete": console.log("delete",img);
					if (confirm("Really delete this image?")){
            	img.parentNode.parentNode.remove();

              let index = images.findIndex((i)=> i[0] == img.title)
              if (index>=0) images.splice(index,1);

              if (fighterImageData[img.title])
                delete fighterImageData[img.title];

              messages.add("successfully deleted image","success");
          }
				break;


				default: console.log("none");
			}
		}
}

// the image gallery has event listeners for clicking (goes through a switch func.)
// and a wheel scroll function
function addGalleryImageListeners(imgBox, image){
  // inner div
	let inner = imgBox.firstElementChild;
	// img
	let img = imgBox.getElementsByTagName('img')[0];

	// Listener 1
	// click inner image
	// depending on gallery option, either focus, add to fighterCard, delete etc.

			img.addEventListener('click', function(e){
					galleryImageSelectedSwitch(img,e)
			});

	// Listener 2
	// scroll wheel on img container element
	/// allow mousewheel to zoom image in and out

			inner.addEventListener('wheel', function(e){
				e.preventDefault();

          // lets disallow scrolling without choosing to focus
          if (getRadB("gallery_input")!="focus") return;

					 // first time? let's set default
						if (!img.style.scale) img.style.scale = 1;

						let val = 0.2;	// increment, then reuse val for change

						// scroll in or out?
						if (e.deltaY>0)
							val*=-1;
						val = Number(img.style.scale) + val;

						// still in bounds, change it
						if (val>0.1 && val<50){	// min and max accepted
    						img.style.scale = val;
                fighterImageData[img.title].scale = val;
                updateAllCanvas(img)
            }
				});
}

// loading and placing factions/runemarks from file or load
// into selectable radB groupings
function addImageToRadB(image, value, group){
    if (typeof group == "string" )
      group = document.getElementById(group);

    if (!group) return; // passed bad group

    var img = document.createElement('img');
    img.title = value;
    img.src = image;
    group.appendChild(img);
    return img;
}


/* when we want to load a custom image for any sort of small rune, call this with values:
 *  files - retrieved from input (untested for multiple file select)
 *  buttonDivId - single string or array of id's for runemark selection gallaries to make buttons for it
 *  customArray  - where we want to keep track of newly loaded buttons, to save to package and hold
 *  typeName, prefix - user friendly name to prompt user about, and prefix is for arbitrary id prefix when
 *                    adding id's to buttons to avoid problems finding unique id's
 */

function loadNewRunemark(files, buttonDivId, customArray, typeName, prefix){
  if (!files) return;
  // get the dom elements for the buttonDivId's (user clicking grids container div)
  var groups = [];
  if (Array.isArray(buttonDivId)){ // lets cover where a loaded rune goes in several radB galleries
    buttonDivId.forEach((bd,i) => groups[i] = document.getElementById(bd))
  }else{
      groups[0] = document.getElementById(buttonDivId);
  }
  //process multiple files?
  for (i = 0; i < files.length; i++) {
    // filename[0] and extension[1]. we poll user for new name, but keep the extension for later saving
    let names = getNameExtension(files[i].name);

    do {  // keep asking for name till one works?
      names[0] = prompt("Please name "+typeName+" for :"+ names[0]+" :", names[0]);
      if (customArray.find(f => f[0] == addNameExtension(names))){
        messages.add(typeName + " already exists with name "+name[0],"error");
      }else{
        break;
      }
    } while (1)//(customArray.find(f => f[0] == addNameExtension(names)) );

    if (names[0] == null) return;

    let imageURL = URL.createObjectURL(files[i])
    let image;
    // create and add to multiple button groups as passed in buttonDivId stored in groups
    groups.forEach(group => {
      image = addImageToRadB(imageURL, names[0], group);
        if (image)
      // set id to its ideal filename of 'actual faction name'.existing extension
          image.id = prefix + names[0];
    });

    //save the file with extension somewhere
    customArray.push([addNameExtension(names),files[i]]);
    messages.add("successfully added "+typeName +" "+names[0],"success");
  }
}

function onFactionRunemarkFileSelect(input) {
    loadNewRunemark(input.files,"factionRunemarkSelect", customFactions, "faction", "fr:");
}

function onTagRunemarkFileSelect(input) {
  loadNewRunemark(input.files,"tagRunemarkSelect", customRunemarks, "runemark", "rn:");
}

function onWeaponRunemarkFileSelect(input){
  loadNewRunemark(input.files,["weaponRunemarkSelect0","weaponRunemarkSelect1"], customWeapons, "weapon type", "wr:");
}
