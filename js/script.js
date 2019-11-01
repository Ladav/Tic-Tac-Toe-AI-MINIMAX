// maintain state of all the nine boxes ,those who have selected already should not be avialable for selection again.
// implement minimax and (user againt user) in different files and import that files


/* using min-max algo for computer */


// 1) select data structure 
let ttt = [[' ',' ','o'], ['x',' ','x'], ['o','x','o']];
let currentPlayer = 'X';  // it is a flag representing active player(from setting we can set/change the default player)
const dis = function() {
    console.log(`${ttt[0][0]} | ${ttt[0][1]} | ${ttt[0][2]} `);
    console.log(`${ttt[1][0]} | ${ttt[1][1]} | ${ttt[1][2]} `);
    console.log(`${ttt[2][0]} | ${ttt[2][1]} | ${ttt[2][2]} `);
};
dis();


// this is global var which contain information about how many space blank (total - filled)
var moreToGo = 9;
var flag = //can be min or max

// 2) write the min-max algo logic

const turnx = function minmax(newArr) {
    
    
}

function turn(ttt) {
    
    loop(moreToGo)  // run loop for all place
    {
        if(tttArr[][] === ' '){
        // call minmax for each place (this is for the level 1 below level 0 rest of the levels will be tackled in minmax fx)
        }
    }
        
}

// 3) check who won the match

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
    return -1;
};
