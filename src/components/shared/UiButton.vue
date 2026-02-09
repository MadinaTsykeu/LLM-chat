<template>
  <button
    class="ui-btn"
    :class="[`ui-btn-${variant}`, `ui-btn-${size}`, { 'ui-btn--icon-only': onlyIcon }]"
    :type="type"
    :disabled="disabled"
  >
    <span v-if="$slots.left" class="ui-btn__icon ui-btn__icon--left" aria-hidden="true">
      <slot name="left" />
    </span>
    <span v-if="$slots.default" class="ui-btn__text">
      <slot />
    </span>
    <span v-if="$slots.right" class="ui-btn__icon ui-btn__icon--right" aria-hidden="true">
      <slot name="right" />
    </span>
  </button>
</template>

<script setup lang="ts">
type TButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';
type TButtonSize = 'sm' | 'df';
type TButtonType = 'button' | 'submit' | 'reset';

interface IButtonProps {
  variant?: TButtonVariant;
  size?: TButtonSize;
  type?: TButtonType;
  disabled?: boolean;
  onlyIcon?: boolean;
}

withDefaults(defineProps<IButtonProps>(), {
  variant: 'primary',
  size: 'sm',
  type: 'button',
  disabled: false,
  onlyIcon: false,
});
</script>

<style scoped>
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--btn-radius);
  padding-left: var(--btn-padding-x);
  padding-right: var(--btn-padding-x);
  border: 1px solid transparent;
  transition:
    transform 0.12s ease,
    filter 0.12s ease;
  cursor: pointer;
}

.ui-btn-primary {
  background:
    var(--btn-primary-bg) padding-box,
    var(--btn-primary-border) border-box;
  box-shadow: var(--btn-primary-shadow);
  color: var(--neutral-100);
}

.ui-btn-secondary {
  background: var(--btn-secondary-bg);
  border: 1px solid var(--btn-secondary-border);
  box-shadow: var(--btn-secondary-shadow);
  color: var(--neutral-800);
}

.ui-btn-tertiary {
  background: var(--btn-tertiary-bg);
  box-shadow: none;
  color: var(--primary-100);
}

.ui-btn-sm {
  height: var(--btn-height-sm);
  padding: var(--btn-padding-y-sm);
  gap: var(--btn-gap-sm);
}

.ui-btn-df {
  height: var(--btn-height-df);
  padding-top: var(--btn-padding-y-df);
  padding-bottom: var(--btn-padding-y-df);
  gap: var(--btn-gap-df);
}

.ui-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-btn__text {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  line-height: 115%;
}

.ui-btn--icon-only.ui-btn-df {
  width: var(--btn-height-df);
  padding-left: 0;
  padding-right: 0;
  gap: 0;
}

.ui-btn--icon-only.ui-btn-sm {
  width: var(--btn-height-sm);
  padding: 0;
  gap: 0;
}

.ui-btn:hover:not(:disabled) {
  filter: brightness(1.2);
}

.ui-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.ui-btn-icon {
  background: transparent;
  box-shadow: none;
}

.ui-btn-icon:hover:not(:disabled) {
  background: var(--btn-secondary-bg);
  border: 1px solid var(--btn-secondary-border);
  box-shadow: var(--btn-secondary-shadow);
  color: var(--neutral-800);
}
</style>
