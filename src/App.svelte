<script>
  import Header from "~/components/Header.svelte";
  import ListContainer from "~/components/ListContainer.svelte";

  Object.assign(document.body.style, {
    backgroundColor: "darkgray",
    backgroundImage: "url(/images/bg.jpeg)",
    backgroundSize: "cover",
  });
</script>

<Header />
<ListContainer />
