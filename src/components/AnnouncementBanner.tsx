import React from 'react';
import { X, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnnouncementBannerProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ message, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative z-50 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <Megaphone size={16} className="animate-pulse shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: message }} className="truncate sm:whitespace-normal" />
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors shrink-0 ml-4">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
