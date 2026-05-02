/**
 * Parses and sanitizes error responses for user-friendly display
 * Handles structured API error responses and raw error messages
 */

export function parseErrorResponse(error: unknown): string {
  if (typeof error === "string") {
    
    if (error.includes("{") || error.includes("404") || error.includes("500")) {
      return "An unexpected error occurred. Please try again.";
    }
    return error;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    
    if (message.includes("404") || message.includes("not found")) {
      return "The requested item could not be found.";
    }
    if (message.includes("401") || message.includes("unauthorized")) {
      return "You are not authorized to perform this action.";
    }
    if (message.includes("403") || message.includes("forbidden")) {
      return "You don't have permission to perform this action.";
    }
    if (message.includes("409") || message.includes("conflict")) {
      return "This item already exists or conflicts with existing data.";
    }
    if (message.includes("500") || message.includes("internal server")) {
      return "A server error occurred. Please try again later.";
    }
    if (message.includes("network") || message.includes("timeout")) {
      return "Network connection failed. Please check your connection.";
    }

    
    if (error.message && !message.includes("error") && error.message.length < 100) {
      return error.message;
    }

    return "An unexpected error occurred. Please try again.";
  }

  return "An unexpected error occurred. Please try again.";
}
