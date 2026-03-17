'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,170,255,0.05),transparent_70%)]" />
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center space-y-16 px-4">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
            Fake Identity
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00aaff] to-[#f20d0d]">
              Generator
            </span>
          </h1>
          <p className="text-gray-400 text-lg tracking-widest uppercase">
            200+ Countries &bull; Realistic Data &bull; Testing Only
          </p>
        </div>

        {/* Theme Selection */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Persona 3 Card */}
          <Link href="/p3" className="group">
            <div className="relative w-80 h-56 overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-105"
              style={{ clipPath: 'polygon(0 5%, 95% 0, 100% 95%, 5% 100%)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00aaff] to-[#001a33]" />
              <div className="absolute inset-[2px] bg-[#020617] flex flex-col items-center justify-center p-8"
                style={{ clipPath: 'polygon(0 5%, 95% 0, 100% 95%, 5% 100%)' }}>
                <div className="text-[#00aaff] text-6xl font-black italic font-serif mb-3">III</div>
                <h2 className="text-[#00f2ff] text-xl font-bold uppercase tracking-[0.3em]">Persona 3</h2>
                <p className="text-[#00aaff]/60 text-xs mt-2 tracking-widest uppercase">S.E.E.S. Database</p>
              </div>
            </div>
          </Link>

          {/* Persona 5 Card */}
          <Link href="/p5" className="group">
            <div className="relative w-80 h-56 overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-105"
              style={{ clipPath: 'polygon(2% 0%, 100% 5%, 98% 100%, 0% 95%)' }}>
              <div className="absolute inset-0 bg-[#f20d0d]" />
              <div className="absolute inset-[3px] bg-black flex flex-col items-center justify-center p-8"
                style={{ clipPath: 'polygon(2% 0%, 100% 5%, 98% 100%, 0% 95%)' }}>
                <div className="text-[#f20d0d] text-6xl font-black italic mb-3">V</div>
                <h2 className="text-white text-xl font-black uppercase tracking-[0.3em] italic">Persona 5</h2>
                <p className="text-[#f20d0d]/60 text-xs mt-2 tracking-widest uppercase">Phantom Thieves</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-gray-600 text-xs tracking-wider max-w-md mx-auto">
          This tool generates fake data for testing/demo purposes only.
          Do not use generated data for illegal activities.
        </p>
      </div>
    </div>
  )
}
