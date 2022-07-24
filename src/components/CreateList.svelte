<script>
  import { lists } from "~/store/list";
  import { tick } from "svelte";
  import { autoFocusout } from "~/actions/autoFocusout";

  let isEditMode = false;
  let title = "";
  let textareaEl;

  function addList() {
    if (title.trim()) {
      lists.add({
        title,
      });

      offEditMode();
    }
  }
  async function onEditMode() {
    isEditMode = true;
    await tick();
    textareaEl && textareaEl.focus();
  }
  function offEditMode() {
    isEditMode = false;
    title = "";
  }
</script>

<div class="create-list">
  {#if isEditMode}
    <div use:autoFocusout={offEditMode} class="edit-mode">
      <textarea
        bind:value={title}
        bind:this={textareaEl}
        on:keydown={(event) => {
          event.key === "Enter" && addList();
          event.key === "Escape" && offEditMode();
          event.key === "Esc" && offEditMode();
        }}
        placeholder="Enter a title for this list"
      />
      <div class="actions">
        <div class="btn success" on:click={addList}>Add List</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
      </div>
    </div>
  {:else}
    <div class="add-another-list" on:click={onEditMode}>+ Add another list</div>
  {/if}
</div>

<style lang="scss">
  @import "../scss/main.scss";
  .create-list {
    width: 290px;
    display: inline-block;
    white-space: normal;
    font-size: 16px;
    padding: 10px 8px;
    vertical-align: top;
    background: rgba(#ebecf0, 0.6);
    border-radius: 4px;
    margin: 0 4px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.2s; // 색상 변경이 0.2초 걸리도록
    // .create-list:hover {와 같다. & : 자기 자신의 선택자
    &:hover {
      background: #ebecf0;
    }
  }
</style>
