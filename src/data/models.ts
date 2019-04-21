export interface Item {
  uid: string // generated, unique
  id: string
  name: string
  description: string
  type: 'tool' | 'item' // maybe not needed
  action: 'scavenge' | 'hunt' | 'craft'
  value: {
    food: number
    water: number
    energy: number
  }
  risk: number
  consumable: boolean
  daysToPerish: number // 0 for non perishable items
  usesUntilBreakdown: number // 0 for non degrading items
  // probability of being found (will depend on area)
}

export interface Consumable {
  uid: string // generated, unique
  id: string
  name: string
  description: string
  action: 'scavenge' | 'hunt' | 'craft'
  value: {
    food: number
    water: number
    energy: number
  }
  risk: number
  daysToPerish: number // 0 for non perishable items
}

export interface Object {
  // tool or junk
  uid: string // generated, unique
  id: string
  name: string
  description: string
  action: 'scavenge' | 'hunt' | 'craft'
  usesUntilBreakdown: number // 0 for non degrading items
}

// const equipment = {
//   uid: string, // generated, unique
//   id: string,
//   name: string,
//   description: string,
//   stats: {} // to be defined
// }

// const upgrade = {
//   id: string,
//   name: string,
//   description: string,
//   itemsNeeded: [item.id],
//   toolsNeeded: [item.id]
// }

// const recipe = {
//   itemsNeeded: [item.id],
//   result: [item.id],
//   toolsNeeded: [item.id],
//   upgradesNeeded: [upgrade.id],
//   category: 'consumable | weapon | tool | medicine'
// }
