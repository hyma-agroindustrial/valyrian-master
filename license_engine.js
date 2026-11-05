/**
 * VALYRIAN MASTER SMC [v7.0] - License & Security Engine
 * Frias Quant Systems © 2026
 * Motor criptográfico sincronizado con el indicador en Pine Script
 */

const TRADINGVIEW_SCRIPT_URL = "https://www.tradingview.com/script/ufvEDDWN/";

// Genera un serial estandarizado con formato: VALY-XXXX-XXXX
function generateValyrianLicense(tvUsername, email, expYear, expMonth, expDay) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789@._-";
    const cleanEmail = (email || "").trim().toLowerCase();
    const raw = `${cleanEmail}_${expYear}_${expMonth}_${expDay}_valyrian998`;
    
    let h1 = 5381;
    let h2 = 52711;
    
    for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        const pos = alphabet.indexOf(ch);
        const cd = pos >= 0 ? pos + 30 : 42;
        h1 = ((h1 * 33) + cd) % 268435456;
        h2 = ((h2 * 33) + cd) % 268435456;
    }
    
    const p1 = (h1 % 9000) + 1000;
    const p2 = (h2 % 9000) + 1000;
    
    return `VALY-${p1}-${p2}`;
}

// Calcula días restantes hasta una fecha de expiración
function calculateDaysRemaining(expYear, expMonth, expDay) {
    const expDate = new Date(expYear, expMonth - 1, expDay, 23, 59, 59);
    const today = new Date();
    const diffTime = expDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Determina el estado del suscriptor
function getLicenseStatus(daysRemaining, isManualBlocked = false) {
    if (isManualBlocked) {
        return { code: "BLOCKED", label: "Bloqueado", colorClass: "status-blocked", badge: "🔴 BLOQUEADO" };
    }
    if (daysRemaining <= 0) {
        return { code: "EXPIRED", label: "Expirado", colorClass: "status-expired", badge: "⛔ EXPIRADO" };
    }
    if (daysRemaining <= 5) {
        return { code: "WARNING", label: `${daysRemaining} días`, colorClass: "status-warning", badge: `🟡 POR VENCER (${daysRemaining}d)` };
    }
    return { code: "ACTIVE", label: `${daysRemaining} días`, colorClass: "status-active", badge: "🟢 ACTIVO" };
}

// Mensaje listo para enviar por WhatsApp / Telegram / Correo al cliente
function buildClientWelcomeMessage(clientName, tvUsername, email, licenseKey, expYear, expMonth, expDay) {
    const expDateStr = `${String(expDay).padStart(2, '0')}/${String(expMonth).padStart(2, '0')}/${expYear}`;
    return `🛡️ *BIENVENIDO A VALYRIAN MASTER SMC [v7.0] - FRIAS QUANT SYSTEMS* 🛡️

Hola *${clientName}*, tu acceso al algoritmo cuantitativo para ORO (XAUUSD) ha sido autorizado.

📋 *TUS DATOS DE ACCESO:*
• *Correo Registrado:* ${email}
• *Usuario TradingView:* ${tvUsername}
• *Clave de Licencia:* \`${licenseKey}\`
• *Fecha de Expiración:* ${expDateStr}
• *Enlace del Indicador:* ${TRADINGVIEW_SCRIPT_URL}

🚀 *PASOS DE ACTIVACIÓN (2 MINUTOS):*
1. Abre el enlace del indicador: ${TRADINGVIEW_SCRIPT_URL}
2. Haz clic en el botón *☆ Añadir a scripts favoritos*.
3. Abre tu gráfico de *XAUUSD* en TradingView.
4. Ve a *Indicadores* (fx) > pestaña *Favoritos* y agrega *Valyrian Master SMC [v7.0]*.
5. Abre los *Ajustes* del indicador (icono de tuerca ⚙️) y en el grupo "0) CONTROL DE ACCESO & LICENCIA":
   - En *Correo del Suscriptor*, coloca: *${email}*
   - En *Clave de Licencia*, pega: \`${licenseKey}\`
   - En *Año / Mes / Día*, coloca: *${expYear} / ${expMonth} / ${expDay}*
6. ¡Listo! La pantalla se desbloqueará mostrando todas las confluencias, zonas OTE, FVG 50% CE y simulación Asia-Londres.

⚠️ *Nota:* La clave está firmada criptográficamente con tu correo y fecha. Si se alteran los datos en los ajustes, el indicador se bloqueará automáticamente.`;
}
