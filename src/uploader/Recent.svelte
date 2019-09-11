<script>
  import List from "../library/List.svelte";
  import Button from "../components/Button.svelte";
  export let recent = { items: [] };
</script>

<style>
  /* your styles go here */
  .Recent summary {
    transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
      transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
    text-transform: uppercase;
    border-radius: 2rem;
    font-size: 0.7rem;
    color: var(--medium);
    margin-bottom: 1.75rem;
  }
  .Recent summary:hover {
    color: var(--hover);
    cursor: pointer;
  }
  .Recent {
    position: relative;
  }
  .Recent > :global(.Button) {
    position: absolute;
    top: 0.2rem;
    right: var(--reader-left-margin);
  }
</style>

<details class="Recent" open>
  <summary>Recently Imported</summary>
  <Button href="/library/all">See All</Button>
  <List list={recent.items} />
</details>
