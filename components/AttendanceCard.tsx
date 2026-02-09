import React, { useState, useRef, useCallback } from 'react';
import { Camera, CheckCircle, XCircle, Loader2, ScanFace, RefreshCw, RotateCcw, Check, X } from 'lucide-react';
import Webcam from 'react-webcam';
import { verifyAttendance } from '../services/geminiService';
import { CameraStatus, AttendanceResponse, Student, AttendanceRecord } from '../types';
import Tips from './Tips';

interface AttendanceCardProps {
  students: Student[];
  onAttendanceMarked: (record: AttendanceRecord) => void;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ students, onAttendanceMarked }) => {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>(CameraStatus.IDLE);
  const [subject, setSubject] = useState('');
  const [result, setResult] = useState<AttendanceResponse | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const startCamera = () => {
    setCameraStatus(CameraStatus.ACTIVE);
    setResult(null);
    setCapturedImage(null);
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setCapturedImage(imageSrc);
    setCameraStatus(CameraStatus.PREVIEW);
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setCameraStatus(CameraStatus.ACTIVE);
  };

  const confirm = async () => {
    if (!capturedImage) return;

    setCameraStatus(CameraStatus.PROCESSING);
    
    // Pass the captured image, subject, and the list of registered students to Gemini
    const response = await verifyAttendance(capturedImage, subject || "Unspecified Class", students);
    
    if (response.status === 'present') {
      // Find student ID if available, otherwise use UNKNOWN or generic
      // We try to fuzzy match the identified name against our database just in case
      const identifiedName = response.identifiedName || "Student";
      const matchedStudent = students.find(s => s.name.toLowerCase() === identifiedName.toLowerCase());
      
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        studentId: matchedStudent ? matchedStudent.id : 'UNKNOWN',
        name: identifiedName,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        subject: subject || 'General',
        status: 'present',
        confidence: response.confidence || 0
      };
      
      onAttendanceMarked(newRecord);
    }

    setResult(response);
    setCameraStatus(response.status === 'present' ? CameraStatus.SUCCESS : CameraStatus.ERROR);
  };

  const reset = () => {
    setCameraStatus(CameraStatus.IDLE);
    setResult(null);
    setSubject('');
    setCapturedImage(null);
  };

  const renderCameraContent = () => {
    switch (cameraStatus) {
      case CameraStatus.IDLE:
        return (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Camera className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Check In?</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                Position yourself in front of the camera with good lighting for accurate face recognition
              </p>
            </div>
            <button
              onClick={startCamera}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              <ScanFace className="w-4 h-4" />
              Start Face Recognition
            </button>
          </div>
        );

      case CameraStatus.ACTIVE:
        return (
          <div className="w-full flex flex-col">
            <div className="relative w-full bg-black rounded-lg overflow-hidden min-h-[300px]">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }}
              />
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center w-full">
              <button
                onClick={() => setCameraStatus(CameraStatus.IDLE)}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={capture}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Camera className="w-4 h-4" />
                Capture Face
              </button>
            </div>
            <p className="text-center text-gray-400 text-sm mt-3">
              Position your face within the frame and ensure good lighting
            </p>
          </div>
        );

      case CameraStatus.PREVIEW:
        return (
          <div className="w-full flex flex-col">
            <div className="relative w-full bg-black rounded-lg overflow-hidden min-h-[300px]">
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center w-full">
              <button
                onClick={retake}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </button>
              <button
                onClick={confirm}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4" />
                Confirm
              </button>
            </div>
            <p className="text-center text-gray-400 text-sm mt-3">
              Check if the image is clear before confirming
            </p>
          </div>
        );

      case CameraStatus.PROCESSING:
        return (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium animate-pulse">Verifying identity...</p>
          </div>
        );

      case CameraStatus.SUCCESS:
      case CameraStatus.ERROR:
        return (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            {result?.status === 'present' ? (
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            )}
            
            <div>
              <h3 className={`text-2xl font-bold ${result?.status === 'present' ? 'text-green-800' : 'text-red-800'}`}>
                {result?.status === 'present' ? 'Attendance Marked!' : 'Verification Failed'}
              </h3>
              <p className="text-gray-600 mt-2 max-w-sm mx-auto leading-relaxed">
                {result?.message}
              </p>
              {result?.status === 'present' && (
                 <p className="text-xs text-gray-400 mt-4">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
              )}
            </div>

            <button
              onClick={result?.status === 'present' ? reset : startCamera}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm ${
                result?.status === 'present' 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {result?.status === 'present' ? (
                <>Back to Home</>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" /> Try Again
                </>
              )}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Card Header */}
      <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2">
        <Camera className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-800">Mark Attendance</span>
      </div>

      <div className="p-6 md:p-8">
        {/* Input Section */}
        <div className="mb-6 space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject/Class (Optional)
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={cameraStatus !== CameraStatus.IDLE && cameraStatus !== CameraStatus.ERROR}
            placeholder="e.g., Mathematics, Physics, Computer Science"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-400 text-sm"
          />
        </div>

        {/* Camera/Action Section */}
        <div className={`border-2 border-dashed rounded-2xl bg-gray-50 transition-all duration-300 ${
          cameraStatus === CameraStatus.ACTIVE || cameraStatus === CameraStatus.PREVIEW ? 'border-blue-400 p-2 bg-black' : 'border-blue-200 p-4 md:p-8'
        }`}>
          {renderCameraContent()}
        </div>

        {/* Tips Section */}
        {cameraStatus === CameraStatus.IDLE && <Tips />}
      </div>
    </div>
  );
};

export default AttendanceCard;
