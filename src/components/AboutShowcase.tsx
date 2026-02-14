const AboutShowcase = () => {
  return (
    <section className="about-html">
      <div className="wrap">
        <header className="topbar">
          <div className="brand">
            <div className="logo" aria-hidden="true" />
            <div className="name">
              grow<sup>24</sup>
            </div>
          </div>

          <nav className="nav" aria-label="Page">
            <a href="#what">What</a>
            <a href="#why">Why</a>
            <a href="#how">How</a>
            <a href="#industries">Industries</a>
          </nav>

          <div className="cta">
            <a className="btn" href="#how">
              Meet the founders
            </a>
            <a className="btn primary" href="#what">
              <span className="dot" aria-hidden="true" />
              Get Started
            </a>
          </div>
        </header>

        {/* WHAT */}
        <section className="section" id="what">
          <div className="section-inner">
            <div className="kicker">
              <span className="pill">01</span> What
            </div>

            <h1 className="headline">
              A digital platform which helps you manage all stages of your inter-connected Personal &amp; Professional Life
            </h1>

            <p className="subhead">
              Provides you the confidence to define &amp; secure <span className="value-highlight">Value</span> by going through the <span className="value-highlight">Value Cycle</span>
            </p>

            <p className="subhead">
              The (<span className="value-highlight">Personal, Professional</span>) <span className="value-highlight">Value Cycle</span> is :
            </p>

            <p className="subhead" style={{ fontWeight: 700 }}>
              Goal Identification → Strategy Crafting → Objectives Definition → Plan Construction &amp; Execution
            </p>

            <ol className="subhead" style={{ listStylePosition: 'outside', paddingLeft: '1.5em', marginTop: 8 }}>
              <li style={{ marginBottom: '0.5em' }}>Based on tried &amp; tested industry standard Knowledge (e.g BABOK for Business Analysis, PMBOK for Project Mgmt)</li>
              <li style={{ marginBottom: '0.5em' }}>Complete ToolSet (Tools, Techniques, Templates, Case Studies, Trainings) for you to stay engaged for years</li>
              <li style={{ marginBottom: '0.5em' }}>Has Marketplace through which accredited Solution Providers can plug into specific parts of the (Personal, Professional) Value Cycle</li>
              <li style={{ marginBottom: '0.5em' }}>Highly Secure - run in offline mode, data transfers in encrypted manner</li>
              <li style={{ marginBottom: '0.5em' }}>Interact with the platform through the Channel of your choosing</li>
              <li style={{ marginBottom: '0.5em' }}>High User Engagement experience - Built using modern User Engagement principles</li>
              <li style={{ marginBottom: '0.5em' }}>Built to live in an inter-connected ecosystem of Products &amp; Solutions</li>
              <li style={{ marginBottom: '0.5em' }}>Built for Change - using modern, flexible architecture</li>
            </ol>

            <div className="section-cta">
              <div className="tagline">
                One platform. Full spread + AI-enabled depth. Built for years of growth.
              </div>
              <a className="btn primary" href="#why">
                <span className="dot" aria-hidden="true" />
                See Why
              </a>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="section" id="why">
          <div className="section-inner">
            <div className="kicker">
              <span className="pill">02</span> Why
            </div>

            <h2 className="headline">
              Like 2 sides of a coin, each of us have a Personal Life &amp; a Professional Life
              <br />
              Hence, a Platform that we rely on for Identifying &amp; Executing Decision, should reflect that
            </h2>
            <p className="subhead">
              Personal and professional growth are inextricably linked. People want a single platform with the{' '}
              <strong>spread</strong> (Vision → Mission → Goals → Strategy → Plan → Execute → Operate) and the{' '}
              <strong>depth</strong> (AI-enabled guidance and analytics) to manage both—over years of life and
              work.
            </p>

            <p className="subhead" style={{ fontWeight: 700, marginTop: 12 }}>
              However, the current Solutions are unable to meet that need
            </p>
            <p className="subhead" style={{ marginTop: 4 }}>
              The following 3 major issues exist in the Solution Landscape
            </p>

            <div className="grid3" role="list">
              <div className="card" role="listitem">
                <div className="num">01</div>
                <h3>Separate platforms</h3>
                <p>
                  Different platforms for Personal Management vs Professional/Business Management—forcing context
                  switching for problems that span both.
                </p>
              </div>

              <div className="card" role="listitem">
                <div className="num">02</div>
                <h3>Fragmentation within each</h3>
                <p>
                  Different tools for <strong>Goals</strong>, <strong>Strategy</strong>, <strong>Planning</strong>
                  , <strong>Execution</strong>, <strong>Tracking</strong>, and{' '}
                  <strong>Learning/Personal Growth</strong>.
                </p>
              </div>

              <div className="card" role="listitem">
                <div className="num">03</div>
                <h3>Inconsistent granularity + limited transparency</h3>
                <p>
                  Tools vary in depth and rarely reveal the body of knowledge behind their workflows. We provide
                  full transparency on how our solutions are developed.
                </p>
              </div>
            </div>

            <div className="section-cta">
              <div className="tagline">
                grow<sup>24</sup> connects the journey end-to-end—without losing context.
              </div>
              <a className="btn primary" href="#industries">
                <span className="dot" aria-hidden="true" />
                Who it serves
              </a>
            </div>
          </div>
        </section>

        {/* Industries / Domains (after Why) */}
        <section className="section" id="industries">
          <div className="section-inner">
            <div className="kicker">
              <span className="pill">03</span> Domains &amp; industries
            </div>

            <h2 className="headline">Built for SMEs and large corporates</h2>
            <p className="subhead">
              grow<sup>24</sup> is designed for both <strong>SMEs</strong> seeking leverage and cost-effective
              scale, and <strong>large corporates</strong> seeking structured execution, insight-driven
              decisions, and measurable outcomes.
            </p>

            <div className="grid3" role="list">
              <div className="card" role="listitem">
                <div className="num">SME</div>
                <h3>SME ecosystems</h3>
                <p>
                  Practical workflows, clear structure, and cost-effective tools that reduce chaos and improve
                  execution over time.
                </p>
              </div>

              <div className="card" role="listitem">
                <div className="num">ENT</div>
                <h3>Large enterprises</h3>
                <p>
                  End-to-end lifecycle coverage with analytics depth—supporting decision-making and operating
                  rhythms at scale.
                </p>
              </div>

              <div className="card" role="listitem">
                <div className="num">IND</div>
                <h3>Diverse industries</h3>
                <p>
                  Including <strong>CPG</strong>, <strong>Retail</strong>, <strong>Pharma</strong>,{' '}
                  <strong>Auto Components</strong>, <strong>Agri</strong>, and more.
                </p>
              </div>
            </div>

            <div className="section-cta">
              <div className="tagline">Industry-agnostic thinking. Domain-aware execution.</div>
              <a className="btn primary" href="#how">
                <span className="dot" aria-hidden="true" />
                How we do it
              </a>
            </div>
          </div>
        </section>

        {/* HOW */}
        <section className="section" id="how">
          <div className="section-inner">
            <div className="kicker">
              <span className="pill">04</span> How
            </div>

            <h2 className="headline">Built by practitioners with academic rigor &amp; operating experience</h2>
            <p className="subhead">
              The platform is shaped by hands-on work across analytics, strategy, and transformation—supported by
              respected academic credentials and client advisory experience.
            </p>

            <div className="founders">
              <article className="profile">
                <div className="pf-head">
                  <div className="avatar" aria-hidden="true">
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="64" height="64" rx="18" fill="url(#g)" />
                      <path
                        d="M32 33c6.2 0 11.2-5 11.2-11.2S38.2 10.6 32 10.6 20.8 15.6 20.8 21.8 25.8 33 32 33Z"
                        fill="rgba(255,255,255,.92)"
                      />
                      <path
                        d="M14.5 56.5c3.8-10.7 11-16 17.5-16s13.7 5.3 17.5 16"
                        stroke="rgba(255,255,255,.92)"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="64" y2="64">
                          <stop stopColor="rgba(255,255,255,.18)" />
                          <stop offset="1" stopColor="rgba(255,255,255,.02)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <p className="pf-name">Sandeep Seth</p>
                    <p className="pf-role">Co-founder • IIT Delhi • IIM Bangalore</p>
                  </div>
                </div>

                <ul className="bullets">
                  <li>
                    <strong>P&amp;G</strong> experience across <strong>Sales analytics</strong>,{' '}
                    <strong>Marketing analytics</strong>, and <strong>Supply Chain analytics</strong>.
                  </li>
                  <li>
                    Worked with P&amp;G&rsquo;s <strong>distributors (SMEs)</strong> to improve financial
                    outcomes—extending capability beyond enterprise boundaries.
                  </li>
                  <li>
                    Outside P&amp;G: delivered <strong>HR Analytics</strong> training initiatives alongside{' '}
                    <strong>Dr. Dave Ulrich</strong>.
                  </li>
                  <li>Led and contributed to <strong>digital transformation</strong> programs.</li>
                </ul>
              </article>

              <article className="profile">
                <div className="pf-head">
                  <div
                    className="avatar"
                    aria-hidden="true"
                    style={{
                      background: 'linear-gradient(135deg, rgba(109,40,217,1), rgba(99,102,241,1))',
                    }}
                  >
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="64" height="64" rx="18" fill="url(#g2)" />
                      <path
                        d="M32 33c6.2 0 11.2-5 11.2-11.2S38.2 10.6 32 10.6 20.8 15.6 20.8 21.8 25.8 33 32 33Z"
                        fill="rgba(255,255,255,.92)"
                      />
                      <path
                        d="M14.5 56.5c3.8-10.7 11-16 17.5-16s13.7 5.3 17.5 16"
                        stroke="rgba(255,255,255,.92)"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="g2" x1="0" y1="0" x2="64" y2="64">
                          <stop stopColor="rgba(255,255,255,.18)" />
                          <stop offset="1" stopColor="rgba(255,255,255,.02)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <p className="pf-name">Rishika Seth</p>
                    <p className="pf-role">Co-founder • MBA (Finance), Agra University • CFP</p>
                  </div>
                </div>

                <ul className="bullets">
                  <li>
                    <strong>MBA (Finance major)</strong> from <strong>Agra University</strong>.
                  </li>
                  <li>
                    <strong>Certified Financial Planner (CFP)</strong>.
                  </li>
                  <li>
                    Experience in <strong>Wealth Management</strong> in client advisory roles—bringing
                    long-term financial discipline to personal and business decisions.
                  </li>
                </ul>
              </article>
            </div>

            <div className="section-cta">
              <div className="tagline">Privately funded. Client-focused. Transparent by design.</div>
              <a className="btn primary" href="#what">
                <span className="dot" aria-hidden="true" />
                Back to top
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default AboutShowcase

