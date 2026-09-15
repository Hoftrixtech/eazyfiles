import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { LegalList, LegalProse, LegalSection } from "@/components/legal/LegalProse";

export function TermsContent() {
  const updated = "September 15, 2026";

  return (
    <LegalProse>
      <p className="text-sm text-muted-foreground">Last updated: {updated}</p>

      <LegalSection title="Agreement">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of {APP_NAME}.com and the online tools
          we provide (collectively, the &quot;Service&quot;). By using the Service, you agree to these Terms. If you do not
          agree, do not use the Service.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility">
        <p>
          You must be able to form a binding contract in your jurisdiction to use the Service. You are responsible for
          ensuring your use complies with applicable laws.
        </p>
      </LegalSection>

      <LegalSection title="Permitted use">
        <p>You may use {APP_NAME} to process files you have the right to use, for lawful personal or business purposes.</p>
        <LegalList
          items={[
            "Use the image tools in accordance with posted access rules (including anonymous compression limits).",
            "Create an account to access tools that require sign-in.",
            "Download and use output files subject to your own rights in the source material.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Prohibited use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Upload content you do not have permission to use, or that is illegal, harmful, or infringing.",
            "Attempt to bypass usage limits, security controls, or access restrictions.",
            "Reverse engineer, scrape, or overload the Service in a way that harms availability.",
            "Use the Service to distribute malware or to harass others.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Your content and responsibilities">
        <p>
          You retain responsibility for files you upload and for how you use processed output. {APP_NAME} does not claim
          ownership of your files. You represent that you have the rights needed to upload and process your content.
        </p>
      </LegalSection>

      <LegalSection title="Tool availability and changes">
        <p>
          We may modify, suspend, or discontinue any part of the Service at any time. Tools, limits, and features may
          change as we improve {APP_NAME}. We do not guarantee uninterrupted availability.
        </p>
      </LegalSection>

      <LegalSection title="Accuracy and results">
        <p>
          Image processing results depend on your source file, settings, and format. File sizes and visual quality are
          approximate targets, not guaranteed exact outcomes. Review output before relying on it for important purposes.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The {APP_NAME} name, branding, website design, and underlying software are owned by us or our licensors and are
          protected by applicable intellectual property laws. These Terms do not grant you rights to our trademarks or
          code except as needed to use the Service.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
          IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {APP_NAME.toUpperCase()} AND ITS OPERATORS WILL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR GOODWILL,
          ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE IS LIMITED TO
          THE GREATER OF (A) AMOUNTS YOU PAID US FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) USD $0 IF
          THE SERVICE IS PROVIDED FREE OF CHARGE.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          We may suspend or terminate access to the Service if you violate these Terms or if we reasonably believe your
          use poses risk to the Service or others. You may stop using the Service at any time.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws applicable where {APP_NAME} is operated, without regard to conflict-of-law
          rules. Specific courts or venues are not designated here; resolve disputes in accordance with mandatory local
          consumer protections that apply to you.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms? Use the{" "}
          <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">contact page</Link>.
        </p>
      </LegalSection>
    </LegalProse>
  );
}
