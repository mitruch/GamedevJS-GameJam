let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    last = new Date().getTime(),
    currentLevel = 0,
    lpm = false,
    levels,
    board,
    tileSize,
    player = { x: 0, y: 0, dir: 'right', speed: 10 },
    playerPositions = [],
    enemyRespawnTime = 5000,
    gameOver = false,
    startPos,
    bg
    marginLeft = 0,
    marginTop = 0,
    enemy = { x: 0, y: 0, speed: 1, alive: false };

let clear = () => {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let tileH = levels[currentLevel].length,
        tileW = levels[currentLevel][0].length,
        ts1 = Math.floor(canvas.height/tileH),
        ts2 = Math.floor(canvas.width/tileW);
    if(ts1 < ts2) {
        tileSize = ts1;
        marginLeft = (canvas.width - tileW*tileSize)/2;
        marginTop = 0;
    } else {
        tileSize = ts2;
        marginTop = (canvas.height - tileH*tileSize)/2;
        marginLeft = 0;
    }
}

let scrollCb = (event) => {
    playerPositions.push({x: player.x, y: player.y});

    if(player.dir == 'right') player.x+=player.speed;
    else if(player.dir == 'left') player.x-=player.speed;
    else if(player.dir == 'up') player.y-=player.speed;
    else if(player.dir == 'down') player.y+=player.speed;
    board.collision(player);
}

let restart = () => {

    gameOver = false;
    setTimeout(() => {enemy.alive = true}, enemyRespawnTime);
    player.x = startPos.x;
    player.y = startPos.y;
    player.dir = 'right';
    enemy.x = startPos.x;
    enemy.y = startPos.y;
    board.changeLevel(levels[currentLevel]);
}

let keyCb = (event) => {
    if(gameOver) restart();
}

let lpmCb = (event) => {
    if(gameOver) restart();
    else {
        let tx = Math.round(player.x/tileSize) , ty = Math.round(player.y/tileSize);
        if (player.dir == 'right') tx++;
        else if (player.dir == 'left') tx--;
        else if (player.dir == 'up') ty--;
        else if (player.dir == 'down') ty++;
        board.setLeft(tx, ty);
    }
}

let ppmCb = (event) => {
    if(gameOver) restart();
    else {
        let tx = Math.round(player.x/tileSize) , ty = Math.round(player.y/tileSize);
        if (player.dir == 'right') tx++;
        else if (player.dir == 'left') tx--;
        else if (player.dir == 'up') ty--;
        else if (player.dir == 'down') ty++;
        board.setRight(tx, ty);
    }
    event.preventDefault();
}

let update = () => {
    if(gameOver) {
        
    }
    else {
        if(enemy.alive) {
            if(playerPositions.length == 0) {
                gameOver = true;
                enemy.alive = false;
            }
            else {
                let lastPos = playerPositions.shift();
                enemy.x = lastPos.x;
                enemy.y = lastPos.y;
            }
        }
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
            ctx.fillRect(marginLeft + enemy.x, marginTop + enemy.y, tileSize, tileSize);
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

    document.body.appendChild(canvas);

    axios.get('./maps.json')
        .then((response) => {
            levels = response.data.levels;
            resize();
            board = new Board(levels[currentLevel]);
            bg = new Image();
            bg.src = 'bg2.png   ';
            startPos = board.getPlayerPos();
            player.x = startPos.x;
            player.y = startPos.y;
            
            enemy.x = startPos.x;
            enemy.y = startPos.y;
            setTimeout(() => {enemy.alive = true}, enemyRespawnTime);
            loop();
        })
        .catch((error) => {
            console.log(error);
        });
}