import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { LegalList, LegalProse, LegalSection } from "@/components/legal/LegalProse";

export function PrivacyPolicyContent() {
  const updated = "September 15, 2026";

  return (
    <LegalProse>
      <p className="text-sm text-muted-foreground">Last updated: {updated}</p>

      <LegalSection title="Overview">
        <p>
          This Privacy Policy describes how {APP_NAME} (&quot;we&quot;, &quot;us&quot;) handles information when you visit{" "}
          {APP_NAME}.com and use our online tools. We aim to be clear about what we collect, why we collect it, and what we
          do not do (for example, we do not store your uploaded image files in our database).
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>Depending on how you use the site, we may process:</p>
        <LegalList
          items={[
            "Account information you provide when you register (such as name and email address) or receive from Google when you sign in with Google.",
            "Authentication and session data needed to keep you signed in and to enforce tool access rules.",
            "Technical usage information such as compression counts tied to your session or account, tool job metadata, and standard server logs.",
            "Information you submit through our contact form (name, email, subject, and message) when you choose to contact us.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Account information">
        <p>
          If you create an account, we store your name and email address in our database. If you register with a
          password, we store a hashed version of your password — not the plain text password. If you use Google sign-in,
          we receive profile information from Google (such as your name and email) according to your Google account
          settings and link it to your {APP_NAME} account.
        </p>
      </LegalSection>

      <LegalSection title="Uploaded files">
        <p>
          When you use an image tool, you upload a file so we can process it on our servers. Image bytes are written to a
          temporary folder on the server for processing and are removed when that operation finishes. We do not store the
          contents of your uploaded images in our application database.
        </p>
        <p>
          We do store limited metadata about processing jobs (for example original file name, formats, file sizes, target
          size, compression percentage, session identifier, and status) to operate the service, enforce usage limits,
          and troubleshoot issues.
        </p>
      </LegalSection>

      <LegalSection title="How files are processed">
        <p>
          Processing happens on {APP_NAME} servers using server-side image libraries. The optimized file is returned to
          your browser for download. Temporary working files are deleted as part of the processing workflow; we do not
          design the service to keep copies of your images after processing completes.
        </p>
      </LegalSection>

      <LegalSection title="Usage and technical information">
        <p>
          To operate free access rules (such as anonymous compression limits and signed-in daily limits), we record usage
          counters linked to a session identifier or your account. We may also process basic technical data such as IP
          address, browser type, and request timestamps in server logs for security, abuse prevention, and reliability.
        </p>
      </LegalSection>

      <LegalSection title="Cookies and similar technologies">
        <p>
          We use cookies and similar storage to run the site. This includes an HttpOnly session cookie (and related
          session identifiers) used to recognize your browser session, apply usage limits, and maintain sign-in state.
          Anonymous session identifiers may also be stored in your browser&apos;s local storage so the site can continue
          counting usage across visits.
        </p>
        <p>Auth.js / NextAuth session cookies apply when you log in or use Google sign-in.</p>
      </LegalSection>

      <LegalSection title="Analytics">
        <p>
          We do not currently use third-party analytics products (such as Google Analytics) on {APP_NAME}. If we add
          analytics in the future, we will update this policy to describe what is collected and how you can control it.
        </p>
      </LegalSection>

      <LegalSection title="Advertising">
        <p>
          {APP_NAME} does not currently display third-party advertising on the site. If we introduce advertising in the
          future, we will update this policy to explain what data may be used for ads and any choices available to you.
        </p>
      </LegalSection>

      <LegalSection title="Google services">
        <p>
          If you choose &quot;Continue with Google&quot;, Google&apos;s privacy policy and terms apply to information Google
          processes. {APP_NAME} receives limited account details from Google to create or sign you in to your account.
          Google OAuth credentials are used only to enable that sign-in flow.
        </p>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          Account data is kept while your account is active and as needed to provide the service. Usage records and job
          metadata are retained for operational, security, and limit-enforcement purposes. Server logs are kept for a
          limited period appropriate for security and troubleshooting. Uploaded image files are not retained in our
          database; temporary server files are removed after processing.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We use reasonable technical and organizational measures to protect information we process, including encrypted
          transport (HTTPS), hashed passwords, and access controls on infrastructure. No method of transmission or
          storage is completely secure; we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="Your rights and choices">
        <p>
          Depending on where you live, you may have rights to access, correct, or delete personal information we hold
          about you. You can update account details by signing in. You may request account deletion or other privacy
          requests by contacting us through the{" "}
          <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">contact page</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Children's privacy">
        <p>
          {APP_NAME} is not directed at children under 13, and we do not knowingly collect personal information from
          children. If you believe a child has provided us information, contact us and we will take appropriate steps.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will post the revised version on this page and update
          the &quot;Last updated&quot; date. Continued use of the site after changes means you accept the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For privacy questions, use our{" "}
          <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">contact form</Link>. We
          do not list a public support inbox until one is officially published on this site.
        </p>
      </LegalSection>
    </LegalProse>
  );
}
