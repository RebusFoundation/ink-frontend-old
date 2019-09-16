<script>
  // your script goes here
  export let primary = false;
  export let disabled = null;
  export let href = false;
  export let click = () => {};
  export let noClose = null;
  export let warning = false;
</script>

<style>
  /*
Text Button

Basic text button component.

Markup:
<button class="TextButton {{modifier_class}}">This is a Text Button</button>

.TextButton:hover - hover state
.TextButton:focus - focus state
.TextButton:active - active state
.TextButton--disabled - disabled state (also styles the `disabled` attribute)
.TextButton--disabled:focus - disabled state (also styles the `disabled` attribute)
.TextButton--warning - only click this if you really know what you're doing
.TextButton--toggled - toggle state is on

StyleGuide 6.TextButton

*/

  .TextButton {
    font-family: var(--sans-fonts);
    font-weight: 400;
    flex: 0 1 auto;
    line-height: 1.2;

    display: inline-block;
    padding: 5px 5px 4px;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;

    color: var(--link);
    border: none;
    background-color: transparent;

    -ms-touch-action: manipulation;
    touch-action: manipulation;
    text-transform: uppercase;
    font-size: 0.65rem;
    border-bottom: solid 3px transparent;
  }
  .TextButton:hover {
    color: var(--hover);
    border-bottom: solid 3px var(--link);
    text-decoration: none;
    box-shadow: none;
  }

  .TextButton:active {
    color: var(--active);
  }

  .TextButton:focus {
    text-decoration: none;
    background-color: var(--link);
    color: white;
    border-radius: 0.1rem;
  }

  .TextButton[disabled],
  .TextButton[disabled]:hover {
    color: var(--disabled);
    cursor: not-allowed;
  }
  .TextButton[disabled]:focus {
    color: white;
    border-color: var(--disabled);
    background-color: var(--disabled);
    box-shadow: inset 0 0px 2px 0 rgba(0, 66, 98, 0.15);
  }

  .TextButton:focus {
    outline: solid transparent;
  }
  .TextButton.warning {
    color: var(--error);
  }
</style>

{#if href}
  <a
    class="TextButton"
    class:primary
    class:warning
    {disabled}
    {href}
    on:click={click}
    data-no-close={noClose}>
    <slot />
  </a>
{:else}
  <button
    class="TextButton"
    class:primary
    class:warning
    {disabled}
    on:click={click}
    data-no-close={noClose}
    type="Button">
    <slot />
  </button>
{/if}
