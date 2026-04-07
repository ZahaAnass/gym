<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice_number }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'DM Sans', sans-serif;
            background: #0f0f0f;
            color: #f0f0f0;
            padding: 40px 20px;
            min-height: 100vh;
        }

        .btn-print {
            display: block;
            width: 220px;
            margin: 0 auto 28px auto;
            padding: 13px 20px;
            background: #C8F04E;
            color: #000;
            text-align: center;
            border-radius: 50px;
            font-weight: 700;
            font-family: 'Syne', sans-serif;
            font-size: 14px;
            cursor: pointer;
            border: none;
            letter-spacing: 0.3px;
            transition: background 0.2s, transform 0.2s;
        }
        .btn-print:hover { background: #b8df3e; transform: translateY(-1px); }

        .invoice-box {
            max-width: 820px;
            margin: 0 auto;
            background: #161616;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            overflow: hidden;
        }

        /* ── TOP ACCENT BAR ── */
        .accent-bar {
            height: 4px;
            background: #C8F04E;
        }

        /* ── HEADER ── */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 40px 48px 36px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .gym-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .gym-logo-mark {
            width: 40px; height: 40px;
            background: #C8F04E;
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px;
        }
        .gym-name {
            font-family: 'Syne', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: #f0f0f0;
            letter-spacing: -0.5px;
        }

        .company-details {
            font-size: 13px;
            color: #6b6b6b;
            line-height: 1.7;
            padding-left: 2px;
        }

        .invoice-details { text-align: right; }
        .invoice-title {
            font-family: 'Syne', sans-serif;
            font-size: 38px;
            font-weight: 800;
            color: rgba(255,255,255,0.07);
            letter-spacing: 3px;
            margin-bottom: 16px;
            line-height: 1;
        }
        .invoice-meta { font-size: 13px; color: #6b6b6b; line-height: 2; }
        .invoice-meta strong { color: #aaa; font-weight: 500; }
        .invoice-meta span { color: #C8F04E; font-weight: 600; }

        /* ── BILLING GRID ── */
        .billing-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .billing-section {
            padding: 28px 48px;
        }
        .billing-section + .billing-section {
            border-left: 1px solid rgba(255,255,255,0.07);
            text-align: right;
        }

        .billing-section h3 {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #444;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .billing-name {
            font-size: 16px;
            font-weight: 600;
            color: #f0f0f0;
            font-family: 'Syne', sans-serif;
        }
        .billing-email { font-size: 13px; color: #6b6b6b; margin-top: 3px; }

        .paid-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(200, 240, 78, 0.1);
            border: 1px solid rgba(200, 240, 78, 0.25);
            color: #C8F04E;
            font-weight: 700;
            font-size: 13px;
            padding: 7px 16px;
            border-radius: 50px;
            letter-spacing: 0.5px;
            font-family: 'Syne', sans-serif;
        }
        .paid-dot {
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #C8F04E;
        }

        /* ── TABLE ── */
        .table-wrap { padding: 36px 48px; }

        .details-table {
            width: 100%;
            border-collapse: collapse;
        }

        .details-table thead tr {
            border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .details-table th {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #444;
            padding: 0 0 14px 0;
            text-align: left;
            font-weight: 600;
        }
        .details-table th:last-child { text-align: right; }

        .details-table td {
            padding: 20px 0;
            font-size: 15px;
            color: #ccc;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            vertical-align: top;
        }
        .details-table td:last-child { text-align: right; color: #f0f0f0; font-weight: 500; }

        .desc-main { color: #f0f0f0; font-weight: 500; display: block; margin-bottom: 3px; }
        .desc-sub { color: #555; font-size: 12px; }

        .method-badge {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 50px;
            padding: 4px 12px;
            font-size: 12px; color: #888;
        }
        .stripe-icon { color: #635bff; font-size: 14px; }

        /* ── TOTAL ROW ── */
        .total-section {
            margin-top: 8px;
            padding-top: 20px;
            display: flex;
            justify-content: flex-end;
        }
        .total-box {
            background: rgba(200, 240, 78, 0.07);
            border: 1px solid rgba(200, 240, 78, 0.15);
            border-radius: 14px;
            padding: 20px 28px;
            min-width: 260px;
        }
        .total-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #555;
            margin-bottom: 6px;
            font-weight: 600;
        }
        .total-amount {
            font-family: 'Syne', sans-serif;
            font-size: 32px;
            font-weight: 800;
            color: #C8F04E;
            letter-spacing: -1px;
            line-height: 1;
        }
        .total-currency {
            font-size: 14px;
            font-weight: 500;
            color: #888;
            margin-top: 4px;
        }

        /* ── FOOTER ── */
        .invoice-footer {
            border-top: 1px solid rgba(255,255,255,0.07);
            padding: 24px 48px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
        }
        .footer-note { font-size: 13px; color: #444; }
        .footer-txid {
            font-size: 11px;
            color: #333;
            font-family: 'DM Sans', monospace;
            text-align: right;
        }
        .footer-txid strong { color: #555; display: block; margin-bottom: 3px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }

        /* ── PRINT ── */
        @media print {
            body {
                background: #fff;
                color: #111;
                padding: 0;
            }
            .no-print { display: none; }
            .invoice-box {
                background: #fff;
                border: none;
                border-radius: 0;
                max-width: 100%;
            }
            .accent-bar { background: #C8F04E; }
            .invoice-title { color: #e5e5e5; }
            .billing-section h3,
            .details-table th,
            .total-label { color: #999; }
            .details-table td { color: #333; border-color: #f0f0f0; }
            .details-table td:last-child { color: #111; }
            .desc-main { color: #111; }
            .billing-name { color: #111; }
            .invoice-meta strong { color: #666; }
            .invoice-meta span { color: #5a8a00; }
            .paid-badge { background: #f0fae0; border-color: #b5d952; color: #5a8a00; }
            .paid-dot { background: #5a8a00; }
            .total-box { background: #f5fce8; border-color: #c0e060; }
            .total-amount { color: #5a8a00; }
            .method-badge { background: #f8f8f8; border-color: #e0e0e0; }
            .footer-note, .footer-txid, .company-details,
            .billing-email, .desc-sub { color: #999; }
            .billing-grid { border-color: #f0f0f0; }
            .billing-section + .billing-section { border-color: #f0f0f0; }
            .header { border-color: #f0f0f0; }
            .invoice-footer { border-color: #f0f0f0; }
            .gym-name { color: #111; }
        }
    </style>
</head>
<body>

<button class="btn-print no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>

<div class="invoice-box">
    <div class="accent-bar"></div>

    <!-- HEADER -->
    <div class="header">
        <div>
            <div class="gym-logo">
                <div class="gym-logo-mark">🏋️</div>
                <div class="gym-name">AI GYM</div>
            </div>
            <div class="company-details">
                123 Intelligent Fitness Blvd.<br>
                Casablanca, 20000, Morocco<br>
                contact@aigym.ma &nbsp;·&nbsp; +212 5 22 00 00 00
            </div>
        </div>
        <div class="invoice-details">
            <div class="invoice-title">RECEIPT</div>
            <div class="invoice-meta">
                <strong>Invoice #:</strong> <span>{{ $invoice_number }}</span><br>
                <strong>Date Paid:</strong> <span>{{ $date }}</span>
            </div>
        </div>
    </div>

    <!-- BILLING -->
    <div class="billing-grid">
        <div class="billing-section">
            <h3>Billed To</h3>
            <div class="billing-name">{{ $user->name }}</div>
            <div class="billing-email">{{ $user->email }}</div>
        </div>
        <div class="billing-section">
            <h3>Payment Status</h3>
            <div class="paid-badge">
                <div class="paid-dot"></div>
                PAID IN FULL
            </div>
        </div>
    </div>

    <!-- TABLE -->
    <div class="table-wrap">
        <table class="details-table">
            <thead>
            <tr>
                <th>Description</th>
                <th>Payment Method</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    <span class="desc-main">Premium Gym Membership</span>
                    <span class="desc-sub">Installment {{ $payment->installment_number }}</span>
                </td>
                <td>
                        <span class="method-badge">
                            <span class="stripe-icon">⚡</span>
                            {{ ucfirst($payment->method) }} · Stripe Secure
                        </span>
                </td>
                <td>{{ number_format($payment->amount, 2) }} MAD</td>
            </tr>
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-box">
                <div class="total-label">Total Paid</div>
                <div class="total-amount">{{ number_format($payment->amount, 2) }}</div>
                <div class="total-currency">Moroccan Dirham (MAD)</div>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <div class="invoice-footer">
        <div class="footer-note">
            Thank you for choosing AI Gym.<br>
            This is a computer-generated receipt.
        </div>
        <div class="footer-txid">
            <strong>Stripe Transaction ID</strong>
            {{ $payment->stripe_payment_intent_id }}
        </div>
    </div>
</div>

</body>
</html>
