/**
 * 1st: 연결된 요소 정보를 가지고 있음
 */
export function autoFocusout(el, focusoutListener) {
  const focusinListener = (event) => {
    event.stopPropagation();
  }
  setTimeout(() => {
    el.addEventListener('click', focusinListener);
  
    window.addEventListener("click", focusoutListener);
  }, 0);

  return {
    destroy() {
      el.removeEventListener("click", focusinListener);
      window.removeEventListener("click", focusoutListener);
    }
  }
}