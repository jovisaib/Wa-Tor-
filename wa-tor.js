const FISH_REPRODUCTION_VALUE = 7;
const SHARK_REPRODUCTION_VALUE = 15;
const BASE_FISH_ENERGY = 10;
const BASE_SHARK_ENERGY = 5;
const BLOCK_SIZE = 8;


function randomIntRange(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomDirection(){
    let directionSeed = randomIntRange(0, 3);
    switch(directionSeed){
        case 0:
            return {x:-1, y:0};
        case 1:
           return {x:1, y:0};        
        case 2:
            return {x:0, y:-1};                
        case 3:
           return {x:0, y:1};                    
    }
}

class Sea {
    constructor(width, height){
        this.blockSize = BLOCK_SIZE;
        this.width = width;
        this.height = height;
        this.seaMap = this.populateWorld();
        this.canvas = document.getElementById("wa-tor");
        this.ctx = this.canvas.getContext("2d");

        this.init();
    }

    init(){
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
    }

    update(){
        this.applyRuleSet();

        for(let y=0; y<this.seaMap.length; y++){
            for(let x=0; x<this.seaMap[0].length; x++){
                let entity = this.seaMap[x][y];

                this.ctx.beginPath();
                this.ctx.rect(x*this.blockSize, y*this.blockSize, this.blockSize, this.blockSize);
                this.ctx.fillStyle = (entity && entity.color) || "blue";
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }

    populateWorld(){
        let blocksX = Math.floor(this.width/this.blockSize);
        let blocksY = Math.floor(this.height/this.blockSize);
        let population = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,0,0];
        let matrix = [];

        for(let y=0; y<blocksY; y++){
            matrix[y] = [];
            for(let x=0; x<blocksX; x++){
                let randomSeed = population[randomIntRange(0, population.length-1)];
                if(randomSeed === 1){
                    matrix[y].push(new Fish());
                }else if(randomSeed === 0){
                    matrix[y].push(new Shark());
                }else{
                    matrix[y].push(null);
                }
            }
        }
        return matrix;
    }

    applyRuleSet(){
        console.log("wa-tor");
        for(let y=0; y<this.seaMap.length; y++){
            for(let x=0; x<this.seaMap[0].length; x++){
                let entity = this.seaMap[x][y];
                if(entity){
                    entity.update(this.seaMap, {"x":x,"y":y});
                }
            }
        }
    }
}



class Fish{
    constructor(){
        this.reproductionCounter = FISH_REPRODUCTION_VALUE;
        this.type = "fish";
        this.color = "green";
    }

    update(sea, pos){
        let direction = randomDirection();
        let targetX = pos.x + direction.x;
        let targetY = pos.y + direction.y;
  
        if(targetX < 0) targetX = sea[0].length-1; 
        if(targetX >= sea[0].length) targetX = 0; 
        if(targetY < 0) targetY = sea.length; 
        if(targetY >= sea.length) targetY = 0; 

        if(sea[targetX][targetY] === null){
            sea[targetX][targetY] = this;            
            
            this.reproductionCounter--;
            if(this.reproductionCounter === 0){
                sea[pos.x][pos.y] = new Fish();
                this.reproductionCounter = FISH_REPRODUCTION_VALUE;        
            }
        }
    }
}

class Shark{
    constructor(){
        this.reproductionCounter = SHARK_REPRODUCTION_VALUE;
        this.energy = BASE_SHARK_ENERGY;
        this.type = "shark";
        this.color = "red";
    }

    update(sea, pos){
        let direction = randomDirection();
        let targetX = pos.x + direction.x;
        let targetY = pos.y + direction.y;
  
        if(targetX < 0) targetX = sea[0].length-1; 
        if(targetX >= sea[0].length) targetX = 0; 
        if(targetY < 0) targetY = sea.length; 
        if(targetY >= sea.length) targetY = 0; 

        if(sea[targetX][targetY] === null || (sea[targetX][targetY].type === "fish")){
            
            if(sea[targetX][targetY] && (sea[targetX][targetY].type === "fish")){
                this.energy ++;
            }

            this.energy--;            
            if(this.energy > 0){
                sea[targetX][targetY] = this;            

                this.reproductionCounter--;
                if(this.reproductionCounter === 0){
                    sea[pos.x][pos.y] = new Shark();
                    this.reproductionCounter = FISH_REPRODUCTION_VALUE;        
                }
            }else{
                sea[pos.x][pos.y] = null;
            }
        }
    }
}

let sea = new Sea(680, 680); 
setInterval(()=>sea.update(), 300);

