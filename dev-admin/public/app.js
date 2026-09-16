let graphData = null;
let allExpanded = false;
let showStoreHubOnly = false;

const PHASE_CONFIG = {
  trigger: { label: '입력 (Trigger)', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', icon: '⚡' },
  decision: { label: '판단 (Decision)', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', icon: '⚖️' },
  compute: { label: '연산 (Compute)', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)', icon: '⚙️' },
  api: { label: 'API (Network)', color: '#0891b2', bg: 'rgba(8, 145, 178, 0.12)', icon: '🌐' },
  store: { label: '저장소 (Store)', color: '#db2777', bg: 'rgba(219, 39, 119, 0.12)', icon: '💾' },
  render: { label: '출력 (Render)', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)', icon: '🎨' },
};

window.toggleTheme = function() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('admin_theme', next);
  renderBoard();
};

// Restore saved theme or default to light
const savedTheme = localStorage.getItem('admin_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

async function fetchGraph() {
  try {
    const res = await fetch('/api/graph');
    graphData = await res.json();
    renderBoard();
  } catch (e) {
    console.error('Failed to fetch graph data:', e);
  }
}

let activeDomain = 'ALL';
const collapsedDomains = new Set();

window.selectDomain = function(name) {
  activeDomain = name;
  renderBoard();
};

window.toggleDomain = function(name) {
  if (collapsedDomains.has(name)) {
    collapsedDomains.delete(name);
  } else {
    collapsedDomains.add(name);
  }
  renderBoard();
};

function renderDomainFilterBar() {
  const filterBar = document.getElementById('domain-filter-bar');
  if (!filterBar || !graphData) return;

  if (showStoreHubOnly) {
    filterBar.style.display = 'none';
    return;
  }
  filterBar.style.display = 'flex';

  const domains = graphData.domains || [];
  const totalFeatures = domains.reduce((sum, d) => sum + (d.features ? d.features.length : 0), 0);

  const allActive = activeDomain === 'ALL';
  const allChip = `
    <button class="domain-chip ${allActive ? 'active' : ''}" onclick="selectDomain('ALL')">
      <span>🌐 전체보기</span>
      <span class="chip-badge">${totalFeatures}</span>
    </button>
  `;

  const domainChips = domains.map(dom => {
    const isActive = activeDomain === dom.name;
    return `
      <button class="domain-chip ${isActive ? 'active' : ''}" onclick="selectDomain('${escapeHtml(dom.name)}')">
        <span>📁 ${escapeHtml(dom.name)}</span>
        <span class="chip-badge">${dom.features.length}</span>
      </button>
    `;
  }).join('');

  filterBar.innerHTML = `
    <div class="domain-filter-label">도메인 필터:</div>
    <div class="domain-chip-group">
      ${allChip}
      ${domainChips}
    </div>
  `;
}

function renderBoard() {
  const main = document.getElementById('main-container');
  if (!graphData) return;

  renderDomainFilterBar();

  if (showStoreHubOnly) {
    renderStoreHubView(main);
    return;
  }

  const allDomains = graphData.domains || [];
  if (allDomains.length === 0) {
    main.innerHTML = `<div class="empty-state">등록된 기능이 없습니다.</div>`;
    return;
  }

  const visibleDomains = allDomains.filter(dom => activeDomain === 'ALL' || activeDomain === dom.name);

  if (visibleDomains.length === 0) {
    main.innerHTML = `<div class="empty-state">해당 도메인에 등록된 기능이 없습니다.</div>`;
    return;
  }

  main.innerHTML = visibleDomains.map((dom, domIdx) => {
    const isCollapsed = collapsedDomains.has(dom.name);

    const featureCardsHtml = (dom.features || []).map(feat => {
      const nodes = feat.nodes || [];

      const chainHtml = nodes.map((node, idx) => {
        const cfg = PHASE_CONFIG[node.phase] || PHASE_CONFIG.compute;
        const isLast = idx === nodes.length - 1;

        // Inverted hierarchy: Concept & Action first, filename in expanded drawer
        const conceptTitle = node.target || node.desc || node.name;
        const subAction = node.trigger ? `트리거: ${node.trigger}` : (node.target ? node.desc : node.name);

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const host = window.location.hostname || 'localhost';
        const previewSrc = `http://${host}:5173/?preview=${encodeURIComponent(node.componentName)}&theme=${currentTheme}`;
        const previewHtml = node.isComponent && node.componentName ? `
          <div class="block-preview-box">
            <div class="preview-tag">👁️ LIVE PREVIEW</div>
            <iframe src="${previewSrc}" class="preview-mini-frame" loading="lazy" scrolling="no" tabindex="-1"></iframe>
          </div>
        ` : '';

        const blockCard = `
          <div class="script-block ${allExpanded ? 'expanded' : ''}" style="border-top: 4px solid ${cfg.color};" onclick="toggleBlock(this)">
            <div class="block-header" style="background: ${cfg.bg}; color: ${cfg.color};">
              <span class="block-phase">${cfg.icon} ${cfg.label}</span>
              <span class="block-caret">▼</span>
            </div>
            <div class="block-main">
              <div class="block-concept-title">${escapeHtml(conceptTitle)}</div>
              <div class="block-short-desc">${escapeHtml(subAction)}</div>
              ${previewHtml}
            </div>
            <div class="block-drawer">
              <div class="drawer-item" style="margin-top: 6px;">
                <span class="drawer-label">📂 담당 파일 (구현체)</span>
                <div class="drawer-file-box">
                  <span class="drawer-filename">${escapeHtml(node.name)}</span>
                  <span class="drawer-filepath">${escapeHtml(node.filePath)} (${node.lineCount} lines)</span>
                </div>
              </div>
              <div class="drawer-item">
                <span class="drawer-label">세부 동작</span>
                <div class="drawer-value">${escapeHtml(node.desc)}</div>
              </div>
              ${node.storeInfo ? `
              <div class="drawer-item">
                <span class="drawer-label">저장소 입출력</span>
                <div class="drawer-value">
                  <span class="drawer-badge store">💾 ${escapeHtml(node.storeInfo.detail)}</span>
                </div>
              </div>` : ''}
              ${node.nextTargets.length > 0 ? `
              <div class="drawer-item">
                <span class="drawer-label">다음 단계 연결</span>
                <div class="drawer-value">
                  <span class="drawer-badge next">➡️ ${escapeHtml(node.nextTargets.join(', '))}</span>
                </div>
              </div>` : ''}
            </div>
          </div>
        `;

        const wireHtml = !isLast ? `
          <div class="connector-wire">
            <div class="wire-line"></div>
          </div>
        ` : '';

        return blockCard + wireHtml;
      }).join('');

      return `
        <section class="feature-track">
          <div class="track-header">
            <div class="track-title-box">
              <span class="track-badge">FEATURE</span>
              <h3 class="track-title">${escapeHtml(feat.name)}</h3>
            </div>
            <div class="track-meta">${nodes.length}개 파이프라인 단계 연결됨</div>
          </div>

          <div class="script-chain">
            ${chainHtml}
          </div>
        </section>
      `;
    }).join('');

    return `
      <div class="domain-container ${isCollapsed ? 'collapsed' : ''}" id="domain-group-${domIdx}">
        <div class="domain-header" onclick="toggleDomain('${escapeHtml(dom.name)}')">
          <div class="domain-title-group">
            <span class="domain-caret">${isCollapsed ? '▶' : '▼'}</span>
            <span class="domain-icon">📁</span>
            <h2 class="domain-title">${escapeHtml(dom.name)}</h2>
            <span class="domain-count-badge">${dom.features.length}개 단위 기능</span>
          </div>
          <div class="domain-action-hint">
            ${isCollapsed ? '클릭하여 도메인 펼치기' : '클릭하여 접기'}
          </div>
        </div>

        <div class="domain-body">
          ${featureCardsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function renderStoreHubView(container) {
  const stores = graphData.stores || [];
  if (stores.length === 0) {
    container.innerHTML = `<div class="empty-state">등록된 저장소(Store)가 없습니다.</div>`;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${stores.map(st => `
        <div class="store-panel">
          <div style="display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 18px; color: var(--text);">
            <span style="font-size: 24px;">💾</span>
            <span>${escapeHtml(st.name)} 저장소 입출력 허브</span>
          </div>

          <div class="store-grid">
            <!-- Writes -->
            <div class="store-col">
              <span style="font-size: 13px; font-weight: 800; color: #2563eb;">📥 들어가는 곳 (Writes: ${st.writes.length})</span>
              ${st.writes.map(w => `
                <div class="store-chip-card">
                  <div style="font-weight: 800; font-size: 15px; color: var(--text);">${escapeHtml(w.name)}</div>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 3px;">${escapeHtml(w.desc)}</div>
                  <div style="font-size: 12px; color: #db2777; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-weight: 700;">🔑 ${escapeHtml(w.detail)}</div>
                </div>
              `).join('')}
            </div>

            <!-- Core -->
            <div class="store-core-box">
              <div style="font-size: 32px; margin-bottom: 6px;">💾</div>
              <div>${escapeHtml(st.name)}</div>
              <div style="font-size: 12px; color: var(--text-dim); margin-top: 4px;">Central Store</div>
            </div>

            <!-- Reads -->
            <div class="store-col">
              <span style="font-size: 13px; font-weight: 800; color: #7c3aed;">📤 나오는 곳 (Reads: ${st.reads.length})</span>
              ${st.reads.map(r => `
                <div class="store-chip-card">
                  <div style="font-weight: 800; font-size: 15px; color: var(--text);">${escapeHtml(r.name)}</div>
                  <div style="font-size: 12px; color: var(--text-muted); margin-top: 3px;">${escapeHtml(r.desc)}</div>
                  <div style="font-size: 12px; color: #4f46e5; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-weight: 700;">🔍 ${escapeHtml(r.detail)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.toggleBlock = function(el) {
  el.classList.toggle('expanded');
};

window.toggleExpandAll = function() {
  allExpanded = !allExpanded;
  const btn = document.getElementById('btn-toggle-all');
  btn.classList.toggle('active', allExpanded);
  document.querySelectorAll('.script-block').forEach(b => {
    if (allExpanded) b.classList.add('expanded');
    else b.classList.remove('expanded');
  });
};

window.toggleStoreHub = function() {
  showStoreHubOnly = !showStoreHubOnly;
  const btn = document.getElementById('btn-toggle-store');
  btn.classList.toggle('active', showStoreHubOnly);
  renderBoard();
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// SSE Live Sync
function initSSE() {
  const evtSource = new EventSource('/api/events');
  evtSource.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === 'update') {
        fetchGraph();
      }
    } catch {
      // ignore parse error
    }
  };
  evtSource.onerror = () => setTimeout(initSSE, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
  fetchGraph();
  initSSE();
});
