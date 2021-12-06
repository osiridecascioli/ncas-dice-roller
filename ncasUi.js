//display display data already calcolated
function display(){
    setNewDisplay();
    displayName();
    displayDie();
    displayWinner();
    displayTalent();
    displayDominance();
}

function displaySession(){
    let d = document.getElementById("url");
    d.value = window.location.href;
}

function urlCopy(){
    let d = document.getElementById("url");
    d.focus();
    d.select();
    try {
        d.setSelectionRange(0, 99999);
        document.execCommand("copy");
        navigator.clipboard.writeText(d.value.toString());
    } catch (error) {
        console.log("urlcopy: " + error);
    }
}

//setNewDisplay
function setNewDisplay(){
    const dT = new Date();
    let time = dT.getTime();
    o.time=time;
    let d = getNcasE(o.time, "displayResult", true, true);
}

//displayName
function displayName(){
    let d = getNcasE("name", o.time+"Display");
    d.innerHTML = o.name; 
    displayCopyName();
}

//displayCopyName
function displayCopyName(){
    let d = getNcasE("nameCopy", "diceDisplay", true);
}

//displayDice display all the dice results
function displayDie(){
    for (let i = 0, pool = Object.keys(o.pool); i < pool.length; i++) {
        displayDice(pool[i]);
    }
}

//displayDie display single pool dice (ex. discipline or pain); parameter is the name of the pool
function displayDice(name){
    let n = "";
    if (o.pool[name].rolls && o.pool[name].rolls.length){
        n = name+": "+o.pool[name].rolls;
    }
    let d = getNcasE(name, o.time+"Display");
    d.innerHTML = n;
    
    displayCopyDie(name);
}

//displayCopyDie
function displayCopyDie(name){
    let n = "&nbsp;";
    if (o.pool[name].rolls && o.pool[name].rolls.length){
        n = o.pool[name].rolls;
    }
    let d = getNcasE(name+"Copy" ,"diceDisplay", true);
    d.innerHTML = n;
}
//displayWinner display if the player or the master win
function displayWinner(){
    let d = getNcasE("winning", o.time+"Display");
    d.innerHTML = o.success.winnerTxt;
}

//displayTalent display use of exhaustion talent
function displayTalent(){
    let d = getNcasE("talent", o.time+"Display");
    d.innerHTML = o.etalentTxt;
}

//displayDominance dominance
function displayDominance(){
    let d = getNcasE("dominance", o.time+"Display");
    if(o.dominance.str < 1){
        d.innerHTML = "<p>" + o.dominance.attribute + "</p>";
        return;        
    }
    d.innerHTML = "<p class=\"dominanceHi "+o.dominance.attribute+"Class\">" + o.pool[o.dominance.attribute].txtArticle+o.pool[o.dominance.attribute].txt + " domina.</p>";
    d.innerHTML += o.dominance.txt;
}

//getNcasE get html element, if the element is already here will return it, else it will be created as child of parent
//parameter name=ID of the html element, parent=ID of the parent where to append
function getNcasE(name, parent, checkOld, invert){
    let d = document.getElementById(name+"Display");
    if (checkOld && d){
        return d;
    }
    let dP = document.getElementById(parent);
    d = document.createElement('div');
    d.id = name+"Display";
    if (checkOld){
        name = String(name);
        name = name.substring(0, (name.length-4));
    }
    d.className = name+"Class";
    if (checkOld && invert){
        dP.insertBefore(d, dP.childNodes[0]);
        return d;
    }
    dP.appendChild(d);
    return d;
}

//click suppress click function for plus and minus, add or remove 1 from the sibiling input numer, find by id
function click(e){
    if (!e || !e.target || !e.target.type || e.target.type != "button"){
        return;
    }

    let id =  getAllSiblings(e.target, inputFilter)[0].id;
    let oldV = parseFloat(document.getElementById(id).value);
    let newV = oldV;
    if (e.target.value == "+"){
        newV = oldV + 1;
    } else if (e.target.value == "-" && oldV > 0) {
        newV = oldV - 1;
    } else{
        return;
    }
    document.getElementById(id).value = newV;
}

function inputFilter(elem){

    if (elem.nodeName.toUpperCase() == "INPUT" && elem.type.toUpperCase() == "NUMBER" ){
        return true
    }
    return false;
}

function getAllSiblings(elem, filter) {
    var sibs = [];
    elem = elem.parentNode.firstChild;
    do {
        if (elem.nodeType === 3) continue; // text node
        if (!filter || filter(elem)) sibs.push(elem);
    } while (elem = elem.nextSibling)
    return sibs;
}