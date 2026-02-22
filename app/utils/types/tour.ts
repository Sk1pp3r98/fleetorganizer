export interface TradeEntry {
  location: string
  commodity: string
  price: number
  amount: number
}

export interface CostEntry {
  location: string
  costName: string
  price: number
}

export interface Tour {
  id: number
  show: boolean
  name: string
  buys: TradeEntry[]
  sells: TradeEntry[]
  costs: CostEntry[]
}
