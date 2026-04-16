import PageHeader from "@/components/PageHeader";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pb-8">
      <PageHeader title="Terms & Conditions" subtitle="Last updated: April 2026" />

      <div className="px-5 pt-5 space-y-6 text-sm text-gray-700 leading-relaxed">
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p className="text-purple-800 font-semibold text-sm">
            Please read these Terms and Conditions carefully before using the KreditBee application.
            By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>

        {[
          {
            title: "1. About KreditBee",
            content: `KreditBee is a digital lending platform operated by Krazybee Services Private Limited, a Non-Banking Financial Company (NBFC) registered with the Reserve Bank of India (RBI). We provide personal loans, salary advances, and other credit products to eligible borrowers through our mobile application and website.

Our NBFC Registration Number: N-13.02268
CIN: U65999KA2016PTC089975
Registered Address: KreditBee, Bangalore, Karnataka - 560001`,
          },
          {
            title: "2. Eligibility Criteria",
            content: `To be eligible for KreditBee loans, you must:
• Be a resident Indian citizen
• Be between 21 and 60 years of age
• Have a valid PAN card
• Have a valid Aadhaar card linked to your mobile number
• Have a minimum monthly income of ₹10,000
• Have a valid bank account in India
• Have a credit score of 600 or above (CIBIL/Experian)

KreditBee reserves the right to reject any application at its sole discretion based on internal credit policies.`,
          },
          {
            title: "3. Loan Terms & Interest Rates",
            content: `Interest Rates: Starting from 1.5% per month (18% per annum). Rates vary based on your credit profile, loan amount, and tenure.

Processing Fees: 2% to 4% of the loan amount (plus applicable GST).

Late Payment Charges: ₹500 per EMI + 2% per month on overdue amount.

Prepayment: Allowed after 3 EMIs with no prepayment charges.

Loan amounts: ₹1,000 to ₹4,00,000
Tenure: 1 month to 36 months

Annual Percentage Rate (APR) ranges from 24% to 48% depending on the product and your credit profile. The exact rate will be communicated to you before loan disbursement.`,
          },
          {
            title: "4. KYC and Documentation",
            content: `KreditBee is required by RBI regulations to complete Know Your Customer (KYC) verification for all borrowers. You must provide:

• PAN Card (Permanent Account Number)
• Aadhaar Card for identity and address verification
• Bank account statements (last 3 months) may be required
• Income proof (salary slips/ITR for self-employed)

By submitting your Aadhaar details, you consent to KreditBee fetching your demographic data from UIDAI for verification purposes, subject to UIDAI guidelines.`,
          },
          {
            title: "5. Credit Bureau Consent",
            content: `By applying for a loan, you expressly authorize KreditBee to:
• Access your credit report from credit bureaus (CIBIL, Experian, Equifax, CRIF High Mark)
• Report your loan and repayment information to credit bureaus
• Use credit data for underwriting and credit decisioning

This consent is valid for the duration of your relationship with KreditBee.`,
          },
          {
            title: "6. Data Privacy & Security",
            content: `KreditBee collects and processes your personal data in accordance with our Privacy Policy and applicable data protection laws. We use:
• 256-bit SSL encryption for data transmission
• Secure cloud storage with access controls
• Biometric/OTP-based authentication

We do not sell your personal data to third parties. Data is shared with credit bureaus, banking partners, and regulatory authorities as required by law.`,
          },
          {
            title: "7. Repayment Obligations",
            content: `You agree to repay all loan amounts including principal, interest, fees, and charges as per the repayment schedule. Failure to pay on time may result in:

• Late payment charges
• Negative reporting to credit bureaus affecting your credit score
• Legal action for recovery
• Collection calls and visits by authorized representatives

EMI payments are collected via NACH (National Automated Clearing House) mandate or UPI/Net Banking.`,
          },
          {
            title: "8. Grievance Redressal",
            content: `If you have any complaints or grievances, please contact:

Grievance Officer: Mr. Rahul Sharma
Email: grievance@kreditbee.in
Phone: 1800-123-4567 (Toll Free, 9 AM - 6 PM, Mon-Sat)
Address: KreditBee, Koramangala, Bangalore - 560034

If not resolved within 30 days, you may escalate to:
RBI Ombudsman: https://ombudsman.rbi.org.in`,
          },
          {
            title: "9. Governing Law",
            content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka.

By using KreditBee services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.`,
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
            NBFC registered with RBI | CIN: U65999KA2016PTC089975
          </p>
        </div>
      </div>
    </div>
  );
}
