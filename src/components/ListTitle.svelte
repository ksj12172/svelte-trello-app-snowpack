<script>
  import { onDestroy, tick, createEventDispatcher } from "svelte";
  import { lists } from "~/store/list";
  import { autoFocusout } from "~/actions/autoFocusout";

  export let list; // props로 받는 데이터
  let isEditMode = false;
  let title = list.title;
  let textareaEl;
  const dispatch = createEventDispatcher();

  function saveTitle() {
    if (title.trim()) {
      lists.edit({
        listId: list.id,
        title,
      });
    }
    offEditMode();
  }

  function removeList() {
    lists.remove({
      listId: list.id,
    });
    offEditMode();
  }

  async function onEditMode() {
    isEditMode = true;
    title = list.title;
    dispatch("editMode", true);
    await tick();
    textareaEl && textareaEl.focus();
  }

  function offEditMode() {
    isEditMode = false;
    dispatch("editMode", false);
  }

  onDestroy(() => {
    offEditMode();
  });
</script>

{#if isEditMode}
  <div use:autoFocusout={offEditMode} class="edit-mode">
    <textarea
      bind:value={title}
      bind:this={textareaEl}
      placeholder="Enter a title for this"
      on:keydown={(event) => {
        event.key === "Enter" && saveTitle();
        event.key === "ESC" && offEditMode();
        event.key === "Escape" && offEditMode();
      }}
    />
    <div class="actions">
      <div class="btn success" on:click={saveTitle}>Save</div>
      <div class="btn" on:click={offEditMode}>Cancel</div>
      <div class="btn danger" on:click={removeList}>Delete List</div>
    </div>
  </div>
{:else}
  <h2 class="title">
    {list.title}
    <div class="btn small edit-btn-for-list" on:click={onEditMode}>Edit</div>
  </h2>
{/if}

<style lang="scss">
  h2.title {
    font-weight: 700;
    padding: 4px 8px;
    cursor: pointer;
    position: relative;
    .btn {
      position: absolute; // 부모 요소 기준으로 배치된다
      top: 0;
      right: 0;
      display: none;
    }
  }
  :global(.list__inner:hover .edit-btn-for-list) {
    display: block !important;
  }
</style>
