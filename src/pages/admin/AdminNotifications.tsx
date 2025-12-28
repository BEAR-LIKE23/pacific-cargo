import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Send, User, Bell, CheckCircle } from 'lucide-react';
import Toast, { ToastType } from '../../components/Toast';

const AdminNotifications = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState('all');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await supabase.from('profiles').select('id, full_name, email');
            if (data) setUsers(data);
        };
        fetchUsers();
    }, []);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const targetUsers = selectedUser === 'all' ? users : users.filter(u => u.id === selectedUser);

            for (const user of targetUsers) {
                // 1. Email Notification (via Edge Function)
                await supabase.from('notification_logs').insert({
                    user_id: user.id,
                    type: 'manual_broadcast',
                    recipient_email: user.email,
                    subject: subject,
                    payload: { message: message }
                });

                // 2. Dashboard Notification (In-app)
                await supabase.from('notifications').insert({
                    user_id: user.id,
                    title: subject,
                    message: message,
                    type: 'info'
                });
            }

            showToast(`Notification sent to ${targetUsers.length} user(s)`);
            setSubject('');
            setMessage('');
        } catch (error: any) {
            console.error(error);
            showToast('Failed to send notifications: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Broadcast Notifications</h1>
                    <p className="text-slate-500">Send manual email and dashboard updates to users.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSend} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient(s)</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-white font-medium"
                                    >
                                        <option value="all">All Registered Users ({users.length})</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Subject / Headline</label>
                                <div className="relative">
                                    <Bell className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Schedule Update or Holiday Notice"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message Content</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write your announcement here..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || !subject || !message}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : <><Send size={20} /> Send Broadcast</>}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="bg-slate-50 p-6 border-t border-slate-200">
                        <div className="flex items-start gap-3">
                            <div className="bg-brand-100 text-brand-600 p-2 rounded-lg shrink-0">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Automated Delivery</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Broadcasts are logged in the system and automatically dispatched via email to the recipient's registered address.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminNotifications;
