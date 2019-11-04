function run(num_cats, max_iterations) {

    // init array

    var cat_color = "#247BA0";
    var zombie_color = "#ff1654";
    var human_color = "#F3FFBD";
    var block_size = 30
    var best_fit = 30
    var vartation = 10
    for (i = -vartation; i < vartation; i++) {
        if ((window.innerWidth % block_size+i) > (window.innerWidth % best_fit)) {
            best_fit = block_size+i
        }
    }
    var block_size = best_fit
    console.log("block size: " + block_size)
    win_x = Math.ceil(window.innerWidth/block_size)
    win_y = Math.ceil(window.innerHeight/block_size)
    padding = 5

    var display = Array(win_x)
    for (x = 0; x < win_x; x++) {
        display[x] = Array(win_y)
    }

    // init all empty spaces

    var empty = Array(win_x*win_y)
    z = 0
    for (x = 0; x < win_x; x++) {
        for (y = 0; y < win_y; y++) {
           empty[z] = [x, y]
           z = z+1
        }
    }

    console.log("z: " +z)

    num_humans = z-num_cats-1
    num_zombies = 1

    // set positions of zombies, humans, and cats
    // zombie = -1
    // cat = 1
    // human = 0

    for (i = 0; i < num_cats; i++) {
        cat_pos = Math.floor((Math.random() * empty.length));
        index = empty[cat_pos]
        display[index[0]][index[1]] = 1
        empty.splice(cat_pos, 1)
    }

    for (i = 0; i < num_zombies; i++) {
        cat_pos = Math.floor((Math.random() * empty.length));
        index = empty[cat_pos]
        display[index[0]][index[1]] = -1
        empty.splice(cat_pos, 1)
        console.log(("zombie at x: " + x + ", " + y))
    }

    for (i = 0; i < num_humans; i++) {
        cat_pos = Math.floor((Math.random() * empty.length));
        index = empty[cat_pos]
        display[index[0]][index[1]] = 0
        empty.splice(cat_pos, 1)
    }

    // init the display

    var dis_width = window.innerWidth
    var dis_height = window.innerHeight

    var canvas_init = document.getElementById("myCanvas")
    canvas_init.width = dis_width
    canvas_init.height = dis_height

    var context = canvas_init.getContext("2d")



    context.fillStyle = "#70C1B3"
    context.fillRect(0,0, canvas_init.width, canvas_init.height)

    // fill zombies in 

    context.fillStyle = "#ff1654"; // zombie color
    for (x = 0; x < win_x; x++) {
        for (y = 0; y < win_y; y++) {
           if (display[x][y] == -1) {
               context.fillRect(x*block_size+padding, y*block_size+padding, block_size-padding*2, block_size-padding*2)
           }
        }
    }
    context.stroke();

    // fill humans in 

    context.fillStyle = "#F3FFBD"; // human color
    for (x = 0; x < win_x; x++) {
        for (y = 0; y < win_y; y++) {
           if (display[x][y] == 0) {
               context.fillRect(x*block_size+padding, y*block_size+padding, block_size-padding*2, block_size-padding*2)
           }
        }
    }
    context.stroke();

    // fill cats in 

    context.fillStyle = "#247BA0"; // cat color
    for (x = 0; x < win_x; x++) {
        for (y = 0; y < win_y; y++) {
           if (display[x][y] == 1) {
               context.fillRect(x*block_size+padding, y*block_size+padding, block_size-padding*2, block_size-padding*2)
           }
        }
    }
    context.stroke();

    console.log("array length: " +display.length)


    function nextDisplay(display_temp) {
        change = 0
        console.log(display_temp)
        for (x = 0; x < win_x; x++) {
            for (y = 0; y < win_y; y++) {
                if (display_temp[x][y] == -1) {
                    if (x > 0) {
                        if (display_temp[x-1][y] == 0) {
                            display_temp[x-1][y] = -1
                            change++
                        }
                    }
                    if (x < display_temp.length-1) {
                        if (display_temp[x+1][y] == 0) {
                            display_temp[x+1][y] = -1
                            change++
                        }
                    }
                    if (y > 0) {
                        if (display_temp[x][y+1] == 0) {
                            display_temp[x][y+1] = -1
                            change++
                        }
                    }
                    if (y < display_temp[0].length-1) {
                        if (display_temp[x][y-1] == 0) {
                            display_temp[x][y-1] = -1
                            change++
                        }
                    }
               }
            }
        }
        return [display, change]
    }


    old_display = 0
    i = 0
    object.addEventListener("keypress", function(){
        old_display = display
        returned = nextDisplay(display)
        display = returned[0]
        for (x = 0; x < win_x; x++) {
            for (y = 0; y < win_y; y++) {
                if (display[x][y] == 0) {
                    context.fillStyle = human_color
                    context.fillRect(x*block_size+padding, y*block_size+padding, block_size-padding*2, block_size-padding*2)
                }
                if (display[x][y] == -1) {
                    context.fillStyle = zombie_color
                    context.fillRect(x*block_size+padding, y*block_size+padding, block_size-padding*2, block_size-padding*2)
                }
            }
        }
        context.stroke()
    })
}