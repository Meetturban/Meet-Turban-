import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Sparkles, CreditCard, UserCheck, CalendarCheck, X } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '@backend/services/bookingService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000); // Polling feed updates
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    loadNotifications();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_booking': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'payment_update': return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'staff_assignment': return <UserCheck className="w-4 h-4 text-blue-400" />;
      case 'event_completion': return <CalendarCheck className="w-4 h-4 text-purple-400" />;
      default: return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-slate-900 border border-amber-500/30 hover:border-amber-500 text-amber-400 p-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-amber-500/10"
        title="Manager System Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popover Dropdown with z-[9999] */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-[420px] bg-slate-950 border-2 border-amber-500/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-[9999] overflow-hidden animate-fade-in">
          
          {/* Popover Header */}
          <div className="p-4 bg-slate-900 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl gold-gradient-bg flex items-center justify-center text-slate-950">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-100 tracking-wider">Manager System Feed</h3>
                <span className="text-[10px] text-amber-400 font-bold block">{unreadCount} Unread Notifications</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-amber-400 hover:underline bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/80 p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500 space-y-1">
                <Bell className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="font-semibold text-slate-400">No Notifications Received</p>
                <p className="text-[10px]">Real-time system events will show here.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl transition-all flex items-start justify-between gap-3 ${
                    n.read ? 'opacity-65 bg-slate-900/40 border border-transparent' : 'bg-slate-900 border border-amber-500/30 shadow-md'
                  }`}
                >
                  <div className="flex space-x-3 items-start flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 shadow-inner">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-amber-300 truncate">{n.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug break-words">{n.message}</p>
                      
                      <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>
                          {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {' '}
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!n.read && (
                          <span className="text-amber-400 font-extrabold uppercase tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-slate-500 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-800 shrink-0 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default NotificationBell;
