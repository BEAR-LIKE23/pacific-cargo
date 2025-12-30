
import React from 'react';
import { Package, Phone, User, Globe, Shield } from 'lucide-react';

interface WaybillProps {
    shipment: any;
    ref?: React.Ref<HTMLDivElement>;
}

const WaybillTemplate = React.forwardRef<HTMLDivElement, WaybillProps>(({ shipment }, ref) => {
    if (!shipment) return null;

    return (
        <div
            ref={ref}
            style={{ width: '400px', padding: '24px', background: 'white', color: 'black', fontFamily: 'sans-serif' }}
            className="border-2 border-slate-900"
        >
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-6">
                <div className="flex items-center gap-2">
                    <Globe className="text-slate-900" size={24} />
                    <span className="font-black text-xl tracking-tighter uppercase">Pacific Cargo</span>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-500">Service Type</p>
                    <p className="font-black text-slate-900 uppercase">Standard Express</p>
                </div>
            </div>

            {/* Tracking Number Section */}
            <div className="text-center mb-6 py-4 bg-slate-900 text-white rounded-lg">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Tracking Number</p>
                <p className="text-2xl font-black tracking-widest">{shipment.tracking_code}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Sender Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                        <Package size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Sender / From</span>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-slate-900 capitalize">{shipment.sender_name}</p>
                        <p className="text-xs text-slate-600 mt-1 leading-tight">{shipment.origin}</p>
                        <div className="flex items-center gap-1 mt-2 text-slate-500">
                            <Phone size={10} />
                            <span className="text-[10px] font-medium">{shipment.sender_phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Receiver Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                        <User size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Receiver / To</span>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-slate-900 capitalize">{shipment.receiver_name}</p>
                        <p className="text-xs text-slate-600 mt-1 leading-tight">{shipment.destination}</p>
                        <div className="flex items-center gap-1 mt-2 text-slate-500">
                            <Phone size={10} />
                            <span className="text-[10px] font-medium">{shipment.receiver_phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipment Details */}
            <div className="border-2 border-slate-900 rounded-lg p-4 bg-slate-50 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-[8px] uppercase font-bold text-slate-400">Weight</p>
                        <p className="font-bold text-slate-900">{shipment.weight || '1.0'} kg</p>
                    </div>
                    <div>
                        <p className="text-[8px] uppercase font-bold text-slate-400">Items</p>
                        <p className="font-bold text-slate-900">1 unit</p>
                    </div>
                    <div>
                        <p className="text-[8px] uppercase font-bold text-slate-400">Insured</p>
                        <div className="flex items-center justify-center gap-1 text-slate-900">
                            <Shield size={10} />
                            <span className="font-bold">YES</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / QR Area */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-dashed border-slate-300">
                <div className="flex-1">
                    <p className="text-[8px] leading-tight text-slate-400 mb-2">
                        This waybill is a proof of shipment. By accepting this bill, the customer agrees to the terms and conditions of Pacific Cargo Logistics. All shipments are subject to security screening.
                    </p>
                    <div className="flex gap-4">
                        <div>
                            <p className="text-[8px] uppercase font-bold text-slate-400">Ship Date</p>
                            <p className="text-[10px] font-bold text-slate-900 text-nowrap">{new Date(shipment.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[8px] uppercase font-bold text-slate-400">Generated By</p>
                            <p className="text-[10px] font-bold text-slate-900">System (PAC-AUTO)</p>
                        </div>
                    </div>
                </div>
                <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded text-white font-black text-center text-[10px] p-2 leading-none cursor-default select-none">
                    QR<br />SCAN<br />ME
                </div>
            </div>
        </div>
    );
});

WaybillTemplate.displayName = 'WaybillTemplate';

export default WaybillTemplate;
