let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    last = new Date().getTime(),
    currentLevel = 0,
    levels,
    tileSize = 50,
    p={x: 0, y: 0, dir: 'right', energy: 0};

let clear = () => {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let scrollCb = (event) => {
    player.energy++;
}

let update = () => {

}

let draw = () => {
    clear();

    for (let i = 0; i < levels[currentLevel].length; i++) {
        let level = levels[currentLevel];
        for (let j = 0; j < level[i].length; j++) {
            let tile = level[i][j];
            if(p.x == j && p.y == i) {
                ctx.fillStyle = 'rgb(0,200,0)'
            }
            else if (tile === 'e') {
                ctx.fillStyle = 'rgb(0,128,128)';
            }
            else if (tile === 'x') {
                ctx.fillStyle = 'rgb(200,0,0)';
            }
            ctx.fillRect(j * tileSize + 1, i * tileSize + 1, tileSize - 2 , tileSize - 2);
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
    resize();
    document.body.appendChild(canvas);

    axios.get('./maps.json')
    .then((response) => {
        levels = response.data.levels;
        p.x = 0;
        p.y = Math.round(levels[0][0].length/2);
        loop();
    })
    .catch((error) => {
        console.log(error);
    });
}