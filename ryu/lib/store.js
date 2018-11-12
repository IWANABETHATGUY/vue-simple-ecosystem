export default function createStore({ model}) {
  if (!window || !window.Vue) {
    console.error('you should import the vue first');
    return;
  }
  return new Vue({
    data() {
      return model;
    }
  })
}