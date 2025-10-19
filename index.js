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
            return $this;
          }
            const $cache = caches.default ?? await caches.open(String(args[0]));
            $this[$getCache] = $cache;
            $this[$setCache] = $cache;
            return $this;
        }catch(e){
          console.warn(e);
          const dummy = new _DummyCache();
          $this[$getCache] = dummy;
          $this[$setCache] = dummy;
          return $this;
        }
      })();
    }
    async match(...args){
      try{
        if(isPromise(init)){
          init = await init;
        }
        const url = String(args[0].url ?? args[0]);
        const options = args[1] ?? {};
        options.ignoreMethod ??= true;
        options.ignoreVary ??= true;
        return (await this[$getCache].match(url,options))?.clone?.();
      }catch(e){
        console.warn(e);
      }
    }
    async matchAll(...args){
      try{
        if(isPromise(init)){
          init = await init;
        }
        const url = String(args[0].url ?? args[0]);
        const options = args[1] ?? {};
        options.ignoreMethod ??= true;
        options.ignoreVary ??= true;
        return (await this[$getCache].matchAll(url,options)).map(x=>x?.clone?.());
      }catch(e){
        console.warn(e);
        return [];
      }
    }
    async add(...args){
      try{
        if(isPromise(init)){
          init = await init;
        }
        const url = String(args[0].url ?? args[0]);
        return await this[$setCache].add(url);
      }catch(e){
        console.warn(e);
      }
    }
    async addAll(...args){
      try{
        if(isPromise(init)){
          init = await init;
        }
        const urls = args[0].map(x=>String(x?.url ?? x));
        return await this[$setCache].addAll(urls);
      }catch(e){
        console.warn(e);
      }
    }
    async put(req,res){
      try{
        if(isPromise(init)){
          init = await init;
        }
        const url = String(req.url ?? req);
        return await this[$setCache](url,res?.clone?.() ?? new Response(res?.body ?? res,res ?? {}));
      }catch(e){
        console.warn(e);
        return false;
      }
    }
    async delete(...args){
      try{
        if(isPromise(init)){
          init = await init;
        }
        const url = String(args[0].url ?? args[0]);
        const options = args[1] ?? {};
        options.ignoreMethod ??= true;
        options.ignoreVary ??= true;
        return await this[$setCache].delete(url,options);
      }catch(e){
        console.warn(e);
        return false;
      }
    }
    async keys(...args){
      try{
        if(isPromise(init)){
          init = await init;
        }
        const url = String(args[0].url ?? args[0]);
        const options = args[1] ?? {};
        options.ignoreMethod ??= true;
        options.ignoreVary ??= true;
        return (await this[$getCache].keys(url,options)).map(x=>x?.clone?.());
      }catch(e){
        console.warn(e);
        return [];
      }
    }
  }
})();
