<script>
  // your script goes here
  import { modal, setup, open } from "../src/actions/modal.js";
  import { popper } from "../src/actions/popper.js";
  import { fly, fade } from "svelte/transition";
  let popperButton;
</script>

<style>
  /* your styles go here */
  .Modal[hidden] [role="document"] {
    opacity: 0;
    transform: translateX(-100%);
  }
  .Modal:not([hidden]) [role="document"] {
    background-color: #fff;
    max-width: 95vw;
    max-height: 100vh;
    min-width: 300px;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 14px -2px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
  .Modal2 [role="document"] {
    background-color: #f0f0f0;
    color: black;
    --popper-arrow-color: #f0f0f0;
  }
</style>

<!-- markup (zero or more items) goes here -->

<button use:open={{ id: 'test-modal' }}>Click Me!</button>
<button
  bind:this={popperButton}
  use:open={{ id: 'test-modal2', caller: popperButton }}>
  Click Me!
</button>

<div class="Modal" use:setup id="test-modal" hidden>
  {#if $modal && $modal.id === 'test-modal'}
    <div role="document" transition:fly={{ y: 200, duration: 400 }}>
      <h1>Modal Content.</h1>
      <p>
        <input type="text" />
        <button type="Button" data-close-modal>Close</button>
      </p>
    </div>
  {/if}
</div>
<div class="Modal2" use:setup id="test-modal2">
  {#if $modal && $modal.id === 'test-modal2'}
    <div
      role="document"
      transition:fade={{ duration: 400 }}
      use:popper={{ ref: popperButton, arrow: true }}>
      <div class="popper__arrow" x-arrow="" />
      <h1>Modal Content.</h1>
      <p>
        <input type="text" data-autofocus />
        <button type="Button" data-close-modal>Close</button>
      </p>
    </div>
  {/if}
</div>
