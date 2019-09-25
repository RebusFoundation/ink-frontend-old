<script>
  import { modal, setup, open, opener } from "../actions/modal.js";
  import { fly, fade } from "svelte/transition";
  import TextButton from "../components/TextButton.svelte"
  import Button from "../components/Button.svelte"
  import Editor from "../components/Editor.svelte"
  import DOMPurify from 'dompurify'
  import {remove as deleter} from "../api/remove.js"
  const purifyConfig = {
    KEEP_CONTENT: false,
    RETURN_DOM: true,
    FORBID_TAGS: ['style', 'link'],
    FORBID_ATTR: ['style']
  }
  let note
  let remove
  function removeHighlight () {
    document.querySelectorAll(`reader-highlight[data-note-id="${note.id}"]`)
          .forEach(highlight => highlight.replaceWith(...highlight.childNodes))
   // Need to actually delete
   deleter(note)
  }
  let blockquote
  $: if (note) {
    let dom = DOMPurify.sanitize(note.content, purifyConfig)
    blockquote = dom.querySelector('blockquote').outerHTML
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
  .Chapter {
    font-family: var(--reader-font-family);
  }
  .NoteModal {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    max-height: 100vh;
    padding: 32px;
    min-width: var(--reader-min-column-width);
    max-width: var(--reader-max-column-width);
    margin: 0 auto;
    position: relative;
  }
  .NoteModal .Chapter {
    border-left: 0.25rem solid var(--rc-darker);
    padding: 0.25rem 0.5rem;
  }
  .Deleter {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

<svelte:window
    on:highlight-selected={(event => {
      note = event.detail.note
      note.loading = true
      opener({id: 'note-modal'})
    })} />

<div class="Modal" use:setup id="note-modal" hidden>

  {#if $modal && $modal.id === 'note-modal'}
    <div role="document" transition:fade={{ duration: 100 }}>
      <button type="Button" data-close-modal class="Closer" data-autofocus>
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
      <div class="NoteModal">
{#if remove}
  <p>
    Are you sure you want to remove this highlight? This action cannot be undone.
  </p>
          <Button click={(event) => {
          remove = false
        }} noClose={true}>No, keep the highlight</Button>
          <TextButton click={(event) => {
          removeHighlight()
        }} warning close={true}>Yes, remove Highlight</TextButton>

{:else}
          <span class="Deleter"><TextButton click={(event) => {
          remove = true
        }} warning noClose={true}>Delete Highlight</TextButton></span>

        <div class="Chapter">
        {@html blockquote}</div>
        <Editor {note} />
{/if}
      </div>
    </div>
  {/if}
</div>