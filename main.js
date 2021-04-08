const canvas = document.createElement("CANVAS")
const ctx = canvas.getContext('2d')

const fps = 60 //if above monitors refresh rate whole animation will throttle
const fpsinterval = 1000 / fps
let then = performance.now() - fpsinterval

let fireworks = []
let gravity = new CreateVector(0, 0.2)

document.body.appendChild(canvas)
canvas.width = innerWidth
canvas.height = innerHeight

class Particle {
    constructor(x, y, color) {
        this.pos = new CreateVector(x, y)
        this.vel = new CreateVector(0, 0)
        this.acc = new CreateVector(0, 0)
        this.radius = 1.5
        this.color = color
    }

    applyForce(force) {
        this.acc.add(force)
    }

    update() {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.mult(0)
    }

    draw() {
        ctx.beginPath()
        if (this.color == undefined) {
            ctx.fillStyle = 'white'
        } else {
            ctx.fillStyle = this.color
        }
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
}

class FireworkShot extends Particle {
    constructor(x, y, color) {
        super(x, y, color)
        this.vel.y = Math.random() * -8 - 8
    }

    draw() {
        ctx.globalAlpha = 1
        super.draw()
    }
}

class FireworkBurstParticle extends Particle {
    constructor(x, y, color, lifetime) {
        super(x, y, color)
        this.vel.randomize()
        this.vel.mult(Math.random() * (Math.random() * 10 + 5) + 1)
        this.lifetime = lifetime
        this.startlifetime = lifetime
    }

    update() {
        this.vel.mult(0.9) //deacceleration
        super.update()
        this.lifetime -= 1
    }

    draw() {
        ctx.globalAlpha = this.lifetime / this.startlifetime
        super.draw()
    }
}

class Firework {
    constructor(color) {
        this.firework = new FireworkShot(Math.random() * canvas.width, canvas.height, color)
        this.exploded = false
        this.particles = []
        this.color = color
    }

    update() {
        if (!this.exploded) {
            this.firework.applyForce(gravity)
            this.firework.update()

            if (this.firework.vel.y >= 0) {
                this.explode()
            }
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].applyForce(gravity)
            this.particles[i].update()
            if (this.particles[i].lifetime <= 0) {
                this.particles.splice(i, 1)
            }
        }
    }

    explode() {
        this.exploded = true
        let repeats = Math.random() * 167 + 33
        for (let i = 0; i < repeats; i++) {
            this.particles.push(new FireworkBurstParticle(this.firework.pos.x, this.firework.pos.y, this.color, Math.random() * 40 + 20))
        }
    }

    draw() {
        if (!this.exploded) {
            this.firework.draw()
        }
        for (const particle of this.particles) {
            particle.draw()
        }
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
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1

        if (Math.random() < 0.05) {
            fireworks.push(new Firework(`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`))
        }

        for (const firework of fireworks) {
            firework.update()
            firework.draw()
        }
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update()
            fireworks[i].draw()
            if (fireworks[i].exploded && fireworks[i].particles.length === 0) {
                fireworks.splice(i, 1)
            }
        }
	}
}

addEventListener('contextmenu', (event) => {
    event.preventDefault()
    fireworks.push(new Firework(`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`))
})

animate()