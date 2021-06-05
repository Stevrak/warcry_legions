// abilites card

// define our ability data (dont care for seperate data class, let's let
// our Abilitycard manage the canvas/abilitydata)
// we will be grouping aaall abilities for a given faction together? No, we will include
// sub-faction (group) (like cities of sigmar, or alternatives sets for same ....)
// this does not mean leaders are sub-faction, those are simply part of same sub-faction with a leader
// runemark attached
// Drawing

/*  abilityData = { faction:
                    group:
                    abilities:[
                        {
                          title : string,
                          caption: string,
                          text : string
                          runemarks:[]
                        },
                        ...
                    ]
                  }


*/
class Abilitycard {
    constructor(data,canvas,format){
        this.abilityData = data;

        this.canvas = canvas;
        this.canvas_buffer = new Canvas();

        this.format = format;

    }

    // getters
    get context(){
        return this.canvas.getContext("2d");
    }

    // get the specific abilityData unit at a given canvas point
    get abilityAt(x,y){

    }

    // get abilites matching the given list of runemarks
    get abilitysWith(runemarks){

    }

    // setters



    // drawing







}
