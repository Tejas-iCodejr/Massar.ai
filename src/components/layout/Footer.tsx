import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import massarLogoClean from '@/assets/massar_logo_footer.png';

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
                  <li><Link to="/universities" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">Universities</Link></li>
                  <li><Link to="/schools" className="text-[#2c2e2a]/70 hover:text-[#2ba0ff] transition-colors">Schools Directory</Link></li>
                  <li><Link to="/compare" className="text-[#2c2e2a]/70 hover:text-[#8ed462] transition-colors">Compare Sandbox</Link></li>
                  <li><Link to="/programs" className="text-[#2c2e2a]/70 hover:text-[#f5e211] transition-colors">Opportunities</Link></li>
                  <li><Link to="/perks" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">Student Perks</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-sans font-black uppercase tracking-wider text-xs text-[#2c2e2a] mb-6">LEARN</h4>
                <ul className="space-y-3 font-sans font-bold text-xs uppercase tracking-wider">
                  <li><Link to="/faq" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">FAQ</Link></li>
                  <li><Link to="/accreditation" className="text-[#2c2e2a]/70 hover:text-[#2ba0ff] transition-colors">Board Reviews</Link></li>
                  <li><Link to="/accreditation" className="text-[#2c2e2a]/70 hover:text-[#8ed462] transition-colors">KHDA Standards</Link></li>
                  <li><Link to="/accreditation" className="text-[#2c2e2a]/70 hover:text-[#f5e211] transition-colors">ADEK Metrics</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-sans font-black uppercase tracking-wider text-xs text-[#2c2e2a] mb-6">CONTACT</h4>
                <ul className="space-y-3 font-sans font-bold text-xs uppercase tracking-wider">
                  <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">Instagram</a></li>
                  <li><Link to="/login" className="text-[#2c2e2a]/70 hover:text-[#2ba0ff] transition-colors">Partner Portal</Link></li>
                  <li><Link to="/planner" className="text-[#2c2e2a]/70 hover:text-[#8ed462] transition-colors">Carry Us</Link></li>
                  <li><Link to="/faq" className="text-[#2c2e2a]/70 hover:text-[#f5e211] transition-colors">Support Center</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-sans font-black uppercase tracking-wider text-xs text-[#2c2e2a] mb-6">LEGAL</h4>
                <ul className="space-y-3 font-sans font-bold text-xs uppercase tracking-wider">
                  <li><Link to="/privacy" className="text-[#2c2e2a]/70 hover:text-[#ff705d] transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-[#2c2e2a]/70 hover:text-[#2ba0ff] transition-colors">Terms of Use</Link></li>
                  <li><Link to="/accreditation" className="text-[#2c2e2a]/70 hover:text-[#8ed462] transition-colors">Accreditation</Link></li>
                  <li><Link to="/regulatory" className="text-[#2c2e2a]/70 hover:text-[#f5e211] transition-colors">Regulatory</Link></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Giant Continuous Loop Vector Illustration spelling 'massar' */}
      <div className="border-t border-hairline-mist pt-12 pb-6 overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-4 select-none relative flex justify-center">
          <img 
            src={massarLogoClean} 
            alt="Massar Logo" 
            className="w-full max-w-4xl h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          />
        </div>
      </div>

      {/* Small Legal & Credit Bar */}
      <div className="bg-white py-8 border-t border-[#f5f1e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans font-bold uppercase tracking-wider text-[#2c2e2a]/50">
          <div>
            &copy; {new Date().getFullYear()} Massar Platform. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#ff705d] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#2ba0ff] transition-colors">Terms of Service</Link>
            <Link to="/accreditation" className="hover:text-[#8ed462] transition-colors">Accreditation</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
