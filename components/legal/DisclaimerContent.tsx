import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { LegalList, LegalProse, LegalSection } from "@/components/legal/LegalProse";

export function DisclaimerContent() {
  return (
    <LegalProse>
      <LegalSection title="General">
        <p>
          {APP_NAME} provides online utility tools to help with everyday file and image tasks. Information on this website
          and results from our tools are provided for general convenience, not as professional, legal, or technical advice.
        </p>
      </LegalSection>

      <LegalSection title="Your files">
        <p>You are responsible for:</p>
        <LegalList
          items={[
            "Files you choose to upload and whether you have the right to use them.",
            "Keeping backups of important originals before processing.",
            "Reviewing output before publishing, printing, or sharing it.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Processing results">
        <p>
          Compression, resizing, cropping, and conversion can change file size, dimensions, and appearance. Results vary by
          source image, format, and settings. {APP_NAME} does not guarantee that every target size, dimension, or visual
          outcome will be achievable for every file.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          Tools and content are provided without warranties. Use them at your own risk. See our{" "}
          <Link href="/terms" className="text-foreground underline-offset-4 hover:underline">Terms of Service</Link> for
          full legal terms.
        </p>
      </LegalSection>

      <LegalSection title="External links">
        <p>
          The site may link to third-party services (for example Google sign-in). We are not responsible for third-party
          sites or services.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Report issues or ask questions via the{" "}
          <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">contact page</Link>.
        </p>
      </LegalSection>
    </LegalProse>
  );
}
