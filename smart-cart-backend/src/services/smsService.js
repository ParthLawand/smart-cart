const https = require("https");

const FAST2SMS_API_KEY = "CZQ19wIOePdJ2hRmDTVSp36XjxBYqEzl5NbsotHyvFkUfi0M4rvh1GOpuP5c6LakZMEQribyITYA4VxR";

const sendBillSMS = async (phone, billText) => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            route: "q",
            message: billText,
            language: "english",
            flash: 0,
            numbers: String(phone)
        });

        const options = {
            method: "POST",
            hostname: "www.fast2sms.com",
            path: "/dev/bulkV2",
            headers: {
                "authorization": FAST2SMS_API_KEY,
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    console.log("[SMS] Fast2SMS Response:", JSON.stringify(parsed));
                    resolve(parsed);
                } catch (e) {
                    console.error("[SMS] Parse error:", data);
                    resolve({ return: false, message: data });
                }
            });
        });

        req.on("error", (err) => {
            console.error("[SMS] Request Error:", err);
            reject(err);
        });

        req.write(postData);
        req.end();
    });
};

const generateBillText = (cart) => {
    let bill = `SMART CART - RECEIPT\n`;
    bill += `--------------------\n`;
    cart.items.forEach((item, i) => {
        bill += `${i + 1}. ${item.name} x${item.quantity} = Rs.${item.price * item.quantity}\n`;
    });
    const tax = Math.round(cart.total_amount * 0.05);
    const total = cart.total_amount + tax;
    bill += `--------------------\n`;
    bill += `Subtotal: Rs.${cart.total_amount}\n`;
    bill += `GST(5%): Rs.${tax}\n`;
    bill += `TOTAL: Rs.${total}\n`;
    bill += `--------------------\n`;
    bill += `Status: PAID\n`;
    bill += `Thank you for shopping!`;
    return bill;
};

module.exports = { sendBillSMS, generateBillText };
