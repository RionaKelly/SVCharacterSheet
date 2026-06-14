// Global Variables
var saved;
var name;
var origin;
var level;
var experience;

var strScore;
var strMod;
var agiScore;
var agiMod;
var endScore;
var endMod;
var minScore;
var minMod;
var perScore;
var perMod;
var lucScore;
var lucMod;

var maxHP;
var curHP;
var resolve;
var maxMP;
var curMP;
var physRes;
var mentRes;

// Name, Modifier
const damageReductions = [["Piercing", 0], ["Slashing", 0], ["Striking", 0], // 0-2
["Fire", 0], ["Lightning", 0], ["Corrosion", 0], ["Poison", 0], // 3-6
["Concussion", 0], ["Cold", 0], ["Hemorrhage", 0], ["Arcane", 0], // 7-10
["Holy", 0], ["Death", 0], ["Mental", 0], ["Void", 0]]; // 11-14
// Name, Owned?
const statusImmunities = [["Burning", false], ["Poisoned", false], ["Frostbite", false], ["Open Wounds", false], // false-3
["Horror", false], ["Irradiated", false], ["Fear", false], ["Weakened", false], // 4-7
["Demoralized", false], ["Toppled", false], ["Withered", false], ["Infection", false], // 8-11
["Fatique", false], ["Cursed", false], ["Provoked", false], ["Marked", false]]; // 12-15
// Name, Unit
const movementSpeeds = [["Walking", 1], ["Swimming", 0], ["Climbing", 0], ["Flying", 0]]

// Name, Level, Additional Mod, Special?
const skills = [["Athletics", 0, 0], ["Acrobatics", 0, 0, false], ["Diplomacy", 0, 0, false], ["Intimidation", 0, 0, false], // 0-3
["Singing", 0, 0, false], ["Dancing", 0, 0, false], ["Instrument", 0, 0, true], ["Deception", 0, 0, false], // 4-7
["Insight", 0, 0, false], ["History", 0, 0, false], ["Investigation", 0, 0, false], ["Stealth", 0, 0, false], // 8-11
["Tool/Trade", 0, 0, true], ["Thievery", 0, 0, false], ["Nature", 0, 0, false], ["Knowledge", 0, 0, true],  // 12-15
["Weapon Class", 0, 0, true], ["Unarmed Strikes", 0, 0, true], ["Linguistics", 0, 0, true], ["Society", 0, 0, false], // 16-19
["Animal Handling", 0, 0, false], ["Performance", 0, 0, false], ["Work Ethic", 0, 0, false], ["Cooking", 0, 0, false],  // 20-23
["Survival", 0, 0, false], ["Appraisal", 0, 0, false], ["Medicine", 0, 0, false], ["Navigation", 0, 0, false],  // 24-27
["Arcana", 0, 0, false], ["Alchemy", 0, 0, false], ["Occultism", 0, 0, false], ["Religion", 0, 0, false], // 28-31
["Mechanics", 0, 0, false], ["Operate Machine", 0, 0, false], ["Pilot (Steed)", 0, 0, false], ["Pilot (Vehicle)", 0, 0, false]] // 32-35

function categoryChange(category) {
    // Changes the current category being displayed
    document.getElementById("chaButton").style = "";
    document.getElementById("equButton").style = "";
    document.getElementById("comButton").style = "";
    document.getElementById("magButton").style = "";
    document.getElementById("perButton").style = "";
    document.getElementById("setButton").style = "";
    document.getElementById("chaCategory").style = "";
    document.getElementById("equCategory").style = "";
    document.getElementById("comCategory").style = "";
    document.getElementById("magCategory").style = "";
    document.getElementById("perCategory").style = "";
    document.getElementById("setCategory").style = "";

    switch(category) {
        case "cha":
            document.getElementById("chaButton").style = "font-weight: bold;";
            document.getElementById("chaCategory").style = "display: block;";
            break;        
        case "equ":
            document.getElementById("equButton").style = "font-weight: bold;";
            document.getElementById("equCategory").style = "display: block;";
            break;
        case "com":
            document.getElementById("comButton").style = "font-weight: bold;";
            document.getElementById("comCategory").style = "display: block;";
            break;
        case "mag":
            document.getElementById("magButton").style = "font-weight: bold;";
            document.getElementById("magCategory").style = "display: block;";
            break;
        case "per":
            document.getElementById("perButton").style = "display: inline; font-weight: bold;";
            document.getElementById("perCategory").style = "display: block;";
            break;
        case "set":
            document.getElementById("setButton").style = "display: inline; font-weight: bold;";
            document.getElementById("setCategory").style = "display: block;";
            break;
        default:
            console.log("Invalid Categoy Given")
    }
}

function updateModifiers() {
  // convert ability scores into modifiers
  
  strScore = document.getElementById("strScore").value;
  strMod = (4 - strScore)*-1;
  document.getElementById("strMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(strMod);
  agiScore = document.getElementById("agiScore").value;
  agiMod = (4 - agiScore)*-1;
  document.getElementById("agiMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format((4 - agiScore)*-1);
  endScore = document.getElementById("endScore").value;
  endMod = (4 - endScore)*-1;
  document.getElementById("endMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format((4 - endScore)*-1);
  minScore = document.getElementById("minScore").value;
  minMod = (4 - minScore)*-1;
  document.getElementById("minMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format((4 - minScore)*-1);
  perScore = document.getElementById("perScore").value;
  perMod = (4 - perScore)*-1;
  document.getElementById("perMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format((4 - perScore)*-1);
  lucScore = document.getElementById("lucScore").value;
  lucMod = (4 - lucScore)*-1;
  document.getElementById("lucMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format((4 - lucScore)*-1);

  updateStatRes();
  updateHP();
  updateMP();
  updateMovementSpeeds();

    // Error Checks
    if ((origin == "Vampire") && (strScore == 1) && (agiScore == 1)) {
        document.getElementById("error").innerHTML = "Error: Vampire cannot have 1 Strength and Agility"
        document.getElementById("error").style = "display:block;"
    } else {
        document.getElementById("error").style = "display:none;"
    }
}

function updateHP() {
    // update HP
    var bonus = 0;
    if (origin == "Hornspawn") {
        bonus = bonus + level;
    }

    maxHP = 10 + endMod + bonus;
    document.getElementById("maxHP").value = maxHP;
    document.getElementById("curHP").max = maxHP; 
}

function updateMP() {
    // update MP

    maxMP = 5 + minMod;
    document.getElementById("maxMP").value = maxMP;
    document.getElementById("curMP").max = maxMP; 
}

function updateInitiative() {
    //update initiative

    // set to highest modifier out of insight, stealth, deception, athletics, dance, or animal handling (if mounted)
    document.getElementById("initiative").value = 0;
}

function updateStatRes() {
    // update physical and mental status res

    document.getElementById("physRes").value = 10 + endMod;
    document.getElementById("mentRes").value = 10 + minMod;
}

function updateDamageReductions() {
    var text = ""
    for (let i = 0; i < damageReductions.length; i++) {
        if (damageReductions[i][1] > 0) {
            text += damageReductions[i][0] + " - " + String(damageReductions[i][1]) + "<br>";
        }   
    }

    var text = text.slice(0, -4);
    document.getElementById("damRed").innerHTML = text;
}

function updateStatusImmunities() {
    var text = ""
    for (let i = 0; i < statusImmunities.length; i++) {
        if (statusImmunities[i][1] > 0) {
            text += statusImmunities[i][0] + "<br>";
        }   
    }

    var text = text.slice(0, -4);
    document.getElementById("staImm").innerHTML = text;
}

function updateMovementSpeeds() {
    var text = ""
    var speed = 4 + agiMod
    for (let i = 0; i < movementSpeeds.length; i++) {
        if (movementSpeeds[i][1] > 0) {

            text += movementSpeeds[i][0] + " - " + speed + "m<br>";
        }
    }

    var text = text.slice(0, -4);
    document.getElementById("movSpe").innerHTML = text;
}

function originChange() {
    origin = document.getElementById("origin").value;

    document.getElementById("strScore").value = 1;
    document.getElementById("strScore").min = 1;
    document.getElementById("lucScore").value = 1;
    document.getElementById("lucScore").min = 1;
    
    for (let i = 0; i < damageReductions.length; i++) {
        damageReductions[i][1] = 0;
    }
    for (let i = 0; i < statusImmunities.length; i++) {
        statusImmunities[i][1] = 0;
    }
    for (let i = 1; i < movementSpeeds.length; i++) {
        movementSpeeds[i][1] = 0;
    }

    switch(origin) {
        case "Human":
            // +3 archetype points, +3 skill points, +1 to any ability
            break;
        case "Briarling":
            // +3 mental reduction
            damageReductions[13][1] = 3;
            break;
        case "Doll":
            // +3 poison reduction, +3 hemorrhage reduction. immune to poisoned, infection, open wounds
            damageReductions[6][1] = 3;
            damageReductions[9][1] = 3;
            statusImmunities[1][1] = 1;
            statusImmunities[3][1] = 1;
            statusImmunities[11][1] = 1;
            break;
        case "Hornspawn":
            // +1 strength, +1 luck, +1 hp per level, immune to fear
            document.getElementById("strScore").value = 2;
            document.getElementById("strScore").min = 2;
            document.getElementById("lucScore").value = 2;
            document.getElementById("lucScore").min = 2;
            statusImmunities[6][1] = 1;
            break;
        case "Scaled One: Sunborn":
            // + 3 fire reduction, +3 holy reduction, climbing speed = walking speed
            damageReductions[3][1] = 3;
            damageReductions[11][1] = 3;
            movementSpeeds[2][1] = 4 + agiMod
            break;
        case "Scaled One: Murkspawn":
            // +3 poison reduction, +3 death reduction, swimming speed = walking speed
            damageReductions[6][1] = 3;
            damageReductions[12][1] = 3;
            movementSpeeds[1][1] = 4 + agiMod
            break;
        case "Vampire":
            // +1 strength or agility
            break;
    }

    updateModifiers();
    updateDamageReductions()
    updateStatusImmunities()
    updateMovementSpeeds()
}

function expChange() {
    // check if exp has reached the requirement to level up

    experience = document.getElementById("experience").value;
    level = document.getElementById("level").value;
    var expRequirement;

    if (level >= 11) {
        expRequirement = 3000;
    } else {
        expRequirement = 1000 + ((level - 1) * 200);
    }

    if (experience >= expRequirement) {
        experience = (experience - expRequirement);
        document.getElementById("experience").value = experience;
        levelChange();
    }
}

function levelChange() {
    level = Number(level) + 1;
    document.getElementById("level").value = level;
    
    updateHP();
}

function loadData() {
    // load the player's data or sets to defaults if no data saved

    // load data here

    if (saved != true) {
        resetData();
        return;
    }

    updateModifiers();
    updateHP();
    updateMP();
    updateInitiative();
    document.getElementById("resolve").value = resolve;
    document.getElementById("curHP").value = 7;
    document.getElementById("curMP").value = 2;

}

function resetData() {
        saved = true;
        name = "Character Name";
        level = 1;
        experience = 0;
        maxHP = 7;
        resolve = 0;
        maxMP = 2;

        document.getElementById("maxHP").value = maxHP;
        document.getElementById("curHP").value = 7;
        document.getElementById("resolve").value = resolve;
        document.getElementById("maxMP").value = maxMP;
        document.getElementById("curMP").value = 2;
        document.getElementById("initiative").value = 0;
        
        updateModifiers();
}
