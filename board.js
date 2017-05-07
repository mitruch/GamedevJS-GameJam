class Board {

    contructor(level) {
        this.level = [];
        for (let i = 0; i < level.length; i++) {
            this.level[i] = level[i].slice();
        }
    }

    getPlayerPos() {
        for (let i = 0; i < this.level.length; i++) {
            let index = this.level[i].indexOf('p');
            if (index != (-1)) {
                return { x: index, y: i };
            }
        }

    }


}