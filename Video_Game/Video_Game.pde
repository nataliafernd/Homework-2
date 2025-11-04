import processing.sound.*;

// arrays, images, n stuff 
ArrayList<GameObject> objects;
ArrayList<String> inventory;
int objectsToFind = 8;
float monsterProgress = 0;
float monsterSpeed = 0.3;
boolean gameOver = false;
boolean won = false;
PImage bladeeImg1, bladeeImg2;
SoundFile win1, win2, lose1, lose2;

class GameObject {
  float x, y;
  String name;
  float size;
  
  GameObject(float x, float y, String name, float size) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.size = size;
  }
  
  void display() {
    fill(60);
    noStroke();
    
    if (name.equals("skull")) { // a cicrle with two smaller circles 
      ellipse(x, y, size, size);
      ellipse(x - size/4, y - size/6, size/4, size/4);
      ellipse(x + size/4, y - size/6, size/4, size/4);
    } else if (name.equals("candle")) { //rect with a small curcle 
      rect(x - size/6, y, size/3, size);
      triangle(x - size/6, y, x + size/6, y, x, y - size/3);
    } else if (name.equals("book")) {
      rect(x - size/2, y - size/3, size, size * 0.6);
    } else if (name.equals("potion")) {  // minecraft looking potion thing
      rect(x - size/4, y, size/2, size * 0.6);
      ellipse(x, y - size/3, size/2, size/2);
    } else if (name.equals("cross")) {   // crucifix type thing
      rect(x - size/8, y - size/2, size/4, size);
      rect(x - size/2, y - size/1, size, size/4);
    } else if (name.equals("key")) {   //best i could do smh
      ellipse(x - size/2, y-size/6, size/2, size/2);
      ellipse(x - size/2, y-size/6, size/2, size/2);
      rect(x - size/6, y-size/3, size * 0.6, size/6);
    } else if (name.equals("chain")) { //simple 3 chain
      for (int i = 0; i < 4; i++) {
        ellipse(x, y + i * size/4, size/4, size/4);
      }
    } else {
      ellipse(x, y, size, size);
    }
  }
  
  boolean isUnderMouse() {
    return dist(mouseX, mouseY, x, y) < size/2;
  }
}

void setup() {
  size(800, 600); 
  // Load images
  try {
    bladeeImg1 = loadImage("bladeee2.jpg"); // scary jumpscare
  } catch (Exception e) {
 }

 
  try {
    bladeeImg2 = loadImage("Bladeee1.jpg"); // bladee being a diva
  } catch (Exception e) {
  }
try {
    win1 = new SoundFile(this,"cute_scream.wav"); // bladee
  } catch (Exception e) {
 }try {
    win2 = new SoundFile(this,"cute_music.mp3"); // bladee
  } catch (Exception e) {
 }try {
    lose1 = new SoundFile(this,"scary_voice.ogg"); // scary jumpscare
  } catch (Exception e) {
 }try {
    lose2 = new SoundFile(this,"Distorted_noize.wav"); // scary jumpscare
  } catch (Exception e) {
 }
    resetGame();
}

void resetGame() {
  objects = new ArrayList<GameObject>();
  inventory = new ArrayList<String>();
  monsterProgress = 0;
  gameOver = false;
  won = false;
  win1.stop();
  win2.stop();
  lose1.stop();
  lose2.stop();
  String[] objectNames = {"skull", "candle", "book", "potion", "cross", "key", "chain", "coffin"};
  for (int i = 0; i < objectsToFind; i++) {
    objects.add(new GameObject(
      random(100, width - 100),
      random(100, height - 100),
      objectNames[i],
      random(30, 50)
    ));
  }
}

void draw() {
  background(0);
  
  if (!gameOver) {
    for (GameObject obj : objects) {
      obj.display();
    }
    
    drawFlashlight();
    drawMonsterBar();
    drawInventory();
    
    monsterProgress += monsterSpeed;
    
    if (objects.size() == 0) {
      won = true;
      gameOver = true;
    }
    
    if (monsterProgress >= width) {
      won = false;
      gameOver = true;
    }
    
  } else {
    if (won) {
      // Victory screen
      fill(0);
      rect(0, 0, width, height);
      
      if (bladeeImg2 != null) {
        imageMode(CENTER);
        image(bladeeImg2, width/2, height/2, 400, 400);
      if(win1 != null)win1.play();
      if(win2 != null)win2.play();
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
      fill(0);
      rect(0, 0, width, height);
      
      if (bladeeImg1 != null) {
        imageMode(CENTER);
        image(bladeeImg1, width/2, height/2, 400, 500);
  
      } else {
        
        // Fallback scary image
      if (lose1 != null)lose1.play();
      if (lose2 != null) lose2.play();
        
        fill(150, 0, 0);
        ellipse(width/2, height/2 - 50, 200, 200);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(64);
        text("dEaTh", width/2, height/2 - 50);
      }
      
      fill(255);
      textSize(24);
      text("Click to try again", width/2, height - 60);
    }
  }
}

void drawFlashlight() {
  fill(0);
  rect(0, 0, width, height);
  
  for (int i = 150; i > 0; i -= 10) {
    fill(0, 255 - i);
    noStroke();
    ellipse(mouseX, mouseY, i * 2, i * 2);
  }
  
  for (GameObject obj : objects) {
    if (obj.isUnderMouse() && dist(mouseX, mouseY, obj.x, obj.y) < 120) {
      fill(200, 200, 150, 200);
      noStroke();
      if (obj.name.equals("skull")) {
        ellipse(obj.x, obj.y, obj.size, obj.size);
        fill(50);
        ellipse(obj.x - obj.size/4, obj.y - obj.size/6, obj.size/4, obj.size/4);
        ellipse(obj.x + obj.size/4, obj.y - obj.size/6, obj.size/4, obj.size/4);
      } else if (obj.name.equals("candle")) {
        rect(obj.x - obj.size/6, obj.y, obj.size/3, obj.size);
        triangle(obj.x - obj.size/6, obj.y, obj.x + obj.size/6, obj.y, obj.x, obj.y - obj.size/3);
        fill(255, 200, 0);
        ellipse(obj.x, obj.y - obj.size/2, obj.size/5, obj.size/3);
      } else if (obj.name.equals("book")) {
        rect(obj.x - obj.size/2, obj.y - obj.size/3, obj.size, obj.size * 0.6);
      } else if (obj.name.equals("potion")) {
        fill(100, 50, 150, 200);
        rect(obj.x - obj.size/4, obj.y, obj.size/2, obj.size * 0.6);
        ellipse(obj.x, obj.y - obj.size/3, obj.size/2, obj.size/2);
      } else if (obj.name.equals("cross")) {
        fill(150, 150, 150);
        rect(obj.x - obj.size/8, obj.y - obj.size/2, obj.size/4, obj.size);
        rect(obj.x - obj.size/2, obj.y - obj.size/6, obj.size, obj.size/4);
      } else if (obj.name.equals("key")) {
        fill(200, 180, 100);
        ellipse(obj.x - obj.size/3, obj.y, obj.size/3, obj.size/3);
        rect(obj.x - obj.size/6, obj.y, obj.size * 0.6, obj.size/6);
      } else if (obj.name.equals("chain")) {
        fill(150);
        for (int i = 0; i < 4; i++) {
          ellipse(obj.x, obj.y + i * obj.size/4, obj.size/4, obj.size/4);
        }
      } else {
        ellipse(obj.x, obj.y, obj.size, obj.size);
      }
    }
  }
}

void drawMonsterBar() {
  fill(100, 0, 0);
  rect(0, 0, width, 30);
  fill(200, 0, 0);
  rect(0, 0, monsterProgress, 30);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("SOMETHING IS COMING...find the objects before its too late", width/2, 15);
}

void drawInventory() {
  fill(50, 50, 50, 200);
  rect(10, height - 60, 200, 50);
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(14);
  text("Found: " + inventory.size() + "/" + objectsToFind, 20, height - 35);
}

void mousePressed() {
  if (gameOver) {
    resetGame();
    return;
  }
  
  for (int i = objects.size() - 1; i >= 0; i--) {
    GameObject obj = objects.get(i);
    if (obj.isUnderMouse() && dist(mouseX, mouseY, obj.x, obj.y) < 120) {
      inventory.add(obj.name);
      objects.remove(i);
      break;
    }
  }
}
