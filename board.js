class Board {
    constructor(level) {
        this.level = [];
        this.fruits = 0;
        this.w = level[0].length;
        this.h = level.length;

        this.changeLevel(level, true);
    }

    changeLevel(level, first = false) {
        this.fruits = 0;
        for (let i = 0; i < level.length; i++) {
            this.level[i] = level[i].slice();
            for (let j = 0; j < level[i].length; j++) {
                if (level[i][j] === 'x') this.fruits++;
            }
            if (!first) {
                let index = this.level[i].indexOf('p');
                if (index != -1) this.level[i][index] = 'e';
            }
        }
    }

    getPlayerPos() {
        for (let i = 0; i < this.level.length; i++) {
            let index = this.level[i].indexOf('p');
            if (index != (-1)) {
                this.level[i][index] = 'e';
                return { x: index, y: i };
            }
        }
    }

    draw(player) {
        ctx.drawImage(bg, marginLeft, marginTop, tileSize * this.w, tileSize * this.h);
        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {
                let tile = this.level[i][j];
                if (tile !== 'e') {
                    let mock = true;
                    if (tile === 'x') {
                        ctx.drawImage(fruits[0], marginLeft + j * tileSize, marginTop + i * tileSize, tileSize, tileSize);
                        mock = false;
                    }
                    else if (tile === 'g') {
                        if (player.score == this.fruits) {
                            ctx.fillStyle = 'rgb(255,255,0)';
                        }
                        else {
                            ctx.fillStyle = 'rgb(128,128,0)';
                        }
                    }

                    if (tile === 'l') {
                        ctx.fillStyle = 'rgb(200,0,0)';
                    }
                    else if (tile === 'p') {
                        ctx.fillStyle = 'rgb(244, 244, 65)';
                    }
                    if(mock)
                        ctx.fillRect(marginLeft + j * tileSize + 1, marginTop + i * tileSize + 1, tileSize - 2, tileSize - 2)
                }
            }
        }

        ctx.drawImage(playerSpr, marginLeft + player.x, marginTop + player.y, tileSize, tileSize);
    }

    collision(player) {
        let objInIndex = this.level[Math.round(player.y / tileSize)][Math.round(player.x / tileSize)];
        if (objInIndex == 'p') {
            if (player.dir == 'right') {
                player.dir = 'down';
                player.x -= player.speed;
            } else if (player.dir == 'left') {
                player.dir = 'up';
                player.x += player.speed;
            } else if (player.dir == 'up') {
                player.dir = 'right';
                player.y += player.speed;
            } else if (player.dir == 'down') {
                player.dir = 'left';
                player.y -= player.speed;
            }
        }
        else if (objInIndex == 'l') {
            if (player.dir == 'right') {
                player.dir = 'up';
                player.x -= player.speed;
            } else if (player.dir == 'left') {
                player.dir = 'down';
                player.x += player.speed;
            } else if (player.dir == 'up') {
                player.dir = 'left';
                player.y += player.speed;
            } else if (player.dir == 'down') {
                player.dir = 'right';
                player.y -= player.speed;
            }
        }
        else if (objInIndex === 'x') {
            this.level[Math.round(player.y / tileSize)][Math.round(player.x / tileSize)] = "e";
            player.score++;
        }
        else if (objInIndex === 'g' && this.fruits === player.score) {
            currentLevel++;
            restart(true);
        }

        else if (player.y <= 0 && player.dir == 'up') {
            player.dir = 'down';
        }
        else if (player.x <= 0 && player.dir == 'left') {
            player.dir = 'right';
        }
        else if (player.y >= (this.h - 1) * tileSize && player.dir == 'down') {
            player.dir = 'up';
        }
        else if (player.x >= (this.w - 1) * tileSize && player.dir == 'right') {
            player.dir = 'left';
        }
    }


    setLeft(x, y) {
        if (this.level[y] && this.level[y][x] && this.level[y][x] == 'e')
            this.level[y][x] = "l";
    }

    setRight(x, y) {
        if (this.level[y] && this.level[y][x] && this.level[y][x] == 'e')
            this.level[y][x] = "p";
    }

}