import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BLACK_FRIDAY_END_MS,
  BLACK_FRIDAY_MIDNIGHT_MS,
  BLACK_FRIDAY_START_MS,
  blackFridayClock,
  isBlackFridayWindow,
  showBlackFridayNotice,
} from "./black-friday.ts";

describe("isBlackFridayWindow", () => {
  it("is closed one millisecond before 08:00 BRT", () => {
    assert.equal(isBlackFridayWindow(new Date(BLACK_FRIDAY_START_MS - 1)), false);
  });

  it("opens at 08:00 BRT, including the same instant written in UTC", () => {
    assert.equal(isBlackFridayWindow(new Date(BLACK_FRIDAY_START_MS)), true);
    // 11:00 UTC is 08:00 in America/Sao_Paulo.
    assert.equal(isBlackFridayWindow(new Date("2026-11-27T11:00:00.000Z")), true);
  });

  it("stays open through the afternoon in Brasília", () => {
    // 18:00 BRT.
    assert.equal(isBlackFridayWindow(new Date("2026-11-27T21:00:00.000Z")), true);
  });

  it("includes the whole final second and closes at midnight BRT", () => {
    assert.equal(isBlackFridayWindow(new Date(BLACK_FRIDAY_END_MS)), true);
    assert.equal(isBlackFridayWindow(new Date(BLACK_FRIDAY_END_MS + 999)), true);
    // 00:00 on 28/11 BRT is 03:00 UTC.
    assert.equal(isBlackFridayWindow(new Date("2026-11-28T03:00:00.000Z")), false);
  });

  it("ignores the machine timezone by using the offset on the bounds", () => {
    // 07:59 BRT is still 27/11 in UTC, but the window has not opened.
    assert.equal(isBlackFridayWindow(new Date("2026-11-27T10:59:59.999Z")), false);
  });
});

describe("blackFridayClock", () => {
  it("counts down to 08:00 BRT before the window", () => {
    const clock = blackFridayClock(BLACK_FRIDAY_START_MS - 90 * 60 * 1000);
    assert.equal(clock.phase, "start");
    assert.equal(clock.time, "01:30:00");
  });

  it("switches to the midnight countdown at 08:00 BRT", () => {
    const clock = blackFridayClock(BLACK_FRIDAY_START_MS);
    assert.equal(clock.phase, "end");
    assert.equal(clock.time, "16:00:00");
  });

  it("reaches zero at midnight BRT and does not go negative", () => {
    assert.equal(blackFridayClock(BLACK_FRIDAY_MIDNIGHT_MS - 1000).time, "00:00:01");
    assert.deepEqual(blackFridayClock(BLACK_FRIDAY_MIDNIGHT_MS), {
      phase: "end",
      time: "00:00:00",
    });
    assert.deepEqual(blackFridayClock(BLACK_FRIDAY_MIDNIGHT_MS + 5 * 60 * 1000), {
      phase: "end",
      time: "00:00:00",
    });
  });
});

describe("showBlackFridayNotice", () => {
  it("keeps the public home closed during the window and with the preview query", () => {
    assert.equal(showBlackFridayNotice({ force: false, schedule: false, scheduled: true }), false);
    assert.equal(showBlackFridayNotice({ force: false, schedule: false, scheduled: false }), false);
  });

  it("keeps /home-2 open regardless of the clock", () => {
    assert.equal(showBlackFridayNotice({ force: true, schedule: false, scheduled: false }), true);
    assert.equal(showBlackFridayNotice({ force: true, schedule: false, scheduled: true }), true);
  });

  it("opens the cart only inside the window or with the preview query", () => {
    assert.equal(showBlackFridayNotice({ force: false, schedule: true, scheduled: true }), true);
    assert.equal(showBlackFridayNotice({ force: false, schedule: true, scheduled: false }), false);
  });
});
