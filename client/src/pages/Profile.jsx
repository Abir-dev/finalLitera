// src/pages/Profile.jsx
import { useState, useRef } from "react";

const brand = { blue: "#18457A" };

export default function Profile() {
  const [form, setForm] = useState({
    firstName: "Sanchari",
    lastName: "Ghosh",
    email: "sanchari76@gmail.com",
    countryCode: "+91",
    phone: "9876543450",
    password: "*******************",
    github: "",
    linkedin: "",
    website: "",
    youtube: "",
    resume: ""
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileUpload = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid file type (PDF, DOC, DOCX, TXT, or Image)');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setUploadedFile({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      });
      
      // Update form with file name
      setForm(prev => ({ ...prev, resume: file.name }));
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
      setForm(prev => ({ ...prev, resume: "" }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('text')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-8 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      {/* Header row */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">👤</div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Profile
            </h1>
          </div>
          <p className="text-[12px] text-slate-500 mt-1">Information About Your Self</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="inline-flex items-center gap-2 rounded-full border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 text-sm hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 shadow-sm">
            <span className="font-medium text-indigo-700">👁️ View Profile</span>
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 text-sm hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 shadow-sm">
            <span className="font-medium text-blue-700">✏️ EDIT</span>
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 text-sm hover:from-green-100 hover:to-emerald-100 transition-all duration-300 shadow-sm">
            <span className="font-medium text-green-700">🎓 Education</span>
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 text-sm hover:from-orange-100 hover:to-red-100 transition-all duration-300 shadow-sm">
            <span className="font-medium text-orange-700">💳 Payment</span>
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 text-sm hover:from-purple-100 hover:to-purple-100 transition-all duration-300 shadow-sm">
            <span className="font-medium text-purple-700">📋 Project Info</span>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="mt-6 rounded-2xl bg-white shadow-xl border-2 border-gradient-to-r from-indigo-100 to-purple-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Personal Information
          </h2>
        </div>
        <div className="p-6 md:p-8">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-indigo-600">👤</span>
                First Name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="w-full rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 group-hover:border-indigo-300"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-indigo-600">👤</span>
                Last Name
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                className="w-full rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-300 group-hover:border-indigo-300"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-6 group">
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-green-600">📧</span>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300 group-hover:border-green-300"
            />
          </div>

          {/* Phone */}
          <div className="mt-6 group">
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-blue-600">📱</span>
              Phone No.
            </label>
            <div className="flex items-center gap-2">
              <input
                name="countryCode"
                value={form.countryCode}
                onChange={onChange}
                className="w-24 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 group-hover:border-blue-300"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="flex-1 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 group-hover:border-blue-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-6 group">
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-red-600">🔒</span>
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition-all duration-300 group-hover:border-red-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
                  <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" />
                </svg>
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                <span className="text-xl">🔗</span>
                Social Links & Portfolio
              </p>
            </div>

            <div className="space-y-4">
              <div className="group">
                <input
                  placeholder="GitHub Link |"
                  name="github"
                  value={form.github}
                  onChange={onChange}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-400 transition-all duration-300 group-hover:border-gray-300"
                />
              </div>
              <div className="group">
                <input
                  placeholder="LinkedIn Link |"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={onChange}
                  className="w-full rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 group-hover:border-blue-300"
                />
              </div>
              <div className="group">
                <input
                  placeholder="Website Link |"
                  name="website"
                  value={form.website}
                  onChange={onChange}
                  className="w-full rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300 group-hover:border-green-300"
                />
              </div>
              <div className="group">
                <input
                  placeholder="Youtube Link |"
                  name="youtube"
                  value={form.youtube}
                  onChange={onChange}
                  className="w-full rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition-all duration-300 group-hover:border-red-300"
                />
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                <span className="text-xl">📁</span>
                Resume / Project File Upload
              </p>
            </div>

            {!uploadedFile ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-orange-400 bg-orange-50 border-orange-400'
                    : 'border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 hover:border-orange-300 hover:bg-orange-100'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {isDragOver ? 'Drop your file here!' : 'Upload Resume or Project File'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-slate-500 mb-6">
                  Supported formats: PDF, DOC, DOCX, TXT, Images (Max size: 10MB)
                </p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  📂 Choose File
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{getFileIcon(uploadedFile.type)}</div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{uploadedFile.name}</h4>
                      <p className="text-sm text-slate-600">
                        {formatFileSize(uploadedFile.size)} • {uploadedFile.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
                    >
                      🔄 Replace
                    </button>
                    <button
                      onClick={removeFile}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-300"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              💾 Save Changes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
