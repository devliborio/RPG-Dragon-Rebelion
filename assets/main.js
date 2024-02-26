(function () {

    let currentWeapon = 0;
    let monsterHealth;
    let inventory = ["stick"];
    let fighting;
    let health = 100;
    let gold = 50;
    let xp = 0;

    const BUTTON1 = document.querySelector("#button1");
    const BUTTON2 = document.querySelector("#button2");
    const BUTTON3 = document.querySelector("#button3");
    const TEXT = document.querySelector("#text");
    const xpText = document.querySelector("#xpText");
    const weapons = [
        { name: "stick", power: 5 },
        { name: "dagger", power: 30 },
        { name: "claw hammer", power: 50 },
        { name: "sword", power: 100 }
    ];

    const monsters = [
        { name: "slime", level: 2, health: 15 },
        { name: "fanged beast", level: 8, health: 60 },
        { name: "dragon", level: 20, health: 300 }
    ];

    let n = weapons.map(element => {
        return element.name
    });

    const locations = [
        {
            name: "town square",
            "button text": ["Go to store", "Go to cave", "Fight dragon"],
            "button functions": [goStore, goCave, fightDragon,],
            text: "You are in the town square. You see a sign that says \"Store\"."
        },

        {
            name: "store",
            "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
            "button functions": [buyHealth, buyWeapon, goTown],
            text: `You enter the store. \n\n Weapons available: ${n.join(", ")}`
        },

        {
            name: "cave",
            "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
            "button functions": [fightSlime, fightBeast, goTown],
            text: "You enter the cave. You see some monsters."
        },

        {
            name: "fight",
            "button text": ["Attack", "Dodge", "Run"],
            "button functions": [attack, dodge, goTown],
            text: "You are fighting a monster."
        },

        {
            name: "kill monster",
            "button text": ["Go to town square", "Go to town square", "Go to town square"],
            "button functions": [goTown, goTown, easterEgg,],
            text: 'The monster screams "Arg"! as it dies. You gain experience points and find gold.'
        },

        {
            name: "lose",
            "button text": ["REPLAY?", "REPLAY?", "REPLAY?",],
            "button functions": [restart, restart, restart],
            text: "You die. ☠️"
        },

        {
            name: "win",
            "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
            "button functions": [restart, restart, restart],
            text: "You defeat the dragon! YOU WIN THE GAME! 🎆"
        },

        {
            name: "easter egg",
            "button text": ["2", "8", "Go to town square?"],
            "button functions": [pickTwo, pickEight, goTown],
            text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
        }

    ];

    const healthText = document.querySelector("#healthText");
    healthText.innerText = health
    const goldText = document.querySelector("#goldText");
    goldText.innerText = gold
    const monsterStats = document.querySelector("#monsterStats");
    const monsterName = document.querySelector("#monsterName");
    const monsterHealthText = document.querySelector("#monsterHealth");


    //initializing buttons
    BUTTON1.onclick = goStore;
    BUTTON2.onclick = goCave;
    BUTTON3.onclick = fightDragon;

    function update(location) {
        monsterStats.style.display = "none"
        BUTTON1.innerText = location["button text"][0];
        BUTTON2.innerText = location["button text"][1];
        BUTTON3.innerText = location["button text"][2];

        BUTTON1.onclick = location["button functions"][0];
        BUTTON2.onclick = location["button functions"][1];
        BUTTON3.onclick = location["button functions"][2];

        TEXT.innerText = location.text;
    };

    function goStore() {
        update(locations[1]);
    };

    function goCave() {
        update(locations[2]);
    };

    function goTown() {
        update(locations[0]);
    };

    function goFight() {
        update(locations[3]);
        monsterName.innerText = monsters[fighting].name
        monsterHealth = monsters[fighting].health;
        monsterHealthText.innerText = monsterHealth;
        monsterStats.style.display = "block";
    };

    function fightDragon() {
        fighting = 2;
        goFight();
    };

    function fightSlime() {
        fighting = 0;
        goFight();
    };

    function fightBeast() {
        fighting = 1;
        goFight();
    };

    function buyHealth() {
        if (gold >= 10) {
            goldText.innerText = gold -= 10;
            healthText.innerText = health += 10;
        } else {
            TEXT.innerText = "You do not have enough gold to buy health.";
        };
    };

    function buyWeapon() {
        if (currentWeapon < weapons.length - 1) {
            if (gold >= 30) {
                goldText.innerText = gold -= 30;
                currentWeapon++;
                let newWeapon = weapons[currentWeapon].name;
                TEXT.innerText = `You now have a : ${newWeapon}\n\n`;
                inventory.push(newWeapon);
                TEXT.innerText += `In your inventory you have: ${inventory.join(", ")}`;
            } else {
                TEXT.innerText = "You do not have enough gold to buy a weapon.";
            }
        } else {
            BUTTON2.innerText = "Sell weapon for 15 gold";
            BUTTON2.onclick = sellWeapon;
            TEXT.innerText = "You already have the most powerful weapon!";
        };
    };

    function sellWeapon() {
        if (inventory.length > 1) {
            goldText.innerText = gold += 15;
            let currentWeapon = inventory.shift();
            TEXT.innerText = `You sold a: ${currentWeapon}\n\n`;
            TEXT.innerText += ` In your inventory you have: ${inventory.join(", ")}`;
        } else {
            TEXT.innerText = "Don't sell your only weapon!";
        };
    };

    function attack() {
        TEXT.innerText = `The ${monsters[fighting].name} attacks.\n\n`;
        TEXT.innerText += `You attack it with your ${weapons[currentWeapon].name}`;
        health -= getMonsterAttackValue(monsters[fighting].level);
        if (isMonsterHit()) {
            monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
        } else {
            TEXT.innerText += "\n\n You miss.";
        }
        healthText.innerText = health;
        monsterHealthText.innerText = monsterHealth;

        if (health <= 0) {
            lose();
        } else if (monsterHealth <= 0) {
            if (fighting === 2) {
                winGame();
            } else {
                defeatMonster();
            };
        };

        if (Math.random() <= .1 && inventory.length !== 1) {
            TEXT.innerText += ` Your ${inventory.pop()} breaks`;
            currentWeapon--;
        }
    };

    function getMonsterAttackValue(level) {
        const hit = (level * 5) - (Math.floor(Math.random() * xp)); // Isso definirá o ataque do monstro para cinco vezes o seu nível menos um número aleatório entre 0 e o XP do jogador.
        console.log(hit);
        return hit > 0 ? hit : 0;
    }

    function isMonsterHit() {
        return Math.random() > .2 || health < 20;
    }

    function dodge() {
        TEXT.innerText = `You dodge the attack from the ${monsters[fighting].name}`;
    };

    function defeatMonster() {
        gold += Math.floor(monsters[fighting].level * 6.7);
        xp += monsters[fighting].level;
        xpText.innerText = xp;
        goldText.innerText = gold;
        update(locations[4]);
    };

    function lose() {
        update(locations[5]);
    };

    function winGame() {
        update(locations[6]);
    };

    function restart() {
        health = 100;
        gold = 50;
        xp = 0;
        currentWeapon = 0;
        inventory = ["stick"];
        healthText.innerText = health;
        goldText.innerText = gold;
        xpText.innerText = xp;
        goTown();
    };

    function easterEgg() {
        update(locations[7]);
    };

    function pick(guess) {
        const numbers = []
        while (numbers.length < 10) {
            numbers.push(Math.floor(Math.random() * 11));
        }
        TEXT.innerText = `You picked ${guess}. Here are the random numbers:\n`

        for (let i = 0; i < 10; i++) {
            TEXT.innerText += `${numbers[i]}\n`;
        }

        if (numbers.includes(guess)) {
            TEXT.innerText += "Right! You win 20 gold!";
            gold += 20;
            goldText.innerText = gold;
        } else {
            TEXT.innerText += "Wrong! You lose 10 health!"
            health -= 10;
            healthText.innerText = health;
            if (health <= 0) {
                lose()
            }
        }
    };

    function pickTwo() {
        pick(2);
    };

    function pickEight() {
        pick(8);
    };
})()