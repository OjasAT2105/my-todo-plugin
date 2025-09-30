import { useBlockProps } from "@wordpress/block-editor";
import { useState } from "react";

export default function Edit({ attributes, setAttributes }) {
  const { lists = [] } = attributes;
  const [inputValue, setInputValue] = useState("");
  const blockProps = useBlockProps();

  // Add a new todo
  const addItem = () => {
    const value = inputValue.trim();
    if (!value) return;
    const next = [...lists, { text: value, done: false }];
    setAttributes({ lists: next });
    setInputValue("");
  };

  // Remove a todo
  const removeItem = (index) => {
    const next = lists.filter((_, i) => i !== index);
    setAttributes({ lists: next });
  };

  // Toggle done/undone
  const toggleItem = (index) => {
    const next = lists.map((item, i) =>
      i === index ? { ...item, done: !item.done } : item
    );
    setAttributes({ lists: next });
  };

  // Add item on Enter key
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div {...blockProps}>
      <div className="todo-controls">
        <input
          type="text"
          placeholder="Add a todo..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button onClick={addItem}>Add</button>
      </div>

      <ul className="todo-list">
        {lists.map((item, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleItem(index)}
              />
              <span>{item.text}</span>
            </label>
            <button onClick={() => removeItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
