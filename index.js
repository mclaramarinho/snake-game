//CREATES GRID
for(let i = 0; i < 400; i++){
    let grid = document.getElementById("grid");
    let gridBlock = document.createElement("div");
    grid.append(gridBlock);
    
}
document.querySelectorAll("#grid div").forEach(item => {
    item.classList.add("grid-block");
})

let currentBlock = document.querySelectorAll(".grid-block"); //gets all the grid positions
let direction = 1; // Left = -1 / Right = 1 / Up = -20 / Down = 20
let startBtn = document.getElementById("start-btn");
let start = false; //start-btn click-control
let currentSnake = [2, 1, 0]; //Head = index 0 / Tail = last index
let speeds = [1]; //speed updates
let interval = 1000 * speeds[speeds.length-1]; //movement interval
let gameOn;
let appleLocation;
let levelCount = 1;
let resetBtn = document.getElementById("reset-btn");


//EVENT LISTENERS

//When START is pressed
startBtn.addEventListener('click', ()=>{
    if(!start){ //if start is false
        begin();
    }
})
//Gets the keypressed to change the direction
window.addEventListener('keyup', (e) => {
    let currentKey = e.key;
    if(currentKey !== 'Enter'){
        direction = (
                        (currentKey === 'ArrowUp' || currentKey === 'W' || currentKey === 'w') ? -20
                        : (currentKey === 'ArrowDown' || currentKey === 'S' || currentKey === 's') ? 20
                        : (currentKey === 'ArrowRight' || currentKey === 'D' || currentKey === 'd') ? 1
                        : (currentKey === 'ArrowLeft' || currentKey === 'A' || currentKey === 'a') ? -1
                        : 1);
    }else{
        if(!start){ //if start is false
            begin();
        }
    }
})
resetBtn.addEventListener('click', () => {
    location.reload();
})


function begin (){
    start=true; //set start to true
    startGame (); //and start game
    playSound('startGame', 0.3);
}

//Creates the initial layout after pressing start
function startGame (){ 
    if(start){
        currentSnake.map(position => {
            currentBlock[position].classList.add("snake");
        })
        let isEaten = eatApple(currentSnake, appleLocation);
        appleLocation = randomApple(currentSnake);
        
        gameOn = setInterval(startSnake, interval);
    }
    
}
function setSpeed (speeds){
    let currentSpeed = speeds[speeds.length-1];
    if(currentSpeed > 0.2){
        speeds.push(currentSpeed-0.1);
    }
    interval = 1000 * speeds[speeds.length-1];
    return interval;
}

function checkHit (currentBlock){
    let hit = false;

    hit = (
            (((currentSnake[0]+20 >= (20*20))&&(direction === 20))) ? true
            : ((currentSnake[0]-20 < 0)&&(direction === -20)) ? true
            : ((currentSnake[0] % 20 === 0) && (direction === -1)) ? true //ok
            : ((currentSnake[0] % 20 === 19) && (direction === 1)) ? true //ok
            : ((currentSnake[0] >= 0 && currentSnake[0] <= 19)) ? true
            : ((currentSnake[0] >= 380 && currentSnake[0] <= 399)) ? true
            : ((currentBlock[currentSnake[0]+direction].classList.contains("snake"))) ? true
            : false
        )
    return hit;
}

function startSnake (){
    
    let didItHit = checkHit(currentBlock);
    
    if(didItHit){
        gameOver();
    }
    moveSnake(); 
    
    isEaten = eatApple(currentSnake, appleLocation);
    if(isEaten){
        document.getElementById("level").innerHTML=(++levelCount);
        appleLocation = randomApple(currentSnake);
        clearInterval(gameOn);
        let newInterval = setSpeed(speeds);
        gameOn = setInterval(startSnake, newInterval);
    }  
}

function gameOver (){

    if(currentSnake[0]%20===19){
        setTimeout(() => {
            if(direction===1){
                gameOverFx();
                editSnake(-1);
                currentBlock[currentSnake[0]].classList.remove("snake");
            }
        }, 100);
        
    }else if (currentSnake[0]%20===0){
        setTimeout(() => {
            if(direction===-1){
                gameOverFx();
                editSnake(1);
                currentBlock[currentSnake[0]].classList.remove("snake");
            }
        }, 100);
        
    }else if(currentSnake[0]-20 < 0){
        setTimeout(() => {
            if(direction===-20){
                gameOverFx();
            }
            
        }, 100);
    }else if(currentSnake[0]+20 >= (20*20)){
        setTimeout(() => {
            if(direction===20){
                gameOverFx();
            }
            
        }, 100);
    }else if((currentSnake[0] >= 0 && currentSnake[0] <= 19)){
        setTimeout(() => {
            if(direction===-20){
                gameOverFx();
                editSnake(1);
            }
            
        }, 100)
    }else if((currentSnake[0] >= 380 && currentSnake[0] <= 399)){
        setTimeout(() => {
            if(direction===20){
                gameOverFx();
                editSnake(-1);
            }
            
        }, 100)
    }else if(currentBlock[currentSnake[0]+direction].classList.contains("snake")){
        gameOverFx();
    }

}

function editSnake (num){
    currentSnake.push(currentSnake[currentSnake.length-1]+num);
    currentBlock[currentSnake[currentSnake.length-1]].classList.add("snake");
}

function gameOverFx (){
    clearInterval(gameOn);
    document.querySelector("html").classList.add('game-over');
    playSound("gameOver", 0.5);
    setTimeout(() => {
        document.querySelector("html").classList.remove('game-over');
    }, 150);
}

//Randomizes the place of the apple, according to the position of the snake
function randomApple (currentSnake){
    let appleLoc = Math.floor(Math.random()*400); //generates a location
    currentSnake.map(position => { //checks each position of the current snake
        if(appleLoc===position){
            appleLoc = Math.floor(Math.random()*400); //generates another location in case the apple location is the same as the current snake
        }
    })
    currentBlock[appleLoc].classList.add("apple");
    return appleLoc;
}
function eatApple(currentSnake, appleLocation){
    if(currentSnake[0] === appleLocation){
        (direction === 1 || direction === 20) ? currentSnake.push(currentSnake[currentSnake.length-1]-1)
                : (direction === - 1 || direction === -20) ? currentSnake.push(currentSnake[currentSnake.length-1]+1)
                : 1;
        currentBlock[appleLocation].classList.remove("apple");
        clearInterval(interval);
        playSound("eat", 0.5)
        return true;
    }
}

//Moves the snake around the grid
function moveSnake (){
    let tail = currentSnake.pop();
    currentBlock[tail].classList.remove("snake");
    currentSnake.unshift(currentSnake[0]+direction);
    currentBlock[currentSnake[0]].classList.add("snake");
    
    return currentSnake;
}

function playSound (name, volume){
    const sound = new Audio('audios/'+name+'.mp3');
    sound.play();
    sound.volume=volume;
}
//When RESET is pressed
