<script>
  // your script goes here
  import UploadQueue from "../src/uploader/UploadQueue.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  const queue = writable([]);
  onMount(() => {
    setTimeout(() => {
      queue.set([{ name: "file1.epub" }]);
    }, 250);
    setTimeout(() => {
      queue.set([{ name: "file1.epub" }, { name: "file2.epub" }]);
    }, 500);
    setTimeout(() => {
      queue.set([
        { name: "file1.epub" },
        { name: "file2.epub" },
        { name: "file3.epub" }
      ]);
    }, 750);
    setTimeout(() => {
      queue.set([
        { name: "file1.epub" },
        { name: "file2.epub" },
        { name: "file3.epub" },
        { name: "file4.epub" }
      ]);
    }, 1000);
  });
</script>

<style>
  /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->
<UploadQueue {queue} />
