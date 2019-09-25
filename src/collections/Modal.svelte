<script>
  import { modal, setup, open } from "../actions/modal.js";
  import { fly, fade } from "svelte/transition";
  import Button from "../components/Button.svelte";
  import TextButton from "../components/TextButton.svelte";
  import { onMount } from "svelte";
  import { collections } from "./store.js";
  import { create } from "../api/create.js";
  import { removeMany } from "../api/remove.js";
  import { stores, goto } from "@sapper/app";
  const { page } = stores();
  let current;
  $: if ($page.params && $page.params.collection) {
    current = $page.params.collection;
  } else {
    current = "Uploads";
  }
  let creating;
  let deleting;
  let name = "";
  function update() {
    fetch(`/recent.json`)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return {}
        }
      })
      .then(json => {
        collections.set(json.tags);
      });
  }
  onMount(async () => {
    if ($collections.length === 0) {
      update();
    }
  });
  function submitForm(event) {
    event.preventDefault();
    const tag = {
      type: "reader:Tag",
      tagType: "reader:Stack",
      name
    };
    create(tag).then(() => {
      name = "";
      creating = false;
      collections.update(list => [tag, ...list]);
      return update();
    });
  }
  function submitDelete(event) {
    event.preventDefault();
    const form = event.target;
    const tags = Array.from(form.querySelectorAll("input:checked")).map(
      node => node.value
    );
    const deleted = $collections.filter(item => tags.includes(item.name));
    if (
      window.confirm(
        `Are you sure you want to permanently delete the selected collections? This action cannot be undone.`
      )
    ) {
      removeMany(deleted).then(() => {
        deleting = false;
        collections.update(list =>
          list.filter(item => !tags.includes(item.name))
        );
        if (tags.includes(current)) {
          goto("/collections/all");
        }
        return update();
      });
    }
  }
  let input;
  $: if (input) {
    input.focus();
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
  ol,
  .Creating {
    margin: 1rem auto;
    min-width: 250px;
    max-width: 450px;
    width: 100%;
  }
  ol a,
  label {
    text-decoration: none;
    display: block;
    padding: 0.25rem 1rem;
    border-radius: 0;
  }
  ol a.current {
    background-color: #f3f3f3;
    outline: 0.5px solid var(--rc-main);
  }
  .current span {
    font-weight: bold;
  }
  ol a:hover {
    background-color: var(--rc-dark);
    color: var(--light);
  }
  ol a:focus {
    background-color: var(--rc-lighter);
    color: black;
  }
  ol li {
    list-style: none;
  }
  .ButtonRow {
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
  .Creating {
    padding: 1rem;
  }
  .Creating input {
    width: 100%;
    margin: 0.5rem 0;
    border: 0.1em solid var(--rc-dark);
    padding: 0 0.25rem;
    font: inherit;
    letter-spacing: inherit;
    word-spacing: inherit;
  }
  .Creating input:focus {
    background-color: var(--rc-lighter);
  }

  .FormRow {
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
  .Tags {
    background-color: white;
    border-radius: 0.25rem;
    border: 1px solid #f5f5f5;
  }
</style>

<div class="Modal" use:setup id="collections-modal" hidden>
  {#if $modal && $modal.id === 'collections-modal'}
    <div role="document" transition:fade={{ duration: 100 }}>
      <button
        type="Button"
        data-close-modal
        class="Closer"
        on:click={event => console.log(event)}>
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
      <h1>Collections</h1>
      {#if deleting}
        <form class="Deleting" on:submit={event => submitDelete(event)}>
          <div class="FormRow">
            <TextButton
              noClose={true}
              click={event => {
                deleting = false;
              }}>
              Cancel
            </TextButton>
            <Button noClose={true} warning>Delete</Button>
          </div>

          <ol class="Tags">
            {#each $collections as tag}
              <li>
                <label class:item={true} for={tag.name}>
                  <input
                    type="checkbox"
                    id={tag.name}
                    value={tag.name}
                    name="tag" />
                  {tag.name}
                </label>
              </li>
            {/each}
          </ol>
        </form>
      {:else}
        {#if creating}
          <form class="Creating" on:submit={event => submitForm(event)}>
            <input bind:value={name} bind:this={input} />
            <div class="FormRow">
              <TextButton
                noClose={true}
                click={event => {
                  creating = false;
                  name = '';
                }}>
                Cancel
              </TextButton>
              <Button noClose={true}>Create Collection</Button>
            </div>
          </form>
        {/if}
        <ol>
          {#if !creating}
            <li class="ButtonRow">
              <TextButton
                warning={true}
                click={() => {
                  deleting = true;
                }}
                noClose={true}>
                Delete
              </TextButton>
              <Button
                click={event => {
                  creating = true;
                }}
                noClose={true}>
                Create Collection
              </Button>
            </li>
          {/if}
          <li>
            <a
              class:item={true}
              href="/"
              data-close-modal
              class:current={current === 'Uploads'}>
              <span class="label">Uploads</span>
            </a>
          </li>
          <li>
            <a
              class:item={true}
              href="/collections/all"
              data-close-modal
              class:current={current === 'all'}>
              <span class="label">All</span>
            </a>
          </li>
        </ol>
        {#if name}
          <ol class="Tags">
            {#each $collections.filter(tag => tag.name.startsWith(name)) as tag}
              <li>
                <a
                  class:item={true}
                  href="/collections/{encodeURIComponent(tag.name)}"
                  data-close-modal
                  class:current={current === tag.name}>
                  <span class="label">{tag.name}</span>
                </a>
              </li>
            {/each}
          </ol>
        {:else}
          <ol class="Tags">
            {#each $collections as tag}
              <li>
                <a
                  class:item={true}
                  href="/collections/{encodeURIComponent(tag.name)}"
                  data-close-modal
                  class:current={current === tag.name}>
                  <span class="label">{tag.name}</span>
                </a>
              </li>
            {/each}
          </ol>
        {/if}
      {/if}
    </div>
  {/if}
</div>
