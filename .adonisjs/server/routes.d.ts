import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'experience': { paramsTuple?: []; params?: {} }
    'projects': { paramsTuple?: []; params?: {} }
    'projects.king_mayo': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'experience': { paramsTuple?: []; params?: {} }
    'projects': { paramsTuple?: []; params?: {} }
    'projects.king_mayo': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'experience': { paramsTuple?: []; params?: {} }
    'projects': { paramsTuple?: []; params?: {} }
    'projects.king_mayo': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}