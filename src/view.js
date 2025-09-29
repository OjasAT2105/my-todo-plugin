import { store } from "@wordpress/interactivity";

store("todo-list", ({ state }) => ({
  state: {
    justToggledIndex: -1,
  },
  actions: {
    load: ({ context }) => {
      const key = context?.storageKey;
      if (!key) return;
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            context.lists.splice(0, context.lists.length, ...parsed);
          }
        }
        localStorage.setItem(key, JSON.stringify(context.lists));
      } catch {}
    },
    toggle: ({ event, context }) => {
      const index = parseInt(event?.target?.dataset?.index ?? -1, 10);
      if (Number.isNaN(index) || index < 0) return;
      context.lists[index].done = !context.lists[index].done;
      context.save();
      try {
        const key = context?.storageKey;
        if (key) localStorage.setItem(key, JSON.stringify(context.lists));
      } catch {}
      state.justToggledIndex = index;
      setTimeout(() => { state.justToggledIndex = -1; }, 300);
    },
  },
}));
