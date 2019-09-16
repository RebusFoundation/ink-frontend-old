<script>
  import { book as item, current } from "../stores/book.js";
  import { open } from "../actions/modal.js";
  export let author;
  export let resources;
  export let tags;
  export let id;
  export let url;
  export let cover;
  export let name;
  export let json;
  export let readingOrder;
  export let type;
  export let editor;
  export let published;
  export let updated;
  export let readerId;
  export let navigation;
  export let layout = "covers";
  export let translator;
  export let illustrator;
  export let contributor;
</script>

<style>
  .LibraryItem {
    position: relative;
    font-family: var(--sans-fonts);
  }
  .LibraryItem > .covers {
    display: grid;
  }
  @keyframes withinPop {
    0% {
      box-shadow: 0 0 0 5px rgb(228, 255, 254, 0.2);
      background-color: rgb(228, 255, 254, 0.2);
    }
    50% {
      background-color: rgb(228, 255, 254, 0.8);
      box-shadow: 0 0 0 5px rgb(228, 255, 254, 0.8);
    }
    100% {
      box-shadow: 0 0 0 5px var(--rc-lighter);
      background-color: var(--rc-lighter);
    }
  }
  .LibraryItem > .covers:focus-within {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 5px var(--rc-lighter);
    animation: withinPop 0.25s ease-in-out;
  }
  .list {
    display: grid;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 0.25rem;
    padding-bottom: 0.5rem;
  }

  .BookCard-group {
    margin-right: 0;
  }

  .BookCard-icon {
    font-size: 0.75rem;
    text-align: center;
    line-height: 1.25;
    text-transform: uppercase;
    color: #999;
    background-color: #f0f0f0;
    display: block;
    width: 100%;
    max-height: none;
    object-fit: cover;
    object-position: top left;
    width: 6rem;
    height: 8.5rem;
    border-radius: var(--border-radius);
  }
  .BookCard-title {
    margin: 0.25rem 0;
    padding: 0;
    font-weight: 750;
    font-size: 0.7rem;
    line-height: 1;
  }

  .BookCard-attribution {
    font-weight: 400;
    font-style: italic;
    text-decoration: none;
    color: #666;
  }
  .BookCard-attributionLabel {
    font-weight: 300;
    color: #888;
  }
  a.BookCard-link {
    text-decoration: none;
    font-weight: inherit;
    color: var(--dark);
    display: inline-block;
  }
  .BookCard-paragraph {
    line-height: 0.75rem;
    font-weight: 300;
    margin-top: 0.25rem;
    font-size: 0.65rem;
    --local-font-size: 0.65rem;
  }
  .BookCard-paragraph--tags {
    margin-top: 0.5rem;
  }
  .square .BookCard-group {
    display: none;
  }
  .square .BookCard-icon {
    width: 100%;
    height: 6rem;
    border-radius: 0px;
  }
  .square .BookCard-overlay {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.62);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity cubic-bezier(0.075, 0.82, 0.165, 1) 250ms;
    border-radius: 0;
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .square:hover .BookCard-overlay,
  .square .BookCard-overlay:focus {
    opacity: 1;
    pointer-events: all;
  }
  .list .BookCard-icon {
    display: none;
  }
  .list .BookCard-paragraph {
    padding: 0;
    margin: 0;
  }
  @keyframes outlinePop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  a:focus {
    background-color: var(--rc-lighter);
    box-shadow: 0 0 0 5px var(--rc-lighter);
    outline: solid transparent;
    animation: outlinePop 0.25s ease-in-out;
  }
</style>

<!-- markup (zero or more items) goes here -->
<div class="LibraryItem">
  <div class={layout}>
    <a
      href={url}
      class="icon-link"
      use:open={{ id: 'item-modal' }}
      on:click={() => {
        item.set({ name, id, url, cover });
        current.set('');
      }}>
      <img class="BookCard-icon" alt={'Cover for ' + name} src={cover} />
    </a>
    {#if layout === 'square'}
      <a href={url} class="BookCard-overlay">{name}</a>
    {/if}
    <div class="BookCard-group">
      <h4 class="BookCard-title">
        <a href={url} class="BookCard-link">{name}</a>
      </h4>
      <p class="BookCard-paragraph">
        {#each author as attribution}
          <!-- content here -->
          <span class="BookCard-attribution">{attribution.name}</span>
        {:else}
          <!-- empty list -->
        {/each}
      </p>
    </div>
  </div>
</div>
