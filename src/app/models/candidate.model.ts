export interface Candidate {
  id: number
  name: string
  email: string
  age: number
  city: string
  image: string
  hobbies: string
  summary: string
  applicationDate: string
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface LocationData {
  city: string
  count: number
  lat: number
  lng: number
}

export interface VisitData {
  date: string
  visits: number
  registrations: number
}
