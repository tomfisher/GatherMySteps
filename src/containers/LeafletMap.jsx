import React from 'react'
import { connect } from 'react-redux'
import PerfMap from 'map'

const LeafletMap = ({ ...props }) => {
  return <PerfMap {...props} fitBounds={() => {
    const floatContainer = document.querySelector('#float-container')
    const left = floatContainer ? floatContainer.offsetWidth : 0
    return {
      paddingTopLeft: [left, 0]
    }
  }} style={{ height: '100%', zIndex: '1' }} />
}

const mapStateToProps = (state) => {
  const history = state.get('tracks').get('history')
  return {
    map: state.get('map').get('provider'),
    bounds: state.get('map').get('bounds'),
    center: state.get('map').get('center'),
    pointPrompt: state.get('map').get('pointPrompt'),
    highlighted: state.get('map').get('highlighted'),
    highlightedPoints: state.get('map').get('highlightedPoints'),

    segments: state.get('tracks').get('segments'),
    canUndo: history.get('past').count() !== 0,
    canRedo: history.get('future').count() !== 0
  }
}

export default connect(mapStateToProps)(LeafletMap)
