class Point {
    constructor(x, y, i, letter) {
        this.x = x;
        this.y = y;
        this.i = i;
        this.iPUTAIN = i;
        this.body;
        this.letter = letter;
        this.radius = this.letter.size / 32;
        this.links = [];
        this.jitter = 0.000;
        this.jitterThreshold = 0.01;
        this.life = 100;
        this.killed = false;
        this.timeNested = 0;
        this.originalX = x;
        this.originalY = y;


        this.constraints = [];
        //console.log(this.letter.showroom);
        if (this.letter.showroom != true) {
            this.body = Bodies.circle(this.x, this.y, this.radius);
            this.body.frictionAir = 0.1;
            Matter.Body.setInertia(this.body, 1000);
            this.letter.bodies.push(this.body);
        }

    }

    setup(points) {
        this.points = points;
        this.upper = this.points[this.i + 1];
        this.lower = this.points[this.i - 1];
        try {
            this.upperDistance = dist(this.points[this.i + 1].x, this.points[this.i + 1].y, this.x, this.y);
        } catch {
            /* console.log("no upper" );*/
        }
        try {
            this.upperAngle = degrees(Math.atan2(this.upper.x - this.x, this.upper.x - this.y));
        } catch {
            /* console.log("no upper" );*/
        }
        try {
            this.lowerDistance = dist(this.points[this.i - 1].x, this.points[this.i - 1].y, this.x, this.y);
        } catch {
            /* console.log("no lower" );*/
        }
        try {
            this.lowerAngle = degrees(Math.atan2(this.upper.x - this.x, this.upper.y - this.y));
        } catch {
            /* console.log("no lower" );*/
        }



        for (point in this.points) {
            var distCounter;
            var near = [];


            if (this.letter.showroom != true) {
                for (var j = 0; j < this.letter.bodies.length - 1; j++) {
                    //if (this.i == 0) console.log("this body:" + this.letter.bodies[j].position.x);
                    /* console.log(this.letter.bodies[j].position) */
                    if (dist(this.x, this.y, this.letter.bodies[j].position.x, this.letter.bodies[j].position.y) < this.letter.size / 4 && this.links.length < 8 && this.letter.bodies[j].position.x != this.x) {
                        distCounter += 1;
                        var foundPoint = createVector(this.letter.bodies[j].position.x, this.letter.bodies[j].position.y);
                        near.push(foundPoint);



                        var constraint = Constraint.create({
                            bodyA: this.letter.bodies[j],
                            pointA: {
                                x: 0,
                                y: 0
                            },
                            bodyB: this.body,
                            pointB: {
                                x: 0,
                                y: 0
                            },
                            stiffness: 1
                        });
                        if (env !== "showroom") {
                            World.add(world, constraint);
                            this.constraints.push(constraint);
                        }
                        this.links.push(this.letter.bodies[j]);

                        circle(foundPoint.x, foundPoint.y, 10);
                    }
                }

                for (var i = 0; i < near.length; i++) {


                }



            }
        }
        //print(this.body.position);
        if (this.letter.showroom != true) {
            World.add(world, this.body);
        }
    }

    update() {

        if (this.life < 1) {
            this.killed = true;
        }
        this.x = this.body.position.x;
        this.y = this.body.position.y;
        if (this.killed) {
            if (this.letter.showroom != true) {
                World.remove(world, this.body);
            }
        }

        if (this.y > height + 300 || this.y < 0 - 300 || this.x > width + 300 || this.x < 0 - 300 && !this.killed) {


            print("removed body from world" + this.y + " " + this.x);
            this.killed = true;
            this.letter.killed = true;

            //remove from letters array
            for (var i = 0; i < letters.length; i++) {
                if (letters[i].points[0].x == this.points[0].x) {
                    letters.splice(i, 1);
                }
            }
        }

        //eat food

        /* for (var i = 0; i< food.length; i++){
            var f = food[i];
            if (dist(f.x,f.y,this.x,this.y)<f.size/2){
                f.size-=.4;
            }
        } */

        /* for (var i = 0; i < this.constraints.length; i++) {
            var constr = this.constraints[i];
            constr.stiffness = map(sin(frameCount * .1 + (this.letter.seed * 30)), -1, 1, 0.6, 1);
        } */
        //Matter.Body.applyForce(this.body,this.body.position,{x:10,y:10})

    }

    draw() {

        //line(mouseX-width/2,mouseY-height/2,this.x,this.y);




        /* if (this.i = 1){
            print("x: "+this.body.position.x);
        } */

        /* if (this.i == 15) {
            stroke(0, 255, 0);
            print("hello");
        } else {
            stroke(255);
        } */
        //noStroke();


        //          bones highlighters
        if (debug) {
            fill(255);
            strokeWeight(1);
            stroke(255);
            if (dist(mouseX, mouseY, this.x, this.y) < this.radius && debug) {
                for (var i = 0; i < letters.length; i++) {
                    if (letters[i].x == this.letter.x) {
                        this.letter.i = i;
                    }
                }
                for (var i = 0; i < oneLetters.length; i++) {
                    if (oneLetters[i].seed == this.letter.seed) {
                        this.letter.i = i;
                    }
                }
                console.log(this.i, this.letter.letter, this.letter.i);
                fill("red");
                stroke("red");
                letterOverlapped = this.letter;
                //console.log(this.x, " ", this.y);
            };
            circle(this.x, this.y, this.radius * 1);




            /* for (var i = 0; i < this.links.length; i++) {
                line(this.x, this.y, this.links[i].position.x, this.links[i].position.y);
            } */
        }

        /* line(this.x,this.y,cos(this.upperAngle)*this.upperDistance,sin(this.upperAngle)*this.upperDistance);
        line(this.x,this.y,cos(this.lowerAngle)*this.lowerDistance,cos(this.lowerAngle)*this.lowerDistance); */
    }

    bond(other) {

        if (other.body != undefined) {
            var constraint = Constraint.create({
                bodyA: other.body,
                pointA: {
                    x: 0,
                    y: 0
                },
                bodyB: this.body,
                pointB: {
                    x: 0,
                    y: 0
                },
                stiffness: 1
            });
            World.add(world, constraint);
            this.constraints.push(constraint);

            this.links.push(this.letter.bodies[j]);
        } else {
            var daBodies = this.letter.bodies.concat(other.bodies);

            for (var j = 0; j < daBodies.length - 1; j++) {
                //if (this.i == 0) console.log("this body:" + daBodies[j].position.x);
                /* console.log(daBodies[j].position) */
                if (dist(this.x, this.y, daBodies[j].position.x, daBodies[j].position.y) < this.letter.size / 4 && this.links.length < 8 && daBodies[j].position.x != this.x) {

                    var foundPoint = createVector(daBodies[j].position.x, daBodies[j].position.y);




                    var constraint = Constraint.create({
                        bodyA: daBodies[j],
                        pointA: {
                            x: 0,
                            y: 0
                        },
                        bodyB: this.body,
                        pointB: {
                            x: 0,
                            y: 0
                        },
                        stiffness: 1
                    });
                    if (env !== "showroom") {
                        World.add(world, constraint);
                        this.constraints.push(constraint);
                    }
                    this.links.push(daBodies[j]);

                    //circle(foundPoint.x, foundPoint.y, 10);
                }
            }
        }


    }
}