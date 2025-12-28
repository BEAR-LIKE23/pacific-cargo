// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore: Resend API Key from Supabase Secrets
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req: Request) => {
    try {
        const { record, type } = await req.json()

        // Determine template based on type
        let subject = ''
        let html = ''
        let to = record.recipient_email

        if (type === 'booking') {
            subject = `Shipment Confirmed: ${record.payload.tracking_code}`
            html = `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #2563eb; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Shipment Registered</h1>
                        </div>
                        <div style="padding: 40px; color: #334155; line-height: 1.6;">
                            <p style="font-size: 16px;">Hello,</p>
                            <p style="font-size: 16px;">Your shipment has been successfully registered in our system. Below are your tracking details:</p>
                            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                                <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: bold;">Tracking Number</p>
                                <p style="margin: 5px 0 0; font-size: 24px; font-family: monospace; color: #0f172a; font-bold: true;">${record.payload.tracking_code}</p>
                            </div>
                            <p style="font-size: 16px;">Current Status: <span style="font-weight: bold; color: #2563eb;">${record.payload.status}</span></p>
                            <div style="text-align: center; margin-top: 35px;">
                                <a href="https://pacific-cargo.netlify.app/track?code=${record.payload.tracking_code}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">Track My Shipment</a>
                            </div>
                            <p style="margin-top: 40px; font-size: 14px; color: #94a3b8; text-align: center;">If you didn't expect this email, please ignore it.</p>
                        </div>
                    </div>
                </div>
            `
        } else if (type === 'status_update') {
            subject = `Update: ${record.payload.tracking_code} is now ${record.payload.new_status}`
            html = `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #2563eb; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Shipment Update</h1>
                        </div>
                        <div style="padding: 40px; color: #334155; line-height: 1.6;">
                            <p style="font-size: 16px;">Your shipment <strong>${record.payload.tracking_code}</strong> has a new update:</p>
                            <div style="border-left: 4px solid #2563eb; padding-left: 20px; margin: 30px 0;">
                                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0f172a;">${record.payload.new_status}</p>
                                <p style="margin: 5px 0 0; color: #64748b;">${record.payload.location || 'In Transit'}</p>
                            </div>
                            <div style="text-align: center; margin-top: 35px;">
                                <a href="https://pacific-cargo.netlify.app/track?code=${record.payload.tracking_code}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">View Full History</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        } else if (type === 'deposit') {
            subject = 'Wallet Top-up Confirmed'
            html = `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #059669; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Deposit Successful</h1>
                        </div>
                        <div style="padding: 40px; color: #334155; line-height: 1.6;">
                            <p style="font-size: 16px; text-align: center;">Your wallet funding has been confirmed!</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="margin: 0; color: #64748b; text-transform: uppercase; font-size: 14px; font-weight: bold;">Amount Added</p>
                                <p style="margin: 5px 0 0; font-size: 36px; font-weight: bold; color: #059669;">₦${record.payload.amount.toLocaleString()}</p>
                                <p style="margin: 10px 0 0; color: #94a3b8; font-size: 14px;">Via ${record.payload.method}</p>
                            </div>
                            <div style="text-align: center; margin-top: 35px;">
                                <a href="https://pacific-cargo.netlify.app/dashboard" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        } else if (type === 'manual_broadcast') {
            subject = record.subject || 'Pacific Cargo: Announcement'
            html = `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #0f172a; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Announcement</h1>
                        </div>
                        <div style="padding: 40px; color: #334155; line-height: 1.6;">
                            <h2 style="color: #0f172a; font-size: 20px; margin-bottom: 20px;">${record.subject}</h2>
                            <p style="font-size: 16px; white-space: pre-wrap;">${record.payload.message}</p>
                            <div style="text-align: center; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 25px;">
                                <a href="https://pacific-cargo.netlify.app/dashboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">Go to Dashboard</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }

        if (!to) throw new Error('Recipient email is missing')

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Pacific Cargo <notifications@pacific-cargo.com>',
                to: [to],
                subject: subject,
                html: html,
            }),
        })

        const data = await res.json()

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
