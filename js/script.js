// maintain state of all the nine boxes ,those who have selected already should not be avialable for selection again.
// implement minimax and (user againt user) in different files and import that files


/* using min-max algo for computer */


//***************************************************//
//**************** Function COTROLLER *************//
//***************************************************// 
const logicController = (() => {
    const matrix = [new Array(3),new Array(3),new Array(3)];

    let playerActive = 'X';  // it is a flag representing active player(from setting we can set/change the default player)

    const resetDataStructure = () => {
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                matrix[i][j] = ' ';
            }
        }
    };

    const scrapeData = (data) => {
        let row, col, temp;
        // ex- data = 'element--1__1'
        temp = data.split('__');

        // temp = ['element--1', '1'] we got coloumn and -1 to make 0 index based 
        col = parseInt(temp[1], 10) - 1;
        
        // temp = ['element', '1']
        temp = temp[0].split('--');
        row = parseInt(temp[1], 10) - 1;    

        return {row, col};
    };

    const isMatrixFull = () => {
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(matrix[i][j] === ' ') {
                    return false;
                }
            }
        }
        return true;
    };

    return{
            // Initialize matrix
            resetDS: () => { resetDataStructure(); },        
        
            // check if Active player is the winner
            checkMatrix: () => {
                // 1) check rows
                for(let i = 0; i < 3; i++) {
                    if(matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2]) {
                        if(matrix[i][0] !== ' ') return matrix[i][0];
                    }
                }
                
                // 2) check cols
                for(let i = 0; i < 3; i++) {
                    if(matrix[0][i] === matrix[1][i] && matrix[1][i] === matrix[2][i]) {
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
             
            userInput: (dataString) => {
                let data;
                
                // scraping the required data from the dataString
                data = scrapeData(dataString);

                //updating matrix
                matrix[data.row][data.col] = playerActive;
            },

            // Active Player
            toggleActive:  () => { playerActive = playerActive === 'O' ? 'X' : 'O'; },

            // check if the matrix is fully filled
            isFull: () => { return (isMatrixFull()); },

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
        winWindow: document.querySelector('.winner'),
        winner: document.querySelector('.player'),
        textDraw: document.querySelector('.winner p')
    };

    const setPlayerActive = () => {
        DOMInput.X.classList.toggle('active');
        DOMInput.O.classList.toggle('active');
    };

    // this check if there is any msg being displayed on the screen, return's true or false
    const anyActiveMsg = () => DOMInput.winWindow.style.display === 'block';

    return {
        // reset the game's UI
        resetUI : (activePlayer) => {
            // clean the Matrix
            Array.from(DOMInput.allFields).forEach(field => field.textContent = ' ');

            // highlight active player
            DOMInput[activePlayer].classList.add('active');

            // remove the congrats message from the previous gameplay
            DOMInput.winWindow.style.display = 'none';
        },

        // updating UI against user select
        updateField : (field, player) => {
            field.textContent = player;
        },

        updateActivePlayer : (activePlayer) => {
            console.log(activePlayer);
            setPlayerActive();
        },

        renderWinner: (activePlayer) => {
            console.log(anyActiveMsg());
            // check if any msg is already being displaced on the screen
            if(!anyActiveMsg()) {
                // 1-upadate the activePlayer in the html 
                DOMInput.winner.textContent = activePlayer;
                DOMInput.textDraw.textContent = 'The Winner is ';

                // 2-render congratulations message
                DOMInput.textDraw.style.color = 'rgba(236,226,29,1)';
                DOMInput.winWindow.style.display = 'block';
            }
        },

        renderDraw: () => {
            // check if any msg is already being displaced on the screen
            if(!anyActiveMsg()) {
                // 1-update the activePlayer and message
                DOMInput.winner.textContent = '';
                DOMInput.textDraw.textContent = 'Draw!';
                
                // 2-render congratulations message
                DOMInput.textDraw.style.color = '#222';
                DOMInput.winWindow.style.display = 'block';
            }
        },

        isMsgDisplayed : () => anyActiveMsg(),

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
        logicCtrl.resetDS();

        // clearing the UI / reset
        UICtrl.resetUI(logicCtrl.getPlayerActive());
    };

    const toggleUser = () => {
        // 1-change active player
        logicCtrl.toggleActive();

        // 2-update active player on UI
        UICtrl.updateActivePlayer(logicCtrl.getPlayerActive());        
    };

    // it provide a 2 sec delay to display the winner or draw message
    const clearMsgWin = () => {
        setTimeout(() => {
            reset();
        }, 2000);
    };

    const getUserInput = (event) => {
        const field = event.target; //which space is selected
        const value = field.textContent;  // is it X or O
        let result = false;

        // Check matrix ,if the required box is empty and if any message is being displayed 
        if(value === ' ' && !UICtrl.isMsgDisplayed()){
            // 2-Update DS matrix
            logicCtrl.userInput(field.className);

            // 3-Update UI
            UICtrl.updateField(event.target, logicCtrl.getPlayerActive())

            // 4-check if the player won the match
            result = check();

            // 5-if matrix is full  
            if(logicCtrl.isFull() && !result) {
                // 1-render a draw msg
                console.log('draw!');
                UICtrl.renderDraw();

                // 2-reset UI
                clearMsgWin();
            }

            // 6-change active user
            toggleUser();
        }
    };

    const check = () => {
        // Inspect Data Structure
        const result = logicCtrl.checkMatrix();
        
        // if active user does't won, return undefined
        if(result){ 
            // Render Winner on the page
            UICtrl.renderWinner(logicCtrl.getPlayerActive());
            console.log(`${logicCtrl.getPlayerActive()} is the winner!`);
    
            // display winner window for 2 second then reset UI
            clearMsgWin(); 

            // return true to handle the case when the game won and the whole matrix is also filled
            return true;
        }
        return false;
    };

    return {
        start: () => {
            console.log('application has started!');
            setupEventListeners();
            reset();    // initiallize app for a fresh game
        }
    };
})(UIController, logicController);

controller.start();