/**
 * VALYRIAN MASTER SMC [v7.0] - License & Security Engine
 * Frias Quant Systems © 2026
 * Motor criptográfico para generación y validación de licencias
 */

const VALYRIAN_SALT = "VALYRIAN_QUANT_XAUUSD_998";

// Genera un serial estandarizado con formato: VALY-XXXX-XXXX
function generateValyrianLicense(tvUsername, email, expYear, expMonth, expDay) {
    const cleanUser  = (tvUsername || "").trim().toLowerCase();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanDate  = `${expYear}-${String(expMonth).padStart(2, '0')}-${String(expDay).padStart(2, '0')}`;
    
    const seedString = `${cleanUser}_${cleanEmail}_${cleanDate}_${VALYRIAN_SALT}`;
    
    let hashA = 0x811c9dc5;
    let hashB = 0x55555555;
    
    for (let i = 0; i < seedString.length; i++) {
        const code = seedString.charCodeAt(i);
        hashA ^= code;
        hashA = Math.imul(hashA, 0x01000193);
        
        hashB = ((hashB << 5) - hashB) + code;
        hashB |= 0;
    }
    
    const partA = Math.abs(hashA % 9000 + 1000).toString();
    const partB = Math.abs(hashB % 9000 + 1000).toString();
    
    return `VALY-${partA}-${partB}`;
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
function buildClientWelcomeMessage(clientName, tvUsername, licenseKey, expYear, expMonth, expDay) {
    const expDateStr = `${String(expDay).padStart(2, '0')}/${String(expMonth).padStart(2, '0')}/${expYear}`;
    return `🛡️ *BIENVENIDO A VALYRIAN MASTER SMC [v7.0] - FRIAS QUANT SYSTEMS* 🛡️

Hola *${clientName}*, tu suscripción institucional para ORO (XAUUSD) ha sido activada con éxito.

📋 *DETALLES DE TU ACCESO:*
• *Usuario TradingView:* ${tvUsername}
• *Clave de Licencia:* \`${licenseKey}\`
• *Fecha de Expiración:* ${expDateStr}

🚀 *PASOS PARA CARGAR EL INDICADOR:*
1. Abre tu gráfico de *XAUUSD* en TradingView.
2. Ve a *Indicadores* > Sección *"Scripts solo por invitación"* (Invite-Only).
3. Haz clic en *"Valyrian Master SMC [v7.0]"* para agregarlo.
4. Abre los *Ajustes* del indicador (icono de tuerca) y en el grupo "0) CONTROL DE ACCESO":
   - Pega tu Clave de Licencia: \`${licenseKey}\`
   - Configura la Fecha de Expiración (${expYear} / ${expMonth} / ${expDay}).
5. ¡Listo! El indicador desbloqueará el panel institucional con confluencias, zonas OTE, FVG 50% CE y simulación Asia-Londres.

⚠️ *Soporte y Renovaciones:* Contacta directamente a soporte antes del ${expDateStr} para mantener tu acceso activo sin interrupciones.`;
}

