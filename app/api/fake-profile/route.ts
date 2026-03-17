import { NextRequest, NextResponse } from 'next/server'
import { generateFakeProfile } from '@/lib/identity/generator'
import { countryConfigs, supportedCountries } from '@/lib/identity/config'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country')?.toUpperCase()

  if (!country) {
    return NextResponse.json(
      { error: 'Missing required parameter: country (ISO 3166-1 alpha-2 code)' },
      { status: 400 }
    )
  }

  if (!countryConfigs[country]) {
    return NextResponse.json(
      {
        error: `Country "${country}" is not supported yet.`,
        supported: supportedCountries,
      },
      { status: 400 }
    )
  }

  try {
    const profile = await generateFakeProfile(country)
    return NextResponse.json(profile)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
