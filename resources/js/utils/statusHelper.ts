export type TicketStatus = "open" | "on-going" | "resolved" | "rejected";

export function getTicketStatusMeta(status: TicketStatus) {
  switch (status) {
    case "open":
      return {
        label: "Open",
        className: "bg-yellow-400 text-black",
      };
    case "on-going":
      return {
        label: "On-Going",
        className: "bg-blue-500 text-white",
      };
    case "resolved":
      return {
        label: "Resolved",
        className: "bg-green-700 text-white",
      };
    case "rejected":
      return {
        label: "Rejected",
        className: "bg-red-600 text-white",
      };
    default:
      return {
        label: status,
        className: "bg-gray-400 text-white",
      };
  }
}
