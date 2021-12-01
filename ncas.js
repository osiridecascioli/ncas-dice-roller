const dominance = {
    attribute: "",
    value: 0
}
const o = {
    discipline:[],
    disciplineStrenght:0,
    disciplineTxt: "La Disciplina",
    madness:[],
    madnessStrenght:0,
    madnessTxt: "La Pazzia",
    exhaustion:[],
    exhaustionStrenght:0,
    exhaustionTxt: "Lo Sfinimento",
    pain:[],
    painStrenght:0,
    painTxt: "Il Dolore",
    assist:[],
    assistStrenght:0,
    pSuccess:0,
    mSuccess:0,
    etalentTxt:"",
    winner:"",
    winnerTxt: "",
    alert:"",
    dominance: dominance,
    resultTxt: "",
    playerStat: ["discipline", "assist", "exhaustion", "madness"],
    masterStat: "pain",
    name: "",
    time:0
};

function resetData(){
    o.discipline=[];
    o.disciplineStrenght=0;
    o.madness=[];
    o.madnessStrenght=0;
    o.exhaustion=[];
    o.exhaustionStrenght=0;
    o.pain=[];
    o.painStrenght=0;
    o.assist=[];
    o.assistStrenght=0;
    o.pSuccess=0;
    o.mSuccess=0;
    o.etalentTxt="";
    o.winner="";
    o.winnerTxt="";
    o.alert="";
    o.dominance.attribute="";
    o.dominance.value=0;
    o.resultTxt = "";
    o.name = "";
    o.time=0;
}

function getResults(formData){
    resetData();

    dieRoll(formData);

    /*
    if needed to force result you can use this structure
    o.discipline=[6];
    o.disciplineStrenght=1;
    o.madness=[5,4];
    o.madnessStrenght=1;
    o.exhaustion=[5,5,4];
    o.exhaustionStrenght=2;
    o.pain=[5,1,1];
    o.painStrenght=1;
    */

    getExhaustion(formData);

    getName(formData);
    
    getWinner();

    calculateDominance();

    calculateDominanceTxt();

    display();
}

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
    d.innerHTML = o.winnerTxt;
}

//displayDice display all the dice results
function displayDice(){
    for (const [key, value] of Object.entries(o.playerStat)) {
        //console.log(key, value);
        displayDie(value);
    }
    displayDie(o.masterStat);
}

//displayTalent display use of exhaustion talent
function displayTalent(){
    let d = getNcasE("talent", o.time+"_result");
    d.innerHTML = o.etalentTxt;
}

//displayDominance dominance
function displayDominance(){
    let d = getNcasE("dominance", o.time+"_result");
    d.innerHTML = "<p class=\"dominanceHi "+o.dominance.attribute+"\">" + o[o.dominance.attribute+"Txt"] + " domina;</p>";
    d.innerHTML += o.resultTxt;
}

//displayDie display single pool dice (ex. discipline or pain); parameter is the name of the pool
function displayDie(name){
    let d = getNcasE(name ,"diceDisplay", true);
    d.innerHTML = o[name];
    displayCopyDie(name);
}

//displayCopyDie
function displayCopyDie(name){
    if (o[name].length == 0){
        return;
    }
    let d = getNcasE(name, o.time+"_result");
    d.innerHTML = name+": "+o[name]+"; ";
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

//getName
function getName(formData){
    o.name = formData.get("name");
}

//calculateDominanceTxt from a calculated Dominance, set the rule info text regarding the pool dominance and effects
function calculateDominanceTxt(){
    o.resultTxt += "<p>Indipendentemente dal "+o.winner+", la situazione ";
    switch (o.dominance.attribute){
        case "discipline":
            o.resultTxt += "rimane sotto controllo (o, per lo meno, non degenera ulteriormente nel caos) e l'uso delle proprie abilità e della propria concentrazione sono predominanti.";
            o.resultTxt += "</p><p>";
            o.resultTxt += "Riduci di 1 il valore di Sfinimento attuale, oppure recuperare una delle Reazioni, liberando uno dei riquadri di Reazione sulla scheda (pagina 18). Non sei obbligato a sfruttare questo vantaggio: a volte vorrai tenere il valore di Sfinimento così com'è al momento.";
            break;
        case "exhaustion":
            o.resultTxt += "stressa le tue risorse e da un'occasione per affrontare l'insonnia (ed il disperato desiderio di riposare).";
            o.resultTxt += "</p><p>";
            o.resultTxt += "Incrementa ulteriormente lo Sfinimento di 1, anche quando lo hai già incrementato volontariamente nello stesso tiro di dadi.";
            break;
        case "madness":
            o.resultTxt += "ti mette seriamente sotto sforzo psicologico o emotivo. Non solo: la situazione si fa inevitabilmente più caotica, e puoi trovarti ad essere vittima dei rischi che ti sei preso.";
            o.resultTxt += "</p><p>";
            o.resultTxt += "Attiva una delle Reazioni. Puoi scegliere quale dei riquadri di Reazione disponibili (vuoti) vuoi riempire, permettendoti di scegliere tra la reazione Lotta o la reazione Fuggi.";
            break;
        case "pain":
            o.resultTxt += "richiede che paghi un prezzo. Se hai perso il conflitto, la sconfitta stessa può essere un prezzo adeguato (a seconda di quanto schiacciante è la sconfitta), ma se invece hai vinto, questa vittoria esige qualcosa in cambio dal vincitore. Per farla breve, quando il Dolore Domina... beh, Domina il Dolore!";
            o.resultTxt += "</p><p>";
            o.resultTxt += "Aggiungi una Moneta di Disperazione alla Coppa della Disperazione (vedi oltre, a pagina 26, per saperne di più sulle Monete).";
            break;
    }
    o.resultTxt += "</p>";
}

//calculateDominance calculate pool dominance
function calculateDominance(){
    o.dominance.attribute = "pain";
    o.dominance.value = o.pain[0]

    compareDominance("exhaustion");

    compareDominance("madness");

    compareDominance("discipline");
}

//compareDominance there MUST be a 'default' setted, comparing this default with a new one
function compareDominance(compare){
    //console.log(compare);
    if(o[compare].length < 1){
        //console.log("il comparato", compare, "è troppo corto");
        return;
    }

    if (o.dominance.value > o[compare][0]){
        //console.log("il primo valore VECCHIO è più alto", o.dominance.value,o[compare][0]);
        return;
    }

    if (o.dominance.value < o[compare][0]){
        //console.log("il primo valore NUOVO è più alto", o.dominance.value,o[compare][0]);
        o.dominance.attribute = compare;
        o.dominance.value = o[compare][0];
        return;
    }

    let actualD = o.dominance.attribute;
    //equal case
    if (o[actualD+"Strenght"] > o[compare+"Strenght"] ){
        //console.log("il numero di dadi più alto è maggiore");
        return;
    } else if (o[actualD+"Strenght"] < o[compare+"Strenght"] ){
        //console.log("il numero di dadi più alto è minore");
        o.dominance.attribute = compare;
        o.dominance.value = o[compare][0];
        return;
    } 
    
    //console.log("this gonna be difficult");
    let max = 0;
    let newObj = {};
    newObj[actualD] = removeUpper(o[actualD]);
    newObj[compare] = removeUpper(o[compare]);
    while (max < 6){ //6 è un numero arbitrario
        if (thisIsMad(newObj, actualD, compare)){
            return;
        }
        newObj[actualD] = removeUpper(newObj[actualD]);
        newObj[compare] = removeUpper(newObj[compare]);
        max++;
    };
    //console.log("Dominio da controllare a mano");
    o.dominance.attribute +="<br />Dominio da controllare a mano.";
    o.dominance.value = 0;
}

function thisIsMad(newObj, actualD, compare){
    if (!newObj[actualD].length && !newObj[compare].length){
        //le due serie di dadi sono vuote
        return true;
    }else if (newObj[actualD].length &&  !newObj[compare].length){
        //la nuova serie di dadi è vuota 
        return true;
    }else if (!newObj[actualD].length && newObj[compare].length){
        //la vecchia serie di dadi è vuota
        o.dominance.attribute = compare;
        o.dominance.value = o[compare][0];
        return true;
    }
    if (newObj[actualD][0] > newObj[compare][0]){
        //il dado successivo vecchio è più alto
        return true;
    }else if (newObj[actualD][0] < newObj[compare][0]){
        //il dado successivo nuovo è più alto
        o.dominance.attribute = compare;
        o.dominance.value = o[compare][0];
        return true;
    }
    if (getStrength(newObj[actualD]) > getStrength(newObj[compare])){
        //il numero di dadi più alti vecchio è più alto
        return true;
    } else if (getStrength(newObj[actualD]) < getStrength(newObj[compare])){
        //il numero di dadi più alti nuovi è più alto
        o.dominance.attribute = compare;
        o.dominance.value = o[compare][0];
        return true;
    }
    return false;
}

function removeUpper(arr){
    if (!arr || !arr.length){
        return [];
    }
    let v = arr[0];
    arr = arr.sort();
    let aN = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= v ){
            arr.sort().reverse();
            return aN.reverse();
        }
        aN.push(arr[i]);
    }
}


function getStrength(n){
    if(!n.length){
        return 1;
    }
    let m = 0;
    for (let i = 0; i < n.length; i++) {
        if (n[i] < n[0]){
            return m;
        }
        m++;
    }
    return m;
}

function getWinner(){
    o.winnerTxt = "Il giocatore <span class=\"winning ";
    if (o.pSuccess >= o.mSuccess){
        o.winner = "successo";
        o.winnerTxt += "winner\">vince ";
    }else{
        o.winner = "fallimento";
        o.winnerTxt += "loser\">perde ";
    }
    o.winnerTxt = o.winnerTxt + "</span>" + o.pSuccess + " a " + o.mSuccess + ";";
    
    //console.log(o.winner);
}

function getExhaustion(formData){
    let etalent = Number(formData.get("etalent"));
    if (etalent == 0){
        return;
    }
    let ext = Number(formData.get("exhaustion"));
    if (ext < 1){
        o.etalentTxt = "<br />Non puoi usare il Talento di Sfinimento senza avere Sfinimento.";
        return;
    }
    if (etalent == 1){
        if (o.pSuccess < ext){
            o.pSuccess = ext;
        }
        o.etalentTxt = "Uso Minore. Minimo "+ext+" successi.";
    } else if (etalent == 2){
        o.pSuccess = o.pSuccess + etalent;
        o.etalentTxt = "Uso Maggiore. +"+ext+" successi.";
    }
    //console.log(etalentTxt);
}

function dieRoll(formData){
    for (let i = 0; i < o.playerStat.length; i++) {
        parseName(formData, o.playerStat[i]);
        //console.log("Dice: "+playerStat[i] + "; form: "+formData.get(playerStat[i]));
    }
    //console.log("Dice: E"+o.exhaustion + "; form: "+formData.get("exhaustion"));
    parseName(formData, o.masterStat);
}

function parseName(formData, name){
    o[name] = getResult(name, Number(formData.get(name)))
    //console.log("Dice: ",name, o[name], "form: "+formData.get(name));
}

function getResult(name, token){
    if (token < 1){
        return [];
    }
    //console.log("getResult name: "+name+"; token: "+token+";")
    let results = [];
    for (let i = 0; i < token; i++) {
        let n = Rd6();
        setSuccess(name, n);
        //console.log("getRndInteger name: "+name+"; token: "+n+";");
        results.push(n);
    }
    results.sort().reverse();
    o[name+"Strenght"] = getStrength(results);
    //console.log(results);
    return results;
}

function setSuccess(name, n){
    if ( n > 3)
        return;

    if ( o.playerStat.includes(name)){
        o.pSuccess++; 
    } else if (name == "pain"){
        o.mSuccess++;
    }
}

function Rd6(){
    return getRndInteger(1, 7);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function click(e){
    if (!e || !e.target || !e.target.type || e.target.type != "button"){
        return;
    }
    let p = e.target.parentNode.id;
    let id =  p.substring(0, (p.length-4));
    let oldV = parseFloat(document.getElementById(id).value);
    let newV = 0;
    if (e.target.value == "+" && oldV < 6){
        newV = oldV + 1;
    } else if (e.target.value == "-" && oldV > 0) {
        newV = oldV - 1;
    } else{
        return;
    }
    document.getElementById(id).value = newV;
    console.log(id);
}