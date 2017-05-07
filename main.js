let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    last = new Date().getTime(),
    currentLevel = 0,
    lpm = false,
    levels,
    board,
    tileSize = 50,
    player = { x: 0, y: 0, dir: 'right', energy: 0 },
    enemy = {};

let clear = () => {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let scrollCb = (event) => {
    player.x++;
}

let lpmCb = (event) => {
    let dx = player.x, dy = player.y;
    if (player.dir == 'right') dx++;
    if (player.dir == 'left') dx--;
    if (player.dir == 'up') dy--;
    if (player.dir == 'down') dy++;
    // board.setLeftDown(dx, dy);
}

let ppmCb = (event) => {
    let dx = player.x, dy = player.y;
    if (player.dir == 'right') dx++;
    if (player.dir == 'left') dx--;
    if (player.dir == 'up') dy--;
    if (player.dir == 'down') dy++;
    // board.setLeftUp(dx, dy);

    event.preventDefault();
}

let update = () => {
    if (player.energy > 10) {
        player.x++;
        player.energy -= 10;
    }
    // if(board.isColliding(player)) {
    //     board.changeDir(player);
    // }
}

let draw = () => {
    clear();
    board.draw(player);
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

    resize();
    document.body.appendChild(canvas);

    axios.get('./maps.json')
        .then((response) => {
            levels = response.data.levels;
            board = new Board(levels[currentLevel]);
            let playerPos = board.getPlayerPos();
            playerPos.x = playerPos.x;
            playerPos.y = playerPos.y;
            loop();
        })
        .catch((error) => {
            console.log(error);
        });
}