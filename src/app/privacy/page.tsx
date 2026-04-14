export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
 
      <h2>1. What We Collect</h2>
      <p>HealthOX collects the following information when you use our app:</p>
      <ul>
        <li>Your Google account name and email (for sign-in only)</li>
        <li>Food products you scan (barcode and product name)</li>
        <li>Meals you log (product name, quantity, meal type)</li>
        <li>Optional health profile information (age, weight, height, health conditions) that you provide voluntarily</li>
      </ul>
 
      <h2>2. How We Use Your Data</h2>
      <ul>
        <li>To provide personalised AI health analysis of food products</li>
        <li>To calculate your daily calorie and nutrition tracking</li>
        <li>To send weekly health summary emails (only if you opt in)</li>
        <li>We do NOT sell your data to any third party</li>
        <li>We do NOT use your data for advertising</li>
      </ul>
 
      <h2>3. Third-Party Services</h2>
      <p>We use the following trusted third-party services:</p>
      <ul>
        <li><strong>Google OAuth</strong> — for sign-in</li>
        <li><strong>Supabase</strong> — for secure data storage (servers in your region)</li>
        <li><strong>Google Gemini AI</strong> — for food health analysis (product data only, no personal data sent)</li>
        <li><strong>Resend</strong> — for sending emails</li>
        <li><strong>Open Food Facts</strong> — for product nutrition data</li>
      </ul>
 
      <h2>4. Your Rights</h2>
      <p>You can:</p>
      <ul>
        <li>Delete your account and all data at any time from your Profile page</li>
        <li>Unsubscribe from all emails at any time</li>
        <li>Request a copy of your data by emailing us</li>
      </ul>
 
      <h2>5. Data Retention</h2>
      <p>We retain your data as long as your account is active. When you delete your account, all personal data is permanently deleted within 30 days.</p>
 
      <h2>6. Health Disclaimer</h2>
      <p>HealthOX provides AI-generated food health information for educational purposes only. This is NOT medical advice. Always consult a qualified nutritionist or doctor for medical decisions. AI analysis may contain errors.</p>
 
      <h2>7. Contact</h2>
      <p>For privacy concerns: healthox.app@gmail.com</p>
    </div>
  )
}