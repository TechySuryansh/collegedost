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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] transition-opacity"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col relative border border-white/20">
              
              {/* Header */}
               <div className="bg-gradient-to-r from-brand-indigo via-blue-600 to-brand-cyan p-6 flex items-center justify-between text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                        <FaQuestionCircle className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold leading-tight font-heading tracking-wide">Ask your Question</h3>
                        <p className="text-xs text-blue-100 mt-0.5 opacity-90 font-medium">Get answers from experts & students</p>
                    </div>
                 </div>
                 <button 
                    onClick={onClose}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all backdrop-blur-sm z-10"
                 >
                    <FaTimes />
                 </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-8">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-full border border-emerald-100 shadow-sm w-fit">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span>1 Million+ Questions answered within 24 hours</span>
                    </div>
                    
                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Your Question</label>
                    <textarea 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question about colleges, exams, or career paths here. Be as detailed as possible..."
                        className="w-full h-40 p-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-indigo/50 focus:ring-4 focus:ring-brand-indigo/10 transition-all outline-none resize-none text-gray-700 placeholder-gray-400 text-sm leading-relaxed shadow-inner"
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-brand-orange to-red-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-orange/30 hover:shadow-brand-orange/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 transition-all transform"
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
