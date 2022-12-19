addLayer("p", {
    name: "prestige",
    symbol: "P",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        higherResets: 0
    }},
    color: "#4c59b0",
    requires: new ExpantaNum(10),
    resource: "prestige points",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new ExpantaNum(1)
        if (hasUpgrade(this.layer, 13)) mult = mult.times(upgradeEffect(this.layer, 13))
        if (hasUpgrade(this.layer, 32)) mult = mult.times(upgradeEffect(this.layer, 32))
        if (hasUpgrade("r", 12)) mult = mult.times(upgradeEffect("r", 12))
        return mult
    },
    gainExp() {
        return new ExpantaNum(1)
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            let keep = []
            let upgKeep = []
            if (hasMilestone("r", 0) && resettingLayer == "r") upgKeep.push(11, 12, 13)
            if (hasMilestone("r", 1) && resettingLayer == "r") upgKeep.push(21, 22, 23)
            if (hasMilestone("r", 2) && resettingLayer == "r") upgKeep.push(31, 32, 33)
            layerDataReset("p", keep)
            player[this.layer].upgrades = upgKeep
            player[this.layer].higherResets += 1
        }
    },
    row: 0,
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    update(diff) {if (hasMilestone("r", 3)) generatePoints("p", diff)},
    layerShown(){return true},
    upgrades: {
        11: {
            title() {switch(player[this.layer].higherResets) {case 0: {return "Genesis"} case 1: {return "Regenesis"} case 2: {return "Reregenesis"} default: {return "Re<sup>" + player.r.resets + "</sup>genesis"}}}, // hehe
            description() {if (hasUpgrade(this.layer, 22)) {return "Start generating 1.4 points every second."} else {return "Start generating 1 point every second."}},
            cost: new ExpantaNum(0),
        },
        12: {
            title: "Prestige Boost",
            description: "Multiply point generation based on prestige points.",
            cost: new ExpantaNum(1),
            effect() {
                let eff = player[this.layer].points.add(1).sqrt()
                return softcap((hasUpgrade(this.layer, 22)) ? eff.mul(1.4) : eff, hasUpgrade(this.layer, 22) ? new ExpantaNum("1.4e6") : new ExpantaNum("1e6"), 0.1)
            },
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 12))},
            unlocked() {if (hasUpgrade(this.layer, 11)) {return true} else {return false}}
        },
        13: {
            title: "Double Synergy",
            description: "Boost prestige points and point generation based on points.",
            cost: new ExpantaNum(5),
            effect() {if (hasUpgrade(this.layer, 22)) {return ExpantaNum.pow(player.points.add(1), 0.13).mul(1.4)} else {return ExpantaNum.pow(player.points.add(1), 0.13)}},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 13))},
            unlocked() {if (hasUpgrade(this.layer, 12)) {return true} else {return false}}
        },
        21: {
            title: "Patience",
            description: "Your reset time boosts point generation.",
            cost: new ExpantaNum(20),
            effect() {return ExpantaNum.pow((player[this.layer].resetTime), 1/5).add(1)},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 21))},
            unlocked() {if (hasUpgrade(this.layer, 13)) {return true} else {return false}}
        }, 
        22: {
            title: "Multi-booster",
            description: "Boost all the upgrades on the first row by ×1.4.",
            cost: new ExpantaNum(100),
            unlocked() {if (hasUpgrade(this.layer, 21)) {return true} else {return false}}
        },
        23: {
            title: "Upgrader Power",
            description: "Your amount of prestige upgrades boosts point generation.",
            cost: new ExpantaNum(500),
            effect() {if (hasUpgrade('r', 11)) {return ExpantaNum.add(player[this.layer].upgrades.length, 1).pow(upgradeEffect("r", 11))} else {return ExpantaNum.add(player[this.layer].upgrades.length, 1)}},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 23))},
            unlocked() {if (hasUpgrade(this.layer, 22)) {return true} else {return false}}
        },

        31: {
            title: "Narcissism",
            description: "Points boost their own generation.",
            cost: new ExpantaNum(7500),
            effect() {return player.points.add(1).pow(0.1).add(1)},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 31))},
            unlocked() {if (hasUpgrade(this.layer, 23)) {return true} else {return false}}
        },

        32: {
            title: "Narcissism V2",
            description: "Prestige points boost their own gain.",
            cost: new ExpantaNum(50000),
            effect() {return ExpantaNum.log10(ExpantaNum.max(player[this.layer].points, 1)).add(1)},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 32))},
            unlocked() {if (hasUpgrade(this.layer, 31)) {return true} else {return false}}
        },
        33: {
            title: "Layering",
            description: "Unlock the rebooting layer.",
            cost: new ExpantaNum(500000),
            unlocked() {if (hasUpgrade(this.layer, 32)) {return true} else {return false}}
        }
    },
    infoboxes: {
        lore: {
            title: "Introductions.",
            body() {return "If you're wondering how this differs from other prestige tree mods, upgrades require. They don't cost. This game is inspired by various known incremental games."}
        }
    }
})

addLayer("r", {
    name: "rebooters",
    symbol: "R",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    branches: ["p"],
    color: "#20a181",
    requires: new ExpantaNum(1e6),
    resource: "rebooters",
    baseResource: "prestige points",
    baseAmount() {return player.p.points},
    type: "normal",
    exponent: 0.14,
    gainMult() { 
        mult = new ExpantaNum(1)
        if (hasUpgrade(this.layer, 13)) mult = mult.times(upgradeEffect(this.layer, 13))
        if (hasUpgrade(this.layer, 32)) mult = mult.times(upgradeEffect(this.layer, 32))
        return mult
    },
    effect() {return player[this.layer].points.add(1).pow(2.2)}, 
    effectDescription() {return "They are boosting point generation by <h2 style='color: " + tmp[this.layer].color + "; text-shadow: 0px 0px 10px'>×" + format(tmp[this.layer].effect) + "</h2>."}, // This is... sort of copied from Plague Tree...
    gainExp() {
        return new ExpantaNum(1)
    },
    layerShown() {if (hasUpgrade("p", 33)) {return true} else if (player[this.layer].unlocked) {return true} else {return false}},
    row: 1,
    milestones: {
        0: {
            requirementDescription: "3 rebooters",
            effectDescription: "Keep the first row of prestige upgrades on reboots.",
            done() {return player[this.layer].points.gte(3)}
        },

        1: {
            requirementDescription: "5 rebooters",
            effectDescription: "Keep the second row of prestige upgrades on reboots.",
            done() {return player[this.layer].points.gte(5)},
            unlocked() {return hasMilestone(this.layer, 0)}
        },

        2: {
            requirementDescription: "10 rebooters",
            effectDescription: "Keep the third row of prestige upgrades on reboots.",
            done() {return player[this.layer].points.gte(10)},
            unlocked() {return hasMilestone(this.layer, 1)}
        },
        3: {
            requirementDescription: "25 rebooters",
            effectDescription: "Get 100% of your prestige points gained on reset every second<br>and unlock rebooter upgrades.<br><i><small>(last milestone, for now)</small></i>",
            done() {return player[this.layer].points.gte(25)},
            unlocked() {return hasMilestone(this.layer, 2)}
        },
    },
    upgrades: {
        11: {
            title: "Upgrader Squarer",
            description: "Raise <i>Upgrader Power</i>'s <small>(6th prestige upgrade)</small> effect based on rebooter upgrades.",
            cost: new ExpantaNum(100),
            effect() {return ExpantaNum.pow(player[this.layer].upgrades.length * 2, 0.5).add(1)},
            effectDisplay() {return "↑" + format(upgradeEffect("r", 11))},
            unlocked() {if (hasMilestone("r", 3)) {return true} else {return false}},
        },
        12: {
            title: "Rebooter Synergy",
            description: "The square root of your rebooter effect affects prestige points.",
            cost: new ExpantaNum(250),
            effect() {return tmp[this.layer].effect.sqrt()},
            effectDisplay() {return "×" + format(upgradeEffect(this.layer, 12))},
            unlocked() {if (hasUpgrade("r", 11)) {return true} else {return false}},
        }
    },
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    infoboxes: {
        lore: {
            title: "Rebooters.",
            body() {
                let mainstr = "Rebooting resets the prestige layer. However, you get a boost to point gain based on your rebooters."
                if (!hasMilestone("r", 3)) {mainstr += "<br><br>Your goal now is to reach 25 rebooters and unlock rebooter upgrades."} else {mainstr += "<br><br>Rebooter upgrades require rebooters <i>(obviously)</i> and provide some good boosts."}
                return mainstr
            }
        }
    },
})
