import Link from "next/link";
import { APP_NAME, SITE_URL } from "@/lib/constants";
import { LegalList, LegalProse, LegalSection, LegalSubsection } from "@/components/legal/LegalProse";

const linkClass = "text-foreground underline-offset-4 hover:underline";

export function PrivacyPolicyContent() {
  const updated = "September 19, 2026";

  return (
    <LegalProse>
      <p className="text-sm text-muted-foreground">
        <strong className="font-medium text-foreground">Last Updated:</strong> {updated}
      </p>

      <div className="space-y-4">
        <p>
          {APP_NAME} (&quot;{APP_NAME}&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the {APP_NAME}{" "}
          website and online file tools available at{" "}
          <Link href={SITE_URL} className={linkClass}>{SITE_URL}</Link>.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, process, store, and protect information when you visit our
          website, create an account, or use our online image tools.
        </p>
        <p>By using {APP_NAME}, you acknowledge the practices described in this Privacy Policy.</p>
      </div>

      <LegalSection title="1. Information We Collect">
        <p>We collect information that is necessary to provide and improve {APP_NAME} and its services.</p>
        <LegalSubsection title="1.1 Account Information">
          <p>When you create or access an {APP_NAME} account, we may collect information such as:</p>
          <LegalList
            items={[
              "Name",
              "Email address",
              "Google account information used for authentication",
              "User account identifiers",
              "Account creation and authentication information",
            ]}
          />
          <p>{APP_NAME} currently supports Google sign-in for account authentication.</p>
          <p>
            We use this information to create and maintain your account, authenticate you, provide access to
            account-based features, and communicate with you when necessary.
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="2. Uploaded Image Files">
        <p>{APP_NAME} provides online image tools including:</p>
        <LegalList items={["Image Compressor", "Image Resizer", "Image Cropper", "Image Converter"]} />
        <p>When you upload an image, the file is transmitted to our server for processing where required by the tool.</p>
        <p>Uploaded image files are processed for the specific task you request.</p>
        <LegalSubsection title="Temporary Processing">
          <p>Uploaded image files are processed temporarily and removed after processing.</p>
          <p>Image files are not stored in our database.</p>
          <p>We do not use uploaded images as a permanent file-storage service.</p>
          <p>
            You should avoid uploading files containing sensitive or confidential information unless you are comfortable
            with the processing described in this Privacy Policy.
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We may use information we collect to:</p>
        <LegalList
          items={[
            "Provide and operate EazyFiles tools",
            "Process uploaded images",
            "Create and manage user accounts",
            "Authenticate users",
            "Track applicable tool usage limits",
            "Maintain the security and reliability of the service",
            "Detect and prevent abuse or unauthorized activity",
            "Troubleshoot technical problems",
            "Improve website functionality and user experience",
            "Understand how visitors use our website",
            "Communicate with users when necessary",
            "Comply with applicable legal obligations",
          ]}
        />
        <p>
          We use information only for legitimate purposes related to operating, maintaining, improving, and protecting{" "}
          {APP_NAME}.
        </p>
      </LegalSection>

      <LegalSection title="4. Google Sign-In">
        <p>{APP_NAME} uses Google authentication to allow users to create or access an account.</p>
        <p>
          When you choose to sign in with Google, Google may provide us with information associated with your Google
          account, such as your name, email address, profile information, and authentication identifiers, depending on
          the permissions and configuration of the Google authentication service.
        </p>
        <p>We use this information to:</p>
        <LegalList
          items={[
            "Authenticate your account",
            "Create or maintain your EazyFiles account",
            "Associate your Google account with your EazyFiles account",
            "Provide account-based access to EazyFiles services",
            "Maintain account security",
          ]}
        />
        <p>{APP_NAME} does not receive your Google password.</p>
        <p>
          Your use of Google services is also subject to Google&apos;s own privacy policies and terms.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies and Similar Technologies">
        <p>
          {APP_NAME} may use cookies, local storage, session technologies, and similar technologies to operate the
          website and provide certain functionality.
        </p>
        <p>These technologies may be used for purposes such as:</p>
        <LegalList
          items={[
            "Maintaining login sessions",
            "Remembering necessary settings",
            "Security and authentication",
            "Measuring website usage",
            "Understanding website performance",
            "Preventing abuse and fraudulent activity",
            "Supporting advertising and analytics, where applicable",
          ]}
        />
        <p>
          Some cookies may be placed by third-party service providers that support functionality, analytics,
          authentication, or advertising.
        </p>
        <p>
          You can control or disable cookies through your browser settings. However, disabling certain cookies may
          affect some {APP_NAME} features, including authentication or other functionality.
        </p>
      </LegalSection>

      <LegalSection title="6. Analytics and Usage Information">
        <p>We may use analytics and similar technologies to understand how visitors interact with {APP_NAME}.</p>
        <p>This information may include:</p>
        <LegalList
          items={[
            "Pages visited",
            "Tool usage",
            "Browser type",
            "Device type",
            "Approximate geographic information",
            "Referring pages",
            "Website interactions",
            "Date and time of visits",
            "General technical information",
          ]}
        />
        <p>
          Analytics information helps us understand website performance, identify problems, improve our tools, and develop
          the {APP_NAME} platform.
        </p>
        <p>
          Where third-party analytics services are used, those providers may process information according to their own
          privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="7. Advertising">
        <p>
          {APP_NAME} may display advertising provided by third-party advertising partners, including Google, if
          advertising services are enabled on the website.
        </p>
        <p>
          Third-party advertising providers may use cookies, web beacons, IP addresses, or similar technologies to
          provide, measure, personalize, or improve advertisements.
        </p>
        <p>
          If Google advertising services are used, Google and its partners may use advertising cookies to serve ads based
          on a user&apos;s visit to {APP_NAME} or other websites, subject to applicable settings and policies.
        </p>
        <p>
          Users may have options to control personalized advertising through Google&apos;s advertising settings and other
          applicable privacy controls.
        </p>
        <p>
          For users in regions where consent is legally required, {APP_NAME} may use an appropriate consent mechanism
          before certain advertising cookies or personalized advertising technologies are used.
        </p>
      </LegalSection>

      <LegalSection title="8. Third-Party Services">
        <p>{APP_NAME} may use third-party services to operate and improve the website.</p>
        <p>These services may include providers for:</p>
        <LegalList
          items={[
            "Authentication",
            "Cloud hosting",
            "Database services",
            "Analytics",
            "Security",
            "Error monitoring",
            "Advertising",
            "Website infrastructure",
          ]}
        />
        <p>Third-party providers may process information on our behalf where necessary to provide their services.</p>
        <p>Examples of third-party services may include Google authentication and Google advertising services.</p>
        <p>Third-party services are governed by their respective privacy policies and terms.</p>
      </LegalSection>

      <LegalSection title="9. Database and Account Data">
        <p>{APP_NAME} stores certain account and service-related information in its database.</p>
        <p>This may include:</p>
        <LegalList
          items={[
            "Account information",
            "Email address",
            "Authentication information",
            "Account identifiers",
            "Tool usage information",
            "Service-related records",
          ]}
        />
        <p>
          Uploaded image files are separate from account database records and are not stored in the database as permanent
          user files.
        </p>
        <p>
          We retain account and service information for as long as reasonably necessary to provide the service, maintain
          security, comply with legal obligations, resolve disputes, and enforce our agreements.
        </p>
      </LegalSection>

      <LegalSection title="10. Data Security">
        <p>We take reasonable technical and organizational measures to protect information handled through {APP_NAME}.</p>
        <p>These measures may include:</p>
        <LegalList
          items={[
            "Secure connections using HTTPS",
            "Authentication controls",
            "Access controls",
            "Server-side security measures",
            "Protection of account information",
            "Monitoring for unauthorized activity",
          ]}
        />
        <p>
          However, no website, online service, or method of electronic transmission can be guaranteed to be completely
          secure.
        </p>
        <p>
          You are responsible for maintaining the security of your account credentials and for using appropriate caution
          when uploading files to online services.
        </p>
      </LegalSection>

      <LegalSection title="11. Data Retention">
        <p>We retain information only for as long as reasonably necessary for the purposes described in this Privacy Policy.</p>
        <p>
          Account-related information may be retained while your account remains active or as necessary to provide{" "}
          {APP_NAME} services.
        </p>
        <p>
          Uploaded image files are processed temporarily and removed after processing. They are not stored as permanent
          files in our database.
        </p>
        <p>Certain information may be retained for longer where necessary for:</p>
        <LegalList
          items={[
            "Legal compliance",
            "Security",
            "Fraud prevention",
            "Dispute resolution",
            "Enforcement of our agreements",
            "Technical or operational requirements",
          ]}
        />
      </LegalSection>

      <LegalSection title="12. Your Privacy Rights">
        <p>
          Depending on where you live and the laws that apply to you, you may have rights relating to your personal
          information.
        </p>
        <p>These rights may include:</p>
        <LegalList
          items={[
            "Requesting access to personal information we hold about you",
            "Requesting correction of inaccurate information",
            "Requesting deletion of certain personal information",
            "Requesting restriction of certain processing",
            "Objecting to certain processing",
            "Withdrawing consent where processing is based on consent",
            "Requesting information about how your data is processed",
          ]}
        />
        <p>The availability of these rights depends on applicable law and the circumstances of the request.</p>
        <p>To make a privacy-related request, contact us using the contact information provided below.</p>
        <p>We may need to verify your identity before completing certain requests.</p>
      </LegalSection>

      <LegalSection title="13. Account Deletion">
        <p>
          If you want to request deletion of your {APP_NAME} account or account-related information, contact us using the
          contact details provided below.
        </p>
        <p>
          When legally and technically appropriate, we will process the request and delete or anonymize applicable
          information.
        </p>
        <p>
          Some information may need to be retained where required by law, necessary for security, fraud prevention,
          dispute resolution, or other legitimate purposes.
        </p>
      </LegalSection>

      <LegalSection title="14. Children's Privacy">
        <p>{APP_NAME} is a general-purpose online tool platform.</p>
        <p>
          {APP_NAME} does not knowingly collect personal information from children in violation of applicable law.
        </p>
        <p>
          If you believe that a child has provided personal information to {APP_NAME} without appropriate authorization,
          please contact us so that we can review and take appropriate action.
        </p>
      </LegalSection>

      <LegalSection title="15. International Users">
        <p>{APP_NAME} may be accessed by users around the world.</p>
        <p>
          Depending on where you are located and where our service providers operate, information may be processed or
          stored in countries other than your country of residence.
        </p>
        <p>
          Where applicable, we take reasonable steps to handle personal information in accordance with applicable privacy
          and data protection requirements.
        </p>
        <p>For users in jurisdictions with specific privacy laws, additional rights or protections may apply.</p>
      </LegalSection>

      <LegalSection title="16. Legal Basis for Processing">
        <p>
          Where applicable law requires a legal basis for processing personal information, we may process information
          based on one or more of the following:
        </p>
        <LegalList
          items={[
            "Your consent",
            "Performance of a contract or provision of requested services",
            "Compliance with legal obligations",
            "Legitimate interests, where permitted by applicable law",
            "Protection of our services, users, and systems",
          ]}
        />
        <p>
          Where processing is based on consent, you may have the right to withdraw that consent, subject to applicable
          law.
        </p>
      </LegalSection>

      <LegalSection title="17. Changes to This Privacy Policy">
        <p>We may update this Privacy Policy from time to time to reflect changes to:</p>
        <LegalList
          items={[
            "EazyFiles services",
            "Website functionality",
            "Data processing practices",
            "Third-party services",
            "Advertising or analytics technologies",
            "Applicable legal requirements",
          ]}
        />
        <p>
          When we make changes, we will update the Last Updated date at the beginning of this Privacy Policy.
        </p>
        <p>We encourage you to review this page periodically to stay informed about how {APP_NAME} handles information.</p>
      </LegalSection>

      <LegalSection title="18. Contact Us">
        <p>
          If you have questions about this Privacy Policy, our data practices, or your privacy rights, please contact us.
        </p>
        <p>
          <strong className="font-medium text-foreground">Website:</strong> {APP_NAME}
        </p>
        <p>
          <strong className="font-medium text-foreground">Website URL:</strong>{" "}
          <Link href={SITE_URL} className={linkClass}>{SITE_URL}</Link>
        </p>
        <p>
          <strong className="font-medium text-foreground">Email:</strong>{" "}
          <Link href="/contact" className={linkClass}>Contact form</Link> — choose &quot;Privacy or data request&quot; for
          privacy-related messages.
        </p>
      </LegalSection>

      <LegalSection title="19. Important Notice">
        <p>
          This Privacy Policy is intended to explain {APP_NAME}&apos; data practices in clear language. It does not
          replace legal advice and should be reviewed against the laws and regulations applicable to the business and
          the locations in which {APP_NAME} operates.
        </p>
      </LegalSection>
    </LegalProse>
  );
}
