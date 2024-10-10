import React from 'react'
import { Map, Source, Layer } from 'react-map-gl'
import { useQuery } from '@tanstack/react-query'
import { fetchGpsSessions } from '../services/gpsApi'
import {
  MAP_ACCESS_TOKEN,
  MAP_STYLE,
  defaultInitialViewState,
} from '../constants'
import './MapGrid.scss'

// Function to convert latitude/longitude arrays into GeoJSON
const convertToGeoJSON = (latitude: number, longitude: number): any => {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [latitude, longitude],
        },
        properties: {},
      },
    ],
  }
}

const MapGrid = () => {
  const {
    data: gpsSessions,
    isLoading,
    error,
  } = useQuery(['gpsSessions'], fetchGpsSessions)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading GPS sessions</div>

  const sessions = gpsSessions || []

  return (
    <div className="map-grid">
      {sessions.map((session) => (
        <div key={session.id} className="map-container">
          <Map
            initialViewState={defaultInitialViewState}
            style={{ width: '100%', height: 300 }}
            mapStyle={MAP_STYLE}
            mapboxAccessToken={MAP_ACCESS_TOKEN}
          >
            <Source
              id={`session-${session.id}`}
              type="geojson"
              data={convertToGeoJSON(session.latitude, session.longitude)}
            >
              <Layer
                id={`route-${session.id}`}
                type="line"
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round',
                }}
                paint={{
                  'line-color': '#ff0000',
                  'line-width': 4,
                }}
              />
            </Source>
          </Map>
          <div className="session-info">Session ID: {session.sessionId}</div>
        </div>
      ))}
    </div>
  )
}

export default MapGrid
