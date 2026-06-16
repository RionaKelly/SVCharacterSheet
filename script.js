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
var resolve;
var maxMP;
var physRes;
var mentRes;
var souls;
var blood;

var creationStage; // What stage of character creation the player has reached, for disabling modifying stats

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
const skills = [["Athletics", 0, 0, false], ["Acrobatics", 0, 0, false], ["Diplomacy", 0, 0, false], ["Intimidation", 0, 0, false], // 0-3
["Singing", 0, 0, false], ["Dancing", 0, 0, false], ["Instrument", 0, 0, true, ""], ["Deception", 0, 0, false], // 4-7
["Insight", 0, 0, false], ["History", 0, 0, false], ["Investigation", 0, 0, false], ["Stealth", 0, 0, false], // 8-11
["Tool/Trade", 0, 0, true, ""], ["Thievery", 0, 0, false], ["Nature", 0, 0, false], ["Knowledge", 0, 0, true, ""],  // 12-15
["Weapon Class", 0, 0, true, ""], ["Unarmed Strikes", 0, 0, true, ""], ["Linguistics", 0, 0, true, ""], ["Society", 0, 0, false], // 16-19
["Animal Handling", 0, 0, false], ["Performance", 0, 0, false], ["Work Ethic", 0, 0, false], ["Cooking", 0, 0, false],  // 20-23
["Survival", 0, 0, false], ["Appraisal", 0, 0, false], ["Medicine", 0, 0, false], ["Navigation", 0, 0, false],  // 24-27
["Arcana", 0, 0, false], ["Alchemy", 0, 0, false], ["Occultism", 0, 0, false], ["Religion", 0, 0, false], // 28-31
["Mechanics", 0, 0, false], ["Operate Machine", 0, 0, false], ["Pilot (Steed)", 0, 0, false], ["Pilot (Vehicle)", 0, 0, false]] // 32-35
var playerSkillAmount;

function categoryChange(choice) {
    // Toggles whether a category should be displayed or not

    var button = choice + "Button";
    var category = choice + "Category";

    if (document.getElementById(button).className == "bold") {
        document.getElementById(button).className = "";
        document.getElementById(category).style = "";
    } else {
        document.getElementById(button).className = "bold";
        document.getElementById(category).style = "display: block;";
    }
}

function lockChoice() {
    // Locks player choices and updates elements during Character Creation
    switch(creationStage) {
        case 0:
            if (origin != "") {
                creationStage = 1;
                document.getElementById("creationGuide").innerHTML = "2/4. Spend Ability Points on your Stats"
                document.getElementById("creationButton").innerHTML = "Lock Stats When Ready"
                document.getElementById("origin").setAttribute("readonly", true);
            }
            break;
        case 1:
            if (document.getElementById("abiPoints").value == 0) {
                creationStage = 2;
                document.getElementById("creationGuide").innerHTML = "3/4. Spend Skill Points on new Skills"
                document.getElementById("creationButton").innerHTML = "Next Step"
                document.getElementById("abiPointsContainer").style = "display: none;"
                document.getElementById("strScore").min = strScore;
                document.getElementById("agiScore").min = agiScore;
                document.getElementById("endScore").min = endScore;
                document.getElementById("minScore").min = minScore;
                document.getElementById("perScore").min = perScore;
                document.getElementById("lucScore").min = lucScore;
                document.getElementById("strScore").max = "12";
                document.getElementById("agiScore").max = "12";
                document.getElementById("endScore").max = "12";
                document.getElementById("minScore").max = "12";
                document.getElementById("perScore").max = "12";
                document.getElementById("lucScore").max = "12";
                document.getElementById("maxHP").removeAttribute('readonly');
                document.getElementById("curHP").removeAttribute('readonly');
                document.getElementById("maxMP").removeAttribute('readonly');
                document.getElementById("curMP").removeAttribute('readonly');
                document.getElementById("physRes").removeAttribute('readonly');
                document.getElementById("mentRes").removeAttribute('readonly');
                setBaseStats()
            }
            break;
        case 2:
            creationStage = 3;
            document.getElementById("creationGuide").innerHTML = "4/4. Spend Archetype Points to obtain new Perks"
            document.getElementById("creationButton").innerHTML = "Finished"
            updateInitiative()
            document.getElementById("initiative").setAttribute("readonly", false);
            document.getElementById("experience").removeAttribute('readonly');
            break;
        case 3:
            creationStage = 4;
            document.getElementById("creationGuide").innerHTML = "Your Character is ready :D Have fun!"
            document.getElementById("creationButton").innerHTML = "Hide Guide"
            break;
        case 4:
            creationStage = 5;
            document.getElementById("creationProgress").style = "display: none;"
            break;
    }
}

function originChange() {
    // Changes the characters origin. Stage = 0/1

    origin = document.getElementById("origin").value;

    // Resets variables changed by origins
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
            document.getElementById("abiPoints").value = 21;
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
            strScore = 2
            strMod = -2
            lucScore = 2
            lucMod = -2
            document.getElementById("strScore").value = 2;
            document.getElementById("strScore").min = 2;
            document.getElementById("lucScore").value = 2;
            document.getElementById("lucScore").min = 2;
            document.getElementById("strMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(-2);
            document.getElementById("lucMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(-2);
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
            document.getElementById("abiPoints").value = 21;
            break;
    }
    console.log("Origin set to " + origin)
}

function updateModifiers(ability) {
    // Sets Ability Scores/Modifiers. Stage = 1/2
    
    // Make sure player has an origin
    if (creationStage == 0) {
        switch (ability) {
            case "str":
                document.getElementById("strScore").value = strScore;
                break;
            case "agi":
                document.getElementById("agiScore").value = agiScore;
                break;
            case "end":
                document.getElementById("endScore").value = endScore;
                break;
            case "min":
                document.getElementById("minScore").value = minScore;
                break;
            case "per":
                document.getElementById("perScore").value = perScore;
                break;
            case "luc":
                document.getElementById("lucScore").value = lucScore;
                break;
        }
        return;
    } else if (creationStage == 1) {
        switch (ability) {
            case "str":
                document.getElementById("abiPoints").value = Number(document.getElementById("abiPoints").value) + (strScore - Number(document.getElementById("strScore").value));
                strScore = document.getElementById("strScore").value;
                strMod = (4 - strScore)*-1;
                document.getElementById("strMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(strMod);
                break;
            case "agi":
                document.getElementById("abiPoints").value = Number(document.getElementById("abiPoints").value) + (agiScore - Number(document.getElementById("agiScore").value));
                agiScore = document.getElementById("agiScore").value;
                agiMod = (4 - agiScore)*-1;
                document.getElementById("agiMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(agiMod);
                break;
            case "end":
                document.getElementById("abiPoints").value = Number(document.getElementById("abiPoints").value) + (endScore - Number(document.getElementById("endScore").value));
                endScore = document.getElementById("endScore").value;
                endMod = (4 - endScore)*-1;
                document.getElementById("endMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(endMod);
                break;
            case "min":
                document.getElementById("abiPoints").value = Number(document.getElementById("abiPoints").value) + (minScore - Number(document.getElementById("minScore").value));
                minScore = document.getElementById("minScore").value;
                minMod = (4 - minScore)*-1;
                document.getElementById("minMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(minMod);
                break;
            case "per":
                document.getElementById("abiPoints").value = Number(document.getElementById("abiPoints").value) + (perScore - Number(document.getElementById("perScore").value));
                perScore = document.getElementById("perScore").value;
                perMod = (4 - perScore)*-1;
                document.getElementById("perMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(perMod);
                break;
            case "luc":
                document.getElementById("abiPoints").value = Number(document.getElementById("abiPoints").value) + (lucScore - Number(document.getElementById("lucScore").value));
                lucScore = document.getElementById("lucScore").value;
                lucMod = (4 - lucScore)*-1;
                document.getElementById("lucMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(lucMod);
                break;
            default:
                console.log("Invalid Ability Given: " + ability)
        }
        // Check if Vampire's stats are impossible
        if ((origin == "Vampire") && (strScore == 1) && (agiScore == 1)) {
            document.getElementById("error").innerHTML = "Error: Vampire cannot have 1 Strength and Agility"
            document.getElementById("error").style = "display:block;"
        } else {
            document.getElementById("error").style = "display:none;"
        }
    } else {
        switch (ability) {
            case "str":
                    strScore = document.getElementById("strScore").value;
                    strMod = (4 - strScore)*-1;
                    document.getElementById("strMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(strMod);
                break;
            case "agi":
                    agiScore = document.getElementById("agiScore").value;
                    agiMod = (4 - agiScore)*-1;
                    document.getElementById("agiMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(agiMod);
                    updateMovementSpeeds();
                break;
            case "end":
                    document.getElementById("maxHP").value = Number(document.getElementById("maxHP").value) - endMod;
                    endScore = document.getElementById("endScore").value;
                    endMod = (4 - endScore)*-1;
                    document.getElementById("endMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(endMod);
                    document.getElementById("physRes").value = 10 + endMod;
                    document.getElementById("maxHP").value = Number(document.getElementById("maxHP").value) + endMod;
                    updateHP();
                break;
            case "min":
                    document.getElementById("maxMP").value = Number(document.getElementById("maxMP").value) - minMod;
                    minScore = document.getElementById("minScore").value;
                    minMod = (4 - minScore)*-1;
                    document.getElementById("minMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(minMod);
                    document.getElementById("mentRes").value = 10 + minMod;
                    document.getElementById("maxMP").value = Number(document.getElementById("maxMP").value) + minMod;
                    updateMP();
                break;
            case "per":
                    perScore = document.getElementById("perScore").value;
                    perMod = (4 - perScore)*-1;
                    document.getElementById("perMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(perMod);
                break;
            case "luc":
                    lucScore = document.getElementById("lucScore").value;
                    lucMod = (4 - lucScore)*-1;
                    document.getElementById("lucMod").value = new Intl.NumberFormat("en-US", {signDisplay: "exceptZero"}).format(lucMod);
                break;
            default:
                console.log("Invalid Ability Given: " + ability)
        }
    }
}

function setBaseStats() {
    // Sets the base values for miscelanious stats
    // Points (Bonus for Humans)
    if (origin == "Human") {
        document.getElementById("skiPoints").value = 8 + minMod;
        document.getElementById("arcPoints").value = 15;
    } else {
        document.getElementById("skiPoints").value = 5 + minMod;
        document.getElementById("arcPoints").value = 12;
    }

    // HP (Bonus for Human)
    if (origin == "Hornspawn") {
        maxHP = 11 + endMod;
    } else {
        maxHP = 10 + endMod;
    }
    document.getElementById("maxHP").value = maxHP;
    document.getElementById("curHP").max = maxHP;
    document.getElementById("curHP").value = maxHP;

    // MP
    maxMP = 5 + minMod;
    document.getElementById("maxMP").value = maxMP;
    document.getElementById("curMP").max = maxMP;
    document.getElementById("curMP").value = maxMP;

    // Status Resistances
    document.getElementById("physRes").value = 10 + endMod;
    document.getElementById("mentRes").value = 10 + minMod;

    // Misc
    document.getElementById("resolve").value = 0;
    updateDamageReductions();
    updateStatusImmunities();
    updateMovementSpeeds();
}

function updateHP() {
    // update HP
    maxHP = document.getElementById("maxHP").value;
    document.getElementById("curHP").max = maxHP;
}

function updateMP() {
    // update MP
    maxMP = document.getElementById("maxMP").value;
    document.getElementById("curMP").max = maxMP;
}

function updateInitiative() {
    //update initiative

    // set to highest modifier out of insight, stealth, deception, athletics, dance, or animal handling (if mounted)
    document.getElementById("initiative").value = 0;
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

function removeSkill() {
    // Removes the last row in the Skills Table 
    if (playerSkillAmount == 0) {
        return;
    }
    var table = document.getElementById("skillTable");
    var row = table.deleteRow(1);
    playerSkillAmount = playerSkillAmount - 1;
}

function addSkill() {
    // Adds a new row in the Skills Table 
    if (creationStage <= 2 ){//|| document.getElementById("skiPoints").value <= 0) {
        return;
    }

    var table = document.getElementById("skillTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    // Add some text to the new cells:
    cell1.innerHTML = '<input type="text" id="skillName' + playerSkillAmount + '" list="skillList" onchange="updateSkill(' + playerSkillAmount + ', ' + 0 + ')">';
    cell1.colSpan = 2;
    cell2.innerHTML = '<input type="number" min="0" max="10" value="0" id="skillLevel' + playerSkillAmount + '" readonly onchange="updateSkill(' + playerSkillAmount + ', ' + 1 + ')">';
    cell3.innerHTML = '<input type="number" min="0" value="0" id="skillMod' + playerSkillAmount + '" readonly onchange="updateSkill(' + playerSkillAmount + ', ' + 2 + ')">';
    cell4.innerHTML = '<input type="text" min="0" value= +0 id="skillFinal' + playerSkillAmount + '" readonly>';
    cell1.colSpan = 4;

    console.log("Skill " + playerSkillAmount + " added")
    playerSkillAmount = playerSkillAmount + 1;
}

function updateSkill(num, option) {
    switch (option) {
        case 0:
            var skillName = document.getElementById("skillName" + num).value;
            console.log(skillName)
            for (let i = 0; i < skills.length; i++) {
                if (skills[i][0] == skillName) {
                    console.log(skillName + " found in row " + num )
                    document.getElementById("skillName" + num).setAttribute('readonly', true);
                    document.getElementById("skillLevel" + num).removeAttribute('readonly');
                    document.getElementById("skillMod" + num).removeAttribute('readonly');
                    document.getElementById("skillLevel" + num).value = skills[i][1];
                    document.getElementById("skillMod" + num).value = skills[i][2];
                    // If skill is special
                    if (skills[i][3] == true) {
                        var row = document.getElementById("skillName" + num).parentElement.parentElement;
                        document.getElementById("skillName" + num).parentElement.colSpan = 2;
                        var cell = row.insertCell(1);
                        cell.innerHTML = '<input type="text" id="skillSpecial' + num + '" onchange="updateSkill(' + num + ', ' + 3 + ')">';
                        document.getElementById("skillSpecial" + num).parentElement.setAttribute('colspan', 2);
                        if (skillName == "Weapon Class") {
                            document.getElementById("skillSpecial" + num).setAttribute('list', 'weaponList');
                            console.log(skillName);
                        } else if (skillName == "Linguistics") {
                            document.getElementById("skillSpecial" + num).setAttribute('list', 'languageList');
                        }
                    }
                return;
                }
           }
            break;
        case 1:

            break;
        case 2:

            break;
    }
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
    console.log("Level Up")

    document.getElementById("arcPoints").value = document.getElementById("arcPoints").value + 9;
    if (level <= 15) {
    // HP: 1d8 + Endurance (+1 for Hornspawn)
    // MP: 1d4 + Mind
    } if (level <= 10) {
    // Skill Points: 1d4 + Mind
    }
}

function levelSubmit() {

}

function loadData() {
    // load the player's data or sets to defaults if no data saved

    // load data here
    console.log("Loading Data")

/*     if (saved != true) {
        resetData();
        return;
    } */
    resetData();

/*  updateHP();
    updateMP();
    updateInitiative();
    document.getElementById("resolve").value = resolve;
    document.getElementById("curHP").value = 7;
    document.getElementById("curMP").value = 2; */
    console.log("Loaded");
}

function resetData() {
        saved = true;
        creationStage = 5; // CHANGE THIS TO 0 !!!!
        name = "Character Name";
        origin = "";
        level = 1;
        experience = 0;
        strScore = 1;
        agiScore = 1;
        endScore = 1;
        minScore = 1;
        perScore = 1;
        lucScore = 1;
        playerSkillAmount = 0;
}
