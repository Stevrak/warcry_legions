/*
* simple top-page self-fading messages to user

  Stephen Joys 2021

* put a div with id="message-container" where-ever (or change end of this file)
* call messages.add("The text you want to say!",
                    "success/error/whatever css class you want to include")

  includes stylesheet messages.css
*/
class Messages{

	constructor(id = "message_container", timer = 2000){

  	this.timer = timer;
		this.div = document.getElementById(id);

		// add own div to page body if no div present
		if (!this.div) {
			this.div = document.createElement("div");
			document.getElementsByTagName("body")[0].prepend(this.div);
		}
		// ensure we have class set on top div
		if ( this.div.className.search("message_container") < 0 )
			this.div.className += " message_container";

		// needs an inner div to set absolute, not messages themselves
		// or they overlap each other
		let tmp = document.createElement("div");
		tmp.className = "inner";
		this.div.prepend(tmp);
		this.div = tmp;
	}	// end constructor

	// add message that disappears after 'timer' seconds
	// with a 1 second fade
  add(message,type){
  		let n = document.createElement('div');
      n.className = "message"+ (type?(" "+type):"");
      n.innerHTML = message;

			let div = this.div; // for timeout
    	div.prepend(n);

      setTimeout(function () {
				n.style.opacity = 0.0;
        //n.style.filter = alpha(opacity)
      	setTimeout(() =>div.removeChild(n),1000);
      },this.timer);
 }
}

//
var messages = new Messages();
