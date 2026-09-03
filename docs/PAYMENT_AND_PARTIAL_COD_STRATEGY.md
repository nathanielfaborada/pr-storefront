# 💳 P&R Archival Studio: Payment & 50% Partial COD Strategy
> **Client Proposal & Implementation Blueprint**  
> *Prepared for Client Review & Decision Making*

---

## 🎯 Executive Summary & Context

Para sa mga exclusive streetwear drops at curated 1-of-1 thrift archives, ang pinakamalaking hamon ng negosyo ay ang **RTS (Return to Sender)** at mga **Joy Reservers / Bogus Buyers** kapag Full Cash-on-Delivery (COD) ang ginagamit. Kapag hindi tinanggap ng buyer ang parcel, ang brand ang sumasagot sa delivery fee at naho-hold ang rare na damit nang 1 hanggang 2 linggo.

Upang masolusyonan ito, ipinapatupad natin ang **50% Partial COD / Half-Payment Policy**:
1. **50% Downpayment:** Binabayaran agad ng buyer bago i-pack ang order upang maging 100% committed sila.
2. **50% Remaining Balance:** Binabayaran via COD pagka-deliver ng J&T Express rider sa kanilang pintuan.

Nasa ibaba ang **2 Pagpipilian (Option 1 vs. Option 2)** kung paano natin iko-kolekta at iva-validate ang 50% downpayment.

---

## ⚖️ Side-by-Side Comparison

| Feature / Criteria | 📱 Option 1: Manual QR + Slip Dropzone | ⚡ Option 2: Automated PayMongo Gateway |
| :--- | :--- | :--- |
| **Transaction Fees** | **0% (LIBRE / Walang bawas)** | **~2.0% to 2.5%** per transaction |
| **Payment Methods** | GCash QR, Maya QR, Bank Transfer (BDO/BPI) | GCash, Maya, QRPh, GrabPay, Credit/Debit Cards |
| **Verification Speed** | **Manual Audit** (1–5 mins sa Admin Panel) | **Instant / Automatic** (1–2 seconds via Webhook) |
| **Admin Effort** | Kailangan i-click ang *"View Slip"* at *"Approve"* | **Zero-Touch** (Kusa nagiging `Verified` & ready for print) |
| **Setup Requirements** | Personal GCash / Maya QR Code lang | DTI / SEC registration & PayMongo Merchant Account |
| **Fraud Protection** | Tao ang nagba-validate ng 13-digit ref number | Bangko at Payment Gateway ang nagde-detect ng peke |
| **Deployment Time** | **Available Na Agad (Ready to use)** | 1–3 days API integration & account approval |

---

## 📱 Option 1: Manual GCash / Maya QR & Slip Audit
*Ang "Zero-Fee / Direct Studio Control" Model*

### 🔄 Paano Gumagana ang Flow:
1. **Customer Side:**
   - Sa Checkout, pipiliin ng customer ang **GCash / Maya QR**.
   - Makikita nila ang Studio QR Code at ang exact **50% Downpayment amount** (hal. `₱1,275` mula sa `₱2,549`).
   - I-scan nila gamit ang kanilang GCash app, kukunin ang **13-digit Reference Number**, at ia-upload ang screenshot ng resibo sa dropzone.
2. **Admin Side:**
   - Papasok ang order sa Admin Panel sa status na **Pending Verification**.
   - Bubuksan ng admin ang **"View Slip"** modal kung saan makikita ang screenshot, customer details, at reference number.
   - Kapag tugma sa natanggap sa GCash account, pipindutin lang ang **`✓ Approve & Release Waybill`**.

### 🌟 Bakit Maganda si Option 1:
- ✅ **100% ng Benta ay sa Inyo (0% Deductions):** Walang kaltas na transaction fees o platform commissions.
- ✅ **Walang Requirement na DTI / Business Permit:** Kahit personal GCash number o Maya QR ay pwedeng-pwedeng gamitin agad.
- ✅ **Personal Touch & High Control:** May pagkakataon ang admin na suriin ang bawat buyer bago ipadala ang mamahaling archival piece.

### ⚠️ Limitasyon:
- Kailangan ng admin na sumulyap sa phone o mag-approve sa admin panel kapag may bagong order.

---

## ⚡ Option 2: Automated PayMongo Payment Gateway
*Ang "Auto-Pilot / Instant Checkout" Model*

### 🔄 Paano Gumagana ang Flow:
1. **Customer Side:**
   - Sa Checkout, pipindutin ng buyer ang **Pay via GCash / Maya / Card**.
   - Kusa silang ire-redirect sa secure PayMongo payment screen kung saan maglo-login sila sa kanilang GCash/e-wallet.
   - Pagkatapos magbayad ng 50% deposit, babalik sila sa website na **Instant Order Confirmed**.
2. **System & Admin Side:**
   - Magpapadala ang PayMongo ng secure **Webhook Event** sa website.
   - Kusa (automatically) na magiging **`Payment Verified`** ang order nang hindi na kailangang buksan ng admin ang slip.
   - Agad na lalabas ang J&T Courier Waybill para sa pickup ng rider.

### 🌟 Bakit Maganda si Option 2:
- 🚀 **100% Hands-Free / Auto-Pilot:** Kahit natutulog o nag-eempake ang team, kusa na-ve-verify ang mga bayad.
- 🚀 **Multi-Payment Support:** Bukod sa GCash at Maya, makakatanggap din ng Visa, Mastercard, GrabPay, at universal QRPh.
- 🚀 **Instant Drop Scalability:** Kayang mag-proseso ng 100+ sabay-sabay na buyers sa loob ng 5 minuto nang walang manual delay.

### ⚠️ Limitasyon:
- May bayad na **~2.0% - 2.5%** per transaction (halimbawa: kung `₱1,275` ang deposit, may kaltas na mga ~`₱25` to `₱30`).
- Nangangailangan ng PayMongo business account application.

---

## 📦 Paano I-Ha-Handle ang Natitirang 50% Balance sa Courier (J&T Express)

Kahit Option 1 o Option 2 ang piliin, pareho ang magiging sistema pagdating sa courier dispatch:

1. **Declared COD Amount sa Waybill:**
   - Sa halip na buong `₱2,549`, ang naka-declare sa J&T Waybill pouch ay ang **natitirang 50% balance lang** (hal. `₱1,274`).
2. **Rider Collection:**
   - Kokolektahin ng J&T rider ang `₱1,274` sa buyer bago ibigay ang parcel.
3. **Remittance:**
   - Kusa itong ire-remit ng J&T sa inyong naka-link na bank account o courier portal wallet.

---

## 💡 Recommendation & Strategy Plan

### Para sa Phase 1 (Launch & Immediate Drop):
> **Inirerekomenda: Simulan muna sa Option 1 (Manual QR Slip)**
> - Agad na magagamit nang walang delay sa approval ng PayMongo.
> - Walang bawas sa kikitain ng studio sa unang drop.
> - Masusubukan ang response ng mga buyers sa 50% partial COD flow.

### Para sa Phase 2 (Scale & High-Volume Drops):
> **I-upgrade sa Option 2 (PayMongo Gateway)**
> - Kapag lumalaki na ang bawat drop sa 50–100+ items at kailangan na ng instant automation upang hindi mapagod ang admin sa pag-verify ng resibo.

---

*📄 Document generated for PR Archival Studio client walkthrough.*
