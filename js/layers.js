addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#197029",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade(this.layer, 13)) mult = mult.times(upgradeEffect(this.layer, 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the        (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Genesis.",
            description() {if (hasUpgrade(this.layer, 22)) {return "Start generating 1.25 points every second."} else {return "Start generating 1 point every second."}},
            cost: new ExpantaNum(0),
        },
        12: {
            title: "Prestige Boost.",
            description: "Multiply point generation based on prestige points.",
            cost: new ExpantaNum(1),
            effect() {if (hasUpgrade(this.layer, 22)) {return ExpantaNum.sqrt(player[this.layer].points.add(1)).mul(1.25)} else {return ExpantaNum.sqrt(player[this.layer].points.add(1))}},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 12))},
            unlocked() {if (hasUpgrade(this.layer, 11)) {return true} else {return false}}
        },
        13: {
            title: "Double Synergy.",
            description: "Boost prestige points and point generation based on points.",
            cost: new ExpantaNum(5),
            effect() {if (hasUpgrade(this.layer, 22)) {return ExpantaNum.pow(player.points.add(1), 0.13).mul(1.25)} else {return ExpantaNum.pow(player.points.add(1), 0.13)}},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 13))},
            unlocked() {if (hasUpgrade(this.layer, 12)) {return true} else {return false}}
        },
        21: {
            title: "Patience.",
            description: "Your reset time boosts point generation.",
            cost: new ExpantaNum(20),
            effect() {if (hasUpgrade(this.layer, 23)) {return ExpantaNum.pow((player[this.layer].resetTime), 1/5).add(1).pow(upgradeEffect(this.layer, 23))} else {return ExpantaNum.pow((player[this.layer].resetTime), 1/5).add(1)}},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 21))},
            unlocked() {if (hasUpgrade(this.layer, 13)) {return true} else {return false}}
        }, 
        22: {
            title: "Boosting Power.",
            description: "Boost all the upgrades on the first row by ×1.25.",
            cost: new ExpantaNum(75),
            unlocked() {if (hasUpgrade(this.layer, 21)) {return true} else {return false}}
        },
        23: {
            title: "Super Upgrades.",
            description: "Your amount of upgrades boosts Patience.",
            cost: new ExpantaNum(75),
            effect() {return ExpantaNum.pow(player[this.layer].upgrades.length, 0.4)},
            effectDisplay() {return "^" + format(upgradeEffect(this.layer, 23))},
            unlocked() {if (hasUpgrade(this.layer, 22)) {return true} else {return false}}
        }
    },
    infoboxes: {
        lore: {
            title: "Introductions.",
            body() {return "If you're wondering how this differs from other prestige tree mods, upgrades require. They don't cost."}
        }
    }
})
