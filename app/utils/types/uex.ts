export interface UexCommodity {
  code: string
  date_added: number
  date_modified: number
  id: number
  id_parent: number
  is_available: number
  is_available_live: number
  is_buggy: number
  is_buyable: number
  is_explosive: number
  is_extractable: number
  is_fuel: number
  is_harvestable: number
  is_illegal: number
  is_inert: number
  is_mineral: number
  is_raw: number
  is_refinable: number
  is_refined: number
  is_sellable: number
  is_temporary: number
  is_visible: number
  is_volatile_qt: number
  is_volatile_time: number
  kind: string
  name: string
  price_buy: number
  price_sell: number
  weight_scu: number
  wiki: string
}

export interface GetCommoditiesOkResponse {
  data: UexCommodity[]
  http_code: number
  message: string
  status: string
}

export interface UexTerminal {
  city_name: string | null
  code: string
  company_name: string
  contact_url: string | null
  date_added: number
  date_modified: number
  faction_name: string
  has_docking_port: number
  has_freight_elevator: number
  has_loading_dock: number
  id: number
  id_city: number
  id_company: number
  id_faction: number
  id_moon: number
  id_orbit: number
  id_outpost: number
  id_planet: number
  id_poi: number
  id_space_station: number
  id_star_system: number
  is_affinity_influenceable: number
  is_auto_load: number
  is_available: number
  is_available_live: number
  is_cargo_center: number
  is_default_system: number
  is_food: number
  is_habitation: number
  is_jump_point: number
  is_medical: number
  is_nqa: number
  is_player_owned: number
  is_refinery: number
  is_refuel: number
  is_repair: number
  is_shop_fps: number
  is_shop_vehicle: number
  is_visible: number
  max_container_size: number
  mcs: number
  moon_name: string | null
  name: string
  nickname: string
  displayname: string
  fullname: string
  orbit_name: string
  outpost_name: string | null
  planet_name: string
  space_station_name: string | null
  star_system_name: string
  type: string
}

export interface GetTerminalsOkResponse {
  data: UexTerminal[]
  http_code: number
  message: string
  status: string
}

export interface UexCommodityPriceByTerminal {
  city_name: string
  commodity_code: string
  commodity_name: string
  commodity_slug: string
  container_sizes: string
  date_added: number
  date_modified: number
  faction_affinity: number
  faction_name: string
  game_version: string
  id: number
  id_city: number
  id_commodity: number
  id_faction: number
  id_moon: number
  id_orbit: number
  id_outpost: number
  id_planet: number
  id_poi: number
  id_star_system: number
  id_terminal: number
  moon_name: Record<string, unknown> | null
  orbit_name: string
  outpost_name: Record<string, unknown> | null
  planet_name: string
  poi_name: Record<string, unknown> | null
  price_buy: number
  price_buy_avg: number
  price_buy_avg_month: number
  price_buy_avg_week: number
  price_buy_max: number
  price_buy_max_month: number
  price_buy_max_week: number
  price_buy_min: number
  price_buy_min_month: number
  price_buy_min_week: number
  price_buy_users: number
  price_buy_users_rows: number
  price_sell: number
  price_sell_avg: number
  price_sell_avg_month: number
  price_sell_avg_week: number
  price_sell_max: number
  price_sell_max_month: number
  price_sell_max_week: number
  price_sell_min: number
  price_sell_min_month: number
  price_sell_min_week: number
  price_sell_users: number
  price_sell_users_rows: number
  scu_buy: number
  scu_buy_avg: number
  scu_buy_avg_month: number
  scu_buy_avg_week: number
  scu_buy_max: number
  scu_buy_max_month: number
  scu_buy_max_week: number
  scu_buy_min: number
  scu_buy_min_month: number
  scu_buy_min_week: number
  scu_buy_users: number
  scu_buy_users_rows: number
  scu_sell: number
  scu_sell_avg: number
  scu_sell_avg_month: number
  scu_sell_avg_week: number
  scu_sell_max: number
  scu_sell_max_month: number
  scu_sell_max_week: number
  scu_sell_min: number
  scu_sell_min_month: number
  scu_sell_min_week: number
  scu_sell_stock: number
  scu_sell_stock_avg: number
  scu_sell_stock_avg_month: number
  scu_sell_stock_avg_week: number
  scu_sell_users: number
  scu_sell_users_rows: number
  space_station_name: Record<string, unknown> | null
  star_system_name: string
  status_buy: number
  status_buy_avg: number
  status_buy_avg_month: number
  status_buy_avg_week: number
  status_buy_max: number
  status_buy_max_month: number
  status_buy_max_week: number
  status_buy_min: number
  status_buy_min_month: number
  status_buy_min_week: number
  status_sell: number
  status_sell_avg: number
  status_sell_avg_month: number
  status_sell_avg_week: number
  status_sell_max: number
  status_sell_max_month: number
  status_sell_max_week: number
  status_sell_min: number
  status_sell_min_month: number
  status_sell_min_week: number
  terminal_code: string
  terminal_is_player_owned: number
  terminal_mcs: number
  terminal_name: string
  terminal_slug: string
  volatility_buy: number
  volatility_price_buy: number
  volatility_price_sell: number
  volatility_scu_buy: number
  volatility_scu_sell: number
  volatility_sell: number
}

export interface GetCommoditiesPricesByTerminalOkResponse {
  data: UexCommodityPriceByTerminal[]
  http_code: number
  message: string
  status: string
}
