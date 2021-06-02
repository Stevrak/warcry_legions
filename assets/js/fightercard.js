/**
*
*   fightercard is a class representing a single fightercard
*   it manages the fighterdata for that fighter and the canvas element shown in html
*
*   We also keep fighterCardFormatStyles  and fighterCardLocations information on the various formats and styles of the different cards
*/

// card formats/styles and their different background/runemark images
const fighterCardFormatStyles = { large:{ // 0 is large size, with several formats
                                  dark:{bkfar:$("#large-dark-far")[0], bknear:$("#large-dark-near")[0],
                                        runecircle:$("#circle-clean")[0], weapons:[$("#weapon-profile")[0],$("#weapon-profile")[0]]},
                                  fire:{bkfar:$("#large-fire-far")[0], bknear:$("#large-fire-near")[0],
                                        runecircle:$("#circle-clean")[0], weapons:[$("#weapon-profile")[0],$("#weapon-profile")[0]]},
                                  light:{bkfar:$("#large-light-far")[0], bknear:$("#large-light-near")[0],
                                        runecircle:$("#circle-clean")[0], weapons:[$("#weapon-profile")[0],$("#weapon-profile")[0]]},
                                },  // 1 is my alt size, which is in books for monsters thralls and new books
                                small:{
                                  book:{ bkfar:$("#small-book-far")[0], bknear:$("#small-book-near")[0],
                                          runecircle:$("#circle-texture-white")[0],factioncircle:$("#circle-texture-black")[0],
                                          weapons:[null,$("#weapon-profile-book")[0]]}
                              },  // list style
                                list:{
                                  fire:{ bkfar:$("#list-fire-far")[0], bknear:$("#list-near")[0], runecircle:$("#circle-texture-white")[0],
                                         weapons:[null,$("#weapon-profile-list")[0]] },
                                  book:{ bkfar:$("#list-book-far")[0], bknear:$("#list-near")[0], runecircle:$("#circle-texture-white")[0],
                                          weapons:[null,$("#weapon-profile-list")[0]] },

                                        } }

/*
 * locations within card formats to draw text/runes, etc
 * also can used in  proposed advanced editor to check click regions
 *
 */
const fighterCardLocations = {large:{  //  large format
                                dimensions:{width:1772,height:1241},  // assumed max size (so bkImgs can have different reds)
                                options:{name:[ {x: 800, y: 20, height:70},
                                                {x: 800, y: 15, height:30},
                                                {x: 15, y: 10, height:20}]},
                                namestyle:{color:"black", characters:20},
                                movement:{x: 220, y: 391,scale:40},
                                toughness:{x: 545, y: 391, scale:40},
                                wounds:{x: 400, y: 510,scale:40},
                                cost:{x: 805, y: 160,scale:40},
                                fighterImage:{x:1386, y:500,boxWidth:.3},
                                weapon:[{start:[{x:50,y:800}, //when 1 only
                                                {x:50,y:750}],// when 2
                                          background:{x:0,y:0,scale:1}, // weap 1
                                          runemark:{x:80,y:80,size:130},
                                          range:{x:248,y:133,scale:70},
                                          attacks:{x:428,y:133,scale:40},
                                          strength:{x:614 ,y:133,scale:40},
                                          damage:{x:778,y:133,scale:40}},
                                        { start:{x:50,y:950},
                                        background:{x:0,y:0,scale:1}, // weap 1
                                        runemark:{x:80,y:80,size:130},
                                        range:{x:248,y:133,scale:70},
                                        attacks:{x:428,y:133,scale:40},
                                        strength:{x:614 ,y:133,scale:40},
                                        damage:{x:778,y:133,scale:40}}],
                                factionrunemark:{x:162,y:162,scale:5,size:175},
                                runemarks:[ {x:655, y:630,bgsize:160, scale:4,size:130},
                                            {x:830, y:630,bgsize:160, scale:4,size:130},
                                            {x:742.5, y:480,bgsize:160, scale:4,size:130}]
                              },small:{ //small
                                dimensions:{width:443,height:192},  // assumed max size (so bkImgs can have different reds)
                                statstyle:{height:20,color:"black"},
                                movement:{x:327 ,y:160},
                                toughness:{x:375 ,y:160,scale:40},
                                wounds:{x:408 ,y:160,scale:40},
                                cost:{x:405, y:40,scale:40},
                                fighterImage:{x:365, y:99,boxWidth:.25},
                                weapon:[{ start:{x:16, y:58},
                                          runemark:{x:25,y:36,size:40},
                                          range:{x:72,y:48,scale:23},
                                          attacks:{x:117,y:48,scale:23},
                                          strength:{x:164 ,y:48,scale:23},
                                          damage:{x:208,y:48,scale:23}},
                                        { start:{x:16, y:58},
                                          background:{x:0,y:0,scale:1}, // weap 2
                                          runemark:{x:25,y:90,size:40},
                                          range:{x:72,y:105,scale:23},
                                          attacks:{x:117,y:105,scale:23},
                                          strength:{x:164 ,y:105,scale:23},
                                          damage:{x:208,y:105,scale:23}}],
                                factioncircle:{x:320,y:40,size:55},
                                factionrunemark:{x:320,y:40,size:45},
                                runemarks:[ {x: 272, y: 75, bgsize:40,size:30},
                                            {x: 272, y: 118, bgsize:40,size:30},
                                            {x: 272, y: 161, bgsize:40,size:30}],
                                name:[ {x: 15, y: 20, height:30},
                                       {x: 15, y: 10, height:24},
                                       {x: 15, y: 10, height:15}]
                              },list:{ // list
                                dimensions:{width:1772,height:300},
                                statstyle:{height:80,color:"black"},
                                wounds:{x:1148 ,y:224},
                                movement:{x:842 ,y:224},
                                toughness:{x:1023 ,y:224},
                                cost:{x:224, y:220},
                                weapon:[{ start:[{x:1218, y:139},
                                                 {x:1218,y:10}],
                                          runemark:{x:58,y:84,size:90},
                                          range:{x:170,y:113,scale:55},
                                          attacks:{x:278,y:113,scale:55},
                                          strength:{x:378 ,y:113,scale:55},
                                          damage:{x:486,y:113,scale:55}},
                                        { start:{x:1218, y:10},
                                          background:{x:0,y:0,scale:1}, // weap 2 238y
                                          runemark:{x:58,y:207, size:90},
                                          range:{x:170,y:238,scale:55},
                                          attacks:{x:278,y:238,scale:55},
                                          strength:{x:378 ,y:238,scale:55},
                                          damage:{x:486,y:238,scale:55}}],
                                factionrunemark:{x:85,y:218,scale:4,size:120},
                                runemarks:[ {x:360,y:218,bgsize:140, scale:3,size:90},
                                            {x:512,y:218,bgsize:140, scale:3,size:90},
                                            {x:658,y:218,bgsize:140, scale:3,size:90} ],
                                namestyle:{color:"white", characters:23,height:50},
                                name:[ {x: 10, y: 30, height:90},
                                       {x: 15, y: 10, height:70},
                                       {x: 15, y: 10, height:50}]
}}


class Fightercard {

  constructor(canvas, fighterData, format=undefined,style=undefined){

    // either canvas is internal or referenced, it redraws when vars changed
    // user could choose to move the canvas around the DOM, or setCanvas()
    // to swap our ref canvas and draw there
    this.canvas = (canvas? canvas : document.createElement('canvas'))

    this.format = format?format:Object.keys(fighterCardFormatStyles)[0];

    this.style= style?style:Object.keys(fighterCardFormatStyles[this.format])[0];

    // buffer for drawing the background and fighter image
    this.canvas_buffer = document.createElement('canvas');
    this.canvas_buffer.width = this.FCLocation.dimensions.width; // fighterCardFormatStyles[this.format][this.style].bkfar.width;
    this.canvas_buffer.height = this.FCLocation.dimensions.height; // fighterCardFormatStyles[this.format][this.style].bkfar.height;
    //issue here with small sizes looking like crap: we keep this.FCLocation.dimensions as a reference to max size for other locations
    // but if its too small we need to get the width/height to show the player elsewhere, maybe multiple at some threshhold
    this.canvas_buffer.width = Math.max(1200,this.FCLocation.dimensions.width); // fighterCardFormatStyles[this.format][this.style].bkfar.width;
    this.canvas_buffer.height = (this.FCLocation.dimensions.height/this.FCLocation.dimensions.width)*this.canvas_buffer.width;

    this.fighterData = fighterData;
    // if this returns null, no biggie, drawImage function checks on draw
  //  this.image = document.getElementById(fighterData.fighterImage);

    this.factionRunemark = undefined;

    // we should find its runemarks here from page crossreferenced with fighterData
    this.tagRunemarks = [];


    // and its weapon runemarks from page crossreferenced with fighterData
    this.weaponRunemarks = [];

    this.linkImageRunemarks();
    this.fixAspect();
    this.fullDraw();

    // unnessessary //////////////////////
    // good for testing drawing functionality
    // scale up and down the size of the card
    this.canvas.fightercard = this;

    this.canvas.onclick = function(e){
       if (!e.target.fightercard.big){
       e.target.width *=2;
       e.target.fightercard.fixAspect();
       e.target.fightercard.big = true;
     }else{
       e.target.width /=2;
       e.target.fightercard.fixAspect();
       e.target.fightercard.big = false;
     }
     e.target.fightercard.fullDraw();
    }
    /////////////////////////////////////

} // END CONSTRUCTOR

// connect all the runes and fighter images to the dom elements loaded for them
// call again if something changed
linkImageRunemarks(){
    if (this.fighterData.runemarks){
      this.fighterData.runemarks.forEach((f,i)=>{
        let r = document.getElementById("rn:"+f);
        if (r) this.tagRunemarks[i] = r;
        else this.tagRunemarks[i] = null; // something deleted, remove reference
      })
    }
    if (this.fighterData.faction){
        let r = document.getElementById("fr:"+this.fighterData.faction);
        if (r) this.faction = r;
        else this.faction = null; // perhaps we should alert and/or set some default value?
      }
    if (this.fighterData.imageName){
       let r = document.getElementById("gz:"+this.fighterData.imageName);
        if (r) this.image = r;
      }

    if (this.fighterData.weapons){
      this.fighterData.weapons.forEach((f,i)=>{
        if (f.runemark){
          let r = document.getElementById("wr:"+f.runemark)
          if (r) this.weaponRunemarks[i] = r;
        }
      })
    }
}


// set width and height
// for canvas

fixAspect(){
  let r = this.FCLocation.dimensions;//.width;this.getFormatStyle().bkfar;
  let aspect = r.height/r.width;
  this.canvas.height = this.canvas.width * aspect;
}

  /*
  *   getter functions
  *
  *   Not really a fan of the 'get variable' format for getters/setters
  *   so just stick with getVariable format
  */

  getFighterData(){
    return this.fighterData;
  }

  getCanvas(){
    return canvas;
  }

  getSize(){
    return {width:this.canvas.width, height:this.canvas.height};
  }

  getStyle(){
    return this.style;
  }

  getFormatName(){
    return this.format;//fighterCardFormats[this.format];
  }

  getFormatStyle(){
    return fighterCardFormatStyles[this.format][this.style];
  }

  getStyles(){
      return Object.keys(fighterCardFormatStyles[this.format]);
  }

  get context(){
      return this.canvas.getContext("2d");
  }

  // get the appropriate location object for drawing coords
  // of the various stats and runemarks
  get FCLocation(){
    return fighterCardLocations[this.format];
  }

  getWeaponActive(index){
    // hard cap on 2 weapons (0,1)
    if(index<0 || index>1) return;
    // doesn't exist
    if (!this.fighterData.weapons[index])
      this.fighterData.weapons[index] = {range:1, attacks:3, strength:3, damage:1, critical:3, active:false};

    return this.fighterData.weapons[index].active;
  }

  getColor(){
      return this.fighterData.color;
  }


  /*
  *   set functions
  *
  *
  */

  set wounds(w){
    this.fighterData.wounds = w;
    this.draw();
  }
  set toughness(w){
    this.fighterData.toughness = w;
    this.draw();
  }
  set movement(w){
    this.fighterData.movement = w;
    this.draw();
  }
  set name(w){
    this.fighterData.name = w;
    console.log("changed name",w);
    this.draw();
  }

  setColor(r,g,b){
    this.fighterData.color = {r:r,b:b,g:g};
    this.fullDraw();

  }
  clearColor(){
    delete this.fighterData.color;
    this.fullDraw();
  }

  setFighterImage(i){
    this.image = i;
    this.fighterData.imageName = i.title;
  }

  // we want to pass an actual image Element
  // we can actually push it straight to draw this way
  // the standard runemarks are static html in fighters/fighterRunemarkSelect...html
  // and the element.title contains the string of the name we will save for data
  // when loaded from file we perform a lookup on id value

  // when we deal with players custom factions, we can build these image elements first
  // when loaded, before we generate fighterCards

  set faction(newElement){
    // lets assume for now (quickest way)
    // we have the img element. can adjust fighterdata and
    // output here
    if (newElement){
      this.factionRunemark = newElement; // for drawing
      this.fighterData.faction = newElement.title;// breaks for custom without
    }

    //user input there (will need stronger custom uploader with title)

    this.draw();
  }


  // format is big, small, list, other formats we want to add
  // as cards in the future (can be different size, backdrop, stat placements etc.)
  // format is kept as a number, indexing our format/style/locations arrays

  setFormat(newFormat){
    this.setFormatAndStyle(newFormat);
  }


  // style defines different backdrops for each format
  // style is kept as a string for whatever names describe the style

  setStyle(newStyle){
    this.setFormatAndStyle(undefined,newStyle);
  }


  // when set, we wish to adjust the size to the new backdrop
  // regardless of the backdrops width/height, our drawing functions scale appropriately

  setFormatAndStyle(newFormat=undefined,newStyle=undefined){

    // either format or style has been altered
    if (this.__setFormatAndStyle(newFormat,newStyle)){
        this.canvas.width = this.FCLocation.dimensions.width;//this.getFormatStyle().bkfar.width;
        this.canvas.height = this.FCLocation.dimensions.height;//this.getFormatStyle().bkfar.height;
        this.canvas.width = Math.max(1200,this.FCLocation.dimensions.width); // fighterCardFormatStyles[this.format][this.style].bkfar.width;
        this.canvas.height = (this.FCLocation.dimensions.height/this.FCLocation.dimensions.width)*this.canvas.width;
        this.fullDraw();
    }
  }


  // performs all logic for above Format or style only calls
  // we check bounds and styles exist or not, otherwise choose
  // defaults based on whats avaliable within a format/style group

  __setFormatAndStyle(newFormat=undefined,newStyle=undefined){
      let change = 0; //return if a change was made so we can adjust the canvas or redraw (above)

      // we are being asked to change format
      if (newFormat){
          // need to change?
          if (this.format != newFormat){
              this.format = newFormat; change = 1;
          }
      }

      // change style or check style still correct
      if (newStyle || change == 1){
          // either case, work with same variable
          if (!newStyle) newStyle = this.style;

          // style is incorrect for our format, get first avaliable
          if(!fighterCardFormatStyles[this.format].hasOwnProperty(newStyle))
            newStyle = Object.keys(fighterCardFormatStyles[this.format])[0];
          // did style change, flag change was made and set to new valid style?
          if (newStyle != this.style){
            change = 1;
            this.style = newStyle;
          }
      }
      return change;
  }

  setFighterData(newData){
    this.fighterData = newData;
    this.fullDraw();
  }

  setCanvas(canvas){
    this.canvas = canvas;
    this.canvas.width = this.FCLocation.dimensions.width;//fighterCardFormats[this.format].bkfar.width;
    this.canvas.height = this.FCLocation.dimensions.height;//fighterCardFormats[this.format].bkfar.height;
    this.fullDraw();
  }

  // pass weapon index 0,1 and boolean isactive status
  // to activate or not, the appropriate weapon
  setWeaponActive(index,active){
    // hard cap on 2 weapons (0,1)
    if(index<0 || index>1) return;
    // doesn't exist
    if (!this.fighterData.weapons[index])
      this.fighterData.weapons[index] = {range:1, attacks:3, strength:3, damage:1, critical:3, active:false};

      this.fighterData.weapons[index].active = active;

    this.draw();
  }

  // pass the image element (with its name in img.title) to populate
  // fightercard display and fighterData weapon runemark(string)
  setWeaponRune(img, index){
    // hard cap on 2 weapons (0,1)
    if(index < 0 || index > 1) return;

    this.weaponRunemarks[index] = img;
    this.fighterData.weapons[index].runemark = img.title;
    this.draw();
  }


  // fightercard keeps an array of imageElements refs [0,1,2]
  // and fighterData keeps the tagNames stored in array for saving
  // return boolean if a change was made
  toggleTagRunemark(img){
    if (img.tagName!="IMG") return false;

    let index = this.tagRunemarks.findIndex((t) => t === img);

    // exists, lets toggle off
    if (index>=0){
        this.tagRunemarks.splice(index,1);
        this.fighterData.runemarks.splice(index,1);

        // leader is special
        if (img.title == "Leader") this.fighterData.leader = false // remove leader

        this.draw();
        return true;

    // runemark isn't on yet
    }else if(this.tagRunemarks.length<3){
        this.tagRunemarks.push(img);
        this.fighterData.runemarks.push(img.title);
        if (img.title == "Leader") this.fighterData.leader = true; // remove leader
        this.draw();
        return true;

    }else{// no room to add
        return false; // signal new state
    }
  }


/*
*   drawing functions
*
*/
  // determines what needs redrawing and calls
  // drawImages and drawData as nessessary to make use
  // of buffers, preventing flicker

  fullDraw(){
    //draw everything!
    this.drawImages();

    this.saveBuffer();
    this.drawData();
  }

  // just draw our existing buffer
  // and redraw stats/runes
  draw(){
    this.clearCanvas();
    this.drawBuffer();
    this.drawData();
  }

  // clear the whole canvas
  clearCanvas(){
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // clear area around canvas walls to allow fancy
  // backgrounds with scroll-like png  transparencies
  // to have clear edges (default width in percentage of whole width)
  cropCard(thickness=this.canvas.width*0.05) {
    let ctx = this.context;
    let s = {x: thickness, y: thickness};
    let e = {x: this.canvas.width-thickness,
                                      y: this.canvas.height-thickness};
    ctx.clearRect(0, 0, this.canvas.width, s.y);// top
    ctx.clearRect(0, 0, s.x, this.canvas.height);// left
    ctx.clearRect(e.x,0, this.canvas.width, this.canvas.height);// right
    ctx.clearRect(0, e.y, this.canvas.width, this.canvas.height); // bottom
  }


  // this draws our background and user picture to canvas
  // I have split this from drawData, to help with flicker
  // and we use a buffer from here to backup these drawn items
  // and copy from when we only need to draw data.

  drawImages(){
    this.clearCanvas();
    this.drawFarBackground();

    this.drawfighterImage();
    if (this.getFormatName()== "small")
      this.cropCard();

    this.drawNearBackground();

  }



  // draw the buffer contents to the canvas

  drawBuffer(){
    this.context.drawImage(this.canvas_buffer,0,0,
                        this.canvas.width,this.canvas.height);
  }


  // backup what is on canvas to our buffer

  saveBuffer(){
    if (this.canvas.width!=this.canvas_buffer.width || this.canvas.height!=this.canvas_buffer.height)
    this.canvas_buffer.width = this.canvas.width; this.canvas_buffer.height = this.canvas.height;
    //console.log("save buffer");
    this.canvas_buffer.getContext('2d').drawImage(
                              this.canvas,0,0,this.canvas.width,
                              this.canvas.height);
  }


  // draw all the runemarks, text fields, stat values for the fighter

  drawData(){

    this.drawFactionRunemark(this.fighterData.factionRunemark);
    this.drawTagRunemarks();
    this.drawFighterName();
    this.drawStats();
    this.drawWeapons();
  }



// data drawing includes runemarks?, name stats etc.

drawFactionRunemark(){
  if (!this.fighterData.faction) return;
  this.context.fillStyle = "white";

  let fc = this.FCLocation;

  if (this.getFormatName() == "small"){
    // draw additional background circle first
    let bg = this.getFormatStyle().factioncircle;//$("#circle-alt")[0];
    let position = this.scalePixelPosition(fc.factioncircle);
    let size = this.scalePixelPosition({x: fc.factioncircle.size, y: fc.factioncircle.size});
    position.x -= (size.x/2)
    position.y -= (size.y/2)
    this.context.drawImage(bg, position.x, position.y, size.x, size.y);
  }

  // check and store the actuall image we will use so we arent looking
  // up through document each time
  if (!this.factionRunemark){ //not stored

    // get image through the pre-loaded gallery
    let img = document.getElementById("factionRunemarkSelect");
    if (img) img = img.getElementsByTagName('img');
      //stored in the title!!! gotta find manually...
      for(let i = 0;i<img.length;i++){
        if(img[i].title == this.fighterData.faction){
          this.factionRunemark = img[i]; break;
        }
      }
    }
    if (!this.factionRunemark) return;
    //draw it
    let pos = this.scalePixelPosition(fc.factionrunemark);
    let size;
    if (this.factionRunemark.naturalWidth > this.factionRunemark.naturalHeight)
          size = this.scalePixelPosition({x: fc.factionrunemark.size,
                                          y: fc.factionrunemark.size * (this.factionRunemark.naturalHeight/this.factionRunemark.naturalWidth) });
    else
          size = this.scalePixelPosition({x: fc.factionrunemark.size * (this.factionRunemark.naturalWidth/this.factionRunemark.naturalHeight),
                                          y: fc.factionrunemark.size });


  //  let size = this.scalePixelPosition({x:this.factionRunemark.naturalWidth*pos.scale,
    //                                    y:this.factionRunemark.naturalHeight*pos.scale});
    //let size = this.scalePixelPosition({x: fc.factionrunemark.size,
    //                                    y: fc.factionrunemark.size *(this.factionRunemark.naturalHeight/this.factionRunemark.naturalWidth)});

    //let boxWidth = this.canvas.width*format.boxWidth;
  //  let boxHeight = (img.height/img.width)*boxWidth;



    pos.x -=(size.x/2)
    pos.y -=(size.y/2)
    this.context.drawImage(this.factionRunemark, pos.x, pos.y, size.x, size.y);
}


drawTagRunemarks(){
  if (!this.fighterData.runemarks) return;
  //var positions = [{x: 1025, y: 230}, {x: 1025, y: 398}, {x: 1025, y: 576}];
   let img = this.getFormatStyle().runecircle; //background
   let fc = this.FCLocation;
   let position,size;
      for (let i = 0; i < this.fighterData.runemarks.length; i++) {
        if (img && img.complete){
          // draw the background circle
            position = this.scalePixelPosition(fc.runemarks[i]);
            size = this.scalePixelPosition({x: fc.runemarks[i].bgsize, y: fc.runemarks[i].bgsize});
            // center it at position
            position.x -= (size.x/2)
            position.y -= (size.y/2)
            this.context.drawImage(img, position.x, position.y, size.x, size.y);
          }
            // check for then draw runemark
            if (this.tagRunemarks[i] && this.tagRunemarks[i].complete){
              position = this.scalePixelPosition(fc.runemarks[i]);
            if (fc.runemarks[i].naturalWidth > fc.runemarks[i].naturalHeight)
                  size = this.scalePixelPosition({x: fc.runemarks[i].size,
                                                  y: fc.runemarks[i].size * (this.tagRunemarks[i].naturalHeight/this.tagRunemarks[i].naturalWidth) });
            else
                  size = this.scalePixelPosition({x: fc.runemarks[i].size * (this.tagRunemarks[i].naturalWidth/this.tagRunemarks[i].naturalHeight),
                                                  y: fc.runemarks[i].size });
              // center it at position
              position.x -=(size.x/2)
              position.y -=(size.y/2)
              this.context.drawImage(this.tagRunemarks[i], position.x, position.y, size.x, size.y);
            }
      }
  }



// the fightername on the small card has a certain sizing we want to recreate, even up to 3 lines long

cropFighterName(name, length){
    let names = []; //array of lines to break to
    let add = '', jump = 0; // if add is whether include dash, jump avoids useless spaces
      while(name.length > length){
        let i = length;
        add = ''; jump = 0;
        while( i>0 && name[i]!=' ' && name[i]!='-') i--;
        if (i == 0){ i = length; add = '-';}
        if (name[i] == ' ') jump = 1;
        names.push(name.slice(0,i)+add);
        name = name.slice(i+jump)
      }
      names.push(name);
      return names;
  }

/*  // WORKING
*/

getScaleFactor(canvas,backimage) {
      return {
        x: canvas.width / backimage.width,
        y: canvas.height / backimage.height
      };
  }

  scalePixelPosition(pixelPosition,scaleFactor) {
      if (!scaleFactor) scaleFactor = this.getScaleFactor(this.canvas,this.FCLocation.dimensions);//this.getFormatStyle().bkfar);
      var scaledPosition = {x: pixelPosition.x * scaleFactor.x,
                            y: pixelPosition.y * scaleFactor.y,
                            scale:(pixelPosition.scale?pixelPosition.scale:1)};
      return scaledPosition;
  }


// scale then write text, sized to canvas (starting coords based on bg dimensions)
writeScaled(value, pixelPos) {
    var scaleFactor = this.getScaleFactor(this.canvas, this.FCLocation.dimensions);//this.getFormatStyle().bkfar);
    var scaledPos = this.scalePixelPosition(pixelPos,scaleFactor);
    this.writeValue(this.context, value, scaledPos, scaleFactor);
}

writeValue = function(ctx, value, pos, scaleFactor) {
    pos = {x: pos.x / scaleFactor.x, y: pos.y / scaleFactor.y };

    ctx.save();
    ctx.scale(scaleFactor.x, scaleFactor.y);
    ctx.fillText(value, pos.x, pos.y);
    ctx.restore();
}

// works with addKerning modification ive made to combine my adjusted scaling systm
writeScaledKerning(value, pixelPos,spacing) {
    var scaleFactor = this.getScaleFactor(this.canvas, this.FCLocation.dimensions);// this.getFormatStyle().bkfar);
    var pos = this.scalePixelPosition(pixelPos,scaleFactor);

    //var scale = this.getScaleFactor(this.canvas, this.getFormatStyle().bkfar);
    pos = {x: pos.x / scaleFactor.x, y: pos.y / scaleFactor.y };

    this.context.save();
    this.context.scale(scaleFactor.x, scaleFactor.y);
    this.context.renderText(value, pos.x, pos.y, spacing);
    this.context.restore();
}

/*
 *   write the fighters name in the format of the smaller card in the books
 */
drawFighterName(){

    // if we dont care to write the name for this format
    if (!this.FCLocation.name) return;

    let fc = this.FCLocation;

    // defaults
    let color = "white";
    let font = "SinaNovaReg";
    let characters = 16;
    // if there are styles (color,font)
    if (fc.namestyle){
      if(fc.namestyle.color) color = fc.namestyle.color;
      if (fc.namestyle.font ) font = fc.namestyle.font;
      if (fc.namestyle.characters ) characters = fc.namestyle.characters;
    }

    // split the name onto multiple lines
    let name = this.cropFighterName(this.fighterData.name.toUpperCase(),characters);

    // clone the location data for name (based on how many lines, format changes 0-2)
    let xyscale = {...this.FCLocation.name[Math.min(name.length-1,2)]};

    let height = xyscale.height;

    let ctx = this.context;
    ctx.save();
    ctx.font = ""+ height + "px "+ font;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
  for(let i = 0; i<name.length;i++){
      this.writeScaledKerning(name[i], xyscale, 4);
      xyscale.y += (height);
    }

    ctx.restore();
  }

// draw wounds, move, toughness, points

drawStats(){

  // small version

  let fighterData = this.fighterData;
  let c = this.context;
  let canv = this.canvas;
  let scale = this.getScaleFactor(canv,this.FCLocation.dimensions);//this.getFormatStyle().bkfar)
  let fc = this.FCLocation;
  if (fc.statstyle){
        let sizefont = ""
        fc.statstyle.color ? c.fillStyle = fc.statstyle.color: c.fillStyle = "white";
        fc.statstyle.height ? sizefont = fc.statstyle.height+"px ": sizefont = "92px ";
        fc.statstyle.font ? sizefont += c.statstyle.font: sizefont +="rodchenkoctt";
        c.font = sizefont;
  } else{
        c.fillStyle = "white";
        c.font = "92px rodchenkoctt";
  }

  c.textBaseline = "middle";
  c.textAlign = "center";
  this.writeScaled(fighterData.movement, fc.movement, fc.movement.scale);         // move
  this.writeScaled(fighterData.wounds, fc.wounds, fc.wounds.scale);       // wounds

  c.textBaseline = "middle";
  c.textAlign = "right";
  this.writeScaled(fighterData.toughness, fc.toughness, fc.toughness.scale);    // toughness

  c.textBaseline = "middle";
  c.textAlign = "center";

  c.fillStyle = "white";
  this.writeScaled(fighterData.cost, fc.cost, fc.cost.scale);    // point cost
}

/// WEAPON BLOCK START /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

drawWeapons(){
  var bkimage = this.getFormatStyle().weapons; // already array
  var c = this.context;


  // shove 0 then 1 into quick variable, player can have 0 inactive
  // and it shows weapon 1 (2nd) as first
  var weaponData = [];
  var weaponRune =[];
  if (this.fighterData.weapons && this.fighterData.weapons[0].active == true){
      weaponData.push(this.fighterData.weapons[0]);
      weaponRune.push(this.weaponRunemarks[0]);
  }
  if (this.fighterData.weapons[1] && this.fighterData.weapons[1].active == true){
      weaponData.push(this.fighterData.weapons[1])
      weaponRune.push(this.weaponRunemarks[1]);
    }

  // check each weapon (TODO realized my weapon back image formatting needed both drawn before either text/runes)
  // so repetitive starting loop; one for image, one for text/runemarks
  for (let i = 0; i < weaponData.length; i++) {
      let fc = this.FCLocation.weapon;
      let pos,size,start;
      let ths = this;
      // we have the issue that 2 weapons alters placement of first weapon
      // so in case if fc[0].start is array of 2 objects, fc[i].start[1] is alternate start location
      if (Array.isArray(fc[i].start)){
        if (weaponData.length == 2) start = fc[i].start[1];
        else start = fc[i].start[0];
      }else{
        start = fc[i].start;
      }

      // draw the background picture
      if (bkimage[i]){
        if(bkimage[i].complete){
            pos = this.scalePixelPosition(this.addPositions(start,{...fc[i].background}));
            size = this.scalePixelPosition({x:fc[i].background.scale * bkimage[i].width,
                                            y:fc[i].background.scale * bkimage[i].height});

              c.drawImage(bkimage[i], pos.x, pos.y, size.x, size.y);
        }else{
          bkimage[i].addEventListener('load',function(){ths.draw()},{once:true});
        }
      }
    }

    // loop 2 for runes/text
    for (let i = 0; i < weaponData.length; i++) {
        let fc = this.FCLocation.weapon;
        let pos,size,start;
        let ths = this;
        // we have the issue that 2 weapons alters placement of first weapon
        // so in case if fc[0].start is array of 2 objects, fc[i].start[1] is alternate start location
        if (Array.isArray(fc[i].start)){
          if (weaponData.length == 2) start = fc[i].start[1];
          else start = fc[i].start[0];
        }else{
          start = fc[i].start;
        }


      // draw the icon (top-left origin) or set its load to redraw
      if (weaponRune[i]){
        if(weaponRune[i].complete){
            pos = this.scalePixelPosition(this.addPositions(start,{...fc[i].runemark}));
            //size = this.scalePixelPosition({x: fc[i].runemark.scale * weaponRune[i].naturalWidth,
                                        //    y: fc[i].runemark.scale * weaponRune[i].naturalHeight});
            if (weaponRune[i].naturalWidth > weaponRune[i].naturalHeight)
                  size = this.scalePixelPosition({x: fc[i].runemark.size,
                                                  y: fc[i].runemark.size * (weaponRune[i].naturalHeight/weaponRune[i].naturalWidth) });
            else
                  size = this.scalePixelPosition({x: fc[i].runemark.size * (weaponRune[i].naturalWidth/weaponRune[i].naturalHeight),
                                                  y: fc[i].runemark.size });
            pos.x -= (size.x/2)
            pos.y -= (size.y/2)

            c.drawImage(weaponRune[i], pos.x, pos.y, size.x, size.y);
        }else{
            weaponRune[i].addEventListener('load',function(){ths.draw()},{once:true});
        }
      }

      //draw text stuff
      c.font = ""+fc[i].range.scale + "px rodchenkoctt";
      c.fillStyle = "black";
      //c.fillStyle = "#dfdfdd";
      c.textBaseline = "middle";
      c.textAlign = "center";
      let range = weaponData[i].range[0] == 0?
                    weaponData[i].range[1] : weaponData[i].range[0] + " - " + weaponData[i].range[1];


      this.writeScaled(range,this.addPositions(start,fc[i].range));
      this.writeScaled(weaponData[i].strength, this.addPositions(start,fc[i].strength));       // str
      this.writeScaled(weaponData[i].attacks, this.addPositions(start,fc[i].attacks));       // attacks
      this.writeScaled(weaponData[i].damage+"/"+
                        weaponData[i].critical, this.addPositions(start,fc[i].damage));       // wounds
      // some other options
      //c.textBaseline = "middle"; //top
      //c.textAlign = "left"; //center right
  }
}

/*
 * Drawing sub-functions
 *
 */

// whatever we want to draw sized to the canvas, so
// ensure it follows the aspect ratio of the canvas

drawBackground(background){

  if (!background) return;
  if (background.complete == true){

      let context = this.context;
      let width =   this.canvas.width;
      let height =  this.canvas.height;

      context.drawImage(background, 0, 0, width, height);
    //  context.drawImage(background,0,0,background.naturalWidth, background.naturalHeight,0, 0, width, height)
    }else if (background.complete == false){
    let card = this;
    background.addEventListener("load",function() {
      card.fullDraw();
    },{once:true})
  }
  //this.context.drawImage(background, 0, 0, width, height);
  return;
}

drawFarBackground(){

  //clear canvas and draw background;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.drawBackground(this.getFormatStyle().bkfar);


  // by request set background tint color
  if (this.fighterData.color){
      this.context.beginPath();
      //this.context.fillStyle = "rgba("+this.fighterData.color.r+,"", 5, 128, 0.2)";
      this.context.fillStyle = "rgba(" + this.fighterData.color.r + ","
                                       + this.fighterData.color.g + ","
                                       + this.fighterData.color.b + ","
                                       + "0.2)";
      this.context.rect(0,0,this.canvas.width,this.canvas.height);
      this.context.fill();
  }
}

drawNearBackground(){
  this.drawBackground(this.getFormatStyle().bknear);
}



combinePositions(pos,pos2){
  if(!pos){
    if(!pos2) return {x:0,y:0,scale:1}; //neither passed
    return {x:pos2.x,y:pos2.y, scale:pos2.scale}; // 2 passed
 }else if(!pos2) return {x:pos.x,y:pos.y, scale:pos.scale}; // 1 passed
  // both passed
  return {x:pos.x+pos2.x, y:pos.y+pos2.y, scale:pos.scale*pos2.scale};
}

// for weapons intitially, allows all drawn elements locations adjusted from start pos
// in that case pass start first
addPositions(pos,pos2){
  return {x:pos.x+pos2.x, y:pos.y+pos2.y, scale:pos2.scale};
}



// draw fighter image on the card.
// the card format, image we are loading and fighterData all include info
// into this process
// fighterImageData, connected directly with loaded images, has offsets for ideal face position
// fighterCardLocations has  x, y, scale (percentage of canvas width) of center point of image
// fighterData (each unit along with stats) has a final scale and x,y adjustment offset
// user workflow ideally is:
// 1 format - set by dev and untouched by user
// 2 fighterImageData - set first by clicking on image in gallery with correct tool
// 3 fighterData - if this generally correct position isnt the best for the particular card,
//                    user can fine-tune in the card



drawfighterImage() {

  // we should have an image
  if (this.fighterData.imageName && this.FCLocation.fighterImage){

    if (!this.image){  // not loaded or found yet
      this.image = document.getElementById("gz:"+this.fighterData.imageName)
    }
      // experimental refreshing
    if (this.image && !this.image.complete){
        let ths = this;
        this.image.addEventListener("onload",function(){ console("will be loaded");ths.fullDraw();},{once:true})
    }
    // got em
    if (this.image && this.image.complete){

    // drawing the fighter picture
      // this.image has the htmlElement image we copy to canvas
      // 1.w/h - ImageElement it has the width and height in the tag, but also internal height/width
      // 1.offset - we have added xoffset and yoffset when manipulating or loading image that indicates center point (face ideally)
      // 2.x/y - cardFormat our current format has data on where we ideally want the image centred on the card, and a boxWidth value
      // TODO add boxSize
      // 2.boxSize - the bounding box the image will fit into at default scale 1
      //  eg. an image could have own dimensions 300x400 or 1700x2000, we convert scale to boxSize (width) to level
      // 3.x/y/scale - fighterCard.image x,y, scale

      //lets pseudo our drawing logic:
      // get cardxy, subtract boxSize/2 (or half the completed size)
      // get image x/yoffsets (percentages) and as we ideally are centered, the new offsets are measured vs .5
      //   eg. cardxy is centered at half image-size already, so if we want 40% on image width, we want to shift 10 percent left

      let ctx = this.context; // our canvas
      let img = this.image;   // image width/height,xoffset, yoffset
      let format = this.FCLocation.fighterImage; // where the card format/style dictates center-head should be
      let data = this.fighterData.imagePosition; // card-stored final user adjustment (even after image offset and card format lined up) //{"x":0,"y":0,"scale":1}
      let scaleOff = getImageOriginScale(this.image)
      let pos = this.scalePixelPosition({x:format.x, y:format.y});

      //display the origin point centered at 'face'
      //ctx.strokeStyle = "red";
      //ctx.arc(pos.x,pos.y,10,0,Math.PI*2)
      //ctx.stroke();

      // if boxWidth is always same, boxHeight is still based on image dimensions
      let boxWidth = this.canvas.width*format.boxWidth;
      let boxHeight = (img.height/img.width)*boxWidth;

      // user determined img scale from gallery
      boxWidth*=scaleOff.scale; boxHeight*=scaleOff.scale;

      pos = this.scalePixelPosition({x:format.x,y:format.y});
      pos.x-=(boxWidth/2);
      pos.y-=(boxHeight/2);
        // get fighterImageData offset from our image itself (stored there when images load or vals changed)
        let foffset = {x:(0.5-scaleOff.x)*boxWidth, y:(0.5-scaleOff.y)*boxHeight};
        pos.x+=foffset.x;
        pos.y+=foffset.y;

      ctx.drawImage(this.image,pos.x,pos.y, boxWidth, boxHeight);

    }
  }
}

  drawImage(scaledPosition, scaledSize, image) {
      if (image != null || image != undefined) {
          if (image.complete)
          {
              this.context.drawImage(image, scaledPosition.x, scaledPosition.y, scaledSize.x, scaledSize.y);
          }
          else
          {
              image.addEventListener("load",function(){ this.drawImage(scaledPosition, scaledSize, image); },{once:true});
          }
      }
  }


// if the resolution is too low on background it pixelates the rest drawn at
// same resolution so should be able to readjust
changeCanvasSize(newWidth, newHeight=undefined){
    let ratio = this.canvas.width/this.canvas.height;
    this.canvas.width = newWidth;
    this.canvas.height = this.canvas.width/ratio;
    this.fullDraw();
  }

} // end class ////////////////////////////////////////
