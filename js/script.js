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
            // Initialize matrix
            resetDataStructure: () => {
                for(let i = 0; i < 3; i++){
                    for(let j = 0; j < 3; j++){
                        matrix[i][j] = ' ';
                    }
                }
            },        
        
            // check if Active player is the winner
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
                return undefined;
            },
             
            updateMatrix: data => {
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

            // Active Player
            toggleActive:  () => {
                playerActive = playerActive === 'O' ? 'X' : 'O';
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
        allFields : document.querySelectorAll('.element'),
        X: document.querySelector('.x-container'),
        O: document.querySelector('.o-container'),
    };

    const setPlayerActive = () => {
        DOMInput.X.classList.toggle('active');
        DOMInput.O.classList.toggle('active');
    };

    return {
        // reset the game's UI
        resetUI : (activePlayer) => {
            // clean the Matrix
            Array.from(DOMInput.allFields).forEach(field => field.textContent = ' ');

            // highlight active player
            DOMInput[activePlayer].classList.add('active');
        },

        // updating UI against user select
        updateField : (field, player) => {
            field.textContent = player;
        },

        updateActivePlayer : (activePlayer) => {
            console.log(activePlayer);
            setPlayerActive();
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

    // re-initailize the game
    const reset = () => {    
        // clearing the matrix data
        logicCtrl.resetDataStructure();

        // clearing the UI / reset
        UICtrl.resetUI(logicCtrl.getPlayerActive());
    };

    const toggleUser = () => {
        // 1-change active player
        logicCtrl.toggleActive();

        // 2-update active player on UI
        UICtrl.updateActivePlayer(logicCtrl.getPlayerActive());        
    };

    const getUserInput = (event) => {
        const field = event.target
        const value = field.textContent;

        // 1-Check matrix ,if the required box is empty
        if(value === ' '){
            // 2-Update DS matrix
            logicCtrl.updateMatrix(field.className);

            // 3-Update UI
            UICtrl.updateField(event.target, logicCtrl.getPlayerActive())

            // 4-check if the player won the match
            check();

            // 5-change active user
            toggleUser();
        }
    };

    const check = () => {
        // Inspect Data Structure
        const result = logicCtrl.check();
        
        // if active user does't won, return undefined
        if(result){ 
            // Render Winner on the page
                // pending design a congratulations window
            console.log(`${logicCtrl.getPlayerActive()} is the winner!`);
    
            // reset UI
            reset();
        }
    };

    let result = ' ';  //store (X,O) to check if Active player won

    
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