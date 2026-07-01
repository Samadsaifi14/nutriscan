export default function Privacy() {
  return (
    <div>
      <h1 className="text-h1" style={{ marginBottom: 16 }}>Privacy Policy</h1>
      <div className="stack--md text-sm" style={{ color: 'var(--sand)', lineHeight: 1.7 }}>
        <p>Your privacy matters to us. This policy explains how HealthOX collects, uses, and protects your data.</p>
        <h2 className="text-h3" style={{ color: 'var(--cream)', marginTop: 16 }}>What We Collect</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
          <li>Account information (name, email) via OAuth providers</li>
          <li>Product scan data (barcodes, images, nutrition info)</li>
          <li>Dietary preferences and health conditions you provide</li>
          <li>Anonymous usage analytics (if consented)</li>
        </ul>
        <h2 className="text-h3" style={{ color: 'var(--cream)', marginTop: 16 }}>How We Use It</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
          <li>To generate personalised health scores and insights</li>
          <li>To improve our product database and AI models</li>
          <li>To send occasional product or feature updates (opt-in)</li>
        </ul>
        <h2 className="text-h3" style={{ color: 'var(--cream)', marginTop: 16 }}>Data Storage</h2>
        <p>Data is stored on Supabase (PostgreSQL) in the EU region. We never sell your data.</p>
        <h2 className="text-h3" style={{ color: 'var(--cream)', marginTop: 16 }}>Your Rights</h2>
        <p>You can request data export or account deletion at any time from Settings.</p>
        <p style={{ marginTop: 24, color: 'var(--muted)', fontSize: 12 }}>Last updated: July 2025</p>
      </div>
    </div>
  )
}
