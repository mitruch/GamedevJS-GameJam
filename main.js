let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    last = new Date().getTime(),
    currentLevel = 0,
    lpm = false,
    levels,
    board,
    tileSize = 50,
    player = { x: 0, y: 0, dir: 'right' },
    playerPositions = [],
    enemyRespawnTime = 5000,
    gameOver = true,
    enemy = { x: 0, y: 0, speed: 1, alive: false };

let clear = () => {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let scrollCb = (event) => {
    playerPositions.push({x: player.x, y: player.y});

    if(player.dir == 'right') player.x++;
    if(player.dir == 'left') player.x--;
    if(player.dir == 'up') player.y--;
    if(player.dir == 'down') player.y++;
}

let keyCb = (event) => {
    if(gameOver) gameOver = false;
}

let lpmCb = (event) => {
    let dx = player.x, dy = player.y;
    if (player.dir == 'right') dx++;
    if (player.dir == 'left') dx--;
    if (player.dir == 'up') dy--;
    if (player.dir == 'down') dy++;
    board.setLeft(dx, dy);
}

let ppmCb = (event) => {
    let dx = player.x, dy = player.y;
    if (player.dir == 'right') dx++;
    if (player.dir == 'left') dx--;
    if (player.dir == 'up') dy--;
    if (player.dir == 'down') dy++;
    board.setRight(dx, dy);

    event.preventDefault();
}

let update = () => {
    if(gameOver) {
        
    }
    else {
        if(enemy.alive) {
            if(playerPositions.length == 0) {
                gameOver = true;
            }
            else {
                let lastPos = playerPositions.shift();
                enemy.x = lastPos.x;
                enemy.y = lastPos.y;
            }
        }
        board.collision(player);
    }
}

let draw = () => {
    clear();
    if(gameOver) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = '40px Monospace';
        let text = "GAME OVER";
        ctx.fillText(text, canvas.width/2 - ctx.measureText(text).width/2, canvas.height/2 - 40);

        text = "Press something to player again";
        ctx.font = '30px Monospace';
        ctx.fillText(text, canvas.width/2 - ctx.measureText(text).width/2, canvas.height/2);
    }
    else {
        board.draw(player);
        if(enemy.alive) {
            ctx.fillStyle = "rgb(255,0,0)";
            ctx.fillRect(enemy.x, enemy.y, tileSize, tileSize);
        }
    }
}

let loop = () => {
    let now = new Date().getTime();
    while (now - last > 1000 / 60) {
        update();
        last += 1000 / 60;
    }
    draw();
    requestAnimationFrame(loop);
}


let init = () => {
    window.onresize = resize;
    window.onmousewheel = scrollCb;
    window.onclick = lpmCb;
    window.oncontextmenu = ppmCb;
    window.onkeydown = keyCb;

    resize();
    document.body.appendChild(canvas);

    axios.get('./maps.json')
        .then((response) => {
            levels = response.data.levels;
            board = new Board(levels[currentLevel]);
            let playerPos = board.getPlayerPos();
            player.x = playerPos.x;
            player.y = playerPos.y;
            enemy.x = playerPos.x;
            enemy.y = playerPos.y;
            setTimeout(() => {enemy.alive = true}, enemyRespawnTime);
            loop();
        })
        .catch((error) => {
            console.log(error);
        });
}