import "server-only";

export type ResolvedSmtpConfig =
  | {
      mode: "url";
      url: string;
    }
  | {
      mode: "host";
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
    };

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === "") {
    return defaultValue;
  }
  return value === "true";
}

export function resolveSmtpConfig(): ResolvedSmtpConfig | null {
  const url = process.env.SMTP_URL?.trim();
  if (url) {
    return { mode: "url", url };
  }

  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !portRaw || !user || !pass) {
    return null;
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) {
    return null;
  }

  const secure = parseBoolean(process.env.SMTP_SECURE, port === 465);

  return { mode: "host", host, port, secure, user, pass };
}

export function isSmtpEnvConfigured(): boolean {
  return resolveSmtpConfig() !== null;
}
