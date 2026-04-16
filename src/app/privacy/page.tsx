import PageHeader from "@/components/PageHeader";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pb-8">
      <PageHeader title="Privacy Policy" subtitle="Last updated: April 2026" />

      <div className="px-5 pt-5 space-y-6 text-sm text-gray-700 leading-relaxed">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-blue-800 font-semibold text-sm">
            Your privacy is important to us. This policy explains how KreditBee collects, uses, and protects your personal information.
          </p>
        </div>

        {[
          {
            title: "1. Information We Collect",
            content: `We collect the following types of information:

Personal Identification:
• Full name, date of birth, gender
• PAN number, Aadhaar number
• Mobile number, email address
• Photograph and signature

Financial Information:
• Bank account details (account number, IFSC, bank name)
• Income details and employment information
• Credit history and score

Device & Usage Data:
• Device ID, IP address, location data
• App usage patterns and behavior
• Contact list (with your permission, for KYC purposes only)`,
          },
          {
            title: "2. How We Use Your Information",
            content: `Your information is used to:
• Process and evaluate loan applications
• Perform KYC verification as per RBI guidelines
• Assess creditworthiness and risk
• Disburse loans and collect repayments
• Send transactional SMS and email notifications
• Prevent fraud and ensure account security
• Comply with legal and regulatory requirements
• Improve our products and services`,
          },
          {
            title: "3. Information Sharing",
            content: `We share your data with:

Authorized Third Parties:
• Credit bureaus (CIBIL, Experian, Equifax, CRIF)
• Banking and payment partners for loan processing
• KYC verification agencies (UIDAI for Aadhaar)
• Cloud service providers (AWS, Google Cloud)

Legal Disclosure:
• Regulatory authorities (RBI, SEBI) as required
• Courts and law enforcement when legally required

We do NOT sell your personal data to advertisers or marketing companies.`,
          },
          {
            title: "4. Data Security",
            content: `We implement comprehensive security measures:
• 256-bit AES encryption for stored data
• TLS 1.3 for data in transit
• Multi-factor authentication for account access
• Regular security audits and penetration testing
• ISO 27001 compliant data centers
• Role-based access control for internal systems

Despite these measures, no system is 100% secure. We recommend you use strong, unique passwords and enable app lock.`,
          },
          {
            title: "5. Your Rights",
            content: `Under applicable laws, you have the right to:
• Access your personal data we hold
• Request correction of inaccurate data
• Request deletion of your data (subject to legal obligations)
• Withdraw consent for data processing
• Port your data to another service provider
• Lodge a complaint with data protection authorities

To exercise these rights, contact: privacy@kreditbee.in`,
          },
          {
            title: "6. Cookies & Tracking",
            content: `Our app and website use:
• Essential cookies for app functionality
• Analytics to understand usage patterns
• No advertising/tracking cookies

You can control cookie preferences in your device settings.`,
          },
          {
            title: "7. Data Retention",
            content: `We retain your data for:
• Active customers: Duration of the relationship + 8 years (as per RBI norms)
• Rejected applications: 6 months
• Deleted accounts: 3 years for audit purposes

After retention period, data is securely deleted or anonymized.`,
          },
          {
            title: "8. Contact Us",
            content: `Data Protection Officer: privacy@kreditbee.in
Phone: 1800-123-4567
Address: KreditBee Privacy Team, Bangalore - 560034

For any privacy concerns, you may also contact the Ministry of Electronics & Information Technology (MeitY) or other applicable regulatory bodies.`,
          },
        ].map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-gray-900 font-bold text-base mb-2">{title}</h2>
            <p className="text-gray-600 whitespace-pre-line">{content}</p>
          </div>
        ))}

        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-xs">
            © 2026 Krazybee Services Pvt. Ltd. All rights reserved.<br />
            Committed to protecting your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
