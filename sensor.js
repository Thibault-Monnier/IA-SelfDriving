class Sensor {
  constructor(car) {
    this.car = car
    this.rayCount = 5
    this.rayLength = 150
    this.raySpread = Math.PI / 2

    this.rays = []
    this.readings = []
  }

  update(roadBorders) {
    this.#castRays()
    this.readings = this.#getReadings(roadBorders)
  }

  #getReadings(roadBorders) {
    return this.rays.map((ray) => {
      const intersections = roadBorders.map((border) => {
        const intersection = this.#lineIntersection(
          ray[0],
          ray[1],
          border[0],
          border[1]
        )
        return intersection
      })
      const closestIntersection = intersections.reduce(
        (closest, current) => {
          if (current === null) return closest
          const currentDistance = this.#distance(ray[0], current)
          const closestDistance = this.#distance(ray[0], closest)
          return currentDistance < closestDistance ? current : closest
        },
        { x: 0, y: 0 }
      )
      return this.#distance(ray[0], closestIntersection)
    })
  }

  #lineIntersection(a1, a2, b1, b2) {
    const denominator =
      (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x)
    if (denominator === 0) return null

    const t =
      ((a1.x - b1.x) * (b1.y - b2.y) - (a1.y - b1.y) * (b1.x - b2.x)) /
      denominator
    const u =
      -((a1.x - a2.x) * (a1.y - b1.y) - (a1.y - a2.y) * (a1.x - b1.x)) /
      denominator

    if (t > 0 && t < 1 && u > 0) {
      return {
        x: a1.x + t * (a2.x - a1.x),
        y: a1.y + t * (a2.y - a1.y),
      }
    }
    return null
  }

  #distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
  }

  #castRays() {
    this.rays = []

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle

      const start = { x: this.car.x, y: this.car.y }
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }

      this.rays.push([start, end])
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = "yellow"
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y)
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y)
      ctx.stroke()
    }
  }
}
