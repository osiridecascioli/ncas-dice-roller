//display display data already calcolated
function display(){
    setNewDisplay();
    displayName();
    displayDice();
    displayWinner();
    displayDominance();
    displayTalent();
}

//setNewDisplay
function setNewDisplay(){
    const dT = new Date();
    let time = dT.getTime();
    let d = getNcasE(time, "displayResult", true, true);
    o.time=time;
}

//displayName
function displayName(){
    let d = getNcasE("name", "diceDisplay", true);
    d.innerHTML = o.name;
    displayCopyName();
}

//displayCopyName
function displayCopyName(){
    let d = getNcasE("name", o.time+"_result");
    d.innerHTML = o.name; 
}

//displayWinner display if the player or the master win
function displayWinner(){
    let d = getNcasE("winning", o.time+"_result");
    d.innerHTML = o.success.winnerTxt;
}

//displayDice display all the dice results
function displayDice(){
    for (let i = 0, pool = Object.keys(o.pool); i < pool.length; i++) {
        displayDie(pool[i]);
    }
}

//displayTalent display use of exhaustion talent
function displayTalent(){
    let d = getNcasE("talent", o.time+"_result");
    d.innerHTML = o.etalentTxt;
}

//displayDominance dominance
function displayDominance(){
    let d = getNcasE("dominance", o.time+"_result");
    if(o.dominance.str < 1){
        d.innerHTML = "<p>" + o.dominance.attribute + "</p>";
        return;        
    }
    d.innerHTML = "<p class=\"dominanceHi "+o.dominance.attribute+"\">" + o.pool[o.dominance.attribute].txtArticle+o.pool[o.dominance.attribute].txt + " domina;</p>";
    d.innerHTML += o.dominance.txt;
}

//displayDie display single pool dice (ex. discipline or pain); parameter is the name of the pool
function displayDie(name){
    let d = getNcasE(name ,"diceDisplay", true);
    if (!o.pool[name].rolls || o.pool[name].rolls.length == 0){
        return;
    }
    d.innerHTML = o.pool[name].rolls;
    displayCopyDie(name);
}

//displayCopyDie
function displayCopyDie(name){
    if (!o.pool[name].rolls || o.pool[name].rolls.length == 0){
        return;
    }
    let d = getNcasE(name, o.time+"_result");
    d.innerHTML = name+": "+o.pool[name].rolls;
}

//getNcasE get html element, if the element is already here will return it, else it will be created as child of parent
//parameter name=ID of the html element, parent=ID of the parent where to append
function getNcasE(name, parent, checkOld, invert){
    let d = document.getElementById(name+"_result");
    if (checkOld && d){
        return d;
    }
    let dP = document.getElementById(parent);
    d = document.createElement('div');
    d.id = name+"_result";
    d.className = parent+"Style "+name;
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
    let p = e.target.parentNode.id;
    let id =  p.substring(0, (p.length-4));
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