
(function() {
    function Sprite(url, pos, size, speed, frames, dir, once) {
        this.pos = pos // position of image in the sprite map
        this.size = size // size of the image in the sprite map
        this.speed = typeof speed === 'number' ? speed : 0 //speed of the sprite animation
        this.frames = frames //order of the frame read
        this._index = 0 //index of the images frames
        this.url = url // url of the sprite map or image if not in a sprite map
        this.dir = dir || 'horizontal' // default = horizontal => it's the way the frames will be chosed
        this.once = once // if we want to animate the frame only once (default = false)
    }

    Sprite.prototype = {
        //update of the animation
        update: function(dt) {
            this._index += this.speed*dt
        },

        //draw of each frame
        render: function(ctx) {
            let frame

            //if the speed of reading the sprite map > 0 (so it will be displayed) => check the max of frames/ and calculate the next frame to be displayed
            if(this.speed > 0) {
                let max = this.frames.length
                let idx = Math.floor(this._index)
                frame = this.frames[idx % max]

                //if once is true then it will terminate the condition at the end of one loop
                if(this.once && idx >= max) {
                    this.done = true
                    return
                }
            }
            // if the speed = 0 then the frame will not move = simple image
            else {
                frame = 0
            }


            let x = this.pos[0]
            let y = this.pos[1]

            //if dir = vertical it will aim the frame under it in the sprite map
            if(this.dir == 'vertical') {
                y += frame * this.size[1]
            }
            //if dir = horizontal or default it will aim the frame at it's rigth in the sprite map
            else {
                x += frame * this.size[0]
            }

            //draw of the image with the url, x and y of sprite map, size of the frames (image, sourcex, sourcey, sourcewidth, sourceheight, destinationx, destinationy, destinationwidth, destinationheight)=(source is source image (sprite map for exemple) and destination is canvas)
            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          0, 0,
                          this.size[0], this.size[1])
        }
    }

    //creation of the sprite function for it to be used
    window.Sprite = Sprite
})()