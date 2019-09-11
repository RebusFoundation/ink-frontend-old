<script>
  // your script goes here
  import Book from "../src/components/Book.svelte";
  import { setContext } from "svelte";
  const bookId = "stories/preview-data/bookdemo/index.json";
  const bookPath = "demo.xhtml";
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<Book {bookId} {bookPath} />
