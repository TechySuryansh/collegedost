import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFileAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import api from '@/api/axios';

const AdminIngestion = () => {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);

    setUploading(true);
    setStatus(null);

    try {
        const { data } = await api.post('/admin/ingest/aicte', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        setStatus({ type: 'success', message: data.message });
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Job Started: ${data.jobId}`, ...prev]);
    } catch (error) {
        console.error(error);
        setStatus({ type: 'error', message: error.response?.data?.message || 'Upload failed' });
    } finally {
        setUploading(false);
    }
  };

  const triggerNirf = async () => {
    if (!window.confirm("Trigger NIRF check for " + year + "?")) return;
    try {
        const { data } = await api.post('/admin/ingest/nirf-trigger', {
            year,
            category: 'Engineering',
            url: `https://www.nirfindia.org/${year}/Engineering.pdf`
        });
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] NIRF Triggered: ${data.jobId}`, ...prev]);
    } catch (err) {
        alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Data Ingestion Center</h2>
        <p className="text-gray-500">Upload official datasets (AICTE/NIRF) to enrich the college database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* AICTE Upload Card */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
           <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <FaCloudUploadAlt className="text-blue-500" />
               Upload AICTE CSV
           </h3>
           
           <form onSubmit={handleUpload} className="space-y-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                   <input 
                      type="number" 
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full border rounded-lg p-2"
                   />
               </div>

               <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                   <input 
                      type="file" 
                      accept=".csv"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   <FaFileAlt className="mx-auto text-3xl text-gray-400 mb-2" />
                   <p className="text-sm text-gray-500">
                       {file ? file.name : "Drag & drop or click to select CSV"}
                   </p>
               </div>

               <button 
                  type="submit" 
                  disabled={uploading || !file}
                  className={`w-full py-2 rounded-lg font-bold text-white transition-colors ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
               >
                   {uploading ? 'Uploading...' : 'Start Ingestion'}
               </button>

               {status && (
                   <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                       {status.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
                       {status.message}
                   </div>
               )}
           </form>
        </motion.div>

        {/* Status / Logs Card */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">Job Logs</h3>
                <button onClick={triggerNirf} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
                    Test NIRF Trigger
                </button>
            </div>
            
            <div className="flex-1 bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto h-64">
                {logs.length === 0 ? (
                    <span className="text-gray-500">No recent logs...</span>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">
                            {log}
                        </div>
                    ))
                )}
            </div>
        </motion.div>

      </div>
    </AdminLayout>
  );
};

export default AdminIngestion;
