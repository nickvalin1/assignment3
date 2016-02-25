window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
    game.load.image('spaceship', 'assets/spaceship.png');
    game.load.image('space', 'assets/background.jpg');
    game.load.image('asteroid', 'assets/asteroid.png');
    game.load.audio('music', 'assets/music.wav');
    game.load.audio('death', 'assets/explosion.wav');
    game.load.image('explosion', 'assets/explosion.png');
    }
    
    var music;
    var player;
    var background;
    var asteroids;
    var cursors;
    var dead=false;
    var score=0;
    var scoreText;
    var deathText;
    var explosion;
    var sfx;
    var health=3;
    var healthText;
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        music=game.add.audio('music');
        music.play();
        
        background=game.add.sprite(0,0,'space');
        background.scale.setTo(.5,.5);
        
        player=game.add.sprite(200,250,'spaceship');
        game.physics.arcade.enable(player);
        player.scale.setTo(.2,.2);
        player.rotation=1.570795;
        player.body.collideWorldBounds=true;
        player.body.setSize(250,400,-50);
       
        scoreText=game.add.text(16,16,"Score: "+score, {fontSize: '28px', fill:'#ffffff', align: 'center'});
        healthText=game.add.text(16,550,"Health: "+health,{fontSize: '28px', fill:'#ffffff', align: 'center'});
        
        sfx=game.add.audio('death');
        
        asteroids=game.add.group();
        asteroids.enableBody=true;
        game.time.events.loop(Phaser.Timer.SECOND*.5, makeAsteroid, this);
        game.time.events.loop(Phaser.Timer.SECOND, increaseScore, this);
        
        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function makeAsteroid() {
        var asteroid=asteroids.create(750,game.rnd.integerInRange(0,10)*60, 'asteroid');
        var size=game.rnd.integerInRange(1,10)*.025
        asteroid.scale.setTo(size,size);
        asteroid.body.velocity.x=-200;
        asteroid.body.velocity.y=game.rnd.integerInRange(-10,10)*10;
    }
    
    function increaseScore() {
        if (!dead) {
            score++;
            scoreText.text="Score: "+score;
        } 
    }
    
    function death() {
        health--;
        if (health==0) {
            dead=true;
            explosion=game.add.sprite(player.x-50, player.y, 'explosion');
            explosion.scale.setTo(.2,.2);
            player.kill();
            music.stop();
            sfx.play();
        }
        healthText.text="Health: "+health;
    }
    
    function update() {
        game.physics.arcade.collide(player, asteroids,death,null,this);
        game.physics.arcade.collide(asteroids,asteroids);
        if (!dead) {
            if (cursors.up.isDown) {
                player.body.velocity.y=250;
            }
            else if (cursors.down.isDown) {
                player.body.velocity.y=-250;
            }
        }
        else {
            deathText=game.add.text(350,200,"You Lose!", {fontSize: '128px', fill:'#ffffff', align: 'center'});
            if (!sfx.isPlaying) {
                explosion.kill();
            }
        }
    }
};
