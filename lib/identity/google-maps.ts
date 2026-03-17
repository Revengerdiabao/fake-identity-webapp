// Google Maps Geocoding integration for realistic addresses
// Requires GOOGLE_MAPS_API_KEY env variable

export type GoogleAddress = {
  street: string
  city: string
  state: string
  zip: string
}

// Center coordinates + randomization radius for ALL 200+ countries
const countryCoords: Record<string, { lat: number; lng: number; radius: number }> = {
  // Asia
  AF: { lat: 33.9, lng: 67.7, radius: 4 },
  AM: { lat: 40.0, lng: 45.0, radius: 1 },
  AZ: { lat: 40.1, lng: 47.5, radius: 2 },
  BH: { lat: 26.0, lng: 50.5, radius: 0.2 },
  BD: { lat: 23.6, lng: 90.3, radius: 2 },
  BT: { lat: 27.5, lng: 90.4, radius: 0.5 },
  BN: { lat: 4.5, lng: 114.7, radius: 0.3 },
  KH: { lat: 12.5, lng: 104.9, radius: 2 },
  CN: { lat: 35.8, lng: 104.1, radius: 10 },
  GE: { lat: 42.3, lng: 43.3, radius: 1.5 },
  IN: { lat: 20.5, lng: 78.9, radius: 8 },
  ID: { lat: -0.7, lng: 113.9, radius: 8 },
  IR: { lat: 32.4, lng: 53.6, radius: 5 },
  IQ: { lat: 33.2, lng: 43.6, radius: 4 },
  IL: { lat: 31.0, lng: 34.8, radius: 1 },
  JP: { lat: 36.2, lng: 138.2, radius: 3 },
  JO: { lat: 30.5, lng: 36.2, radius: 1.5 },
  KZ: { lat: 48.0, lng: 66.9, radius: 8 },
  KW: { lat: 29.3, lng: 47.4, radius: 0.5 },
  KG: { lat: 41.2, lng: 74.7, radius: 2 },
  LA: { lat: 19.8, lng: 102.4, radius: 2 },
  LB: { lat: 33.8, lng: 35.8, radius: 0.5 },
  MY: { lat: 4.2, lng: 101.9, radius: 3 },
  MV: { lat: 3.2, lng: 73.2, radius: 1 },
  MN: { lat: 46.8, lng: 103.8, radius: 5 },
  MM: { lat: 19.7, lng: 96.1, radius: 4 },
  NP: { lat: 28.3, lng: 84.1, radius: 2 },
  KP: { lat: 40.3, lng: 127.5, radius: 2 },
  KR: { lat: 35.9, lng: 127.7, radius: 2 },
  OM: { lat: 21.4, lng: 55.9, radius: 3 },
  PK: { lat: 30.3, lng: 69.3, radius: 4 },
  PS: { lat: 31.9, lng: 35.2, radius: 0.5 },
  PH: { lat: 12.8, lng: 121.7, radius: 3 },
  QA: { lat: 25.3, lng: 51.1, radius: 0.5 },
  SA: { lat: 23.8, lng: 45.0, radius: 5 },
  SG: { lat: 1.3, lng: 103.8, radius: 0.2 },
  LK: { lat: 7.8, lng: 80.7, radius: 1.5 },
  SY: { lat: 34.8, lng: 38.9, radius: 2 },
  TW: { lat: 23.6, lng: 120.9, radius: 1 },
  TJ: { lat: 38.8, lng: 71.2, radius: 2 },
  TH: { lat: 15.8, lng: 100.9, radius: 4 },
  TL: { lat: -8.8, lng: 125.7, radius: 0.5 },
  TM: { lat: 38.9, lng: 59.5, radius: 3 },
  AE: { lat: 24.4, lng: 54.6, radius: 1 },
  UZ: { lat: 41.3, lng: 64.5, radius: 3 },
  VN: { lat: 14.0, lng: 108.2, radius: 4 },
  YE: { lat: 15.5, lng: 48.5, radius: 3 },
  HK: { lat: 22.3, lng: 114.1, radius: 0.3 },
  MO: { lat: 22.1, lng: 113.5, radius: 0.1 },

  // Europe
  AL: { lat: 41.1, lng: 20.1, radius: 1 },
  AD: { lat: 42.5, lng: 1.5, radius: 0.1 },
  AT: { lat: 47.5, lng: 14.5, radius: 2 },
  BY: { lat: 53.7, lng: 27.9, radius: 3 },
  BE: { lat: 50.8, lng: 4.3, radius: 1 },
  BA: { lat: 43.9, lng: 17.6, radius: 1.5 },
  BG: { lat: 42.7, lng: 25.4, radius: 1.5 },
  HR: { lat: 45.1, lng: 15.2, radius: 1.5 },
  CY: { lat: 35.1, lng: 33.4, radius: 0.5 },
  CZ: { lat: 49.8, lng: 15.4, radius: 1.5 },
  DK: { lat: 56.2, lng: 9.5, radius: 1.5 },
  EE: { lat: 58.5, lng: 25.0, radius: 1 },
  FI: { lat: 61.9, lng: 25.7, radius: 3 },
  FR: { lat: 46.6, lng: 2.2, radius: 3 },
  DE: { lat: 51.1, lng: 10.4, radius: 3 },
  GR: { lat: 39.0, lng: 21.8, radius: 2 },
  HU: { lat: 47.1, lng: 19.5, radius: 1.5 },
  IS: { lat: 64.9, lng: -19.0, radius: 2 },
  IE: { lat: 53.4, lng: -8.2, radius: 1.5 },
  IT: { lat: 41.9, lng: 12.5, radius: 3 },
  LV: { lat: 56.8, lng: 24.3, radius: 1.5 },
  LI: { lat: 47.1, lng: 9.5, radius: 0.1 },
  LT: { lat: 55.1, lng: 23.8, radius: 1.5 },
  LU: { lat: 49.8, lng: 6.1, radius: 0.3 },
  MT: { lat: 35.9, lng: 14.3, radius: 0.1 },
  MD: { lat: 47.4, lng: 28.3, radius: 1 },
  MC: { lat: 43.7, lng: 7.4, radius: 0.05 },
  ME: { lat: 42.7, lng: 19.3, radius: 0.5 },
  NL: { lat: 52.1, lng: 5.3, radius: 1 },
  MK: { lat: 41.5, lng: 21.7, radius: 0.5 },
  NO: { lat: 60.4, lng: 8.4, radius: 3 },
  PL: { lat: 51.9, lng: 19.1, radius: 3 },
  PT: { lat: 39.3, lng: -8.2, radius: 2 },
  RO: { lat: 45.9, lng: 24.9, radius: 2 },
  RU: { lat: 55.7, lng: 37.6, radius: 10 },
  SM: { lat: 43.9, lng: 12.4, radius: 0.05 },
  RS: { lat: 44.0, lng: 21.0, radius: 1.5 },
  SK: { lat: 48.6, lng: 19.6, radius: 1 },
  SI: { lat: 46.1, lng: 14.9, radius: 0.5 },
  ES: { lat: 40.4, lng: -3.7, radius: 3 },
  SE: { lat: 60.1, lng: 18.6, radius: 3 },
  CH: { lat: 46.8, lng: 8.2, radius: 1 },
  TR: { lat: 38.9, lng: 35.2, radius: 5 },
  UA: { lat: 48.3, lng: 31.1, radius: 4 },
  GB: { lat: 51.5, lng: -0.1, radius: 2 },
  VA: { lat: 41.9, lng: 12.4, radius: 0.01 },
  XK: { lat: 42.5, lng: 20.9, radius: 0.5 },
  GI: { lat: 36.1, lng: -5.3, radius: 0.02 },
  GL: { lat: 71.7, lng: -42.6, radius: 5 },
  FO: { lat: 61.9, lng: -6.9, radius: 0.3 },

  // North America
  AG: { lat: 17.0, lng: -61.7, radius: 0.1 },
  BS: { lat: 25.0, lng: -77.3, radius: 1 },
  BB: { lat: 13.1, lng: -59.5, radius: 0.1 },
  BZ: { lat: 17.1, lng: -88.4, radius: 1 },
  CA: { lat: 56.1, lng: -106.3, radius: 10 },
  CR: { lat: 9.7, lng: -83.7, radius: 1 },
  CU: { lat: 21.5, lng: -77.7, radius: 2 },
  DM: { lat: 15.4, lng: -61.3, radius: 0.1 },
  DO: { lat: 18.7, lng: -70.1, radius: 1 },
  SV: { lat: 13.7, lng: -88.8, radius: 0.5 },
  GD: { lat: 12.1, lng: -61.6, radius: 0.1 },
  GT: { lat: 15.7, lng: -90.2, radius: 1.5 },
  HT: { lat: 18.9, lng: -72.2, radius: 0.8 },
  HN: { lat: 15.1, lng: -86.2, radius: 1.5 },
  JM: { lat: 18.1, lng: -77.2, radius: 0.5 },
  MX: { lat: 23.6, lng: -102.5, radius: 5 },
  NI: { lat: 12.8, lng: -85.2, radius: 1.5 },
  PA: { lat: 8.5, lng: -80.7, radius: 1.5 },
  KN: { lat: 17.3, lng: -62.7, radius: 0.05 },
  LC: { lat: 13.9, lng: -60.9, radius: 0.1 },
  VC: { lat: 12.9, lng: -61.2, radius: 0.1 },
  TT: { lat: 10.6, lng: -61.2, radius: 0.3 },
  US: { lat: 39.8, lng: -98.5, radius: 10 },
  PR: { lat: 18.2, lng: -66.5, radius: 0.5 },
  GU: { lat: 13.4, lng: 144.7, radius: 0.2 },
  VI: { lat: 18.3, lng: -64.8, radius: 0.1 },
  AS: { lat: -14.2, lng: -170.1, radius: 0.1 },
  BM: { lat: 32.3, lng: -64.7, radius: 0.05 },
  KY: { lat: 19.5, lng: -80.5, radius: 0.1 },
  CW: { lat: 12.1, lng: -68.9, radius: 0.1 },
  AW: { lat: 12.5, lng: -69.9, radius: 0.05 },

  // South America
  AR: { lat: -38.4, lng: -63.6, radius: 8 },
  BO: { lat: -16.2, lng: -63.5, radius: 4 },
  BR: { lat: -14.2, lng: -51.9, radius: 10 },
  CL: { lat: -35.6, lng: -71.5, radius: 5 },
  CO: { lat: 4.5, lng: -74.2, radius: 4 },
  EC: { lat: -1.8, lng: -78.1, radius: 2 },
  GY: { lat: 4.8, lng: -58.9, radius: 2 },
  PY: { lat: -23.4, lng: -58.4, radius: 3 },
  PE: { lat: -9.1, lng: -75.0, radius: 5 },
  SR: { lat: 3.9, lng: -56.0, radius: 1.5 },
  UY: { lat: -32.5, lng: -55.7, radius: 2 },
  VE: { lat: 6.4, lng: -66.5, radius: 4 },
  GF: { lat: 3.9, lng: -53.1, radius: 1 },

  // Africa
  DZ: { lat: 28.0, lng: 1.6, radius: 5 },
  AO: { lat: -11.2, lng: 17.8, radius: 5 },
  BJ: { lat: 9.3, lng: 2.3, radius: 1.5 },
  BW: { lat: -22.3, lng: 24.6, radius: 3 },
  BF: { lat: 12.3, lng: -1.5, radius: 2 },
  BI: { lat: -3.3, lng: 29.9, radius: 0.5 },
  CV: { lat: 16.0, lng: -24.0, radius: 0.5 },
  CM: { lat: 7.3, lng: 12.3, radius: 3 },
  CF: { lat: 6.6, lng: 20.9, radius: 3 },
  TD: { lat: 15.4, lng: 18.7, radius: 5 },
  KM: { lat: -11.8, lng: 43.8, radius: 0.3 },
  CG: { lat: -0.2, lng: 15.8, radius: 3 },
  CD: { lat: -4.0, lng: 21.7, radius: 5 },
  CI: { lat: 7.5, lng: -5.5, radius: 2 },
  DJ: { lat: 11.8, lng: 42.5, radius: 0.5 },
  EG: { lat: 26.8, lng: 30.8, radius: 4 },
  GQ: { lat: 1.6, lng: 10.2, radius: 0.5 },
  ER: { lat: 15.1, lng: 39.7, radius: 2 },
  SZ: { lat: -26.5, lng: 31.4, radius: 0.5 },
  ET: { lat: 9.1, lng: 40.4, radius: 4 },
  GA: { lat: -0.8, lng: 11.6, radius: 2 },
  GM: { lat: 13.4, lng: -15.3, radius: 0.5 },
  GH: { lat: 7.9, lng: -1.0, radius: 2 },
  GN: { lat: 9.9, lng: -11.4, radius: 2 },
  GW: { lat: 11.8, lng: -15.1, radius: 0.5 },
  KE: { lat: -0.0, lng: 37.9, radius: 3 },
  LS: { lat: -29.6, lng: 28.2, radius: 0.5 },
  LR: { lat: 6.4, lng: -9.4, radius: 1.5 },
  LY: { lat: 26.3, lng: 17.2, radius: 5 },
  MG: { lat: -18.7, lng: 46.8, radius: 3 },
  MW: { lat: -13.2, lng: 34.3, radius: 2 },
  ML: { lat: 17.5, lng: -3.9, radius: 4 },
  MR: { lat: 21.0, lng: -10.9, radius: 4 },
  MU: { lat: -20.3, lng: 57.5, radius: 0.3 },
  MA: { lat: 31.7, lng: -7.0, radius: 3 },
  MZ: { lat: -18.6, lng: 35.5, radius: 4 },
  NA: { lat: -22.9, lng: 18.4, radius: 4 },
  NE: { lat: 17.6, lng: 8.0, radius: 4 },
  NG: { lat: 9.0, lng: 8.6, radius: 4 },
  RW: { lat: -1.9, lng: 29.8, radius: 0.5 },
  ST: { lat: 0.1, lng: 6.6, radius: 0.2 },
  SN: { lat: 14.4, lng: -14.4, radius: 2 },
  SC: { lat: -4.6, lng: 55.4, radius: 0.2 },
  SL: { lat: 8.4, lng: -11.7, radius: 1.5 },
  SO: { lat: 5.1, lng: 46.1, radius: 4 },
  ZA: { lat: -30.5, lng: 22.9, radius: 5 },
  SS: { lat: 6.8, lng: 31.3, radius: 3 },
  SD: { lat: 12.8, lng: 30.2, radius: 5 },
  TZ: { lat: -6.3, lng: 34.8, radius: 4 },
  TG: { lat: 8.6, lng: 0.8, radius: 1 },
  TN: { lat: 33.8, lng: 9.5, radius: 2 },
  UG: { lat: 1.3, lng: 32.2, radius: 2 },
  ZM: { lat: -13.1, lng: 27.8, radius: 4 },
  ZW: { lat: -19.0, lng: 29.1, radius: 2 },
  RE: { lat: -21.1, lng: 55.5, radius: 0.2 },
  YT: { lat: -12.8, lng: 45.1, radius: 0.1 },

  // Oceania
  AU: { lat: -25.2, lng: 133.7, radius: 10 },
  FJ: { lat: -17.7, lng: 178.0, radius: 1 },
  KI: { lat: 1.8, lng: -157.3, radius: 1 },
  MH: { lat: 7.1, lng: 171.1, radius: 0.5 },
  FM: { lat: 6.8, lng: 158.2, radius: 2 },
  NR: { lat: -0.5, lng: 166.9, radius: 0.05 },
  NZ: { lat: -40.9, lng: 174.8, radius: 3 },
  PW: { lat: 7.5, lng: 134.5, radius: 0.3 },
  PG: { lat: -6.3, lng: 143.9, radius: 3 },
  WS: { lat: -13.7, lng: -172.1, radius: 0.3 },
  SB: { lat: -9.6, lng: 160.1, radius: 2 },
  TO: { lat: -21.1, lng: -175.2, radius: 0.3 },
  TV: { lat: -7.1, lng: 177.6, radius: 0.1 },
  VU: { lat: -15.3, lng: 166.9, radius: 1 },
  NC: { lat: -20.9, lng: 165.6, radius: 1 },
  PF: { lat: -17.6, lng: -149.4, radius: 2 },

  // French overseas
  GP: { lat: 16.2, lng: -61.5, radius: 0.2 },
  MQ: { lat: 14.6, lng: -61.0, radius: 0.2 },
}

function randomInRange(center: number, radius: number): number {
  return center + (Math.random() - 0.5) * 2 * radius
}

export async function fetchGoogleAddress(countryCode: string): Promise<GoogleAddress | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  const coords = countryCoords[countryCode]
  if (!coords) {
    // For countries without predefined coords, use country-code based geocoding
    return fetchGoogleAddressByCountryName(countryCode, apiKey)
  }

  const lat = randomInRange(coords.lat, coords.radius)
  const lng = randomInRange(coords.lng, coords.radius)

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&result_type=street_address|route|premise&language=en`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await res.json()

    if (data.status !== 'OK' || !data.results?.length) return null

    return parseGeocodingResult(data.results[0])
  } catch {
    return null
  }
}

async function fetchGoogleAddressByCountryName(countryCode: string, apiKey: string): Promise<GoogleAddress | null> {
  try {
    // First geocode the country to get coordinates, then reverse geocode a random point
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?components=country:${countryCode}&key=${apiKey}`
    const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(5000) })
    const geoData = await geoRes.json()

    if (geoData.status !== 'OK' || !geoData.results?.length) return null

    const loc = geoData.results[0].geometry.location
    const viewport = geoData.results[0].geometry.viewport

    // Calculate radius from viewport
    const latRadius = viewport ? Math.abs(viewport.northeast.lat - viewport.southwest.lat) / 4 : 1
    const lngRadius = viewport ? Math.abs(viewport.northeast.lng - viewport.southwest.lng) / 4 : 1

    const lat = randomInRange(loc.lat, latRadius)
    const lng = randomInRange(loc.lng, lngRadius)

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&result_type=street_address|route|premise&language=en`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await res.json()

    if (data.status !== 'OK' || !data.results?.length) return null

    return parseGeocodingResult(data.results[0])
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseGeocodingResult(result: any): GoogleAddress {
  const components = result.address_components || []

  let streetNumber = ''
  let route = ''
  let city = ''
  let state = ''
  let zip = ''

  for (const comp of components) {
    const types: string[] = comp.types
    if (types.includes('street_number')) {
      streetNumber = comp.long_name
    } else if (types.includes('route')) {
      route = comp.long_name
    } else if (types.includes('locality') || types.includes('postal_town')) {
      city = comp.long_name
    } else if (types.includes('administrative_area_level_1')) {
      state = comp.long_name
    } else if (types.includes('postal_code')) {
      zip = comp.long_name
    }
    // Fallback for city
    if (!city && types.includes('sublocality_level_1')) {
      city = comp.long_name
    }
  }

  const street = streetNumber && route
    ? `${streetNumber} ${route}`
    : route || streetNumber || result.formatted_address?.split(',')[0] || ''

  return { street, city, state, zip }
}
