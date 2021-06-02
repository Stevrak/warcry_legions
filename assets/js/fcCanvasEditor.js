/*
*
*   FcCanvasEditor NOT WORKING YET
*
*   considered feature, barely started, where fightercard editing functions/inputs
*   are generated and interacted with on the fighterCard canvas elements directly
    as a replacement for Fceditor
    
used in conjunction with fightercards (and their fighterData directly)
*   to allow user modification of units
*
*/

// cursor {xstart,ystart,x,y,isdown,startingElement,callback}


class FcCanvasEditor {
  constructor(fightercard){
    this.fightercard = fightercard;
    this.cursor = null;


    initializeInputs(); // add event listeners
  }

  // converted already?
  showTarget(position){
      let context = fightercard.getContext();
      context.fillStyle = "#FF0000";
      context.arc(position.x,position.y,5,0,2*Math.PI);
  }

  getDistance(pos1, pos2){
    return Math.hypot(pos1.x-pos2.x, pos1.y-pos2.y)
  }

  // intro to onclick event
  startClick(e){
    // can use to remove event listeners on element
    // $("button").click(function(){ $("p").off("click");});
    // we
      let position = getMousePosition(e);
      console.log(position)
      if (!this.cursor)
      this.cursor = {xstart: position.x,
                     ystart: position.y,
                     isdown:true}
      // what to do?
      // we need to compare the position with various fighterCardFormatStyles
      // to decide what the user clicked
      let dist = 50;
      let fs = this.fightercard.getFormatLocations();
      let fightercard = this.fightercard;
      // manually?
      // faction runemark
      //  if (this.getDistance(fs.factionrunemark,position)<dist)
      //    cursor.callback = (r){fightercard.fighterData.runemark}
      // runemark
      // wounds, toughness, movement
      // name
      // weapon 1
      // weapon 2
      // added controls to add/remove weapon 1
      // image
      // image dragging
  }

  getMousePosition(event){
    let rect = this.fightercard.canvas.getBoundingClientRect();
    return {x:(event.clientX - rect.left) ,
            y:(event.clientY - rect.top)} ;
  }
}

/*
  // Insert events
  initializeInputs(){}
    canvas.addEventListener("click",function(e){
        startClick(e);
    })
  // we will use fightercardlocations to determine starting mouseclick
*/


/*



function getMousePosition(canvas, event) {
            let rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            console.log("Coordinate x: " + x,
                        "Coordinate y: " + y);
        }

        let canvasElem = document.querySelector("canvas");

        canvasElem.addEventListener("mousedown", function(e)
        {
            getMousePosition(canvasElem, e);
        });
        */
