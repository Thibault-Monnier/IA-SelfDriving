function lerp(A, B, t) {
  return A + (B - A) * t
}

function getIntersection(a1, a2, b1, b2) {
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

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j = 1) % poly2.length]
      )
      if (touch) return true
    }
  }
  return false
}
