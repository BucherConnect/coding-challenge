import axios from 'axios'
import { API_BASE_URL } from '../constants'

export interface GpsSession {
  id: string
  latitude: number
  longitude: number
  sessionId: string
}

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const fetchGpsSessions = async (): Promise<GpsSession[]> => {
  const response = await api.get<GpsSession[]>('/gps-position')
  return response.data
}
