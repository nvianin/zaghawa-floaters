class Constraint {
    constructor(vert1, vert2, damp){
        this.vert1 = vert1;
        this.vert2 = vert2;

        this.baseConnection;

        this.damp = damp;
    }

    initialize(){
    }

    update(){
        this.vert1.x+=(target-x)*.1
    }

}