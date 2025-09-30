import { store } from "@wordpress/interactivity";

// Create a store called "todo-list"
store("todo-list", ({ state }) => ({
  state: {
    justToggledIndex: -1, // remembers which item was just toggled
  },
  actions: {
    // Load todos from localStorage
    load: ({ context }) => {
      const key = context?.storageKey;
      if (!key) return;

      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            // replace the current list with saved list
            context.lists.splice(0, context.lists.length, ...parsed);
          }
        }
        localStorage.setItem(key, JSON.stringify(context.lists));
      } catch {
        // ignore errors
      }
    },

    // Toggle todo done/undone
    toggle: ({ event, context }) => {
      const index = parseInt(event?.target?.dataset?.index ?? -1, 10);
      if (Number.isNaN(index) || index < 0) return;

      // flip the "done" state
      context.lists[index].done = !context.lists[index].done;
      context.save();

      // save to localStorage
      try {
        const key = context?.storageKey;
        if (key) {
          localStorage.setItem(key, JSON.stringify(context.lists));
        }
      } catch {}

      // briefly highlight the toggled item
      state.justToggledIndex = index;
      setTimeout(() => {
        state.justToggledIndex = -1;
      }, 300);
    },
  },
}));
