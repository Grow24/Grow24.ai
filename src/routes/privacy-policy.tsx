import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'privacy' | 'contact'>('privacy')

  const tabLabel = {
    overview: 'Overview',
    services: 'Services',
    privacy: 'Privacy Policy',
    contact: 'Contact',
  } as const

  return (
    <main className="min-h-screen bg-emerald-50/40 dark:bg-slate-950/95 py-10 sm:py-12 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <div className="mb-4 text-sm">
          <a
            href="/#home"
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 underline-offset-4 hover:underline"
          >
            ← Back to Grow24.ai
          </a>
        </div>

        {/* Main card */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-emerald-100/70 dark:border-slate-800 overflow-hidden">
          {/* Top brand bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 py-4 sm:py-5 border-b border-emerald-100/70 dark:border-slate-800 bg-emerald-50/80 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <img
                src="/grow.svg"
                alt="Grow24.ai"
                className="h-8 w-auto object-contain"
              />
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Grow24.ai
                </p>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                  Personal &amp; Business Management Platform
                </p>
              </div>
            </div>

            {/* Tab-style nav */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
              {(['overview', 'services', 'privacy', 'contact'] as const).map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full border transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-700 font-semibold'
                        : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-transparent hover:border-emerald-300 dark:hover:border-emerald-500'
                    }`}
                  >
                    {tabLabel[tab]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 space-y-8">
            {/* Title & meta */}
            <header className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {tabLabel[activeTab]}
              </h1>
              {activeTab === 'privacy' && (
                <>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Last updated: <span className="font-medium">24th April 2024</span>
                  </p>
                  <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <p>
                      Data Science Technologies (Pvt) Ltd (<span className="font-medium">&quot;Grow24&quot;, &quot;we&quot;, &quot;us&quot;</span>)
                      is committed to protecting your privacy and handling your data transparently.
                    </p>
                    <p>
                      Contact (general):{' '}
                      <span className="font-mono text-slate-800 dark:text-slate-100">
                        privacy@grow24.ai
                      </span>
                    </p>
                  </div>
                </>
              )}
              {activeTab === 'overview' && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  High-level summary of how Grow24.ai handles your data, cookies, and your key privacy rights.
                </p>
              )}
              {activeTab === 'services' && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  How Grow24.ai services use data to provide personal &amp; business management capabilities.
                </p>
              )}
              {activeTab === 'contact' && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  How to reach Grow24.ai about privacy, security, or data protection questions.
                </p>
              )}
            </header>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <section className="space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-200">
                <p>
                  Grow24.ai is a Personal &amp; Business Management Platform that helps you plan, execute,
                  and review your growth initiatives. This page summarizes how we approach privacy,
                  security, and data protection.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>We do not sell your personal information.</li>
                  <li>We collect only the data needed to provide and improve our services.</li>
                  <li>You can control optional cookies via the Cookie Preference Manager.</li>
                  <li>You can contact us at any time regarding your data or rights.</li>
                </ul>
              </section>
            )}

            {activeTab === 'services' && (
              <section className="space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-200">
                <p>
                  Grow24.ai provides a set of services to manage goals, strategies, plans, and performance
                  across personal and professional contexts. These services rely on certain data to work
                  correctly and securely.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <article>
                    <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                      Workspace &amp; accounts
                    </h2>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Create and manage user workspaces and roles.</li>
                      <li>Store configurations such as objectives, KPIs, and plans.</li>
                      <li>Keep login sessions secure and auditable.</li>
                    </ul>
                  </article>
                  <article>
                    <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                      Analytics &amp; insights
                    </h2>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Track high-level usage patterns to improve product experience.</li>
                      <li>Measure performance of plans, goals, and activities.</li>
                      <li>Use aggregated metrics wherever possible.</li>
                    </ul>
                  </article>
                </div>
              </section>
            )}

            {activeTab === 'privacy' && (
              <>
                {/* Cookie / data sale notice */}
                <section className="rounded-xl border border-emerald-200/80 dark:border-emerald-700/60 bg-emerald-50/80 dark:bg-emerald-900/40 px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                      We do not sell personal information.
                    </p>
                    <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-100/90">
                      You can review and change your cookie choices at any time using the Cookie Preference Manager.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('open-cookie-preferences'))
                      }
                    }}
                    className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    Manage Cookie Preferences
                  </button>
                </section>

                {/* Two-column main content */}
                <section className="grid md:grid-cols-2 gap-8 md:gap-10 text-sm sm:text-base text-slate-700 dark:text-slate-200">
                  {/* Left column */}
                  <div className="space-y-6">
                    <article>
                      <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                        1. Scope
                      </h2>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Provide, operate, and maintain the Grow24 services and platform.</li>
                        <li>Authenticate users and manage access, including security and fraud prevention.</li>
                        <li>Respond to support requests and improve the reliability and performance of the service.</li>
                        <li>Send essential communications (for example, security or billing-related notices).</li>
                      </ul>
                    </article>

                    <article>
                      <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                        2. Cookies, local storage, and tracking choices
                      </h2>
                      <p className="mb-2">
                        We use cookies and similar technologies to remember your preferences, keep you
                        signed in, and understand how the platform is used so we can improve it.
                      </p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          <span className="font-medium">Essential cookies</span> are required to sign in,
                          keep your session secure, and provide core functionality.
                        </li>
                        <li>
                          <span className="font-medium">Performance cookies</span> help us understand usage
                          patterns (for example, which pages are most frequently used).
                        </li>
                        <li>
                          <span className="font-medium">Advertising / marketing cookies</span> are used only
                          where permitted and can be disabled via the Cookie Preference Manager.
                        </li>
                      </ul>
                    </article>

                    <article>
                      <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                        3. Children and security
                      </h2>
                      <p className="mb-2">
                        Grow24 is designed for business and professional use and is not directed at children
                        under the age of 16.
                      </p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>We do not knowingly collect personal data from children.</li>
                        <li>
                          If you believe a child has provided us with personal data, please contact us so we
                          can delete it.
                        </li>
                        <li>
                          We apply technical and organizational measures to help keep your data secure, including
                          access controls and encryption in transit.
                        </li>
                      </ul>
                    </article>
                  </div>

                  {/* Right column */}
                  <div className="space-y-6">
                    <article>
                      <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                        4. What we collect
                      </h2>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          <span className="font-medium">Account &amp; profile</span> – name, email, organization,
                          role, and account settings.
                        </li>
                        <li>
                          <span className="font-medium">Billing</span> – billing contact details, invoices, and
                          tax information (where applicable).
                        </li>
                        <li>
                          <span className="font-medium">Usage &amp; security</span> – device/browser information,
                          IP address, log data, diagnostics, and security events.
                        </li>
                      </ul>
                    </article>

                    <article>
                      <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                        5. Data location and security
                      </h2>
                      <p className="mb-2">
                        Hosting for Grow24 is provided by reputable cloud providers. Depending on your location
                        and contract, data may be stored in one or more regions such as the US, EU, India or
                        other jurisdictions.
                      </p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>We use encryption in transit (HTTPS) for all public endpoints.</li>
                        <li>Access to production systems is restricted to authorized personnel.</li>
                        <li>We retain data only for as long as necessary for the purposes described here.</li>
                      </ul>
                    </article>

                    <article>
                      <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                        6. Your rights and choices
                      </h2>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          Access, update, or correct certain account information directly from your Grow24
                          workspace.
                        </li>
                        <li>
                          Request deletion of your account or certain personal data, subject to our legal
                          obligations.
                        </li>
                        <li>
                          Manage marketing communications by using unsubscribe links in emails or by contacting us.
                        </li>
                        <li>
                          Manage non-essential cookies at any time through the Cookie Preference Manager.
                        </li>
                      </ul>
                    </article>
                  </div>
                </section>

                {/* Footer note */}
                <footer className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <p>
                    If you have questions about this Privacy Policy or how Grow24 handles your data, please contact us at{' '}
                    <span className="font-mono text-slate-700 dark:text-slate-200">privacy@grow24.ai</span>.
                  </p>
                </footer>
              </>
            )}

            {activeTab === 'contact' && (
              <section className="space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-200">
                <p>
                  You can contact Grow24.ai about privacy, security, or data protection using the details below.
                  We aim to respond to most requests within a reasonable timeframe.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                      Primary contact
                    </h2>
                    <p>
                      Email:{' '}
                      <span className="font-mono text-slate-800 dark:text-slate-100">
                        privacy@grow24.ai
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Please do not include passwords or highly sensitive information in email.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                      Typical requests
                    </h2>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Questions about how your data is used.</li>
                      <li>Requests for access, correction, or deletion of personal data.</li>
                      <li>Reporting a potential security or privacy issue.</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default PrivacyPolicyPage

