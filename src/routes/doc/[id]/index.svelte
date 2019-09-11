<script context="module">
  // your script goes here
  export async function preload({ params, query }) {
    const { id } = params;
    const response = await this.fetch(`/api/id-to-opf?id=%2F${id}`);
    const bookData = await response.json();
    return { bookData };
  }
</script>

<script>
  import { book } from "../../../doc/stores.js";
  export let bookData;
  book.set(bookData);
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<pre>{$book.name}</pre>
