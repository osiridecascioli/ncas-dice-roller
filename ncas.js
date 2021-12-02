const o = {
    pool:{
        discipline:{
            rolls:[],
            txtArticle: "La ",
            txt:"Disciplina",
            str:0,
            player:true,
            dominance:true
        },
        madness:{
            rolls:[],
            txtArticle: "La ",
            txt:"La Pazzia",
            str:0,
            player:true,
            dominance:true
        },
        exhaustion:{
            rolls:[],
            txtArticle: "Lo ",
            txt:"Sfinimento",
            str:0,
            player:true,
            dominance:true
        },
        assist:{
            rolls:[],
            txtArticle: "L'",
            txt:"Aiuto",
            str:0,
            player:true,
            dominance:false
        },
        pain:{
            rolls:[],
            txtArticle: "Il ",
            txt:"Dolore",
            str:0,
            player:false,
            dominance:true
        },
    },
    success:{
        player:0,
        master:0,
        winnerString:"",
        winnerTxt:""
    },
    etalentTxt:"",
    dominance: {
        attribute: "",
        value: 0,
        txt: "",
    },
    name: "",
    time:0
};

function resetData(){
    o.pool={
        discipline:{
            rolls:[],
            txtArticle: "La ",
            txt:"Disciplina",
            str:0,
            player:true,
            dominance:true
        },
        madness:{
            rolls:[],
            txtArticle: "La ",
            txt:"Pazzia",
            str:0,
            player:true,
            dominance:true
        },
        exhaustion:{
            rolls:[],
            txtArticle: "Lo ",
            txt:"Sfinimento",
            str:0,
            player:true,
            dominance:true
        },
        assist:{
            rolls:[],
            txtArticle: "L'",
            txt:"Aiuto",
            str:0,
            player:true,
            dominance:false
        },
        pain:{
            rolls:[],
            txtArticle: "Il ",
            txt:"Dolore",
            str:0,
            player:false,
            dominance:true
        }
    };
    o.etalentTxt="";
    o.success= {
        player:0,
        master:0,
        winnerString:"",
        winnerTxt:""
    };
    o.dominance= {
        attribute: "",
        value: 0,
        txt:""
    };
    o.name = "";
    o.time=0;
}

function getResults(formData){
    resetData();

    const rawData = getData(formData);

    dieRoll(rawData);
    /*
    o.pool.discipline.rolls = [6,6,1];
    o.pool.discipline.str = 2;
    o.pool.madness.rolls = [6,2];
    o.pool.madness.str = 1;
    o.pool.exhaustion.rolls = [6,1];
    o.pool.exhaustion.str = 1;
    o.pool.pain.rolls = [5,4,4,3,2,1];
    o.pool.pain.str = 1;
    */

    setExhaustionTalent(rawData);

    setName(rawData);
    
    setWinner();

    setDominance();

    display();
}

//getData return simple obj with the form data
function getData(formData){
    const rawData = {};
    for (let i = 0, pool = Object.keys(o.pool); i < pool.length; i++) {
        rawData[pool[i]] = Number(formData.get(pool[i]));
    }
    rawData.etalent = Number(formData.get("etalent"));
    rawData.name = formData.get("name");
    return rawData;
}

//setName
function setName(rawData){
    o.name = rawData["name"];
}

//setDominanceTxt from a calculated Dominance, set the rule info text regarding the pool dominance and effects
function setDominanceTxt(){
    o.dominance.txt += "<p>Indipendentemente dal " + o.success.winnerString + ", la situazione ";
    switch (o.dominance.attribute){
        case "discipline":
            o.dominance.txt += "rimane sotto controllo (o, per lo meno, non degenera ulteriormente nel caos) e l'uso delle proprie abilità e della propria concentrazione sono predominanti.";
            o.dominance.txt += "</p><p>";
            o.dominance.txt += "Riduci di 1 il valore di Sfinimento attuale, oppure recuperare una delle Reazioni, liberando uno dei riquadri di Reazione sulla scheda (pagina 18). Non sei obbligato a sfruttare questo vantaggio: a volte vorrai tenere il valore di Sfinimento così com'è al momento.";
            break;
        case "exhaustion":
            o.dominance.txt += "stressa le tue risorse e da un'occasione per affrontare l'insonnia (ed il disperato desiderio di riposare).";
            o.dominance.txt += "</p><p>";
            o.dominance.txt += "Incrementa ulteriormente lo Sfinimento di 1, anche quando lo hai già incrementato volontariamente in questo tiro di dadi.";
            break;
        case "madness":
            o.dominance.txt += "ti mette seriamente sotto sforzo psicologico o emotivo. Non solo: la situazione si fa inevitabilmente più caotica, e puoi trovarti ad essere vittima dei rischi che ti sei preso.";
            o.dominance.txt += "</p><p>";
            o.dominance.txt += "Attiva una delle Reazioni. Puoi scegliere quale dei riquadri di Reazione disponibili (vuoti) vuoi riempire, permettendoti di scegliere tra la reazione Lotta o la reazione Fuggi.";
            break;
        case "pain":
            o.dominance.txt += "richiede che paghi un prezzo. ";
            if (o.success.winnerString == "successo"){
                o.dominance.txt += "Questa vittoria esige qualcosa in cambio dal vincitore. "
            } else{
                o.dominance.txt += "L'aver perso il conflitto potrebbe essere un prezzo adeguato (a seconda di quanto sia schiacciante). "
            }
            o.dominance.txt += "In ogni caso, quando il Dolore Domina... beh, Domina il Dolore!";
            o.dominance.txt += "</p><p>";
            o.dominance.txt += "Aggiungi una Moneta di Disperazione alla Coppa della Disperazione (vedi oltre, a pagina 26, per saperne di più sulle Monete).";
            break;
    }
    o.dominance.txt += "</p>";
}

//setDominance calculate pool dominance
function setDominance(){
    for (let i = 0, pool = Object.keys(o.pool).reverse(); i < pool.length; i++) {
        if( !o.pool[pool[i]].dominance ){
            continue;
        }
        compareAndSetDominance(pool[i]);
        //console.log("vince ", o.dominance.attribute)
    }
    setDominanceTxt();
}

//compareAndSetDominance comparing this default with a new one, if empty, use as default
function compareAndSetDominance(compare){
    if(o.dominance.value == 0){
        //console.log("set default");
        o.dominance.attribute = compare;
        o.dominance.value = o.pool[compare].rolls[0];
        return;
    }
    //console.log("comparo ", o.dominance.attribute, compare)
    if(o.pool[compare].rolls.length < 1){
        //console.log("il comparato", compare, "è troppo corto");
        return;
    }

    if (o.dominance.value > o.pool[compare].rolls[0]){
        //console.log("il primo valore VECCHIO è più alto", o.dominance.value,o.pool[compare].rolls[0]);
        return;
    }

    if (o.dominance.value < o.pool[compare].rolls[0]){
        //console.log("il primo valore NUOVO è più alto", o.dominance.attribute, o.dominance.value, compare, o.pool[compare].rolls[0]);
        o.dominance.attribute = compare;
        o.dominance.value = o.pool[compare].rolls[0];
        return;
    }

    let actualD = o.dominance.attribute;
    //equal case
    if (o.pool[actualD].str > o.pool[compare].str ){
        //console.log("il numero di dadi più alto è maggiore");
        return;
    } else if (o.pool[actualD].str < o.pool[compare].str ){
        //console.log("il numero di dadi più alto è minore");
        o.dominance.attribute = compare;
        o.dominance.value = o.pool[compare].rolls[0];
        return;
    } 
    
    //console.log("this gonna be difficult");
    let max = 0;
    let newObj = {};
    newObj[actualD] = removeUpper(o.pool[actualD].rolls);
    newObj[compare] = removeUpper(o.pool[compare].rolls);
    while (max < 6){ //6 è un numero arbitrario
        if (setDominanceDraw(newObj, actualD, compare)){
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

//setDominanceDraw in case of dominance draw we have to do a bit of calculation
function setDominanceDraw(newObj, actualD, compare){
    if (!newObj[actualD].length && !newObj[compare].length){
        //console.log("le due serie di dadi sono vuote", actualD, compare);
        return true;
    }else if (newObj[actualD].length &&  !newObj[compare].length){
        //console.log("la nuova serie di dadi è vuota ", actualD, compare);
        return true;
    }else if (!newObj[actualD].length && newObj[compare].length){
        //console.log("la vecchia serie di dadi è vuota", actualD, compare);
        o.dominance.attribute = compare;
        o.dominance.value = o.pool[compare].rolls[0];
        return true;
    }
    if (newObj[actualD][0] > newObj[compare][0]){
        //console.log("il dado successivo vecchio è più alto", actualD, compare)
        return true;
    }else if (newObj[actualD][0] < newObj[compare][0]){
        //console.log("il dado successivo nuovo è più alto", actualD, compare);
        o.dominance.attribute = compare;
        o.dominance.value = o.pool[compare].rolls[0];
        return true;
    }
    if (getStrength(newObj[actualD]) > getStrength(newObj[compare])){
        //console.log("il numero di dadi più alti vecchio è più alto", actualD, compare);
        return true;
    } else if (getStrength(newObj[actualD]) < getStrength(newObj[compare])){
        //console.log("il numero di dadi più alti nuovi è più alto", actualD, compare);
        o.dominance.attribute = compare;
        o.dominance.value = o.pool[compare].rolls[0];
        return true;
    }
    //console.log("oddio", actualD, compare);
    return false;
}

//removeUpper remove all the hightest number from a list. ex [5,5,4] will be [4]
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

//getStrength return the number of time the maximum number appear in an reverse sorted list ex [6,6,4,1] will return 2 
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
    return Number(m);
}

//setWinner read the number of master and player success and set the winner if player >= master
function setWinner(){
    o.success.winnerTxt = "Il giocatore <span class=\"winning ";
    if (o.success.player >= o.success.master){
        o.success.winnerString = "successo";
        o.success.winnerTxt += "winner\">vince ";
    }else{
        o.success.winnerString = "fallimento";
        o.success.winnerTxt += "loser\">perde ";
    }
    o.success.winnerTxt = o.success.winnerTxt + "</span>" + o.success.player + " a " + o.success.master + ";";
}

//setExhaustionTalent check if exhaustion talent is selected and is mechanic
function setExhaustionTalent(rawData){
    let etalent = rawData["etalent"];
    if (etalent == 0){
        return;
    }
    let ext = rawData["exhaustion"];
    if (ext == 0){
        o.etalentTxt = "<br />Non puoi usare il Talento di Sfinimento senza avere Sfinimento.";
        return;
    }
    if (etalent == 1){
        if (o.success.player < ext){
            o.success.player = ext;
        }
        o.etalentTxt = "Talento, uso Minore. Minimo "+ext+" successi.";
        return;
    }
    o.success.player = o.success.player + etalent;
    o.etalentTxt = "Talento, uso Maggiore. +"+ext+" successi.";
}

//dieRoll roll the dice for all the pool (ex. exhaustion, pain, madness)
//parameters: rawData=the data submitted
function dieRoll(rawData){
    for (let i = 0, pool = Object.keys(o.pool); i < pool.length; i++) {
        setDieResults(rawData, pool[i]);
        o.pool[pool[i]].str = getStrength(o.pool[pool[i]].rolls);
    }
}

//setDieResults set the result of dice rolled
//parameters: formData=the data submitted, name=the name of the pool to be rolled
function setDieResults(rawData, name){
    o.pool[name].rolls = getDieResult(name, rawData[name]);
}

//getDieResult get the list of result for a pool, and also the strenght
//parameters are name=the pool name, n=number of dice to be rolled
function getDieResult(name, n){
    if (n < 1){
        return [];
    }
    let results = [];
    for (let i = 0; i < n; i++) {
        let result = Rd6();
        setSuccess(name, result);
        results.push(result);
    }
    results.sort().reverse();
    return results;
}

//setSuccess calculate the number of success for player and for master
//parameters are name=name of the pool (ex. madness, pain) n=the number aka the number the dice rolled
function setSuccess(name, n){
    if ( n > 3)
        return;

    if (o.pool[name].player){
        o.success.player++;
        return;
    }
    o.success.master++;
}

//Rd6 return random integer between 1 and 6
function Rd6(){
    return getRndInteger(1, 7);
}

//getRndInteger return random integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
