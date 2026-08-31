export default function Cookies() {
  return (
    <div>
      <h1 className="text-h1" style={{ marginBottom: 16 }}>Cookie Policy</h1>
      <div className="stack--md text-sm" style={{ color: 'var(--sand)', lineHeight: 1.7 }}>
        <p>NutriScan uses cookies and similar technologies to improve your experience and measure usage.</p>
        <h2 className="text-h3" style={{ color: 'var(--cream)', marginTop: 16 }}>Essential Cookies</h2>
        <p>These are required for the app to function: session tokens, CSRF protection, and local storage for scan results.</p>
        <h2 className="text-h3" style={{ color: 'var(--cream)', marginTop: 16 }}>Analytics Cookies</h2>
        <p>We use Google Analytics (GA4) to understand how the app is used. This is opt-in only. If you consent, GA4 may set cookies to track page views and feature usage.</p>
        <h2 className="text-h3" style={{ color: 'var(--cream)', marginTop: 16 }}>Managing Cookies</h2>
        <p>You can control cookie preferences via the cookie banner shown on your first visit. Analytics consent can be revoked at any time by clearing your browser cookies.</p>
        <h2 className="text-h3" style={{ color: 'var(--cream)', marginTop: 16 }}>Third Parties</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
          <li>Google Analytics (privacy policy: policies.google.com)</li>
          <li>NextAuth (session cookies)</li>
        </ul>
        <p style={{ marginTop: 24, color: 'var(--muted)', fontSize: 12 }}>Last updated: July 2025</p>
      </div>
    </div>
  )
}
