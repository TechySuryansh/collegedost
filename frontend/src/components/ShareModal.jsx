import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaTelegram, FaLink } from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const shareLinks = [
    { name: 'WhatsApp', icon: <FaWhatsapp />, color: 'bg-green-500', hoverColor: 'hover:bg-green-600', link: '#' },
    { name: 'Instagram', icon: <FaInstagram />, color: 'bg-pink-600', hoverColor: 'hover:bg-pink-700', link: '#' },
    { name: 'Twitter', icon: <FaTwitter />, color: 'bg-sky-500', hoverColor: 'hover:bg-sky-600', link: '#' },
    { name: 'LinkedIn', icon: <FaLinkedin />, color: 'bg-blue-700', hoverColor: 'hover:bg-blue-800', link: '#' },
    { name: 'Facebook', icon: <FaFacebook />, color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700', link: '#' },
    { name: 'Telegram', icon: <FaTelegram />, color: 'bg-sky-500', hoverColor: 'hover:bg-sky-600', link: '#' },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col relative border border-white/20">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-indigo via-blue-600 to-brand-cyan p-6 flex items-center justify-between text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div>
                    <h3 className="text-2xl font-bold leading-tight font-heading">Share with friends</h3>
                    <p className="text-blue-100 text-sm opacity-90">Spread the word about Collegedost</p>
                 </div>
                 <button 
                    onClick={onClose}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all backdrop-blur-sm z-10"
                 >
                    <FaTimes />
                 </button>
              </div>

              {/* Body */}
              <div className="p-8">
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-y-8 gap-x-4 mb-8">
                    {shareLinks.map((item, index) => (
                        <motion.a 
                            key={index} 
                            href={item.link}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center gap-3 group cursor-pointer"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${item.color} ${item.hoverColor} text-white flex items-center justify-center text-3xl shadow-lg shadow-gray-200 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl transition-all duration-300`}>
                                {item.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-600 group-hover:text-brand-indigo transition-colors">{item.name}</span>
                        </motion.a>
                    ))}
                </div>

                {/* Copy Link Section */}
                <div className="relative">
                    <div className="flex items-center gap-3 p-2 pr-3 rounded-2xl border border-gray-200 bg-gray-50 focus-within:border-brand-indigo/50 focus-within:ring-4 focus-within:ring-brand-indigo/10 transition-all">
                        <div className="bg-white p-2.5 rounded-xl text-brand-indigo shadow-sm border border-gray-100">
                            <FaLink />
                        </div>
                        <input 
                            type="text" 
                            readOnly 
                            value="https://collegedost.com/..." 
                            className="bg-transparent border-none outline-none text-sm text-gray-600 font-medium flex-1 w-full"
                        />
                        <button 
                            onClick={copyLink}
                            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white shadow-green-500/30 shadow-lg' : 'bg-gray-900 text-white hover:bg-black hover:shadow-lg'}`}
                        >
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
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
