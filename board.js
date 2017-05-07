class Board {
    constructor(level) {
        this.level = [];
        for (let i = 0; i < level.length; i++) {
            this.level[i] = level[i].slice();
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
        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {
                let tile = this.level[i][j];
                if (tile === 'e') {
                    ctx.fillStyle = 'rgb(0,128,128)';
                }
                else if (tile === 'x') {
                    ctx.fillStyle = 'rgb(244, 143, 66)';
                } 
                else if (tile === 'l') {
                    ctx.fillStyle = 'rgb(200,0,0)';
                }
                else if (tile === 'p') {
                    ctx.fillStyle = 'rgb(244, 244, 65)';
                }
                ctx.fillRect(j * tileSize + 1, i * tileSize + 1, tileSize - 2, tileSize - 2);
            }
        }

        ctx.fillStyle = 'rgb(255,0,255)';
        ctx.fillRect(player.x, player.y, tileSize, tileSize);
    }

     collision(player) {
        if(this.level[Math.round(player.y/tileSize)][Math.round(player.x/tileSize)] == 'p') {
            if(player.dir == 'right') {
                player.dir = 'down';
                player.x--;
            } else if (player.dir == 'left') {
                player.dir = 'up';
                player.x++;
            } else if (player.dir == 'up') {
                player.dir = 'right';
                player.y++;
            } else if (player.dir == 'down') {
                player.dir = 'left';
                player.y--;
            }
        }
        else if(this.level[Math.round(player.y/tileSize)][Math.round(player.x/tileSize)] == 'l') {
             if(player.dir == 'right') {
                player.dir = 'up';
                player.x--;
            } else if (player.dir == 'left') {
                player.dir = 'down';
                player.x++;
            } else if (player.dir == 'up') {
                player.dir = 'left';
                player.y++;
            } else if (player.dir == 'down') {
                player.dir = 'right';
                player.y--;
            }
        } 
     }


     setLeft(x,y) {
        this.level[y][x] = "l";
     }

     setRight(x,y) {
         this.level[y][x] = "p";
     }

}