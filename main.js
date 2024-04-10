const carCanvas = document.getElementById('carCanvas')
carCanvas.width = 200
const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width = 320

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

const N = 1000
const cars = generateCars(N)
const previousBest = cars[0]
let bestCar = cars[0]
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1)
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -550, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -650, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1200, 30, 50, "DUMMY", 2),
]

animate()

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard() {
  localStorage.removeItem("bestBrain")
}

function generateCars(N) {
  const cars = []
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
  }
  return cars
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, [])
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic)
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)))
  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  carCtx.save()
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)

  road.draw(carCtx)
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red")
  }

  // Draw all cars with low opacity except the previousBest and the bestCar
  for (let i = 0; i < cars.length; i++) {
    if (cars[i] !== previousBest && cars[i] !== bestCar) {
      carCtx.globalAlpha = 0.2
      cars[i].draw(carCtx, 'blue')
    }
  }

  // Draw the previousBest and the bestCar last and with full opacity
  carCtx.globalAlpha = 0.75
  if (bestCar === previousBest) {
    previousBest.draw(carCtx, 'green', true)
  } else {
    previousBest.draw(carCtx, 'green')
    bestCar.draw(carCtx, 'blue', true)
  }

  carCtx.restore()

  networkCtx.lineDashOffset = -time / 50
  Visualizer.drawNetwork(networkCtx, bestCar.brain)
  requestAnimationFrame(animate)
}
