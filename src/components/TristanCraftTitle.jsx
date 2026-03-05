import { useMemo } from 'react'

// 5-tall pixel font. '#' = filled block, '.' = empty.
const FONT = {
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  S: ['.##', '#..', '.##', '..#', '##.'],
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  N: ['#..#', '##.#', '#.##', '#..#', '#..#'],
  C: ['.##', '#..', '#..', '#..', '.##'],
  F: ['###', '#..', '##.', '#..', '#..'],
}

// One vivid color per letter across TRISTANCRAFT
const LETTER_COLORS = [
  '#ff3333', // T
  '#ff7700', // R
  '#ffee00', // I
  '#33dd33', // S
  '#00bbff', // T
  '#4455ff', // A
  '#cc33ff', // N
  '#ff33cc', // C
  '#ff5577', // R
  '#ffaa00', // A
  '#aaff00', // F
  '#00ffbb', // T
]

function buildRow(word, colorOffset, xStart, zStart) {
  const blocks = []
  let xOff = 0
  word.split('').forEach((ch, i) => {
    const rows = FONT[ch]
    if (!rows) { xOff += 4; return }
    const w = rows[0].length
    const color = LETTER_COLORS[colorOffset + i]
    rows.forEach((rowStr, r) => {
      rowStr.split('').forEach((px, c) => {
        if (px === '#') {
          blocks.push({ x: xStart + xOff + c, z: zStart + r, color })
        }
      })
    })
    xOff += w + 1 // letter width + 1 gap
  })
  return blocks
}

export default function TristanCraftTitle() {
  const blocks = useMemo(() => {
    // TRISTAN: T(3)+R(3)+I(3)+S(3)+T(3)+A(3)+N(4) + 6 gaps = 28 wide → center at x=-14
    const row1 = buildRow('TRISTAN', 0, -14, -5)
    // CRAFT:   C(3)+R(3)+A(3)+F(3)+T(3) + 4 gaps = 19 wide → center at x=-9
    const row2 = buildRow('CRAFT', 7, -9, 2)
    return [...row1, ...row2]
  }, [])

  return (
    <>
      {blocks.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, 0.5, b.z]}
          castShadow
          receiveShadow
          raycast={() => null}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={0.35}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      ))}
    </>
  )
}
