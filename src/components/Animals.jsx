import Animal from './Animal'

const HERD = [
  { id: 1,  type: 'cow',     startPosition: [6,  0,  4]  },
  { id: 2,  type: 'cow',     startPosition: [-9, 0,  7]  },
  { id: 3,  type: 'cow',     startPosition: [14, 0, -3]  },
  { id: 4,  type: 'pig',     startPosition: [3,  0, -8]  },
  { id: 5,  type: 'pig',     startPosition: [-6, 0,  12] },
  { id: 6,  type: 'pig',     startPosition: [10, 0,  10] },
  { id: 7,  type: 'sheep',   startPosition: [-13, 0, -5] },
  { id: 8,  type: 'sheep',   startPosition: [4,  0, -15] },
  { id: 9,  type: 'sheep',   startPosition: [-4, 0,  5]  },
  { id: 10, type: 'chicken', startPosition: [8,  0, -6]  },
  { id: 11, type: 'chicken', startPosition: [-7, 0, -10] },
  { id: 12, type: 'chicken', startPosition: [1,  0,  9]  },
]

export default function Animals() {
  return (
    <>
      {HERD.map((a) => (
        <Animal key={a.id} type={a.type} startPosition={a.startPosition} />
      ))}
    </>
  )
}
