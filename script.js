// script.js - product data + UI + simple voice assistant (English + Gujarati)

// ---------- Product data ----------
const products = {
  "washing-machine-001": {
    id: "washing-machine-001",
    title: "SuperClean 7kg Front Load Washing Machine",
    title_gu: "સુપરસ્ઈન 7 કિગ્રા ફ્રન્ટ લોડ વોશિંગ મશીન",
    sku: "WM-SC-7000",
    price: 21990,
    images: [
      "https://placehold.co/800x600?text=Washing+Machine+1",
      "https://placehold.co/800x600?text=Front+view",
      "https://placehold.co/800x600?text=Control+panel"
    ],
    specs: {
      "Capacity": "7 kg",
      "Type": "Front Load",
      "Energy Rating": "5 Star",
      "Warranty": "2 years (product) + 5 years (motor)",
      "Delivery": "4-7 business days"
    },
    specs_gu: {
      "Capacity": "7 કિગ્રા",
      "Type": "ફ્રન્ટ લોડ",
      "Energy Rating": "5 સ્ટાર",
      "Warranty": "2 વર્ષ (પ્રોડક્ટ) + 5 વર્ષ (મોટર)",
      "Delivery": "4-7 બિઝનેસ દિવસ"
    },
    colors: ["White", "Silver", "Grey"],
    colors_gu: ["સફેદ", "સિલ્વર", "ગ્રે"],
    advantages: [
      "Low energy consumption",
      "Quick wash in 30 minutes",
      "Gentle on fabrics",
      "In-built heater for tough stains"
    ],
    advantages_gu: [
      "ઓછી ઊર્જા ક્ષેપણ",
      "30 મિનિટમાં ક્વિક વૉશ",
      "કપડાંઓ ઉપર નરમ",
      "કઠિન દાગ માટે બિલ્ટ-ઇન હીટર"
    ],
    description: "A reliable 7kg front load washing machine with modern features, quick cycles, and low power usage. Ideal for small to medium families.",
    description_gu: "આ આધુનિક અને વિશ્વસનીય 7 કિગ્રા ફ્રન્ટ લોડ વોશિંગ મશીન છે. નાનું/મધ્યમ પરિવાર માટે યોગ્ય — ઝડપી સાયકલ અને ઓછા વીજ ઉપભોગ સાથે."
  }
};

// ---------- helpers ----------
function getQueryParam(name) {
  return new URL(location.href).searchParams.get(name);
}

// product id & language
const id = getQueryParam('id') || 'washing-machine-001';
const product = products[id] || products['washing-machine-001'];
let LANG = getQueryParam('lang') || 'en'; // 'en' or 'gu'

// DOM refs (script is loaded at end of body so elements exist)
const titleEl = document.getElementById('title');
const skuEl = document.getElementById('sku');
const priceEl = document.getElementById('price');
const descEl = document.getElementById('description');
const pageUrlEl = document.getElementById('pageUrl');
const mainImg = document.getElementById('mainImg');
const thumbs = document.getElementById('thumbs');
const qrImg = document.getElementById('qrImg');
const langSelect = document.getElementById('langSelect');

// populate base fields that don't need localization yet
skuEl.textContent = 'SKU: ' + (product.sku || '-');
priceEl.textContent = '₹' + (product.price ? product.price.toLocaleString('en-IN') : '0');
pageUrlEl.textContent = location.origin + location.pathname + '?id=' + encodeURIComponent(product.id);

// gallery thumbnails (safe even if images fail to load)
mainImg.src = product.images && product.images[0] ? product.images[0] : '';
thumbs.innerHTML = '';
if (product.images && product.images.length) {
  product.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'thumb';
    if (i === 0) img.classList.add('active');
    img.onclick = () => {
      mainImg.src = src;
      document.querySelectorAll('.thumbs img').forEach(t => t.classList.remove('active'));
      img.classList.add('active');
    };
    thumbs.appendChild(img);
  });
}

// QR image (Google Chart API)
const targetUrlForQr = encodeURIComponent(location.origin + location.pathname + '?id=' + product.id + '&lang=' + LANG);
qrImg.src = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${targetUrlForQr}`;

// ---------- language UI ----------

if (langSelect) {
  langSelect.value = LANG;
  langSelect.addEventListener('change', (e) => {
    LANG = e.target.value;
    applyLanguageToUI();
    // update displayed QR and pageUrl
    pageUrlEl.textContent = location.origin + location.pathname + '?id=' + encodeURIComponent(product.id) + '&lang=' + LANG;
    qrImg.src = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(location.origin + location.pathname + '?id=' + product.id + '&lang=' + LANG)}`;
    initRecognition(); // reinit ASR with correct language
  });
}

function applyLanguageToUI() {
  if (LANG === 'gu') {
    titleEl.textContent = product.title_gu || product.title;
    descEl.textContent = product.description_gu || product.description;
    document.getElementById('askBtn').textContent = 'આ ઉત્પાદન વિશે પૂછો';
    document.getElementById('buyBtn').textContent = 'ખરીદ / પૂછપરછ';
    // specs
    const specsWrap = document.getElementById('specs'); specsWrap.innerHTML = '';
    const srcSpecs = product.specs_gu || product.specs;
    for (const k in srcSpecs) {
      const div = document.createElement('div'); div.className = 'spec';
      div.innerHTML = `<strong>${k}</strong><div style="color:var(--muted);margin-top:6px">${srcSpecs[k]}</div>`;
      specsWrap.appendChild(div);
    }
  } else {
    titleEl.textContent = product.title;
    descEl.textContent = product.description;
    document.getElementById('askBtn').textContent = 'Ask about this product';
    document.getElementById('buyBtn').textContent = 'Buy / Enquire';
    const specsWrap = document.getElementById('specs'); specsWrap.innerHTML = '';
    const srcSpecs = product.specs;
    for (const k in srcSpecs) {
      const div = document.createElement('div'); div.className = 'spec';
      div.innerHTML = `<strong>${k}</strong><div style="color:var(--muted);margin-top:6px">${srcSpecs[k]}</div>`;
      specsWrap.appendChild(div);
    }
  }
}
applyLanguageToUI();

// ---------- chat/voice assistant (simple) ----------
const modal = document.getElementById('modalBackdrop');
const askBtn = document.getElementById('askBtn');
const closeModal = document.getElementById('closeModal');
const chatArea = document.getElementById('chatArea');
const micBtn = document.getElementById('micBtn');
const recStatus = document.getElementById('recStatus');
const sendBtn = document.getElementById('sendBtn');
const manualInput = document.getElementById('manualInput');

askBtn.onclick = () => {
  openModal();
  const welcome = (LANG === 'gu') ? "મારા ઇલેક્ટ્રોનિક્સ દુકાનમાં આપનું સ્વાગત છે. હું આ પ્રોડક્ટ વિશે કેવી રીતે મદદ કરી શકું?" : "Welcome to my electronics shop. How can I help you about this product?";
  addBotMsg((LANG === 'gu') ? "સ્વાગત છે! આ પ્રોડક્ટ વિશે તમે શું જાણવા માંગો છો? (કિંમત, રંગ, ડિલિવરી, લાભો)" : "Welcome! How can I help you about this product? (Try: price, color, delivery, advantages)");
  speakText(welcome);
};
closeModal.onclick = () => closeModalFunc();

function openModal() { modal.style.display = 'flex'; chatArea.innerHTML = ''; recStatus.textContent = 'Idle'; }
function closeModalFunc() { modal.style.display = 'none'; stopRecognition(); }

function addUserMsg(text) {
  const d = document.createElement('div'); d.className = 'msg me';
  d.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
  chatArea.appendChild(d); chatArea.scrollTop = chatArea.scrollHeight;
}
function addBotMsg(text) {
  const d = document.createElement('div'); d.className = 'msg';
  d.innerHTML = `<div class="bubble bot">${escapeHtml(text)}</div>`;
  chatArea.appendChild(d); chatArea.scrollTop = chatArea.scrollHeight;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]);
}

function speakText(txt) {
  if (!('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = (LANG === 'gu') ? 'gu-IN' : 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) { console.warn(e); }
}

function answerQuestion(q) {
  const text = q.toLowerCase();
  if (LANG === 'gu') {
    if (/કિંમત|price|cost/.test(text)) return `આ મોડેલ (${product.title_gu||product.title}) ની કિંમત ₹${product.price.toLocaleString('en-IN')} છે.`;
    if (/રંગ|color|colour/.test(text)) return `આ મોડેલ ઉપલબ્ધ છે: ${(product.colors_gu||product.colors).join(', ')}.`;
    if (/ડિલિવરી|deliver|delivery|કેટલો સમય/.test(text)) return `અંદાજિત વિતરણ સમય: ${(product.specs_gu && product.specs_gu["Delivery"]) || product.specs["Delivery"] || 'સ્ટોર સાથે સંપર્ક કરો.'}`;
    if (/લાભ|advantage|benefit|feature/.test(text)) return `મુખ્ય લાભ: ${(product.advantages_gu||product.advantages).join('; ')}.`;
    if (/capacity|કિગ્રા/.test(text)) return `કેપેસિટી: ${(product.specs_gu && product.specs_gu["Capacity"]) || product.specs["Capacity"] || 'Not listed.'}`;
    if (/વોરંટી|warranty|guarantee/.test(text)) return `વોરંટી: ${(product.specs_gu && product.specs_gu["Warranty"]) || product.specs["Warranty"] || 'Not listed.'}`;
    return `માફ કરશો, મને સరిగમ સમજાયું નહીં. તમે કિંમત, રંગ, ડિલિવરી, લાભો, કેપેસિટી અથવા વોરંટી વિશે પુછો શકો છો.`;
  } else {
    if (/price|cost|how much/.test(text)) return `The price of this model (${product.title}) is ₹${product.price.toLocaleString('en-IN')}.`;
    if (/color|colour|available (in )?colors|which colors/.test(text)) return `This model is available in: ${product.colors.join(', ')}.`;
    if (/deliver|delivery|how long|time.*deliver|when.*deliver/.test(text)) return `Estimated delivery time: ${product.specs["Delivery"] || 'Contact store for exact timelines.'}`;
    if (/advantag|benefit|why should i buy|features|feature/.test(text)) return `Key advantages: ${product.advantages.join('; ')}.`;
    if (/capacity|kg|litre/.test(text)) return `Capacity: ${product.specs["Capacity"] || 'Not listed.'}`;
    if (/warranty|guarantee/.test(text)) return `Warranty: ${product.specs["Warranty"] || 'Warranty info not listed.'}`;
    return `Sorry, I didn't understand exactly. You can ask about price, colors, delivery time, advantages, capacity, or warranty.`;
  }
}

sendBtn.onclick = () => {
  const t = (manualInput.value || '').trim();
  if (!t) return;
  addUserMsg(t); manualInput.value = '';
  const ans = answerQuestion(t);
  addBotMsg(ans);
  speakText(ans);
};

// ---------- SpeechRecognition ----------
let recognition = null, listening = false;
function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micBtn.disabled = true;
    recStatus.textContent = 'Speech recognition not supported';
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = (LANG === 'gu') ? 'gu-IN' : 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => { listening = true; recStatus.textContent = 'Listening...'; micBtn.textContent = '🔴 Listening (click to stop)'; };
  recognition.onend = () => { listening = false; recStatus.textContent = 'Idle'; micBtn.textContent = '🎤 Start Listening'; };
  recognition.onerror = (ev) => { console.error(ev); recStatus.textContent = 'Error: ' + (ev.error || ev.message); };
  recognition.onresult = (ev) => {
    const transcript = ev.results[0][0].transcript;
    addUserMsg(transcript);
    const ans = answerQuestion(transcript);
    addBotMsg(ans);
    speakText(ans);
  };
}

function startRecognition() { if (!recognition) initRecognition(); try { recognition.start(); } catch (e) { console.warn(e); } }
function stopRecognition() { try { if (recognition) recognition.stop(); } catch (e) {} }

micBtn.onclick = () => {
  if (!recognition) initRecognition();
  if (!recognition) return;
  if (!listening) startRecognition(); else stopRecognition();
};

initRecognition();

// accessibility: close modal on backdrop click
document.getElementById('modalBackdrop').addEventListener('click', (ev) => {
  if (ev.target === document.getElementById('modalBackdrop')) closeModalFunc();
});
