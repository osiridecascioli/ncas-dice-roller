const form = document.forms[0];

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    // do stuff
    for (const formElement of formData) {
        //console.log(formElement);
    }
    dieRoll(formData);
});

const diceToken = {
    discipline:[],
    madness:[],
    exhaustion:[],
    pain:[],
    assist:[],
    etalent:0
};

const playerStat = ["discipline", "madness", "exhaustion", "assist"];

let pSuccess = 0;

let mSuccess = 0;

function dieRoll(formData){
    pSuccess = 0;
    mSuccess = 0;
    //console.log("dieRoll: "+formData)
    parseName(formData, "discipline");
    parseName(formData, "madness");
    parseName(formData, "exhaustion");
    parseName(formData, "assist");
    parseName(formData, "pain");
    console.log(diceToken);
    let etalent = Number(formData.get("etalent"));
    let etalent_effect = "";
    let exhaustion = Number(formData.get("exhaustion"));
    if (etalent == 1){
        if (pSuccess < exhaustion){
            pSuccess = exhaustion;
        }
        etalent_effect = "Uso Minore. Minimo "+exhaustion+" successi.";
    } else if (etalent == 2){
        pSuccess = pSuccess + exhaustion;
        etalent_effect = "Uso Maggiore. +"+exhaustion+" successi.";
    }
    console.log(etalent_effect);
    console.log("pSuccess: "+pSuccess);
    console.log("mSuccess: "+mSuccess);
    let winner = "Il giocatore ";
    if (pSuccess >= mSuccess)
        winner += "vince ";
    else
        winner += "perde ";
    winner = winner + pSuccess + " a " + mSuccess + ";";
    console.log(winner);
}

function sMax(){
    let d = 0;
    let m = 0;
    let e = 0;
    let p = 0;
    if (diceToken.discipline.length > 0){
        d = diceToken.discipline[0];
    }
    if (diceToken.madness.length > 0){
        m = diceToken.madness[0];
    }
    if (diceToken.exhaustion.length > 0){
        e = diceToken.exhaustion[0];
    }
    if (diceToken.pain.length > 0){
        p = diceToken.pain[0];
    }
    return Math.max(d, m , e, p);
}

function parseName(formData, name){
    diceToken[name] = getResult(name, Number(formData.get(name)))
}

function getResult(name, token){
    //console.log("getResult name: "+name+"; token: "+token+";")
    let results = [];
    for (let i = 0; i < token; i++) {
        let n = Rd6();
        if ( n > 3){
            if ( playerStat.includes(name)){
                pSuccess++; 
            } else if (name == "pain"){
                mSuccess++;
            }
        }
        //console.log("getRndInteger name: "+name+"; token: "+n+";");
        results.push(n);
    }
    results.sort().reverse();
    return results;
}

function Rd6(){
    return getRndInteger(1, 7);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}