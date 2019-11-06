// maintain state of all the nine boxes ,those who have selected already should not be avialable for selection again.
// implement minimax and (user againt user) in different files and import that files


/* using min-max algo for computer */

const arr = [3][3];
let playerActive = 'O';  // it is a flag representing active player(from setting we can set/change the default player)
/**
*  1. Initialize matrix
*  2. Display Matrix
*  3. Active Player
*  4. check if Active player is the winner
*  5. get User input
*/


// 1. Initialize matrix
const init = () => {
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            matrix[i][j] = ' ';
    }
}

// 2. Display Matrix
const dis = () => {
    console.log(`${ttt[0][0]} | ${ttt[0][1]} | ${ttt[0][2]} `);
    console.log(`${ttt[1][0]} | ${ttt[1][1]} | ${ttt[1][2]} `);
    console.log(`${ttt[2][0]} | ${ttt[2][1]} | ${ttt[2][2]} `);
};

// 3. Active Player
const toggleActive = () => {
    playerActive = playerActive === 'O' ? 'X' : 'O';
};


// 4. check if Active player is the winner
const check = arr => {
    // 1) check rows
    for(let i = 0; i < 3; i++){
       if(arr[i][0] === arr[i][1] && arr[i][1] === arr[i][2]){
            if(arr[i][0] !== ' ') return arr[i][0];
        }
    }
    
    // 2) check cols
    for(let i = 0; i < 3; i++){
       if(arr[0][i] === arr[1][i] && arr[1][i] === arr[2][i]){
            if(arr[0][i] !== ' ') return arr[0][i];
        }
    }
    
    // 3) check diagonals
    if((arr[0][0] === arr[1][1] && arr[1][1] === arr[2][2])||(arr[0][2] === arr[1][1] && arr[1][1] === arr[2][0])) 
    {
        if(arr[i][0] !== ' ') return arr[1][1];                   
    }
    
    // 4) No winnig condition
    return ' ';
};
    
// 5. get User input
const getUserInput = () => {
    let x,y;
    console.log(`Enter X and Y cord for your move(according to the matrix) :`);
    x = parseInt(prompt('x'), 10);
    y = parseInt(prompt('y'), 10);
    if(arr[x][y] == ' ') {
        arr[x][y] = playerActive;
    }
    else {
        prompt(`invalid move`);
    } 
};

//***************************************************//
//*************** GLOBAL APP CONTROLLER *************//
//***************************************************//
const controller = () => {
    const result = ' ';  //store (X,O) to check if Active player won
    init();
    
    for(;;) {
        dis();
        toggleActive();
        getUserInput();
        result = check();
        if(result === 'X' || result === 'O') break;
    }
    console.log(`player {playerActive} won this match`); 
};
controller();