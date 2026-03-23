import { faker, Faker } from '@faker-js/faker'
import {
  fakerEN_US, fakerEN_GB, fakerEN_AU, fakerEN_IN, fakerEN_CA,
  fakerEN_HK, fakerEN_IE, fakerEN_ZA, fakerEN_GH,
  fakerEN_NG, fakerEN,
  fakerJA, fakerZH_CN, fakerZH_TW,
  fakerFR, fakerFR_BE, fakerFR_CA, fakerFR_CH, fakerFR_LU, fakerFR_SN,
  fakerDE, fakerDE_AT, fakerDE_CH,
  fakerIT, fakerPT_BR, fakerPT_PT,
  fakerKO, fakerRU, fakerES, fakerES_MX,
  fakerNL, fakerNL_BE,
  fakerSV, fakerNB_NO, fakerPL,
  fakerAR, fakerAZ, fakerCS_CZ, fakerDA, fakerEL, fakerFA,
  fakerFI, fakerHE, fakerHR, fakerHU, fakerHY,
  fakerID_ID, fakerKA_GE, fakerLV, fakerMK, fakerNE,
  fakerRO, fakerRO_MD, fakerSK, fakerSR_RS_latin,
  fakerTH, fakerTR, fakerUK, fakerUR, fakerVI,
} from '@faker-js/faker'
import type { FakeProfile } from './types'
import { countryConfigs } from './config'

const localeMap: Record<string, Faker> = {
  en: fakerEN, en_US: fakerEN_US, en_GB: fakerEN_GB, en_AU: fakerEN_AU,
  en_IN: fakerEN_IN, en_CA: fakerEN_CA, en_HK: fakerEN_HK, en_IE: fakerEN_IE,
  en_ZA: fakerEN_ZA, en_GH: fakerEN_GH, en_KE: fakerEN, en_NG: fakerEN_NG,
  ja: fakerJA, zh_CN: fakerZH_CN, zh_TW: fakerZH_TW,
  fr: fakerFR, fr_BE: fakerFR_BE, fr_CA: fakerFR_CA, fr_CH: fakerFR_CH,
  fr_LU: fakerFR_LU, fr_SN: fakerFR_SN,
  de: fakerDE, de_AT: fakerDE_AT, de_CH: fakerDE_CH,
  it: fakerIT, pt_BR: fakerPT_BR, pt_PT: fakerPT_PT,
  ko: fakerKO, ru: fakerRU, es: fakerES, es_MX: fakerES_MX,
  nl: fakerNL, nl_BE: fakerNL_BE, sv: fakerSV, nb_NO: fakerNB_NO, pl: fakerPL,
  ar: fakerAR, az: fakerAZ, cs_CZ: fakerCS_CZ, da: fakerDA, el: fakerEL,
  fa: fakerFA, fi: fakerFI, he: fakerHE, hr: fakerHR, hu: fakerHU, hy: fakerHY,
  id_ID: fakerID_ID, ka_GE: fakerKA_GE, lv: fakerLV, mk: fakerMK, ne: fakerNE,
  ro: fakerRO, ro_MD: fakerRO_MD, sk: fakerSK, sr_RS_latin: fakerSR_RS_latin,
  th: fakerTH, tr: fakerTR, uk: fakerUK, ur: fakerUR, vi: fakerVI,
}

function getFaker(locale: string): Faker {
  return localeMap[locale] || fakerEN
}

function generatePhone(countryCode: string): string {
  const config = countryConfigs[countryCode]
  const number = config.phonePattern.replace(/#/g, () =>
    Math.floor(Math.random() * 10).toString()
  )
  return `${config.phonePrefix} ${number}`
}

function generateDob(): { dob: string; age: number } {
  const start = new Date(1960, 0, 1)
  const end = new Date(2005, 11, 31)
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  const today = new Date()
  let age = today.getFullYear() - year
  const monthDiff = today.getMonth() - date.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--
  }

  return { dob: `${day}/${month}/${year}`, age }
}

function generatePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const special = '!@#$%^&*'
  const all = upper + lower + digits + special

  let password = ''
  password += upper[Math.floor(Math.random() * upper.length)]
  password += lower[Math.floor(Math.random() * lower.length)]
  password += digits[Math.floor(Math.random() * digits.length)]
  password += special[Math.floor(Math.random() * special.length)]

  for (let i = 4; i < 16; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  return password.split('').sort(() => Math.random() - 0.5).join('')
}

export function generateFakeProfileClient(countryCode: string): FakeProfile {
  const config = countryConfigs[countryCode]
  if (!config) {
    throw new Error(`Country ${countryCode} is not supported`)
  }

  const f = getFaker(config.locale)

  const gender = Math.random() > 0.5 ? 'Male' : 'Female'
  const sex = gender === 'Male' ? 'male' : 'female'

  const firstName = f.person.firstName(sex as 'male' | 'female')
  const lastName = f.person.lastName(sex as 'male' | 'female')
  const fullName = `${firstName} ${lastName}`

  const { dob, age } = generateDob()

  const emailDomain = faker.helpers.arrayElement([
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com',
  ])
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'
  const cleanLast = lastName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'name'
  const email = `${cleanFirst}${cleanLast}${Math.floor(Math.random() * 999)}@${emailDomain}`

  const username = `${cleanFirst}_${Math.floor(Math.random() * 9999)}`
  const password = generatePassword()
  const phone = generatePhone(countryCode)

  const street = f.location.streetAddress()
  const city = f.location.city()
  let state: string
  let zip: string
  try { state = f.location.state() } catch { state = city }
  try { zip = f.location.zipCode() } catch { zip = Math.floor(10000 + Math.random() * 90000).toString() }

  return {
    countryCode,
    countryName: config.name,
    localeLabel: `${config.name} (${countryCode})`,
    fullName,
    gender,
    dob,
    age,
    email,
    username,
    password,
    phone,
    street,
    city,
    state,
    zip,
  }
}
