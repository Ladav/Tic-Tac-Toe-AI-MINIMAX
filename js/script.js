//***************************************************//
//**************** Function COTROLLER *************//
//***************************************************// 
const logicController = (() => {
    const matrix = [new Array(3), new Array(3), new Array(3)];
    let playerActive = 'X';
    let vsAI = true;  // if playing against AI--> (player vs AI) or not

    const scrapeData = (data) => {
        let row, col, temp;
        // ex- data = 'element--1__1'
        temp = data.split('__');

        // temp = ['element--1', '1'] we got coloumns
        col = parseInt(temp[1], 10) - 1;    // -1 to make it 0 index based 

        // temp[0] = element--1
        temp = temp[0].split('--');     // temp = ['element', '1']
        row = parseInt(temp[1], 10) - 1;

        return { row, col };
    };

    const checkMatrix = (curMatrix = matrix) => {
        // 1) check rows
        for (let i = 0; i < 3; i++) {
            if (curMatrix[i][0] === curMatrix[i][1] && curMatrix[i][1] === curMatrix[i][2]) {
                if (curMatrix[i][0] !== ' ') return curMatrix[i][0];
            }
        }
        // 2) check cols
        for (let i = 0; i < 3; i++) {
            if (curMatrix[0][i] === curMatrix[1][i] && curMatrix[1][i] === curMatrix[2][i]) {
                if (curMatrix[0][i] !== ' ') return curMatrix[0][i];
            }
        }
        // 3) check diagonals
        if ((curMatrix[0][0] === curMatrix[1][1] && curMatrix[1][1] === curMatrix[2][2]) || (curMatrix[0][2] === curMatrix[1][1] && curMatrix[1][1] === curMatrix[2][0])) {
            if (curMatrix[1][1] !== ' ') return curMatrix[1][1];
        }
        // 4) No winnig condition
        return undefined;
    };

    const getAvailFields = (currentMatrix) => {     // using these AI will test all moves
        let emptyFields = []; // ex- [{row,col},{rol,col}]
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (currentMatrix[i][j] === ' ') {
                    emptyFields.push({ row: i, col: j });
                }
            }
        }
        return emptyFields;
    };

    ///// "MINIMAX ALGO is used..." let O- aiPlayer AND X- humanPlayer
    const minimax = (newMatrix, player = 'O') => {
        // check if there are empty fields in Matrix and return index of fields empty ex- [{row,col},{rol,col}]
        const availFields = getAvailFields(newMatrix);

        //check if any of the player's won(if AI won return 10, otherwise -10) or if it is tie
        if (checkMatrix(newMatrix) === 'O') {
            return { score: 10 };
        } else if (checkMatrix(newMatrix) === 'X') {
            return { score: -10 };
        } else if (availFields.length === 0) {
            return { score: 0 }; // it's a draw
        }

        let moves = []; // collect the move's in the current level of tree for comparision

        for (let i = 0; i < availFields.length; i++) {
            let move = {}; // to store the score and index of the current move {score:number,index:{row,col}}

            move.index = availFields[i];   // it return and store index of an object ex-{row, col}

            newMatrix[move.index.row][move.index.col] = player; // making the move for the current player

            // calling the minimax again, this time with the second player and pass the updated newMatrix
            if (player === 'O') {    // O- aiPlayer AND X- humanPlayer
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
        if (player === 'O') {    // O- aiPlayer AND X- humanPlayer
            let bestScore = -10000;    // in case in aiPlayer we want highest score possible
            for (let i = 0; i < moves.length; i++) {
                if (bestScore < moves[i].score) {
                    bestScore = moves[i].score;
                    bestMove = i;   // selecting the move with highest score, this move will passed to one level up
                }
            }
        }
        else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (bestScore > moves[i].score) {    // this time looking for lowest score
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

        checkWinner: () => checkMatrix(),   // check if Active player is the winner
        togglePlayer: () => { playerActive = playerActive === 'O' ? 'X' : 'O'; },   // Active Player

        resetDS: () => {    // Initialize matrix
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    matrix[i][j] = ' ';
                }
            }
        },

        isMatrixFull: () => {     // check if the matrix is fully filled
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (matrix[i][j] === ' ') {
                        return false;
                    }
                }
            }
            return true;
        },

        userMove: (dataString) => {
            let data;
            // scraping the required data from the dataString
            data = scrapeData(dataString);
            //updating matrix
            matrix[data.row][data.col] = playerActive;
        },

        aiMove: () => {
            let move = {};    //   {score:number, index:{row, col}}
            move = minimax(matrix);

            const row = move.index.row;
            const col = move.index.col;
            matrix[row][col] = 'O';    // AI playing as 'O'

            return { row, col };
        }
    };
})();

//***************************************************//
//**************** UI CONTROLLER *************//
//***************************************************//
const UIController = (() => {
    const DOMInput = {
        field: {
            field_1_1: document.querySelector('.element--1__1'),
            field_1_2: document.querySelector('.element--1__2'),
            field_1_3: document.querySelector('.element--1__3'),
            field_2_1: document.querySelector('.element--2__1'),
            field_2_2: document.querySelector('.element--2__2'),
            field_2_3: document.querySelector('.element--2__3'),
            field_3_1: document.querySelector('.element--3__1'),
            field_3_2: document.querySelector('.element--3__2'),
            field_3_3: document.querySelector('.element--3__3')
        },
        allFields: document.querySelectorAll('.element'),
        X: document.querySelector('.X'),
        O: document.querySelector('.O'),
        window: document.querySelector('.winner'),
        winner: document.querySelector('.player'),
        textDraw: document.querySelector('.winner p'),
        setting: document.querySelector('.settings'),
        setPanel: document.querySelector('ul'),
        btn_Human: document.querySelector('.btn-human'),
        btn_AI: document.querySelector('.btn-AI'),
        backdrop: document.querySelector('.backdrop')
    };

    return {
        getDOMInput: () => DOMInput,

        // this check if there is any msg being displayed on the screen, return's true or false
        isMsgDisplayed: () => DOMInput.window.style.display === 'block',

        resetUI: (activePlayer) => {   // reset the game's UI
            // clean the Matrix
            Array.from(DOMInput.allFields).forEach(field => field.textContent = ' ');

            DOMInput.setPanel.style.display = 'none';    // hide the setting panel (default)
            DOMInput.backdrop.style.display = 'none';    // hide the backdrop (default)

            // highlight active player
            DOMInput[activePlayer].classList.add('active');
            const otherPlayer = activePlayer === 'X' ? 'O' : 'X';
            DOMInput[otherPlayer].classList.remove('active');

            // remove the congrats message from the previous gameplay
            DOMInput.window.style.display = 'none';
        },

        updateField: (field, player) => {   // updating UI against user select
            field.textContent = player;
        },

        updateActivePlayer: () => {   // when X vs O
            // when new game start ex- X vs O after a match of ex- X vs AI, the textContent ('AI') have to revert back to O
            DOMInput.O.textContent = 'O';
            // change(highlight) the active player
            DOMInput.X.classList.toggle('active');
            DOMInput.O.classList.toggle('active');
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
            DOMInput.window.style.display = 'block';
        },

        renderDraw: () => {
            // 1-update the activePlayer and message
            DOMInput.winner.textContent = '';
            DOMInput.textDraw.textContent = 'Draw!';

            // 2-render congratulations message
            DOMInput.textDraw.style.color = '#222';
            DOMInput.window.style.display = 'block';
        },

        updateSetting: () => {
            DOMInput.backdrop.style.display = DOMInput.backdrop.style.display === 'none' ? 'block' : 'none';
            DOMInput.setPanel.style.display = DOMInput.setPanel.style.display === 'none' ? 'block' : 'none';
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

        fieldArr.forEach(el => {   // setting listener's on all input fields in the matrix
            el.addEventListener('click', getUserInput);
        });

        // backdop listener and settings icon listener
        [DOM.backdrop, DOM.setting].map(el => el.addEventListener('click', UICtrl.updateSetting));

        // listen to changes in setting
        DOM.btn_Human.addEventListener('click', () => {     // human vs human
            logicCtrl.setAI(false);                         // 1-turn off the AI flag

            UICtrl.updateActivePlayer();                    // 2-set the second player as the 'O'
            reset();                                        // 3-reset the game
        });

        DOM.btn_AI.addEventListener('click', () => {    // human vs AI
            logicCtrl.setAI(true);                      // 1-turn off the AI flag

            reset();                                    // 2-reset the game
            AIMove();                                   // 3-set active player to 'X', so that correct entry is displayed, as user will play first
        });
    };

    const AIMove = () => {
        if (logicCtrl.getAI() === true && logicCtrl.getPlayer() === 'O') {
            // 1- AI makes its move
            const cords = logicCtrl.aiMove();
            const field = document.querySelector(`.element--${cords.row + 1}__${cords.col + 1}`);
            // 2-render change over UI
            UICtrl.updateField(field, logicCtrl.getPlayer());
            // 3-check if AI won
            check('AI');
            // 4-change Active player (pass control to the player 'X')
            logicCtrl.togglePlayer();
        }
    }

    const getUserInput = (event) => {
        const field = event.target; // which space is selected
        const value = field.textContent;  // if it is already selected then value will be X or O

        // Check matrix ,if the required box is empty and if any message is being displayed 
        if (value === ' ' && !UICtrl.isMsgDisplayed()) {
            // 2-Update DS matrix
            logicCtrl.userMove(field.className);

            // 3-Update UI
            UICtrl.updateField(event.target, logicCtrl.getPlayer());

            // 4-check if the player won the match
            check();

            // 5-change active user (next player's trun)
            logicCtrl.togglePlayer();

            // aiplayer making move 	
            if (logicCtrl.getAI() == true) {
                if (!UICtrl.isMsgDisplayed()) {  // if any msg being display then no changes are allowed
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
        UICtrl.resetUI(logicCtrl.getPlayer());    // clearing the UI / reset

        // check if vsAI flag is true then setup the game according to the X vs AI
        if (logicCtrl.getAI()) {
            UICtrl.updateAI();
        }
    };

    // it provide a 2 sec delay to display the winner
    const clearMsg = (draw) => {
        let isDraw = draw;   // in case, the last move before a draw is made by 'X', then after draw, AI makes move
        setTimeout(() => {
            reset();
            if (isDraw === true) {
                AIMove();
            }
        }, 2000);
    };

    const check = (player = logicCtrl.getPlayer()) => {
        const result = logicCtrl.checkWinner();    // checkWinner Inspect's Data Structure, if active user does't won, return undefined
        let isDraw = false;     // this false is used to distinguish between -> a draw and a game won in the last move (required for AI to make the first move in a new game)

        if (result) {
            UICtrl.renderWinner(player);    // Render Winner on the page

            clearMsg(isDraw);     // wait for 2 second then reset UI
        }
        else if (logicCtrl.isMatrixFull()) {    //  if matrix is full
            UICtrl.renderDraw();    // 1-render a draw msg

            isDraw = true;
            clearMsg(isDraw);   // 2-reset UI
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