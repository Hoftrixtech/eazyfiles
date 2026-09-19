import Link from "next/link";
import { ANONYMOUS_COMPRESSOR_LIMIT, APP_NAME, SITE_URL } from "@/lib/constants";
import { LegalList, LegalProse, LegalSection } from "@/components/legal/LegalProse";

const linkClass = "text-foreground underline-offset-4 hover:underline";

export function TermsContent() {
  const updated = "September 19, 2026";

  return (
    <LegalProse>
      <p className="text-sm text-muted-foreground">
        <strong className="font-medium text-foreground">Last Updated:</strong> {updated}
      </p>

      <div className="space-y-4">
        <p>
          Welcome to {APP_NAME}. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the {APP_NAME}{" "}
          website and online file tools available at{" "}
          <Link href={SITE_URL} className={linkClass}>{SITE_URL}</Link>.
        </p>
        <p>
          By accessing or using {APP_NAME}, you agree to these Terms. If you do not agree with these Terms, please do not
          use the website or its services.
        </p>
      </div>

      <LegalSection title="1. Welcome to EazyFiles">
        <p>
          Welcome to {APP_NAME}. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the {APP_NAME}{" "}
          website and online file tools available at{" "}
          <Link href={SITE_URL} className={linkClass}>{SITE_URL}</Link>.
        </p>
        <p>
          By accessing or using {APP_NAME}, you agree to these Terms. If you do not agree with these Terms, please do not
          use the website or its services.
        </p>
      </LegalSection>

      <LegalSection title="2. About EazyFiles">
        <p>{APP_NAME} is an online file tools platform designed to make common digital file tasks easier.</p>
        <p>Our currently available image tools include:</p>
        <LegalList items={["Image Compressor", "Image Resizer", "Image Cropper", "Image Converter"]} />
        <p>Additional tools and features may be introduced in the future.</p>
      </LegalSection>

      <LegalSection title="3. Eligibility">
        <p>You may use {APP_NAME} only if you are legally permitted to do so under the laws applicable to you.</p>
        <p>
          If you use {APP_NAME} on behalf of a business, organization, or another person, you confirm that you have the
          authority to accept these Terms on their behalf.
        </p>
      </LegalSection>

      <LegalSection title="4. Using EazyFiles">
        <p>You agree to use {APP_NAME} only for lawful purposes and in accordance with these Terms.</p>
        <p>You must not use {APP_NAME} to:</p>
        <LegalList
          items={[
            "Upload or process unlawful, harmful, or abusive content",
            "Upload files that you do not have the right or permission to use",
            "Attempt to interfere with or disrupt the website",
            "Attempt to gain unauthorized access to accounts, systems, or services",
            "Circumvent usage limits or security controls",
            "Abuse, overload, or misuse the available tools",
            "Introduce malware, viruses, or other harmful code",
            "Use automated methods to abuse or excessively access the service",
            "Use the service in violation of applicable laws or regulations",
          ]}
        />
        <p>
          We may restrict or suspend access if we reasonably believe that the service is being misused or these Terms are
          being violated.
        </p>
      </LegalSection>

      <LegalSection title="5. Uploaded Files">
        <p>
          When you upload an image to {APP_NAME}, you are responsible for the content of that file and for having the
          necessary rights or permissions to upload and process it.
        </p>
        <p>{APP_NAME} processes uploaded images for the specific tool operation you request.</p>
        <p>
          Uploaded image files are processed temporarily and removed after processing. Image files are not stored as
          permanent files in our database.
        </p>
        <p>{APP_NAME} is not intended to be used as a permanent file-storage or backup service.</p>
        <p>You should keep your own copy of any important files before using an online processing service.</p>
      </LegalSection>

      <LegalSection title="6. Image Processing">
        <p>{APP_NAME} provides tools that may compress, resize, crop, or convert images.</p>
        <p>
          The resulting file may vary depending on the original image, selected settings, file format, and other
          technical factors.
        </p>
        <p>
          For example, when using the Image Compressor, selecting a target file size does not guarantee that the
          resulting file will have exactly the selected number of bytes. The compressor aims to produce a file at or below
          the selected target size where technically possible.
        </p>
        <p>You are responsible for reviewing the resulting file before using it for important purposes.</p>
      </LegalSection>

      <LegalSection title="7. Anonymous Usage">
        <p>Some {APP_NAME} tools may be available without creating an account.</p>
        <p>
          The Image Compressor currently allows users without an account to complete up to{" "}
          <strong className="font-medium text-foreground">{ANONYMOUS_COMPRESSOR_LIMIT} successful image compressions</strong>.
        </p>
        <p>
          After reaching the applicable anonymous usage limit, you may be required to sign in or create an account to
          continue using the service.
        </p>
        <p>Usage limits may be changed in the future as {APP_NAME} develops its services.</p>
      </LegalSection>

      <LegalSection title="8. User Accounts">
        <p>Certain {APP_NAME} features require an account.</p>
        <p>
          You may create an account using the authentication methods made available by {APP_NAME}, including Google
          Sign-In.
        </p>
        <p>You are responsible for:</p>
        <LegalList
          items={[
            "Providing accurate account information",
            "Maintaining the security of your account",
            "Keeping your authentication information secure",
            "Using your account only for authorized purposes",
          ]}
        />
        <p>You should notify us if you believe that your account has been accessed or used without authorization.</p>
      </LegalSection>

      <LegalSection title="9. Google Sign-In">
        <p>{APP_NAME} may use Google authentication to provide account access.</p>
        <p>
          When you sign in using Google, your use of Google&apos;s authentication services is also subject to
          Google&apos;s applicable terms and privacy policies.
        </p>
        <p>{APP_NAME} does not receive or store your Google account password.</p>
      </LegalSection>

      <LegalSection title="10. Service Availability">
        <p>
          We aim to keep {APP_NAME} available and functional, but we do not guarantee that the website or any individual
          tool will always be available, uninterrupted, or error-free.
        </p>
        <p>The service may occasionally be unavailable due to:</p>
        <LegalList
          items={[
            "Maintenance",
            "Updates",
            "Technical problems",
            "Hosting or infrastructure issues",
            "Security incidents",
            "Third-party service interruptions",
            "Events outside our reasonable control",
          ]}
        />
        <p>We may modify, suspend, or discontinue any feature or tool at any time.</p>
      </LegalSection>

      <LegalSection title="11. Free Services">
        <p>{APP_NAME} currently provides access to its available tools without requiring a paid subscription.</p>
        <p>Certain tools may have usage limits, account requirements, or other restrictions.</p>
        <p>
          We may introduce additional features, plans, or service models in the future. Any applicable terms or pricing
          will be communicated before they apply to the relevant service.
        </p>
      </LegalSection>

      <LegalSection title="12. Intellectual Property">
        <p>
          The {APP_NAME} website, branding, logo, design, software, original content, text, graphics, and other materials
          provided by {APP_NAME} are owned by or licensed to {APP_NAME} unless otherwise stated.
        </p>
        <p>
          You may use {APP_NAME} for its intended purpose, but these Terms do not transfer ownership of {APP_NAME}{" "}
          intellectual property to you.
        </p>
        <p>
          You retain your rights to files and content that you upload, subject to the rights and permissions necessary for{" "}
          {APP_NAME} to process those files as requested.
        </p>
      </LegalSection>

      <LegalSection title="13. Third-Party Services">
        <p>
          {APP_NAME} may rely on third-party services for functions such as authentication, hosting, database
          infrastructure, security, analytics, advertising, and other technical services.
        </p>
        <p>Third-party services may have their own terms and privacy policies.</p>
        <p>
          {APP_NAME} is not responsible for the independent policies, availability, or actions of third-party services.
        </p>
      </LegalSection>

      <LegalSection title="14. Advertising">
        <p>{APP_NAME} may display advertisements from third-party advertising providers.</p>
        <p>
          Advertising services may use technologies such as cookies or similar technologies according to their applicable
          policies.
        </p>
        <p>
          The presence of an advertisement on {APP_NAME} does not mean that {APP_NAME} endorses or guarantees the
          advertised product or service.
        </p>
      </LegalSection>

      <LegalSection title="15. Prohibited Activities">
        <p>You may not use {APP_NAME} to:</p>
        <LegalList
          items={[
            "Violate any applicable law or regulation",
            "Infringe intellectual property or privacy rights",
            "Distribute malicious software",
            "Attempt unauthorized access to EazyFiles systems",
            "Circumvent technical restrictions or usage limits",
            "Interfere with the normal operation of the service",
            "Conduct activities that could damage, overload, or disrupt EazyFiles infrastructure",
            "Abuse automated requests or scraping systems",
            "Use EazyFiles for fraudulent or deceptive activities",
          ]}
        />
        <p>We reserve the right to take appropriate action against misuse of the service.</p>
      </LegalSection>

      <LegalSection title='16. Disclaimer'>
        <p>
          {APP_NAME} is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the extent permitted by applicable law.
        </p>
        <p>We do not guarantee that:</p>
        <LegalList
          items={[
            "The service will always be available",
            "Processing will always produce a specific result",
            "A converted or compressed file will meet a particular technical requirement",
            "The website will always be free from errors or interruptions",
            "The service will meet every specific use case or requirement",
          ]}
        />
        <p>You are responsible for reviewing processed files before relying on them for important purposes.</p>
      </LegalSection>

      <LegalSection title="17. Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, {APP_NAME} and its operators will not be responsible for
          indirect, incidental, special, consequential, or similar damages arising from your use of or inability to use
          the website or its services.
        </p>
        <p>
          This may include loss of data, business interruption, loss of profits, or other losses resulting from the use of
          the service.
        </p>
        <p>
          Nothing in these Terms is intended to exclude or limit liability where such limitation is not permitted by
          applicable law.
        </p>
      </LegalSection>

      <LegalSection title="18. Account Suspension or Termination">
        <p>We may suspend, restrict, or terminate access to an account or the {APP_NAME} service if:</p>
        <LegalList
          items={[
            "You violate these Terms",
            "You misuse the service",
            "Your activity creates a security or operational risk",
            "Required by law",
            "Necessary to protect EazyFiles, its users, or its infrastructure",
          ]}
        />
        <p>You may stop using {APP_NAME} at any time.</p>
      </LegalSection>

      <LegalSection title="19. Privacy">
        <p>
          Your use of {APP_NAME} is also subject to our Privacy Policy, which explains how information is collected,
          processed, used, and protected.
        </p>
        <p>
          Please review our{" "}
          <Link href="/privacy" className={linkClass}>Privacy Policy</Link> to understand how {APP_NAME} handles
          information.
        </p>
      </LegalSection>

      <LegalSection title="20. Changes to These Terms">
        <p>
          We may update these Terms from time to time to reflect changes to {APP_NAME}, its features, business practices,
          or applicable legal requirements.
        </p>
        <p>When changes are made, we will update the &quot;Last Updated&quot; date at the beginning of this page.</p>
        <p>
          Your continued use of {APP_NAME} after updated Terms become effective means that you accept the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="21. Governing Law">
        <p>
          These Terms are subject to the laws applicable to {APP_NAME} and its operation, without limiting any mandatory
          consumer or privacy rights that may apply to users under the laws of their jurisdiction.
        </p>
        <p>
          Where required by applicable law, disputes will be handled by the courts or authorities having appropriate
          jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="22. Contact Us">
        <p>If you have questions about these Terms of Service, please contact us.</p>
        <p>
          <strong className="font-medium text-foreground">Website:</strong> {APP_NAME}
        </p>
        <p>
          <strong className="font-medium text-foreground">Website URL:</strong>{" "}
          <Link href={SITE_URL} className={linkClass}>{SITE_URL}</Link>
        </p>
        <p>
          <strong className="font-medium text-foreground">Email:</strong>{" "}
          <Link href="/contact" className={linkClass}>Contact form</Link> on our website.
        </p>
      </LegalSection>

      <LegalSection title="23. Acceptance of These Terms">
        <p>
          By accessing or using {APP_NAME}, you acknowledge that you have read, understood, and agreed to these Terms of
          Service.
        </p>
        <p>If you do not agree with these Terms, please discontinue use of {APP_NAME}.</p>
      </LegalSection>
    </LegalProse>
  );
}
