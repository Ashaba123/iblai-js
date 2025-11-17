import { useDayJs } from "@/hooks/use-day-js";
import { vi } from "vitest";

describe("useDayJs", () => {
  it("calculates difference between two dates", () => {
    const { getTimeDifferenceBetweenTwoDates } = useDayJs();
    const past = "2024-01-01T00:00:00.000Z";
    const future = "2024-01-01T00:00:30.000Z";
    expect(getTimeDifferenceBetweenTwoDates(future, past, "second")).toBe(30);
  });

  it("creates duration object from seconds", () => {
    const { getDayJSDurationObjFromSeconds } = useDayJs();
    const duration = getDayJSDurationObjFromSeconds(120);
    expect(duration.asMinutes()).toBe(2);
  });

  it("generates future date for given minutes", () => {
    vi.useFakeTimers().setSystemTime(new Date("2024-01-01T00:00:00Z"));
    const { generateFutureDateForNMinutes } = useDayJs();
    const dateStr = generateFutureDateForNMinutes(2);
    const diffMs =
      new Date(dateStr).getTime() - new Date("2024-01-01T00:00:00Z").getTime();
    expect(Math.round(diffMs / 60000)).toBe(2);
    vi.useRealTimers();
  });
});
