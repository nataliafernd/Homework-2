


function preload() {
  // music and image files i think 
}


function setup() {
  createCanvas(800,600);
  resetGame()
}

fuction draw() {
  background(220);
// go into code 
function mousePressed() {
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
