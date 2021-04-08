class CreateVector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(Vector) {
        this.x += Vector.x
        this.y += Vector.y
    }

    sub(Vector) {
        this.x -= Vector.x
        this.y -= Vector.y
    }

    mult(num) {
        this.x *= num
        this.y *= num
    }

    div(num) {
        this.x /= num
        this.y /= num
    }

    normalize() {
        const len = this.mag()
        if (len !== 0) {
            this.mult(1 / len)
            return this
        }
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    setMag(num) {
        this.normalize().mult(num)
    }

    randomize() {
        let angle = Math.random() * Math.PI * 2
        this.x = Math.cos(angle)
        this.y = Math.sin(angle)
    }
}