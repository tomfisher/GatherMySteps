export const useOSMMaps = () => {
  return {
    type: 'USE_OSM_MAPS'
  }
}

export const useGoogleRoadMaps = () => {
  return {
    type: 'USE_GOOGLE_ROAD_MAPS'
  }
}

export const useGoogleTerrainMaps = () => {
  return {
    type: 'USE_GOOGLE_TERRAIN_MAPS'
  }
}

export const useGoogleHybridMaps = () => {
  return {
    type: 'USE_GOOGLE_HYBRID_MAPS'
  }
}

export const useGoogleSatelliteMaps = () => {
  return {
    type: 'USE_GOOGLE_SATTELITE_MAPS'
  }
}

export const changeMap = (newType) => {
  return {
    type: 'CHANGE_MAP',
    to: newType
  }
}

export const updateBounds = (bounds) => {
  return {
    bounds,
    type: 'UPDATE_BOUNDS'
  }
}

export const hideDetails = () => {
  return {
    type: 'HIDE_TRACK_DETAILS'
  }
}
export const showDetails = () => {
  return {
    type: 'SHOW_TRACK_DETAILS'
  }
}
