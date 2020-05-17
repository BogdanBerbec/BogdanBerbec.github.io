var app = new Vue({
    el: '#app',
    data: {
        table: [
            '', '', '',
            '', '', '',
            '', '', '',
        ],
        finished: false,
        activePlayer: 'X',
    },
    methods: {
        // index reprezinta celula din tabel pe care se face mutarea (0-8)
        makeMove(index) {
            // (guard clause) verificam daca este deja ceva pe acea celula
            if(this.table[index] != '') return;
            // folosim splice pentru a permitea reactivitatea proprietatii table
            this.table.splice(index, 1, this.activePlayer);
            // this.table[index] = this.activePlayer;
            //schimbam jucatorul activ
            this.activePlayer = this.activePlayer == 'X' ? '0' : 'X';
            // verificam daca s-a terminat jocul dupa aceasta mutare
            this.checkFinished();
        },
        checkFinished() {
            this.checkComplete(this.table.filter((value, index) => index > 2 && index < 6));
            this.checkComplete(this.table.filter((value, index) => index > 5));
            this.checkComplete(this.table.filter((value, index) => index < 3));
            this.checkComplete(this.table.filter((value, index) => index % 3 == 0));
            this.checkComplete(this.table.filter((value, index) => index % 3 == 1));
            this.checkComplete(this.table.filter((value, index) => index % 3 == 2));
            this.checkComplete(this.table.filter((value, index) => index % 4 == 0));
            this.checkComplete(this.table.filter((value, index) => [2, 4, 6].includes(index)));
        },
        checkComplete(cells) {
            if(cells.every(cell => cell == 'X')
            || cells.every(cell => cell == '0')
            ){
                this.finished = true;
            }
        }
    }
});


// var activePlayer = 'X';
// $('.table div').click(makeMove);

// function makeMove() {
//     $(this).text(activePlayer)
//            .addClass(activePlayer == 'X' ? 'x' : 'z')
//            .unbind('click', makeMove);
//     activePlayer = activePlayer == 'X' ? '0' : 'X';
//     checkEndGame();
// }

// function checkEndGame() {
//     let cells = $('.table div').toArray();
//     checkComplete(cells.filter((value, index) => index < 3));
//     checkComplete(cells.filter((value, index) => index > 2 && index < 6));
//     checkComplete(cells.filter((value, index) => index > 5));
//     checkComplete(cells.filter((value, index) => index % 3 == 0));
//     checkComplete(cells.filter((value, index) => index % 3 == 1));
//     checkComplete(cells.filter((value, index) => index % 3 == 2));
//     checkComplete(cells.filter((value, index) => index % 4 == 0));
//     checkComplete(cells.filter((value, index) => [2, 4, 6].includes(index)));
// }

// /**
//  * 
//  * @param {Array} cells 
//  */
// function checkComplete(cells) {
//     if(cells.every(cell => $(cell).text() == 'X')
//     || cells.every(cell => $(cell).text() == '0')
//     ){
//         $('.end').addClass('visible');
//     }
// }