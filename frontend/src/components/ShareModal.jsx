import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaTelegram, FaLink } from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose }) => {
  const shareLinks = [
    { name: 'WhatsApp', icon: <FaWhatsapp />, color: 'bg-green-500', link: '#' },
    { name: 'Instagram', icon: <FaInstagram />, color: 'bg-pink-600', link: '#' },
    { name: 'Twitter', icon: <FaTwitter />, color: 'bg-sky-500', link: '#' },
    { name: 'LinkedIn', icon: <FaLinkedin />, color: 'bg-blue-700', link: '#' },
    { name: 'Facebook', icon: <FaFacebook />, color: 'bg-blue-600', link: '#' },
    { name: 'Telegram', icon: <FaTelegram />, color: 'bg-blue-500', link: '#' },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-blue to-blue-800 p-6 flex items-center justify-between text-white">
                 <h3 className="text-xl font-bold leading-tight">Share with friends</h3>
                 <button 
                    onClick={onClose}
                    className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                 >
                    <FaTimes />
                 </button>
              </div>

              {/* Body */}
              <div className="p-8">
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {shareLinks.map((item, index) => (
                        <a 
                            key={index} 
                            href={item.link}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-14 h-14 rounded-full ${item.color} text-white flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                {item.icon}
                            </div>
                            <span className="text-xs font-medium text-gray-600 group-hover:text-brand-orange transition-colors">{item.name}</span>
                        </a>
                    ))}
                </div>

                {/* Copy Link Section */}
                <div className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-gray-50">
                    <div className="bg-white p-2 rounded-lg text-gray-400">
                        <FaLink />
                    </div>
                    <input 
                        type="text" 
                        readOnly 
                        value="https://collegedost.com/..." 
                        className="bg-transparent border-none outline-none text-sm text-gray-500 flex-1 w-full"
                    />
                    <button 
                        onClick={copyLink}
                        className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                    >
                        Copy
                    </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
