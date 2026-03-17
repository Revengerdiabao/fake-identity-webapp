'use client'

import { useState, useMemo } from 'react'
import type { FakeProfile } from '@/lib/identity/types'
import { countryConfigs } from '@/lib/identity/config'
import Link from 'next/link'

const allCountries = Object.entries(countryConfigs)
  .map(([code, cfg]) => ({ code, name: cfg.name }))
  .sort((a, b) => a.name.localeCompare(b.name))

// Featured countries for quick buttons
const featured = ['US', 'JP', 'AE', 'GB', 'FR', 'DE', 'CN', 'BR', 'KR', 'IT', 'AU', 'CA']

export default function Persona3Page() {
  const [profile, setProfile] = useState<FakeProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filtered = useMemo(() => {
    if (!search) return allCountries
    const q = search.toLowerCase()
    return allCountries.filter(
      c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    )
  }, [search])

  async function generate(code: string) {
    setLoading(true)
    setError('')
    setShowDropdown(false)
    setSearch('')
    try {
      const res = await fetch(`/api/fake-profile?country=${code}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setProfile(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function searchGenerate() {
    if (filtered.length > 0) {
      generate(filtered[0].code)
    }
  }

  function handleSearchKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchGenerate()
    }
  }

  function randomCountry() {
    const keys = Object.keys(countryConfigs)
    const random = keys[Math.floor(Math.random() * keys.length)]
    generate(random)
  }

  function copyAll() {
    if (!profile) return
    const text = `Name: ${profile.fullName}
Gender: ${profile.gender}
DOB: ${profile.dob} (Age: ${profile.age})
Email: ${profile.email}
Username: ${profile.username}
Password: ${profile.password}
Phone: ${profile.phone}
Street: ${profile.street}
City: ${profile.city}
State: ${profile.state}
Zip: ${profile.zip}
Country: ${profile.countryName} (${profile.countryCode})`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen p-4 md:p-12 relative" style={{ backgroundColor: '#020617', color: '#f1f5f9' }}>
      {/* Background */}
      <div className="fixed inset-0 z-[-2]" style={{
        backgroundImage: 'linear-gradient(to right, rgba(0,170,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,170,255,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div className="fixed inset-0 z-[-1] pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0,170,255,0.1) 0%, transparent 70%)',
      }} />

      {/* Header */}
      <header className="relative mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/" className="relative inline-block bg-[#00aaff] px-8 py-4 border-2 border-[#00f2ff] shadow-[0_0_15px_rgba(0,170,255,0.5)]"
            style={{ transform: 'skewX(-15deg)' }}>
            <h1 className="text-4xl md:text-5xl font-black text-[#020617] uppercase tracking-widest italic"
              style={{ transform: 'skewX(15deg)' }}>
              Full <span className="bg-[#020617] text-[#00f2ff] px-2 ml-1">Moon</span> Data
            </h1>
          </Link>

          {/* Search */}
          <div className="w-full max-w-md relative">
            <div className="absolute inset-0 bg-[#00f2ff] opacity-20" style={{ transform: 'skewX(-12deg) translateX(4px) translateY(4px)' }} />
            <div className="relative bg-[#020617] border-2 border-[#00aaff] p-2 flex items-center"
              style={{ transform: 'skewX(-15deg)' }}>
              <input
                className="w-full bg-transparent border-none focus:outline-none text-[#00f2ff] font-bold uppercase placeholder-blue-900 italic px-2"
                style={{ transform: 'skewX(15deg)' }}
                placeholder="SEARCH COUNTRY (NAME OR CODE)..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowDropdown(true) }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleSearchKey}
              />
              <button onClick={() => search ? searchGenerate() : randomCountry()}
                className="bg-[#00aaff] p-2 text-[#020617] hover:bg-[#00f2ff] transition-colors"
                style={{ transform: 'skewX(15deg)' }} title={search ? 'Generate' : 'Random Country'}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {search ? (
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
                  ) : (
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  )}
                </svg>
              </button>
            </div>
            {/* Dropdown - no skew for usability */}
            {showDropdown && search && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-[#001a33] border-2 border-[#00aaff] max-h-60 overflow-y-auto rounded">
                {filtered.slice(0, 50).map(c => (
                  <button key={c.code} onClick={() => generate(c.code)}
                    className="w-full text-left px-4 py-3 text-[#00f2ff] hover:bg-[#00aaff] hover:text-[#020617] font-bold uppercase text-sm transition-colors border-b border-[#00aaff]/20">
                    {c.name} <span className="opacity-60">({c.code})</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-3 text-blue-900 italic">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Left: Country Buttons */}
        <section className="lg:col-span-5 space-y-8">
          <div className="relative bg-[#f1f5f9] text-[#020617] p-3 inline-block mb-4 shadow-[4px_4px_0_#00aaff]"
            style={{ transform: 'skewX(15deg)' }}>
            <h2 className="font-bold text-xl uppercase px-4 tracking-tighter" style={{ transform: 'skewX(-15deg)' }}>
              Initialize Identity Spoofing
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featured.map((code, i) => (
              <button key={code} onClick={() => generate(code)}
                className="py-4 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(0,170,255,0.4)] hover:bg-[#00f2ff] hover:text-[#001a33] relative overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)',
                  backgroundColor: i % 2 === 0 ? '#001a33' : '#00aaff',
                  color: i % 2 === 0 ? '#f1f5f9' : '#020617',
                  border: i % 2 === 0 ? '1px solid #00aaff' : 'none',
                }}>
                {countryConfigs[code]?.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Random Button */}
          <button onClick={randomCountry}
            className="w-full py-5 text-lg font-bold uppercase tracking-[0.2em] bg-[#00f2ff] text-[#001a33] transition-all hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] hover:translate-y-[-2px]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)' }}>
            {loading ? 'GENERATING...' : '⟳ RANDOM COUNTRY'}
          </button>

          <div className="h-1 bg-[#00f2ff] w-full opacity-50" />
          <div className="h-4 bg-[#00aaff] w-2/3 ml-auto" style={{ transform: 'skewX(30deg)' }} />
        </section>

        {/* Right: Identity Display */}
        <section className="lg:col-span-7 relative">
          <div className="absolute top-0 right-4 font-serif text-[4rem] text-[#00aaff] opacity-20 italic pointer-events-none">XII</div>
          <div className="absolute bottom-4 left-4 font-serif text-[4rem] text-[#00aaff] opacity-10 rotate-12 pointer-events-none italic">Memento Mori</div>

          <div className="p-1 shadow-[0_0_30px_rgba(0,170,255,0.2)]"
            style={{ background: 'linear-gradient(135deg, #00aaff 0%, #001a33 100%)' }}>
            <div className="bg-[#020617]/90 backdrop-blur-sm p-8 border-2 border-[#00f2ff]/30 relative">
              <div className="absolute -top-4 left-8 bg-[#00f2ff] text-[#020617] px-6 py-1 font-bold text-xs tracking-widest uppercase"
                style={{ transform: 'skewX(-12deg)' }}>
                {profile ? 'S.E.E.S. ARCHIVE RETRIEVED' : 'AWAITING COMMAND'}
              </div>

              {error && (
                <div className="text-red-400 font-bold text-center py-8">{error}</div>
              )}

              {loading && (
                <div className="text-[#00f2ff] font-bold text-center py-16 text-2xl animate-pulse tracking-widest">
                  ACCESSING DATABASE...
                </div>
              )}

              {!loading && !error && profile && (
                <div className="space-y-8 py-6">
                  {/* Name */}
                  <div>
                    <span className="block text-[#00f2ff] text-[10px] font-bold uppercase mb-2 tracking-[0.3em] opacity-80">Subject Identification</span>
                    <h3 className="text-4xl md:text-5xl text-white font-serif italic font-bold" style={{ textShadow: '0 0 10px rgba(0,170,255,0.3)' }}>
                      {profile.fullName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Gender" value={profile.gender} />
                    <Field label="Date of Birth" value={`${profile.dob} (Age: ${profile.age})`} />
                    <Field label="Email" value={profile.email} />
                    <Field label="Username" value={profile.username} />
                    <Field label="Password" value={profile.password} />
                    <Field label="Phone" value={profile.phone} />
                    <Field label="Street Address" value={profile.street} />
                    <Field label="City" value={profile.city} />
                    <Field label="State / Province" value={profile.state} />
                    <Field label="Postal Code" value={profile.zip} />
                    <Field label="Country" value={`${profile.countryName} (${profile.countryCode})`} />
                  </div>

                  {/* Copy & Footer */}
                  <div className="pt-6 border-t border-[#00aaff]/30 flex justify-between items-center">
                    <button onClick={copyAll}
                      className="bg-[#00aaff]/20 border border-[#00aaff] text-[#00f2ff] px-6 py-2 font-bold text-sm uppercase tracking-widest hover:bg-[#00aaff] hover:text-[#020617] transition-colors">
                      Copy All
                    </button>
                    <div className="text-[#00f2ff] font-light text-2xl tracking-widest italic font-serif">Burn My Dread</div>
                    <div className="bg-[#00aaff]/20 border border-[#00aaff] h-12 w-12 flex items-center justify-center text-[#00f2ff] font-bold shadow-[0_0_10px_rgba(0,170,255,0.3)]">
                      3
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && !profile && (
                <div className="text-center py-16 space-y-4">
                  <div className="text-[#00f2ff] text-6xl font-serif italic opacity-30">XII</div>
                  <p className="text-[#00aaff]/60 uppercase tracking-[0.3em] text-sm">Select a country to generate identity</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 relative z-10 border-t-2 border-[#00aaff]/20 pt-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="bg-[#00aaff]/10 border border-[#00aaff]/30 px-4 py-1 text-[#00f2ff] text-xs font-bold tracking-widest"
            style={{ transform: 'skewX(-15deg)' }}>
            DORM STATUS: DARK HOUR IMMINENT
          </div>
          <div className="text-white/40 text-[10px] tracking-[0.2em] uppercase">
            Testing purposes only. Do not use for illegal activities. &copy; S.E.E.S. NETWORK
          </div>
        </div>
      </footer>

      {/* Click outside to close dropdown */}
      {showDropdown && search && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <div className="group cursor-pointer" onClick={copy}>
      <span className="block text-[#00f2ff] text-[10px] font-bold uppercase mb-1 tracking-[0.3em] opacity-80">{label}</span>
      <p className="text-lg text-white/90 font-bold break-all group-hover:text-[#00f2ff] transition-colors" style={{ textShadow: '0 0 10px rgba(0,170,255,0.3)', letterSpacing: '-0.02em' }}>
        {value || '—'}
        {copied && <span className="text-[#00f2ff] text-xs ml-2">Copied!</span>}
      </p>
    </div>
  )
}
