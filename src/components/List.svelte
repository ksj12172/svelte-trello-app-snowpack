<script>
  import CreateCard from "~/components/CreateCard.svelte";
  import ListTitle from "~/components/ListTitle.svelte";
  import Card from "~/components/Card.svelte";
  import { onMount } from "svelte";
  import Sortable from "sortablejs";
  import { cards } from "~/store/list";

  export let list;
  export let sortableLists;

  // Sortable 인스턴스 연결함
  let sortableCards;
  let cardsEl;

  // event.detail: 자식에서 부모로 dispatch event 할 때
  function disableSortable(event) {
    sortableLists.option("disabled", event.detail); // for Lists
    sortableCards.option("disabled", event.detail); // for cards
  }

  onMount(() => {
    console.log("cards");
    sortableCards = new Sortable(cardsEl, {
      group: "My Cards", // 그룹이름이 같아야만 정렬이 가능하다
      handle: ".list__cards",
      delay: 50, // 클릭과 구별
      animation: 0,
      forceFallback: true,
      onEnd(event) {
        cards.reorder({
          fromListId: event.from.dataset.listId,
          toListId: event.to.dataset.listId,
          oldIndex: event.oldIndex,
          newIndex: event.newIndex,
        });
      },
    });
  });
</script>

<div class="list">
  <div class="list__inner">
    <div class="list__heading">
      <ListTitle {list} on:editMode={disableSortable} />
      <p>{list.cards.length} cards</p>
    </div>
    <div data-list-id={list.id} bind:this={cardsEl} class="list__cards">
      {#each list.cards as card (card.id)}
        <Card listId={list.id} {card} on:editMode={disableSortable} />
      {/each}
    </div>
    <CreateCard listId={list.id} on:editMode={disableSortable} />
  </div>
</div>

<style lang="scss">
  .list {
    word-break: break-all;
    display: inline-block;
    font-size: 16px;
    white-space: normal;
    width: 290px;
    height: 100%;
    box-sizing: border-box;
    margin: 0 4px;
    line-height: 20px;
    :global(&.sortable-ghost) {
      position: relative;
      opacity: 0.2;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        border-radius: 4px;
      }
    }
    :global(&.sortable-chosen) {
      cursor: move;
    }
    .list__inner {
      display: flex;
      flex-direction: column;
      max-height: 100%; // 고정 높이가 아니라 가변 높이로
      padding: 10px 8px;
      box-sizing: border-box;
      background: #ebecf0;
      border-radius: 4px;
      .list__heading {
        margin-bottom: 10px;
        p {
          color: #5e6c84;
          padding: 0 8px;
        }
      }
      .list__cards {
        overflow-x: hidden;
        overflow-y: auto;
        margin-bottom: 10px;
      }
    }
  }
</style>
