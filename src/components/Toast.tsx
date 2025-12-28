
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 5000, onClose }) => {
    const [animation, setAnimation] = useState('translate-x-full opacity-0');

    useEffect(() => {
        // Entrance animation
        const timer = setTimeout(() => {
            setAnimation('translate-x-0 opacity-100');
        }, 100);

        // Auto close timer
        const closeTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(closeTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setAnimation('translate-x-full opacity-0');
        setTimeout(onClose, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
            case 'error': return <XCircle className="text-red-500" size={20} />;
            case 'info': return <AlertCircle className="text-blue-500" size={20} />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-emerald-50 border-emerald-100';
            case 'error': return 'bg-red-50 border-red-100';
            case 'info': return 'bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className={`fixed top-6 right-6 z-[9999] transition-all duration-300 ease-out transform ${animation}`}>
            <div className={`flex items-center gap-4 p-4 rounded-2xl border shadow-2xl min-w-[320px] max-w-md ${getBgColor()} bg-white`}>
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
