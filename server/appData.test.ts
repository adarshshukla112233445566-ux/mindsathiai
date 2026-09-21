import { describe, expect, it } from "vitest";
import { addActivityResult, addReminder, createConnection, findUserByEmail, getPerformance, getResults, login, recommendation, reviewConnection } from "./appData";

describe("MindSaathi application data", () => {
  it("logs in with a seeded demo account and rejects the wrong password", () => {
    expect(login("patient@mindsaathi.demo", "Demo@123")?.role).toBe("patient");
    expect(login("patient@mindsaathi.demo", "wrong-password")).toBeNull();
  });

  it("stores activity results and updates a performance profile", () => {
    const before = getResults("patient-rani").length;
    addActivityResult({ patientId: "patient-rani", type: "recall", score: 95, accuracy: 95, responseTime: 42, difficulty: "Medium" });
    expect(getResults("patient-rani").length).toBe(before + 1);
    expect(getPerformance("patient-rani").recall).toBeGreaterThan(64);
    expect(recommendation("patient-rani").title).toBeTruthy();
  });

  it("creates a reminder for a patient", () => {
    const before = getResults("patient-rani").length;
    const reminder = addReminder({ patientId: "patient-rani", createdBy: "patient-rani", title: "Test reminder", description: "A test reminder", scheduledTime: new Date().toISOString(), repeat: "Once" });
    expect(reminder.title).toBe("Test reminder");
    expect(findUserByEmail("patient@mindsaathi.demo")?.id).toBe("patient-rani");
    expect(getResults("patient-rani").length).toBe(before);
  });

  it("supports caregiver connection requests and approval", () => {
    const connection = createConnection("patient-rani", "caregiver-priya", "MS-48291");
    expect(["approved", "pending"]).toContain(connection.status);
    if (connection.status === "pending") expect(reviewConnection(connection.id, "approved").status).toBe("approved");
  });
});
