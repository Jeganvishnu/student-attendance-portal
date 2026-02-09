
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, where, deleteDoc } from 'firebase/firestore';
import { Student, AttendanceRecord } from '../types';

const STUDENTS_COLLECTION = 'students';
const ATTENDANCE_COLLECTION = 'attendance_logs';

export const addStudentToDb = async (student: Student): Promise<void> => {
  try {
    const studentData = { ...student, timestamp: Timestamp.now() };
    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), studentData);
    console.log("Student added to DB with ID: ", docRef.id);
  } catch (error: any) {
    // If permission is denied, suppress the error so the app continues to work locally
    if (error.code === 'permission-denied') {
      console.warn("⚠️ Firebase Permission Denied: Student saved locally only. Update Firestore Security Rules to enable cloud storage.");
      return; 
    }
    console.error("Error adding student to DB:", error);
    throw error;
  }
};

export const getStudentsFromDb = async (): Promise<Student[]> => {
  try {
    const q = query(collection(db, STUDENTS_COLLECTION), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      students.push(doc.data() as Student);
    });
    return students;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("⚠️ Firebase Permission Denied: Could not fetch students. Using empty list.");
      return [];
    }
    console.error("Error fetching students from DB:", error);
    return [];
  }
};

export const deleteStudentFromDb = async (studentId: string): Promise<void> => {
  try {
    // We need to find the document(s) with the matching student ID field
    const q = query(collection(db, STUDENTS_COLLECTION), where("id", "==", studentId));
    const querySnapshot = await getDocs(q);
    
    // Delete all matching documents (should usually be just one)
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log(`Student with ID ${studentId} deleted from DB`);
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("⚠️ Firebase Permission Denied: Could not delete student.");
      return;
    }
    console.error("Error deleting student from DB:", error);
    throw error;
  }
};

export const addAttendanceToDb = async (record: AttendanceRecord): Promise<void> => {
  try {
    // Add a server timestamp for sorting
    const recordData = { ...record, createdAt: Timestamp.now() };
    const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), recordData);
    console.log("Attendance logged to DB with ID: ", docRef.id);
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("⚠️ Firebase Permission Denied: Attendance saved locally only.");
      return;
    }
    console.error("Error logging attendance to DB:", error);
    throw error;
  }
};

export const getAttendanceLogsFromDb = async (): Promise<AttendanceRecord[]> => {
  try {
    // Order by createdAt descending (newest first)
    const q = query(collection(db, ATTENDANCE_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const logs: AttendanceRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Remove the firestore timestamp before returning to app
      const { createdAt, ...record } = data;
      logs.push(record as AttendanceRecord);
    });
    return logs;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("⚠️ Firebase Permission Denied: Could not fetch logs. Using empty list.");
      return [];
    }
    console.error("Error fetching attendance logs from DB:", error);
    return [];
  }
};
