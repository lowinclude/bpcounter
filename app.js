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
  };

  const dom = {
    board: document.querySelector("#board"),
    toggleFav: document.querySelector("#toggleFav"),
    toggleEdit: document.querySelector("#toggleEdit"),
    toggleX2: document.querySelector("#toggleX2"),
    totalBp: document.querySelector("#totalBp"),
    startBpInput: document.querySelector("#startBpInput"),
    addManualBp: document.querySelector("#addManualBpBtn"),
    removeManualBp: document.querySelector("#removeManualBpBtn"),
    resetManualBp: document.querySelector("#resetManualBtn"),
    addCategory: document.querySelector("#addCatBtn"),
    newDay: document.querySelector("#newDay"),
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

    dom.addCategory.addEventListener("click", () => {
      const title = prompt("Название новой категории:")?.trim();
      if (!title) return;

      appState.categories.push({ id: `cat_${Date.now()}`, title });
      persistState();
      render();
    });

    dom.newDay.addEventListener("click", () => {
      const message = "Сбросить ежедневный прогресс?\n(Очистит выполненные задачи и ручной счетчик)";
      if (!confirm(message)) return;

      appState.tasks.forEach((task) => {
        task.done = false;
        task.current = 0;
      });
      appState.manualBp = 0;
      persistState();
      render();
    });

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

  function updateManualBp(amount) {
    appState.manualBp += amount;
    persistState();
    render();
  }

  function syncControls() {
    dom.startBpInput.value = appState.initialBp > 0 ? appState.initialBp : "";
    dom.addManualBp.textContent = appState.x2Mode ? "+8 BP" : "+4 BP";
    dom.removeManualBp.textContent = appState.x2Mode ? "-8 BP" : "-4 BP";

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
    const previousTotal = dom.totalBp.dataset.value;

    if (previousTotal === undefined) {
      dom.totalBp.dataset.value = grandTotal;
      dom.totalBp.textContent = `${grandTotal} BP`;
      return;
    }

    if (Number(previousTotal) === grandTotal) return;

    dom.totalBp.dataset.value = grandTotal;
    animateTotal(previousTotal, grandTotal);
  }

  function animateTotal(previousTotal, nextTotal) {
    const outgoing = createElement("span", {
      className: "score-badge__value score-badge__value--outgoing",
      textContent: `${previousTotal} BP`,
    });
    const incoming = createElement("span", {
      className: "score-badge__value score-badge__value--incoming",
      textContent: `${nextTotal} BP`,
    });

    dom.totalBp.classList.remove("is-flipping");
    dom.totalBp.replaceChildren(outgoing, incoming);
    void dom.totalBp.offsetWidth;
    dom.totalBp.classList.add("is-flipping");

    incoming.addEventListener(
      "animationend",
      () => {
        if (Number(dom.totalBp.dataset.value) !== nextTotal) return;
        dom.totalBp.classList.remove("is-flipping");
        dom.totalBp.textContent = `${nextTotal} BP`;
      },
      { once: true },
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
      textContent: "★",
      type: "button",
      title: "Добавить в избранное",
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
