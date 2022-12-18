let modInfo = {
	name: "The Progression Tree",
	id: "progmod",
	author: "Neigebank",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2.0",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br><br>
	<h3>v0.2.0</h3> <span style="opacity: 40%">December 17th 2022</span><br>
	→ Added the rebooting layer which has 4 milestones, x upgrades, etc.<br>
	→ Gradient-ified the branches.<br>
	→ Fixed a lot of bugs.<br>
	<i><small><span style="opacity: 60%">Endgame → ??? points</span></small></i>
	<br><br><br>
	<h3>v0.1.0</h3> <span style="opacity: 40%">December 11th 2022</span><br>
	→ Added the prestige layer and 9 upgrades. The name of this layer is subject to change.<br>
	→ Made the game look prettier.<br>
		<i><small><span style="opacity: 60%">Endgame → 100,000,000 points</span></small></i>
	<br><br><br>
	<h3>v0.0.0</h3> <span style="opacity: 40%">December 10th 2022</span><br>
	→ Started creating the game.<br>
		<i><small><span style="opacity: 60%">Endgame → What are you expecting?</span></small></i>
	<br><br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	if (hasUpgrade("p", "11")) {return true} else {return false}
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(1)
	if (hasUpgrade("p", 12)) gain = gain.times(upgradeEffect("p", 12))
	if (hasUpgrade("p", 13)) gain = gain.times(upgradeEffect("p", 13))
	if (hasUpgrade("p", 21)) gain = gain.times(upgradeEffect("p", 21))
	if (hasUpgrade("p", 22)) gain = gain.times(1.4)
	if (hasUpgrade("p", 23)) gain = gain.times(upgradeEffect("p", 23))
	if (hasUpgrade("p", 31)) gain = gain.times(upgradeEffect("p", 31))
	gain = gain.times(tmp.r.effect)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}