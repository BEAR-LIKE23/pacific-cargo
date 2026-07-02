import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                <div className={`p-6 ${isDestructive ? 'bg-red-50' : 'bg-brand-50'}`}>
                    <div className="flex items-center gap-4 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'}`}>
                            <AlertTriangle size={20} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                    </div>
                    <p className="text-slate-600 ml-14 text-sm">{message}</p>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel(); // auto close after confirm click
                        }}
                        className={`px-4 py-2 rounded-xl text-white font-bold transition shadow-md ${
                            isDestructive 
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' 
                                : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/20'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
