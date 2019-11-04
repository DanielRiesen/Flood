class main {
    constructor(num_cats, num_zombies, block_size) {
        this.num_cats = num_cats;
        this.num_zombies = num_zombies
        this.zombie_color = "#ff1654";
        this.cat_color = "#247BA0";
        this.human_color = "#F3FFBD"
        this.background_color = "#70C1B3"
        this.block_size = block_size
        this.dis_width = window.innerWidth
        this.dis_height = window.innerHeight
        this.padding = 5 // padding between blocks
        this.init_board()
        this.empty = 0
        this.update_display()
    }

    init_board() {

        this.best_fit = 30
        this.varitation = 10
        var i = 0
        for (i = -this.varitation; i < this.varitation; i++) { // Finds best fit for display
            if ((window.innerWidth % this.block_size+i) > (window.innerWidth % this.best_fit)) {
                this.best_fit = this.block_size+i
            }
        }
        this.block_size = this.best_fit
        console.log("block size: " + this.block_size) // logs the best fit for display
        this.win_x = Math.ceil(window.innerWidth/this.block_size) // How many blocks fit onto display
        this.win_y = Math.ceil(window.innerHeight/this.block_size)

        this.display = Array(this.win_x) // Init empty array with dimensions of window
        var x = 0
        for (x = 0; x < this.win_x; x++) {
            this.display[x] = Array(this.win_y)
        }

        this.empty = Array(this.win_x*this.win_y) // Stores all empty spaces as cord pairs in array
        var i = 0
        var x = 0
        var y = 0
        for (x = 0; x < this.win_x; x++) {
            for (y = 0; y < this.win_y; y++) {
                this.empty[i] = [x, y]
                i++
            }
        }
        this.num_spaces = i // Total number of spaces on the board
        console.log(this.num_spaces)

        this.num_humans = this.num_spaces-this.num_cats-this.num_zombies // if not zombie or cat then human

        console.log(this.num_humans)

        this.place_object(1, this.num_cats) // Places cat
        this.place_object(-1, this.num_zombies) // Place zombies stores its location
        this.place_object(0, this.num_humans) // Place humans

        this.canvas = document.getElementById("myCanvas") // Gets canvas from DOM
        this.canvas.width = this.dis_width // Sets width of canvas
        this.canvas.height = this.dis_height
        this.context = this.canvas.getContext("2d")

    }

    place_object(indicator, to_place) { // Function to place objects on board
        var i = 0
        var added = []
        for (i = 0; i < to_place; i++) {
            var random = Math.floor((Math.random() * this.empty.length))
            this.object_pos = this.empty[random]
            this.display[this.object_pos[0]][this.object_pos[1]] = indicator
            this.empty.splice(random, 1) // Removes the pos for future placement
            added[added.length] = [this.object_pos]
        }
        console.log(added)
        if (indicator == -1) {
            this.zombie_cord = added
        }
    }

    next_display(temp_display) { // takes in display array and returns next interation and # changed
        console.log(this.display)
        var change = 0
        var x = 0
        var y = 0
        var temp_cord = []
        console.log("win x" + this.win_x)
        console.log('win y '+ this.win_y)

        var i = 0
        console.log("zombie cord lenght: " + this.zombie_cord.length)
        console.log("zombie_cord = " +this.zombie_cord)
        for (i = 0; i < this.zombie_cord.length; i++) {
            console.log("made it here")
            this.zombie_cord
            var cord = this.zombie_cord[i].toString().split(",")
            x = parseInt(cord[0])
            y = parseInt(cord[1])
            console.log("x: "+ x)
            console.log("y: "+ y)
            if (x > 0) {
                if (this.display[x-1][y] == 0) {
                    temp_display[x-1][y] = -1
                    change++
                    temp_cord[temp_cord.length] = [[x-1, y]]
                }
            }
            if (x < this.display.length-1) {
                if (this.display[x+1][y] == 0) {
                    temp_display[x+1][y] = -1
                    change++
                    temp_cord[temp_cord.length] = [[x+1, y]]
                }
            }
            if (y < this.display[0].length-1) {
                if (this.display[x][y+1] == 0) {
                    temp_display[x][y+1] = -1
                    change++
                    temp_cord[temp_cord.length] = [[x, y+1]]
                }
            }
            if (y > 0) {
                if (this.display[x][y-1] == 0) {
                    temp_display[x][y-1] = -1
                    change++
                    temp_cord[temp_cord.length] = [[x, y-1]]
                }
            }
        
        }

        console.log("TEMP CORD: "+temp_cord)
        this.zombie_cord = temp_cord
        console.log(this.zombie_cord)

        this.display = temp_display
        return change
    }

    update_display() {

        this.context.fillStyle = this.background_color // Clears screen
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

        var x = 0
        var y = 0
        for (x = 0; x < this.win_x; x++) {
            for (y = 0; y < this.win_y; y++) {
                if (this.display[x][y] == 0) {
                    this.context.fillStyle = this.human_color
                    this.context.fillRect(x*this.block_size+this.padding, y*this.block_size+this.padding, this.block_size-this.padding*2, this.block_size-this.padding*2)
                }
                if (this.display[x][y] == -1) {
                    this.context.fillStyle = this.zombie_color
                    this.context.fillRect(x*this.block_size+this.padding, y*this.block_size+this.padding, this.block_size-this.padding*2, this.block_size-this.padding*2)
                }
                if (this.display[x][y] == 1) {
                    this.context.fillStyle = this.cat_color
                    this.context.fillRect(x*this.block_size+this.padding, y*this.block_size+this.padding, this.block_size-this.padding*2, this.block_size-this.padding*2)
                }
            }
        }
        this.context.stroke()
    }

    cycle() {
        console.log(this.next_display(this.display))
        this.update_display()
    }

}


window.addEventListener('load', function () {
    window.board = new main(350, 1, 30)
    window.addEventListener('keypress', function () {
        this.console.log("keypress")
        window.board.cycle()
    })
  })


