const EasyCache = (()=>{
  class _DummyCache{
    async match(){}
    async matchAll(){
      return [];
    }
    async add(){}
    async addAll(){}
    async put(){}
    async delete(){
      return false;
    }
    async keys(){
      return []
    }
  }
  const isPromise = x => x instanceof Promise || x?.constructor?.name == 'Promise' || typeof x?.then === 'function';
  const $init = Symbol('*init');
  const $getCache = Symbol('*getCache');
  const $setCache = Symbol('*setCache');
  return class EasyCache{
    constructor(...args){
      const $this = this;
      $this[$init] = (async()=>{
        try{
          if(!args.length){
            $this[$getCache] = caches.default ?? caches;
            $this[$setCache] = caches.default ?? await caches.open('default');
            return $this
          }
          if(args[0] == 'default'){
            const $cache = caches.default ?? await caches.open('default');
            $this[$getCache] = $cache;
            $this[$setCache] = $cache;
          }
        }catch(e){
          console.warn(e);
          const dummy = new _DummyCache();
          $this[$getCache] = dummy;
          $this[$setCache] = dummy;
        }
      })();
    }
  }
})();
