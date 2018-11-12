export default function(Vue) {
  const version = Number(Vue.version.split('.')[0]);
  if (version < 2) {
    console.error(`vuex should run on vue at least 2`);
    return;
  }
  Vue.mixin({
    beforeCreate: initVue
  });
}

function initVue() {
  const options = this.$options;
  if (options.store) {
    this.$store =
      typeof options.store === 'function' ? options.store() : options.store;
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store;
  }
}
