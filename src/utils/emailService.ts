export const sendShipmentEmail = async (
    userEmail: string,
    userName: string,
    trackingId: string,
    status: string,
    receiverName: string,
    destination: string
) => {
    const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.warn("VITE_RESEND_API_KEY is not set. Email not sent.");
        return;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {
                background-color: #121212;
                color: #e5e7eb;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #1a1a1a;
                border-radius: 12px;
                overflow: hidden;
            }
            .header {
                background-color: #5b58ed; /* Purple/Blue */
                padding: 30px;
                text-align: left;
                color: white;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .header p {
                margin: 8px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .greeting {
                font-size: 18px;
                font-weight: bold;
                color: white;
                margin-bottom: 15px;
            }
            .intro {
                color: #9ca3af;
                margin-bottom: 25px;
            }
            .card {
                background-color: #212433; /* Dark blue/gray */
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 25px;
            }
            .card-item {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                font-size: 16px;
            }
            .card-item:last-child {
                margin-bottom: 0;
            }
            .icon {
                margin-right: 12px;
                font-size: 20px;
            }
            .label {
                color: #e5e7eb;
                font-weight: 500;
                margin-right: 8px;
            }
            .value-tracking {
                color: #8b87f8; /* Light purple */
                font-weight: bold;
            }
            .value-status {
                color: #22c55e; /* Green */
                font-weight: bold;
            }
            .value-default {
                color: white;
            }
            .footer {
                color: #6b7280;
                font-size: 14px;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Tracking Created Successfully</h1>
                <p>Your shipment has been recorded</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${userName},</div>
                
                <div class="intro">
                    You have successfully created a new tracking record. Here are the details:
                </div>
                
                <div class="card">
                    <div class="card-item">
                        <span class="icon">🧾</span>
                        <span class="label">Tracking ID:</span>
                        <span class="value-tracking">${trackingId}</span>
                    </div>
                    <div class="card-item">
                        <span class="icon">📌</span>
                        <span class="label">Status:</span>
                        <span class="value-status">${status}</span>
                    </div>
                    <div class="card-item">
                        <span class="icon">👤</span>
                        <span class="label">Receiver:</span>
                        <span class="value-default">${receiverName}</span>
                    </div>
                    <div class="card-item">
                        <span class="icon">🌍</span>
                        <span class="label">Destination:</span>
                        <span class="value-default">${destination}</span>
                    </div>
                </div>
                
                <div class="footer">
                    This transaction has been billed to your wallet. You can manage or track this shipment from your dashboard.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Pacific Cargo <notifications@resend.dev>', // resend.dev is the default sandbox domain
                to: [userEmail],
                subject: `Shipment Created: ${trackingId}`,
                html: htmlContent,
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Failed to send email via Resend:", error);
            throw new Error(error.message || "Failed to send email");
        }
        
        console.log("Email sent successfully!");
    } catch (err) {
        console.error("Email service error:", err);
    }
};
