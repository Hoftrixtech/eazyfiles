export function displayUserName(name: string, email: string): string {
  const trimmed = name.trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  const local = email.split("@")[0]?.trim();
  return local && local.length > 0 ? local : "there";
}

export function formatActivityWhen(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86_400_000);

  if (dayDiff === 0) {
    return "Today";
  }
  if (dayDiff === 1) {
    return "Yesterday";
  }
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export function formatMemberSince(date: Date | null): string {
  if (!date) {
    return "—";
  }
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

export function jobStatusLabel(status: string): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    case "processing":
      return "Processing";
    case "pending":
      return "Pending";
    default:
      return status;
  }
}
