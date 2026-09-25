// Post dates are plain YYYY-MM-DD strings; format in UTC so they never shift a day.
export const formatDate = (date, month = "long") =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month,
    day: "numeric",
  });
