import React, { useEffect, useRef } from 'react';

export default function BladeeGame() {
  const sketchRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const soundScript = document.createElement('script');
      soundScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js';
      soundScript.async = true;
      document.body.appendChild(soundScript);

      soundScript.onload = () => {
        new window.p5((p) => {
          let objects = [];
          let inventory = [];
          let objectsToFind = 8;
          let monsterProgress = 0;
          let monsterSpeed = 0.3;
          let gameOver = false;
          let won = false;
          let bladeeImg1, bladeeImg2;
          let win1, win2, lose1, lose2;

          class GameObject {
            constructor(x, y, name, size) {
              this.x = x;
              this.y = y;
              this.name = name;
              this.size = size;
            }

            display() {
              p.fill(60);
              p.noStroke();

              if (this.name === "skull") {
                p.ellipse(this.x, this.y, this.size, this.size);
                p.ellipse(this.x - this.size/4, this.y - this.size/6, this.size/4, this.size/4);
                p.ellipse(this.x + this.size/4, this.y - this.size/6, this.size/4, this.size/4);
              } else if (this.name === "candle") {
                p.rect(this.x - this.size/6, this.y, this.size/3, this.size);
                p.triangle(this.x - this.size/6, this.y, this.x + this.size/6, this.y, this.x, this.y - this.size/3);
              } else if (this.name === "book") {
                p.rect(this.x - this.size/2, this.y - this.size/3, this.size, this.size * 0.6);
              } else if (this.name === "potion") {
                p.rect(this.x - this.size/4, this.y, this.size/2, this.size * 0.6);
                p.ellipse(this.x, this.y - this.size/3, this.size/2, this.size/2);
              } else if (this.name === "cross") {
                p.rect(this.x - this.size/8, this.y - this.size/2, this.size/4, this.size);
                p.rect(this.x - this.size/2, this.y - this.size/1, this.size, this.size/4);
              } else if (this.name === "key") {
                p.ellipse(this.x - this.size/2, this.y-this.size/6, this.size/2, this.size/2);
                p.ellipse(this.x - this.size/2, this.y-this.size/6, this.size/2, this.size/2);
                p.rect(this.x - this.size/6, this.y-this.size/3, this.size * 0.6, this.size/6);
              } else if (this.name === "chain") {
                for (let i = 0; i < 4; i++) {
                  p.ellipse(this.x, this.y + i * this.size/4, this.size/4, this.size/4);
                }
              } else {
                p.ellipse(this.x, this.y, this.size, this.size);
              }
            }

            isUnderMouse() {
              return p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.size/2;
            }
          }

          p.preload = function() {
            Load sound files here (before setup runs)
            bladeeImg1 = p.loadImage('bladeee2.jpg');
            bladeeImg2 = p.loadImage('Bladeee1.jpg');
            win1 = p.loadSound('cute_scream.wav');
            win2 = p.loadSound('cute_music.mp3');
            lose1 = p.loadSound('scary_voice.ogg');
            lose2 = p.loadSound('Distorted_noize.wav');
          }

          p.setup = function() {
            p.createCanvas(800, 600);
            resetGame();
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
              objects.push(new GameObject(
                p.random(100, p.width - 100),
                p.random(100, p.height - 100),
                objectNames[i],
                p.random(30, 50)
              ));
            }
          }

          p.draw = function() {
            p.background(0);

            if (!gameOver) {
              for (let obj of objects) {
                obj.display();
              }

              drawFlashlight();
              drawMonsterBar();
              drawInventory();

              monsterProgress += monsterSpeed;

              if (objects.length === 0) {
                won = true;
                gameOver = true;
              }

              if (monsterProgress >= p.width) {
                won = false;
                gameOver = true;
              }

            } else {
              if (won) {
                p.fill(0);
                p.rect(0, 0, p.width, p.height);

                if (bladeeImg2 != null) {
                  p.imageMode(p.CENTER);
                  p.image(bladeeImg2, p.width/2, p.height/2, 400, 400);
                  if (win1 != null) win1.play();
                  if (win2 != null) win2.play();
                }
                p.fill(200, 255, 200);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(48);
                p.text("YOU ESCAPED!", p.width/2, 80);
                p.textSize(24);
                p.text("Congrats diva, bladee is proud", p.width/2, p.height - 100);
                p.text("Click to play again", p.width/2, p.height - 60);

              } else {
                p.fill(0);
                p.rect(0, 0, p.width, p.height);

                if (bladeeImg1 != null) {
                  p.imageMode(p.CENTER);
                  p.image(bladeeImg1, p.width/2, p.height/2, 400, 500);
                } else {
                  if (lose1 != null) lose1.play();
                  if (lose2 != null) lose2.play();

                  p.fill(150, 0, 0);
                  p.ellipse(p.width/2, p.height/2 - 50, 200, 200);
                  p.fill(255, 0, 0);
                  p.textAlign(p.CENTER, p.CENTER);
                  p.textSize(64);
                  p.text("dEaTh", p.width/2, p.height/2 - 50);
                }

                p.fill(255);
                p.textSize(24);
                p.text("Click to try again", p.width/2, p.height - 60);
              }
            }
          }

          function drawFlashlight() {
            p.fill(0);
            p.rect(0, 0, p.width, p.height);

            for (let i = 150; i > 0; i -= 10) {
              p.fill(0, 255 - i);
              p.noStroke();
              p.ellipse(p.mouseX, p.mouseY, i * 2, i * 2);
            }

            for (let obj of objects) {
              if (obj.isUnderMouse() && p.dist(p.mouseX, p.mouseY, obj.x, obj.y) < 120) {
                p.fill(200, 200, 150, 200);
                p.noStroke();
                if (obj.name === "skull") {
                  p.ellipse(obj.x, obj.y, obj.size, obj.size);
                  p.fill(50);
                  p.ellipse(obj.x - obj.size/4, obj.y - obj.size/6, obj.size/4, obj.size/4);
                  p.ellipse(obj.x + obj.size/4, obj.y - obj.size/6, obj.size/4, obj.size/4);
                } else if (obj.name === "candle") {
                  p.rect(obj.x - obj.size/6, obj.y, obj.size/3, obj.size);
                  p.triangle(obj.x - obj.size/6, obj.y, obj.x + obj.size/6, obj.y, obj.x, obj.y - obj.size/3);
                  p.fill(255, 200, 0);
                  p.ellipse(obj.x, obj.y - obj.size/2, obj.size/5, obj.size/3);
                } else if (obj.name === "book") {
                  p.rect(obj.x - obj.size/2, obj.y - obj.size/3, obj.size, obj.size * 0.6);
                } else if (obj.name === "potion") {
                  p.fill(100, 50, 150, 200);
                  p.rect(obj.x - obj.size/4, obj.y, obj.size/2, obj.size * 0.6);
                  p.ellipse(obj.x, obj.y - obj.size/3, obj.size/2, obj.size/2);
                } else if (obj.name === "cross") {
                  p.fill(150, 150, 150);
                  p.rect(obj.x - obj.size/8, obj.y - obj.size/2, obj.size/4, obj.size);
                  p.rect(obj.x - obj.size/2, obj.y - obj.size/6, obj.size, obj.size/4);
                } else if (obj.name === "key") {
                  p.fill(200, 180, 100);
                  p.ellipse(obj.x - obj.size/3, obj.y, obj.size/3, obj.size/3);
                  p.rect(obj.x - obj.size/6, obj.y, obj.size * 0.6, obj.size/6);
                } else if (obj.name === "chain") {
                  p.fill(150);
                  for (let i = 0; i < 4; i++) {
                    p.ellipse(obj.x, obj.y + i * obj.size/4, obj.size/4, obj.size/4);
                  }
                } else {
                  p.ellipse(obj.x, obj.y, obj.size, obj.size);
                }
              }
            }
          }

          function drawMonsterBar() {
            p.fill(100, 0, 0);
            p.rect(0, 0, p.width, 30);
            p.fill(200, 0, 0);
            p.rect(0, 0, monsterProgress, 30);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(16);
            p.text("SOMETHING IS COMING...find the objects before its too late", p.width/2, 15);
          }

          function drawInventory() {
            p.fill(50, 50, 50, 200);
            p.rect(10, p.height - 60, 200, 50);
            p.fill(255);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(14);
            p.text("Found: " + inventory.length + "/" + objectsToFind, 20, p.height - 35);
          }

          p.mousePressed = function() {
            if (gameOver) {
              resetGame();
              return;
            }

            for (let i = objects.length - 1; i >= 0; i--) {
              let obj = objects[i];
              if (obj.isUnderMouse() && p.dist(p.mouseX, p.mouseY, obj.x, obj.y) < 120) {
                inventory.push(obj.name);
                objects.splice(i, 1);
                break;
              }
            }
          }
        }, sketchRef.current);
      };
    };

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return <div ref={sketchRef} className="w-full h-full flex items-center justify-center bg-black" />;
}
