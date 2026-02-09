import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { ArrowLeft, Camera, XCircle, CheckCircle, UserPlus, ChevronDown, Loader2 } from 'lucide-react';
import { Student } from '../types';

interface RegisterStudentProps {
  onBack: () => void;
  onRegister: (student: Student) => Promise<void>;
}

const RegisterStudent: React.FC<RegisterStudentProps> = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    department: '',
    academicYear: '4th Year'
  });
  
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startCamera = () => {
    setCameraActive(true);
    setCapturedImage(null);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setCameraActive(false);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setCameraActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    if (!formData.studentId || !formData.fullName || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create student object
      const newStudent: Student = {
        id: formData.studentId,
        name: formData.fullName,
        email: formData.email,
        department: formData.department || 'General',
        year: formData.academicYear,
        avatar: capturedImage, // Can be null if they skipped photo
        registrationDate: new Date().toLocaleDateString()
      };
      
      // Wait for the parent to save to Firebase
      await onRegister(newStudent);
      
      // Navigation is handled by parent upon success.
      // If we're still mounted, it means success but delay in unmount, 
      // or error was thrown (which goes to catch).
    } catch (error) {
      console.error("Registration error:", error);
      // Explicitly checking for permission errors which are common with Firebase
      const errorMessage = (error as any)?.code === 'permission-denied' 
        ? "Database permission denied. Please check your Firebase security rules."
        : "Failed to register student. Please check your internet connection.";
      
      alert(errorMessage);
      setIsSubmitting(false); // Reset loading state so user can try again
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/30 font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-5xl mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <button 
          onClick={onBack}
          disabled={isSubmitting}
          className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 rounded-lg transition-all shadow-sm disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Register New Student</h1>
          <p className="text-slate-500 text-sm">Add student with face recognition</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        
        {/* Left Column: Student Information */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-6 pb-2 border-b border-slate-100">Student Information</h2>
          
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Student ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="e.g., STU001"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-400 disabled:bg-gray-50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-400 disabled:bg-gray-50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-400 disabled:bg-gray-50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-400 disabled:bg-gray-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Academic Year</label>
              <div className="relative">
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer text-slate-900 disabled:bg-gray-50"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Face Recognition Setup */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-grow flex flex-col">
            <h2 className="font-semibold text-slate-800 mb-6 pb-2 border-b border-slate-100">Face Recognition Setup</h2>
            
            <div className="flex-grow flex flex-col items-center justify-center min-h-[350px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden">
              
              {/* State: Camera Active */}
              {cameraActive && (
                <div className="absolute inset-0 bg-black">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "user" }}
                  />
                </div>
              )}

              {/* State: Image Captured */}
              {!cameraActive && capturedImage && (
                <div className="absolute inset-0">
                  <img src={capturedImage} alt="Captured Student" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                     <CheckCircle className="w-16 h-16 text-green-500 drop-shadow-lg bg-white rounded-full" />
                  </div>
                </div>
              )}

              {/* State: Idle / Placeholder */}
              {!cameraActive && !capturedImage && (
                <div className="flex flex-col items-center text-slate-400 p-4 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200">
                    <Camera className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Capture student's face for attendance recognition</p>
                </div>
              )}

            </div>

            <div className="mt-6 flex justify-center">
               {!cameraActive && !capturedImage && (
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Face Photo
                  </button>
               )}

               {cameraActive && (
                  <div className="flex gap-3 w-full max-w-xs">
                    <button
                      type="button"
                      onClick={() => setCameraActive(false)}
                      className="flex-1 px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={capture}
                      className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </button>
                  </div>
               )}

               {!cameraActive && capturedImage && (
                  <button
                    type="button"
                    onClick={retake}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Retake Photo
                  </button>
               )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
             <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
             >
               Cancel
             </button>
             <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex-1 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-md shadow-green-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   Saving...
                 </>
               ) : (
                 <>
                   <UserPlus className="w-5 h-5" />
                   Register Student
                 </>
               )}
             </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default RegisterStudent;