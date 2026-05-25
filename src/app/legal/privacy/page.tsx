import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | HealthOX',
  description: 'Privacy Policy for HealthOX - How we collect, use, and protect your data in compliance with Indian law.',
}

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-[#7a8fa6] mb-8">Last updated: May 2026</p>

      <div className="space-y-6 text-sm text-[#c8d6e0] leading-relaxed">
        <Section title="1. Data Controller">
          <p>
            Samad Saifi<br />
            New Delhi, Delhi, India<br />
            samadlylives00@gmail.com
          </p>
          <p className="mt-2">
            This Privacy Policy explains how HealthOX collects, uses, stores, and protects 
            your personal data when you use our web application. It complies with the 
            Digital Personal Data Protection Act (DPDP), 2023 of India and the Information 
            Technology Act, 2000.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <h3 className="font-bold text-white mt-3 mb-1">a. Account Information</h3>
          <p>
            When you sign in via Google or GitHub, we collect your name, email address, 
            and profile picture. This is used to identify you and provide account-related 
            features such as meal logging and history.
          </p>

          <h3 className="font-bold text-white mt-3 mb-1">b. Health Profile Data</h3>
          <p>
            You may voluntarily provide health information including:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>Health conditions (diabetes, high blood pressure, heart disease, cholesterol)</li>
            <li>Allergies (nuts, gluten, dairy, soy, shellfish, eggs)</li>
            <li>Dietary preferences (vegetarian, vegan, jain)</li>
          </ul>
          <p className="mt-1">
            This data is used solely to personalize ingredient analysis and provide 
            relevant health warnings. We do not share this data with third parties.
          </p>

          <h3 className="font-bold text-white mt-3 mb-1">c. Scan and Usage Data</h3>
          <p>
            We collect information about products you scan, meals you log, and your 
            interactions with the app. This helps us improve our service and provide 
            personalized insights.
          </p>

          <h3 className="font-bold text-white mt-3 mb-1">d. Analytics Data</h3>
          <p>
            We use Google Analytics to collect anonymized usage data including page views, 
            session duration, and app interactions. This helps us understand how the app 
            is used and improve it. You can opt out of analytics cookies (see our 
            <a href="/legal/cookies" className="text-emerald-400 hover:text-emerald-300 underline mx-1">Cookie Policy</a>).
          </p>
        </Section>

        <Section title="3. Legal Basis for Processing (DPDP Act 2023)">
          <p>
            We process your personal data based on your explicit consent. By creating an 
            account and using our services, you consent to the collection and use of your 
            data as described in this policy. You have the right to withdraw consent at 
            any time.
          </p>
        </Section>

        <Section title="4. How We Use Your Data">
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide personalized ingredient analysis and health warnings</li>
            <li>To enable meal logging and dashboard features</li>
            <li>To send weekly nutrition reports (with your permission)</li>
            <li>To improve our AI analysis and product database</li>
            <li>To analyze app usage patterns (anonymized)</li>
          </ul>
        </Section>

        <Section title="5. Data Sharing and Third Parties">
          <p>We share your data only with essential service providers:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Supabase</strong> — Database hosting and authentication. Your account data and health profile are stored here.</li>
            <li><strong>Groq</strong> — AI analysis of ingredients. Product data (not personal data) is sent for analysis.</li>
            <li><strong>Google Analytics</strong> — Anonymized usage analytics.</li>
            <li><strong>Open Food Facts</strong> — Product database queries (no personal data shared).</li>
          </ul>
          <p className="mt-2">
            We do not sell, rent, or trade your personal data to third parties.
          </p>
        </Section>

        <Section title="6. Data Storage and Security">
          <p>
            Your data is stored securely on Supabase servers. We implement appropriate 
            technical measures including:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>HTTPS encryption for all data in transit</li>
            <li>Security headers (HSTS, CSP, X-Frame-Options)</li>
            <li>Authentication via OAuth (Google/GitHub)</li>
            <li>Database access controls</li>
          </ul>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain your personal data for as long as your account is active. If you 
            remain inactive for 2 years, we may delete your data. You can request 
            deletion of your data at any time (see Your Rights below).
          </p>
        </Section>

        <Section title="8. Your Rights (DPDP Act 2023)">
          <p>You have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Right to Access</strong> — Request a copy of your data</li>
            <li><strong>Right to Correction</strong> — Update inaccurate data</li>
            <li><strong>Right to Deletion</strong> — Request deletion of your data</li>
            <li><strong>Right to Withdraw Consent</strong> — Opt out of data processing</li>
            <li><strong>Right to Grievance Redressal</strong> — File complaints about data handling</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at samadlylives00@gmail.com. We will 
            respond within 30 days as required by law.
          </p>
        </Section>

        <Section title="9. Email Communications">
          <p>
            If you opt in, we send weekly nutrition reports via email. You can 
            unsubscribe at any time through your profile settings or via the 
            unsubscribe link in emails. We do not send marketing or promotional emails.
          </p>
        </Section>

        <Section title="10. Cookies">
          <p>
            We use essential cookies for authentication (NextAuth) and analytics cookies 
            (Google Analytics). For full details, see our 
            <a href="/legal/cookies" className="text-emerald-400 hover:text-emerald-300 underline mx-1">Cookie Policy</a>.
          </p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>
            HealthOX is not intended for children under 13. We do not knowingly collect 
            data from children under 13. If you believe a child has provided us with 
            personal data, please contact us immediately.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically. Material changes will be 
            notified via email or through the app. We encourage you to review this 
            policy regularly.
          </p>
        </Section>

        <Section title="13. Grievance Officer">
          <p>
            In compliance with the Information Technology Act, 2000 and the DPDP Act, 2023, 
            the Grievance Officer for HealthOX is:
          </p>
          <p className="mt-1 text-emerald-400">
            Samad Saifi<br />
            New Delhi, Delhi, India<br />
            samadlylives00@gmail.com
          </p>
          <p className="mt-1">
            Complaints will be acknowledged within 24 hours and resolved within 30 days.
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
