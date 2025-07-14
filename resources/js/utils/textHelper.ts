function decodeHtmlEntities(input: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = input;
  return txt.value;
}

export function stripHtmlTags(input: string): string {
  const noHtml = input.replace(/<\/?[^>]+(>|$)/g, "");
  return decodeHtmlEntities(noHtml);
}

export function truncateText(text: string, maxLength: number): string {
  const cleanText = stripHtmlTags(text);
  return cleanText.length > maxLength
    ? cleanText.substring(0, maxLength) + "..."
    : cleanText;
}

export function ticketStatus(status: string): string {
  switch (status) {
    case "open":
      return "Open";
    case "on-going":
      return "On-going";
    case "resolved":
      return "Resolved";
    case "rejected":
      return "Rejected";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
