const canvas = document.createElement("CANVAS")
const ctx = canvas.getContext('2d')

const fps = 60 //if above monitors refresh rate whole animation will throttle
const fpsinterval = 1000 / fps
let then = performance.now() - fpsinterval

let particles = []
let fireworks = []
let mouseX = null
let mouseY = null
let mousePressed = false

document.body.appendChild(canvas)
canvas.width = innerWidth
canvas.height = innerHeight

function Particle(x, y, color, maxspeed, lifetime) {
    this.pos = new CreateVector(x, y)
    this.vel = new CreateVector(0, 0)
    this.acc = new CreateVector(0, 0)

    this.vel.randomize()
    this.vel.mult((Math.random() * maxspeed) + 1)

    this.radius = 2
    this.lifetime = lifetime

    this.applyForce = (force) => {
        this.acc.add(force)
    }

    this.update = () => {
        let gravity = new CreateVector(0, 0.2)

        this.applyForce(gravity)
        this.vel.mult(0.9) //deacceleration
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.mult(0)

        ctx.globalAlpha = this.lifetime / lifetime
        this.lifetime -= 1
    }

    this.draw = () => {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
}

function Firework(x, y, color, height, duration) {
    this.pos = new CreateVector(x, y)
    this.vel = new CreateVector(0, -height / duration)

    this.lifetime = duration
    this.size = height / 75
    
    this.update = () => {
        this.pos.add(this.vel)
        this.lifetime -= 1
        if (this.lifetime === 0) {
            let lifetime = (Math.random() * 40) + 20
            let multiplier = height / 300
            let repeats = ((Math.random() * 100) + 100) * multiplier
            for (let i = 0; i < repeats; i++) {
                particles.push(new Particle(this.pos.x, this.pos.y, color, (Math.random() * 10) + 5, lifetime))
            }
        }
    }

    this.draw = () => {
        ctx.globalAlpha = 1
        ctx.fillStyle = color
        ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size * 3)
    }
}

function animate() {
	requestAnimationFrame(animate)
	
	const now = performance.now()
	const elapsedTime = now - then
	if (elapsedTime > fpsinterval) {
		then = now - (elapsedTime % fpsinterval)
		
        //Drawing a transparent background to cause a trail effect
        ctx.globalAlpha = 0.1
        //ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1

        if (mouseX != null && mousePressed === true) {
            particles.push(new Particle(mouseX, mouseY, 'rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')', -1, 20))
            if (Math.random() < .05) {
                fireworks.push(new Firework(Math.random() * canvas.width, (Math.random() * canvas.height / 3) + canvas.height / 2, 'rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')', Math.floor((Math.random() * 200)) + 100, Math.floor((Math.random() * 120)) + 60))
            }
            /*
            ctx.beginPath()
            let pos = new CreateVector(canvas.width/2, canvas.height/2)
            let mouse = new CreateVector(mouseX, mouseY)
            mouse.sub(pos)
            mouse.setMag(100)
            mouse.add(pos)
            ctx.moveTo(pos.x, pos.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = 'white'
            ctx.stroke()
            */
        }
        for (const particle of particles) {
            particle.update()
            particle.draw()
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].lifetime < 0) {
                particles.splice(i, 1)
            }
        }
        for (const firework of fireworks) {
            firework.update()
            firework.draw()
        }
        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (fireworks[i].lifetime < 0) {
                fireworks.splice(i, 1)
            }
        }
	}
}

addEventListener('contextmenu', (event) => {
    event.preventDefault()
    fireworks.push(new Firework(event.clientX, event.clientY, 'rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')', Math.floor((Math.random() * 200)) + 100, Math.floor((Math.random() * 120)) + 60))
})

addEventListener('mousemove', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
})

addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        mousePressed = true
    }
})

addEventListener('mouseup', (event) => {
    if (event.button === 0) {
        mousePressed = false
    }
})

animate()