class Food {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = 4;
        this.targetSize = size;
        this.growthFactor = .2;
        this.maxSize = Math.random() * 100 + 50;
        this.taken = false;
        this.seed = Math.random();
        this.driftFactor = random(.25,.5);
        this.color = color(random(10,50),random(180,255),random(40,100));
        this.growthCounter = 0;
        this.speedX = 0;
        this.speedY = 0;
    }
    spawn(){
        
    }

    update() {
        this.speedX *= .9;
        this.speedY *= .9;
        if (this.size < this.maxSize) {
            this.size += Math.random() * 1 * this.growthFactor;
        }
        if (this.size < this.targetSize && this.growthCounter<20){
            this.size+=this.seed;
            this.growthCounter++
        }
        this.speedX += noise(frameCount*.01+(this.seed*1000))*this.driftFactor-this.driftFactor/2;
        this.speedY += noise(frameCount*.01+1000+(this.seed*1000))*this.driftFactor-this.driftFactor/2;
        if (this.growthFactor > 0) {


            this.growthFactor -= .01;
        } else {
            this.growthFactor = 0;
        }

        for (var i = 0; i < food.length; i++){
            if (dist(this.x,this.y,food[i].x,food[i].y)<this.size*3){
                this.speedX += (this.x-food[i].x)*.01;
                this.speedY += (this.y-food[i].y)*.01;
            }
        }

        for (var i = 0; i < nests.length; i++){
            if(dist(this.x,this.y,nests[i].x,nests[i].y)<this.size*3){
                this.speedX += (this.x-nests[i].x)*.01;
                this.speedY += (this.y-nests[i].y)*.01;
            }
        }

        /* if (this.size < 4) {
            for (var i = 0; i < food.length; i++) {
                if (food[i].x == this.x) {
                    food.splice(i, 1);
                    console.log("erased food");
                }
            }
        } */
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 -this.size*2){
            this.x = width + this.size*2;
        } else if (this.x > width+this.size*2){
            this.x = 0-this.size*2;
        }

        if (this.y < 0 - this.size*2){
            this.y = height+this.size*2;
        } else if (this.y > height+this.size*2){
            this.y = 0-this.size*2;
        }
    }

    draw() {
        fill(30, 180, 40);
        //circle(this.x, this.y, this.size);
        strokeWeight(1);
        stroke(this.color);
        for (var t = 0; t < 360/8; t++){
            var x = cos(t) * (this.size+(noise(t*this.seed)*20));
            var y = sin(t) * (this.size+(noise(t*this.seed)*20));
            var x1 = cos(t+sin(frameCount*.01+this.seed)) * (this.size*1*this.seed-.1+(sin(frameCount*.025+this.seed*4))*5);
            var y1 = sin(t+sin(frameCount*.01+this.seed)) * (this.size*1*this.seed-.1+(sin(frameCount*.025+this.seed*4))*5);
            /* push();
            translate(this.x,this.y); */
            
            
            /* stroke('rgba('+this.color+","+this.color+","+this.color+",)") */
            line(x+this.x,y+this.y,x1+this.x,y1+this.y);
            /* pop(); */
        }
    }
}