import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const stickers = [
    { char: 'M', bg: 'fill-[#2ba0ff]', stroke: '#2c2e2a', text: 'text-white', path: 'M50,8 C73,6 94,22 92,48 C90,74 74,92 48,91 C22,90 8,72 10,46 C12,20 27,10 50,8 Z' },
    { char: 'A', bg: 'fill-[#ff705d]', stroke: '#2c2e2a', text: 'text-white', path: 'M48,10 C74,8 90,26 91,48 C92,70 72,90 50,92 C28,94 10,74 9,52 C8,30 22,12 48,10 Z' },
    { char: 'S', bg: 'fill-[#f5e211]', stroke: '#2c2e2a', text: 'text-[#2c2e2a]', path: 'M52,6 C78,10 92,30 89,52 C86,74 68,92 46,90 C24,88 8,68 10,46 C12,24 26,2 52,6 Z' },
    { char: 'S', bg: 'fill-[#8ed462]', stroke: '#2c2e2a', text: 'text-[#2c2e2a]', path: 'M50,12 C72,10 90,24 92,46 C94,68 76,88 54,90 C32,92 12,74 10,52 C8,30 28,14 50,12 Z' },
    { char: 'A', bg: 'fill-[#2ba0ff]', stroke: '#2c2e2a', text: 'text-white', path: 'M46,8 C70,10 92,26 90,48 C88,70 70,92 48,90 C26,88 10,70 12,48 C14,26 22,6 46,8 Z' },
    { char: 'R', bg: 'fill-[#9f5ffd]', stroke: '#2c2e2a', text: 'text-white', path: 'M50,6 C76,4 94,22 92,48 C90,74 72,92 48,90 C24,88 6,70 8,44 C10,18 24,8 50,6 Z' },
  ];

  return (
    <footer className="bg-white text-[#2c2e2a] pt-24 mt-24 border-t border-hairline-mist relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16">
          
          {/* Left Column: Hand-crafted Stickers & Newsletter */}
          <div className="lg:col-span-5">
            {/* Wobbly illustrated character-stickers representing M-A-S-S-A-R */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {stickers.map((sticker, idx) => (
                <div 
                  key={idx}
                  className="w-12 h-12 relative cursor-pointer group transition-all duration-300 hover:scale-110 hover:-rotate-12"
                  style={{ transform: `rotate(${(idx % 2 === 0 ? 5 : -5) + (idx * 1.5)}deg)` }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
                    <path 
                      d={sticker.path} 
                      className={sticker.bg} 
                      stroke={sticker.stroke} 
                      strokeWidth="5" 
                    />
                  </svg>
                  <div className={`absolute inset-0 flex items-center justify-center font-sans font-black text-lg ${sticker.text} select-none`}>
                    {sticker.char}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-sans font-black text-xl uppercase tracking-tight text-[#2c2e2a] mb-2">
              Massar in your inbox
            </h3>
            
            <form onSubmit={handleSubscribe} className="mt-4 max-w-sm relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={subscribed ? "✓ Subscribed successfully!" : "Enter your email"}
                className={`w-full bg-transparent border-b-2 border-[#2c2e2a] py-3 pr-10 font-sans text-sm font-semibold text-[#2c2e2a] placeholder:text-[#2c2e2a]/40 focus:outline-none transition-colors ${subscribed ? 'text-[#8ed462]' : ''}`}
                disabled={subscribed}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2c2e2a] hover:translate-x-1.5 transition-transform cursor-pointer"
                disabled={subscribed}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Columns: Minimal list links */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 lg:gap-16">
              <div>
                <h4 className="font-sans font-black uppercase tracking-wider text-xs text-[#2c2e2a] mb-6">DISCOVER</h4>
                <ul className="space-y-3 font-sans font-bold text-xs uppercase tracking-wider">
                  <li><a href="/universities" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">Universities</a></li>
                  <li><a href="/schools" className="text-[#2c2e2a]/70 hover:text-[#2ba0ff] transition-colors">Schools Directory</a></li>
                  <li><a href="/compare" className="text-[#2c2e2a]/70 hover:text-[#8ed462] transition-colors">Compare Sandbox</a></li>
                  <li><a href="/programs" className="text-[#2c2e2a]/70 hover:text-[#f5e211] transition-colors">Fellowships</a></li>
                  <li><a href="/perks" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">Student Perks</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-sans font-black uppercase tracking-wider text-xs text-[#2c2e2a] mb-6">LEARN</h4>
                <ul className="space-y-3 font-sans font-bold text-xs uppercase tracking-wider">
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#2ba0ff] transition-colors">Board Reviews</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#8ed462] transition-colors">KHDA Standards</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#f5e211] transition-colors">ADEK Metrics</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-sans font-black uppercase tracking-wider text-xs text-[#2c2e2a] mb-6">CONTACT</h4>
                <ul className="space-y-3 font-sans font-bold text-xs uppercase tracking-wider">
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">Instagram</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#2ba0ff] transition-colors">Partner Portal</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#8ed462] transition-colors">Carry Us</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#f5e211] transition-colors">Support Center</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-sans font-black uppercase tracking-wider text-xs text-[#2c2e2a] mb-6">LEGAL</h4>
                <ul className="space-y-3 font-sans font-bold text-xs uppercase tracking-wider">
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#2ba0ff] transition-colors">Terms of Use</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#8ed462] transition-colors">Accreditation</a></li>
                  <li><a href="#" className="text-[#2c2e2a]/70 hover:text-[#f5e211] transition-colors">Regulatory</a></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Giant Continuous Loop Vector Illustration spelling 'massar' */}
      <div className="border-t border-hairline-mist pt-12 pb-6 overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-4 select-none relative flex justify-center">
          <svg 
            viewBox="0 0 1000 300" 
            className="w-full max-w-4xl h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            {/* Solid Colorful nodes (Joints and Terminals) with inner dots, representing MASSAR branding */}
            {/* Node 1: Blue with orange center (M loop start) */}
            <g className="cursor-pointer transition-all duration-300 hover:scale-110 origin-[85px_70px]">
              <circle cx="85" cy="70" r="22" fill="#2ba0ff" stroke="#2c2e2a" strokeWidth="4" />
              <circle cx="85" cy="70" r="6" fill="#ff705d" />
            </g>

            {/* Node 2: Purple with yellow center (M right stem terminal) */}
            <g className="cursor-pointer transition-all duration-300 hover:scale-110 origin-[278px_220px]">
              <circle cx="278" cy="220" r="22" fill="#9f5ffd" stroke="#2c2e2a" strokeWidth="4" />
              <circle cx="278" cy="220" r="6" fill="#f5e211" />
            </g>

            {/* Node 3: Orange with blue center (A loop) */}
            <g className="cursor-pointer transition-all duration-300 hover:scale-110 origin-[435px_220px]">
              <circle cx="435" cy="220" r="22" fill="#ff705d" stroke="#2c2e2a" strokeWidth="4" />
              <circle cx="435" cy="220" r="6" fill="#2ba0ff" />
            </g>

            {/* Node 4: Green with pink center (S bottom-right terminal) */}
            <g className="cursor-pointer transition-all duration-300 hover:scale-110 origin-[649px_220px]">
              <circle cx="649" cy="220" r="22" fill="#8ed462" stroke="#2c2e2a" strokeWidth="4" />
              <circle cx="649" cy="220" r="6" fill="#ff7fc1" />
            </g>

            {/* Node 5: Yellow with purple center (Second A suspended) */}
            <g className="cursor-pointer transition-all duration-300 hover:scale-110 origin-[782px_175px]">
              <circle cx="782" cy="175" r="22" fill="#f5e211" stroke="#2c2e2a" strokeWidth="4" />
              <circle cx="782" cy="175" r="6" fill="#9f5ffd" />
            </g>

            {/* Node 6: Pink with green center (R terminal) */}
            <g className="cursor-pointer transition-all duration-300 hover:scale-110 origin-[948px_130px]">
              <circle cx="948" cy="130" r="22" fill="#ff7fc1" stroke="#2c2e2a" strokeWidth="4" />
              <circle cx="948" cy="130" r="6" fill="#8ed462" />
            </g>

            {/* Beautiful, mathematically precise smooth lines spelling 'massar' */}
            {/* Letter M */}
            <path 
              d="M 85,70 
                 C 50,40 25,100 45,150 
                 C 65,200 90,95 110,95 
                 C 130,95 145,210 165,210 
                 C 185,210 200,95 220,95 
                 C 240,95 250,220 278,220" 
              fill="none" 
              stroke="#2c2e2a" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Letter A */}
            <path 
              d="M 360,130 
                 C 310,130 300,210 350,210 
                 C 390,210 400,130 360,130 
                 C 390,130 400,160 400,200 
                 C 400,215 415,220 435,220" 
              fill="none" 
              stroke="#2c2e2a" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Letters S-S */}
            <path 
              d="M 500,130 
                 C 460,130 450,170 470,195 
                 C 490,220 520,210 540,170 
                 C 560,130 590,120 610,150 
                 C 630,180 610,220 649,220" 
              fill="none" 
              stroke="#2c2e2a" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Second Letter A */}
            <path 
              d="M 720,130 
                 C 680,130 670,210 710,210 
                 C 740,210 750,130 720,130 
                 C 740,130 750,150 750,180 
                 C 750,190 765,175 782,175" 
              fill="none" 
              stroke="#2c2e2a" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Letter R */}
            <path 
              d="M 820,210 
                 C 820,170 820,130 840,130 
                 C 860,130 880,140 880,170 
                 C 880,200 910,180 948,130" 
              fill="none" 
              stroke="#2c2e2a" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Small Legal & Credit Bar */}
      <div className="bg-white py-8 border-t border-[#f5f1e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans font-bold uppercase tracking-wider text-[#2c2e2a]/50">
          <div>
            &copy; {new Date().getFullYear()} Massar Platform. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#ff705d] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#2ba0ff] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#8ed462] transition-colors">Accreditation</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
