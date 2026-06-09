let currentStep = 0;

/* ---- Navigation ---- */
function goStep(n){
  document.getElementById('screen'+currentStep).classList.remove('visible');
  document.getElementById('tab'+currentStep).classList.remove('active');
  currentStep = n;
  document.getElementById('screen'+n).classList.add('visible');
  document.getElementById('tab'+n).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Step 1: market fit, rendered from COUNTRIES in data.js ---- */
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}

function renderCountries(){
  var grid = document.getElementById('countryGrid');
  grid.innerHTML = COUNTRIES.map(function(c){
    var label = (c.approx ? '~' : '') + c.pct + '%';
    return '<div class="country-chip" data-pct="'+c.pct+'" role="button" tabindex="0" aria-pressed="false">'
      + '<i class="ti ti-map-pin" aria-hidden="true"></i>'
      + escapeHtml(c.name)
      + '<span class="pct">'+label+'</span></div>';
  }).join('');

  grid.querySelectorAll('.country-chip').forEach(function(chip){
    function toggle(){
      var on = chip.classList.toggle('selected');
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      updateScore();
    }
    chip.addEventListener('click', toggle);
    chip.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
    });
  });
}

function selectedCountryNames(){
  return Array.prototype.map.call(
    document.querySelectorAll('.country-chip.selected'),
    function(c){ return c.textContent.replace(/~?\d+%$/, '').trim(); }
  );
}

function updateScore(){
  var chips = document.querySelectorAll('.country-chip.selected');
  if(chips.length === 0){ document.getElementById('scorePanel').style.display = 'none'; return; }
  var sum = 0;
  chips.forEach(function(c){ sum += parseInt(c.dataset.pct, 10); });
  var avg = Math.round(sum / chips.length);
  document.getElementById('scorePanel').style.display = 'block';
  document.getElementById('scoreLabel').textContent = avg + '% avg penetration';
  document.getElementById('scoreFill').style.width = avg + '%';
  var color = avg >= 60 ? '#1D9E75' : avg >= 30 ? '#BA7517' : '#D85A30';
  document.getElementById('scoreFill').style.background = color;
  var vb = document.getElementById('verdictBox');
  if(avg >= 60){
    vb.innerHTML = '<div class="verdict verdict-go"><div class="verdict-title"><i class="ti ti-circle-check" aria-hidden="true"></i> Strong market fit</div><div class="verdict-body">Viber has dominant market share in your target countries. Your customers are almost certainly there. This is a high-conviction channel to launch.</div></div>';
  } else if(avg >= 25){
    vb.innerHTML = '<div class="verdict verdict-maybe"><div class="verdict-title"><i class="ti ti-alert-circle" aria-hidden="true"></i> Moderate fit — launch with SMS fallback</div><div class="verdict-body">Viber has meaningful reach but not dominance. Build in an SMS fallback so messages still land when Viber is not installed. Test with a pilot segment first.</div></div>';
  } else {
    vb.innerHTML = '<div class="verdict verdict-no"><div class="verdict-title"><i class="ti ti-x" aria-hidden="true"></i> Low fit for this channel</div><div class="verdict-body">Viber penetration is low in your markets. Consider WhatsApp or RCS as alternatives. Viber could still work for a niche segment — worth a small pilot.</div></div>';
  }
}

/* ---- Step 2: use case ---- */
function selectUC(n){
  for(var i = 0; i < 4; i++){
    var card = document.getElementById('uc'+i);
    card.style.borderColor = 'var(--color-border-tertiary)';
    card.style.borderWidth = '0.5px';
    card.querySelector('input').checked = false;
  }
  var sel = document.getElementById('uc'+n);
  sel.style.borderColor = '#378ADD';
  sel.style.borderWidth = '2px';
  sel.querySelector('input').checked = true;
}

function selectedUseCaseLabel(){
  var checked = document.querySelector('input[name=usecase]:checked');
  if(!checked) return null;
  var label = document.querySelector('#uc'+checked.value+' .opt-label');
  return label ? label.firstChild.textContent.trim() : null;
}

/* ---- Step 4: readiness ---- */
function updateReadiness(){
  var web = document.querySelector('input[name=hasWeb]:checked');
  var nums = document.querySelector('input[name=hasNumbers]:checked');
  var tech = document.querySelector('input[name=techLevel]:checked');
  if(!web || !nums || !tech) return;
  document.getElementById('readinessResult').style.display = 'block';

  var items = [];
  if(web.value === 'yes'){
    items.push({ ok:'yes', label:'Business website', detail:'You have a domain — required for Viber registration approval.' });
  } else {
    items.push({ ok:'no', label:'Business website missing', detail:'Viber rejects social-only registrations. You need a real domain before applying.' });
  }
  if(nums.value === 'yes'){
    items.push({ ok:'yes', label:'Consented contact list ready', detail:'You can start sending immediately after go-live.' });
  } else if(nums.value === 'partial'){
    items.push({ ok:'partial', label:'Partial consent — needs cleanup', detail:'Segment your list. Only send to contacts with explicit opt-in to avoid Viber bans.' });
  } else {
    items.push({ ok:'no', label:'No contact list yet', detail:'Build an opt-in flow before launch. Add "Chat with us on Viber" to your website and emails.' });
  }
  if(tech.value === 'api'){
    items.push({ ok:'yes', label:'API integration path', detail:'Full Omnichannel API — triggers, delivery webhooks, MO replies, and CRM sync all available.' });
  } else if(tech.value === 'dashboard'){
    items.push({ ok:'yes', label:'Dashboard / no-code path', detail:'Messente Dashboard or partner web UI works well. Slightly less automation flexibility but zero dev time.' });
  } else {
    items.push({ ok:'partial', label:'Integration path undecided', detail:'Clarify before registering. This affects which partner and pricing tier makes sense.' });
  }

  var cl = document.getElementById('checklistWrap');
  cl.innerHTML = '';
  items.forEach(function(it){
    var icon = it.ok === 'yes' ? '<i class="ti ti-check" aria-hidden="true"></i>' : it.ok === 'partial' ? '~' : '<i class="ti ti-x" aria-hidden="true"></i>';
    var cls = it.ok === 'yes' ? 'check-yes' : it.ok === 'partial' ? 'check-partial' : 'check-no';
    cl.innerHTML += '<div class="checklist-row"><div class="check-icon '+cls+'">'+icon+'</div><div><div class="check-label">'+it.label+'</div><div class="check-detail">'+it.detail+'</div></div></div>';
  });

  var devTime = tech.value === 'api' ? 7 : 3;
  var consentTime = nums.value === 'no' ? 14 : nums.value === 'partial' ? 7 : 0;
  var total = 7 + devTime + consentTime;
  var tl = document.getElementById('timelineWrap');
  tl.innerHTML = '<div class="tl-item"><div class="tl-dot done"></div><div class="tl-title">Register & submit brand assets</div><div class="tl-body">Company details, logos in 7 sizes, sample templates, website URL.</div><div class="tl-days">Days 1–3</div></div>'
    + '<div class="tl-item"><div class="tl-dot active"></div><div class="tl-title">Viber review + blue tick approval</div><div class="tl-body">Typically 3–7 business days. Templates in RU/UA/BY take up to 48h extra.</div><div class="tl-days">Days 4–10</div></div>'
    + (consentTime > 0 ? '<div class="tl-item"><div class="tl-dot"></div><div class="tl-title">Build / clean opt-in list</div><div class="tl-body">Add Viber consent to sign-up flows, emails, and storefront CTAs.</div><div class="tl-days">Days 1–'+consentTime+' (parallel)</div></div>' : '')
    + '<div class="tl-item"><div class="tl-dot"></div><div class="tl-title">'+(tech.value === 'api' ? 'API integration & webhook testing' : 'Dashboard setup & template upload')+'</div><div class="tl-body">'+(tech.value === 'api' ? 'Connect Omnichannel API, map delivery webhooks, test MO replies.' : 'Create sender, upload templates, configure SMS fallback.')+'</div><div class="tl-days">~'+devTime+' days</div></div>'
    + '<div class="tl-item"><div class="tl-dot"></div><div class="tl-title">Pilot send + monitor</div><div class="tl-body">Send to 200–500 contacts. Check delivery, seen rates, and opt-outs before scaling.</div><div class="tl-days">Day '+(total-2)+'–'+total+'</div></div>';
}

/* ---- Step 5: lead capture ----
   MVP: validates and shows confirmation. The captured `lead` object below is the
   hand-off point for Phase 2 (POST to CRM + trigger a real Viber demo send via
   Messente's Omnichannel API). See README "Phase 2". */
function submitLead(){
  var biz = document.getElementById('biz').value.trim();
  var email = document.getElementById('email').value.trim();
  if(!biz || !email){ alert('Please enter your business name and email.'); return; }

  var lead = {
    business: biz,
    email: email,
    phone: document.getElementById('phone').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    countries: selectedCountryNames(),
    useCase: selectedUseCaseLabel(),
    readiness: {
      hasWebsite: (document.querySelector('input[name=hasWeb]:checked') || {}).value || null,
      hasNumbers: (document.querySelector('input[name=hasNumbers]:checked') || {}).value || null,
      techLevel:  (document.querySelector('input[name=techLevel]:checked') || {}).value || null
    }
  };
  // TODO (Phase 2): POST `lead` to CRM endpoint and trigger Viber demo send.
  console.log('Lead captured (wire to CRM in Phase 2):', lead);

  document.getElementById('leadForm').style.display = 'none';
  document.getElementById('leadSuccess').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', renderCountries);
