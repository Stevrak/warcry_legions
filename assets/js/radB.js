/*
* 	radioButtons or radB for short. clickRadB, clearRadB, getRadB, addRadB, removeRadB
*   - Put a series of buttons or button like elements inside an outer container with an id.
		the divs are clickable, toggle eachother off when selected, and value of group is single string of the desired name/value
		<form id="button_group">
			<button onclick="clickRadB(event)" title="option1"> Option one </button>
			<button onclick="clickRadB(event)" title="option2"> Option two </button>
			<button onclick="clickRadB(event)" title="option3"> Option three </button>
		</form>

*		- not useful for form submit, I just built it as quick set of buttons that allow one (or no option) selected
 *	each 'button' should have onclick="clickToggleButtonGroupwith"
*		value stored in title. the 'on option' is indicated with className="active" placed on top button container
*		- clickRadB(e) - onclick for each 'button', passing (event)
*   - clearRadB(id) - pass the id of the outer form container to reset everything off;
		-	addRadB(id, newElem, value, caption) - add button id of group, element will become button or "div/span/etc"
		-	removeRadB(id,value)								- remove button with given value
	if you want to disallow no option
*/
// in a form with multiple buttons we intend to act as radio inputs,
// when we click one, must remove current active and select new one
// also unselect all if previous selection was clicked

function clickRadB(e,callback){
	  e.preventDefault();

		let form = e.target.parentNode;

		// if user is toggling current selection off
		if (form.title == e.target.title){
			form.removeAttribute("title");
			e.target.className = e.target.className.replace(" active","")
			return;
		}
		clearRadB(form);	// accepts object or id

		//set current clicked button 'on'
		form.title = e.target.title;
		 e.target.className += " active"
		if (callback) callback(e);
}


// retrieve value of which button is selected
function getRadB(id){
		if (typeof id == 'string') id = document.getElementById(id);
		if (!id) return;
		return id.title;
}

// retrieve element of which button is selected
function getERadB(id){
		let form = document.getElementById(id);
		if (!form) return;
		if (form.title){
				let buttons = form.children;
				for(let i of buttons){
				 		if (i.title == form.title){
							return i
						}
				}
		}
		return;
}

// find and set the button with value
function setRadB(id,value){
	if (typeof id =="string") id = document.getElementById(id);
	if (!id || id.title == value) return;
	for (c of id.children) {
			if (c.title == value){ // found it
				clearRadB(id)
				c.className+=" active";
				id.title = value;
				return;
			}
	}
}

// find active button and deactivate
function clearRadB(id){
		let form = typeof id == "object"?id:document.getElementById(id);

		if (!form) return;

		// prev. clicked something, turn it off
		if (form.title){
				let buttons = form.children;
				for(let i of buttons){
				 		if (i.title == form.title){
							i.className = i.className.replace(" active","")
							break;
						}
				}
				form.removeAttribute("title");
		}
}

// attempt to strip all " active" then clear main title

function forceClearRadB(id){
		let form = (typeof id == "string"?document.getElementById(id):id);
		if (!form) return;

		Array.from(form.children).forEach((c) =>{
				if (c.className.indexOf(" active")>=0)
					c.className = c.className.replace(" active","");
				})
				form.removeAttribute("title");
}

/**
 * Add additional 'buttons' to a radB group
 * @param  {HTMLElement/String} id form obj or string for id lookup
 * @param  {HTMLELement/String} newElem what tagName we want to reprisent with the button, or pass own object
 * @param  {string} value what to set our forms title=value to for looking up with getRadB
 * @param  {string} caption innerHTML of button set to this
 * @return {HTMLElement}     newly created button
 */

function addRadB(id, newElem, value, caption){
	// check either string or object(assume our HTMLElement like div, form etc)
	// otherwise doesn't error check
	if (typeof id == "string")
		id = document.getElementById(id);

	if (!id) return;

	if (typeof newElem == "string")	// assume passed "div", "FORM", "BUTTON" etc.
	newElem = document.createElement(newElem);

	newElem.addEventListener('click',(e) => clickRadB(e));
	newElem.title = value;
	if (caption) newElem.innerHTML = caption;
	id.appendChild(newElem);

	return newElem;
}


// find the 'button' in form with same value and remove it (toggle off in case active)

function removeRadB(id,value){

	// id can be string id for lookup, or htmlElement (assume those)
	let form = (typeof id == "object")? id : document.getElementById(id);
	if (!form) return;

	// clear the title if same value
	if (form.getAttribute('title') == value)
			form.removeAttribute("title");

	let buttons = form.children;
	for(let i of buttons){
			if (i.title == value){
				form.removeChild(i);
				return;
			}
	}
}
