import type { ActivityRecord, ActivityType, AppRole, ConnectionRecord, ReminderRecord, SeedAppUser } from "../drizzle/schema";

export type AppUser = SeedAppUser;

const isoDaysAgo = (days: number, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const seedUsers: AppUser[] = [
  { id: "patient-rani", name: "Rani Devi", email: "patient@mindsaathi.demo", password: "Demo@123", role: "patient", age: 72, language: "en", connectionCode: "MS-48291", caregiverId: "caregiver-priya", createdAt: isoDaysAgo(24) },
  { id: "caregiver-priya", name: "Priya Sharma", email: "caregiver@mindsaathi.demo", password: "Demo@123", role: "caregiver", language: "en", createdAt: isoDaysAgo(30) },
  { id: "admin-demo", name: "MindSaathi Admin", email: "admin@mindsaathi.demo", password: "Demo@123", role: "admin", language: "en", createdAt: isoDaysAgo(42) },
];

const activitySeed: ActivityRecord[] = [
  { id: "seed-1", patientId: "patient-rani", type: "memory", score: 86, accuracy: 86, responseTime: 156, difficulty: "Easy", completedAt: isoDaysAgo(6) },
  { id: "seed-2", patientId: "patient-rani", type: "attention", score: 78, accuracy: 78, responseTime: 121, difficulty: "Medium", completedAt: isoDaysAgo(6, 15) },
  { id: "seed-3", patientId: "patient-rani", type: "recall", score: 64, accuracy: 64, responseTime: 198, difficulty: "Easy", completedAt: isoDaysAgo(5) },
  { id: "seed-4", patientId: "patient-rani", type: "pattern", score: 82, accuracy: 82, responseTime: 142, difficulty: "Easy", completedAt: isoDaysAgo(4) },
  { id: "seed-5", patientId: "patient-rani", type: "memory", score: 92, accuracy: 92, responseTime: 133, difficulty: "Medium", completedAt: isoDaysAgo(3) },
  { id: "seed-6", patientId: "patient-rani", type: "attention", score: 70, accuracy: 70, responseTime: 167, difficulty: "Medium", completedAt: isoDaysAgo(2) },
  { id: "seed-7", patientId: "patient-rani", type: "pattern", score: 88, accuracy: 88, responseTime: 116, difficulty: "Medium", completedAt: isoDaysAgo(1) },
  { id: "seed-8", patientId: "patient-rani", type: "recall", score: 74, accuracy: 74, responseTime: 176, difficulty: "Easy", completedAt: isoDaysAgo(0) },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(20, 0, 0, 0);
const inTwoDays = new Date(tomorrow);
inTwoDays.setDate(inTwoDays.getDate() + 1);
inTwoDays.setHours(11, 30, 0, 0);

const reminderSeed: ReminderRecord[] = [
  { id: "rem-1", patientId: "patient-rani", createdBy: "caregiver-priya", title: "Evening medication", description: "Take your scheduled medicine with water.", scheduledTime: tomorrow.toISOString(), repeat: "Daily", status: "upcoming" },
  { id: "rem-2", patientId: "patient-rani", createdBy: "caregiver-priya", title: "Doctor appointment", description: "Bring your questions and health notebook.", scheduledTime: inTwoDays.toISOString(), repeat: "Once", status: "upcoming" },
  { id: "rem-3", patientId: "patient-rani", createdBy: "patient-rani", title: "Morning walk", description: "A gentle 15-minute walk with a companion.", scheduledTime: isoDaysAgo(0, 8), repeat: "Daily", status: "completed" },
];

const connectionSeed: ConnectionRecord[] = [
  { id: "conn-1", patientId: "patient-rani", caregiverId: "caregiver-priya", status: "approved", createdAt: isoDaysAgo(24) },
];

let users = [...seedUsers];
let activities = [...activitySeed];
let reminders = [...reminderSeed];
let connections = [...connectionSeed];
let activityFlags = { memory: true, attention: true, pattern: true, recall: true };

export const activityCatalog = [
  { type: "memory" as const, title: "Memory Match", description: "Find pairs of familiar objects.", time: "5 minutes", difficulty: "Easy", icon: "Brain" },
  { type: "attention" as const, title: "Attention Game", description: "Notice the changing target.", time: "5 minutes", difficulty: "Medium", icon: "Target" },
  { type: "pattern" as const, title: "Pattern Game", description: "Complete a simple visual sequence.", time: "5 minutes", difficulty: "Easy", icon: "Shapes" },
  { type: "recall" as const, title: "Recall Activity", description: "Remember familiar objects and details.", time: "5 minutes", difficulty: "Medium", icon: "ClipboardCheck" },
];

export function listUsers() { return users.map(({ password: _password, ...user }) => user); }
export function findUserById(id: string) { return users.find(user => user.id === id); }
export function findUserByEmail(email: string) { return users.find(user => user.email.toLowerCase() === email.toLowerCase()); }

export function login(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function registerUser(input: { name: string; email: string; password: string; role: "patient" | "caregiver"; age?: number; language: string }) {
  if (findUserByEmail(input.email)) throw new Error("An account with this email already exists.");
  const id = `${input.role}-${Date.now()}`;
  const user: AppUser = { id, name: input.name, email: input.email, password: input.password, role: input.role, age: input.age, language: input.language, connectionCode: input.role === "patient" ? `MS-${Math.floor(10000 + Math.random() * 89999)}` : undefined, createdAt: new Date().toISOString() };
  users.push(user);
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function getResults(patientId: string) { return activities.filter(activity => activity.patientId === patientId).sort((a, b) => b.completedAt.localeCompare(a.completedAt)); }
export function getReminders(patientId: string) { return reminders.filter(reminder => reminder.patientId === patientId).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)); }
export function getPatientForCaregiver(caregiverId: string) {
  const connection = connections.find(item => item.caregiverId === caregiverId && item.status === "approved");
  return connection ? findUserById(connection.patientId) : undefined;
}

function averageFor(patientId: string, type: ActivityType) {
  const scores = activities.filter(item => item.patientId === patientId && item.type === type).map(item => item.score);
  return scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : 0;
}

export function getPerformance(patientId: string) {
  return { memory: averageFor(patientId, "memory"), attention: averageFor(patientId, "attention"), recall: averageFor(patientId, "recall"), pattern: averageFor(patientId, "pattern") };
}

export function recommendation(patientId: string) {
  const performance = getPerformance(patientId);
  const lowest = (Object.entries(performance).sort(([, a], [, b]) => a - b)[0]?.[0] ?? "recall") as ActivityType;
  const score = performance[lowest];
  const level = score >= 80 ? "slightly more challenging" : score < 50 ? "an easier" : "a similar";
  const catalog = activityCatalog.find(item => item.type === lowest) ?? activityCatalog[3];
  return { type: lowest, title: catalog.title, difficulty: score >= 80 ? "Medium" : score < 50 ? "Easy" : catalog.difficulty, text: `Based on your recent activity, we recommend ${level} ${catalog.title.toLowerCase()} today.` };
}

export function addActivityResult(input: { patientId: string; type: ActivityType; score: number; accuracy: number; responseTime: number; difficulty: string }) {
  const result: ActivityRecord = { id: `result-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, patientId: input.patientId, type: input.type, score: Math.max(0, Math.min(100, Math.round(input.score))), accuracy: Math.max(0, Math.min(100, Math.round(input.accuracy))), responseTime: Math.round(input.responseTime), difficulty: input.difficulty, completedAt: new Date().toISOString() };
  activities.push(result);
  return result;
}

export function addReminder(input: { patientId: string; createdBy: string; title: string; description: string; scheduledTime: string; repeat: string }) {
  const reminder: ReminderRecord = { id: `rem-${Date.now()}`, patientId: input.patientId, createdBy: input.createdBy, title: input.title, description: input.description, scheduledTime: input.scheduledTime, repeat: input.repeat, status: "upcoming" };
  reminders.push(reminder);
  return reminder;
}

export function updateReminder(id: string, status: ReminderRecord["status"]) {
  const reminder = reminders.find(item => item.id === id);
  if (!reminder) throw new Error("Reminder not found.");
  reminder.status = status;
  return reminder;
}

export function createConnection(patientId: string, caregiverId: string, code: string) {
  const patient = findUserById(patientId);
  if (!patient || patient.role !== "patient" || patient.connectionCode?.toLowerCase() !== code.trim().toLowerCase()) throw new Error("That connection code could not be found.");
  const existing = connections.find(item => item.patientId === patientId && item.caregiverId === caregiverId);
  if (existing) return existing;
  const connection: ConnectionRecord = { id: `conn-${Date.now()}`, patientId, caregiverId, status: "pending", createdAt: new Date().toISOString() };
  connections.push(connection);
  return connection;
}

export function reviewConnection(id: string, status: "approved" | "rejected") {
  const connection = connections.find(item => item.id === id);
  if (!connection) throw new Error("Connection request not found.");
  connection.status = status;
  if (status === "approved") {
    const patient = findUserById(connection.patientId);
    if (patient) patient.caregiverId = connection.caregiverId;
  }
  return connection;
}

export function setActivityFlag(type: ActivityType, enabled: boolean) { activityFlags[type] = enabled; return activityFlags; }
export function getActivityFlags() { return activityFlags; }

export function getSnapshot(userId: string) {
  const user = findUserById(userId);
  if (!user) throw new Error("User not found.");
  if (user.role === "patient") {
    return { user: { ...user, password: undefined }, results: getResults(userId), reminders: getReminders(userId), performance: getPerformance(userId), recommendation: recommendation(userId), activities: activityCatalog.filter(item => activityFlags[item.type]), flags: activityFlags, pendingConnections: connections.filter(item => item.patientId === userId && item.status === "pending") };
  }
  if (user.role === "caregiver") {
    const patient = getPatientForCaregiver(userId);
    const patientId = patient?.id ?? "patient-rani";
    return { user: { ...user, password: undefined }, patient: patient ? { ...patient, password: undefined } : undefined, results: getResults(patientId), reminders: getReminders(patientId), performance: getPerformance(patientId), recommendation: recommendation(patientId), activities: activityCatalog.filter(item => activityFlags[item.type]), flags: activityFlags, pendingConnections: connections.filter(item => item.caregiverId === userId && item.status === "pending") };
  }
  return { user: { ...user, password: undefined }, stats: { totalUsers: users.length, patients: users.filter(item => item.role === "patient").length, caregivers: users.filter(item => item.role === "caregiver").length, activitiesCompleted: activities.length, activeUsers: Math.max(1, users.length - 1) }, users: listUsers(), results: activities, flags: activityFlags, activities: activityCatalog };
}

export function assistantReply(userId: string, prompt: string) {
  const snapshot = getSnapshot(userId) as any;
  const query = prompt.toLowerCase();
  if (query.includes("reminder")) {
    const upcoming = (snapshot.reminders ?? []).filter((item: ReminderRecord) => item.status === "upcoming");
    return upcoming.length ? `You have ${upcoming.length} upcoming reminder${upcoming.length > 1 ? "s" : ""}. The next one is ${upcoming[0].title}.` : "You have no upcoming reminders.";
  }
  if (query.includes("today") || query.includes("activity") || query.includes("next")) return `Your next activity is ${snapshot.recommendation?.title ?? "Memory Match"}. Take your time and enjoy it.`;
  return "I can help with your activities, reminders, and daily routine. Try asking, ‘What reminders do I have?’";
}
