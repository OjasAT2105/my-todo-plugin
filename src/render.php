<!-- Dynamic render.php for displaying lists/tasks -->
<div data-wp-interactive="todo-list" <?php echo wp_interactivity_data_wp_context([
    'lists' => $attributes['lists'] ?? [],
    'storageKey' => isset( $attributes['blockId'] ) ? 'myTodo:' . $attributes['blockId'] : null,
]); ?>>
  <div data-wp-init="actions.load"></div>
  <ul class="todo-list">
    <?php foreach ($attributes['lists'] as $idx => $todo): ?>
      <li data-wp-class--just-toggled="state.justToggledIndex === <?php echo $idx; ?>">
        <label>
          <input type="checkbox"
            data-wp-on--click="actions.toggle"
            data-index="<?php echo $idx; ?>"
            data-wp-bind--checked="context.lists[<?php echo $idx; ?>].done" />
          <span data-wp-class--is-done="context.lists[<?php echo $idx; ?>].done">
            <?php echo esc_html($todo['text']); ?>
          </span>
        </label>
      </li>
    <?php endforeach; ?>
  </ul>
</div>
