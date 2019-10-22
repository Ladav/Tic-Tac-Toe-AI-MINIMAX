// maintain state of all the nine boxes ,those who have selected already should not be avialable for selection again.



/* using min-max algo for computer */


// 1) select data structure 
let ttt = [[' ',' ','o'], ['x',' ','x'], ['o','x','o']];
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

