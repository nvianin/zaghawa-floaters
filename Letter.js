class Letter {
	constructor(posX, posY, size, letter, letterColor, showroom) {
		this.letter = letter;
		this.letterColor = letterColor;
		this.drawer;
		this.drawerSelected = false;
		this.size = size;
		this.posX = posX;
		this.posY = posY;
		this.originalX = posX;
		this.originalY = posY;
		this.grabX = 0;
		this.grabY = 0;
		this.x = posX;
		this.y = posY;
		this.speedX, this.speedY;
		this.prevX;
		this.prevY;
		this.speed;
		this.seed = Math.random();
		this.othersAround = 0;
		this.near = [];
		this.nearFood = [];
		this.showroom = showroom;
		this.fillColor = 200;
		this.strokeColor = 40;
		this.direction;
		this.dismembered = false;
		this.selected = false;
		this.opacity = 255;
		this.hunted = false;
		this.angle = 0;
		this.hungry = false;
		this.age = 0;
		this.hoarder = false;
		if (this.letter == "H") {
			this.hoarder = true;
		}
		this.nest;
		this.grabbing = false;

		this.police = false;
		if (this.letter == "X") {
			this.police = true;
		};
		this.villain;

		this.processionistI;

		this.friend;
		this.bonded = false;
		this.beingFollowed = false;

		this.friendly = false;
		if (this.letter == "M") {
			this.friendly = true;
		}

		this.processionist = false;
		if (this.letter == "Y" || this.letter == "N") {
			this.processionist = true;
			this.fellowProcessionist = null;
		}
		this.lastProcessionist = false;


		this.timeSpentImmobile = 0;

		this.holed = false;
		for (var i = 0; i < holedLetters.length; i++) {
			if (this.letter == holedLetters[i]) {
				this.holed = true;
				console.log(this.letter + " holed");
			}
		}
		this.mouthed = false;
		for (var i = 0; i < mouthedLetter.length; i++) {
			if (this.letter == mouthedLetter[i]) {
				this.mouthed = true;
			}
		}

		//this.accelerationX=5;
		//this.accelerationY=9.81;
		//this.damp = dampeningFactor;
		this.damp = 0.9999;

		this.killed = false;
		this.bodies = [];
		this.seed = Math.random();
		this.jitter = 0.001;
		this.points = [];
		this.prey;
		this.herbivore = true;

		this.fontPoints = font.textToPoints(letter, 0, 0, size, {
			sampleFactor: .11,
			simplifyThreshold: 0
		})



		this.originalLength = this.fontPoints.length;

		this.mouth = createVector(0, 0);
		this.head;
		this.stomach = 70;
		this.life = 100;
		this.dying = false;
		this.digested = 100;




		//console.log("i bordle"+i);
		//simplify fontpoints by distance
		for (var i = 1; i < this.fontPoints.length; i++) {
			let point = this.fontPoints[i];
			let pPoint = this.fontPoints[i - 1];
			/* let dFactor = 0
			
			if (point.x- pPoint.x < dFactor && point.y- pPoint.y < dFactor) {
				console.log(dist(point.x, pPoint.x));
				point.x -= pPoint.x
				point.y -= pPoint.y
				this.fontPoints.splice(i - 1, 1);
			} */
		}
		for (var i = 0; i < this.fontPoints.length - 1; i += 1) {

			let newPoint = new Point(this.fontPoints[i].x + this.posX, this.fontPoints[i].y + this.posY, i, this);
			this.points.push(newPoint);
		}
		for (var i = 0; i < this.points.length; i++) {
			this.points[i].setup(this.points);
		}
		this.zeroDeviation = this.posY - this.points[0].y;

		//console.log(this.fontPoints);

		//build mesh
		/* var additionalPoints = [];

		for (var i = 0; i < 1000; i++) {
			var x = random(this.posX - this.size / 4, this.posX + this.size);
			var y = random(this.posY + this.size / 4, this.posY - this.size);
			var distances = [];
			var averageDist = 0;
			var distCounter = 0;

			for (var j = 0; j < this.points.length - 1; j++) {
				if (dist(x, y, this.points[j].x, this.points[j].y) < size / 10) {
					distCounter += 1;
				}
			}

			if (distCounter > 6 && distCounter < 8) {
				var newPoint = new Point(x, y, this.points+1);
				this.points.push(newPoint);
				print(distCounter);
			}
		} */

		//build constraints
		this.head = this.points[2];
		for (var i = 0; i < this.points.length; i++) {

		}
		this.parseBody();
		if (this.showroom != true) {
			this.fillColor = 0;
			this.opacity = 0;
			this.strokeColor = 0;
		}
	}

	update() {
		this.age++;
		if (this.letter == "L" && this.age > 1000 && this.showroom != true) {
			this.dying = true;
		}

		if (this.stomach < 60) {
			this.hungry = true;
		} else if (this.stomach >= 100) {
			this.hungry = false;
		}

		if (this.letter == "M") {
			this.angle = Math.atan2(this.mouth.x - this.tail.x, this.mouth.y - this.tail.y);
		}

		if (this.dismembered == true) {
			this.opacity -= 2;
		}
		if (this.opacity < 0) {
			this.killed = true;
		}
		if (this.points.length == 0) {
			this.killed = true;
			console.log("empty letter removed")
		}

		//		find mean center
		var xTally = 0;
		var yTally = 0;
		for (var i = 0; i < this.points.length; i++) {
			xTally += this.points[i].x;
			yTally += this.points[i].y;
		}
		xTally /= this.points.length;
		yTally /= this.points.length;
		this.posX = xTally;
		this.posY = yTally;

		if (this.dying) {
			//console.log("pain");
			this.life -= .6;
			this.fillColor -= 2;
		}
		if (this.life < 1) {
			this.killed = true;
		}

		//		self clean up
		if (this.killed) {
			for (var i = 0; i < this.points.length; i++) {
				World.remove(world, this.points[i].body);
			}
			/* for (var i = 0; i < letters.length; i++) {
				if (letters[i].x == this.x) {
					letters.splice(i, 1);
				}
			} */
		}
		this.x = this.posX;
		this.y = this.posY;
		this.speedX = this.x;
		this.speedY = this.y;
		this.speed = Math.hypot(this.speedX - this.prevX, this.speedY - this.prevY);
		if (this.showroom != true) {
			if (env == "world") {
				this.stomach -= hunger;
			} else if (env == "one" && this.stomach > 10) {
				this.stomach -= hunger;
			}
		}
		if (this.stomach < 0 && !(this.dying || this.killed || this.dismembered)) {
			this.dying = true;
			console.log("letter ", this.letter, " is agonizing because of starvation")
		}

		if (!this.killed && env != "showroom") {
			/* this.isEnemyNear(); */
			if (this.letter != "L" && this.letter != "M") {
				this.avoid();
			}
		}

		if (!this.killed && env != "showroom" && !this.dying && !this.dismembered) {

			if (this.floatyMouth || this.hoarder) {
				this.parseBody();
			}
			/* this.move(); */

			if (this.herbivore && this.hungry && this.fellowProcessionist == null && !this.police /* && this.letter != "H" */ ) {
				this.eat();
			} else if (!this.herbivore) {
				try {
					this.eatCarnivore();
				} catch {};
			} else if (this.police) {
				if (this.villain == null && this.hungry) {
					this.eat();
				}
			}

			if (this.processionist && this.fellowProcessionist == null && this.beingFollowed && !this.hungry) {
				this.loopProcession();
			}

			if (this.processionist) {
				this.proceedToProcession();
			}

			if (this.hoarder) {
				this.manageNest();
			}

			if (this.police) {
				this.doPoliceWork();
			}

			if (!this.hoarder && !this.processionist && this.villain == null) {
				if (this.letter == "L" && this.prey.x == 10000) {
					this.randomMove();
				} else if (this.police) {
					this.randomMove();
				}
				//console.log("randmove")
				else if (!this.hungry) {
					//console.log("randmov")
					this.randomMove();
				}
			}




			if (this.friendly && this.friend == null && env != "showroom") {
				this.findFriend();
			}
			if (this.friend != null) {
				if (this.friend.dying || this.friend.dismembered || this.friend.killed) {
					this.friend = null;
					console.log("friend dead");
				}
			}
			if (this.friend != null && !this.friend.dying) {
				this.hoverFriend();
			}

			//Bounds check
			/* if (this.points[0].y > windowHeight + (this.size*2) || this.points[0].y < 0 - (this.size*2) || this.points[0].x > windowWidth + (this.size*2) || this.points[0].x < 0 -(this.size*2)) {
				this.killed = true;
				console.log("killed " + this.i,this.points[0].x+" ",this.points[0].y);
				for ( var i = 0; i < this.points.length; i ++){
					World.remove(world,this.points[i]."body");
				}
			} */

			//Jitter applyforce
			/* if (Math.floor(random(0, 20)) < 10) {
				var rand = Math.floor(random(0, this.points.length));
				Matter.Body.applyForce(this.points[rand].body, this.points[rand].body.position, {
					x: random(-this.jitter, this.jitter),
					y: random(-this.jitter, this.jitter)
				});
			} */
		}
		/* else if (this.killed){
			for (var i = 0; i < this.points.length; i+1){
				this.points[i].killed =true;
			}
		} */
		this.prevX = this.x;
		this.prevY = this.y;

	}

	draw() {
		if (this.drawer) {
			var xTally = 0;
			var yTally = 0;
			var inRange = 0;

			for (var i = 0; i < this.points.length; i++) {
				if (dist(mouseX, mouseY, this.points[i].x, this.points[i].y) < 10 && !drawerBeingDragged && !drawerGrabbing) {
					//line(mouseX, mouseY, this.points[i].x, this.points[i].y);
					//circle(this.points[i].x, this.points[i].y, 10);
					this.drawerSelected = true;
					//console.log(this.originalX,mouseX,this.originalX-mouseX);

					this.grabX = mouseX - this.posX - drawerScroll;
					this.grabY = mouseY - this.points[0].y - this.zeroDeviation;
					//console.log(this.grabX, this.grabY);
					this.fillColor = 255;
					inRange++;
					cursor(CROSS);

				}
			}
			if (inRange == 0) {
				this.drawerSelected = false;
				this.fillColor = 180;
			}
			xTally /= this.points.length;
			yTally /= this.points.length;
			this.x = xTally;
			this.y = yTally;

		}

		if (this.age < 300 && this.showroom != true) {
			this.spawn();
		}

		if (this.iPUTAIN == 1) {
			console.log(this.speed);
		}
		/* fill(255, 0, 0);
		circle(this.x, this.y, 30); */

		/* fill("red");
		if (this.mouthed) circle(this.mouth.x, this.mouth.y, 10); */

		/* if (this.showroom == true){
			fill(255,50);
			circle(this.originalX+this.size/2.45,this.originalY-this.size/4,this.size+20);
		} */

		if (!this.dying && !this.drawer) {
			if (this.showroom && dist(mouseX, mouseY, this.x, this.y) < this.size * .5 && env == "showroom" && !mouseInDrawer() && !drawerGrabbing) {
				this.fillColor = 255;
				this.selected = true;
				if (!mouseInPuller() && !mouseInDrawer()) {
					cursor(CROSS);
				}
			} else {
				this.fillColor = 200;
				this.selected = false;
			}
		}

		if (!this.killed) {
			/* strokeCap(ROUND);
			strokeJoin(ROUND); */



			//rotateX(radians(map(sin((frameCount+(this.seed*100))*(this.seed*.01)),-1,1,-30*(this.seed*.8),30*(this.seed*.8))));
			//translate(0,0,sin(frameCount*.01)*100);

			for (var i = 0; i < this.points.length; i++) {
				//circle(this.points[i].x+this.posX,this.points[i].y+this.posY,30);
				if (env != "showroom" && this.showroom != true && !this.drawer) {
					this.points[i].update();
				}
				this.points[i].draw();

			}

			if (this.processionist && (this.fellowProcessionist != null || this.beingFollowed)) {
				this.fillColor = (sin((frameCount + (this.processionistI * 20)) * .05) + 1) / 2 * 255;
			}

			stroke(this.strokeColor);
			strokeWeight(3);
			fill(this.fillColor, this.opacity);

			if (!this.holed && !this.dismembered) {
				beginShape();

				for (var i = 0; i < this.points.length; i++) {

					if (this.letter == "M" && i > this.originalLength - 2) {

					} else {

						let point = this.points[i];
						vertex(point.x, point.y);
					}

				}
				vertex(this.points[0].x, this.points[0].y);
				endShape();
			} else if (this.holed && !this.dismembered) {
				if (this.letter == "A") {
					/* console.log("drawing A") */
					beginShape();
					for (var i = 0; i < this.points.length; i++) {
						let point = this.points[i];
						if (i == 38) {
							beginContour();

						}
						vertex(point.x, point.y);
					}
					endContour();
					endShape();
				} else if (this.letter == "B") {
					/* console.log("drawing B"); */
					beginShape();
					for (var i = 0; i < this.points.length; i++) {
						var p = this.points[i];
						if (i == 39) {
							beginContour();
						} else if (i == 50) {
							endContour();
						}
						vertex(p.x, p.y);
					}
					endShape();
				} else if (this.letter == "N") {
					beginShape();
					for (var i = 0; i < this.points.length; i++) {
						var p = this.points[i];
						if (i == 34 || i == 45) {
							beginContour();
						} else if (i == 44 || i == 54) {
							endContour();
						}
						vertex(p.x, p.y);
					}
					endShape();
				} else if (this.letter == "P") {
					beginShape();
					for (var i = 0; i < this.points.length; i++) {
						var p = this.points[i];
						if (i == 44) {
							beginContour();
						} else if (i == 54) {
							endContour();
						}
						vertex(p.x, p.y);
					}
					endShape();
				} else if (this.letter == "G") {
					beginShape();
					for (var i = 0; i < this.points.length; i++) {
						var p = this.points[i];
						if (i == 40) {
							beginContour();
						} else if (i == 55) {
							endContour();
						}
						vertex(p.x, p.y);
					}
					endShape();
				} else if (this.letter == "X") {
					beginShape();
					for (var i = 0; i < this.points.length; i++) {
						var p = this.points[i];
						if (i == 44) {
							beginContour();
						} else if (i == 51)
							endContour();
						vertex(p.x, p.y);
					}
					endShape();
				} else if (this.letter == "U") {
					beginShape();
					for (var i = 0; i < this.points.length; i++) {
						var p = this.points[i];
						if (i == 27) {
							beginContour();
						} else if (i == 37)
							endContour();
						vertex(p.x, p.y);
					}
					endShape();
				} else if (this.letter == "Y") {
					beginShape();
					for (var i = 0; i < this.points.length; i++) {
						var p = this.points[i];
						if (i == 46 || i == 34) {
							beginContour();
						} else if (i == 55 || i == 45) {
							endContour();
						}
						vertex(p.x, p.y);
					}
					endShape();
				}
				endShape();
			}
			/* beginShape();

            push();

            translate(-this.size/2.5,this.size/3);

            for (var i = 0; i < this.points.length; i++){
                let p = this.points[i];
                
                vertex(
                    p.x+this.posX,
                    p.y+this.posY
                );
                p.draw();

            }
            endShape(CLOSE);

            pop(); */

			//console.log("Letter object drawn");
		}


		if (this.dismembered) {
			stroke(30);
			strokeWeight(3);
			fill(this.fillColor, this.opacity);
			for (var i = 1; i < this.points.length; i++) {
				line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
			}
		}



		/* for (var i = 0; i < 100; i++) {
			var x = random(this.posX - this.size / 4, this.posX + this.size);
			var y = random(this.posY + this.size / 4, this.posY - this.size);

			if (this.pointInPolygon(x, y)) {
				circle(x, y, 3);
			}
		} */
	}

	eat() {
		if (this.speed < .2) {
			this.timeSpentImmobile++;
			if (this.timeSpentImmobile > 30) {
				console.log("letter woken up");
				this.prey.taken = false;
				this.prey = null;
				this.timeSpentImmobile = 0;
			}
		} else {
			this.timeSpentImmobile = 0
		}
		if (this.prey != null && this.watchAroundFood(this.prey, 100) > 0) {
			this.prey.taken = false;
			this.prey = null;
		}
		if (this.prey == null || this.prey.size < 4 /* || frameCount % 15 == 0 */ ) {
			if (Math.random() > 0) {
				//console.log("wer ist fud ????");

				var closest = food[Math.floor(Math.random() * food.length)];
				var discrepancies = 0;
				for (var i = 0; i < food.length; i++) {
					//console.log(dist(this.x,this.y,food[i].x,food[i].y));
					if (dist(this.x, this.y, food[i].x, food[i].y) < dist(this.x, this.y, closest.x, closest.y) && this.watchAroundFood(food[i], 100) < 1 && !food[i].taken) {
						closest = food[i];
					}
					this.prey = closest;
					this.prey.taken = true;
					//this.prey = food[Math.floor(Math.random() * food.length)];

				}

				/* for (var i = 0; i < letters.length; i++) {
					if (letters[i].prey == closest) {
						discrepancies++;
					}
				}
				if (discrepancies != 0) {
					this.prey = food[Math.floor(Math.random() * food.length)];
				} */
			} else {
				this.prey = food[Math.floor(Math.random() * food.length)];
			}
		} else {
			if (this.letter == "M" && this.friend != null) {
				this.eatTogether();
			} else {
				//console.log("huntin");
				var randBody = this.points[Math.floor(Math.random() * this.points.length)].body;
				var randBody2 = this.points[Math.floor(Math.random() * this.points.length)].body;
				if (Math.random() < 1) {
					//console.log(randBody);
					this.direction = createVector(this.mouth.x - this.prey.x, this.mouth.y - this.prey.y);
					this.direction.normalize();
					this.direction.mult(-.0009);
					/* if (!this.floatyMouth) {
						Matter.Body.applyForce(this.mouth.body, this.mouth.body.position, this.direction);
					} else if (this.floatyMouth) { */
					if (this.beingFollowed) {
						this.direction.mult(1.3);
					}

					Matter.Body.applyForce(this.head.body, this.head.body.position, this.direction);
					/* Matter.Body.applyForce(randBody2, randBody2.position, this.direction); */
					//}
					/* stroke(30);
					strokeWeight(1);
					line(this.x, this.y, this.prey.x, this.prey.y); */
					/* randBody.force.x = randBody.position.x - this.prey.x * .001;
					randBody.force.y = randBody.position.y - this.prey.y * .001;
					randBody.update(); */
				}
			}

			//			eat things


			for (var i = 0; i < food.length; i++) {

				this.pray = food[i];
				if (dist(this.mouth.x, this.mouth.y, this.pray.x, this.pray.y) < this.pray.size / 2 + 2) {
					if (this.letter != "H") {
						this.stomach += 4;
					} else {
						this.stomach += 5;
					}
					this.pray.size -= 1;
					/* console.log(this.prey.size); */
					if (this.mouthed) {
						this.scronch();
					}
				}
			}
		}

	}

	eatCarnivore() {
		if (this.prey == null || this.prey.killed == true || frameCount % 100 == 0) {
			//console.log("searching meat")
			if (env == "world") {
				var closest = {
					x: 10000,
					y: 10000
				};
				/* var rand = Math.floor(Math.random()*letters.length);
				closest = letters[rand];
				if (closest.seed == this.seed){
					if (rand > 0);
					closest = letters[rand-1];
				} else {
					closest = letters[rand+1];
				} */
				for (var i = 0; i < letters.length; i++) {
					if (dist(closest.x, closest.y, this.x, this.y) > (dist(this.x, this.y, letters[i].x, letters[i].y)) && letters[i].x != this.x && !letters[i].police) {
						closest = letters[i];
					}
				}
				this.prey = closest;
				closest = this.prey.points[0];
				for (var i = 0; i < this.prey.points.length; i++) {
					if (dist(closest.x, closest.y, this.mouth.x, this.mouth.y) > dist(this.prey.points[i].x, this.prey.points[i].y, this.mouth.x, this.mouth.y)) {
						closest = this.prey.points[i];
					}

					this.prey = closest;
					this.prey.hunted = true;
				}
			} else if (env == "one") {
				var closest = {
					x: 10000,
					y: 10000
				};
				/* closest = oneLetters[Math.floor(Math.random()*oneLetters.length)];
				//console.log(closest);
				var rand = Math.floor(Math.random()*oneLetters.length);
				closest = oneLetters[rand];
				if (closest.seed == this.seed){
					if (rand > 0);
					closest = oneLetters[rand-1];
					console.log("corrected -")
				} else {
					closest = oneLetters[rand+1];
					console.log("corrected +")
				}
				console.log(closest); */

				for (var i = 0; i < oneLetters.length; i++) {
					/* console.log(dist(this.x, this.y, oneLetters[i].x, oneLetters[i].y)); */
					if (dist(closest.x, closest.y, this.x, this.y) > (dist(this.x, this.y, oneLetters[i].x, oneLetters[i].y)) && oneLetters[i].x != this.x && !oneLetters[i].police) {
						closest = oneLetters[i];
					}
				}
				this.prey = closest;
				//console.log(this.prey);
				closest = this.prey.points[Math.floor(Math.random() * this.prey.points.length)];
				var closest = {
					x: 10000,
					y: 10000
				};
				for (var i = 0; i < this.prey.points.length; i++) {
					if (dist(closest.x, closest.y, this.mouth.x, this.mouth.y) > dist(this.prey.points[i].x, this.prey.points[i].y, this.mouth.x, this.mouth.y)) {
						closest = this.prey.points[i];
					}

					this.prey = closest;
					this.prey.hunted = true;
				}
			}
		} else if (this.prey.x != 10000) {
			/* fill(255, 255, 0);
			circle(this.prey.x, this.prey.y, 30); */
			var direction = createVector(this.mouth.x - this.prey.x, this.mouth.y - this.prey.y);
			/* console.log(direction) */
			/* stroke(120);
			line(this.mouth.x, this.mouth.y, direction.x + this.mouth.x, direction.y + this.mouth.y);
			stroke(255);
			line(this.mouth.x, this.mouth.y, this.prey.x, this.prey.y); */
			direction.normalize();
			direction.mult(-.0007);
			//console.log(this.mouth.body.position);
			/* if (frameCount + (Math.floor(this.seed * 100)) % 14 == 0) {
				direction.mult(-2);
			} */

			direction.mult((sin((frameCount + (this.seed * 100)) * (.5)) + .8) / .7 + .8)
			/* console.log((sin(frameCount*.5)+1)/2); */

			Matter.Body.applyForce(this.mouth.body, this.mouth.body.position, direction);
		}

		//eat meat
		if (this.prey != null && dist(this.mouth.x, this.mouth.y, this.prey.x, this.prey.y) < 15) {
			this.prey.life -= 10;
			this.stomach += 5;
			if (this.prey.life <= 0) {
				this.prey.letter.dismembered = true;
			}
			/* console.log(this.prey.life); */
		}

	}

	move() {
		var character = this.letter;
		if (Math.random() < this.jitterThreshold) {
			if (character == "A") {
				if (Math.random() < .5) {
					var rand = 0;
				} else {
					var rand = 8;
				}
				//var rand = Math.floor(random(0, this.points.length));
				/* Matter.Body.applyForce(this.points[rand].body, this.points[rand].body.position, {
					x: random(-this.jitter, this.jitter),
					y: random(-this.jitter, this.jitter)
				}); */
				this.closePoints(0, 8);
			}
		}

	}

	closePoints(P1, P2, s) {
		var p1 = this.points[P1];
		var p2 = this.points[P2];
		var strength = s * .0007 || .0007;
		//strength = .001;
		var v1 = createVector(p2.x - p1.x, p2.y - p1.y);
		v1.normalize();
		v1.mult(strength);
		var v2 = createVector(p1.x - p2.x, p1.y - p2.y);
		v2.normalize();
		v2.mult(strength);

		Matter.Body.applyForce(p1.body, p1.body.position, v1);
		Matter.Body.applyForce(p2.body, p2.body.position, v2);

		v1.mult(200000);
		v2.mult(200000);
		/* if (debug) {
			circle(p1.x, p1.y, 10);
			circle(p2.x, p2.y, 20);

			push();

			stroke(0, 255, 0);
			strokeWeight(5);
			line(p1.x, p1.y, p1.x + v1.x, p1.y + v1.y);
			stroke(255, 0, 0);
			line(p2.x, p2.y, p2.x + v2.x, p2.y + v2.y);
			pop();
		} */


	}

	randomMove() {
		var direction = createVector(noise(frameCount * .005 + this.seed * 100) * 2 - 1, noise(frameCount * .005 + this.seed * 300) * 2 - 1);
		direction.normalize();
		direction.mult((noise(frameCount * 0.1 * 2 - 1) + .2) * 0.0005);
		Matter.Body.applyForce(this.head.body, this.head.body.position, direction);

	}

	parseBody() {
		for (var i = 0; i < carnivoreLetters.length; i++) {

			if (this.letter == carnivoreLetters[i]) {
				//console.log("carnivore");
				this.herbivore = false;
			}
		}

		switch (this.letter) {
			case "A":
				this.mouth = this.points[23];
				this.head = this.points[23];
				break;

			case "B":
				this.mouth = this.points[0];
				this.head = this.mouth;
				break;

			case "K":
				/* var p1 = this.points[26];
				var p2 = this.points[33];
				//console.log(p1);
				this.mouth.x = (p1.x + p2.x) / 2
				this.mouth.y = (p1.y + p2.y) / 2 */
				this.mouth = this.getMiddle(26, 33);
				this.floatyMouth = true;
				this.head = this.points[36];
				break;

			case "E":
				/* var p1 = this.points[20];
				var p2 = this.points[11];
				console.log(p1);
				this.mouth.x = (p1.x + p2.x) / 2
				this.mouth.y = (p1.y + p2.y) / 2 */
				this.mouth = this.getMiddle(20, 11);
				this.floatyMouth = true;
				this.head = this.points[20];
				break;

			case "L":
				this.mouth = this.points[28];
				this.head = this.mouth;

				break;

			case "N":
				this.mouth = this.points[16];
				this.head = this.mouth;
				this.tail = this.points[0];
				break;

			case "Z":
				this.mouth = this.points[40];
				this.head = this.mouth;
				break;

			case "O":
				this.mouth = this.points[9];
				this.head = this.mouth;
				break;

			case "P":
				this.mouth = this.points[2];
				this.head = this.mouth;
				break;

			case "T":
				this.mouth = this.points[22];
				this.head = this.mouth;
				break;

			case "G":
				this.mouth = this.points[0];
				this.head = this.mouth;
				break;

			case "X":
				/* var p1 = this.points[17];
				var p2 = this.points[25];
				console.log(p1);
				this.mouth.x = (p1.x + p2.x) / 2
				this.mouth.y = (p1.y + p2.y) / 2 */
				this.mouth = this.getMiddle(17, 25);
				this.floatyMouth = true;
				this.head = this.points[14];
				this.mouth = this.getMiddle(14, 29);
				break;

			case "U":
				this.mouth = this.points[15];
				this.head = this.mouth;
				break;

			case "S":
				this.mouth = this.points[34];
				this.head = this.points[0];
				break;

			case "M":
				this.mouth = this.points[20];
				this.head = this.points[20];
				this.tail = this.points[0];
				break;

			case "H":
				this.mouth = this.points[11];
				this.head = this.mouth;
				this.a1 = this.points[35];
				this.a2 = createVector((this.points[0].x + this.points[23].x) / 2, (this.points[0].y + this.points[23].y) / 2);
				this.shoulder1 = this.points[38];
				this.tail1 = this.points[0];
				this.shoulder2 = this.points[31];
				this.tail2 = this.points[23];
				break;

			case "R":
				this.mouth = this.points[28];
				this.head = this.mouth;
				break;

			case "W":
				this.mouth = this.points[45];
				this.head = this.mouth;
				break;

			case "Y":
				this.mouth = this.points[17];
				this.head = this.mouth;
				this.tail = this.points[0];
				break;

			case "I":
				this.mouth = this.getMiddle(4, 51);
				this.floatyMouth = true;
				this.head = this.points[47];
				break;
		}
	}

	getMiddle(P1, P2) {
		var p1 = this.points[P1];
		var p2 = this.points[P2];
		var x, y;
		x = (p1.x + p2.x) / 2
		y = (p1.y + p2.y) / 2
		let v = createVector(x, y);
		return v;
	}

	scronch() {
		if (this.letter == "A") {
			this.closePoints(0, 9);
		} else if (this.letter == "K") {
			this.closePoints(35, 24);
		} else if (this.letter == "E") {
			this.closePoints(7, 20);
		} else if (this.letter == "Z") {
			this.closePoints(32, 0);
		} else if (this.letter == "O") {
			this.closePoints(2, 18);
		} else if (this.letter == "T") {
			this.closePoints(27, 18);
		} else if (this.letter == "X") {
			this.closePoints(15, 28);
		} else if (this.letter == "M") {
			this.closePoints(0, 12);
		} else if (this.letter == "M") {
			this.closePoints(1, 22);
		} else if (this.letter == "R") {
			this.closePoints(18, 37);
		} else if (this.letter == "W") {
			this.closePoints(0, 27, 1.3);
		} else if (this.letter == "I") {
			this.closePoints(7, 50);
		}
		/* console.log(this.letter + " SCRONCHING !") */
	}


	spawn() {

		if (this.fillColor < 255) {
			this.fillColor += 1;
		}
		if (this.opacity < 255) {
			this.opacity++;
		}
		if (this.strokeColor < 40) {
			this.strokeColor++;
		}
		//console.log("spawning");
	}

	avoid() {
		var relevantArray;
		if (env == "world") {
			relevantArray = letters;
		} else if (env == "one") {
			relevantArray = oneLetters;
		}

		for (var i = 0; i < relevantArray.length; i++) {
			/* console.log(this.points[0], relevantArray[i]); */
			if (relevantArray[i].points.length != 0 && !(this.police && relevantArray[i].letter == "L")) {
				var distanceToOther = dist(this.x, this.y, relevantArray[i].x, relevantArray[i].y);
				var threshold = 100;
				if (this.processionist && relevantArray[i].processionist) {
					threshold = 100;
				}
				if ((distanceToOther < threshold && relevantArray[i].seed !== this.seed /* && Math.round(frameCount + this.seed) % 4 == 0 */ ) /* && !(this.letter == "Y" && relevantArray[i].letter == "Y") */ ) {

					//console.log("personal space, " + relevantArray[i].letter);
					/* console.log(dist(this.points[3].x, this.points[3].y, relevantArray[i].points[3].x, relevantArray[i].points[3].y)); */
					var repelStrength = (threshold - distanceToOther) / (2 * threshold);
					//for (var j = 0; j < this.points.length; j++) {
					//var direction = createVector(this.points[j].x-relevantArray[i].points[j].x, this.points[j].x-relevantArray[i].points[j].y);
					var direction = createVector(this.x - relevantArray[i].x, this.y - relevantArray[i].y);
					direction.mult(.0001 * repelStrength);
					/* console.log("direction " + direction); */
					if (this.dismembered) {
						var lifeStrength = 1 - ((this.originalLength - this.points.length) / this.originalLength)
						direction.mult(lifeStrength);
					}

					if (relevantArray[i].letter == "L") {
						direction.mult(1.3);
						//this.flee(relevantArray[i]);
					}
					//console.log("repelling " + relevantArray[i].letter + " " + direction)

					direction.mult(1);

					Matter.Body.applyForce(this.points[i].body, this.points[i].body.position, direction);

					/* strokeWeight(3);
					stroke(255);
					line(this.x, this.y, direction.x + this.x, direction.y + this.y); */

					//}

				}
			}
		}
	}

	manageNest() {
		if (this.nest == null) {
			this.createNest();
			console.log("creating nest")
		} else if (this.nest != null) {
			if (this.nest.eggs < 10 && !this.hungry) {
				this.fetchEggs();
			}
		}
	}

	findEmptyNestArea() {
		var v = createVector(random(100, 300), random(100, 300));
		if (Math.random() < .5) {
			v.x += width - random(300, 400);
		}
		if (Math.random() < .5) {
			v.y += height - random(300, 400);
		}

		var discrepancies = 0;
		for (var i = 0; i < nests.length; i++) {
			if (dist(v.x, v.y, nests[i].x, nests[i].y) < nests[i].size * 2 + 40) {
				discrepancies++;
			}
		}
		if (discrepancies == 0) {
			return v;
		} else {
			return this.findEmptyNestArea();
		}

	}

	createNest() {
		var v = this.findEmptyNestArea();

		let n = new Nest(v.x, v.y, this);
		this.nest = n;
		nests.push(this.nest);
	}

	fetchEggs() {
		this.angle = 0;
		if (!this.grabbing) {
			var closest = eggs[0];
			for (var i = 0; i < eggs.length; i++) {
				if (dist(this.head.x, this.head.y, eggs[i].x, eggs[i].y) < dist(closest.x, closest.y, this.head.x, this.head.y) && !eggs[i].nested) {
					closest = eggs[i];
				}
			}

			/* var d1 = createVector(this.shoulder1.x-this.tail1.x, this.shoulder1.y-this.tail1.y);
			d1.normalize();
			d1.mult(-.0001);
			Matter.Body.applyForce(this.tail1.body,this.tail1.body.position,d1);

			var d2 = createVector(this.shoulder2.x-this.tail2.x, this.shoulder2.y-this.tail2.y);
			d2.normalize();
			d2.mult(-.0001);
			Matter.Body.applyForce(this.tail2.body,this.tail2.body.position,d2); */

			/* this.angle = Math.atan2(this.a1.y - this.a2.y, this.a1.x - this.a2.x);
			stroke(255);
			//line(this.head.x, this.head.y, closest.x, closest.y);
			var x = cos(this.angle) * 30;
			var y = sin(this.angle) * 30;
			circle(this.a1.x,this.a1.y,20);
			circle(this.a2.x,this.a2.y,20);
			line(this.x, this.y, this.x + x, this.y + y); */

			var direction = createVector(closest.x - this.head.x, closest.y - this.head.y);
			direction.normalize();
			direction.mult(.001);
			//console.log(" ")
			//console.log(direction)
			//direction+=nestDirection;
			//console.log(nestDirection)
			/* if (moreOrLessEqual(this.angle, closest.angleToNest)) {
				direction.x += nestDirection.x;
				direction.y += nestDirection.y;
				console.log("pushing egg to nest");
			} */
			Matter.Body.applyForce(this.head.body, this.head.body.position, direction);
			if (dist(this.head.x, this.head.y, closest.x, closest.y) < 5) {
				console.log("grabbed egg");
				this.grabbing = true;
				closest.grabbed = true;
				closest.grabber = this;
				closest.offsetX = closest.x - this.head.x;
				closest.offsetY = closest.y - this.head.y;
				this.grabbedEgg = closest;
			}


		} else if (this.grabbing) {
			var nestDirection = createVector(this.nest.x - this.head.x, this.nest.y - this.head.y);
			nestDirection.normalize();
			nestDirection.mult(.001);
			Matter.Body.applyForce(this.head.body, this.head.body.position, nestDirection);
			if (dist(this.head.x, this.head.y, this.nest.x, this.nest.y) < this.nest.size / 2.1 - Math.random() * (this.nest.size - 2)) {
				this.grabbing = false;
				this.grabbedEgg.grabbed = false;
				this.grabbedEgg.grabber = this;
				this.grabbedEgg.nested = true;
				this.grabbedEgg.timeNested = 0;
				this.grabbedEgg.timeSeed = Math.random();
			}
		}

	}


	eatTogether() {

		//console.log("eating together");
		//console.log(randBody);
		this.direction = createVector(this.mouth.x - this.prey.x, this.mouth.y - this.prey.y);
		this.direction.normalize();
		this.direction.mult(-.00075);
		if (this.friend == !null) {
			this.direction.mult(2);
		}
		/* if (!this.floatyMouth) {
			Matter.Body.applyForce(this.mouth.body, this.mouth.body.position, this.direction);
		} else if (this.floatyMouth) { */
		Matter.Body.applyForce(this.head.body, this.head.body.position, this.direction);
		//Matter.Body.applyForce(this.tail.body, this.tail.body.position, this.direction);
		/* Matter.Body.applyForce(randBody2, randBody2.position, this.direction); */
		//}
		/* stroke(30);
		strokeWeight(1);
		line(this.x, this.y, this.prey.x, this.prey.y); */
		/* randBody.force.x = randBody.position.x - this.prey.x * .001;
		randBody.force.y = randBody.position.y - this.prey.y * .001;
		randBody.update(); */

	}

	findFriend() {
		if (this.friend == null) {
			var rad = (sin(frameCount * .6) + 1) * 20;
			fill(this.fillColor, this.opacity);
			circle(this.head.x, this.head.y, rad);
		}
		if (this.friend == null && frameCount % 4 == 0) {
			var relevantArray;
			if (env == "one") {
				relevantArray = oneLetters;
			} else if (env == "world") {
				relevantArray = letters;
			}
			//console.log("searching for friend");
			noStroke();



			for (var i = 0; i < relevantArray.length; i++) {
				var l = relevantArray[i];
				if (l.letter == this.letter && l.friendly && l.friend == null && l.seed != this.seed && !l.dying && !l.killed) {
					console.log("found friend " + l.letter);
					this.friend = l;
					l.friend = this;
				}
			}
		} else if (this.friend != null) {
			var v = createVector(this.friend.head.x, this.friend.head.y);
			return v;
		}
	}

	hoverFriend() {
		this.friend.prey = this.prey;
		let tar = this.findFriend();
		var direction = createVector(this.head.x - tar.x, this.head.y - tar.y);
		direction.normalize();
		direction.mult(-.00075);
		/* push();
		translate(this.head.x, this.head.y);
		line(0, 0, direction.x, direction.y);
		pop(); */
		if ((frameCount + Math.floor(this.seed * 1000)) % 2 == 0 && (dist(this.head.x, this.head.y, this.friend.head.x, this.friend.head.y) > 10)) {
			Matter.Body.applyForce(this.head.body, this.head.body.position, direction);
		}
		var rudder = createVector(2, 2);


		if (dist(this.head.x, this.head.y, this.friend.head.x, this.friend.head.y) < 5 && !this.bonded /* && this.angle == -this.friend.angle */ ) {
			let middle = createVector((this.head.x + this.friend.head.x) / 2, (this.head.y + this.friend.head.y) / 2);
			let newPoint = new Point(middle.x, middle.y, this.points.length + 1, this);
			newPoint.bond(this.friend);
			this.points.push(newPoint);
			this.bonded = true;
			console.log("letter bonded");
		}
		/* arc(this.tail.x, this.tail.y, 30, 30, 0, this.angle);

		var angleFac = (this.angle - (this.friend.angle));

		if (this.angle < -this.friend.angle) {
			rudder = createVector(1, 0);
			rudder.rotate(angleFac);
			
		} else if (this.angle > -this.friend.angle) {
			rudder = createVector(-1, 0);
			rudder.rotate(-angleFac);
			
		} */

		rudder = createVector(this.tail.x - this.friend.tail.x, this.tail.y - this.friend.tail.y);


		if (debug) {
			push();
			rudder.mult(100);
			translate(this.tail.x, this.tail.y);
			stroke(255, 0, 0);
			line(0, 0, rudder.x, rudder.y);
			pop();
		}
		rudder.normalize();
		rudder.mult(.0005);


		//rudder.mult(angleFac);

		if ((frameCount + Math.floor(this.seed * 1000)) % 1 == 0 && this.bonded) {
			Matter.Body.applyForce(this.tail.body, this.tail.body.position, rudder);
			//console.log(angleFac);
		}
	}

	isFriend(l) {
		if (this.letter == "M") {
			if (l == this.friend) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	doPoliceWork() {
		if (this.villain != null) {
			if (this.villain.dying || this.villain.killed || this.villain.dismembered) {
				this.villain = null;
			}
		}
		var relevantArray;
		if (env == "world") {
			relevantArray = letters;
		} else if (env == "one") {
			relevantArray = oneLetters;
		}
		if (this.villain == null) {
			//console.log("searching for villain");
			var villains = [];
			for (var i = 0; i < relevantArray.length; i++) {
				if (relevantArray[i].letter == "L") {
					villains.push(relevantArray[i]);
				}
			}
			//console.log(villains);
			if (villains.length > 0) {
				var closest = {
					x: 10000,
					y: 10000
				};
				for (var i = 0; i < villains.length; i++) {
					if (dist(closest.x, closest.y, this.head.x, this.head.y) > dist(villains[i].x, villains[i].y, this.head.x, this.head.y) && !villains[i].dying && !villains[i].dismembered) {
						closest = villains[i];
						//console.log("found closer");
						stroke(255);
						//line(this.head.x,this.head.y,closest.x,closest.y);

					}
				}
				if (closest.x != 10000) {
					this.villain = closest;
				}
			}
		} else if (this.villain != null) {
			//if (dist(this.mouth.x, this.mouth.y, this.villain.x, this.villain.y) > 20) {
			/* if (Math.floor(frameCount*.3)&&) */
			var direction = createVector(this.villain.x - this.mouth.x, this.villain.y - this.mouth.y);
			direction.normalize();
			direction.mult(.0015 * (sin(frameCount) * .1 + 1));
			Matter.Body.applyForce(this.head.body, this.head.body.position, direction);
			//this.closePoints(20, 7, -1);
			//circle(this.mouth.x, this.mouth.y, 15);
			//circle(this.villain.x,this.villain.y,40);
			//} else {	
			this.digestCriminal(this.villain);
			this.closePoints(14, 29, (sin(frameCount * .9) + 1) / 2);
			/* console.log((sin(frameCount*.9)+1)/2)
			console.log("digesting"); */
			//}

		}
	}

	digestCriminal() {
		for (var i = 0; i < this.villain.points.length; i++) {
			let p = this.villain.points[i];
			if (dist(p.x, p.y, this.mouth.x, this.mouth.y) < 15) {
				p.life -= 20;
				this.villain.digested -= .25;
				this.stomach += 4;
				if (p.life < 0) {
					this.villain.dismembered = true;
				}
			}

			if (this.villain.digested < 0) {
				this.villain.dying = true;
			}
		}
	}

	loopProcession() {
		//console.log("looping procession")
		var relevantArray;
		if (env == "world") {
			relevantArray = letters;
		} else if (env == "one") {
			relevantArray = oneLetters;
		}
		//console.log(relevantArray);
		var processionists = [];
		for (var i = 0; i < relevantArray.length; i++) {
			if (relevantArray[i].processionist && !relevantArray[i].dying && !relevantArray[i].killed) {
				processionists.push(relevantArray[i]);
			}
		}
		var last = {
			age: 0
		};

		for (var i = 0; i < processionists.length; i++) {
			if (processionists[i].age > last.age) {
				last = processionists[i];
			}
		}
		if (last.age != 0) {
			var direction = createVector(last.tail.x - this.head.x, last.tail.y - this.head.y);
			direction.normalize();
			direction.mult(0.001);
			Matter.Body.applyForce(this.head.body, this.head.body.position, direction);
		}

		this.stomach += hunger / 2;
	}

	proceedToProcession() {
		if (this.fellowProcessionist != null) {
			if (this.fellowProcessionist.killed || this.fellowProcessionist.dying || this.fellowProcessionist.dismembered) {
				this.fellowProcessionist = null;
				console.log("processionist died");
			}
		}

		var relevantArray;
		if (env == "world") {
			relevantArray = letters;
		} else if (env == "one") {
			relevantArray = oneLetters;
		}

		var processionists = [];
		this.processionistI;
		this.beingFollowed = false;
		var oldest;
		var youngest;
		var secondYoungest;
		oldest = relevantArray[0];
		youngest = relevantArray[relevantArray.length - 1];
		secondYoungest = relevantArray[relevantArray.length - 2];
		for (var i = 0; i < relevantArray.length; i++) {
			if (relevantArray[i].fellowProcessionist == this) {
				this.beingFollowed = true;
			}

			if (relevantArray[i].processionist && !relevantArray[i].dying && !relevantArray[i].killed) {
				processionists.push(relevantArray[i]);
				if (relevantArray[i].age > oldest.age) {
					//console.log("found oldest" + oldest);
					oldest = relevantArray[i];
				} else if (relevantArray[i].age < youngest) {
					youngest = relevantArray[i]
				} else if (relevantArray[i].age < secondYoungest) {
					secondYoungest = relevantArray[i];
				}

			}
		}

		for (var i = 0; i < processionists.length; i++) {
			if (processionists[i].seed == this.seed) {
				this.processionistI = i;
			}
		}


		if (youngest == this) {
			this.lastProcessionist = true;
		} else {
			this.lastProcessionist = false;
		}
		if (this.fellowProcessionist != null) {
			var distance = dist(this.head.x, this.head.y, this.fellowProcessionist.tail.x, this.fellowProcessionist.tail.y);
			if (this.stomach < 100) {
				this.stomach += 2;
			}
		}
		if (this.fellowProcessionist == null && !this.lastProcessionist) {
			if (processionists.length > 1) {
				this.fellowProcessionist = processionists[this.processionistI + 1];

			}
			/* for (var i = 0; i < relevantArray.length; i++) {
				if (relevantArray[i].letter == "Y" && relevantArray[i].seed != this.seed && relevantArray[i].lastProcessionist) {
					this.fellowProcessionist = relevantArray[i];
					console.log("found processionist" + relevantArray[i].seed);
				}
			} */
		} else if (this.fellowProcessionist != null && distance > 17) {

			//console.log("following leader of procession");
			var direction = createVector(this.fellowProcessionist.tail.x - this.head.x, this.fellowProcessionist.tail.y - this.head.y);

			direction.normalize();
			direction.mult(.001);
			if (distance > 140) {
				distance = 140;
			}
			var strength = (distance - 17) / 60;
			//console.log(strength);
			direction.mult(strength);
			Matter.Body.applyForce(this.head.body, this.head.body.position, direction);
		}

	}

	watchAroundFood(food, range) {
		var number = 0;
		var relevantArray;
		if (env == "world") {
			relevantArray = letters;
		} else if (env == "one") {
			relevantArray = oneLetters;
		}
		for (var i = 0; i < relevantArray.length; i++) {
			if (relevantArray[i].x != this.x && !this.isFriend(relevantArray[i])) {
				if (dist(food.x, food.y, relevantArray[i].x, relevantArray[i].y) < range) {
					number++
				}
			}
		}
		return number;
	}

	isEnemyNear() {
		if (env == "world") {
			var relevantArray = letters;
		} else if (env == "one") {
			var relevantArray = oneLetters;
		}
		var closest = {
			x: 100000,
			y: 100000
		};
		for (var i = 0; i < relevantArray.length; i++) {

			/* console.log("carnivor letter detected"); */
			//console.log(dist(relevantArray[i].x, relevantArray[i].y, this.x, this.y));
			console.log(dist(closest.x, closest.y, this.x, this.y) > dist(relevantArray[i].x, relevantArray[i].y, this.x, this.y))
			if ((relevantArray[i].herbivore == false) && dist(closest.x, closest.y, this.x, this.y) > dist(relevantArray[i].x, relevantArray[i].y, this.x, this.y) && dist(closest.x, closest.y, this.x, this.y) < 300) {
				closest = relevantArray[i];
				console.log("found predator");
			}

		}
		if (closest.x != 100000) {
			//this.flee(closest);
			return closest;

		} else {
			return false;
		}
	}

	flee(hunter) {
		var direction = createVector(hunter.x - this.head.x, hunter.y - this.head.y);
		direction.normalize;
		direction.mult(-.000005);
		/* console.log("fleeing ! " + direction) */
		if (debug) {
			/* stroke(255,0,0);
			line(this.head.x,this.head.y,direction.x+this.head.x,this.head.y+direction.y); */
		}
		var randBody = this.points[Math.floor(Math.random() * this.points.length)].body;
		Matter.Body.applyForce(randBody, randBody.position, direction);

	}

	pointInPolygon(x, y) {
		var collidedX = 0;
		var collidedY = 0;
		var beforeX = [];
		var beforeY = [];

		for (var i = 0; i < this.points.length - 1; i++) {
			var thisPoint = this.points[i];

			if (thisPoint.x <= x + 10) {
				beforeX.push(thisPoint);
			}
			if (thisPoint.y <= y + 10) {
				beforeY.push(thisPoint);
			}
		}
		beforeX.push(this.points[beforeX.length + 1]);
		beforeY.push(this.points[beforeY.length + 1]);

		//print(beforeX);

		for (var i = 0; i < beforeX.length - 2; i++) {
			var thisX = beforeX[i].x;

			var prevX = beforeX[i + 1].x;

			//print("prevX: "+prevX);

			var highest, lowest;
			//print("highest: ",highest);
			var insideX, insideY;

			if (prevX > thisX) {
				highest = prevX;
				lowest = thisX;
			} else {
				highest = thisX;
				lowest = prevX;
			}
			if (x <= highest && x >= lowest) {
				collidedX++;
			}
		}

		for (var i = 0; i < beforeY.length - 2; i++) {
			var thisY = beforeY[i].y;

			var prevY = beforeY[i + 1].y;
			var highest, lowest;
			var insideX, insideY;

			if (prevY > thisY) {
				highest = prevY;
				lowest = thisY;
			} else {
				highest = thisY;
				lowest = prevY;
			}
			if (y <= highest && y >= lowest) {
				collidedY++;
				stroke(255, 0, 0);
				strokeWeight(2);
				point(this.posX, thisY);
			}
		}

		if (debug) {
			line(x, 0, x, height);
			line(0, y, width, y);
			stroke(255);
			for (var i = 1; i < beforeX.length - 2; i++) {
				line(beforeX[i].x, beforeX[i].y, beforeX[i + 1].x, beforeX[i + 1].y);
			}

			for (var i = 1; i < beforeY.length - 2; i++) {
				line(beforeY[i].x, beforeY[i].y, beforeY[i + 1].x, beforeY[i + 1].y);
			}
		}

		print(collidedX, collidedY);
		var collisionX, collisionY;
		if (collidedX % 2 == 0 && collidedX != 0) {
			collisionX = false;
		} else {
			collisionX = true;
		}

		if (collidedY % 2 == 0 && collidedY != 0) {
			collisionY = false;
		} else {
			collisionY = true;
		}

		if (collisionX && collisionY) {
			return false;
		} else {
			return true;
		}
	}
}