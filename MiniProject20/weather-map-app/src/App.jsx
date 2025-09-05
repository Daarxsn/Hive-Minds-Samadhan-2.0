import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
})

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e)
    }
  })
  return null
}

export default function App() {
  const [pos, setPos] = useState({ lat: 28.6139, lon: 77.2090 })
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [cityInput, setCityInput] = useState('')
  const [loading, setLoading] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    fetchAll(pos.lat, pos.lon)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchAll(lat, lon) {
    if (!API_KEY) return
    setLoading(true)
    try {
      const wR = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      const wJ = await wR.json()
      setWeather(wJ)

      const fR = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      const fJ = await fR.json()
      setForecast(extractDailyForecast(fJ))
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  function extractDailyForecast(forecastJson) {
    if (!forecastJson || !forecastJson.list) return []
    const byDate = {}
    forecastJson.list.forEach(item => {
      const [date] = item.dt_txt.split(' ')
      if (!byDate[date]) byDate[date] = []
      byDate[date].push(item)
    })

    return Object.keys(byDate)
      .slice(1, 6)
      .map(date => byDate[date][0])
  }

  function handleMapClick(e) {
    const { lat, lng } = e.latlng
    setPos({ lat, lon: lng })
    if (mapRef.current) mapRef.current.setView([lat, lng], mapRef.current.getZoom())
    fetchAll(lat, lng)
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) return alert('Geolocation not supported')
    navigator.geolocation.getCurrentPosition((p) => {
      const { latitude, longitude } = p.coords
      setPos({ lat: latitude, lon: longitude })
      if (mapRef.current) mapRef.current.setView([latitude, longitude], mapRef.current.getZoom())
      fetchAll(latitude, longitude)
    })
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!cityInput) return
    try {
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityInput)}&limit=1&appid=${API_KEY}`)
      const geoJson = await geoRes.json()
      if (!geoJson[0]) return alert('City not found')
      const { lat, lon } = geoJson[0]
      setPos({ lat, lon })
      if (mapRef.current) mapRef.current.setView([lat, lon], mapRef.current.getZoom())
      fetchAll(lat, lon)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center py-6 px-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-sky-800 drop-shadow">Weather + Maps 🌦</h1>
        <p className="text-sky-700 mt-2">Search or click the map to explore live weather forecasts anywhere</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* MAP CARD */}
        <section className="rounded-2xl shadow-lg overflow-hidden border border-sky-200">
          <MapContainer
            whenCreated={map => { mapRef.current = map }}
            center={[pos.lat, pos.lon]}
            zoom={10}
            style={{ height: '100%', minHeight: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[pos.lat, pos.lon]}>
              <Popup>
                {weather ? `${weather.name || 'Location'} — ${Math.round(weather.main.temp)}°C` : 'Location'}
              </Popup>
            </Marker>
            <MapClickHandler onClick={handleMapClick} />
          </MapContainer>
        </section>

        {/* WEATHER CARD */}
        <section className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              className="flex-grow p-2 rounded-xl border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="🔍 Search city (e.g. London)"
            />
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl transition">Search</button>
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="bg-white border border-sky-400 text-sky-700 px-4 py-2 rounded-xl hover:bg-sky-50 transition"
            >
              📍 My location
            </button>
          </form>

          <div className="flex-grow space-y-4">
            {loading && <div className="text-center text-sky-600">Loading weather...</div>}
            
            {weather && (
              <div className="flex items-center gap-4 bg-sky-50 rounded-xl p-4 shadow-inner">
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" />
                <div>
                  <h2 className="text-2xl font-bold text-sky-800">{weather.name || 'Location'}</h2>
                  <p className="text-4xl font-extrabold text-sky-900">{Math.round(weather.main.temp)}°C</p>
                  <p className="text-sm text-sky-700">{weather.weather[0].description} • Humidity: {weather.main.humidity}% • Wind: {weather.wind.speed} m/s</p>
                </div>
              </div>
            )}

            {/* FORECAST */}
            <div>
              <h3 className="text-lg font-semibold text-sky-800 mb-2">📅 Next Days</h3>
              <div className="grid grid-cols-2 gap-3">
                {forecast.map((f, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-sky-100 to-sky-200 p-3 rounded-xl shadow">
                    <div className="font-medium text-sky-900">{new Date(f.dt * 1000).toLocaleDateString()}</div>
                    <div className="text-2xl font-bold text-sky-800">{Math.round(f.main.temp)}°C</div>
                    <div className="text-sm text-sky-700">{f.weather[0].description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-6 text-xs text-sky-700 text-center">
        Built with <span className="font-semibold">React + Vite + Tailwind + Leaflet + OpenWeather</span>
      </footer>
    </div>
  )
}