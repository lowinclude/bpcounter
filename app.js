(() => {
  "use strict";

  const STORAGE_KEYS = {
    tasks: "tasks_state_v6",
    favoriteFilter: "tasks_filter_fav",
    categories: "tasks_categories_v1",
  };

  const COLOR_PALETTE = ["#202020", "#3a1d1d", "#1d263a", "#1d3a20", "#3a341d"];
  const DEFAULT_CATEGORY_ID = "default";
  const MANUAL_BP_STEP = 4;

  const DEFAULT_CATEGORIES = [{ id: DEFAULT_CATEGORY_ID, title: "Общие задания" }];

  const FALLBACK_TASKS = [
    { id: 1, title: "Вход в игру", bp: 50, icon: "log-in" },
    { id: 2, title: "Сыграть матч", bp: 100, steps: 3, icon: "gamepad-2" },
  ];

  const ICON_LIBRARY = {
    "layout-dashboard": `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>`,
    "circle-dot": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="1"></circle></svg>`,
    "log-in": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>`,
    "gamepad-2": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" x2="10" y1="11" y2="11"></line><line x1="8" x2="8" y1="9" y2="13"></line><line x1="15" x2="15.01" y1="12" y2="12"></line><line x1="18" x2="18.01" y1="10" y2="10"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.59c-.08.83-.2 1.85-.2 3.41s.12 2.58.2 3.41A4 4 0 0 0 6.68 19h10.64a4 4 0 0 0 3.98-3.59c.08-.83.2-1.85.2-3.41s-.12-2.58-.2-3.41A4 4 0 0 0 17.32 5z"></path></svg>`,
    swords: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" x2="19" y1="19" y2="13"></line><line x1="16" x2="20" y1="16" y2="20"></line><line x1="19" x2="21" y1="21" y2="19"></line><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline><line x1="5" x2="9" y1="14" y2="18"></line><line x1="7" x2="4" y1="17" y2="20"></line><line x1="3" x2="5" y1="19" y2="21"></line></svg>`,
    trophy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`,
    target: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    "calendar-check": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>`,
    port: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 10.189V14"></path><path d="M12 2v3"></path><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"></path><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76"></path><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path></svg>`,
    zero: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"></rect><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"></path><path d="M6 18h.01"></path><path d="M10 14h.01"></path><path d="M15 6h.01"></path><path d="M18 9h.01"></path></svg>`,
    stroika: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="8" rx="1"></rect><path d="M17 14v7"></path><path d="M7 14v7"></path><path d="M17 3v3"></path><path d="M7 3v3"></path><path d="M10 14 2.3 6.3"></path><path d="m14 6 7.7 7.7"></path><path d="m8 6 8 8"></path></svg>`,
    shahta: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3L11 9.999"></path><path d="M15.973 4.027A13 13 0 0 0 5.902 2.373c-1.398.342-1.092 2.158.277 2.601a19.9 19.9 0 0 1 5.822 3.024"></path><path d="M16.001 11.999a19.9 19.9 0 0 1 3.024 5.824c.444 1.369 2.26 1.676 2.603.278A13 13 0 0 0 20 8.069"></path><path d="M18.352 3.352a1.205 1.205 0 0 0-1.704 0l-5.296 5.296a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l5.296-5.296a1.205 1.205 0 0 0 0-1.704z"></path></svg>`,
    business: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"></rect><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"></path><path d="M6 18h.01"></path><path d="M10 14h.01"></path><path d="M15 6h.01"></path><path d="M18 9h.01"></path></svg>`,
    gym: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"></path><path d="m2.5 21.5 1.4-1.4"></path><path d="m20.1 3.9 1.4-1.4"></path><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"></path><path d="m9.6 14.4 4.8-4.8"></path></svg>`,
    dance: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.79"></path><path d="M4 3h.01"></path><path d="M22 8h.01"></path><path d="M15 2h.01"></path><path d="M22 20h.01"></path><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"></path><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"></path><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path></svg>`,
  };

  const dom = {
    board: document.querySelector("#board"),
    toggleFav: document.querySelector("#toggleFav"),
    toggleEdit: document.querySelector("#toggleEdit"),
    toggleX2: document.querySelector("#toggleX2"),
    totalBp: document.querySelector("#totalBp"),
    manualBpCount: document.querySelector("#manualBpCount"),
    startBpInput: document.querySelector("#startBpInput"),
    addManualBp: document.querySelector("#addManualBpBtn"),
    removeManualBp: document.querySelector("#removeManualBpBtn"),
    resetManualBp: document.querySelector("#resetManualBtn"),
    addCategory: document.querySelector("#addCatBtn"),
    newDay: document.querySelector("#newDay"),
    actionDialog: document.querySelector("#actionDialog"),
    actionDialogForm: document.querySelector("#actionDialogForm"),
    actionDialogTitle: document.querySelector("#actionDialogTitle"),
    actionDialogIcon: document.querySelector("#actionDialogIcon"),
    actionDialogText: document.querySelector("#actionDialogText"),
    actionDialogField: document.querySelector("#actionDialogField"),
    actionDialogInput: document.querySelector("#actionDialogInput"),
    actionDialogSubmit: document.querySelector("#actionDialogSubmit"),
    actionDialogClose: document.querySelector("#actionDialogClose"),
    actionDialogCancel: document.querySelector("#actionDialogCancel"),
  };

  const savedState = readJson(STORAGE_KEYS.tasks, {});
  const dropIndicator = createElement("div", { className: "drop-indicator" });

  const appState = {
    tasks: [],
    categories: normalizeCategories(readJson(STORAGE_KEYS.categories, DEFAULT_CATEGORIES)),
    showFavoritesOnly: readJson(STORAGE_KEYS.favoriteFilter, false),
    editMode: false,
    x2Mode: Boolean(savedState.isX2Mode),
    initialBp: toNumber(savedState.initialBp),
    manualBp: toNumber(savedState.manualBp),
    draggingCategory: false,
  };

  boot();

  function boot() {
    syncControls();
    bindEvents();
    loadTaskConfig().then(initTasks);
  }

  async function loadTaskConfig() {
    try {
      const response = await fetch("tasks.json", { cache: "no-store" });
      if (!response.ok) throw new Error("tasks.json is not available");
      return await response.json();
    } catch {
      return FALLBACK_TASKS;
    }
  }

  function initTasks(defaultTasks) {
    appState.tasks = prepareTasks(Array.isArray(defaultTasks) ? defaultTasks : FALLBACK_TASKS);
    render();
  }

  function prepareTasks(defaultTasks) {
    const prepared = defaultTasks.map((task) => {
      const storedTask = savedState[task.id] || {};

      return {
        ...task,
        done: Boolean(storedTask.done),
        fav: Boolean(storedTask.fav),
        current: toNumber(storedTask.current),
        categoryId: storedTask.categoryId || DEFAULT_CATEGORY_ID,
        color: storedTask.color || COLOR_PALETTE[0],
      };
    });

    const savedOrder = Array.isArray(savedState._globalOrder) ? savedState._globalOrder : [];
    if (!savedOrder.length) return prepared;

    const initialIndex = new Map(prepared.map((task, index) => [String(task.id), index]));
    const orderIndex = new Map(savedOrder.map((id, index) => [String(id), index]));
    const fallbackOffset = savedOrder.length;

    return prepared.sort((a, b) => {
      const aIndex = orderIndex.has(String(a.id))
        ? orderIndex.get(String(a.id))
        : fallbackOffset + initialIndex.get(String(a.id));
      const bIndex = orderIndex.has(String(b.id))
        ? orderIndex.get(String(b.id))
        : fallbackOffset + initialIndex.get(String(b.id));

      return aIndex - bIndex;
    });
  }

  function bindEvents() {
    dom.startBpInput.addEventListener("input", () => {
      appState.initialBp = toNumber(dom.startBpInput.value);
      persistState();
      render();
    });

    dom.addManualBp.addEventListener("click", () => updateManualBp(getManualStep()));
    dom.removeManualBp.addEventListener("click", () => updateManualBp(-getManualStep()));

    dom.resetManualBp.addEventListener("click", () => {
      if (!appState.manualBp) return;
      if (!confirm("Сбросить ручной счетчик BP?")) return;

      appState.manualBp = 0;
      persistState();
      render();
    });

    dom.toggleX2.addEventListener("click", () => {
      appState.x2Mode = !appState.x2Mode;
      persistState();
      syncControls();
      render();
    });

    dom.toggleFav.addEventListener("click", () => {
      appState.showFavoritesOnly = !appState.showFavoritesOnly;
      localStorage.setItem(STORAGE_KEYS.favoriteFilter, JSON.stringify(appState.showFavoritesOnly));
      syncControls();
      render();
    });

    dom.toggleEdit.addEventListener("click", () => {
      appState.editMode = !appState.editMode;
      syncControls();
      render();
    });

    dom.addCategory.addEventListener("click", () => openActionDialog("category"));
    dom.newDay.addEventListener("click", () => openActionDialog("new-day"));

    dom.actionDialogClose.addEventListener("click", closeActionDialog);
    dom.actionDialogCancel.addEventListener("click", closeActionDialog);
    dom.actionDialog.addEventListener("click", (event) => {
      if (event.target === dom.actionDialog) closeActionDialog();
    });
    dom.actionDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeActionDialog();
    });
    dom.actionDialogForm.addEventListener("submit", handleActionDialogSubmit);

    document.addEventListener("dragstart", (event) => {
      if (event.target.classList?.contains("category")) {
        appState.draggingCategory = true;
      }
    });

    document.addEventListener("dragend", () => {
      appState.draggingCategory = false;
      removeDropIndicator();
    });
  }

  function openActionDialog(mode) {
    dom.actionDialog.dataset.mode = mode;
    dom.actionDialogInput.value = "";

    if (mode === "category") {
      dom.actionDialogTitle.textContent = "Добавить категорию";
      dom.actionDialogIcon.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M4 5h6l2 2h8v12H4V5Z"/><path d="M12 10v6M9 13h6"/></svg>';
      dom.actionDialogText.textContent = "Создайте новый раздел для группировки заданий.";
      dom.actionDialogField.hidden = false;
      dom.actionDialogSubmit.textContent = "Добавить";
      dom.actionDialogSubmit.classList.remove("is-danger");
    } else {
      dom.actionDialogTitle.textContent = "Начать новый день";
      dom.actionDialogIcon.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M4 6v5h5"/><path d="M5.2 16.5A8 8 0 1 0 6 7l-2 4"/><path d="M12 8v4l3 2"/></svg>';
      dom.actionDialogText.textContent =
        "Выполненные задачи и ручная корректировка BP будут сброшены. Начальное значение BP сохранится.";
      dom.actionDialogField.hidden = true;
      dom.actionDialogSubmit.textContent = "Сбросить прогресс";
      dom.actionDialogSubmit.classList.add("is-danger");
    }

    dom.actionDialog.showModal();
    requestAnimationFrame(() => dom.actionDialog.classList.add("is-visible"));

    if (mode === "category") {
      requestAnimationFrame(() => dom.actionDialogInput.focus());
    }
  }

  function closeActionDialog() {
    dom.actionDialog.classList.remove("is-visible");
    window.setTimeout(() => {
      if (dom.actionDialog.open) dom.actionDialog.close();
    }, 180);
  }

  function handleActionDialogSubmit(event) {
    event.preventDefault();
    const mode = dom.actionDialog.dataset.mode;

    if (mode === "category") {
      const title = dom.actionDialogInput.value.trim();
      if (!title) {
        dom.actionDialogInput.focus();
        dom.actionDialogField.classList.add("has-error");
        window.setTimeout(() => dom.actionDialogField.classList.remove("has-error"), 420);
        return;
      }

      appState.categories.push({ id: `cat_${Date.now()}`, title });
    } else if (mode === "new-day") {
      appState.tasks.forEach((task) => {
        task.done = false;
        task.current = 0;
      });
      appState.manualBp = 0;
    }

    persistState();
    render();
    closeActionDialog();
  }

  function updateManualBp(amount) {
    appState.manualBp += amount;
    persistState();
    render();
  }

  function syncControls() {
    dom.startBpInput.value = appState.initialBp > 0 ? appState.initialBp : "";
    dom.addManualBp.textContent = appState.x2Mode ? "+8" : "+4";
    dom.removeManualBp.textContent = appState.x2Mode ? "-8" : "-4";

    dom.toggleX2.classList.toggle("is-active", appState.x2Mode);
    dom.toggleFav.classList.toggle("is-active", appState.showFavoritesOnly);
    dom.toggleEdit.classList.toggle("is-active", appState.editMode);
  }

  function render() {
    removeDropIndicator();
    syncTotal();

    dom.board.replaceChildren(...appState.categories.map(renderCategory));
  }

  function syncTotal() {
    const taskTotal = appState.tasks.reduce((total, task) => {
      if (!task.done) return total;
      return total + toNumber(task.bp) * (appState.x2Mode ? 2 : 1);
    }, 0);

    const grandTotal = appState.initialBp + appState.manualBp + taskTotal;
    syncManualBpCount();
    const previousTotal = dom.totalBp.dataset.value;

    if (previousTotal === undefined) {
      dom.totalBp.dataset.value = grandTotal;
      renderOdometer(grandTotal);
      return;
    }

    if (Number(previousTotal) === grandTotal) return;

    dom.totalBp.dataset.value = grandTotal;
    animateTotal(previousTotal, grandTotal);
  }

  function syncManualBpCount() {
    if (!appState.manualBp) {
      dom.manualBpCount.textContent = "Без коррекции";
      dom.manualBpCount.classList.remove("is-negative");
      return;
    }

    const count = Math.abs(appState.manualBp / MANUAL_BP_STEP);
    const sign = appState.manualBp > 0 ? "+" : "−";
    dom.manualBpCount.textContent = `${sign}4 × ${formatManualCount(count)}`;
    dom.manualBpCount.classList.toggle("is-negative", appState.manualBp < 0);
  }

  function formatManualCount(count) {
    return Number.isInteger(count) ? String(count) : count.toFixed(1);
  }

  function animateTotal(previousTotal, nextTotal) {
    const oldValue = String(previousTotal);
    const newValue = String(nextTotal);
    const width = Math.max(oldValue.length, newValue.length);
    const oldDigits = oldValue.padStart(width, " ");
    const newDigits = newValue.padStart(width, " ");
    const direction = nextTotal >= Number(previousTotal) ? 1 : -1;

    const slots = [...newDigits].map((digit, index) => {
      const slot = createElement("span", {
        className: `odometer__slot${digit === " " ? " is-empty" : ""}`,
      });
      const reel = createElement("span", { className: "odometer__reel" });
      slot.style.setProperty("--delay", `${(width - index - 1) * 42}ms`);
      slot.classList.add(direction > 0 ? "is-rolling-up" : "is-rolling-down");
      const outgoing = createElement("span", {
        className: "odometer__digit odometer__digit--old",
        textContent: oldDigits[index],
      });
      const incoming = createElement("span", {
        className: "odometer__digit odometer__digit--new",
        textContent: digit,
      });
      reel.append(...(direction > 0 ? [outgoing, incoming] : [incoming, outgoing]));
      slot.append(reel);
      return slot;
    });

    dom.totalBp.replaceChildren(
      ...slots,
      createElement("span", { className: "odometer__unit", textContent: "BP" }),
    );

    slots[0]?.addEventListener(
      "animationend",
      () => {
        if (Number(dom.totalBp.dataset.value) === nextTotal) renderOdometer(nextTotal);
      },
      { once: true },
    );
  }

  function renderOdometer(value) {
    const slots = [...String(value)].map((digit) => {
      const slot = createElement("span", { className: "odometer__slot" });
      slot.append(createElement("span", { className: "odometer__digit", textContent: digit }));
      return slot;
    });
    dom.totalBp.replaceChildren(
      ...slots,
      createElement("span", { className: "odometer__unit", textContent: "BP" }),
    );
  }

  function renderCategory(category) {
    const categoryElement = createElement("article", {
      className: "category",
      draggable: true,
      dataset: { categoryId: category.id },
    });

    const header = createElement("header", { className: "category__header" });
    const title = createElement("span", {
      className: "category__title",
      textContent: category.title,
    });
    const line = createElement("span", { className: "category__line" });

    header.append(createSvgIcon("layout-dashboard", "icon--category"), title, line);

    if (appState.editMode && category.id !== DEFAULT_CATEGORY_ID) {
      header.append(renderRemoveCategoryButton(category));
    }

    const list = createElement("div", {
      className: "task-list",
      dataset: { categoryId: category.id },
    });

    getVisibleTasks(category.id).forEach((task) => list.append(renderTask(task)));

    list.addEventListener("dragover", (event) => handleTaskDragOver(event, list));
    list.addEventListener("drop", (event) => handleTaskDrop(event, category.id, list));

    categoryElement.addEventListener("dragstart", (event) => {
      if (event.target.closest(".task-card") || event.target.closest("button")) return;

      event.dataTransfer.setData("type", "category");
      event.dataTransfer.setData("categoryId", category.id);
      event.dataTransfer.effectAllowed = "move";
    });

    categoryElement.addEventListener("dragover", (event) => {
      if (appState.draggingCategory) event.preventDefault();
    });

    categoryElement.addEventListener("drop", (event) => handleCategoryDrop(event, category.id));
    categoryElement.append(header, list);

    return categoryElement;
  }

  function renderRemoveCategoryButton(category) {
    const button = createElement("button", {
      className: "button category__remove",
      textContent: "×",
      type: "button",
      title: "Удалить категорию",
    });

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!confirm('Удалить категорию? Задачи переместятся в "Общие".')) return;

      appState.tasks.forEach((task) => {
        if (task.categoryId === category.id) task.categoryId = DEFAULT_CATEGORY_ID;
      });
      appState.categories = appState.categories.filter((item) => item.id !== category.id);
      persistState();
      render();
    });

    return button;
  }

  function renderTask(task) {
    const taskElement = createElement("div", {
      className: getTaskClasses(task),
      draggable: !appState.editMode,
      dataset: { taskId: task.id },
    });

    if (task.color && task.color !== COLOR_PALETTE[0]) {
      taskElement.style.background = task.color;
    }

    taskElement.addEventListener("click", (event) => {
      if (isInteractiveClick(event)) return;

      task.done = !task.done;
      persistState();
      render();
    });

    taskElement.addEventListener("dragstart", (event) => {
      event.stopPropagation();
      event.dataTransfer.setData("type", "task");
      event.dataTransfer.setData("taskId", task.id);
      event.dataTransfer.effectAllowed = "move";
      taskElement.classList.add("is-dragging");
    });

    taskElement.addEventListener("dragend", () => {
      taskElement.classList.remove("is-dragging");
      removeDropIndicator();
    });

    taskElement.append(
      renderFavoriteButton(task),
      createSvgIcon(task.icon, "icon--task"),
      renderTaskContent(task),
      renderTaskBp(task),
      renderTaskCounter(task),
    );

    return taskElement;
  }

  function renderFavoriteButton(task) {
    const button = createElement("button", {
      className: `task-card__favorite${task.fav ? " is-active" : ""}`,
      type: "button",
      title: "Добавить в избранное",
      innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>`,
    });

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      task.fav = !task.fav;
      persistState();
      render();
    });

    return button;
  }

  function renderTaskContent(task) {
    const content = createElement("div", { className: "task-card__content" });
    const title = createElement("div", {
      className: "task-card__title",
      textContent: task.title,
    });

    content.append(title);

    if (appState.editMode) {
      content.append(renderCategorySelect(task), renderColorPicker(task));
    }

    return content;
  }

  function renderCategorySelect(task) {
    const select = createElement("select", { className: "category-select" });

    appState.categories.forEach((category) => {
      const option = createElement("option", {
        value: category.id,
        textContent: category.title,
      });
      option.selected = category.id === task.categoryId;
      select.append(option);
    });

    select.addEventListener("click", (event) => event.stopPropagation());
    select.addEventListener("change", (event) => {
      task.categoryId = event.target.value;
      persistState();
      render();
    });

    return select;
  }

  function renderColorPicker(task) {
    const picker = createElement("div", { className: "color-picker" });

    COLOR_PALETTE.forEach((color) => {
      const swatch = createElement("button", {
        className: `color-picker__item${task.color === color ? " is-active" : ""}`,
        type: "button",
        title: color,
      });
      swatch.style.backgroundColor = color;

      swatch.addEventListener("click", (event) => {
        event.stopPropagation();
        task.color = color;
        persistState();
        render();
      });

      picker.append(swatch);
    });

    return picker;
  }

  function renderTaskBp(task) {
    return createElement("div", {
      className: "task-card__bp",
      textContent: `+${toNumber(task.bp) * (appState.x2Mode ? 2 : 1)} BP`,
    });
  }

  function renderTaskCounter(task) {
    const counter = createElement("div", { className: "task-card__counter" });
    if (!task.steps) return counter;

    const decrement = createElement("button", {
      className: "button task-card__counter-button",
      textContent: "-",
      type: "button",
    });
    const progress = createElement("div", {
      className: "task-card__progress",
      textContent: `${toNumber(task.current)}/${task.steps}`,
    });
    const increment = createElement("button", {
      className: "button task-card__counter-button",
      textContent: "+",
      type: "button",
    });

    decrement.addEventListener("click", (event) => {
      event.stopPropagation();
      task.current = Math.max(0, toNumber(task.current) - 1);
      persistState();
      render();
    });

    increment.addEventListener("click", (event) => {
      event.stopPropagation();
      task.current = Math.min(task.steps, toNumber(task.current) + 1);
      persistState();
      render();
    });

    counter.append(decrement, progress, increment);
    return counter;
  }

  function handleTaskDragOver(event, list) {
    event.preventDefault();
    if (appState.draggingCategory) return;

    const nextElement = getDragAfterElement(list, event.clientY);
    if (dropIndicator.parentNode === list && dropIndicator.nextElementSibling === nextElement) return;

    if (!nextElement) {
      list.append(dropIndicator);
      return;
    }

    list.insertBefore(dropIndicator, nextElement);
  }

  function handleTaskDrop(event, targetCategoryId, list) {
    event.preventDefault();
    removeDropIndicator();

    if (event.dataTransfer.getData("type") !== "task") return;

    const taskId = event.dataTransfer.getData("taskId");
    const taskIndex = findTaskIndex(taskId);
    if (taskIndex < 0) return;

    const [movedTask] = appState.tasks.splice(taskIndex, 1);
    const nextElement = getDragAfterElement(list, event.clientY);

    movedTask.categoryId = targetCategoryId;

    if (!nextElement) {
      appState.tasks.push(movedTask);
    } else {
      const nextIndex = findTaskIndex(nextElement.dataset.taskId);
      appState.tasks.splice(nextIndex, 0, movedTask);
    }

    persistState();
    render();
  }

  function handleCategoryDrop(event, targetCategoryId) {
    event.preventDefault();

    if (event.dataTransfer.getData("type") !== "category") return;

    const draggedCategoryId = event.dataTransfer.getData("categoryId");
    if (!draggedCategoryId || draggedCategoryId === targetCategoryId) return;

    const fromIndex = appState.categories.findIndex((category) => category.id === draggedCategoryId);
    const toIndex = appState.categories.findIndex((category) => category.id === targetCategoryId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [movedCategory] = appState.categories.splice(fromIndex, 1);
    appState.categories.splice(toIndex, 0, movedCategory);

    persistState();
    render();
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".task-card:not(.is-dragging)")];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }

        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null },
    ).element;
  }

  function getVisibleTasks(categoryId) {
    return appState.tasks.filter((task) => {
      const isCurrentCategory = task.categoryId === categoryId;
      const matchesFilter = !appState.showFavoritesOnly || task.fav;
      return isCurrentCategory && matchesFilter;
    });
  }

  function persistState() {
    const nextState = {
      initialBp: appState.initialBp,
      manualBp: appState.manualBp,
      isX2Mode: appState.x2Mode,
      _globalOrder: appState.tasks.map((task) => task.id),
    };

    appState.tasks.forEach((task) => {
      nextState[task.id] = {
        done: task.done,
        fav: task.fav,
        current: task.current,
        categoryId: task.categoryId,
        color: task.color,
      };
    });

    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(nextState));
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(appState.categories));
  }

  function createSvgIcon(icon = "circle-dot", modifier = "") {
    const wrapper = createElement("span", {
      className: `icon ${modifier}`.trim(),
      ariaHidden: "true",
    });

    const svgText = resolveSvg(icon) || ICON_LIBRARY["circle-dot"];
    wrapper.innerHTML = sanitizeSvg(svgText) || ICON_LIBRARY["circle-dot"];

    return wrapper;
  }

  function resolveSvg(icon) {
    if (!icon) return null;
    if (ICON_LIBRARY[icon]) return ICON_LIBRARY[icon];

    if (typeof icon === "string" && icon.trim().startsWith("<svg")) {
      return icon;
    }

    return null;
  }

  function sanitizeSvg(svgText) {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg || doc.querySelector("parsererror")) return null;

    svg.querySelectorAll("script, foreignObject, iframe, object, embed").forEach((node) => node.remove());

    svg.querySelectorAll("*").forEach((node) => {
      [...node.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value.toLowerCase();

        if (name.startsWith("on") || value.includes("javascript:")) {
          node.removeAttribute(attr.name);
        }
      });
    });

    return svg.outerHTML;
  }

  function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    Object.entries(options).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (key === "className") {
        element.className = value;
        return;
      }

      if (key === "textContent") {
        element.textContent = value;
        return;
      }

      if (key === "dataset") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
        return;
      }

      if (key === "ariaHidden") {
        element.setAttribute("aria-hidden", value);
        return;
      }

      element[key] = value;
    });

    return element;
  }

  function normalizeCategories(categories) {
    const list = Array.isArray(categories) && categories.length ? categories : DEFAULT_CATEGORIES;
    const hasDefault = list.some((category) => category.id === DEFAULT_CATEGORY_ID);

    return hasDefault ? [...list] : [...DEFAULT_CATEGORIES, ...list];
  }

  function removeDropIndicator() {
    if (dropIndicator.parentNode) {
      dropIndicator.parentNode.removeChild(dropIndicator);
    }
  }

  function getTaskClasses(task) {
    return ["task-card", task.done && "is-done"].filter(Boolean).join(" ");
  }

  function getManualStep() {
    return MANUAL_BP_STEP * (appState.x2Mode ? 2 : 1);
  }

  function findTaskIndex(taskId) {
    return appState.tasks.findIndex((task) => String(task.id) === String(taskId));
  }

  function isInteractiveClick(event) {
    return Boolean(event.target.closest("button, select, .color-picker"));
  }

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function toNumber(value) {
    return Number.parseInt(value, 10) || 0;
  }
})();
