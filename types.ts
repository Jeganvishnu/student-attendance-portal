
export interface AttendanceResponse {
  status: 'present' | 'absent' | 'error';
  message: string;
  confidence?: number;
  timestamp: string;
  identifiedName?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  date: string;
  time: string;
  subject: string;
  status: 'present' | 'absent' | 'error';
  confidence: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  avatar: string | null; // Base64 string of the face
  registrationDate: string;
}

export enum CameraStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  PREVIEW = 'PREVIEW',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
