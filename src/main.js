import './style.css';

const companies = {
  samsung: { name: '삼성전자', short: '삼성전자', ticker: '005930', color: '#2563eb', mark: 'S' },
  lg: { name: 'LG전자', short: 'LG전자', ticker: '066570', color: '#dc2626', mark: 'L' },
  hynix: { name: 'SK하이닉스', short: 'SK하이닉스', ticker: '000660', color: '#f97316', mark: 'SK' },
  hyundai: { name: '현대자동차', short: '현대차', ticker: '005380', color: '#0b4da2', mark: 'H' },
};

const events = [
  { date: '2026-01-28', company: 'hynix', quarter: '2025년 4분기', time: '09:00', source: 'https://news.skhynix.com/en/category/ir/' },
  { date: '2026-01-29', company: 'samsung', quarter: '2025년 4분기', time: '10:00', source: 'https://www.samsung.com/sec/ir/ir-events-presentations/events/' },
  { date: '2026-01-30', company: 'lg', quarter: '2025년 4분기', time: '16:00', source: 'https://www.lge.co.kr/company/investor/presentation' },
  { date: '2026-01-29', company: 'hyundai', quarter: '2025년 4분기', time: '시간 미공개', source: 'https://www.hyundai.com/worldwide/en/newsroom/detail/0000001116' },
  { date: '2026-04-22', company: 'hynix', quarter: '2026년 1분기', time: '09:00', source: 'https://news.skhynix.com/en/category/ir/' },
  { date: '2026-04-29', company: 'lg', quarter: '2026년 1분기', time: '16:00', source: 'https://www.lge.co.kr/company/investor/presentation' },
  { date: '2026-04-30', company: 'samsung', quarter: '2026년 1분기', time: '10:00', source: 'https://www.samsung.com/sec/ir/ir-events-presentations/events/' },
  { date: '2026-04-23', company: 'hyundai', quarter: '2026년 1분기', time: '시간 미공개', source: 'https://www.hyundai.com/worldwide/en/newsroom/detail/0000001162' },
  { date: '2026-07-29', company: 'hynix', quarter: '2026년 2분기', time: '09:00', source: 'https://news.skhynix.com/en/q2-2026-earnings-conference-call-invitation/' },
  { date: '2026-07-30', company: 'samsung', quarter: '2026년 2분기', time: '10:00', source: 'https://www.samsung.com/sec/ir/ir-events-presentations/events/' },
  { date: '2026-07-30', company: 'lg', quarter: '2026년 2분기', time: '16:00', source: 'https://www.lge.co.kr/company/investor/presentation' },
  { date: '2026-07-23', company: 'hyundai', quarter: '2026년 2분기', time: '시간 미공개', source: 'https://www.hyundai.com/worldwide/en/company/ir/notices/view-0000000373-en-10-1-' },
];

const today = new Date();
let view = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedCompanies = new Set(Object.keys(companies));

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="실적 캘린더 홈"><span class="brand-dot"></span>실적 캘린더</a>
    <span class="updated">공식 IR 기준 · 2026. 8. 28 업데이트</span>
  </header>
  <main>
    <section class="hero">
      <div>
        <p class="eyebrow">EARNINGS CALENDAR</p>
        <h1>놓치면 안 되는<br><em>실적 발표</em>를 한눈에.</h1>
        <p class="hero-copy">삼성전자, LG전자, SK하이닉스, 현대자동차의 공식 발표 일정을<br class="desktop-only"> 달력에서 빠르게 확인하세요.</p>
      </div>
      <div class="hero-note"><span>i</span><p><strong>일정 안내</strong>향후 분기 일정은 회사가 공식 발표한 뒤 추가됩니다.</p></div>
    </section>

    <section class="calendar-shell" aria-label="실적 발표 캘린더">
      <div class="calendar-toolbar">
        <div class="month-nav">
          <button id="prev" aria-label="이전 달">‹</button>
          <h2 id="month-title"></h2>
          <button id="next" aria-label="다음 달">›</button>
          <button id="today" class="today-btn">오늘</button>
          <button id="latest" class="latest-btn">최근 발표</button>
        </div>
        <div class="filters" aria-label="기업 필터"></div>
      </div>
      <div class="weekdays" aria-hidden="true"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>
      <div id="calendar" class="calendar-grid"></div>
    </section>

    <section class="upcoming">
      <div class="section-heading"><div><p class="eyebrow">LATEST RELEASES</p><h2>최근 실적 발표</h2></div><p>날짜를 누르면 공식 IR 자료를 확인할 수 있어요.</p></div>
      <div id="event-list" class="event-list"></div>
    </section>
  </main>
  <footer><p>기업 공식 IR 페이지의 공시 일정을 기준으로 제공합니다.</p><p>투자 판단의 책임은 투자자 본인에게 있습니다.</p></footer>
`;

const pad = n => String(n).padStart(2, '0');
const dateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

function renderFilters() {
  document.querySelector('.filters').innerHTML = Object.entries(companies).map(([key, c]) => `
    <button class="filter ${selectedCompanies.has(key) ? 'active' : ''}" data-company="${key}" style="--company:${c.color}" aria-pressed="${selectedCompanies.has(key)}">
      <span></span>${c.name}
    </button>`).join('');
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.company;
    selectedCompanies.has(key) ? selectedCompanies.delete(key) : selectedCompanies.add(key);
    render();
  }));
}

function renderCalendar() {
  const year = view.getFullYear();
  const month = view.getMonth();
  document.querySelector('#month-title').textContent = `${year}년 ${month + 1}월`;
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const total = Math.ceil((firstDay + days) / 7) * 7;
  let html = '';

  for (let i = 0; i < total; i++) {
    const relative = i - firstDay + 1;
    let cellDate;
    let muted = false;
    if (relative < 1) { cellDate = new Date(year, month - 1, prevDays + relative); muted = true; }
    else if (relative > days) { cellDate = new Date(year, month + 1, relative - days); muted = true; }
    else cellDate = new Date(year, month, relative);
    const key = dateKey(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
    const dayEvents = events.filter(e => e.date === key && selectedCompanies.has(e.company));
    const isToday = key === dateKey(today.getFullYear(), today.getMonth(), today.getDate());
    html += `<div class="day ${muted ? 'muted' : ''} ${isToday ? 'is-today' : ''}">
      <span class="day-number">${cellDate.getDate()}</span>
      <div class="day-events">${dayEvents.map(e => {
        const c = companies[e.company];
        return `<a href="${e.source}" target="_blank" rel="noreferrer" class="event-chip" style="--company:${c.color}" aria-label="${c.name} ${e.quarter} 실적 발표, ${e.time}"><b>${c.short}${e.isNew ? '<i class="new-badge">NEW!</i>' : ''}</b><small>${e.time}</small></a>`;
      }).join('')}</div>
    </div>`;
  }
  document.querySelector('#calendar').innerHTML = html;
}

function renderEventList() {
  const latest = [...events]
    .filter(e => selectedCompanies.has(e.company))
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    .slice(0, 6);
  document.querySelector('#event-list').innerHTML = latest.map(e => {
    const c = companies[e.company];
    const d = new Date(`${e.date}T00:00:00`);
    return `<a class="event-row" href="${e.source}" target="_blank" rel="noreferrer">
      <div class="date-box"><strong>${d.getDate()}</strong><span>${d.getMonth() + 1}월</span></div>
      <span class="company-mark" style="--company:${c.color}">${c.mark}</span>
      <div class="event-copy"><strong>${c.name}${e.isNew ? '<i class="new-badge">NEW!</i>' : ''}</strong><span>${e.quarter} 실적 발표 · ${e.time}</span></div>
      <span class="status">발표 완료</span><span class="arrow">↗</span>
    </a>`;
  }).join('') || '<p class="empty">선택한 기업의 일정이 없습니다.</p>';
}

function render() { renderFilters(); renderCalendar(); renderEventList(); }
document.querySelector('#prev').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCalendar(); });
document.querySelector('#next').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCalendar(); });
document.querySelector('#today').addEventListener('click', () => { view = new Date(today.getFullYear(), today.getMonth(), 1); renderCalendar(); });
document.querySelector('#latest').addEventListener('click', () => { const d = new Date(events.at(-1).date); view = new Date(d.getFullYear(), d.getMonth(), 1); renderCalendar(); });
render();
