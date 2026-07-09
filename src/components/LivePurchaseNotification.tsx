import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface PurchaseNotification {
  id: number;
  name: string;
  location: string;
  templateName: string;
  timeAgo: string;
  avatar: string;
}

const PURCHASE_POOL: PurchaseNotification[] = [
  { id: 1, name: "Arun", location: "Chennai", templateName: "Canva Pro Access", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
  { id: 2, name: "Karthik", location: "Coimbatore", templateName: "Canva Pro Master Kit", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" },
  { id: 3, name: "Divya", location: "Madurai", templateName: "Canva Pro Templates", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
  { id: 4, name: "Selvam", location: "Trichy", templateName: "Canva Pro Access", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" },
  { id: 5, name: "Anand", location: "Salem", templateName: "Canva Pro Master Kit", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80" },
  { id: 6, name: "Priya", location: "Vellore", templateName: "Canva Pro Access", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
  { id: 7, name: "Vijay", location: "Tirunelveli", templateName: "Canva Pro Templates", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" },
  { id: 8, name: "Ramya", location: "Erode", templateName: "Canva Pro Master Kit", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" },
  { id: 9, name: "Sanjay", location: "Thanjavur", templateName: "Canva Pro Access", timeAgo: "2 minutes ago", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" }
];

export default function LivePurchaseNotification() {
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);
  const [index, setIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show first notification after a short delay (3 seconds)
    const initialTimeout = setTimeout(() => {
      setCurrentNotification(PURCHASE_POOL[0]);
    }, 3000);

    // Set up an interval to cycle through notifications
    const cycleInterval = setInterval(() => {
      // Hide current notification
      setCurrentNotification(null);

      // Wait for exit animation to complete before showing next
      setTimeout(() => {
        setIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % PURCHASE_POOL.length;
          setCurrentNotification(PURCHASE_POOL[nextIndex]);
          return nextIndex;
        });
      }, 600); // matching motion duration

    }, 10000); // Cycle every 10 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(cycleInterval);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none max-w-[290px] w-full px-3 sm:px-0">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="pointer-events-auto bg-[#FAF9F6] border-2 border-[#1A1A1A] p-2.5 shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-2.5 relative overflow-hidden rounded-lg"
          >
            {/* Ambient Purple Gradient background flash line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7D42FB] to-[#FF4B91]" />
            
            {/* Left Profile Avatar */}
            <img 
              src={currentNotification.avatar} 
              alt={currentNotification.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-[#1A1A1A] shrink-0 object-cover shadow-[1px_1px_0px_0px_#1A1A1A]" 
            />

            {/* Notification content */}
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-[11px] text-neutral-800 leading-none font-sans font-extrabold">
                <span className="text-[#7D42FB]">{currentNotification.name}</span> <span className="text-neutral-500 font-normal">from</span> {currentNotification.location}
              </p>
              <p className="text-[10px] text-neutral-600 font-serif italic truncate mt-0.5">
                Purchased <span className="font-sans not-italic font-black text-[#1A1A1A] text-[9.5px] bg-[#7D42FB]/5 border border-[#7D42FB]/20 px-1 py-0.2 rounded">{currentNotification.templateName}</span>
              </p>
              <span className="text-[9px] font-mono font-bold text-[#7D42FB] block mt-0.5">
                ⚡ {currentNotification.timeAgo}
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-2 right-2 text-neutral-400 hover:text-[#1A1A1A] transition-colors p-0.5 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
