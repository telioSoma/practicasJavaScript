
function Player(name, attributes) {
    this.name = name;
    this.level = 1;
    this.hp = attributes.hp || 0;
    this.mp = attributes.mp || 0;
    this.basicAttack = attributes.basicAttack || 0;
    this.intellect = attributes.intellect || 0;
    this.strength = attributes.strength || 0;
    this.agility = attributes.agility || 0;
    this.xp = attributes.xp || 0;
    this.skillPoints = 1;
    this.skills = [];
}

function Mage(name) {
    Player.call(this, name, {
        hp: 20,
        mp: 15,
        basicAttack: 1,
        intellect: 3,
        strength: 1,
        agility: 1
    });
    this.skillsTree = {
        fireball: new Skill('fireball', 'dmg', 5, 4, 1),
        wisp: new Skill('wisp', 'dmg', 2, 2, 6)
    };
}

Mage.prototype = Object.create(Player.prototype);

function Warrior(name) {
    Player.call(this, name, {
        hp: 30,
        mp: 5,
        basicAttack: 1,
        intellect: 1,
        strength: 3,
        agility: 1
    });
    this.skillsTree = {
        slam: new Skill('slam', 'dmg', 3, 2, 1),
        shield: new Skill('shield', 'heal', 3, 2, 7)
    };
}

Warrior.prototype = Object.create(Player.prototype);

function Rogue(name) {
    Player.call(this, name, {
        hp: 25,
        mp: 10,
        basicAttack: 1,
        intellect: 1,
        strength: 3,
        agility: 1
    });
    this.skillsTree = {
        punch: new Skill('punch', 'dmg', 4, 3, 1),
        stealth: new Skill('stealth', 'heal', 0, 0, 10)
    };
}

Rogue.prototype = Object.create(Player.prototype);

function Minion(name) {
    Player.call(this, name, {
        hp: 10,
        mp: 0,
        basicAttack: 1,
        intellect: 1,
        strength: 1,
        agility: 1,
        xp : 3       
    });
}

Minion.prototype = Object.create(Player.prototype);

Player.prototype.learnSkill = function (name) {
    var skill = this.skillsTree[name]
    if (this.skillPoints > 0) {
        this.skills.push(skill);
        this.skillPoints--;
    } else if (this.level < skill.level) {
        console.log('No tienes suficiente nivel')
    } else {
        console.log('No tienes puntos de habilidad')
    }
}

Player.prototype.useSkill = function (player, skillName) {
    var skill = this.skills.filter(
        function (e) {
            if (e.name == skillName) return e;
        }).pop();
    if (skill.type == 'dmg' && this.mp >= skill.cost) {
        var damage = skill.value + (this.intellect * 0.1);
        player.hp -= damage;
        this.mp -= skill.cost;
        if(player.hp>0){
            console.log(this.name + ' ha usado ' + skill.name + ' contra ' + player.name + ' y le ha causado ' + damage +
            ' dejando a ' + player.name + ' a ' + player.hp + ' hp.');
        }else{
            this.kill(player);
        }
        
    } else if (skill.type == 'heal' && this.attributes.mp >= skill.cost) {
        var heal = skill.value + (this.attributes.intellect * 0.1);
        player.attributes.hp += heal;
        this.mp -= skill.cost;
        console.log(this.name + ' ha usado ' + skill.name + ' en ' + player.name + ' y le ha curado ' + heal +
            ' dejando a ' + player.name + ' a ' + player.attributes.hp + ' hp.');
    } else {
        console.log('No te quedan mp.');
    }
}

Player.prototype.autoAttack = function (player) {
    var daño = this.basicAttack + (this.strength * 0.1);
    player.hp -= daño;
    console.log(this.name + ' ha atacado a ' + player.name + ' y le ha causado ' + daño + ' dejando a ' +
        player.name + ' a ' + player.hp + ' hp.');
}

Player.prototype.remainXP = function () {
    return (Math.pow(this.level, 2) * (this.level));
}

Player.prototype.kill = function (player) {
    console.log(this.name + ' ha matado a ' + player.name +' obteniendo ' +
    player.xp + ' puntos de esperiencia.');
    this.xp += player.xp;    
    if (this.xp>=this.remainXP()){        
        this.xp = 0 +this.xp - this.remainXP();
        this.level++;
        this.skillPoints++;
        console.log(this.name + ' ha subido al nivel '+ this.level+', ' + this.name +' tiene ' +
        this.skillPoints + ' puntos de habilidad.');    
    }
}

function Skill(name, type, value, cost, level) {
    this.name = name;
    this.type = type;
    this.value = value;
    this.cost = cost;
    this.level = level;
}

var player1 = new Mage('Jorge');
var player2 = new Warrior('Telio');
var minion = new Minion('minion1');
player1.level = 2;
player1.learnSkill('fireball');
player2.learnSkill('slam');
