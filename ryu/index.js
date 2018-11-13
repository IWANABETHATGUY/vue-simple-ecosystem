
const proxyObj = target => {
  const data = new Proxy(target, {
    get(target, props) {
      console.log(`get ${props}`);
      return target[props];
    },
    set(target, props, newValue) {
      target[props] = newValue;
      console.log(`set ${props}`);
      return true;
    },
  });
  return data;
};

const proxy = obj => {
  for (let props in obj) {
    let child = obj[props];
    if (child && Object.prototype.toString.call(child) === '[object Object]') {
      console.log('this is the object');
      obj[props] = proxy(child);
    }
  }
  return proxyObj(obj);
};
const object = {
  name: 'jack',
  age: 1,
  info: {
    gender: 'female',
    job: 'programmer'
  }
};

const newObj = proxy(object);