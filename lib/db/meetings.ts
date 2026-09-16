import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface MeetingRequest {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';

    // User Info
    fullName: string;
    email: string;
    phone: string;

    // Business Info
    businessName: string;
    businessType: string;
    companySize: string;

    // Preferences
    selectedDate: string;
    requiredFeatures: string;
    additionalNotes: string;

    // System
    approvalToken: string;
    rejectionToken: string;
    createdAt: string;
    updatedAt: string;
    calendarEventId?: string;
}

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'meetings.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS meeting_requests (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'PENDING',
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    businessName TEXT NOT NULL,
    businessType TEXT NOT NULL,
    companySize TEXT NOT NULL,
    selectedDate TEXT NOT NULL,
    requiredFeatures TEXT NOT NULL,
    additionalNotes TEXT,
    approvalToken TEXT NOT NULL UNIQUE,
    rejectionToken TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    calendarEventId TEXT
  )
`);

export function createMeetingRequest(data: Omit<MeetingRequest, 'createdAt' | 'updatedAt'>): MeetingRequest {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
    INSERT INTO meeting_requests (
      id, status, fullName, email, phone, businessName, businessType, companySize,
      selectedDate, requiredFeatures, additionalNotes, approvalToken, rejectionToken,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    stmt.run(
        data.id,
        data.status,
        data.fullName,
        data.email,
        data.phone,
        data.businessName,
        data.businessType,
        data.companySize,
        data.selectedDate,
        data.requiredFeatures,
        data.additionalNotes,
        data.approvalToken,
        data.rejectionToken,
        now,
        now
    );

    return {
        ...data,
        createdAt: now,
        updatedAt: now
    };
}

export function getMeetingRequestByToken(token: string, type: 'approval' | 'rejection'): MeetingRequest | null {
    const column = type === 'approval' ? 'approvalToken' : 'rejectionToken';
    const stmt = db.prepare(`SELECT * FROM meeting_requests WHERE ${column} = ?`);
    return stmt.get(token) as MeetingRequest | null;
}

export function updateMeetingStatus(id: string, status: 'APPROVED' | 'REJECTED', calendarEventId?: string): void {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
    UPDATE meeting_requests 
    SET status = ?, updatedAt = ?, calendarEventId = ?
    WHERE id = ?
  `);
    stmt.run(status, now, calendarEventId || null, id);
}

export function getAllMeetingRequests(): MeetingRequest[] {
    const stmt = db.prepare('SELECT * FROM meeting_requests ORDER BY createdAt DESC');
    return stmt.all() as MeetingRequest[];
}

export function getBookedDates(): string[] {
    const stmt = db.prepare("SELECT selectedDate FROM meeting_requests WHERE status != 'REJECTED'");
    const rows = stmt.all() as { selectedDate: string }[];
    return rows.map(r => r.selectedDate);
}

export default db;
