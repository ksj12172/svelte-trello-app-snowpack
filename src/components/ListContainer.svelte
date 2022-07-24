<script>
  import Sortable from "sortablejs";
  import { onMount } from "svelte";
  import { lists } from "~/store/list";
  import List from "~/components/List.svelte";
  import CreateList from "~/components/CreateList.svelte";

  let listsEl; // SortableJS에서 사용할 List 목록 요소 지정
  let sortableLists; // List 정렬을 위한 SortableJS 인스턴스 지정

  // lists 스토어의 값($lists)이 변경되면 아래 반응성 구문이 실행된다
  $: {
    console.log($lists);
  }

  onMount(() => {
    sortableLists = new Sortable(listsEl, {
      group: "My Lists", // 한 목록에서 다른 목록으로 요소를 끌어오려면 두 목록의 그룹 값이 같아야 한다
      handle: ".list", // 드래그 핸들이 될 요소의 선택자를 입력한다, list 클래스를 가진 요소를 드래그할 것
      delay: 50, // (클릭과 드래그 구분) 클릭이 밀리는 것을 방지하기 위해 약간의 지연 시간을 추가한다
      animation: 0, // 정렬할 때 애니메이션 속도를 지정한다
      // 강제적으로 대체 기능을 사용한다
      forceFallback: true, // sortablejs의 기능을 사용한다. HTML5 기본 DnD 동작은 무시(크로스 브라우징 이슈, 다양한 환경에서 일관적으로 동작하기 위해)
      // 요소의 DnD가 종료되면 실행할 핸드러(함수)를 진행한다
      onEnd(event) {
        console.log(event); // event 객체의 정렬에 대한 다양한 정보가 들어있다
        lists.reorder({
          oldIndex: event.oldIndex,
          newIndex: event.newIndex,
        });
      },
    });
  });
</script>

<div class="list-container">
  <div bind:this={listsEl} class="lists">
    {#each $lists as list (list.id)}
      <List {list} {sortableLists} />
    {/each}
  </div>
  <CreateList />
</div>

<style lang="scss">
  .list-container {
    width: 100vw;
    height: calc(100vh - 40px);
    padding: 30px;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    font-size: 0;
    .lists {
      display: inline-block;
      height: 100%;
      white-space: nowrap;
      font-size: 0;
    }
  }
</style>
