// ============================================================
// Ayoub Playground — Cloudflare Worker
// ============================================================
// Environment Variables:
//   OPENROUTER_API_KEY  - for AI chat (/api/chat)
//   TELEGRAM_BOT_TOKEN  - (optional) visitor notifications
//   TELEGRAM_CHAT_ID    - (optional)
//   VISITORS            - KV namespace (optional) visitor storage
// ============================================================

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Ayoub Playground</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="icon" href="https://ik.imagekit.io/imgayoub/LOGO/ayoub.pw%20logo%20many%20size/no%20background/favicon.ico?updatedAt=1778461921859">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0a;--accent:#d4a373;--accent2:#bc8f5a;--glass:rgba(18,13,10,.82);--grad:linear-gradient(135deg,#0a0a0a,#130f0a);--brd:rgba(212,163,115,.14);--brdh:rgba(212,163,115,.5);--txt:#f0ece4;--txt2:#b8a99a;--cbg:#0c0a07;--cc:#c8a97a;--panel:rgba(14,11,8,.92);--panel2:rgba(16,12,9,.95);--line:rgba(255,255,255,.06);--shadow:0 24px 60px rgba(0,0,0,.55);--err:#e63946;--ok:#39d98a;--ai:rgba(90,180,130,.12);--ai-brd:rgba(90,180,130,.28);--H:56px}
html,body{height:100%;overflow:hidden}
body{font-family:'Cairo',sans-serif;background:var(--bg);color:var(--txt);display:flex;flex-direction:column}
body::before{content:'';position:fixed;inset:0;background:var(--grad);z-index:-2}
.bg-grid{position:fixed;inset:0;pointer-events:none;z-index:-1;background-image:linear-gradient(rgba(212,163,115,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(212,163,115,.025) 1px,transparent 1px);background-size:38px 38px}
.h{height:var(--H);flex-shrink:0;padding:0 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;backdrop-filter:blur(20px);background:var(--glass);border-bottom:1px solid var(--brd);z-index:100}
.h-l{display:flex;align-items:center;gap:10px;text-decoration:none}
.logo-wrap{position:relative;width:34px;height:34px;flex-shrink:0}
.logo-ring{position:absolute;inset:-5px;border-radius:50%;border:1.5px solid rgba(212,163,115,.5);animation:spin 12s linear infinite}
.logo-ring::before{content:'';position:absolute;top:-2px;left:50%;transform:translateX(-50%);width:5px;height:5px;background:var(--accent);border-radius:50%;box-shadow:0 0 8px var(--accent)}
@keyframes spin{to{transform:rotate(360deg)}}
.logo-img{width:34px;height:34px;border-radius:50%;object-fit:contain;display:block;filter:drop-shadow(0 0 10px rgba(212,163,115,.5))}
.brand{font-family:'Bebas Neue',sans-serif;font-size:1.25rem;letter-spacing:3px;color:var(--accent)}
.ctl{display:flex;gap:6px;align-items:center}
.btn{background:transparent;border:1px solid var(--brd);color:var(--accent);padding:6px 13px;border-radius:8px;cursor:pointer;font-family:'Cairo',sans-serif;font-size:.78rem;font-weight:700;transition:all .22s;white-space:nowrap;display:inline-flex;align-items:center;gap:5px}
.btn:hover{border-color:var(--brdh);background:rgba(212,163,115,.08)}
.btn.ai-btn{border-color:var(--ai-brd);color:#6ecf9a;background:var(--ai)}
.btn.ai-btn:hover{background:rgba(90,180,130,.2)}
.shell{flex:1;display:grid;grid-template-columns:1fr 1fr 320px;grid-template-rows:1fr;gap:10px;padding:10px;overflow:hidden;min-height:0}
.shell.ai-off{grid-template-columns:1fr 1fr 0}.shell.ai-off .ai-panel{display:none}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:16px;display:flex;flex-direction:column;box-shadow:var(--shadow);min-height:0;min-width:0}
.ph{display:flex;align-items:center;gap:8px;padding:9px 14px;background:rgba(255,255,255,.024);border-bottom:1px solid var(--line);flex-shrink:0;flex-wrap:wrap}
.dots span{width:10px;height:10px;border-radius:50%;display:inline-block;background:#ff5f57;box-shadow:16px 0 0 #febc2e,32px 0 0 #28c840;margin-right:40px}
.tabs{display:flex;gap:3px}
.tab{padding:5px 11px;border-radius:7px;font-size:.77rem;font-family:'Cairo',sans-serif;font-weight:700;color:var(--txt2);background:transparent;border:1px solid transparent;cursor:pointer;transition:all .18s}
.tab:hover{color:var(--txt);background:rgba(212,163,115,.06)}
.tab.active{color:var(--txt);background:rgba(212,163,115,.13);border-color:rgba(212,163,115,.3)}
.live-dot{margin-left:auto;display:inline-flex;align-items:center;gap:5px;font-size:.72rem;color:var(--ok);background:rgba(57,217,138,.07);border:1px solid rgba(57,217,138,.18);padding:3px 9px;border-radius:99px}
.live-dot::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 3px rgba(57,217,138,.18);animation:pulse 1.8s infinite}
@keyframes pulse{0%,100%{transform:scale(.85);opacity:.7}50%{transform:scale(1.2);opacity:1}}
.eb{flex:1;overflow:hidden;position:relative;min-height:0;min-width:0}
.cp{display:none;width:100%;height:100%;flex-direction:column}.cp.active{display:flex}
textarea{flex:1;width:100%;border:none;outline:none;resize:none;padding:14px 16px;background:var(--cbg);color:var(--cc);font:13px/1.7 'JetBrains Mono',monospace;direction:ltr;tab-size:2;caret-color:var(--accent)}
textarea::selection{background:rgba(212,163,115,.22)}
.pw-panel{background:var(--panel2)}
.iframe-wrap{flex:1;position:relative;overflow:hidden;min-height:0;min-width:0}
iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
.err-box{display:none;flex-shrink:0;padding:10px 14px;background:rgba(230,57,70,.07);border-top:1px solid rgba(230,57,70,.18);font-size:.8rem;max-height:140px;overflow-y:auto}
.err-box.show{display:block}
.err-t{color:#ff6b6b;font-weight:700;margin-bottom:5px}
.ai-side{background:var(--panel);border:1px solid var(--ai-brd);box-shadow:0 0 40px rgba(90,180,130,.06)}
.ai-side .ph{background:rgba(57,217,138,.04);border-bottom:1px solid var(--ai-brd)}
.ai-hdr{display:flex;align-items:center;gap:7px;font-weight:700;font-size:.9rem;color:#6ecf9a}
.ai-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;min-height:0}
.ai-msgs::-webkit-scrollbar{width:4px}
.ai-msgs::-webkit-scrollbar-track{background:transparent}
.ai-msgs::-webkit-scrollbar-thumb{background:var(--brd);border-radius:4px}
.ai-msg{max-width:90%;padding:9px 12px;border-radius:12px;font-size:.82rem;line-height:1.6;animation:in .22s ease}
@keyframes in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.ai-msg.bot{background:rgba(90,180,130,.1);border:1px solid var(--ai-brd);color:#c8f0d8;align-self:flex-start;border-bottom-left-radius:4px}
.ai-msg.user{background:rgba(212,163,115,.1);border:1px solid var(--brd);color:var(--txt);align-self:flex-end;border-bottom-right-radius:4px;text-align:right}
.ai-msg .lbl{font-size:.65rem;font-weight:700;opacity:.6;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px}
.ai-msg.typing .dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:#6ecf9a;margin:0 2px;animation:bo 1s infinite}
.ai-msg.typing .dots span:nth-child(2){animation-delay:.15s}
.ai-msg.typing .dots span:nth-child(3){animation-delay:.3s}
@keyframes bo{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
.ai-quick{flex-shrink:0;padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid var(--line)}
.ai-quick button{background:rgba(212,163,115,.07);border:1px solid var(--brd);color:var(--txt2);padding:4px 9px;border-radius:99px;font-size:.72rem;font-family:'Cairo',sans-serif;font-weight:600;cursor:pointer;transition:all .18s;white-space:nowrap}
.ai-quick button:hover{border-color:var(--brdh);color:var(--txt);background:rgba(212,163,115,.12)}
.ai-inp{flex-shrink:0;padding:10px 12px;border-top:1px solid var(--ai-brd);display:flex;gap:8px;align-items:flex-end}
.ai-inp textarea{flex:1;border:1px solid var(--brd);border-radius:10px;padding:8px 11px;background:rgba(255,255,255,.04);color:var(--txt);font:13px/1.5 'Cairo',sans-serif;resize:none;min-height:36px;max-height:100px;direction:ltr}
.ai-inp textarea:focus{outline:none;border-color:var(--ai-brd)}
.ai-send{padding:8px 14px;border-radius:10px;cursor:pointer;font-size:1rem;transition:all .18s;border:1px solid var(--ai-brd);color:#6ecf9a;background:rgba(90,180,130,.15);flex-shrink:0}
.ai-send:hover{background:rgba(90,180,130,.28)}
.ai-send:disabled{opacity:.4;cursor:default}
.ai-msg pre{background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.07);border-radius:6px;padding:8px 10px;margin-top:6px;overflow-x:auto;font-size:.75rem;line-height:1.5;font-family:'JetBrains Mono',monospace;color:#a8d8b0}
footer{flex-shrink:0;text-align:center;padding:6px;color:var(--txt2);font-size:.75rem}
footer span{display:inline-block;background:rgba(212,163,115,.06);border:1px solid rgba(212,163,115,.14);padding:3px 14px;border-radius:99px;color:var(--txt)}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(212,163,115,.2);border-radius:4px}
@media(max-width:1100px){html,body{height:auto;overflow:auto}.shell{grid-template-columns:1fr 1fr !important;grid-template-rows:500px 440px auto;overflow:visible;height:auto}.ai-side{grid-column:1/-1;height:420px}.shell.ai-off .ai-panel{display:none}}
@media(max-width:700px){html,body{overflow:auto;height:auto}.shell{grid-template-columns:1fr !important;grid-template-rows:auto;height:auto;overflow:visible}.panel{height:360px}.ai-side{height:400px}.brand{font-size:1rem}.btn{padding:5px 8px;font-size:.72rem}}
</style>
</head>
<body>
<div class="bg-grid"></div>

<header class="h">
  <a class="h-l" href="#">
    <div class="logo-wrap">
      <div class="logo-ring"></div>
      <img class="logo-img" src="https://ik.imagekit.io/imgayoub/LOGO/ayoub.pw%20logo%20many%20size/no%20background/android-chrome-192x192.png?updatedAt=1778461922147" alt="Ayoub">
    </div>
    <span class="brand">PLAYGROUND</span>
  </a>
  <div class="ctl">
    <button class="btn" id="dlBtn">&#x2B07; Download</button>
    <button class="btn ai-btn" id="aiToggle">&#x1F916; AI</button>
    <button class="btn" id="themeBtn">&#x2600;&#xFE0F;</button>
  </div>
</header>

<main class="shell" id="shell">

  <section class="panel">
    <div class="ph">
      <div class="dots"><span></span></div>
      <div class="tabs">
        <button class="tab active" data-tab="html">HTML</button>
        <button class="tab" data-tab="css">CSS</button>
        <button class="tab" data-tab="js">JS</button>
      </div>
      <span class="live-dot">Live</span>
    </div>
    <div class="eb">
      <div class="cp active" data-pane="html">
        <textarea id="htmlCode" spellcheck="false"><section class="hero">
  <h1>Build something beautiful.</h1>
  <p>Edit the code and see the result instantly.</p>
  <button class="btn" onclick="sayHello()">Click Me</button>
</section></textarea>
      </div>
      <div class="cp" data-pane="css">
        <textarea id="cssCode" spellcheck="false">body {
  margin: 0; min-height: 100vh;
  display: grid; place-items: center;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #f5f0eb, #e8ddd0);
}
.hero { text-align: center; padding: 40px; }
h1 { font-size: 2.5rem; color: #1a1612; }
.btn {
  padding: 12px 24px; border: none;
  background: #d4a373; color: #fff;
  border-radius: 10px; cursor: pointer;
}</textarea>
      </div>
      <div class="cp" data-pane="js">
        <textarea id="jsCode" spellcheck="false">function sayHello() {
  alert('Welcome to Ayoub Playground!');
}</textarea>
      </div>
    </div>
    <div class="err-box" id="errBox">
      <div class="err-t" id="errMsg"></div>
    </div>
  </section>

  <section class="panel pw-panel">
    <div class="ph">
      <div><strong>Preview</strong><div style="color:var(--txt2);font-size:.75rem">Live preview</div></div>
      <button class="btn" id="refBtn">&#x1F504; Refresh</button>
    </div>
    <div class="iframe-wrap">
      <iframe id="pf" sandbox="allow-scripts allow-forms allow-modals" allow="clipboard-write"></iframe>
    </div>
  </section>

  <section class="panel ai-side" id="aiPanel">
    <div class="ph">
      <div class="ai-hdr">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
        </svg>
        AI Assistant
      </div>
      <button class="btn" id="clearChat" style="font-size:.65rem;padding:2px 8px;margin-left:auto">Clear</button>
    </div>
    <div class="ai-msgs" id="aiMsgs">
      <div class="ai-msg bot">
        <div class="lbl">AI</div>
        Hey! I can help with HTML, CSS, or JS. Ask me anything.
      </div>
    </div>
    <div class="ai-quick">
      <button class="qck" data-q="Review my code and suggest improvements">Review code</button>
      <button class="qck" data-q="Add a CSS animation to my page">Animation</button>
      <button class="qck" data-q="Fix any errors in my JavaScript">Fix errors</button>
    </div>
    <div class="ai-inp">
      <textarea id="aiInput" placeholder="Ask about your code..." rows="1"></textarea>
      <button class="ai-send" id="aiSend">&#x27A4;</button>
    </div>
  </section>

</main>

<footer>
  <span>Made with &hearts; from Vienna &#x1F1E6;&#x1F1F9;</span>
</footer>

<script>
(function () {
'use strict';

var hc = document.getElementById('htmlCode'),
    cc = document.getElementById('cssCode'),
    jc = document.getElementById('jsCode'),
    pf = document.getElementById('pf'),
    rb = document.getElementById('refBtn'),
    eb = document.getElementById('errBox'),
    em = document.getElementById('errMsg'),
    tb = document.getElementById('themeBtn'),
    db = document.getElementById('dlBtn'),
    aiTog = document.getElementById('aiToggle'),
    sh = document.getElementById('shell'),
    aiM = document.getElementById('aiMsgs'),
    aiIn = document.getElementById('aiInput'),
    aiSnd = document.getElementById('aiSend'),
    clr = document.getElementById('clearChat');

function rp() {
  eb.classList.remove('show');
  var es = '<sc' + 'ript>window.onerror=function(m,s,l,c,e){parent.postMessage({type:"error",msg:(m||"")+" (line "+l+")"},"*");return true};<' + '/sc' + 'ript>';
  pf.srcdoc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet"><style>' + cc.value + '</style>' + es + '</head><body>' + hc.value + '<sc' + 'ript>' + jc.value + '<' + '/sc' + 'ript></body></html>';
}
rb.addEventListener('click', rp);

window.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'error') {
    em.textContent = e.data.msg;
    eb.classList.add('show');
  }
});

var _rt;
[hc, cc, jc].forEach(function (el) {
  el.addEventListener('input', function () {
    clearTimeout(_rt);
    _rt = setTimeout(rp, 380);
  });
});

var tabs = document.querySelectorAll('.tab'),
    panes = document.querySelectorAll('.cp');
tabs.forEach(function (t) {
  t.addEventListener('click', function () {
    tabs.forEach(function (x) { x.classList.remove('active'); });
    t.classList.add('active');
    panes.forEach(function (p) {
      p.classList.remove('active');
      if (p.dataset.pane === t.dataset.tab) p.classList.add('active');
    });
  });
});

var dark = true;
tb.addEventListener('click', function () {
  dark = !dark;
  document.body.classList.toggle('lt', !dark);
  tb.innerHTML = dark ? '&#x2600;&#xFE0F;' : '&#x1F319;';
});

var lt = document.createElement('style');
lt.textContent = '.lt{--bg:#f5f0eb;--glass:rgba(245,240,235,.82);--grad:linear-gradient(135deg,#f5f0eb,#e8ddd0);--brd:rgba(180,140,100,.22);--brdh:rgba(180,140,100,.55);--txt:#1a1612;--txt2:#6a6055;--cbg:#ebe3d9;--cc:#5a3e28;--panel:rgba(245,240,235,.94);--panel2:rgba(240,233,225,.97);--line:rgba(0,0,0,.08);--shadow:0 20px 60px rgba(0,0,0,.14)}';
document.head.appendChild(lt);

var aiOn = true;
aiTog.addEventListener('click', function () {
  aiOn = !aiOn;
  sh.classList.toggle('ai-off', !aiOn);
  aiTog.innerHTML = aiOn ? '&#x1F916; AI' : '&#x1F916; Show AI';
});

db.addEventListener('click', function () {
  var f = '<!DOCTYPE html>\\n<html lang="en">\\n<head>\\n<meta charset="UTF-8">\\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\\n<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">\\n<style>\\n' + cc.value + '\\n</style>\\n</head>\\n<body>\\n' + hc.value + '\\n<sc' + 'ript>\\n' + jc.value + '\\n<' + '/sc' + 'ript>\\n</body>\\n</html>';
  var b = new Blob([f], { type: 'text/html;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'project.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
});

/* ===== AI Assistant ===== */

function aiChat(msgs, done) {
  aiSnd.disabled = true;
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: msgs })
  })
  .then(function (r) { return r.json(); })
  .then(function (d) { aiSnd.disabled = false; done(d.content || d.error || 'No response'); })
  .catch(function (e) { aiSnd.disabled = false; done('Error: ' + e.message); });
}

function addMsg(role, text) {
  var d = document.createElement('div');
  d.className = 'ai-msg ' + role;
  var l = document.createElement('div');
  l.className = 'lbl';
  l.textContent = role === 'bot' ? 'AI' : 'You';
  d.appendChild(l);
  var b = document.createElement('div');
  b.innerHTML = text.replace(/\`\`\`(\\w*)\\n?([\\s\\S]*?)\`\`\`/g, function (_, lang, code) {
    return '<pre>' + code.trim().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>';
  }).replace(/\`([^\`]+)\`/g, '<code style="background:rgba(0,0,0,.3);padding:2px 6px;border-radius:4px">$1</code>');
  d.appendChild(b);
  aiM.appendChild(d);
  aiM.scrollTop = aiM.scrollHeight;
  return d;
}

function addTyping() {
  var d = document.createElement('div');
  d.className = 'ai-msg bot typing';
  d.innerHTML = '<div class="lbl">AI</div><div class="dots"><span></span><span></span><span></span></div>';
  aiM.appendChild(d);
  aiM.scrollTop = aiM.scrollHeight;
  return d;
}

var history = [];

function sendMsg(userMsg) {
  if (!userMsg.trim()) return;
  addMsg('user', userMsg);
  aiIn.value = '';
  aiIn.style.height = '';
  var ctx = '\\n\\n[Current code]\\nHTML:\\n\`\`\`html\\n' + hc.value + '\\n\`\`\`\\nCSS:\\n\`\`\`css\\n' + cc.value + '\\n\`\`\`\\nJS:\\n\`\`\`js\\n' + jc.value + '\\n\`\`\`';
  history.push({ role: 'user', content: userMsg + ctx });
  var msgs = [{ role: 'system', content: 'You are a coding assistant in Ayoub Playground. Help with HTML, CSS, JS. Give code in markdown blocks. Be concise.' }].concat(history);
  var tp = addTyping();
  aiChat(msgs, function (text) {
    tp.remove();
    history.push({ role: 'assistant', content: text });
    var el = addMsg('bot', text);
    var m = text.match(/\`\`\`(html|css|js|javascript)\\n?([\\s\\S]*?)\`\`\`/);
    if (m) {
      var lang = (text.match(/\`\`\`(html|css|js|javascript)/) || [])[1] || '';
      var code = m[2].trim();
      if (lang) {
        var btn = document.createElement('button');
        btn.style.cssText = 'display:inline-block;margin-top:6px;background:rgba(212,163,115,.1);border:1px solid var(--brd);color:var(--accent);padding:3px 9px;border-radius:6px;font-size:.72rem;font-family:Cairo,sans-serif;font-weight:700;cursor:pointer';
        btn.textContent = 'Apply to ' + (lang === 'css' ? 'CSS' : lang === 'html' ? 'HTML' : 'JS');
        btn.addEventListener('click', function () {
          if (lang === 'css') cc.value = code;
          else if (lang === 'html') hc.value = code;
          else jc.value = code;
          rp();
          btn.textContent = 'Applied!';
          btn.style.color = '#39d98a';
        });
        el.appendChild(btn);
      }
    }
  });
}

aiSnd.addEventListener('click', function () { sendMsg(aiIn.value); });
aiIn.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(aiIn.value); }
});
aiIn.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});

document.querySelectorAll('.qck').forEach(function (b) {
  b.addEventListener('click', function () { aiIn.value = b.dataset.q; sendMsg(aiIn.value); });
});

clr.addEventListener('click', function () {
  history = [];
  aiM.innerHTML = '<div class="ai-msg bot"><div class="lbl">AI</div>Chat cleared! Ask me anything.</div>';
});

rp();
})();
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cf = request.cf || {};

    const v = {
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      ua: request.headers.get('User-Agent') || 'unknown',
      country: cf.country || 'unknown',
      city: cf.city || 'unknown',
      region: cf.region || 'unknown',
      tz: cf.timezone || 'unknown',
      isp: cf.asOrganization || 'unknown',
      asn: String(cf.asn || 'unknown'),
      ts: new Date().toISOString()
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const msgs = body.messages || [];
        const key = env.OPENROUTER_API_KEY;
        if (!key) {
          return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY not set in environment variables.' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }
        const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'HTTP-Referer': url.origin, 'X-Title': 'Ayoub Playground' },
          body: JSON.stringify({ model: 'openrouter/auto', messages: msgs, max_tokens: 1024, temperature: 0.5 })
        });
        if (!r.ok) {
          const t = await r.text();
          return new Response(JSON.stringify({ error: 'OpenRouter ' + r.status + ': ' + t }), { status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }
        const d = await r.json();
        const c = d.choices && d.choices[0] ? d.choices[0].message.content : 'No response';
        return new Response(JSON.stringify({ content: c }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
    }

    if (url.pathname === '/visits' && request.method === 'GET' && env.VISITORS) {
      try {
        const list = await env.VISITORS.list({ prefix: 'visit:', limit: 100 });
        const visits = [];
        for (const key of list.keys) {
          const raw = await env.VISITORS.get(key.name);
          if (raw) visits.push(JSON.parse(raw));
        }
        return new Response(JSON.stringify(visits, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
      } catch (e) {
        return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      tg(v, env).catch(function(){});
    }
    if (env.VISITORS) {
      kv(v, env).catch(function(){});
    }

    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};

async function tg(d, env) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const msg = ['\u{1F3AE} *Ayoub Playground*', '\u{1F310} IP: `' + d.ip + '`', '\u{1F3F3} Country: ' + d.country, '\u{1F3D9} City: ' + d.city, '\u{1F550} ' + d.ts].join('\n');
  await fetch('https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' })
  });
}

async function kv(d, env) {
  if (!env.VISITORS) return;
  const sip = (d.ip || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = 'visit:' + d.ts.slice(0, 10) + ':' + d.ts.slice(11, 19).replace(/:/g, '-') + ':' + sip;
  await env.VISITORS.put(key, JSON.stringify(d), { expirationTtl: 2592000 });
}
