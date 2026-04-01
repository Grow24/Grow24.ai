import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transformation')({
  component: TransformationPage,
})

const AUTHORS = [
  { name: 'Lauren Wiener', title: 'Managing Director & Senior Partner', location: 'Boston', image: '/rishika_seth.jpg' },
  { name: 'Fabrice Beaulieu', title: 'Senior Advisor', location: 'Chicago', image: '/sandeep_seth.png' },
  { name: 'Matthew Kropp', title: 'Managing Director & Senior Partner', location: 'San Francisco', image: '/grow24_ai_icon_2.jpeg' },
  { name: 'Leora Kelman', title: 'Managing Director & Partner', location: 'Philadelphia', image: '/grow24_ai_icon3.jpeg' },
  { name: 'Alan Iny', title: 'Partner and Director, Creativity & Scenarios', location: 'New York', image: '/grow24_ai_icon_4.jpeg' },
  { name: 'Vincent Ho', title: 'Partner', location: 'Brooklyn', image: '/grow24_ai_icon_5.jpeg' },
]

const RELATED = [
  { title: "Agentic Commerce Is Redefining Retail—Here's How to Respond", image: '/problem-hero3.png', tag: 'Retail Industry', date: 'October 6, 2025' },
  { title: 'AI Agents Will Reshape E-Commerce. European Players Must Prepare...', image: '/solution-hero2.png', tag: 'E-Commerce', date: 'December 15, 2025' },
  { title: 'Scaling AI Requires New Processes, Not Just New Tools', image: '/toolsets-hero4.png', tag: 'AI Agents', date: 'January 20, 2026' },
  { title: 'How AI Agents Are Transforming Consumer Goods', image: '/value-framework-hero10.png', tag: 'Artificial Intelligence', date: 'September 14, 2025' },
]

function TransformationPage() {
  const [isActionsOpen, setIsActionsOpen] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(true)
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(true)

  return (
    <div
      className="min-h-screen text-[#202124] mt-[-70px]"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <main className="mx-auto w-full max-w-[1320px] px-6 md:px-10 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-8 relative">
          {!isActionsOpen && (
            <button
              type="button"
              onClick={() => setIsActionsOpen(true)}
              className="hidden xl:flex absolute -right-14 top-4 w-7 h-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 shadow-sm"
              aria-label="Open actions section"
            >
              +
            </button>
          )}
          <article className="relative space-y-10">
            <section className="relative pt-2">
              <h1 className="text-[40px] md:text-[46px] leading-[1.06] font-light max-w-[980px] tracking-[-0.015em] text-slate-900 mb-5">Agentic Scenarios Every Marketer Must Prepare For</h1>
              <div className="overflow-hidden rounded-[2px] relative border border-slate-200/70">
                <img src="/transformation/hero-visual.png" alt="Agentic scenarios hero visual" className="w-full h-[600px] md:h-[680px] block object-cover" />
                <div
                  className="absolute left-8 top-9 w-[440px] max-w-[92%] rounded-2xl p-5 md:p-6 text-slate-800 shadow-[0_10px_28px_rgba(0,0,0,0.2)] border"
                  style={{
                    backgroundColor: 'rgba(245, 245, 246, 0.78)',
                    borderColor: 'rgba(255, 255, 255, 0.46)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                  }}
                >
                  <p className="text-[12px] font-semibold tracking-wide text-slate-900 mb-3">KEY TAKEAWAYS</p>
                  <p className="text-[16px] leading-[1.45] mb-4">
                    No one knows what the agentic future will look like, but four marketing scenarios
                    —an open agentic bazaar, a brand resurgence through data ecosystems, a super-app embrace,
                    and a creator-led authenticity revival—seem most likely.
                  </p>
                  <ul className="space-y-2.5 list-disc pl-4 text-[15px] leading-[1.45]">
                    <li>Across all four agentic scenarios, two marketing principles will prove critical: discoverability and desirability.</li>
                    <li>Brand equity, answer engine optimization, and marketing speed will prove critical in every scenario.</li>
                    <li>Brands can build their own AI platforms, meet consumers inside existing ones, or integrate directly with AI agents.</li>
                    <li>Retailers will have to choose between becoming destinations or turning into evaluators because it&apos;s tough to pursue both simultaneously.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="relative space-y-6 text-[18px] leading-[1.42] text-slate-700 font-normal">
              <p>It could result in a world in which AI agents independently manage your purchases, learning your preferences and completing transactions without you having to view a product page again. Amazon&apos;s Smart Reorders and Instacart&apos;s reordering flow offer early signals of this automation-first model.</p>
              <p>Or it could be a market where AI agents act as intelligent advisors, surfacing all your options and facilitating payment while you retain the final decision. Platforms such as ChatGPT and Perplexity have recently launched shopping assistants that guide discovery and comparison without fully automating the purchase process.</p>
              <p>Or it might be a marketplace where purchases flow through social networks, with recommendations from friends, influencers, and communities deciding what your AI agents consider. Agents could amplify creators, professionalizing taste and trust as commerce blends into social streams.</p>
              <p>All these futures are plausible and likely to coexist in varying degrees. What is certain is that the rules of consumer discovery, trust, and purchase are being rewritten in ways marketing teams cannot ignore.</p>
            </section>

            <section className="relative">
              <div className="rounded-2xl bg-[#e8e5e1] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-wide text-slate-700 mb-2">WEEKLY INSIGHTS SUBSCRIPTION</p>
                  <h3 className="text-[50px] leading-[1.02] font-light">Stay ahead with gro24.ai insights on marketing and sales</h3>
                </div>
                <div className="flex items-center rounded-xl bg-white border border-slate-300 overflow-hidden h-12 w-full md:w-[340px]">
                  <input className="px-4 flex-1 text-sm outline-none" placeholder="Enter Email" />
                  <button className="w-14 h-full bg-[#7cf267] text-slate-800 text-xl">→</button>
                </div>
              </div>
            </section>

            <section className="relative">
              <h2 className="text-5xl md:text-[72px] leading-[1.05] font-light mb-5">Why Scenarios Score Over Forecasts</h2>
              <div className="space-y-5 text-[18px] leading-[1.42] text-slate-700 font-normal">
                <p>Already, AI search is shifting traffic away from direct e-commerce even as conversational commerce reinvents online experiences. Most companies still ask forecasting questions about timing and adoption. Those are useful but incomplete.</p>
                <p>The better question is this: <em>How do we build capabilities that work whether the market is 10% agent-driven or 90%?</em> Preparedness, not precision, creates advantage.</p>
                <p>Scenario planning acknowledges uncertainty and builds robust strategic moves that hold up across outcomes. It forces marketers to identify which moves are no-regret and which ones are contingent on how ecosystems evolve.</p>
              </div>
            </section>

            <section className="relative space-y-6">
              <p className="text-[18px] leading-[1.42] text-slate-700 font-normal">Because the existence of so many variables complicates decision making, we developed scenarios to identify those that would generate the most distinct futures.</p>
              <img src="/transformation/05.png" alt="Exhibit 1" className="w-full rounded-md border border-slate-300" />
              <h2 className="text-5xl md:text-[72px] leading-[1.05] font-light">Four Agentic AI Futures for Retail</h2>
              <p className="text-[18px] leading-[1.42] text-slate-700 font-normal">These dimensions produce four distinct futures: The Open Agentic Bazaar, The Super-App Embrace, A Creator-Led Authenticity Revival, and Brand Resurgence Through Data Fortresses.</p>
              <img src="/transformation/06.png" alt="Exhibit 2" className="w-full rounded-md border border-slate-300" />
            </section>

            <section className="relative space-y-6 text-[18px] leading-[1.42] text-slate-700 font-normal">
              <h3 className="text-4xl md:text-[56px] text-slate-900 font-light">The Super-App Embrace</h3>
              <p>The global super-apps launched by major technology firms dominate agentic shopping in this future landscape. Consumers state needs, and the app&apos;s agents execute across retailers&apos; fulfillment systems for convenience, speed, and price.</p>
              <h3 className="text-4xl md:text-[56px] text-slate-900 font-light">A Creator-Led Authenticity Revival</h3>
              <p>In this scenario, consumers prefer human-trusted networks over algorithmic control. Discovery and purchases flow through creators and communities, while AI supports curation and personalization behind the scenes.</p>
            </section>

            <section className="relative space-y-6">
              <h2 className="text-5xl md:text-[72px] leading-[1.05] font-light">Marketing&apos;s Twin Imperatives for Agentic Worlds</h2>
              <p className="text-[18px] leading-[1.42] text-slate-700 font-normal">Across all four scenarios, two priorities remain constant: discoverability and desirability.</p>
              <img src="/transformation/08.png" alt="Exhibit 3" className="w-full rounded-md border border-slate-300" />
            </section>

            <section className="relative space-y-6 text-[18px] leading-[1.42] text-slate-700 font-normal">
              <h2 className="text-5xl md:text-[72px] leading-[1.05] font-light text-slate-900">No-Regret Foundational Strategies for Any Agentic Future</h2>
              <p>Based on our analysis of AI&apos;s role in marketing and retail, several foundational strategies are critical no matter which future emerges. Brand equity and trust become even more important as algorithmic intermediaries reshape discovery and conversion.</p>
              <p>Answer Engine Optimization (AEO) is essential as AI systems evaluate content differently than traditional search. Brands need clear, context-rich information and consistent presence across trusted third-party sources.</p>
            </section>

            <section className="relative space-y-6 text-[18px] leading-[1.42] text-slate-700 font-normal">
              <h2 className="text-5xl md:text-[72px] leading-[1.05] font-light text-slate-900">The Big Bets That Can Set the Stage for Agentic Success</h2>
              <h3 className="text-4xl md:text-[56px] text-slate-900 font-light">Brands</h3>
              <p>An agentic world offers brands several paths, including building proprietary assistants that strengthen direct customer relationships on their own platforms. The transition demands focused investments and clear strategic choices.</p>
              <p>Companies that move decisively now can shape how value is captured in the next generation of commerce ecosystems.</p>
            </section>

            <section className="relative">
              <h2 className="text-5xl md:text-[72px] leading-[1.05] font-light mb-6">Authors</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {AUTHORS.map((author) => (
                  <article key={author.name} className="rounded-2xl border border-slate-300 bg-white p-4 flex gap-3">
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-20 h-20 rounded-xl bg-slate-200 object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-light text-slate-900">{author.name}</h3>
                      <p className="text-xs text-slate-600">{author.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{author.location}</p>
                      <p className="text-xs mt-2">✉</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="relative rounded-2xl bg-[#2f3034] px-6 py-8">
              <h2 className="text-5xl md:text-[64px] leading-[1.05] font-light text-white mb-6">Related Content</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {RELATED.map((item) => (
                  <article key={item.title} className="overflow-hidden rounded-xl bg-white/10 border border-white/20">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-3 text-white">
                      <p className="text-[10px] uppercase tracking-wide mb-1">{item.tag}</p>
                      <p className="text-[10px] uppercase text-white/80 mb-2">Article {item.date}</p>
                      <h3 className="text-base font-light leading-tight line-clamp-3">{item.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              {isActionsOpen && (
                <div className="rounded-2xl border border-slate-300 bg-white p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</span>
                    <button
                      type="button"
                      onClick={() => setIsActionsOpen(false)}
                      className="text-slate-500"
                      aria-label="Close actions section"
                    >
                      ×
                    </button>
                  </div>
                  <button className="w-full text-left text-xs py-2 border-b border-slate-200">💾 Save it for later</button>
                  <button className="w-full text-left text-xs py-2">⇩ Download article</button>
                </div>
              )}
              {isShareOpen ? (
                <div className="rounded-2xl border border-slate-300 bg-white p-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Share</p>
                    <button
                      type="button"
                      onClick={() => setIsShareOpen(false)}
                      className="text-slate-500"
                      aria-label="Close share section"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex gap-3 text-slate-700 text-sm">
                    <button>✉</button><button>🔗</button><button>f</button><button>𝕏</button><button>in</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => setIsShareOpen(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 shadow-sm"
                    aria-label="Open share section"
                  >
                    +
                  </button>
                </div>
              )}
              {isSubscribeOpen ? (
                <div className="rounded-2xl border border-slate-300 bg-white p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subscribe</p>
                    <button
                      type="button"
                      onClick={() => setIsSubscribeOpen(false)}
                      className="text-slate-500"
                      aria-label="Close subscribe section"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">Stay ahead with gro24.ai insights on marketing and sales</p>
                  <div className="flex items-center rounded-lg bg-white border border-slate-300 overflow-hidden h-9">
                    <input className="px-3 flex-1 text-xs outline-none" placeholder="Enter Email" />
                    <button className="w-10 h-full bg-[#7cf267]">→</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => setIsSubscribeOpen(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 shadow-sm"
                    aria-label="Open subscribe section"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default TransformationPage
