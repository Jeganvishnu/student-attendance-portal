import { GoogleGenAI, Type } from "@google/genai";
import { AttendanceResponse, Student } from "../types";

// Initialize Gemini client
// The API key is injected from the environment
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const verifyAttendance = async (
  imageBase64: string,
  subject: string = "General",
  knownStudents: Student[] = []
): Promise<AttendanceResponse> => {
  try {
    // Remove data URL prefix if present to get raw base64 for the target image
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Start constructing the multipart request
    const parts: any[] = [
      { text: "Task: You are a strict student attendance officer. Your goal is to identify the student in the 'Target Image' by comparing it with the provided 'Reference Images'." },
      { text: "Target Image (Student attempting to mark attendance):" },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      }
    ];

    // Add known students to the prompt context for comparison
    if (knownStudents.length > 0) {
      parts.push({ text: "Reference Images (Registered Students Database):" });

      knownStudents.forEach(student => {
        if (student.avatar) {
          const studentImage = student.avatar.replace(/^data:image\/\w+;base64,/, "");
          parts.push({ text: `Student Name: ${student.name} (ID: ${student.id})` });
          parts.push({
            inlineData: {
              mimeType: "image/jpeg", // Assuming jpeg, though webcam usually outputs jpeg/png
              data: studentImage
            }
          });
        }
      });
    } else {
      parts.push({ text: "Note: No registered students are currently in the database. Treat this as a generic face check." });
    }

    // Add the instructions part
    parts.push({
      text: `Instructions:
      1. Analyze the 'Target Image'. Is a human face clearly visible, looking at the camera, and well-lit? If not, return status 'error' and a message about the image quality.
      2. If the face is valid:
         - Compare it strictly with the 'Reference Images' provided above.
         - If you find a match with high confidence, identify the student by Name.
         - If 'Reference Images' were provided but NO match is found, return status 'error' and message "Face not recognized. Please register first."
         - If NO 'Reference Images' were provided (empty database), just mark as 'present' for any valid face and use "Student" as the name.
      
      Output Rules:
      - If matched: Status 'present'. Message: "Hello [Student Name]! Your attendance for ${subject} has been successfully marked." identifiedName: "[Student Name]"
      - If not matched but valid face (and DB exists): Status 'error'. Message: "Access Denied: Face not registered in the system."
      - If invalid face (blurry/dark): Status 'error'. Message: "Please ensure your face is clearly visible and well-lit."

      Return JSON.`
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              enum: ["present", "absent", "error"],
            },
            message: {
              type: Type.STRING,
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 1",
            },
            identifiedName: {
              type: Type.STRING,
              description: "Name of the student identified, or 'Unknown'",
            }
          },
          required: ["status", "message"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from Gemini");
    }

    const result = JSON.parse(jsonText);

    return {
      status: result.status,
      message: result.message,
      confidence: result.confidence,
      timestamp: new Date().toISOString(),
      identifiedName: result.identifiedName,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      status: "error",
      message: "Failed to verify attendance. Please try again.",
      timestamp: new Date().toISOString(),
    };
  }
};
