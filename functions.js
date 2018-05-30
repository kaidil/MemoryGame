var memory_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L'];
var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;
var total_clicks = 0;

// Kaartide segamise funktsioon, et saaks memory_arrayd iga aeg uuesti välja kutsuda
Array.prototype.memory_tile_shuffle = function(){
    var i = this.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i+1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful: ', registration)
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err)
        })
    }
}

// F-n uue kaardilaua loomiseks
function newBoard(){
    tiles_flipped = 0;
    total_clicks = 0;
    var output = '';
    memory_array.memory_tile_shuffle();
    for(var i = 0; i < memory_array.length; i++){
        output += '<div id="tile_'+i+'" onclick="memoryFlipTile(this,\''+memory_array[i]+'\')"></div>';
    }
    document.getElementById('memory_board').innerHTML = output;
}

// F-n uue kaardilaua loomiseks
function memoryFlipTile(tile,val){
    total_clicks++;
    console.log('total_clicks:', total_clicks);
    document.getElementById("klicks").innerHTML = "Klikke: " + total_clicks;
    if(tile.innerHTML == "" && memory_values.length < 2){   // kui kasutaja ei ole veel yhtegi kaarti avanud
        tile.style.background = '#FFF';
        tile.innerHTML = '<img src="./images/' + val + '.png"/>';
        if(memory_values.length == 0){  // hakkab jooksma alles siis kui kasutajal juba 1 kaart avatud
            memory_values.push(val);
            memory_tile_ids.push(tile.id);
        } else if(memory_values.length == 1){   // kontrollime, kas on paar
            memory_values.push(val);
            memory_tile_ids.push(tile.id);
            if(memory_values[0] == memory_values[1]){
                tiles_flipped += 2;
                // Clear both arrays
                memory_values = []; // tyhjendame massiivid, et uut paari hakata otsima
                memory_tile_ids = [];
                // Check to see if the whole board is cleared
                if(tiles_flipped == memory_array.length){   // kotroll, kas kas kõik kaardid avatud, kui jah, siis uus laud
                    score = (24 / total_clicks) * 100;
                    alert("Oled võitnud! Sinu skoor on: " + Math.round(score));
                    document.getElementById('memory_board').innerHTML = "";
                    newBoard();
                }
            } else {    // kui kasutaja ei saanud paari, siis jätkub kood siit
                function flip2Back(){
                    // Flip the 2 tiles back over
                    var tile_1 = document.getElementById(memory_tile_ids[0]);
                    var tile_2 = document.getElementById(memory_tile_ids[1]);
                    tile_1.style.background = '';
                    tile_1.innerHTML = "";
                    tile_2.style.background = '';
                    tile_2.innerHTML = "";
                    // Clear both arrays
                    memory_values = [];
                    memory_tile_ids = [];
                }
                setTimeout(flip2Back, 500);
            }
        }
    }
}

window.onload = function(){
    registerServiceWorker();
    newBoard();
}
