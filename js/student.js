
// ==========================================
// STUDENT.JS
// PART 1: INITIALIZATION & PROFILE LOAD
// ==========================================

// ----------------------------
// GET STUDENT ID
// ----------------------------
const params = new URLSearchParams(window.location.search);
const studentId = Number(params.get("id"));

// ----------------------------
// FIND STUDENT
// ----------------------------
const student = students.find(s => s.id === studentId);

// ----------------------------
// STUDENT NOT FOUND
// ----------------------------
if (!student) {
    document.body.innerHTML = `
        <div style="padding:80px;text-align:center;font-family:Poppins,sans-serif">
            <h2>Student Not Found</h2>
            <a href="students.html">← Back to Students</a>
        </div>
    `;
    throw new Error("Student Not Found");
}

// ----------------------------
// DOM HELPER
// ----------------------------
const $ = (id) => document.getElementById(id);

// ----------------------------
// LOAD PROFILE DATA
// ----------------------------
const studentPhoto = $("studentPhoto");
if (studentPhoto) {
    studentPhoto.src = student.photo || "images/default/default.png";
    studentPhoto.onerror = function () {
        this.src = "images/default/default.png";
    };
}

$("studentName").textContent = student.name;
$("studentId").textContent = `Student ID : ${student.id}`;
$("studentCourse").textContent = student.course;
$("studentCourse2").textContent = student.course;
$("studentPhone").textContent = student.phone;
$("studentRole").textContent = "MS-CIT Student";
$("studentAbout").textContent = student.about;

// ----------------------------
// SKILLS RENDER
// ----------------------------
const skillsContainer = $("skillsContainer");
skillsContainer.innerHTML = "";
(student.skills || []).forEach(skill => {
    const span = document.createElement("span");
    span.className = "skill";
    span.textContent = skill;
    skillsContainer.appendChild(span);
});

// ----------------------------
// RESUME LINKS
// ----------------------------
$("resumeDownload").href = student.resume || "#";
const viewResume = $("viewResume");
if (viewResume) {
    viewResume.href = student.resume || "#";
}

// ----------------------------
// LOAD PROJECT DATA
// ----------------------------
const studentProjects = projects[student.id] || projects.default;
console.log("Student ID:", student.id);
console.log("Student Projects:", studentProjects);

// ----------------------------
// PROJECT SUMMARY COUNTS
// ----------------------------
const categories = ["word", "canva", "webpage", "ppt", "excel", "photoshop"];
const summaryCards = document.querySelectorAll(".category-card");

categories.forEach((category, index) => {
    if (!summaryCards[index]) return;
    const count = studentProjects[category] ? studentProjects[category].length : 0;

    // Fallback: If <p> doesn't exist, create it dynamically
    let p = summaryCards[index].querySelector("p");
    if (!p) {
        p = document.createElement("p");
        summaryCards[index].appendChild(p);
    }
    p.textContent = `${count} Projects`;
});

// ----------------------------
// GLOBAL PROJECT GRID SETUP
// ----------------------------
const projectsContainer = document.createElement("div");
projectsContainer.className = "project-grid";

let currentCategory = "word";
let currentIndex = 0;
// ==========================================
// PART 2: PERFECT FLIP GRID ANIMATION 
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("dashboard");
    if (!grid) return;

    const cards = [...grid.querySelectorAll(".dashboard-card")];
    if (cards.length === 0) return;

    // 1. Assign base grid orders
    cards.forEach((card, i) => {
        card.dataset.order = i;
        card.style.order = i;
    });

    let activeCard = null;
    let showcasePanel = null;

    // 2. The FLIP Animation Engine
    function flip(mutate, duration = 480) {
        const firstPositions = new Map(cards.map(c => [c, c.getBoundingClientRect()]));

        mutate(); // Applies CSS changes instantly

        cards.forEach(c => {
            const first = firstPositions.get(c);
            const last = c.getBoundingClientRect();
            const dx = first.left - last.left;
            const dy = first.top - last.top;

            if (dx !== 0 || dy !== 0) {
                c.style.transition = "none";
                c.style.transform = `translate(${dx}px, ${dy}px)`;
            }
        });

        grid.getBoundingClientRect(); // Force browser layout recalculation

        requestAnimationFrame(() => {
            cards.forEach(c => {
                c.style.transition = `transform ${duration}ms cubic-bezier(.4,0,.2,1)`;
                c.style.transform = "";
            });
        });
    }

    // 3. Build Showcase HTML Dynamically
    function buildShowcase(catId) {
        const panel = document.createElement("div");
        panel.className = "dash-showcase";

        let projects = [];
        if (typeof studentProjects !== 'undefined' && studentProjects[catId]) {
            projects = studentProjects[catId];
        }

        if (projects.length === 0) {
            panel.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color:#5400A1; margin-bottom:10px;">No Projects Found</h3>
                    <p style="color:#636e72;">There are no projects uploaded in this category yet.</p>
                </div>
            `;
            return panel;
        }

        const projectCards = projects.map((p, index) => `
            <div class="project-item">
                <h4 style="margin: 0 0 15px; font-size: 16px; color:#333;">${p.title}</h4>
                <div class="project-actions" style="display: flex; gap: 8px;">
                    <button class="view-btn" data-category="${catId}" data-index="${index}" style="flex: 1; padding: 10px 0; border:none; border-radius: 8px; background: #5400A1; color: #fff; cursor: pointer; font-weight:600;">View</button>
                    <a href="${p.path}" download class="download-btn" style="flex: 1; padding: 10px 0; border-radius: 8px; background: #198754; color: #fff; text-decoration: none; font-weight:600; text-align:center;">Download</a>
                </div>
            </div>
        `).join("");

        panel.innerHTML = `
            <div class="project-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-top: 0;">
                ${projectCards}
            </div>
        `;
        return panel;
    }

    // 4. Reveal & Hide Functions
    function revealShowcase(card, catId) {
        showcasePanel = buildShowcase(catId);
        showcasePanel.style.order = -1; // Force panel to sit next to the active card

        flip(() => {
            card.after(showcasePanel); // Inject directly beneath the active card in DOM
        }, 380);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => showcasePanel.classList.add("visible"));
        });
    }

    function hideShowcase(onDone) {
        if (!showcasePanel) return onDone();
        const panel = showcasePanel;
        showcasePanel = null;
        panel.classList.remove("visible");

        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            if (panel.isConnected) panel.remove();
            onDone();
        };
        panel.addEventListener("transitionend", finish, { once: true });
        setTimeout(finish, 400); // Safety fallback
    }

    // 5. Click Handler
    function activate(card) {
        const catId = card.dataset.category;

        currentCategory = catId;
        currentIndex = 0;
        if (activeCard === card) {
            deactivate();
            return;
        }


        const prev = activeCard;
        const duration = 480;

        hideShowcase(() => {
            flip(() => {
                if (prev) {
                    prev.classList.remove("active");
                    prev.style.order = prev.dataset.order;
                }
                card.classList.add("active");
                card.style.order = -1; // Push active card to top
                activeCard = card;
            }, duration);

            let settled = false;
            const proceed = () => {
                if (settled) return;
                settled = true;
                if (activeCard === card) revealShowcase(card, catId);
            };
            card.addEventListener("transitionend", function onEnd(e) {
                if (e.propertyName !== "transform") return;
                card.removeEventListener("transitionend", onEnd);
                proceed();
            });
            setTimeout(proceed, duration + 60);
        });
    }

    function deactivate() {
        const card = activeCard;
        hideShowcase(() => {
            flip(() => {
                card.classList.remove("active");
                card.style.order = card.dataset.order;
                activeCard = null;
            }, 480);
        });
    }

    // Attach Click Events
    cards.forEach(card => card.addEventListener("click", () => activate(card)));

    // Optional: Auto-open first card on load
    // setTimeout(() => { if (cards.length > 0) cards[0].click(); }, 300);
});

// ==========================================
// PART 3: PROJECT MODAL VIEWING
// ==========================================
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-btn")) {
        const cat = e.target.dataset.category;
        const idx = Number(e.target.dataset.index);
        openProject(cat, idx);
    }
});

const modal = document.getElementById("projectModal");
const viewer = document.getElementById("projectViewer");

const closeBtn = document.querySelector(".close-modal");

const prevBtn = document.getElementById("prevProject");
const nextBtn = document.getElementById("nextProject");

const counter = document.getElementById("projectCounter");
// const downloadBtn = document.getElementById("downloadProject");
prevBtn?.addEventListener("click", () => { });
nextBtn?.addEventListener("click", () => { });
closeBtn?.addEventListener("clik", () => { });

function openProject(category, index) {

    if (typeof studentProjects === "undefined") return;

    const list = studentProjects[category] || [];
    const project = list[index];

    if (!project) return;

    // Mobile → Open directly
    if (window.innerWidth <= 768) {
        window.open(project.path, "_blank");
        return;
    }

    viewer.innerHTML = "";

    switch (project.type) {

        case "image":
            viewer.innerHTML = `
                <img src="${project.path}"
                     style="max-width:100%;
                            max-height:85vh;
                            object-fit:contain;
                            border-radius:10px;">
            `;
            break;

        case "pdf":
        case "website":
            viewer.innerHTML = `
                <iframe src="${project.path}"
                        style="width:100%;
                               height:85vh;
                               border:none;
                               border-radius:10px;">
                </iframe>
            `;
            break;

        default:
            viewer.innerHTML = "<h3>Preview not available</h3>";
    }

    modal.style.display = "flex";
}

if (closeBtn) closeBtn.addEventListener("click", () => { if (modal) modal.style.display = "none"; });
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });


// Navigation Controls
prevBtn?.addEventListener("click", () => {
    const list = studentProjects[currentCategory] || [];
    if (list.length === 0) return;
    currentIndex = (currentIndex - 1 + list.length) % list.length;
    openProject(currentCategory, currentIndex);
});

nextBtn?.addEventListener("click", () => {
    const list = studentProjects[currentCategory] || [];
    if (list.length === 0) return;
    currentIndex = (currentIndex + 1) % list.length;
    openProject(currentCategory, currentIndex);
});

// Keyboard Controls
document.addEventListener("keydown", (e) => {
    if (!modal || modal.style.display !== "flex") return;
    if (e.key === "Escape") {
        modal.style.display = "none";
        viewer.innerHTML = "";
    } else if (e.key === "ArrowLeft") {
        prevBtn?.click();
    } else if (e.key === "ArrowRight") {
        nextBtn?.click();
    }
});

// Profile Photo Popup Shortcut
studentPhoto?.addEventListener("click", () => {
    viewer.innerHTML = `<img src="${student.photo}" class="popup-image" alt="${student.name}">`;
    if (counter) counter.textContent = "Profile Photo";
    // if (downloadBtn) downloadBtn.href = student.photo;
    if (modal) modal.style.display = "flex";
});