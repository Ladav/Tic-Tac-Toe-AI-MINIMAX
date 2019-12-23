//***************************************************//
//**************** Function COTROLLER *************//
//***************************************************// 
const logicController = (() => {
    const matrix = [new Array(3),new Array(3),new Array(3)];
    let playerActive = 'X';
    let vsAI = true;  // flag about if the game is-- player vs AI

    const scrapeData = (data) => {
        let row, col, temp;
        // ex- data = 'element--1__1'
        temp = data.split('__');

        // temp = ['element--1', '1'] we got coloumns
        col = parseInt(temp[1], 10) - 1;    // -1 to make it 0 index based 
        
        // temp[0] = element--1
        temp = temp[0].split('--');     // temp = ['element', '1']
        row = parseInt(temp[1], 10) - 1;    

        return {row, col};
    };

    const checkMatrix = (curMatrix = matrix) => {
        // 1-check rows
        for(let i = 0; i < 3; i++) {
            if(curMatrix[i][0] === curMatrix[i][1] && curMatrix[i][1] === curMatrix[i][2]) {
                if(curMatrix[i][0] !== ' ') return curMatrix[i][0];
            }
        }
        // 2-check cols
        for(let i = 0; i < 3; i++) {
            if(curMatrix[0][i] === curMatrix[1][i] && curMatrix[1][i] === curMatrix[2][i]) {
                if(curMatrix[0][i] !== ' ') return curMatrix[0][i];
            }
        }
        // 3-check diagonals
        if((curMatrix[0][0] === curMatrix[1][1] && curMatrix[1][1] === curMatrix[2][2])||(curMatrix[0][2] === curMatrix[1][1] && curMatrix[1][1] === curMatrix[2][0])) {
            if(curMatrix[1][1] !== ' ') return curMatrix[1][1];                   
        }
        // 4-No winnig condition
        return undefined;
    };

    const getAvailFields = (currentMatrix) => {
        let emptyFields = []; // ex- [{row,col},{rol,col}]
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(currentMatrix[i][j] === ' ') {
                    emptyFields.push({row: i, col: j});
                }
            }
        }
        return emptyFields;
    };

    ///// "MINIMAX ALGO is used..." let O- aiPlayer AND X- humanPlayer
    const minimax = (newMatrix, player = 'O') => {
        // check if there are empty fields in Matrix and return index of fields empty ex- [{row,col},{rol,col},...]
        const availFields = getAvailFields(newMatrix);

        //check if any of the player's won(if AI won return 10, otherwise -10) or if it is tie(0)
        if(checkMatrix(newMatrix) === 'O') {
            return { score: 10 };
        } else if(checkMatrix(newMatrix) === 'X') {
            return { score: -10 };
        } else if(availFields.length === 0) {
            return { score: 0 }; // it's a draw
        }

        let moves = []; // collect the move's in the current level of tree for comparision

        for(let i = 0; i < availFields.length; i++) {
            let move = {}; // to store the score and index of the current move {score:number,index:{row,col}}

            move.index = availFields[i];   // it return and store index of an object ex-{row, col}
            
            newMatrix[move.index.row][move.index.col] = player; // making the move for the current player

            // calling the minimax again, this time with the second player and pass the updated newMatrix
            if(player === 'O') {    // O- aiPlayer AND X- humanPlayer
                let result = minimax(newMatrix, 'X');   // result object get the returned score values from minimax calculation done at lower level from the current level in the tree
                move.score = result.score;
            } else {
                let result = minimax(newMatrix, 'O');     
                move.score = result.score;
            }

            newMatrix[move.index.row][move.index.col] = ' ';    // resets newMatrix to what it was before
            
            moves.push(move);   // storing the results of current move, for comparing and finding best one  
        }

        // after going through all possible move's for the current state of newMatrix, now compare the result's (moves Array) and return the best move to one level up of the current level in the tree
        let bestMove;
        // choose the highest(max) score in case of aiPlayer and lowest(min) in case of human player
        if(player === 'O') {    // O- aiPlayer AND X- humanPlayer
            let bestScore = -10000;    // in case in aiPlayer we want highest score possible
            for(let i = 0; i < moves.length; i++) {
                if(bestScore < moves[i].score) {
                    bestScore = moves[i].score;
                    bestMove = i;   // selecting the move with highest score, this move will passed to one level up
                }
            }
        }
        else {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++){
                if(bestScore > moves[i].score) {    // this time looking for lowest score
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];    // returning the best move of current Matrix to the previous states matrix or simply return back to one level up
    };

    return {
            getAI: () => vsAI,
            setAI: (state) => { vsAI = state },
            
            getPlayer: () => playerActive,
            setPlayer: (state) => { playerActive = state },
            
            togglePlayer:  () => { playerActive = playerActive === 'O' ? 'X' : 'O'; },  
            
            checkWinner: () => checkMatrix(),   // check if Active player is the winner

            resetDS: () => {     // Initialize matrix
                for(let i = 0; i < 3; i++){
                    for(let j = 0; j < 3; j++){
                        matrix[i][j] = ' ';
                    }
                }
            },

            isMatrixFull: () => {   // check if the matrix is fully filled
                for(let i = 0; i < 3; i++){
                    for(let j = 0; j < 3; j++){
                        if(matrix[i][j] === ' ') {
                            return false;
                        }
                    }
                }
                return true;
            },

            // Player making move
            userMove: (dataString) => {
                let data;
                // scraping the required data from the dataString
                data = scrapeData(dataString);
                //updating matrix
                matrix[data.row][data.col] = playerActive;
            },

            // ai making move
            aiMove: () => {
                let move = {};    //   {score:number, index:{row, col}}
                move = minimax(matrix);

                const row = move.index.row;
                const col = move.index.col;
                matrix[row][col] = 'O';    // AI playing as 'O'

                return {row, col};
            }        
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
        allFields: document.querySelectorAll('.element'),
        X: document.querySelector('.X'),   
        O: document.querySelector('.O'),
        window: document.querySelector('.winner'),
        winner: document.querySelector('.player'),
        textDraw: document.querySelector('.winner p'),
        setting: document.querySelector('.settings-icon a'),
        setPanel: document.querySelector('ul'),
        btn_Human: document.querySelector('.btn-human'),
        btn_AI: document.querySelector('.btn-AI')
    };
    
    return {
        getDOMInput: () => DOMInput,
    
        // this check if there is any msg being displayed on the screen, return's true or false
        isMsgDisplayed : () => {  return DOMInput.window.style.display === 'block'; },

        resetUI : (activePlayer) => {   // reset the game's UI
            // clean the Matrix
            Array.from(DOMInput.allFields).forEach(field => field.textContent = ' ');

            // highlight active player
            DOMInput[activePlayer].classList.add('active');
            const otherPlayer = activePlayer === 'X' ? 'O' : 'X';
            DOMInput[otherPlayer].classList.remove('active');

            // remove the congrats message from the previous gameplay
            DOMInput.window.style.display = 'none';
        },
        
        updateField : (field, player) => {   // updating UI against user selection
            field.textContent = player;
        },

        updateActivePlayer : () => {   // when X vs O
            // when new game start ex- X vs O after a match of ex- X vs AI, the textContent ('AI') have to revert back to 'O'
            DOMInput.O.textContent = 'O';
            // highlight the active player
            DOMInput.X.classList.toggle('active');
            DOMInput.O.classList.toggle('active');
        },

        updateAI: () => {   // when X vs AI
            DOMInput.O.textContent = 'AI';
            // highlight both (because AI makes move very fast, toggle will not be visible)
            DOMInput.X.classList.add('active');
            DOMInput.O.classList.add('active');
        },

        renderWinner: (activePlayer) => {
            // 1-upadate the activePlayer in the html 
            DOMInput.winner.textContent = activePlayer;
            DOMInput.textDraw.textContent = 'The Winner is ';

            // 2-render congratulations message
            DOMInput.textDraw.style.color = 'rgba(236,226,29,1)';
            DOMInput.window.style.display = 'block';
        },

        renderDraw: () => {
            // 1-update the activePlayer and message
            DOMInput.winner.textContent = '';
            DOMInput.textDraw.textContent = 'Draw!';
            
            // 2-render congratulations message
            DOMInput.textDraw.style.color = '#222';
            DOMInput.window.style.display = 'block';
        }
    };
})();

//***************************************************//
//*************** GLOBAL APP CONTROLLER *************//
//***************************************************//
const controller = ((UICtrl, logicCtrl) => { 
    
    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMInput();

        const fieldArr = Object.values(DOM.field);   // converting object to array
        fieldArr.forEach( el => {   // setting listeners to all the selectable fields in t-t-t matrix
            el.addEventListener('click', getUserInput);
        });

        DOM.setPanel.style.display = 'none';    // set display property of the setting panel to none(to default)

        // when user click the settings icon
        //pending when user click outside of the panel it should be closed automatically
        DOM.setting.addEventListener('click', () =>{
            DOM.setPanel.style.display = DOM.setPanel.style.display === 'none' ? 'block' : 'none';
        });

        // listen to changes in setting
        DOM.btn_Human.addEventListener('click', () => {     // human vs human
            // 1-turn off the AI flag
            logicCtrl.setAI(false);

            // 2-update UI and set the second player as the 'O'
            UICtrl.updateActivePlayer();
            
            // 3-reset the game
            reset();
            
            // 4-hide the setting panel again
            DOM.setPanel.style.display = 'none';
        });
        
        DOM.btn_AI.addEventListener('click', () => {    // human vs AI
            // 1. turn on the AI flag
            logicCtrl.setAI(true);
            
            // 2. reset will check, if the vsAI flag is on then setup the game accordingly
            reset();
            
            // 3. hide the setting panel again
            DOM.setPanel.style.display = 'none';
        });
    };
    
    const AIMove = () => {
        // 1-AI makes its move and update the DataStructure- return cordinates of the field
        const cords = logicCtrl.aiMove();

        // 2-render selection on UI
        const field = document.querySelector(`.element--${cords.row + 1}__${cords.col + 1}`);
        UICtrl.updateField(field, logicCtrl.getPlayer());

        // 3-check if the AI won the match 
        check('AI');

        // 4-pass control to the user
        logicCtrl.togglePlayer();   
    };

    const getUserInput = (event) => {
        const field = event.target; // which space is selected
        const value = field.textContent;  // if it is already selected then value will be X or O

        // 1-Check matrix ,if the required box is empty and if any message is being displayed 
        if(value === ' ' && !UICtrl.isMsgDisplayed()){
            // 2-Update DS matrix
            logicCtrl.userMove(field.className);

            // 3-Update UI
            UICtrl.updateField(event.target, logicCtrl.getPlayer());

            // 4-check if the player won the match
            check();

            // 5-change active user (next player's trun)
            logicCtrl.togglePlayer();

            // aiplayer making move 	
            if(logicCtrl.getAI() == true) {
                if(!UICtrl.isMsgDisplayed()) {  // if any msg being display then no changes are allowed
                    AIMove();
                }
            } 
            else {   // pass the control to other player - for human vs human
                UICtrl.updateActivePlayer();   // 1-update active player on UI
            }
        }
    };

    // re-initailize the game
    const reset = () => {            
        logicCtrl.resetDS();    // clearing the matrix data

        UICtrl.resetUI(logicCtrl.getPlayer());    // clearing the UI / reset and set active player

        // check if vsAI flag is true then setup the game according to the X vs AI
        if(logicCtrl.getAI()) {
            logicCtrl.setPlayer('X');   // set active player to 'X', as user will make first move
            UICtrl.updateAI();     // render 'AI' over screen
        }
    };

    // it provide a 2 sec delay to display the winner
    const clearMsgWin = () => {
        setTimeout(() => {
            reset();
        }, 2000);
    };

    const check = (player = logicCtrl.getPlayer()) => {
        const result = logicCtrl.checkWinner();    // checkWinner Inspect's Data Structure, if active user does't won, return undefined
        if(result){

            UICtrl.renderWinner(player);    // Render Winner on the page
            clearMsgWin();     // wait for 2 second then reset UI
        }
        else if(logicCtrl.isMatrixFull()) {    //  if matrix is full
            
            UICtrl.renderDraw();    // Render a draw msg
            clearMsgWin();
        }
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