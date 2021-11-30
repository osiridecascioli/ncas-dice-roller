const form = document.forms[0];

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    /*
    for (const formElement of formData) {
        //console.log(formElement);
    }
    */
    getResults(formData);
});

const dominance = {
    attribute: "",
    value: 0
}
const o = {
    discipline:[],
    disciplineStrenght:0,
    madness:[],
    madnessStrenght:0,
    exhaustion:[],
    exhaustionStrenght:0,
    pain:[],
    painStrenght:0,
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
    playerStat: ["discipline", "madness", "exhaustion", "assist"],
    masterStat: "pain"
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
}

function getResults(formData){
    resetData();

    dieRoll(formData);
    
    getExhaustion(formData);
    
    getWinner();

    getDominance();
    console.log("Disciplina", o.discipline);
    console.log("Sfinimento", o.exhaustion);
    console.log("Pazzia", o.madness);
    console.log("Dolore", o.pain);
    //console.log(o.alert,"Dominio", o.dominance.attribute);
    //console.log("---");
    //console.log(o);
    getTextRes();
    console.log(o.resultTxt);
}

function getTextRes(){
    switch (o.dominance.attribute){
        case "dominance":
            o.resultTxt = "indipendentemente dal "+o.winner+", la situazione rimane sotto controllo (o, per lo meno, non degenera ulteriormente nel caos) e l'uso delle proprie abilità e della propria concentrazione sono predominanti.";
            o.resultTxt += "<br />permette al giocatore di ridurre di 1 il proprio valore di Sfinimento attuale, oppure recuperare una delle proprie Reazioni, liberando uno dei riquadri di Reazione sulla scheda (pagina 18). Il giocatore non è obbligato a sfruttare questo vantaggio: a volte vorrà tenere il proprio valore di Sfinimento così come ce l'ha al momento.";
            break;
        case "exhaustion":
            o.resultTxt = "indipendentemente dal "+o.winner+", la situazione stressa le risorse del Protagonista e gli da un'occasione per affrontare la propria insonnia (ed il proprio disperato desiderio di riposare).";
            o.resultTxt += "<br />incrementa ulteriormente lo Sfinimento di 1, anche quando il giocatore lo ha già incrementato volontariamente nello stesso tiro di dadi.";
            break;
        case "madness":
            o.resultTxt = "indipendentemente dal "+o.winner+", la situazione mette seriamente sotto sforzo psicologico o emotivo il Protagonista. Non solo: la situazione si fa inevitabilmente più caotica, e il Protagonista può trovarsi ad essere vittima dei rischi che si è preso.";
            o.resultTxt += "<br />attiva una delle Reazioni del Protagonista. Il giocatore può scegliere quale dei propri riquadri di Reazione disponibili (vuoti) vuole riempire, permettendogli di scegliere tra la reazione Lotta o la reazione Fuggi.";
            break;
        case "pain":
            o.resultTxt = "indipendentemente dal "+o.winner+", la situazione richiede che il Protagonista paghi un prezzo. In caso abbia perso il conflitto, la sconfitta stessa può essere un prezzo adeguato (a seconda di quanto schiacciante è la sconfitta), ma se invece ha vinto, quella vittoria esige qualcosa in cambio dal vincitore. Per farla breve, quando il Dolore Domina... beh, Domina il Dolore!";
            o.resultTxt += "<br />aggiungi una Moneta di Disperazione alla Coppa della Disperazione (vedi oltre, a pagina 26, per saperne di più sulle Monete).";
            break;
    }
}

function getDominance(){
    o.dominance.attribute = "pain";
    o.dominance.value = o.pain[0]

    compareDominance("exhaustion");

    compareDominance("madness");

    compareDominance("discipline");
}

function compareDominance(compare){
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
        //il numero di dadi più alto è maggiore
        return;
    } else if (o[actualD+"Strenght"] < o[compare+"Strenght"] ){
        //il numero di dadi più alto è minore
        o.dominance.attribute = compare;
        o.dominance.value = o[compare][0];
        return;
    } 
    
    //this gonna be difficult
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
    o.winnerTxt = "Il giocatore ";
    if (o.pSuccess >= o.mSuccess){
        o.winner = "successo";
        o.winnerTxt += "vince ";
    }else{
        o.winner = "fallimento";
        o.winnerTxt += "perde ";
    }
    o.winnerTxt = o.winnerTxt + o.pSuccess + " a " + o.mSuccess + ";";
    //console.log(o.winner);
}

function getExhaustion(formData){
    let etalent = Number(formData.get("etalent"));
    if (etalent == 0){
        return;
    }
    if (Number(formData.get("exhaustion")) < 1){
        o.etalentTxt = "<br />Non puoi usare il Talento di Sfinimento senza avere Sfinimento.";
        return;
    }
    if (etalent == 1){
        if (o.pSuccess < o.exhaustion){
            o.pSuccess = o.exhaustion;
        }
        o.etalentTxt = "Uso Minore. Minimo "+o.exhaustion+" successi.";
    } else if (etalent == 2){
        o.pSuccess = o.pSuccess + o.exhaustion;
        o.etalentTxt = "Uso Maggiore. +"+o.exhaustion+" successi.";
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
