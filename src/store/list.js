import {writable} from 'svelte/store';
import {v4 as uuid} from 'uuid';
import _find from 'lodash/find';
import _remove from 'lodash/remove';
import _cloneDeep from 'lodash/cloneDeep';

const generateId = () => uuid();
// 저장소에서 가져온 리스트
const repoLists = JSON.parse(window.localStorage.getItem('lists')) || [];

const _lists = writable(repoLists);
// 프로그램 실행시 로컬 스토리지에 값이 저장된다
_lists.subscribe(($lists) => {
  window.localStorage.setItem('lists', JSON.stringify($lists));
})

// custom store가 되려면 subscribe라는 메소드가 있어야 한다
export const lists = {
  // 자동구독 가능
  subscribe: _lists.subscribe,
  reorder(payload) {
    const {oldIndex, newIndex} = payload;

    _lists.update($lists => {
      const clone = _cloneDeep($lists[oldIndex]);
      $lists.splice(oldIndex,1);
      $lists.splice(newIndex,0,clone); // 안 지우고 clone 데이터 넣기
      
      return $lists;
    })
  },
  // list 추가 가능
  add(payload) {
    const {title} = payload;

    _lists.update(($lists) => {
      $lists.push({
        id: generateId(), // 고유문자 길이 지정 가능
        title,
        cards: []
      })
      return $lists;
    })
  },
  edit(payload) {
    const {listId, title} = payload;
    _lists.update($lists => {
      const foundList = _find($lists, {id: listId});
      foundList.title = title;
      return $lists;
    })
  },
  remove(payload) {
    const {listId} = payload;
    _lists.update($lists => {
      _remove($lists, {id: listId});
      return $lists;
    })
  }
}

// subscribe가 없으므로 custom store가 아니다
export const cards = {
  add(payload) {
    const {listId, title} = payload;
    _lists.update($lists => {
      const foundList = _find($lists, {id: listId});
      foundList.cards.push({
        id: generateId(),
        title,
      })
      return $lists;
    })
  },
  edit(payload) {
    const {listId, cardId, title} = payload;
    
    _lists.update($lists => {
      const foundList = _find($lists, {id: listId});
      const foundCard = _find(foundList.cards, {id: cardId});
      foundCard.title = title;

      return $lists;
    })
  },
  remove(payload) {
    const {listId, cardId} = payload;

    _lists.update($lists => {
      const foundList = _find($lists, {id: listId});
      _remove(foundList.cards, {id: cardId});
      
      return $lists;
    })
  },
  reorder(payload) {
    const {fromListId, toListId, oldIndex, newIndex} = payload;

    _lists.update($lists => {
      const fromList = _find($lists, {id: fromListId});
      const toList = fromListId === toListId ? fromList : _find($lists, {id: toListId});

      const clone = _cloneDeep(foundList.cards[oldIndex]);
      fromList.cards.splice(oldIndex, 1);
      toList.cards.splice(newIndex, 0, clone);

      return $lists;
    })
  }
}