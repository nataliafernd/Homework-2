// variables in code only with "let" in front to declare them
let objects = [];
let inventory = [];
let objectsToFind = 8;
let monsterProgress = 0;
let monsterSpeed = 0.3;
let gameOver = false;
let won = false;
let bladeeImg1, bladeeImg2;
let win1, win2, lose1, lose2;

function preload() {
    // Load sound files here (before setup runs)
    bladeeImg1 = loadImage('bladeee2.jpg');
    bladeeImg2 = loadImage('Bladeee1.jpg');
    win1 = loadSound('cute_scream.wav');
    win2 = loadSound('cute_music.mp3');
    lose1 = loadSound('scary_voice.ogg');
    lose2 = loadSound('Distorted_noize.wav');
}

function setup() {
    createCanvas(800, 600);
    resetGame();
}

function draw() {
    background(0);
    
    if (!gameOver) {
        // Draw all objects
        for (let obj of objects) {
            drawObject(obj);
        }
        
        drawFlashlight();
        drawMonsterBar();
        drawInventory();
        
        monsterProgress += monsterSpeed;
        
        // Check win condition
        if (objects.length === 0) {
            won = true;
            gameOver = true;
        }
        
        // Check lose condition
        if (monsterProgress >= width) {
            won = false;
            gameOver = true;
        }
        
    } else {
        showEndScreen();
    }
}

function mousePressed() {
    if (gameOver) {
        resetGame();
        return;
    }
    
    // Check if clicked on an object
    for (let i = objects.length - 1; i >= 0; i--) {
        let obj = objects[i];
        if (dist(mouseX, mouseY, obj.x, obj.y) < obj.size/2 && 
            dist(mouseX, mouseY, obj.x, obj.y) < 120) {
            inventory.push(obj.name);
            objects.splice(i, 1);
            break;
        }
    }
}

function resetGame() {
    objects = [];
    inventory = [];
    monsterProgress = 0;
    gameOver = false;
    won = false;
    
    if (win1) win1.stop();
    if (win2) win2.stop();
    if (lose1) lose1.stop();
    if (lose2) lose2.stop();
    
    let objectNames = ["skull", "candle", "book", "potion", "cross", "key", "chain", "coffin"];
    for (let i = 0; i < objectsToFind; i++) {
        objects.push({
            x: random(100, width - 100),
            y: random(100, height - 100),
            name: objectNames[i],
            size: random(30, 50)
        });
    }
}

function drawObject(obj) {
    fill(60);
    noStroke();
    
    if (obj.name === "skull") {
        ellipse(obj.x, obj.y, obj.size, obj.size);
        ellipse(obj.x - obj.size/4, obj.y - obj.size/6, obj.size/4, obj.size/4);
        ellipse(obj.x + obj.size/4, obj.y - obj.size/6, obj.size/4, obj.size/4);
    } else if (obj.name === "candle") {
        rect(obj.x - obj.size/6, obj.y, obj.size/3, obj.size);
        triangle(obj.x - obj.size/6, obj.y, obj.x + obj.size/6, obj.y, obj.x, obj.y - obj.size/3);
    } else if (obj.name === "book") {
        rect(obj.x - obj.size/2, obj.y - obj.size/3, obj.size, obj.size * 0.6);
    } else if (obj.name === "potion") {
        rect(obj.x - obj.size/4, obj.y, obj.size/2, obj.size * 0.6);
        ellipse(obj.x, obj.y - obj.size/3, obj.size/2, obj.size/2);
    } else if (obj.name === "cross") {
        rect(obj.x - obj.size/8, obj.y - obj.size/2, obj.size/4, obj.size);
        rect(obj.x - obj.size/2, obj.y - obj.size/1, obj.size, obj.size/4);
    } else if (obj.name === "key") {
        ellipse(obj.x - obj.size/2, obj.y-obj.size/6, obj.size/2, obj.size/2);
        ellipse(obj.x - obj.size/2, obj.y-obj.size/6, obj.size/2, obj.size/2);
        rect(obj.x - obj.size/6, obj.y-obj.size/3, obj.size * 0.6, obj.size/6);
    } else if (obj.name === "chain") {
        for (let i = 0; i < 4; i++) {
            ellipse(obj.x, obj.y + i * obj.size/4, obj.size/4, obj.size/4);
        }
    } else {
        ellipse(obj.x, obj.y, obj.size, obj.size);
    }
}

function drawFlashlight() {
    fill(0);
    rect(0, 0, width, height);
    
    // Flashlight glow
    for (let i = 150; i > 0; i -= 10) {
        fill(0, 255 - i);
        noStroke();
        ellipse(mouseX, mouseY, i * 2, i * 2);
    }
    
    // Reveal objects under flashlight
    for (let obj of objects) {
        if (dist(mouseX, mouseY, obj.x, obj.y) < 120) {
            fill(200, 200, 150, 200);
            noStroke();
            
            if (obj.name === "skull") {
                ellipse(obj.x, obj.y, obj.size, obj.size);
                fill(50);
                ellipse(obj.x - obj.size/4, obj.y - obj.size/6, obj.size/4, obj.size/4);
                ellipse(obj.x + obj.size/4, obj.y - obj.size/6, obj.size/4, obj.size/4);
            } else if (obj.name === "candle") {
                rect(obj.x - obj.size/6, obj.y, obj.size/3, obj.size);
                triangle(obj.x - obj.size/6, obj.y, obj.x + obj.size/6, obj.y, obj.x, obj.y - obj.size/3);
                fill(255, 200, 0);
                ellipse(obj.x, obj.y - obj.size/2, obj.size/5, obj.size/3);
            } else if (obj.name === "book") {
                rect(obj.x - obj.size/2, obj.y - obj.size/3, obj.size, obj.size * 0.6);
            } else if (obj.name === "potion") {
                fill(100, 50, 150, 200);
                rect(obj.x - obj.size/4, obj.y, obj.size/2, obj.size * 0.6);
                ellipse(obj.x, obj.y - obj.size/3, obj.size/2, obj.size/2);
            } else if (obj.name === "cross") {
                fill(150, 150, 150);
                rect(obj.x - obj.size/8, obj.y - obj.size/2, obj.size/4, obj.size);
                rect(obj.x - obj.size/2, obj.y - obj.size/6, obj.size, obj.size/4);
            } else if (obj.name === "key") {
                fill(200, 180, 100);
                ellipse(obj.x - obj.size/3, obj.y, obj.size/3, obj.size/3);
                rect(obj.x - obj.size/6, obj.y, obj.size * 0.6, obj.size/6);
            } else if (obj.name === "chain") {
                fill(150);
                for (let i = 0; i < 4; i++) {
                    ellipse(obj.x, obj.y + i * obj.size/4, obj.size/4, obj.size/4);
                }
            } else {
                ellipse(obj.x, obj.y, obj.size, obj.size);
            }
        }
    }
}

function drawMonsterBar() {
    fill(100, 0, 0);
    rect(0, 0, width, 30);
    fill(200, 0, 0);
    rect(0, 0, monsterProgress, 30);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("SOMETHING IS COMING...find the objects before its too late", width/2, 15);
}

function drawInventory() {
    fill(50, 50, 50, 200);
    rect(10, height - 60, 200, 50);
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(14);
    text("Found: " + inventory.length + "/" + objectsToFind, 20, height - 35);
}

function showEndScreen() {
    fill(0);
    rect(0, 0, width, height);
    
    if (won) {
        // Victory screen
        if (bladeeImg2 != null) {
            imageMode(CENTER);
            image(bladeeImg2, width/2, height/2, 400, 400);
            if (win1 != null) win1.play();
            if (win2 != null) win2.play();
        }
        fill(200, 255, 200);
        textAlign(CENTER, CENTER);
        textSize(48);
        text("YOU ESCAPED!", width/2, 80);
        textSize(24);
        text("Congrats diva, bladee is proud", width/2, height - 100);
        text("Click to play again", width/2, height - 60);
        
    } else {
        // Death screen
        if (bladeeImg1 != null) {
            imageMode(CENTER);
            image(bladeeImg1, width/2, height/2, 400, 500);
        } else {
            if (lose1 != null) lose1.play();
            if (lose2 != null) lose2.play();
            
            fill(150, 0, 0);
            ellipse(width/2, height/2 - 50, 200, 200);
            fill(255, 0, 0);
            textAlign(CENTER, CENTER);
            textSize(64);
            text("dEaTh", width/2, height/2 - 50);
        }
        
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text("Click to try again", width/2, height - 60);
    }
}
