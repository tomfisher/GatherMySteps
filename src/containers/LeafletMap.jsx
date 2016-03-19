import React from 'react'
import { connect } from 'react-redux'
import { Map, ScaleControl, ZoomControl } from 'react-leaflet'
import ChangeMapProvider from '../components/ChangeMapProvider.jsx'
import SelectMapSegment from '../components/SelectMapSegment.jsx'
import TileLayerSelector from '../components/TileLayerSelector.jsx'

import {
  changeMap,
  showDetails,
  hideDetails,
  updateBounds,
  updateInternalBounds
} from '../actions/ui'

import { MAP_STATES } from '../constants'

const segmentStateSelector = (segment) => {
  if (segment.get('editing')) {
    return MAP_STATES.EDITING
  } else if (segment.get('spliting')) {
    return MAP_STATES.SPLITING
  } else if (segment.get('joining')) {
    return MAP_STATES.JOINING
  } else if (segment.get('pointDetails')) {
    return MAP_STATES.POINT_DETAILS
  } else {
    return MAP_STATES.VANILLA
  }
}
/*
const between = (a, b, c) => {
  return a <= b && b <= c
}
/*
const boundsFilter = (ne, sw) => {
  console.log(ne, sw)
  return (point) => {
    const lat = point.get('lat')
    const lon = point.get('lon')
    return between(sw.lat, lat, ne.lat) &&
      between(sw.lng, lon, ne.lng)
  }
}
*/
const boundsFilter = (ne, sw) => {
  return (point) => {
    const lat = point.get('lat')
    const lon = point.get('lon')
    return ne.lat >= lat && lat >= sw.lat &&
      ne.lng >= lon && lon >= sw.lng
  }
}

let LeafletMap = ({bounds, map, segments, details, dispatch}) => {
  let useMaxZoom = false

  bounds = bounds || [{lat: 67.47492238478702, lng: 225}, {lat: -55.17886766328199, lng: -225}]

  const elms = segments.filter((segment) => segment.get('display')).map((segment) => {
    // const sBounds = segment.get('bounds').toJS()
    const filter = boundsFilter(bounds[0], bounds[1])

    const inclusive = true
    const pts = segment.get('points')
    const points = inclusive ? pts.toJS() : pts.filter(filter).toJS()

    const state = segmentStateSelector(segment)
    const color = segment.get('color')
    const id = segment.get('id')
    const trackId = segment.get('trackId')
    const joinPossible = segment.get('joinPossible')
    const metrics = segment.get('metrics')
    if (state !== MAP_STATES.VANILLA) {
      useMaxZoom = true
      /*
      const p = points[(points.length - 1) / 2]
      gBounds = {
        lat: p.lat,
        lon: p.lon
      }
      */
    }
    return SelectMapSegment(points, id, color, trackId, state, joinPossible, metrics, details, dispatch)
  }).toJS()
  const elements = Object.keys(elms).map((e) => elms[e])

  const onZoom = (e) => {
    const zoom = e.target.getZoom()
    const maxZoom = e.target.getMaxZoom()
    if (zoom >= maxZoom && !details) {
      dispatch(showDetails())
    } else if (details) {
      dispatch(hideDetails())
    }
  }

  const onMove = (e) => {
    const bnds = e.target.getBounds()
    const bndObj = [
      {
        lat: bnds._northEast.lat,
        lng: bnds._northEast.lng
      }, {
        lat: bnds._southWest.lat,
        lng: bnds._southWest.lng
      }
    ]
    dispatch(updateInternalBounds(bndObj))
  }

  return (
    <div className='fill' >
      <Map id='map' bounds={bounds} onMoveEnd={onMove} onZoomEnd={onZoom} zoom={ useMaxZoom ? 18 : undefined } zoomControl={false}>
        <ZoomControl position='topright' />
        <ChangeMapProvider mapType={map} onChange={(toType) => dispatch(changeMap(toType))} />
        <ScaleControl position='bottomright' />
        { TileLayerSelector(map) }
        { elements }
      </Map>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    map: state.get('ui').get('map'),
    bounds: state.get('ui').get('bounds'),
    segments: state.get('tracks').get('segments'),
    details: state.get('ui').get('details')
  }
}

LeafletMap = connect(mapStateToProps)(LeafletMap)

export default LeafletMap
