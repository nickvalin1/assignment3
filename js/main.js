window.onload = function() {
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
    game.load.image('spaceship', 'assets/spaceship.png');
    game.load.image('space', 'assets/background.jpg');
    game.load.image('asteroid', 'assets/asteroid.png');
    }
    
    var player;
    var background;
    var asteroids;
    var cursors;
    var dead=false;
    var score=0;
    var scoreText;
    var deathText;
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        background=game.add.sprite(0,0,'space');
        background.scale.setTo(.5,.5);
        
        player=game.add.sprite(55,250,'spaceship');
        game.physics.arcade.enable(player);
        player.scale.setTo(.2,.2);
        player.rotation=1.570795;
        player.body.collideWorldBounds=true;
        player.body.setSize(250,400,-50);
       
        scoreText=game.add.text(16,16,"Score: "+score, {fontSize: '28px', fill:'#ffffff', align: 'center'});
        
        asteroids=game.add.group();
        asteroids.enableBody=true;
        game.time.events.loop(Phaser.Timer.SECOND, makeAsteroid, this);
        game.time.events.loop(Phaser.Timer.SECOND, increaseScore, this);
        
        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function makeAsteroid() {
        var asteroid=asteroids.create(750,Math.random()*600, 'asteroid');
        asteroid.scale.setTo(.2,.2);
        asteroid.body.velocity.x=-200;
    }
    
    function increaseScore() {
        if (!dead) {
            score++;
            scoreText.text="Score: "+score;
        } 
    }
    
    function death() {
        dead=true;
    }
    
    function update() {
        game.physics.arcade.collide(player, asteroids,death,null,this);
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
        }
    }
};
