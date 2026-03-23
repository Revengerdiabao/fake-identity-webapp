'use client'

import { useState, useMemo } from 'react'
import type { FakeProfile } from '@/lib/identity/types'
import { countryConfigs } from '@/lib/identity/config'
import { generateFakeProfileClient } from '@/lib/identity/generator-client'
import Link from 'next/link'

const allCountries = Object.entries(countryConfigs)
  .map(([code, cfg]) => ({ code, name: cfg.name }))
  .sort((a, b) => a.name.localeCompare(b.name))

const featured = ['US', 'JP', 'AE', 'GB', 'FR', 'DE', 'CN', 'BR', 'KR', 'IT', 'AU', 'CA']

export default function Persona5Page() {
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

  function generate(code: string) {
    setLoading(true)
    setError('')
    setShowDropdown(false)
    setSearch('')
    try {
      const data = generateFakeProfileClient(code)
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
    <div className="min-h-screen p-4 md:p-12 relative bg-black text-white">
      {/* Background */}
      <div className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] z-[-2]" style={{
        background: 'repeating-linear-gradient(45deg, #000, #000 100px, #111 100px, #111 200px)',
        transform: 'rotate(-5deg)',
      }} />
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-10" style={{
        backgroundImage: 'radial-gradient(#f20d0d 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />

      {/* Header */}
      <header className="relative mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/" className="relative inline-block bg-[#f20d0d] px-8 py-4 border-4 border-white"
            style={{ transform: 'skewX(-12deg)' }}>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
              style={{ transform: 'skewX(12deg)' }}>
              Phantom <span className="bg-white text-[#f20d0d] px-2">Data</span>
            </h1>
          </Link>

          {/* Search */}
          <div className="w-full max-w-md relative">
            <div className="absolute inset-0 bg-white" style={{ transform: 'translateX(6px) translateY(6px)' }} />
            <div
              className="relative bg-black border-4 border-[#f20d0d] p-2 flex items-center"
            >
              <input
                className="w-full bg-transparent border-none focus:outline-none text-white font-bold uppercase placeholder-gray-500 italic px-2"
                placeholder="SEARCH COUNTRY CODE..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowDropdown(true) }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleSearchKey}
              />
              <button
                onClick={() => (search ? searchGenerate() : randomCountry())}
                className="bg-[#f20d0d] p-2"
                title={search ? 'Generate' : 'Random Country'}
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-black border-4 border-[#f20d0d] max-h-60 overflow-y-auto rounded">
                {filtered.slice(0, 50).map(c => (
                  <button key={c.code} onClick={() => generate(c.code)}
                    className="w-full text-left px-4 py-3 text-white hover:bg-[#f20d0d] font-bold uppercase text-sm transition-colors border-b border-[#f20d0d]/20">
                    {c.name} <span className="text-[#f20d0d]">({c.code})</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 italic">No results found</div>
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
          <div className="relative bg-white text-black p-3 inline-block mb-4"
            style={{ transform: 'skewX(12deg)' }}>
            <h2 className="font-black text-xl italic uppercase px-4" style={{ transform: 'skewX(-12deg)' }}>
              Generate Fake Address
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {featured.map((code, i) => (
              <button key={code} onClick={() => generate(code)}
                className={`py-4 text-lg font-extrabold uppercase tracking-[0.1em] transition-all duration-300 hover:scale-105 hover:brightness-125 ${
                  i % 2 === 0
                    ? 'hover:shadow-[0_0_25px_rgba(242,13,13,0.6)]'
                    : 'hover:shadow-[0_0_25px_rgba(242,13,13,0.5)]'
                }`}
                style={{
                  clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)',
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, #ff1a1a 0%, #cc0000 100%)'
                    : 'linear-gradient(135deg, #2a0808 0%, #1a0404 100%)',
                  color: '#fff',
                  border: i % 2 !== 0 ? '3px solid #f20d0d' : 'none',
                  transform: 'skewX(-12deg)',
                  boxShadow: i % 2 === 0
                    ? '0 4px 15px rgba(242, 13, 13, 0.3)'
                    : 'inset 0 0 20px rgba(242, 13, 13, 0.1), 0 4px 10px rgba(0, 0, 0, 0.5)',
                }}>
                <span style={{ transform: 'skewX(12deg)', display: 'block' }}>
                  {countryConfigs[code]?.name.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          {/* Random Button */}
          <button onClick={randomCountry}
            className="w-full py-5 text-xl font-extrabold uppercase tracking-[0.15em] bg-white text-[#f20d0d] transition-all hover:bg-[#f20d0d] hover:text-white hover:scale-105"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)', transform: 'skewX(-12deg)' }}>
            <span style={{ transform: 'skewX(12deg)', display: 'block' }}>
              {loading ? 'GENERATING...' : '⟳ RANDOM COUNTRY'}
            </span>
          </button>

          <div className="h-4 bg-white w-full" style={{ transform: 'skewX(-12deg)' }} />
          <div className="h-8 bg-[#f20d0d] w-3/4 ml-auto" style={{ transform: 'skewX(-12deg)' }} />
        </section>

        {/* Right: Identity Display */}
        <section className="lg:col-span-7 relative">
          <div className="absolute top-0 right-0 text-[2rem] text-[#f20d0d] opacity-80" style={{ filter: 'drop-shadow(2px 2px 0px #fff)' }}>★</div>
          <div className="absolute bottom-0 left-0 text-[2rem] text-[#f20d0d] opacity-80 rotate-45" style={{ filter: 'drop-shadow(2px 2px 0px #fff)' }}>★</div>

          <div className="p-1" style={{ background: '#f20d0d' }}>
            <div className="bg-black p-8 border-4 border-white relative">
              <div className="absolute -top-6 left-8 bg-white text-black px-6 py-1 font-black italic"
                style={{ transform: 'skewX(-12deg)' }}>
                {profile ? 'FAKE IDENTITY DETECTED' : 'AWAITING TARGET'}
              </div>

              {error && (
                <div className="text-[#f20d0d] font-black text-center py-8 italic">{error}</div>
              )}

              {loading && (
                <div className="text-[#f20d0d] font-black text-center py-16 text-3xl animate-pulse italic">
                  STEALING DATA...
                </div>
              )}

              {!loading && !error && profile && (
                <div className="space-y-8 py-6">
                  {/* Name */}
                  <div>
                    <span className="block text-[#f20d0d] text-sm font-bold uppercase mb-2 tracking-widest">Target Name</span>
                    <h3 className="text-5xl md:text-6xl text-white font-black break-words"
                      style={{ transform: 'rotate(-1deg)', textShadow: '3px 3px 0px #000' }}>
                      {profile.fullName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <P5Field label="Gender" value={profile.gender} />
                    <P5Field label="Date of Birth" value={`${profile.dob} (Age: ${profile.age})`} />
                    <P5Field label="Email" value={profile.email} />
                    <P5Field label="Username" value={profile.username} />
                    <P5Field label="Password" value={profile.password} />
                    <P5Field label="Phone" value={profile.phone} />
                    <P5Field label="Street Address" value={profile.street} />
                    <P5Field label="City" value={profile.city} />
                    <P5Field label="State / Province" value={profile.state} />
                    <P5Field label="Postal Code" value={profile.zip} />
                    <P5Field label="Country" value={`${profile.countryName} (${profile.countryCode})`} />
                  </div>

                  {/* Copy & Footer */}
                  <div className="pt-6 border-t-4 border-dashed border-[#f20d0d] flex justify-between items-end">
                    <button onClick={copyAll}
                      className="bg-white text-black px-6 py-2 font-black italic uppercase tracking-wider hover:bg-[#f20d0d] hover:text-white transition-colors"
                      style={{ transform: 'skewX(-12deg)' }}>
                      <span style={{ transform: 'skewX(12deg)', display: 'block' }}>Copy All</span>
                    </button>
                    <div className="text-[#f20d0d] font-black text-3xl italic">TAKE YOUR HEART</div>
                    <div className="bg-white h-12 w-12 flex items-center justify-center rounded-full text-black font-bold">5</div>
                  </div>
                </div>
              )}

              {!loading && !error && !profile && (
                <div className="text-center py-16 space-y-4">
                  <div className="text-[#f20d0d] text-6xl font-black italic" style={{ textShadow: '3px 3px 0 #fff' }}>★</div>
                  <p className="text-white/40 uppercase tracking-[0.3em] text-sm font-bold">Select a target country</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 relative z-10 border-t-8 border-[#f20d0d] pt-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="bg-white px-4 py-1 text-black font-bold italic"
            style={{ transform: 'skewX(-15deg)' }}>
            SYSTEM STATUS: ONLINE
          </div>
          <div className="text-white text-xs tracking-widest uppercase opacity-60">
            Testing purposes only. Do not use for illegal activities. &copy; PHANTOM_DEV
          </div>
        </div>
      </footer>

      {showDropdown && search && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}
    </div>
  )
}

function P5Field({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <div className="group cursor-pointer" onClick={copy}>
      <span className="block text-[#f20d0d] text-sm font-bold uppercase mb-1 tracking-widest">{label}</span>
      <p className="text-xl text-white font-black break-all group-hover:text-[#f20d0d] transition-colors"
        style={{ transform: 'rotate(-1deg)', textShadow: '2px 2px 0px #000' }}>
        {value || '—'}
        {copied && <span className="text-[#f20d0d] text-xs ml-2 font-normal">Copied!</span>}
      </p>
    </div>
  )
}
