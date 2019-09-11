<script>
  import Item from "../src/library/Item.svelte";
  // your script goes here
  export let layout;
  export let book;
</script>

<style>
  /* your styles go here */
</style>

<Item {layout} {book} />

<!-- markup (zero or more items) goes here -->
