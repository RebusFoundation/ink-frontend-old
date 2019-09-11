<script>
  // your script goes here
  export let navigation = {};
</script>

<style>
  .Navbar {
    display: block;
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
    z-index: 2;
    line-height: 1;
    padding: 0.25rem var(--reader-left-margin);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .Navbar-link {
    font-size: 1.25rem;
    line-height: 1rem;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    text-transform: uppercase;
    color: #32a5a5;
    color: var(--rc-dark);
  }
  .Navbar-title {
    text-transform: uppercase;
    font-size: 0.65rem;
    font-weight: 400;
    color: #555;
    color: var(--medium);
    flex: 1 1 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="Navbar">
  {#if navigation.previous}
    <a
      href="/reader{navigation.previous}"
      class="Navbar-link"
      aria-label="Previous">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </a>
  {:else}
    <span />
  {/if}
  <div class="Navbar-title">
    <slot />
  </div>
  {#if navigation.next}
    <a href="/reader{navigation.next}" class="Navbar-link" aria-label="Next">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </a>
  {:else}
    <span />
  {/if}
</div>
