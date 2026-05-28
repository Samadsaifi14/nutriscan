import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | BioYou',
  description: 'Cookie Policy for BioYou - How we use cookies and your choices.',
}

export default function CookiesPage() {
  return (
    <>
      <h1 className="text-3xl font-black text-white mb-2">Cookie Policy</h1>
      <p className="text-sm text-[#7a8fa6] mb-8">Last updated: May 2026</p>

      <div className="space-y-6 text-sm text-[#c8d6e0] leading-relaxed">
        <Section title="What Are Cookies">
          <p>
            Cookies are small text files stored on your device by your web browser. 
            They help websites remember your preferences, authenticate your session, 
            and understand how you use the site.
          </p>
        </Section>

        <Section title="Cookies We Use">
          <h3 className="font-bold text-white mt-3 mb-1">a. Essential Cookies</h3>
          <p>
            These cookies are necessary for the app to function properly:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li><strong>next-auth.session-token</strong> — Maintains your login session. Persistent for up to 30 days.</li>
            <li><strong>__Secure-next-auth.session-token</strong> — Secure version of session token.</li>
          </ul>
          <p className="mt-1">
            These cookies do not require consent as they are essential for providing 
            the service you request.
          </p>

          <h3 className="font-bold text-white mt-3 mb-1">b. Analytics Cookies</h3>
          <p>
            We use Google Analytics to understand how the app is used:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li><strong>_ga</strong> — Used to distinguish users. Expires after 2 years.</li>
            <li><strong>_gid</strong> — Used to distinguish users. Expires after 24 hours.</li>
            <li><strong>_gat</strong> — Used to throttle request rate. Expires after 1 minute.</li>
          </ul>
          <p className="mt-1">
            These cookies collect anonymized data (page views, session duration, 
            app interactions). We do not track individual users. You may reject 
            these cookies via the cookie banner shown on your first visit.
          </p>
        </Section>

        <Section title="Third-Party Cookies">
          <p>
            Google Analytics is a third-party service provided by Google LLC. 
            Their use of cookies is governed by 
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline mx-1">
              Google's Privacy Policy
            </a>.
            We do not control Google's cookies.
          </p>
        </Section>

        <Section title="Your Choices">
          <p>
            When you first visit BioYou, you will see a cookie banner asking for 
            your consent to analytics cookies. You can:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Accept All</strong> — Allow essential and analytics cookies</li>
            <li><strong>Reject Analytics</strong> — Allow only essential cookies</li>
          </ul>
          <p className="mt-2">
            You can also manage cookies through your browser settings. Instructions 
            for common browsers:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">Firefox</a></li>
            <li><a href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-8013406a-13e1-4a5b-4b7d-9c2a4c1e2d9e" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">Microsoft Edge</a></li>
          </ul>
        </Section>

        <Section title="Do Not Track">
          <p>
            Some browsers support a "Do Not Track" (DNT) feature. BioYou does not 
            currently respond to DNT signals. We will update this policy if this 
            changes in the future.
          </p>
        </Section>

        <Section title="Updates">
          <p>
            We may update this Cookie Policy from time to time. Changes will be 
            posted on this page with an updated "Last updated" date.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For questions about this Cookie Policy, contact:
          </p>
          <p className="mt-1 text-emerald-400">
            Samad Saifi<br />
            samadlylives00@gmail.com
          </p>
        </Section>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-2">{title}</h2>
      <div className="text-sm text-[#c8d6e0] leading-relaxed">{children}</div>
    </div>
  )
}
