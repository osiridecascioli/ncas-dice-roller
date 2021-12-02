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
        str: 0,
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

//getResults from form to data 
function getResults(formData){
    const rawData = getDataAndRoll(formData);
    /*
    //you can mock data as example below
    const rawData = {
        "discipline": 1,
        "discipline_rolls": [3],
        "exhaustion": 0,
        "exhaustion_rolls": [],
        "pain": 1,
        "pain_rolls": [3],
        "etalent":1,
        //"name": "pluto",
    }
    */
    elaborateData(rawData);
}

//elaborateData from rawData make NCaS calculation
function elaborateData(rawData){

    resetData();

    setDieRoll(rawData);

    setStrength(rawData)

    setSuccesses();

    setExhaustionTalent(rawData);

    setName(rawData);
    
    setWinner();

    setDominance();

    display();
}

//setSuccesses calculate player and master success
function setSuccesses(){
    for (let i = 0, pool = Object.keys(o.pool); i < pool.length; i++) {
        if (!o.pool[pool[i]].rolls){
            continue
        }
        for (let n = 0; n < o.pool[pool[i]].rolls.length; n++) {
            setSuccess(pool[i], o.pool[pool[i]].rolls[n]);
        }
    }
}

//setStrength set ALL pool strength
function setStrength(rawData){
    for (let i = 0, pool = Object.keys(o.pool); i < pool.length; i++) {
        o.pool[pool[i]].str = getStrength(o.pool[pool[i]].rolls);
    }
}

//getDataAndRoll return simple obj with the form data and rolled die
function getDataAndRoll(formData){
    const rawData = {};
    for (let i = 0, pool = Object.keys(o.pool); i < pool.length; i++) {
        let n = Number(formData.get(pool[i]))
        rawData[pool[i]] = n;
        rawData[pool[i]+"_rolls"] = getDieResult(pool[i], n);
    }
    rawData.etalent = Number(formData.get("etalent"));
    rawData.name = formData.get("name");
    return rawData;
}

//setName set player name
function setName(rawData){
    if (!('name' in rawData)){
        o.name = new Date().getTime();
        return;
    }
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
        [o.dominance.attribute, o.dominance.str] = getDominance(pool[i]);
    }
    setDominanceTxt();
}

//getDominance return dominance pool and strenght
function getDominance(c){
    if( !o.dominance.str || o.dominance.str == 0){
        return [c, getStrength(o.pool[c].rolls)];
    }
    let max = 0;
    let [a, s] = [o.dominance.attribute, o.dominance.str];
    let aP = {rolls:[], str:0};
    let cP = {rolls:[], str:0};
    [aP.rolls, aP.str] = copyPool(o.pool[a]);
    [cP.rolls, cP.str] = copyPool(o.pool[c]);
    //console.log(a, c);
    let debug = false;
    //debug = true;
    while (max < 6){ //6 è un numero arbitrario
        if (!aP.rolls.length && !cP.rolls.length){
            if (debug) console.log("le due serie di dadi sono vuote", a, c, aP, cP);
            //console.log(o.pool.pain.rolls, o.pool.discipline.rolls, aP.rolls );
            return [c, getStrength(o.pool[c].rolls)];
        }
        if (aP.rolls.length && !cP.rolls.length){
            if (debug) console.log("la nuova serie di dadi è vuota ",  a, c, aP, cP);
            return [a, s];
        }
        if (!aP.rolls.length && cP.rolls.length){
            if (debug) console.log("la vecchia serie di dadi è vuota ",  a, c, aP, cP);
            return [c, getStrength(o.pool[c].rolls)];
        }
        if (aP.rolls[0] > cP.rolls[0]){
            if (debug) console.log("il primo valore VECCHIO è più alto",  a, c, aP, cP);
            return [a, s];
        }
        if (aP.rolls[0] < cP.rolls[0]){
            if (debug) console.log("il primo valore NUOVO è più alto",  a, c, aP, cP);
            return [c, getStrength(o.pool[c].rolls)];
        }

        if (aP.str > cP.str){
            if (debug) console.log("la forza VECCHIA è più alta",  a, c, aP, cP);
            return [a, s];
        }
        if (aP.str < cP.str){
            if (debug) console.log("la forza NUOVA è più alta",  a, c, aP, cP);
            return [c, getStrength(o.pool[c].rolls)];
        }
        aP = nextDraw(aP);
        cP = nextDraw(cP);
        console.log("altro giro altra corsa!!", max);
        max++;
    };
    return ["cazzi", -1]
}

//nextDraw remove highest value/s from pool and recalculate strenght 
function nextDraw(p){
    let v = p.rolls[0];
    let nD = {rolls:[], str:0};
    for (let i = 0; i < p.rolls.length; i++) {
        if (p.rolls[i] >= v ){
            continue;
        }
        nD.rolls.push(p.rolls[i]);
    }
    nD.str = getStrength(nD.rolls);
    return nD;
}

//copyPool copy the pool
function copyPool(p){
    if (!p || !p.rolls || !p.rolls.length){
        return [[], 0];
    }
    let a = [];
    for (let i = 0; i < p.rolls.length; i++) {
        a.push(p.rolls[i]);
    }
    return [a, p.str];
}

//getStrength return the number of time the maximum number appear in an reverse sorted list ex [6,6,4,1] will return 2 
function getStrength(n){
    if(!n || !n.length){
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
    if (!etalent || etalent == 0){
        return;
    }
    let ext = rawData["exhaustion"];
    if (ext == 0 ){
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

//setDieRoll set rolled die for all the pool (ex. exhaustion, pain, madness)
//parameters: rawData=the data submitted and rolled
function setDieRoll(rawData){
    for (let i = 0, pool = Object.keys(o.pool); i < pool.length; i++) {
        setDieResults(rawData, pool[i]);
    }
}

//setDieResults set the result of die rolled
//parameters: formData=the data submitted, name=the name of the pool to be rolled
function setDieResults(rawData, name){
    o.pool[name].rolls = rawData[name+"_rolls"];
    //getDieResult(name, rawData[name]);
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
        results.push(result);
    }
    results.sort().reverse();
    return results;
}

//setSuccess calculate the number of success for player or for master
//parameters are name=name of the pool (ex. madness, pain) n=the number aka the number the die rolled
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
