<script>
  import { modal, setup, open } from "../actions/modal.js";
  import { fly, fade } from "svelte/transition";
  import Button from "../components/Button.svelte";
  import TextButton from "../components/TextButton.svelte";
  import { item } from "./store.js";
  let book = {navigation: { current: {}}};
  $: if ($item.id && $item.id !== book.id) {
    updateBook($item.id);
  }
  async function updateBook(id) {
    book = {navigation: { current: {}}}
    const response = await fetch(`/api/book?url=${encodeURIComponent(id)}`);
    book = await response.json();
    return book
  }
</script>

<style>
  .Modal[hidden] [role="document"] {
    opacity: 0;
    transform: translateX(-100%);
  }
  .Modal:not([hidden]) [role="document"] {
    background-color: rgba(255, 255, 255, 0.95);
    -webkit-backdrop-filter: blur(7px) saturate(50%);
    backdrop-filter: blur(7px) saturate(50%);
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 14px -2px rgba(0, 0, 0, 0.15);
    z-index: 10;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
  }
  @supports (backdrop-filter: blur(7px)) or (-webkit-backdrop-filter: blur(7px)) {
    .Modal:not([hidden]) [role="document"] {
      background-color: rgba(255, 255, 255, 0.75);
      -webkit-backdrop-filter: blur(7px) saturate(50%);
      backdrop-filter: blur(7px) saturate(50%);
    }
  }
  .Modal [role="document"] {
    position: relative;
  }
  .Closer {
    position: absolute;
    top: 0.5rem;
    left: 1rem;
    line-height: 1;
    font-size: 1.25rem;
    transform: translateY(-2px);
    display: inline-block;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    text-transform: uppercase;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    border: none;
    background-color: transparent;
    color: var(--rc-dark);
    height: 24px;
    width: 24px;
    margin: 0;
    padding: 0;
    border-radius: 9999px;
  }
  .Closer:focus {
    outline: solid transparent;
    background-color: #f5f5f5;
    box-shadow: 0 0 1px 1px var(--rc-light), inset 0 0 1px 1px var(--rc-light);
  }
  h1 {
    text-align: center;
    font-size: 3rem;
    margin-top: 3rem;
    color: var(--medium);
    font-weight: 600;
  }
  ol {
    margin: 1rem auto;
    min-width: 250px;
    max-width: 450px;
    width: 100%;
  }
  ol a {
    text-decoration: none;
    display: block;
    padding: 0.25rem 1rem;
    border-radius: 0;
  }
  ol a:hover {
    background-color: var(--hover);
    color: var(--light);
  }
  ol a:focus {
    background-color: var(--rc-lighter);
    color: black;
  }
  ol li {
    list-style: none;
  }
  .read {
    background-color: var(--rc-dark);
    color: var(--light);
  }
  .read:hover {
    background-color: var(--hover);
    color: var(--light);
  }
</style>

<div class="Modal" use:setup id="item-modal" hidden>

  {#if $modal && $modal.id === 'item-modal'}
    <div role="document" transition:fade={{ duration: 100 }}>
      <button
        type="Button"
        data-close-modal
        class="Closer">
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <h1>{$item.name}</h1>
      <ol>
        <li>
          <a class:item={true} class:read={true} href={book.navigation.current.path} data-close-modal>
            {book.position ? 'Continue' : 'Read'}
          </a>
        </li>
        <li>
          <a href="{$item.url}metadata">Metadata</a>
        </li>
        <li>
          <a href="{$item.url}contents">Contents</a>
        </li>
        <li>
          <a href="{$item.url}annotations">Annotations</a>
        </li>
      </ol>
    </div>
  {/if}
</div>
