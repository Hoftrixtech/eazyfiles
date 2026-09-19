const CONTACT_TOPIC_ENTRIES = [
  { value: "image-tools", label: "Image Tool Support" },
  { value: "account", label: "Account & Sign-In" },
  { value: "technical", label: "Technical Issue" },
  { value: "privacy", label: "Privacy Question" },
  { value: "feedback", label: "General Feedback" },
  { value: "other", label: "Other" },
] as const;

export type ContactTopicValue = (typeof CONTACT_TOPIC_ENTRIES)[number]["value"];

export const CONTACT_TOPIC_OPTIONS = [
  { value: "", label: "Choose a topic" },
  ...CONTACT_TOPIC_ENTRIES,
] as const;

export const CONTACT_TOPIC_VALUES: readonly ContactTopicValue[] = CONTACT_TOPIC_ENTRIES.map(
  (entry) => entry.value
);

export function contactTopicLabel(topic: ContactTopicValue): string {
  const match = CONTACT_TOPIC_ENTRIES.find((entry) => entry.value === topic);
  return match?.label ?? topic;
}
