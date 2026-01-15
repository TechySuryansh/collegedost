import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaQuestionCircle, FaPaperPlane } from 'react-icons/fa';

const AskModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    console.log("Question submitted:", question);
    setQuestion('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-blue to-blue-800 p-6 flex items-center justify-between text-white">
                 <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <FaQuestionCircle className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold leading-tight">Ask your Question</h3>
                        <p className="text-xs text-blue-100 mt-1 opacity-90">Get answers from experts & students</p>
                    </div>
                 </div>
                 <button 
                    onClick={onClose}
                    className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                 >
                    <FaTimes />
                 </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3 text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        1 Million+ Questions answered within 24 hours
                    </div>
                    
                    <textarea 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question about colleges, exams, or career paths here. Be as detailed as possible..."
                        className="w-full h-40 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-orange focus:ring-4 focus:ring-orange-500/10 transition-all outline-none resize-none text-gray-700 placeholder-gray-400 text-sm leading-relaxed"
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-6 py-2.5 bg-brand-orange text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 transition-all"
                    >
                        <FaPaperPlane className="text-xs" /> Post Question
                    </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AskModal;
