import React, { useState } from 'react';
import { Search, Sparkles, Globe, ArrowUpRight, HelpCircle, AlertCircle, Loader, Cpu, BookOpen, Award, GraduationCap, CheckCircle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { MarkdownRenderer } from './MarkdownRenderer';

interface QuickSearch {
  title: string;
  query: string;
  description: string;
  icon: 'hackathon' | 'k12' | 'perks' | 'fellowship';
}

interface SearchGroundingHubProps {
  category: 'programs' | 'perks';
  quickSearches: QuickSearch[];
  title: string;
  subtitle: string;
}

export function SearchGroundingHub({ category, quickSearches, title, subtitle }: SearchGroundingHubProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    text: string;
    groundingChunks: any[];
    webSearchQueries: string[];
  } | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to retrieve search grounding data.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during search grounding.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };

  return (
    <Card className="bg-white border-2 border-[#2c2e2a] shadow-[4px_4px_0px_#2c2e2a] rounded-[32px] p-6 sm:p-8 mb-12 overflow-hidden relative">
      {/* Background aesthetic blobs */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#8ed462]/10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#2ba0ff]/10 rounded-full pointer-events-none" />

      {/* Header Block */}
      <div className="relative z-10 mb-8 border-b border-hairline-mist pb-6">
        <div className="font-sans text-xs text-[#2ba0ff] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#2ba0ff] animate-pulse" />
          Powered by Gemini 3.5 & Google Search Grounding
        </div>
        <h2 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink">
          {title}
        </h2>
        <p className="font-sans font-medium text-stone-gray text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Predefined Quick Search Cards */}
      {!result && !loading && (
        <div className="mb-8">
          <div className="font-sans text-xs text-stone-gray uppercase font-bold tracking-wider mb-4 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-stone-gray" /> Pre-configured ground truth seed queries:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(item.query)}
                className="group text-left p-5 bg-[#f5f1e4]/40 hover:bg-[#f5f1e4] border border-[#e0dbce] hover:border-[#2c2e2a] rounded-[24px] transition-all cursor-pointer select-none flex flex-col justify-between h-full hover:shadow-sm"
              >
                <div>
                  <div className="w-10 h-10 rounded-[12px] bg-white border border-[#e0dbce] group-hover:border-[#2c2e2a] flex items-center justify-center mb-4 transition-transform group-hover:rotate-3">
                    {item.icon === 'hackathon' && <Cpu className="w-5 h-5 text-[#2ba0ff]" />}
                    {item.icon === 'k12' && <GraduationCap className="w-5 h-5 text-[#8ed462]" />}
                    {item.icon === 'perks' && <Award className="w-5 h-5 text-[#f5e211] stroke-[#2c2e2a]" />}
                    {item.icon === 'fellowship' && <BookOpen className="w-5 h-5 text-[#ff705d]" />}
                  </div>
                  <h4 className="font-sans font-black text-sm uppercase tracking-tight text-ink mb-1 group-hover:text-[#ff705d] transition-colors">
                    {item.title}
                  </h4>
                  <p className="font-sans font-medium text-[11px] text-stone-gray leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[10px] font-sans font-bold text-ink uppercase tracking-wider group-hover:underline">
                  Launch Live Search <ArrowUpRight className="w-3 h-3 text-stone-gray" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Input Box */}
      <div className="relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder={category === 'programs' ? 'Query hackathons, K12 programs, Middle East student research...' : 'Query software freebies, pro accounts with school ID, student deals...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border-2 border-[#2c2e2a] p-4 pl-12 pr-4 font-sans text-xs sm:text-sm rounded-[50px] placeholder:text-stone-gray/75 focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink shadow-sm text-ink font-medium"
              disabled={loading}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-stone-gray" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-[#2c2e2a] hover:bg-ink text-white font-sans font-bold text-xs uppercase px-6 py-4 rounded-[50px] border-2 border-transparent hover:border-[#2c2e2a] transition-all cursor-pointer flex items-center justify-center gap-2 flex-grow sm:flex-grow-0"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-white" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-white" />
                  <span>Ground Query</span>
                </>
              )}
            </Button>
            {result && (
              <Button
                type="button"
                variant="outline"
                onClick={clearSearch}
                className="font-sans font-bold text-xs uppercase px-5 rounded-[50px] border-2 border-[#2c2e2a] text-[#2c2e2a] cursor-pointer"
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-6 p-4 bg-[#ff705d]/10 border border-[#ff705d]/30 rounded-[16px] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#ff705d] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-sans font-bold text-xs text-[#ff705d] uppercase tracking-wide">Search Grounding API Unreachable</div>
            <p className="font-sans text-xs text-stone-gray mt-1 leading-relaxed">
              {error} Please make sure your <strong>GEMINI_API_KEY</strong> environment variable is active and verified in the Secrets tab.
            </p>
          </div>
        </div>
      )}

      {/* Loading state message sequence */}
      {loading && (
        <div className="mt-8 text-center py-12 bg-[#f5f1e4]/30 rounded-[24px] border border-[#e0dbce] border-dashed">
          <Loader className="w-10 h-10 animate-spin text-[#ff705d] mx-auto mb-4" />
          <h4 className="font-sans font-black text-md uppercase tracking-tight text-ink mb-1 animate-pulse">
            Consulting Google Search Engine...
          </h4>
          <p className="font-sans text-stone-gray text-xs max-w-sm mx-auto leading-relaxed">
            Fetching up-to-date program directories, parsing verified eligibility indices, and building grounded citations.
          </p>
        </div>
      )}

      {/* Grounded Search Result Console */}
      {result && !loading && (
        <div className="mt-8 bg-[#f5f1e4]/20 border border-[#e0dbce] rounded-[24px] p-6 sm:p-8 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-hairline-mist">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8ed462] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8ed462]"></span>
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-[#8ed462] tracking-wider">
                Grounded Search Complete
              </span>
            </div>
            {result.webSearchQueries && result.webSearchQueries.length > 0 && (
              <div className="font-sans text-[10px] text-stone-gray font-semibold">
                SEARCH QUERY EXECUTED: <code className="bg-white border border-hairline-mist px-2 py-0.5 rounded font-mono text-[#2ba0ff]">{result.webSearchQueries[0]}</code>
              </div>
            )}
          </div>

          {/* Markdown Output */}
          <div className="prose max-w-none">
            <MarkdownRenderer content={result.text} />
          </div>

          {/* Grounding Citations section */}
          {result.groundingChunks && result.groundingChunks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-hairline-mist">
              <div className="font-sans text-xs text-stone-gray uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-gray" /> Verified Search Grounding Citations:
              </div>
              <div className="flex flex-wrap gap-2.5">
                {result.groundingChunks.map((chunk: any, cIdx: number) => {
                  if (!chunk.web) return null;
                  return (
                    <a
                      key={cIdx}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-hairline-mist hover:border-[#2c2e2a] hover:bg-[#8ed462]/10 rounded-[50px] font-sans text-[11px] text-ink font-semibold transition-colors select-none"
                    >
                      <span>{cIdx + 1}. {chunk.web.title || 'Source'}</span>
                      <ArrowUpRight className="w-3 h-3 text-stone-gray" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
