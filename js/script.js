// maintain state of all the nine boxes ,those who have selected already should not be avialable for selection again.
// implement minimax and (user againt user) in different files and import that files


/* using min-max algo for computer */


//***************************************************//
//**************** Function COTROLLER *************//
//***************************************************// 
/**
*  1. Initialize matrix
*  2. Display Matrix
*  3. Active Player
*  4. check if Active player is the winner
*  5. get User input
*/
const logicController = (() => {
    const matrix = [new Array(3),new Array(3),new Array(3)];

    let playerActive = 'X';  // it is a flag representing active player(from setting we can set/change the default player)

    return{
            // 1. Initialize matrix
            resetDataStructure: () => {
                for(let i = 0; i < 3; i++){
                    for(let j = 0; j < 3; j++){
                        matrix[i][j] = ' ';
                    }
                }
            },
        
            // 2. Display Matrix
            dis: () => {
                console.log(`${matrix[0][0]} | ${matrix[0][1]} | ${matrix[0][2]} `);
                console.log(`${matrix[1][0]} | ${matrix[1][1]} | ${matrix[1][2]} `);
                console.log(`${matrix[2][0]} | ${matrix[2][1]} | ${matrix[2][2]} `);
            },
        
            // 3. Active Player
            toggleActive:  () => {
                playerActive = playerActive === 'O' ? 'X' : 'O';
            },
        
        
            // 4. check if Active player is the winner
            check: () => {
                // 1) check rows
                for(let i = 0; i < 3; i++){
                if(matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2]){
                        if(matrix[i][0] !== ' ') return matrix[i][0];
                    }
                }
                
                // 2) check cols
                for(let i = 0; i < 3; i++){
                if(matrix[0][i] === matrix[1][i] && matrix[1][i] === matrix[2][i]){
                        if(matrix[0][i] !== ' ') return matrix[0][i];
                    }
                }
                
                // 3) check diagonals
                if((matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2])||(matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0])) 
                {
                    if(matrix[1][1] !== ' ') return matrix[1][1];                   
                }
                
                // 4) No winnig condition
                return ' ';
            },
                
            // 5. get User input
            getUserInput: () => {
                let x,y;
                console.log(`Enter X and Y cord for your move(according to the matrix) :`);
                
                x = parseInt(prompt(`enter x-cord. for ${playerActive}.`), 10);
                y = parseInt(prompt(`enter y-cord. for ${playerActive}.`), 10);
                if(matrix[x-1][y-1] == ' ') {
                    matrix[x-1][y-1] = playerActive;
                }
                else {
                    prompt(`invalid move`);
                    getUserInput(); // change to next player if inside
                } 
            },

             
            updateData: data => {
                let row, col, temp;
                // ex- data = 'element--1__1'
                temp = data.split('__');

                // temp = ['element--1', '1'] we got coloumn
                col = parseInt(temp[1], 10);
                
                // temp = ['element', '1']
                temp = temp[0].split('--');

                row = parseInt(temp[1], 10);

                //updating matrix
                matrix[row - 1][col - 1] = playerActive;
            },

            // Active User/player
            getPlayerActive: () => playerActive
    };
})();



//***************************************************//
//**************** UI CONTROLLER *************//
//***************************************************//
const UIController = (() => {
    const DOMInput = {
        field: {
            field_1_1 : document.querySelector('.element--1__1'),
            field_1_2 : document.querySelector('.element--1__2'),
            field_1_3 : document.querySelector('.element--1__3'),
            field_2_1 : document.querySelector('.element--2__1'),
            field_2_2 : document.querySelector('.element--2__2'),
            field_2_3 : document.querySelector('.element--2__3'),
            field_3_1 : document.querySelector('.element--3__1'),
            field_3_2 : document.querySelector('.element--3__2'),
            field_3_3 : document.querySelector('.element--3__3')
        },
        allFields : document.querySelectorAll('.element')
    };

    return {
        // reset the game's UI
        resetUI : () => {
            Array.from(DOMInput.allFields).forEach(field => field.textContent = ' ');
        },

        // updating UI against user select
        updateUI: (field, player) => {
            field.textContent = player;
        },

        getDOMInput: () => DOMInput
    };
})();



//***************************************************//
//*************** GLOBAL APP CONTROLLER *************//
//***************************************************//
const controller = ((UICtrl, logicCtrl) => { 
    
    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMInput();

        const fieldArr = Object.values(DOM.field);   // converting object to array

        fieldArr.forEach( el => {
            el.addEventListener('click', getUserInput);
        });
    };

    const getUserInput = (event) => {
        const field = event.target
        const value = field.textContent;

        // 1-Check matrix ,if the required box is empty
        if(value === ' '){
            console.log(event.target)           //testing
            // 2-Update DS matrix
            logicCtrl.updateData(field.className);

            // 3-Update UI
            UICtrl.updateUI(event.target, logicCtrl.getPlayerActive())
        }

        ////////// change active user after check
    };

    let result = ' ';  //store (X,O) to check if Active player won

    const reset = () => {    
        // clearing the matrix data
        logicCtrl.resetDataStructure();

        // clearing the UI / reset
        UICtrl.resetUI();
    };

    
    /*
        logicCtrl.dis();
        logicCtrl.toggleActive();
        logicCtrl.getUserInput();
        result = logicCtrl.check();
        if(result === 'X' || result === 'O') break;
    
    console.log(`player ${logicCtrl.getPlayerActive} won this match`); 
    */

    return {
        start: () => {
            console.log('application has started!');
            setupEventListeners();
            reset();    // initiallize app for a fresh game
        }
    };
})(UIController, logicController);

controller.start();