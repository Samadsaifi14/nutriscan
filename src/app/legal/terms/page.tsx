import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | HealthOX',
  description: 'Terms of Service for HealthOX - Your food health analysis platform.',
}

export default function TermsPage() {
  return (
    <>
      <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
      <p className="text-sm text-[#7a8fa6] mb-8">Last updated: May 2026</p>

      <div className="space-y-6 text-sm text-[#c8d6e0] leading-relaxed">
        <Section title="1. Introduction">
          <p>
            Welcome to HealthOX. These Terms of Service govern your use of the HealthOX web application, 
            operated by Samad Saifi from New Delhi, Delhi, India. By accessing or using HealthOX, 
            you agree to be bound by these terms.
          </p>
          <p className="mt-2">
            HealthOX is an intermediary within the meaning of the Information Technology Act, 2000 
            and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) 
            Rules, 2021. As an intermediary, we provide a platform for scanning and analyzing food 
            products and do not control or endorse the content of third-party product data sourced 
            from Open Food Facts.
          </p>
        </Section>

        <Section title="2. Acceptance of Terms">
          <p>
            By creating an account, scanning a product, or accessing any part of HealthOX, 
            you confirm that you have read, understood, and agree to these Terms of Service 
            and our Privacy Policy. If you do not agree, you must not use the app.
          </p>
        </Section>

        <Section title="3. Eligibility">
          <p>
            You must be at least 13 years of age to use HealthOX. By using the app, 
            you represent that you meet this requirement. If you are under 18, 
            you represent that you have obtained consent from a parent or guardian.
          </p>
        </Section>

        <Section title="4. User Accounts">
          <p>
            You may sign in using Google or GitHub authentication. You are responsible for 
            maintaining the confidentiality of your account and for all activities that occur 
            under your account. You agree to notify us immediately of any unauthorized use 
            of your account at samadlylives00@gmail.com.
          </p>
          <p className="mt-2">
            If you are under 18 years of age, you represent that you have obtained verifiable 
            parental or guardian consent to use HealthOX. We collect age information during 
            profile setup and require parental consent acknowledgment for users under 18.
          </p>
        </Section>

        <Section title="5. Description of Services">
          <p>
            HealthOX provides the following services:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Barcode scanning and product identification</li>
            <li>Nutritional analysis and health scoring (1-10)</li>
            <li>AI-powered ingredient analysis with personalized warnings</li>
            <li>Meal logging and tracking</li>
            <li>Healthier alternative product recommendations</li>
            <li>Shopping links to online retailers</li>
          </ul>
        </Section>

        <Section title="6. Medical Disclaimer">
          <p className="font-bold text-amber-400">
            HealthOX does not provide medical advice. All health scores, ingredient analyses, 
            and recommendations are algorithm-generated for informational and educational 
            purposes only. They are not a substitute for professional medical advice, 
            diagnosis, or treatment.
          </p>
          <p className="mt-2">
            Always consult a qualified healthcare professional before making any dietary 
            changes, especially if you have a medical condition. See our full 
            <a href="/legal/disclaimer" className="text-emerald-400 hover:text-emerald-300 underline mx-1">Medical Disclaimer</a> 
            for more details.
          </p>
        </Section>

        <Section title="7. User Content">
          <p>
            You may submit product corrections, contributions, and feedback through the app. 
            By submitting content, you grant HealthOX a non-exclusive, royalty-free, 
            worldwide license to use, store, and display such content to improve the service. 
            You represent that your submissions are accurate and not misleading.
          </p>
        </Section>

        <Section title="8. Prohibited Uses">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Use the app for any unlawful purpose</li>
            <li>Submit false or misleading product data</li>
            <li>Scrape, crawl, or collect data from the app without authorization</li>
            <li>Interfere with the app's functionality or security</li>
            <li>Use the app to diagnose or treat medical conditions</li>
          </ul>
        </Section>

        <Section title="9. Intellectual Property">
          <p>
            The HealthOX name, logo, and app content (excluding data sourced from 
            Open Food Facts) are owned by Samad Saifi. You may not reproduce, distribute, 
            or create derivative works without prior written permission. Product data 
            sourced from Open Food Facts is used under the Open Database License (ODbL).
          </p>
        </Section>

        <Section title="10. Third-Party Services">
          <p>
            HealthOX integrates with third-party services including:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Open Food Facts — for product data</li>
            <li>Groq — for AI-powered ingredient analysis</li>
            <li>Supabase — for database and authentication</li>
            <li>Google Analytics — for usage analytics</li>
            <li>Amazon Associates — for affiliate shopping links</li>
          </ul>
          <p className="mt-2">
            We are not responsible for the accuracy, availability, or content of third-party services.
          </p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, HealthOX and its operator 
            shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising from your use of the app. The app is provided 
            &ldquo;as is&rdquo; without warranties of any kind, express or implied.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These terms shall be governed by and construed in accordance with the laws of 
            India. Any disputes arising under these terms shall be subject to the exclusive 
            jurisdiction of the courts in New Delhi, Delhi.
          </p>
        </Section>

        <Section title="13. Changes to Terms">
          <p>
            We reserve the right to modify these terms at any time. Material changes will 
            be notified via email or through the app. Continued use after changes 
            constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section title="14. Grievance Officer & Contact">
          <p>
            In compliance with the Information Technology Act, 2000 and the IT (Intermediary 
            Guidelines) Rules, 2021, the Grievance Officer for HealthOX is:
          </p>
          <p className="mt-1 text-emerald-400">
            Samad Saifi<br />
            New Delhi, Delhi, India<br />
            samadlylives00@gmail.com
          </p>
          <p className="mt-1">
            For questions about these Terms of Service or to report any grievances, please 
            contact the Grievance Officer at the email above. Complaints will be acknowledged 
            within 24 hours and resolved within 15 days.
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
