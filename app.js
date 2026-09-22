const CASE_DATA = {
  kicker: "Case record — draft",
  title: "Allegations of online grooming and child exploitation by Prince Yujin Hemady Baydal (aka 'mylifeasaslime')",
  sub: "Compiled",
  status: "Draft - W.I.P",
  compiler: "Person",
  sources: "Discord messages and video files",
  methodology: "1. We found Victims 1 and 2 by tracing server members who disclosed the contact to Senkai. Victim 3 is not clearly recalled. Victim 4 was a person who contacted Senkai. Victim 5 is Mizumei, who contacted Senkai. Victim 6 is Alex, who was contacted by Mizumei. Victim 7 remains unknown and was identified only from the screenshots and messages in Slimey's chat that Mizumei shared with us.\n\n2. In practical terms, the methodology was to map the network through server membership, direct disclosures, message screenshots, and corroboration between individuals, rather than relying on a single source or assumption.",
  pedo: {
    alias: "Mylifeasaslime - ",
    handles: "—",
    platforms: "—",
    riskFlags: [
      "Repeated contact with minors or vulnerable users",
      "Boundary-testing or grooming-oriented behavior",
      "Attempts to downplay or conceal concerning conduct",
    ],
  },
  sourceLinks: [
    { label: "Primary case intake", url: "https://example.com/case-intake", note: "Add the actual record or intake location used for this case." },
  ],
  entries: [
  ],
};


const MEDIA_FILES = [];


const navToggle = document.getElementById("nav-toggle");
const mastheadNav = document.getElementById("masthead-nav");
const masthead = document.querySelector(".masthead");
navToggle.addEventListener("click", () => {
  const open = mastheadNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

document.querySelectorAll(".nav-link[data-target]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("is-active"));
    link.classList.add("is-active");
    mastheadNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  });
});

let compactHeaderPending = false;
function updateHeaderOnScroll() {
  const shouldCompact = window.scrollY > 80;
  masthead.classList.toggle("is-compact", shouldCompact);
  compactHeaderPending = false;
}

window.addEventListener("scroll", () => {
  if (!compactHeaderPending) {
    compactHeaderPending = true;
    window.requestAnimationFrame(updateHeaderOnScroll);
  }
}, { passive: true });

updateHeaderOnScroll();

/*overview*/

function renderOverview() {
  const kickerEl = document.getElementById("case-kicker");
  const titleEl = document.getElementById("case-title");
  const subEl = document.getElementById("case-sub");

  if (kickerEl) kickerEl.textContent = CASE_DATA.kicker;
  if (titleEl) titleEl.textContent = CASE_DATA.title;
  if (subEl) subEl.textContent = CASE_DATA.sub;

  const factStatusEl = document.getElementById("fact-status");
  const factCompilerEl = document.getElementById("fact-compiler");
  const factSourcesEl = document.getElementById("fact-sources");
  const factCountEl = document.getElementById("fact-count");
  const factRangeEl = document.getElementById("fact-range");

  if (factStatusEl) factStatusEl.textContent = CASE_DATA.status;
  if (factCompilerEl) factCompilerEl.textContent = CASE_DATA.compiler;
  if (factSourcesEl) factSourcesEl.textContent = CASE_DATA.sources;
  if (factCountEl) factCountEl.textContent = String(CASE_DATA.entries.length);

  const dates = CASE_DATA.entries.map((e) => e.date).filter(Boolean).sort();
  if (factRangeEl) {
    factRangeEl.textContent = dates.length
      ? `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
      : "—";
  }
}

function renderCaseNotes() {
  const methodologyEl = document.getElementById("methodology-text");
  const pedoInfoEl = document.getElementById("pedo-info");
  const sourceLinksEl = document.getElementById("source-links");

  if (methodologyEl) {
    const methodologyText = escapeHtml(CASE_DATA.methodology || "No methodology has been entered yet.").replace(/\n/g, "<br>");
    methodologyEl.innerHTML = `<strong>Method:</strong> ${methodologyText}`;
  }

  if (pedoInfoEl) {
    const entries = [
      ["Alias", CASE_DATA.pedo?.alias || "—"],
      ["Known handles", CASE_DATA.pedo?.handles || "—"],
      ["Platforms", CASE_DATA.pedo?.platforms || "—"],
      ["Risk indicators", (CASE_DATA.pedo?.riskFlags || []).join(" • ") || "—"],
    ];

    pedoInfoEl.innerHTML = entries
      .map(([label, value]) => `
        <div class="info-card">
          <span class="info-card-label">${escapeHtml(label)}</span>
          <p class="info-card-value">${escapeHtml(String(value))}</p>
        </div>
      `)
      .join("");
  }

  if (sourceLinksEl) {
    const links = CASE_DATA.sourceLinks && CASE_DATA.sourceLinks.length ? CASE_DATA.sourceLinks : [{ label: "No source link provided", url: "#", note: "Add a fact-checked source to this list." }];

    sourceLinksEl.innerHTML = links
      .map((item) => `
        <li class="source-link-item">
          <a href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer">${escapeHtml(item.label || "Source")}</a>
          <span>${escapeHtml(item.note || item.url || "Record this source for citation.")}</span>
        </li>
      `)
      .join("");
  }
}

function formatDate(iso) {
  if (!iso) return "undated";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/*timeline*/
const timelineList = document.getElementById("timeline-list");

function renderTimeline() {
  const sorted = [...CASE_DATA.entries].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  timelineList.innerHTML = "";

  if (sorted.length === 0) {
    timelineList.innerHTML = `<p class="timeline-empty">No entries yet.</p>`;
    return;
  }

  for (const entry of sorted) {
    const li = document.createElement("li");
    li.className = "timeline-entry";
    li.innerHTML = `
      <div class="entry-date">${formatDate(entry.date)}</div>
      <div class="entry-title">${escapeHtml(entry.title || "Untitled entry")}</div>
      <div class="entry-body">${escapeHtml(entry.body || "")}</div>
      ${
        entry.tags && entry.tags.length
          ? `<div class="entry-tags">${entry.tags.map((t) => `<span class="entry-tag">${escapeHtml(t)}</span>`).join("")}</div>`
          : ""
      }
    `;
    if (entry.media && entry.media.length) {
      const mediaList = document.createElement("div");
      mediaList.className = "timeline-media";
      mediaList.setAttribute("aria-label", "Media for this timeline entry");

      entry.media.forEach((item) => {
        const isVideo = item.type === "video" || /\.(mp4|webm|ogg|mov)$/i.test(item.path || "");
        const media = document.createElement(isVideo ? "video" : "img");
        media.className = "timeline-media-preview";
        media.src = item.path;
        media.alt = item.title || "Timeline evidence media";
        if (isVideo) {
          media.controls = true;
          media.preload = "metadata";
        }

        const mediaFigure = document.createElement("figure");
        mediaFigure.className = "timeline-media-item";
        mediaFigure.appendChild(media);
        const caption = document.createElement("figcaption");
        caption.innerHTML = `<strong>${escapeHtml(item.title || "Untitled media")}</strong>${item.caption ? `<span>${escapeHtml(item.caption)}</span>` : ""}`;
        mediaFigure.appendChild(caption);
        mediaList.appendChild(mediaFigure);
      });

      li.appendChild(mediaList);
    }
    timelineList.appendChild(li);
  }
}

if (document.getElementById("add-entry-btn")) {
  document.getElementById("add-entry-btn").hidden = true;
  document.getElementById("add-entry-btn").setAttribute("aria-disabled", "true");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/*gallery*/
let galleryItems = []; // { id, dataURL, redacted, caption }
let nextId = 1;

const galleryGrid = document.getElementById("gallery-grid");

function renderGallery() {
  galleryGrid.innerHTML = "";
  if (galleryItems.length === 0) {
    galleryGrid.innerHTML = `<p class="gallery-empty">No evidence images added yet.</p>`;
    return;
  }
  galleryItems.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "gallery-item";
    btn.type = "button";
    btn.innerHTML = `
      <img src="${item.dataURL}" alt="${item.caption ? escapeHtml(item.caption) : "Evidence image, not yet captioned"}">
      <div class="gallery-item-cap">
        <span>${item.caption ? escapeHtml(item.caption) : "Untitled"}</span>
        <span class="${item.redacted ? "badge-redacted" : "badge-unredacted"}">${item.redacted ? "Redacted" : "Raw — click to redact"}</span>
      </div>
    `;
    btn.addEventListener("click", () => openRedactModal(item.id));
    galleryGrid.appendChild(btn);
  });
}

/*media appendix*/
const mediaGrid = document.getElementById("media-grid");
let mediaItems = MEDIA_FILES.map((item) => ({ ...item, source: "folder" }));
function renderMedia() {
  mediaGrid.innerHTML = "";
  if (mediaItems.length === 0) {
    mediaGrid.innerHTML = `<p class="media-empty">The supplied media archive contains no files.</p>`;
    return;
  }

  mediaItems.forEach((item) => {
    const figure = document.createElement("figure");
    figure.className = "media-card";
    const isVideo = item.type === "video" || /\.(mp4|webm|ogg|mov)$/i.test(item.path || item.name || "");
    const media = document.createElement(isVideo ? "video" : "img");
    media.src = item.path;
    media.controls = isVideo;
    media.preload = "metadata";
    media.alt = item.title || "Evidence media";
    figure.appendChild(media);
    const caption = document.createElement("figcaption");
    caption.innerHTML = `<span class="media-title">${escapeHtml(item.title || item.name || "Untitled media")}</span>${escapeHtml(item.caption || "")}`;
    figure.appendChild(caption);
    mediaGrid.appendChild(figure);
  });
}

const redactModal = document.getElementById("redact-modal");
const canvas = document.getElementById("redact-canvas");
const ctx = canvas.getContext("2d");
const captionInput = document.getElementById("redact-caption");

let activeItemId = null;
let activeTool = "blackout";
let blurredCanvas = null; // offscreen, same size, fully blurred
let undoStack = [];
let strokeBase = null; // ImageData snapshot at pointerdown
let dragStart = null;
let hasRedacted = false;

function openRedactModal(itemId) {
  const item = galleryItems.find((g) => g.id === itemId);
  if (!item) return;
  activeItemId = itemId;
  hasRedacted = item.redacted;
  undoStack = [];
  captionInput.value = item.caption || "";

  const img = new Image();
  img.onload = () => {
    const maxW = Math.min(820, window.innerWidth - 80);
    const scale = Math.min(1, maxW / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    blurredCanvas = document.createElement("canvas");
    blurredCanvas.width = canvas.width;
    blurredCanvas.height = canvas.height;
    const bctx = blurredCanvas.getContext("2d");
    bctx.filter = "blur(9px)";
    bctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    redactModal.removeAttribute("hidden");
  };
  img.src = item.dataURL;
}

document.querySelectorAll(".tool-btn[data-tool]").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeTool = btn.dataset.tool;
    document.querySelectorAll(".tool-btn[data-tool]").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});

document.querySelector('[data-action="undo"]').addEventListener("click", () => {
  try {
    const prev = undoStack.pop();
    if (prev) ctx.putImageData(prev, 0, 0);
  } catch (err) {
    console.error("Undo failed:", err);
    alert("Undo hit an error — check the console (F12) for details.");
  }
});

function closeRedactModal() {
  try {
    redactModal.setAttribute("hidden", "");
  } catch (err) {
    console.error("Closing the redaction modal failed:", err);
    alert("Couldn't close the redaction tool — check the console (F12) for details.");
  }
}

document.querySelector('[data-action="close"]').addEventListener("click", closeRedactModal);

redactModal.addEventListener("click", (e) => {
  if (e.target === redactModal) closeRedactModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !redactModal.hasAttribute("hidden")) closeRedactModal();
});

function canvasPoint(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
  const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

function drawRect(x0, y0, x1, y1) {
  const x = Math.min(x0, x1), y = Math.min(y0, y1);
  const w = Math.abs(x1 - x0), h = Math.abs(y1 - y0);
  if (w < 1 || h < 1) return;

  if (activeTool === "blackout") {
    ctx.fillStyle = "#111214";
    ctx.fillRect(x, y, w, h);
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(blurredCanvas, 0, 0);
    ctx.restore();
  }
}

function pointerDown(evt) {
  evt.preventDefault();
  strokeBase = ctx.getImageData(0, 0, canvas.width, canvas.height);
  dragStart = canvasPoint(evt);
}
function pointerMove(evt) {
  if (!dragStart) return;
  evt.preventDefault();
  const p = canvasPoint(evt);
  ctx.putImageData(strokeBase, 0, 0);
  drawRect(dragStart.x, dragStart.y, p.x, p.y);
}
function pointerUp(evt) {
  if (!dragStart) return;
  const p = canvasPoint(evt);
  ctx.putImageData(strokeBase, 0, 0);
  drawRect(dragStart.x, dragStart.y, p.x, p.y);
  undoStack.push(strokeBase);
  hasRedacted = true;
  dragStart = null;
}

canvas.addEventListener("mousedown", pointerDown);
canvas.addEventListener("mousemove", pointerMove);
window.addEventListener("mouseup", pointerUp);
canvas.addEventListener("touchstart", pointerDown, { passive: false });
canvas.addEventListener("touchmove", pointerMove, { passive: false });
canvas.addEventListener("touchend", pointerUp);

document.getElementById("redact-save-btn").addEventListener("click", () => {
  try {
    const item = galleryItems.find((g) => g.id === activeItemId);
    if (!item) {
      console.warn("No active gallery item to save.");
      closeRedactModal();
      return;
    }

    item.dataURL = canvas.toDataURL("image/png");
    item.redacted = hasRedacted;
    item.caption = captionInput.value.trim();
    closeRedactModal();
    renderGallery();
  } catch (err) {
    console.error("Flatten & save failed:", err);
    alert("Saving this image hit an error — check the console (F12) for details, then try again.");
  }
});


renderOverview();
renderCaseNotes();
renderTimeline();
renderGallery();
renderMedia();
