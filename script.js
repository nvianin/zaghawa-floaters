let font;
let latinFont;

var pageTitle = "Zaghawa Petri Dish ";
var titleScroll = 0;

let letters = [];
let food = [];
var debug = 0;
var frame = 0;
var letterSize = 100;
var arrow;
var carnivoreLetters = ["L"]
var maxLetters = 12;
var pause = false;
var recycling = true;

var nests = [];

var prevMouseX;
var prevMouseY;

var oneLetters = [];

var collided;
var fails = 0;
var eggs = [];

var Engine;
var engine;
var World;
var world;

var drawerOpen = false;
var drawerMaxY = 125;
var drawerY = 0;
var drawerBeingPulled = false;
var drawerInteria = 0;
var drawerScroll = 0;
var drawerBeingDragged = false;
var drawerDragInertia = 0;
var drawerMaxX;
var drawerSelecting = false;
var drawerGrabbing = false;
var grabbedLetter;

var tool = 0;
var tools = ["cursor", "push", "attract", "kill", "repopulate"];
var toolIcons = [];
var hoveredTool;
var selectedTool;




var backgroundParticles = [];
var parallaxParticles = [
    [],
    [],
    [],
    [],
    []
];

var selectedLetter = "K";
var nextLetter = null;


var letterOverlapped;
var mouthedLetter = ["A", "K", "E", "Z", "O", "T", "X", "M", "H", "R", "W", "I"];

var showroomLetters = [];
var drawerLetters = [];

var env = "showroom"; // showroom, one, world

var currentPointId = "none";

let walls = [];
var hunger = .2;
//hunger = 0;

/* var Mouse; */

let chars = [
    "A", "B", "E", "G", "H", "I", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "W", "X", "Y", "Z"
];
let char = "A";
let holedLetters = ["A", "P", "N", "B", "G", "X", "U", "Y"];

function preload() {
    pixelDensity(1);


    toolIcons[0] = loadImage("cursor.png");
    toolIcons[1] = loadImage("outwards-01.png");
    toolIcons[2] = loadImage("inwards-01.png");
    toolIcons[3] = loadImage("kill.png");
    toolIcons[4] = loadImage("recycling.png");
    arrow = loadImage("arrow.png");;
    font = loadFont("https://cdn.glitch.com/35b61ef4-337e-4d91-a65b-616d7f6ccccd%2FZaghawaBeria.otf?v=1568975649791");
    latinFont = loadFont("Plain-Regular.otf");

    Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies;
    Constraint = Matter.Constraint;

    engine = Engine.create();
    Engine.run(engine);

    world = engine.world;

    /*  mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                // allow bodies on mouse to rotate
                angularStiffness: 0,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint); */
    console.log("finished loading");

}

function setup() {
    selectedLetter = new Letter(200, 200, 100, "K", 200, "one");

    var total;
    /* for (var i = 0; i < chars.length; i++) {
        total += chars[i] + " ";
    }
    console.log(total); */
    //console.log("setup initialized");
    createCanvas(windowWidth, windowHeight);
    smooth();
    drawBackground();
    if (width == 1920) {
        drawerMaxX = -width - 30;
    } else {
        console.log("used fake width");
        var fakeWidth = width + (1920 - width);
        drawerMax = -fakeWidth - 30;
    }
    drawerMaxX = 1800;
    prevMouseX = 0;
    prevMouseY = 0;
    //letter(0,0,500,"R",color("white"));
    /* l = new Letter(0, 0, 150, "a", 255);

    letters.push(l); */
    console.log(letters);
    frameRate(24);


    //                                  showroom letter
    var xW = 170;
    var yW = height / 4;
    var margin = (width - xW * 5) / 2;
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 5; x++) {
            if (chars[x + y * 5] == "L") {
                let l = new Letter(x * xW + 16 /* - width / 2  */ + xW / 4 + margin, y * yW /* - height / 2 */ + 100, 100, chars[x + y * 5], 255, true);
                l.showroom = true;
                showroomLetters.push(l);
            } else {
                let l = new Letter(x * xW /* - width / 2  */ + xW / 4 + margin, y * yW /* - height / 2 */ + 100, 100, chars[x + y * 5], 255, true);
                l.showroom = true;
                showroomLetters.push(l);
            }
        }
    }
    var xW = 100;
    var yW = height / 4;
    for (var x = 0; x < chars.length; x++) {
        if (chars[x] == "L") {
            let l = new Letter(x * xW + 13 /* - width / 2  */ + xW / 4, -100, 100, chars[x], 255, true);
            l.drawer = true;
            //l.showroom = "drawer";
            drawerLetters.push(l);
        } else {
            let l = new Letter(x * xW /* - width / 2  */ + xW / 4, -100, 100, chars[x], 255, true);
            l.drawer = true;
            //l.showroom = "drawer";
            drawerLetters.push(l);
        }
    }

    drawerMaxX = -chars.length * 30;
    drawerMaxX -= 1920 - width;


    engine.constraintIterations = 1;
    engine.enableSleeping = true;
    engine.world.gravity.y = 0;

    //walls
    /* var body = Bodies.rectangle(-width-25,0,120,height/2, { isStatic: true });
    World.add(world, body);
    walls.push(body);
    var body = Bodies.rectangle(width+25,0,50,height/2, {isStatic: true});
    World.add(world, body);
    walls.push(body);
    var body = Bodies.rectangle(0,-height-25,width/2,50, {isStatic: true});
    World.add(world, body);
    walls.push(body);
    var body = Bodies.rectangle(0,height+25,width/2,50,{isStatic: true});
    World.add(world,body);
    walls.push(body);
    print(walls); */

    textFont(font);
}

function mouseInBox() {
    if (dist(mouseX, mouseY, 15, 15) < 13) {
        return true;
    } else {
        return false;
    }
}

function mouseReleased() {

    var mouseSpeed = Math.abs(mouseY - prevMouseY);
    var mouseXSpeed = Math.abs(mouseX - prevMouseX);
    if (mouseSpeed > 2 && drawerBeingPulled) {
        drawerInteria -= (mouseY - prevMouseY)
    }
    if (mouseXSpeed > 2 && drawerBeingDragged) {
        drawerDragInertia -= (mouseX - prevMouseX);
    }

    if (drawerGrabbing && !mouseInDrawer()) {
        console.log("dropping letter " + grabbedLetter.letter)
        if ((env == "one" && oneLetters.length < 8 && selectedLetter.letter != "Y") || (env == "world" && letters.length < maxLetters)) {
            if (env == "world") {
                var lType = false;
            } else if (env == "one") {
                var lType = "one";
            }
            newLetter = new Letter(mouseX - grabbedLetter.grabX, mouseY - grabbedLetter.grabY, 100, grabbedLetter.letter, 255, lType);
            newLetter.opacity=255;
            newLetter.fillColor=200;
            if (env == "one") {
                oneLetters.push(newLetter);
            } else if (env == "world") {
                letters.push(newLetter);
            }
            console.log("Created Letter on MousePos");
            //console.log(letters); look ma im writing o ntwo screens
        } else if (env == "world" && letters.length >= maxLetters && letters.length < maxLetters + 5) {
            var lType = false;
            newLetter = new Letter(mouseX - grabbedLetter.grabX, mouseY - grabbedLetter.grabY, 100, grabbedLetter.letter, 255, lType);
            newLetter.opacity=255;
            newLetter.fillColor=200;
            var rand = Math.floor(Math.random() * letters.length);
            letters[rand].dying = true;
            letters.push(newLetter);

        } else if (env == "one" && oneLetters.length < 8 && selectedLetter.letter == "Y") {
            newLetter = new Letter(mouseX - grabbedLetter.grabX, mouseY - grabbedLetter.grabY, 100, grabbedLetter.letter, 255, lType);
            newLetter.opacity=255;
            newLetter.fillColor=200;
            oneLetters.push(newLetter);

        }
    }

    drawerBeingPulled = false;
    drawerBeingDragged = false;
    drawerGrabbing = false;
}

function mouseInPuller() {
    if (mouseX > width / 2 - 30 && mouseX < width / 2 + 30) {
        if (mouseY > height - drawerY - 20 && mouseY < height - drawerY) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function mousePressed() {
    if (drawerSelecting) {
        drawerGrabbing = true;
        let l = new Letter(mouseX - grabbedLetter.grabX, mouseY - grabbedLetter.grabY, 100, grabbedLetter.letter, 255, false);
        l.drawer = true;
        l.grabX = grabbedLetter.grabX;
        l.grabY = grabbedLetter.grabY;
        l.opacity = 255;
        l.fillColor = 255;
        grabbedLetter = l;
    }


    if (!mouseInBox() && !drawerBeingPulled && !mouseInDrawer() && !mouseInPuller() && !clickedInMenu()) {
        if ((env == "one" && oneLetters.length < 8 && selectedLetter.letter != "Y") && (selectedTool == 0 || selectedTool == null) || (env == "world" && letters.length < maxLetters) && (selectedTool == 0 || selectedTool == null)) {
            if (env == "world") {
                var lType = false;
            } else if (env == "one") {
                var lType = "one";
            }
            newLetter = new Letter(mouseX, mouseY, 100, char, 255, lType);
            if (env == "one") {
                oneLetters.push(newLetter);
            } else if (env == "world") {
                letters.push(newLetter);
            }
            console.log("Created Letter on MousePos");
            //console.log(letters);
        } else if (env == "world" && letters.length >= maxLetters && letters.length < maxLetters + 5 && (selectedTool == 0 || selectedTool == null)) {
            var lType = false;
            newLetter = new Letter(mouseX, mouseY, 100, char, 255, lType);
            var rand = Math.floor(Math.random() * letters.length);
            letters[rand].dying = true;
            letters.push(newLetter);

        } else if (env == "one" && oneLetters.length < 8 && selectedLetter.letter == "Y" && (selectedTool == 0 || selectedTool == null)) {
            newLetter = new Letter(mouseX, mouseY, 100, char, 255, lType);
            oneLetters.push(newLetter);

        }
        if (env == "showroom") {
            for (var i = 0; i < showroomLetters.length; i++) {
                // switch to one view
                if (showroomLetters[i].selected) {
                    Matter.World.clear(world, false);
                    var ugh = showroomLetters[i];
                    console.log("selected " + ugh.letter);
                    env = "one";
                    char = ugh.letter;
                    selectedLetter = new Letter(ugh.originalX, ugh.originalY, 100, ugh.letter, 200, "one");
                    selectedLetter.fillColor = 200;
                    selectedLetter.opacity = 255;
                    oneLetters.push(selectedLetter);
                    if (char == "L") {
                        l = new Letter(width / 2, height / 2, 100, "L", 200, "one");

                        oneLetters.push(l);
                    }
                    food = [];
                    nests = [];
                    eggs = [];
                    backgroundParticles = [];
                    parallaxParticles = [];

                }
            }
        }

    } else if (mouseInBox() && !drawerBeingPulled && !mouseInDrawer() && !clickedInMenu()) {
        if (env == "world") {
            env = "showroom";
        } else if (env == "showroom") {
            Matter.World.clear(world, false);
            for (var i = 0; i < letters.length; i++) {
                letters[i].killed = true;
            }
            letters = [];
            nests = [];
            eggs = [];
            backgroundParticles = [];
            parallaxParticles = [];
            env = "world";
        } else if (env == "one") {
            for (var i = 0; i < oneLetters.length; i++) {
                oneLetters[i].killed = true;
            }
            oneLetters = [];
            backgroundParticles = [];
            parallaxParticles = [];
            env = "showroom";
        }
    }

    if (mouseInDrawer() && !drawerGrabbing) {
        drawerBeingDragged = true;
    }

}

function keyTyped() {

    for (var i = 0; i < chars.length; i++) {
        if (key.toUpperCase() == chars[i]) {
            char = key.toUpperCase();
            console.log("selected " + key);
        }
    }
    if (key == "1") {
        selectedTool = 0;
    } else if (key == "2") {
        selectedTool = 1;
    } else if (key == "3") {
        selectedTool = 2;
    } else if (key == "4") {
        selectedTool = 3;
    }
}

function keyPressed() {
    if (keyCode == 32) {
        console.log("spcae")
    }
}

function findEmptySpace() {
    var x = Math.random() * width;
    var y = Math.random() * height;

    var discrepancies = 0;
    if (letters.length > 0) {
        for (var i = 0; i < letters.length; i++) {
            if (dist(letters[i].x + 100, letters[i].y + 100, x, y) < 300) {
                discrepancies++;
            }
            if (discrepancies == 0) {
                //console.log("found space")
                vector = createVector(x, y);
                return vector;
            } else if (fails < 100) {
                //console.log("retrying space")
                fails++;
                vector = findEmptySpace();
                return vector;

            } else if (fails >= 100) {
                console.log("empty space epic FAIL")
                vector = createVector(x, y);
                fails = 0;
                return vector;
            }

        }
    } else if (letters.length == 0) {
        vector = createVector(x, y);
        return vector;
    }
}

function draw() {

    if (backgroundParticles.length > 2) {
        //console.log(backgroundParticles[1].color);
    }
    //console.log(innerWidth);    

    

    scrollTitle();

    if (mouseInBox()) {
        cursor(CROSS);
    } else if (mouseY > height - drawerY - 20 && mouseY < height - drawerY && mouseX > width / 2 - 30 && mouseX < width / 2 + 30 && !drawerGrabbing || drawerBeingPulled) {
        if (drawerBeingPulled) {
            cursor('grabbing');
        } else {
            cursor('grab');
        }
    } else if (mouseInDrawer() || drawerBeingDragged) {
        if (drawerBeingDragged) {
            cursor('grabbing');
        } else {
            cursor('grab');
        }
    } else {
        cursor();
    }

    if (eggs.length < 40) {
        let e = new Egg(Math.random() * width, Math.random() * height);
        eggs.push(e);
    }

    for (var i = 0; i < nests.length; i++) {
        if (nests[i].killed) {
            nests.splice(i, 1);
        }
    }

    for (var i = 0; i < letters.length; i++) {
        if (letters[i].killed) {
            letters.splice(i, 1);
        }
    }

    if (env == "world") {



        var cadavers = 0;
        for (var i = 0; i < letters.length; i++) {
            if (letters[i].dismembered == true) {
                cadavers++;
                //console.log("deasd one");
            }
            /* console.log("cadavers: "+cadavers); */
        }

        if (food.length < 40 && frameCount % 16 == 0) {

            var vector = createVector(random(30, width - 30), random(30, height - 30));
            var x = vector.x;
            var y = vector.y;

            let f = new Food(x, y, random(20, 50));
            f.spawn();
            food.push(f);
        }

        if (letters.length < maxLetters && frameCount % 22 == 0 && recycling || (cadavers > 2 && letters.length < maxLetters + cadavers && cadavers < 4) && nextLetter == null && recycling) {
            console.log("spawning new letter")
            if (letters.length == 0) {
                let v = findEmptySpace();
                let l = new Letter(v.x, v.y, 100, "A", 255, false);
                letters.push(l);
            } else {
                let v = findEmptySpace();
                let l = new Letter(v.x, v.y, 100, randomLetter(), 255, false);
                letters.push(l);
            }
        } else if (nextLetter != null) {
            let v = findEmptySpace();
            let l = new Letter(v.x, v.y, 100, nextLetter, 255, false);
            letters.push(l);
            nextLetter = null;
        }
        var policeOfficers = [];
        var carnisIds = [];
        var carnis = 0;
        for (var i = 0; i < letters.length; i++) {
            if (!letters[i].herbivore && !letters[i].dying) {
                carnis++;
                carnisIds.push(i);
            } else if (letters[i].police && !letters[i].dying) {
                policeOfficers.push(letters[i]);
            }
        }
        if (carnis < 1 && letters.length > 2) {
            nextLetter = "L";
        }
        if (carnis > 2) {
            var rand = Math.round(Math.random() * carnisIds.length);
            try {
                letters[carnisIds[rand]].dying = true;
                carnisIds.splice(rand, 1);
            } catch (e) {}
        }

        if (policeOfficers.length < 1) {
            var v = findEmptySpace();
            let l = new Letter(v.x, v.y, 100, "X", 255, false);
            letters.push(l);
        }

        drawBackground();
        //print(map(sin(frameCount*.01),-1,1,0,255));
        //background(map(sin(frameCount*.1),-1,1,0,255));
        //letter(255,255,500,"a",255);

        //translate(width/2,height/2);

        for (var i = 0; i < eggs.length; i++) {
            eggs[i].update();
            eggs[i].draw();
        }

        for (var i = 0; i < nests.length; i++) {
            nests[i].update();
            nests[i].draw();
        }

        for (var i = 0; i < food.length; i++) {
            try {
                food[i].update();
                food[i].draw();
                if (food[i].size < 4) {
                    food.splice(i, 1);

                }
            } catch (e) {};
        }


        for (var i = 0; i < letters.length; i++) {
            letters[i].update();
            letters[i].draw();
        }
        fill(125);

    } else if (env == "showroom") {


        drawBackground();
        for (var i = 0; i < showroomLetters.length; i++) {
            var bruh = showroomLetters[i];
            let label = bruh.letter;
            noStroke();
            fill(255);
            textFont(latinFont);
            if (debug) {
                text(label, bruh.originalX - 15, bruh.originalY + 30)
            }
            bruh.update();
            bruh.draw();
        }

    } else if (env == "one") {

        if (food.length < 20 && frameCount % 16 == 0) {

            var vector = createVector(random(30, width - 30), random(30, height - 30));
            var x = vector.x;
            var y = vector.y;

            let f = new Food(x, y, random(20, 50));
            food.push(f);
        }
        var cadavers = 0;
        for (var i = 0; i < oneLetters.length; i++) {
            if (oneLetters[i].dismembered == true) {
                cadavers++;
                //console.log("dead one");
            }
            /* console.log("cadavers: "+cadavers); */
        }
        if ((oneLetters.length < 9 || oneLetters.length - cadavers < 6) && selectedLetter.letter == "L" && recycling) {
            l = new Letter(random(0, width), random(0, height), 100, "L", 200, "one");
            oneLetters.push(l);
            console.log("new gladiator");
        }

        drawBackground();
        /* selectedLetter.update();
        selectedLetter.draw(); */

        for (var i = 0; i < nests.length; i++) {
            nests[i].update();
            nests[i].draw();
        }

        if (selectedLetter.letter == "H") {
            for (var i = 0; i < eggs.length; i++) {
                eggs[i].update();
                eggs[i].draw();
            }
        }
        var villains = 0;
        if (selectedLetter.police) {
            for (var i = 0; i < oneLetters.length; i++) {
                if (oneLetters[i].letter == "L" && !oneLetters[i].dying) {
                    villains++;
                }
            }
            if (villains < 2) {
                let v = findEmptySpace();
                let l = new Letter(v.x, v.y, 100, "L", 255, "one");
                oneLetters.push(l);
            }
        }

        for (var i = 0; i < oneLetters.length; i++) {
            oneLetters[i].update();
            oneLetters[i].draw();
        }

        for (var i = 0; i < food.length; i++) {
            food[i].update();
            food[i].draw();
        }
    }

    //draw switching block box
    fill(80);
    noStroke();
    circle(15, 15, 26);
    tint(30);
    image(arrow, 4, 3, 20, 22);
    for (var i = 0; i < food.length; i++) {
        var fud = food[i];
        if (fud.size < 4) {
            for (var i = 0; i < food.length; i++) {
                if (food[i].x == fud.x) {
                    food.splice(i, 1);
                    //console.log("erased food");
                }
            }
        }
    }

    if (env != "showroom") {
        drawForegroundParticles();
    }

    frame++;
    if (env != "showroom") {
        Engine.update(engine);
    }

    for (var i = 0; i < letters.length; i++) {
        for (var j = 0; j < letters[i].points.length; j++) {
            var p = letters[i].points[j];
            if (p.killed) {
                letters[i].points.splice(j, 1);
                //console.log("brutally murdered point")
            }
        }
    }

    for (var i = 0; i < letters.length; i++) {
        if (letters[i].killed == true) {
            letters.splice(i, 1);
        }
    }

    for (var i = 0; i < oneLetters.length; i++) {
        for (var j = 0; j < oneLetters[i].points.length; j++) {
            var p = oneLetters[i].points[j];
            if (p.killed) {
                oneLetters[i].points.splice(j, 1);
                //console.log("brutally murdered point " + j)
            }
        }
    }

    for (var i = 0; i < oneLetters.length; i++) {
        if (oneLetters[i].killed == true) {
            oneLetters.splice(i, 1);
        }
    }

    drawToolbox();
    useTool();

    drawDrawerPuller();
    drawDrawer();
    drawerPulling()
    if (drawerGrabbing) {
        //console.log(grabbedLetter);
        for (var i = 0; i < grabbedLetter.points.length; i++) {
            let p = grabbedLetter.points[i];
            //console.log(p.x,p.y);
            //console.log(mouseX,p.letter.posX);
            //console.log(p.letter.grabX, p.letter.grabY);
            var xMod = (mouseX - p.letter.grabX) - (prevMouseX - p.letter.grabX);
            p.x += mouseX - prevMouseX;
            p.y += mouseY - prevMouseY;
            //p.x = p.x-p.letter.grabX;
            //p.y = p.y-p.letter.grabY;
            /* stroke(255);
            circle(mouseX, mouseY, 30);
            line(mouseX, mouseY, p.x, p.y); */
        }
        grabbedLetter.draw();
    }

    prevMouseX = mouseX;
    prevMouseY = mouseY;

    if (mouseIsPressed && !drawerBeingPulled &&!clickedInMenu() && !mouseInDrawer() && !mouseInBox() && env != "showroom") {
        if (selectedTool == 1) {
            force(1);
        } else if (selectedTool == 2) {
            force(-1);
        } else if (selectedTool == 3) {
            kill();
        }

    }
}





/* function letter(posX,posY, size, letter,letterColor){
    beginShape();
    
    fill(letterColor);

    points = font.textToPoints(letter, 0,0,size,{
        sampleFactor: 5,
        simplifyThreshold:0
    });

    for (var i = 0; i < points.length; i++){
        let p = points[i];
        vertex(
            p.x+posX-(size/3),
            p.y+posY+(size/3)
        );
    }
    endShape(CLOSE);
    console.log("Drew letter "+letter)
}*/
function clickedInMenu() {
    for (var i = 0; i < tools.length; i++) {
        var boxWidth = 32;
        if (mouseX > width - boxWidth && mouseY < boxWidth * i + (i * 5) + boxWidth && mouseY > boxWidth * i + (i * 5)) {
            if (mouseIsPressed) {
                return true;
            }
        }
    }

}

function drawToolbox() {
    //console.log("drawing Toolbox");
    var boxWidth = 32;
    fill(60);
    noStroke();
    //rect(width - boxWidth, 0, width, boxWidth * tools.length+(4*tools.length));
    for (var i = 0; i < tools.length; i++) {
        //console.log(i)
        if (i == selectedTool) {
            fill(200);
        } else if (i == hoveredTool && i != 4) {
            fill(120);
        } else if (i == 4) {
            if (recycling) {
                fill(200);
            } else {
                fill(60);
            }
        } else {
            fill(60);
        }
        rect(width - boxWidth, boxWidth * i + (i * 5), width, boxWidth * i + (i * 5) + boxWidth)
        image(toolIcons[i], width - boxWidth, boxWidth * i + (i * 5), boxWidth, boxWidth);
    }
    var usedTool;
    for (var i = 0; i < tools.length; i++) {
        if (mouseX > width - boxWidth && mouseY < boxWidth * i + (i * 5) + boxWidth && mouseY > boxWidth * i + (i * 5)) {
            usedTool = i;
        }
    }
    if (usedTool != null && !mouseIsPressed) {
        hoveredTool = usedTool;

    } else if (mouseIsPressed && usedTool != null && usedTool != selectedTool && usedTool != 4) {
        selectedTool = usedTool;
        hoveredTool = null;
    } else if (usedTool == 4 && frameCount % 10 == 0) {
        if (recycling == true) {
            recycling = false;
        } else {
            recycling = true;
        }
    } else {
        hoveredTool = null;
    }
}

function useTool() {}

class Wall {
    constructor() {

    }

    draw() {

    }

}

function randomLetter() {
    var i = floor(random(0, chars.length));
    return chars[i];
}

function drawBackground() {
    background(0);

    if (env != "showroom") {
        drawParticles();
    }

}

function drawParticles() {
    while (parallaxParticles.length < 5) {
        let a = [];
        parallaxParticles.push(a);
    }
    for (var i = 0; i < parallaxParticles.length; i++) {
        while (parallaxParticles[i].length < 100) {
            let p = new backgroundParticle(i);
            parallaxParticles[i].push(p);
        }
        for (var j = 0; j < parallaxParticles[i].length; j++) {
            parallaxParticles[i][j].update();
            parallaxParticles[i][j].draw();
        }
    }
}

function drawForegroundParticles() {
    while (backgroundParticles.length < 100) {
        let p = new backgroundParticle();
        backgroundParticles.push(p);
    }

    for (var i = 0; i < backgroundParticles.length; i++) {
        backgroundParticles[i].update();
        backgroundParticles[i].draw();
    }
}

class backgroundParticle {
    constructor(p) {
        this.x = random(-100, width + 100);
        this.y = random(-100, height + 100);
        this.seed = Math.random();
        this.age = 0;
        this.color = 0;
        this.parallax = p || 1;
    }

    update() {
        var mouseDirection = createVector(mouseX - width / 2, mouseY - height / 2);
        //stroke(255);
        mouseDirection.rotate(noise(frameCount * .005) * PI);
        //line(width/2,height/2,width/2+mouseDirection.x,height/2+mouseDirection.y)
        mouseDirection.normalize();
        mouseDirection.mult(noise(this.x, this.y));
        mouseDirection.mult(-1);



        if (this.age < 7 * 5 - this.parallax) {
            this.color++;
        }
        this.age++;
        var mod = this.seed * 1000;
        var scale = .01;
        this.x += (noise((frameCount + mod) * scale, (frameCount + mod + 10000) * scale) * 2 - 1) * this.parallax;
        this.y += (noise((frameCount + mod + 1000000) * scale, (frameCount + mod + 1000000000) * scale) * 2 - 1) * this.parallax;

        this.x += mouseDirection.x * 2 * ((this.parallax - 5) / 5);
        this.y += mouseDirection.y * 2 * ((this.parallax - 5) / 5);

        if (this.x < -100) {
            this.x = width + 99;
        } else if (this.x > width + 100) {
            this.x = -99;
        }

        if (this.y < -100) {
            this.y = height + 99;
        } else if (this.y > height + 100) {
            this.y = -99;
        }
    }

    draw() {
        fill(255, this.color);
        noStroke();
        circle(this.x, this.y, .6 * (parallaxParticles.length - this.parallax) + 1);
    }

}
class Nest {
    constructor(x, y, letter) {
        this.eggs = 0;
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.size = 50;
        this.dying = false;
        this.killed = false;
        this.opacity = 255;
    }

    update() {
        if (this.letter.killed) {
            this.dying = true;
        }
        if (this.dying) {
            this.opacity -= 2;
        }
        if (this.opacity < 0) {
            this.killed = true;
        }
    }
    draw() {

        //fill(122, this.opacity);
        strokeWeight(2);
        stroke(200, this.opacity);

        noFill();
        circle(this.x, this.y, this.size);
        /* console.log("drawing nest") */
    }
}

class Egg {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.seed = Math.random();
        this.size = this.seed * 8 + 8;
        this.driftFactor = random(.25, .5);
        this.drifting = true;
        this.angleToNest;
        this.grabbed = false;
        this.nested = false;
        this.offsetX;
        this.offsetY;
        this.timeNested = 0;
        this.timeSeed = Math.random();
    }
    update() {
        if (this.nested) {
            this.timeNested++;
            if (this.timeNested > this.timeSeed * 2500) {
                this.nested = false;
                console.log("egg liberated");
            }
        }
        var relevantArray;
        if (env == "one") {
            relevantArray = oneLetters;
        } else if (env == "world") {
            relevantArray = letters;
        }
        this.speedX *= .9;
        this.speedY *= .9;
        if (this.drifting) {
            this.speedX += noise(frameCount * .01 + (this.seed * 1000)) * this.driftFactor - this.driftFactor / 2;
            this.speedY += noise(frameCount * .01 + (this.seed * 4000)) * this.driftFactor - this.driftFactor / 2;
        }
        if (!this.nested) {
            this.x += this.speedX;
            this.y += this.speedY;
        }

        if (this.x > width + 100) {
            this.x = -99;
        } else if (this.x < -100) {
            this.x = width + 99;
        }
        if (this.y > height + 100) {
            this.y = -99;
        } else if (this.y < -100) {
            this.y = height + 99;
        }

        if (this.grabbed && this.grabber != null) {
            this.x = this.grabber.head.x + this.offsetX;
            this.y = this.grabber.head.y + this.offsetY;
        }

        if (!this.showroom) {
            for (var i = 0; i < relevantArray.length; i++) {
                if (dist(this.x, this.y, relevantArray[i].x, relevantArray[i].y) < relevantArray[i].size) {
                    //console.log("letter in range");
                    for (var j = 0; j < relevantArray[i].points.length; j++) {
                        var p = relevantArray[i].points[j];
                        if (dist(p.x, p.y, this.x, this.y) < this.size / 2) {
                            stroke(255);
                            line(this.x, this.y, p.x, p.y);
                            this.speedX += (this.x - p.x) * .1;
                            this.speedY += (this.y - p.y) * .1;

                        }
                        /* if (relevantArray[i].nest != null) {
                            this.angleToNest = Math.atan2(relevantArray[i].nest.y - this.y, relevantArray[i].nest.x - this.x);
                        } */
                    }
                }
            }
        }
    }
    draw() {
        stroke(74, 19, 2);
        strokeWeight(3);
        fill(94, 39, 22);
        circle(this.x, this.y, this.size)
        //console.log("drawing eggs")
    }
}

function moreOrLessEqual(a, b, range) {
    if ((b >= a - range && b < a) || (b <= a + range && b > a)) {
        return true;
    }
}



function drawDrawer() {
    stroke(3);
    stroke(33);
    fill(120);
    rectMode(CORNERS);
    rect(0, height - drawerY, width, height);

    var mod = -height + drawerY - 200;

    if (drawerY > 10) {
        //console.log(mod);
        for (var i = 0; i < drawerLetters.length; i++) {
            for (var j = 0; j < drawerLetters[i].points.length; j++) {
                drawerLetters[i].points[j].y = drawerLetters[i].points[j].originalY - mod;
                drawerLetters[i].points[j].x = drawerLetters[i].points[j].originalX + drawerScroll;
                //circle(drawerLetters[i].points[j].x, drawerLetters[i].points[j].y, 10);
            }
            drawerLetters[i].draw();
        }
    }

}

function drawDrawerPuller() {
    fill(180);
    if (drawerScroll < -1230) {
        drawerScroll = -1230;
    } else if (drawerScroll > 30) {
        drawerScroll = 30;
    }
    if (drawerBeingPulled) {
        fill(255);
        if (drawerY <= drawerMaxY + 30 && drawerY >= 0) {
            drawerY += -(mouseY - prevMouseY);
            //console.log(drawerY);

        }
        if (drawerY < 0) {
            drawerY = 0
        } else if (drawerY > drawerMaxY + 30) {
            drawerY = drawerMaxY + 30;
        }
    }
    rectMode(CORNERS);
    rect(width / 2 - 30, height - drawerY, width / 2 + 30, height - drawerY - 20);
    //console.log(drawerScroll);
}

function mouseInDrawer() {
    if (mouseY > height - drawerY) {
        return true;
    } else {
        return false;
    }
}

function cursorHand() {
    cursor('https://s3.amazonaws.com/mupublicdata/cursor.cur');
}

function drawerPulling() {
    var drawerSelected = 0;
    //console.log(drawerGrabbing);
    for (var i = 0; i < drawerLetters.length; i++) {
        if (drawerLetters[i].drawerSelected) {
            drawerSelected++;
            grabbedLetter = drawerLetters[i];
        }
        if (drawerSelected == 0) {
            drawerSelecting = false;
        } else {
            drawerSelecting = true;
        }
    }
    if (!drawerBeingPulled) {
        if (mouseX > width / 2 - 30 && mouseX < width / 2 + 30) {
            if (mouseY > height - drawerY - 20 && mouseY < height - drawerY && mouseIsPressed && !drawerGrabbing) {
                drawerBeingPulled = true;
                drawerInteria = 0;
            } else {
                drawerBeingPulled = false;
            }
        } else {
            drawerBeingPulled = false;
        }
        if (drawerY < 30) {
            drawerY -= drawerY * .1;
        } else if (drawerY > 90) {
            drawerY += (200 - drawerY) * .1
        }
        if ( /* drawerY < drawerMaxY && */ drawerY > 0) {
            drawerY += drawerInteria;
            drawerInteria *= .9;
        }

        if (drawerY > drawerMaxY) {
            drawerY -= (drawerY - drawerMaxY) * .25;
        }
        if (drawerBeingDragged) {
            //console.log(drawerScroll);
            if (drawerScroll >= drawerMaxX - 30 && drawerScroll <= 0 + 30) {
                drawerScroll += (mouseX - prevMouseX) * 1.2;
            }
        }
        if (drawerScroll < drawerMaxX /* && !drawerBeingDragged */ ) {
            drawerScroll += (-drawerScroll - drawerMaxX) * .1;
            if (drawerScroll > drawerMaxX + .1) {
                drawerScroll = drawerMaxX;
            }
        } else if (drawerScroll > 0 /* && !drawerBeingDragged */ ) {
            drawerScroll -= (drawerScroll - drawerScroll + 30) * .1;
            if (drawerScroll < .1) {
                drawerScroll = 0;
            }
        }
        if (drawerScroll > drawerMaxX - 30 && drawerScroll < 30); {
            drawerScroll -= drawerDragInertia;
            drawerDragInertia *= .9;
        }

    }
}

function scrollTitle() {
    var displayTitle = "";
    if (frameCount % 10 == 0) {
        titleScroll += 1;
    }
    if (titleScroll > pageTitle.length) {
        titleScroll = 0;
    }
    for (var i = 0; i < pageTitle.length; i++) {
        var index = i + titleScroll;
        if (index > pageTitle.length - 1) {
            index -= pageTitle.length;
        }
        displayTitle = displayTitle.concat(pageTitle[index]);
    }
    //console.log(displayTitle);
    document.title = displayTitle;
}

function force(polarity) {

    var relevantArray;
    if (env == "world") {
        relevantArray = letters;
    } else if (env == "one") {
        relevantArray = oneLetters;
    }
    var threshold = 500;
    for (var i = 0; i < relevantArray.length; i++) {
        if (dist(relevantArray[i].x, relevantArray[i].y, mouseX, mouseY) < threshold) {
            console.log("pushing");
            var direction = createVector(relevantArray[i].x - mouseX, relevantArray[i].y - mouseY);
            var strength = .002 * ((threshold - direction.mag()) / threshold);
            var randBody = relevantArray[i].points[Math.floor(Math.random() * relevantArray[i].points.length)].body;
            direction.normalize();
            direction.mult(polarity);
            direction.mult(strength);
            Matter.Body.applyForce(randBody, randBody.position, direction);
        }
    }
}

function kill() {
    noStroke();
    fill(sin(frameCount)*255,25);
    circle(mouseX,mouseY,sin(frameCount)*80);
    var relevantArray;
    if (env == "world") {
        relevantArray = letters;
    } else if (env == "one") {
        relevantArray = oneLetters;
    }
    var threshold = 100;
    for (var i = 0; i < relevantArray.length; i++) {
        if (dist(relevantArray[i].x, relevantArray[i].y, mouseX, mouseY) < threshold) {
            relevantArray[i].dying = true;
        }
    }
}