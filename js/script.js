/**
 * 1.pending try async await at setTimeout (inside getUserInput there is isMsgActivity is used remove it try async await)
 */
/* when AI vs human - min-max algo for AI */



//***************************************************//
//**************** Function COTROLLER *************//
//***************************************************// 
const logicController = (() => {
    const matrix = [new Array(3),new Array(3),new Array(3)];
    let playerActive = 'X';  // it is a flag representing active player(from setting we can set/change the default player)
    const vsAI = true;

    const resetDataStructure = () => {
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                matrix[i][j] = ' ';
            }
        }
        playerActive = 'X';  // testing when ai vs user then user will play the first move always
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

    const checkMatrix = (curMatrix = matrix) => {
        // 1) check rows
        for(let i = 0; i < 3; i++) {
            if(curMatrix[i][0] === curMatrix[i][1] && curMatrix[i][1] === curMatrix[i][2]) {
                if(curMatrix[i][0] !== ' ') return curMatrix[i][0];
            }
        }
        // 2) check cols
        for(let i = 0; i < 3; i++) {
            if(curMatrix[0][i] === curMatrix[1][i] && curMatrix[1][i] === curMatrix[2][i]) {
                if(curMatrix[0][i] !== ' ') return curMatrix[0][i];
            }
        }
        // 3) check diagonals
        if((curMatrix[0][0] === curMatrix[1][1] && curMatrix[1][1] === curMatrix[2][2])||(curMatrix[0][2] === curMatrix[1][1] && curMatrix[1][1] === curMatrix[2][0])) {
            if(curMatrix[1][1] !== ' ') return curMatrix[1][1];                   
        }
        // 4) No winnig condition
        return undefined;
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

    // let O- aiPlayer AND X- humanPlayer
    const minimax = (newMatrix, player = 'O') => {
        // check if there are empty fields in Matrix and return index of fields empty ex- [{row,col},{rol,col}]
        const availFields = getAvailFields(newMatrix);

        //check if any of the player's won(if AI won return 10, otherwise -10) or if it is tie
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

    return{
            vsAI,   // flag about if the game is player vs AI

            // Initialize matrix
            resetDS: () => { resetDataStructure(); },

            // check if the matrix is fully filled
            isFull: () => isMatrixFull(),
            
            // check if Active player is the winner
            checkWinner: () => checkMatrix(),

            userInput: (dataString) => {
                let data;
                
                // scraping the required data from the dataString
                data = scrapeData(dataString);
                //updating matrix
                matrix[data.row][data.col] = playerActive;
            },

            // Active Player
            toggleActive:  () => { playerActive = playerActive === 'O' ? 'X' : 'O'; },

            // Active User/player
            getPlayerActive: () => playerActive,

            // aiPlayer
            aiPlayer: () => {
                let move = {};    //{score:number, index:{row, col}}
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
        allFields : document.querySelectorAll('.element'),
        X: document.querySelector('.x-container'),      // pending this is not used any where remove it
        O: document.querySelector('.O'),
        winWindow: document.querySelector('.winner'),
        winner: document.querySelector('.player'),
        textDraw: document.querySelector('.winner p'),
        setting: document.querySelector('.settings-icon a'),
        setPanel: document.querySelector('ul'),
        btn_Human: document.querySelector('.btn-human'),
        btn_AI: document.querySelector('.btn-AI')
    };

    const setPlayerActive = () => {
            DOMInput.X.classList.toggle('active');
            DOMInput.O.classList.toggle('active');
    };

    // this check if there is any msg being displayed on the screen, return's true or false
    const anyActiveMsg = () => DOMInput.winWindow.style.display === 'block';


    // listen to changes in setting
    //pending when user click outside of the panel it should be closed automatically
    DOMInput.setting.addEventListener('click', () =>{
        DOMInput.setPanel.style.display = DOMInput.setPanel.style.display === 'none' ? 'block' : 'none';
        //DOMInput.settingPanel.style.display = (DOMInput.settingPane)
    });

    DOMInput.btn_Human.addEventListener('click', () =>{
        console.log('human is activited');
    });

    DOMInput.btn_AI.addEventListener('click', () =>{
        console.log('AI is activited');
    });



    return {
        resetUI : (activePlayer) => {   // reset the game's UI
            // clean the Matrix
            Array.from(DOMInput.allFields).forEach(field => field.textContent = ' ');

            // highlight active player
            DOMInput[activePlayer].classList.add('active');

            // remove the congrats message from the previous gameplay
            DOMInput.winWindow.style.display = 'none';
        },
        
        updateField : (field, player) => {   // updating UI against user select
            field.textContent = player;
        },

        updateActivePlayer : (activePlayer) => {   // when X vs O
                    // pending - when new game start ex- X vs O after a match of ex- X vs AI, the textContent ('AI') have to revert back to O
            setPlayerActive();
        },

        updateAI: () => {   // when X vs AI
            const activePlayer = 'AI';
            DOMInput.O.textContent = activePlayer;
            // highlight both because AI makes move very fast, toggle will not be visible
            DOMInput.X.classList.add('active');
            DOMInput.O.classList.add('active');
        },

        renderWinner: (activePlayer) => {
            // 1-upadate the activePlayer in the html 
            DOMInput.winner.textContent = activePlayer;
            DOMInput.textDraw.textContent = 'The Winner is ';

            // 2-render congratulations message
            DOMInput.textDraw.style.color = 'rgba(236,226,29,1)';
            DOMInput.winWindow.style.display = 'block';
        },

        renderDraw: () => {
            // 1-update the activePlayer and message
            DOMInput.winner.textContent = '';
            DOMInput.textDraw.textContent = 'Draw!';
            
            // 2-render congratulations message
            DOMInput.textDraw.style.color = '#222';
            DOMInput.winWindow.style.display = 'block';
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
        logicCtrl.resetDS();    // clearing the matrix data

        UICtrl.resetUI(logicCtrl.getPlayerActive());    // clearing the UI / reset

        // check if vsAI flag is true then setup the game according to the X vs AI
        if(logicCtrl.vsAI) {
            UICtrl.updateAI();
        }
    };

    const toggleUser = () => {
        logicCtrl.toggleActive();   // 1-change active player

        UICtrl.updateActivePlayer();   // 2-update active player on UI    
    };

    // it provide a 2 sec delay to display the winner or draw message
    const clearMsgWin = () => {
        setTimeout(() => {
            reset();
        }, 2000);
    };

    const getUserInput = (event) => {
        const field = event.target; // which space is selected
        const value = field.textContent;  // if it is already selected then value will be X or O

        // Check matrix ,if the required box is empty and if any message is being displayed 
        if(value === ' ' && !UICtrl.isMsgDisplayed()){
            // 2-Update DS matrix
            logicCtrl.userInput(field.className);

            // 3-Update UI
            UICtrl.updateField(event.target, logicCtrl.getPlayerActive());

            // 4-check if the player won the match
            check();

            // 5-change active user-- if(AI) else just change active user
            if(logicCtrl.vsAI == true && !UICtrl.isMsgDisplayed()) {
                logicCtrl.toggleActive();   // change user to AI (make changes to DataStructure only)
                
                const coords = logicCtrl.aiPlayer();   // AI makes its move
                const field = document.querySelector(`.element--${coords.row + 1}__${coords.col + 1}`);
                UICtrl.updateField(field, logicCtrl.getPlayerActive());

                check('AI');

                logicCtrl.toggleActive();   // change AI to user (make changes to DataStructure only)
            } 
            else {
                toggleUser();      // pass the control to the next play
            }
        }
    };

    const check = (player = logicCtrl.getPlayerActive()) => {
        const result = logicCtrl.checkWinner();    // checkWinner Inspect's Data Structure, if active user does't won, return undefined
        if(result){
            
            UICtrl.renderWinner(player);    // Render Winner on the page
            
            clearMsgWin();     // wait for 2 second then reset UI
        }
        else if(logicCtrl.isFull()) {    //  if matrix is full
            
            UICtrl.renderDraw();    // 1-render a draw msg
            
            clearMsgWin();   // 2-reset UI
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
