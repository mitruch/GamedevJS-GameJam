let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    last = new Date().getTime(),
    currentLevel = 0,
    lpm = false,
    levels,
    board,
    tileSize,
    player = { x: 0, y: 0, dir: 'right', speed: 10, score: 0 },
    playerPositions = [],
    enemyRespawnTime = 5000,
    gameOver = false,
    startPos,
    bg,
    enemySpr,
    rogal1,
    rogal2,
    exitClose,
    exitOpen,
    playerSpr,
    fruits = [],
    marginLeft = 0,
    marginTop = 0,
    enemy = { x: 0, y: 0, alive: false };

let clear = () => {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let tileH = levels[currentLevel].length,
        tileW = levels[currentLevel][0].length,
        ts1 = Math.floor(canvas.height / tileH),
        ts2 = Math.floor(canvas.width / tileW);
    if (ts1 < ts2) {
        tileSize = ts1;
        marginLeft = (canvas.width - tileW * tileSize) / 2;
        marginTop = 0;
    } else {
        tileSize = ts2;
        marginTop = (canvas.height - tileH * tileSize) / 2;
        marginLeft = 0;
    }
}

let scrollCb = (event) => {
    let lastPos = { x: player.x, y: player.y };
    playerPositions.push({ x: player.x, y: player.y });

    if (player.dir == 'right') player.x += player.speed;
    else if (player.dir == 'left') player.x -= player.speed;
    else if (player.dir == 'up') player.y -= player.speed;
    else if (player.dir == 'down') player.y += player.speed;
    board.collision(player);

    playerPositions.push({ x: (player.x + lastPos.x) / 2, y: (player.y + lastPos.y) / 2 });
}

let restart = (getPos = false) => {
    gameOver = false;
    setTimeout(() => { enemy.alive = true }, enemyRespawnTime);
    board.changeLevel(levels[currentLevel]);
    if (getPos)
        board.getPlayerPos();
    player.x = startPos.x;
    player.y = startPos.y;
    player.score = 0;
    player.dir = 'right';
    enemy.x = startPos.x;
    enemy.y = startPos.y;
    enemy.alive = false;
    playerPositions = [];
}

let keyCb = (event) => {
    if (gameOver) restart();
}

let lpmCb = (event) => {
    if (gameOver) restart();
    else {
        let tx = Math.round(player.x / tileSize), ty = Math.round(player.y / tileSize);
        if (player.dir == 'right') tx++;
        else if (player.dir == 'left') tx--;
        else if (player.dir == 'up') ty--;
        else if (player.dir == 'down') ty++;
        board.setLeft(tx, ty);
    }
}

let ppmCb = (event) => {
    if (gameOver) restart();
    else {
        let tx = Math.round(player.x / tileSize), ty = Math.round(player.y / tileSize);
        if (player.dir == 'right') tx++;
        else if (player.dir == 'left') tx--;
        else if (player.dir == 'up') ty--;
        else if (player.dir == 'down') ty++;
        board.setRight(tx, ty);
    }
    event.preventDefault();
}

let update = () => {
    if (gameOver) {

    }
    else {
        if (enemy.alive) {
            if (playerPositions.length == 0) {
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
    if (gameOver) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = '40px Monospace';
        let text = "GAME OVER";
        ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2 - 40);

        text = "Press something to player again";
        ctx.font = '30px Monospace';
        ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2);
    }
    else {
        board.draw(player);
        if (enemy.alive) {
            ctx.drawImage(enemySpr, marginLeft + enemy.x, marginTop + enemy.y, tileSize, tileSize * 1.2);
        }

        text = "Score: " + player.score;
        ctx.fillStyle = "#ffa500";
        ctx.font = '40px Monospace';
        ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, 40);
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
            enemySpr = new Image();
            playerSpr = new Image();
            fruits[0] = new Image();
            fruits[1] = new Image();
            fruits[2] = new Image();
            fruits[3] = new Image();
            rogal1 = new Image();
            rogal2 = new Image();
            exitClose = new Image();
            exitOpen = new Image();
            bg.src = 'bg2.png';
            playerSpr.src = 'playerSpr.png';
            fruits[0].src = 'apfel.png';
            fruits[1].src = 'perry.png';
            fruits[2].src = 'strawberry.png';
            enemySpr.src = 'enemySpr.png';
            rogal1.src = 'rogal1.png';
            rogal2.src = 'rogal3.png';
            exitClose.src = 'exitClose.png';
            exitOpen.src = 'exitOpen.png';
            startPos = board.getPlayerPos();
            player.x = startPos.x;
            player.y = startPos.y;

            enemy.x = startPos.x;
            enemy.y = startPos.y;
            setTimeout(() => { enemy.alive = true }, enemyRespawnTime);
            loop();
        })
        .catch((error) => {
            console.log(error);
        });
}