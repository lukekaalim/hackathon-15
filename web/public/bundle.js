function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var e=e=>({type:"success",success:e}),r=e=>({type:"failure",failure:e});const t=(t,s)=>{return {request:async(a,n=[],u="GET",o=null)=>{try{const d={method:u,headers:new s((e=>e.reduce((e,[r,t])=>({...e,[r]:t}),{}))(n)),body:o},c=await t(a,d);return e({status:c.status,headers:[...c.headers.entries()].map(([e,r])=>({name:e,value:r})),body:await c.text()})}catch(e){return r(e)}}}};

/*
  Result is a data type that represents a single branch in execution,
  where one branch performs the expected operation, and another handles
  a case where something unexpected happened.
  This is slightly more useful to use because it forces the developer to
  handle the error cases before accessing the value.
*/

const succeed = (success) => ({
  type: 'success',
  success,
});
const fail = (failure) => ({
  type: 'failure',
  failure,
});

// Simple handler function: if the result is successful, goto the second argument, it fails, goto the third
const handle = (
  result,
  onSuccess,
  onFailure,
) => {
  if (result.type === 'success') {
    return onSuccess(result.success);
  } else {
    return onFailure(result.failure);
  }
};

const chain = (result) => ({
  then: (resolve) => handle(result,
    success => chain(resolve(success)),
    () => chain(result)
  ),
  catch: (reject) => handle(result,
    () => chain(result),
    (failure) => chain(reject(failure))
  ),
  result: () => result,
  handle: () => handle(result, x => x, y => y),
});

var result = {
  succeed,
  fail,
  handle,
  chain,
};

/*::
export type CastFailure = {
  type: 'cast-failure',
  message: string,
  cause?: InternalFailure | CastFailure,
}

export type InternalFailure = {
  type: 'internal-failure',
  message: string,
  error: Error,
}

export type ModelFailure =
  | InternalFailure
  | CastFailure
*/

const castFailure = (message/*: string*/, cause/*:: ?: ModelFailure*/)/*: CastFailure*/ => ({
  type: 'cast-failure',
  message,
  cause,
});

const internalFailure = (error/*: Error*/)/*: InternalFailure*/ => ({
  type: 'internal-failure',
  message: error.stack,
  error,
});

var failures = {
  castFailure,
  internalFailure,
};

// @flow strict
/*::
import type { Model } from './model';
import type { Result } from '@lukekaalim/result';
import type { CastFailure, InternalFailure } from './failures';
*/
const { succeed: succeed$1, fail: fail$1 } = result;
const { castFailure: castFailure$1 } = failures;

const stringModel/*: Model<string>*/ = {
  from: value => typeof value === 'string' ?
    succeed$1(value) :
    fail$1(castFailure$1(`Value is not a string (Is ${typeof value} instead)`)),
};

const numberModel/*: Model<number>*/ = {
  from: value => typeof value === 'number' ?
    succeed$1(value) :
    fail$1(castFailure$1(`Value is not a number (Is ${typeof value} instead)`)),
};

const booleanModel/*: Model<boolean>*/ = {
  from: value => typeof value === 'boolean' ?
    succeed$1(value) :
    fail$1(castFailure$1(`Value is not a boolean (Is ${typeof value} instead)`)),
};

var primitives = {
  stringModel,
  numberModel,
  booleanModel,
};

// @flow strict
/*::
import type { Model } from './model';
*/
const { fail: fail$2, succeed: succeed$2 } = result;
const { castFailure: castFailure$2 } = failures;

const modelObject = /*::  <Map: {}>*/(
  map/*: Map*/,
)/*: Model<$ObjMap<Map, <V, Y>(model: Model<V>) => V>>*/ => {
  const mapEntries/*: Array<[string, Model<mixed>]>*/ = [];
  for (const key of Object.keys(map)) {
    mapEntries.push([key, map[key]]);
  }
  const from = value => {
    if (typeof value !== 'object' || value === null) {
      return fail$2(castFailure$2('WAA'));
    }
    const model = {};
    for (const [name, subModel] of mapEntries) {
      const propertyValueResult = subModel.from(value[name]);
      if (propertyValueResult.type === 'failure') {
        return fail$2(castFailure$2('WAA'));
      }
      model[name] = propertyValueResult.success;
    }
    return succeed$2(model);
  };
  return { from };
};

const modelArray = /*::  <Element>*/(
  elementModel/*: Model<Element>*/
)/*: Model<Array<Element>> */ => {
  const from = value => {
    if (!Array.isArray(value)) {
      return fail$2(castFailure$2('WAA'));
    }
    const model = [];
    for (const elementValue of value) {
      const elementResult = elementModel.from(elementValue);
      if (elementResult.type === 'failure') {
        return fail$2(castFailure$2('WAA'));
      }
      model.push(elementResult.success);
    }
    return succeed$2(model);
  };
  return { from };
};

const modelTuple = /*:: <TupleModel>*/(
  tupleModels/*: TupleModel*/
)/*: Model<$TupleMap<TupleModel, <V>(model: Model<V>) => V>>*/ => {
  // $FlowFixMe
  const models/*: Array<Model<mixed>>*/ = tupleModels;
  const from = value => {
    if (!Array.isArray(value)) {
      return fail$2(castFailure$2('WAA'));
    }
    const tuple = [];
    for (let i = 0; i < models.length; i++) {
      const tupleResult = models[i].from(value[i]);
      if (tupleResult.type === 'failure')
        return fail$2(castFailure$2('WAA'));
      tuple[i] = tupleResult.success;
    }
    return succeed$2(tuple);
  };
  // $FlowFixMe
  return { from };
};

var composite = {
  modelObject,
  modelArray,
  modelTuple,
};

// @flow strict
/*::
import type { Model } from './model';
*/
const { chain: chain$1, fail: fail$3 } = result;
const { castFailure: castFailure$3 } = failures;

const nameModel = /*:: <T>*/(name/*: string*/, model/*: Model<T>*/)/*: Model<T>*/ => ({
  name,
  from: (value) => chain$1(model.from(value))
    .catch(failure => fail$3(castFailure$3(`Failed to cast ${name}.`, failure)))
    .result(),
});

var name = {
  nameModel,
};

// @flow strict
/*::
import type { Model } from './model';
*/
const { succeed: succeed$3, fail: fail$4 } = result;
const { castFailure: castFailure$4 } = failures;
const { stringModel: stringModel$1 } = primitives;

const modelDisjointUnion = /*::<Map: {}>*/(
  tagName/*: string*/,
  map/*: Map*/,
)/*: Model<$Values<$ObjMap<Map, <V>(model: Model<V>) => V>>>*/ => {
  const tags = Object.keys(map);
  const from = (value) => {
    if (typeof value !== 'object') {
      return fail$4(castFailure$4(''));
    }
    if (value === null) {
      return fail$4(castFailure$4(''));
    }
    const tag = value[tagName];
    if (typeof tag !== 'string') {
      return fail$4(castFailure$4(''));
    }
    if (!tags.includes(tag)) {
      return fail$4(castFailure$4(''));
    }
    return map[tag].from(value);
  };
  return { from };
};

const modelTagUnion = /*::<Union>*/(
  tags/*: Array<Union>*/,
)/*: Model<Union>*/ => {
  const from = (value) => {
    const tagResult = stringModel$1.from(value);
    if (tagResult.type === 'failure') {
      return fail$4(castFailure$4(''));
    }
    const tag = tags.find(tag => tag === tagResult.success);
    if (!tag) {
      return fail$4(castFailure$4(''));
    }
    return succeed$3(tag);
  };
  return { from };
};

var unions = {
  modelDisjointUnion,
  modelTagUnion,
};

// @flow strict
/*::
import type { Model } from './model';
import type { Result } from '@lukekaalim/result';
import type { CastFailure, InternalFailure } from './failures';
*/
const { succeed: succeed$4, fail: fail$5 } = result;
const { castFailure: castFailure$5 } = failures;

const modelLiteral = /*:: <T>*/(literal/*: T*/)/*: Model<T>*/ => {
  const from = (mixed) => {
    if (mixed === literal) {
      return succeed$4(literal);
    }
    return fail$5(castFailure$5(''));
  };

  return { from };
};

var literal = {
  modelLiteral,
};

// @flow strict
/*::
import type { Model } from './model';
import type { Result } from '@lukekaalim/result';
import type { ModelFailure } from './failures';
*/
const { fail: fail$6, succeed: succeed$5 } = result;
const { castFailure: castFailure$6 } = failures;

const modelOptional = /*:: <T> */(
  model/*: Model<T>*/
)/*: Model<T | null>*/ => {
  const from = (value)/*: Result<T | null, ModelFailure>*/ => {
    if (value === null || value === undefined)
      return succeed$5(null);
    const modelResult = model.from(value);
    if (modelResult.type === 'failure')
      return fail$6(castFailure$6(''));
    return succeed$5(modelResult.success);
  };

  return { from };
};

var optional = {
  modelOptional,
};

const { stringModel: stringModel$2, numberModel: numberModel$1, booleanModel: booleanModel$1 } = primitives;
const { modelObject: modelObject$1, modelArray: modelArray$1, modelTuple: modelTuple$1 } = composite;
const { nameModel: nameModel$1 } = name;
const { modelDisjointUnion: modelDisjointUnion$1, modelTagUnion: modelTagUnion$1 } = unions;
const { modelLiteral: modelLiteral$1 } = literal;
const { modelOptional: modelOptional$1 } = optional;

/*::
export type Model<T> = {
  from: mixed => Result<T, ModelFailure>,
};
*/

var model = {
  booleanModel: booleanModel$1,
  numberModel: numberModel$1,
  stringModel: stringModel$2,
  nameModel: nameModel$1,
  modelTuple: modelTuple$1,
  modelObject: modelObject$1,
  modelArray: modelArray$1,
  modelDisjointUnion: modelDisjointUnion$1,
  modelTagUnion: modelTagUnion$1,
  modelLiteral: modelLiteral$1,
  modelOptional: modelOptional$1,
};

// @flow strict
const {
  modelObject: modelObject$2,
  stringModel: stringModel$3,
  nameModel: nameModel$2,
  modelArray: modelArray$2,
  modelDisjointUnion: modelDisjointUnion$2,
  modelLiteral: modelLiteral$2,
  modelOptional: modelOptional$2,
} = model;
/*::
import type { Model } from '@lukekaalim/model';

export type Route =
  | { type: 'home' };

export type CallToAction = {
  title: string,
  route: Route,
};

export type Carousel = {
  slides: Array<{ imageURL: string }>,
};

export type Card = {
  imageURL: string,
  route: Route,
  title: string,
  subtitle: string,
};

export type Rail = {
  callToAction: CallToAction | null,
  cards: Array<Card>,
};

export type Homepage = {
  carousel: Carousel,
  rails: Array<Rail>
};
*/

const routeModel/*: Model<Route>*/ = nameModel$2('9Now/Route', modelDisjointUnion$2('type', {
  'home': modelObject$2({ type: modelLiteral$2('home') }),
}));

const callToActionModel/*: Model<CallToAction>*/ = nameModel$2('9Now/CallToAction', modelObject$2({
  title: stringModel$3,
  route: routeModel,
}));

const carouselModel/*: Model<Carousel>*/ = nameModel$2('9Now/Carousel', modelObject$2({
  slides: modelArray$2(modelObject$2({
    imageURL: stringModel$3,
    route: routeModel,
  })),
}));

const cardModel/*: Model<Card>*/ = nameModel$2('9Now/Card', modelObject$2({
  imageURL: stringModel$3,
  route: routeModel,
  title: stringModel$3,
  subtitle: stringModel$3,
}));

const railModel/*: Model<Rail>*/ = nameModel$2('9Now/Rail', modelObject$2({
  callToAction: modelOptional$2(callToActionModel),
  cards: modelArray$2(cardModel),
}));

const homepageModel/*: Model<Homepage>*/ = nameModel$2('9Now/Homepage', modelObject$2({
  carousel: carouselModel,
  rails: modelArray$2(railModel),
}));

var src = {
  homepageModel,
  railModel,
  carouselModel,
  callToActionModel,
  routeModel,
};

// @flow strict
/*::
import type { Homepage } from '@9now/models';
import type { Result } from '@lukekaalim/result';
import type { HTTPClient } from '@lukekaalim/http-client';

type Client = {
  getHomepage: () => Promise<Homepage>,
};
*/
const { homepageModel: homepageModel$1 } = src;

const trySuccess = /*:: <S, F>*/(result/*: Result<S, F>*/)/*: S*/ => {
  if (result.type === 'failure')
    throw new Error(result.failure);
  return result.success;
};

const createClient = (
  host/*: string*/,
  client/*: HTTPClient*/
) /*: Client*/ => {
  const getHomepage = async () => {
    const response = trySuccess(await client.request(new URL('/home', host).href));
    if (response.status !== 200)
      throw new Error(response.body);
    const homepage = trySuccess(homepageModel$1.from(JSON.parse(response.body)));
    return homepage;
  };
  return {
    getHomepage,
  };
};

var src$1 = {
  createClient,
};
var src_1 = src$1.createClient;

var n,u,t$1,i,r$1,o,f={},e$1=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var t,i,r,o,f=arguments;if(l=s({},l),arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(f[t]);if(null!=u&&(l.children=u),null!=n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===l[i]&&(l[i]=n.defaultProps[i]);return o=l.key,null!=(r=l.ref)&&delete l.ref,null!=o&&delete l.key,v(n,l,o,r)}function v(l,u,t,i){var r={type:l,props:u,key:t,ref:i,__k:null,__p:null,__b:0,__e:null,l:null,__c:null,constructor:void 0};return n.vnode&&n.vnode(r),r}function y(n){return n.children}function d(n){if(null==n||"boolean"==typeof n)return null;if("string"==typeof n||"number"==typeof n)return v(null,n,null,null);if(null!=n.__e||null!=n.__c){var l=v(n.type,n.props,n.key,null);return l.__e=n.__e,l}return n}function m(n,l){this.props=n,this.context=l;}function w(n,l){if(null==l)return n.__p?w(n.__p,n.__p.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?w(n):null}function g(n){var l,u;if(null!=(n=n.__p)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return g(n)}}function k(l){(!l.__d&&(l.__d=!0)&&1===u.push(l)||i!==n.debounceRendering)&&(i=n.debounceRendering,(n.debounceRendering||t$1)(_));}function _(){var n;for(u.sort(function(n,l){return l.__v.__b-n.__v.__b});n=u.pop();)n.__d&&n.forceUpdate(!1);}function b(n,l,u,t,i,r,o,c,s){var h,v,p,y,d,m,g,k=u&&u.__k||e$1,_=k.length;if(c==f&&(c=null!=r?r[0]:_?w(u,0):null),h=0,l.__k=x(l.__k,function(u){if(null!=u){if(u.__p=l,u.__b=l.__b+1,null===(p=k[h])||p&&u.key==p.key&&u.type===p.type)k[h]=void 0;else for(v=0;v<_;v++){if((p=k[v])&&u.key==p.key&&u.type===p.type){k[v]=void 0;break}p=null;}if(y=$(n,u,p=p||f,t,i,r,o,null,c,s),(v=u.ref)&&p.ref!=v&&(g||(g=[])).push(v,u.__c||y,u),null!=y){if(null==m&&(m=y),null!=u.l)y=u.l,u.l=null;else if(r==p||y!=c||null==y.parentNode){n:if(null==c||c.parentNode!==n)n.appendChild(y);else{for(d=c,v=0;(d=d.nextSibling)&&v<_;v+=2)if(d==y)break n;n.insertBefore(y,c);}"option"==l.type&&(n.value="");}c=y.nextSibling,"function"==typeof l.type&&(l.l=y);}}return h++,u}),l.__e=m,null!=r&&"function"!=typeof l.type)for(h=r.length;h--;)null!=r[h]&&a(r[h]);for(h=_;h--;)null!=k[h]&&D(k[h],k[h]);if(g)for(h=0;h<g.length;h++)A(g[h],g[++h],g[++h]);}function x(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var t=0;t<n.length;t++)x(n[t],l,u);else u.push(l?l(d(n)):n);return u}function C(n,l,u,t,i){var r;for(r in u)r in l||N(n,r,null,u[r],t);for(r in l)i&&"function"!=typeof l[r]||"value"===r||"checked"===r||u[r]===l[r]||N(n,r,l[r],u[r],t);}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":u||"";}function N(n,l,u,t,i){var r,o,f,e,c;if("key"===(l=i?"className"===l?"class":l:"class"===l?"className":l)||"children"===l);else if("style"===l)if(r=n.style,"string"==typeof u)r.cssText=u;else{if("string"==typeof t&&(r.cssText="",t=null),t)for(o in t)u&&o in u||P(r,o,"");if(u)for(f in u)t&&u[f]===t[f]||P(r,f,u[f]);}else"o"===l[0]&&"n"===l[1]?(e=l!==(l=l.replace(/Capture$/,"")),c=l.toLowerCase(),l=(c in n?c:l).slice(2),u?(t||n.addEventListener(l,T,e),(n.u||(n.u={}))[l]=u):n.removeEventListener(l,T,e)):"list"!==l&&"tagName"!==l&&"form"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u?n.removeAttribute(l):n.setAttribute(l,u));}function T(l){return this.u[l.type](n.event?n.event(l):l)}function $(l,u,t,i,r,o,f,e,c,a){var h,v,p,d,w,g,k,_,x,C,P=u.type;if(void 0!==u.constructor)return null;(h=n.__b)&&h(u);try{n:if("function"==typeof P){if(_=u.props,x=(h=P.contextType)&&i[h.__c],C=h?x?x.props.value:h.__p:i,t.__c?k=(v=u.__c=t.__c).__p=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(_,C):(u.__c=v=new m(_,C),v.constructor=P,v.render=H),x&&x.sub(v),v.props=_,v.state||(v.state={}),v.context=C,v.__n=i,p=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&s(v.__s==v.state?v.__s=s({},v.__s):v.__s,P.getDerivedStateFromProps(_,v.__s)),p)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&f.push(v);else{if(null==P.getDerivedStateFromProps&&null==e&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(_,C),!e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(_,v.__s,C)){for(v.props=_,v.state=v.__s,v.__d=!1,v.__v=u,u.__e=null!=c?c!==t.__e?c:t.__e:null,u.__k=t.__k,h=0;h<u.__k.length;h++)u.__k[h]&&(u.__k[h].__p=u);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(_,v.__s,C);}for(d=v.props,w=v.state,v.context=C,v.props=_,v.state=v.__s,(h=n.__r)&&h(u),v.__d=!1,v.__v=u,v.__P=l,h=v.render(v.props,v.state,v.context),u.__k=null!=h&&h.type==y&&null==h.key?h.props.children:h,null!=v.getChildContext&&(i=s(s({},i),v.getChildContext())),p||null==v.getSnapshotBeforeUpdate||(g=v.getSnapshotBeforeUpdate(d,w)),b(l,u,t,i,r,o,f,c,a),v.base=u.__e;h=v.__h.pop();)v.__s&&(v.state=v.__s),h.call(v);p||null==d||null==v.componentDidUpdate||v.componentDidUpdate(d,w,g),k&&(v.__E=v.__p=null);}else u.__e=z(t.__e,u,t,i,r,o,f,a);(h=n.diffed)&&h(u);}catch(l){n.__e(l,u,t);}return u.__e}function j(l,u){for(var t;t=l.pop();)try{t.componentDidMount();}catch(l){n.__e(l,t.__v);}n.__c&&n.__c(u);}function z(n,l,u,t,i,r,o,c){var s,a,h,v,p=u.props,y=l.props;if(i="svg"===l.type||i,null==n&&null!=r)for(s=0;s<r.length;s++)if(null!=(a=r[s])&&(null===l.type?3===a.nodeType:a.localName===l.type)){n=a,r[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(y);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type),r=null;}return null===l.type?p!==y&&(null!=r&&(r[r.indexOf(n)]=null),n.data=y):l!==u&&(null!=r&&(r=e$1.slice.call(n.childNodes)),h=(p=u.props||f).dangerouslySetInnerHTML,v=y.dangerouslySetInnerHTML,c||(v||h)&&(v&&h&&v.__html==h.__html||(n.innerHTML=v&&v.__html||"")),C(n,y,p,i,c),l.__k=l.props.children,v||b(n,l,u,t,"foreignObject"!==l.type&&i,r,o,f,c),c||("value"in y&&void 0!==y.value&&y.value!==n.value&&(n.value=null==y.value?"":y.value),"checked"in y&&void 0!==y.checked&&y.checked!==n.checked&&(n.checked=y.checked))),n}function A(l,u,t){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,t);}}function D(l,u,t){var i,r,o;if(n.unmount&&n.unmount(l),(i=l.ref)&&A(i,null,u),t||"function"==typeof l.type||(t=null!=(r=l.__e)),l.__e=l.l=null,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount();}catch(l){n.__e(l,u);}i.base=i.__P=null;}if(i=l.__k)for(o=0;o<i.length;o++)i[o]&&D(i[o],u,t);null!=r&&a(r);}function H(n,l,u){return this.constructor(n,u)}function I(l,u,t){var i,o,c;n.__p&&n.__p(l,u),o=(i=t===r$1)?null:t&&t.__k||u.__k,l=h(y,null,[l]),c=[],$(u,i?u.__k=l:(t||u).__k=l,o||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:o?null:e$1.slice.call(u.childNodes),c,!1,t||f,i),j(c,l);}n={},m.prototype.setState=function(n,l){var u=this.__s!==this.state&&this.__s||(this.__s=s({},this.state));("function"!=typeof n||(n=n(u,this.props)))&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),k(this));},m.prototype.forceUpdate=function(n){var l,u,t,i=this.__v,r=this.__v.__e,o=this.__P;o&&(l=!1!==n,u=[],t=$(o,i,s({},i),this.__n,void 0!==o.ownerSVGElement,null,u,l,null==r?w(i):r),j(u,i),t!=r&&g(i)),n&&n();},m.prototype.render=y,u=[],t$1="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,i=n.debounceRendering,n.__e=function(n,l,u){for(var t;l=l.__p;)if((t=l.__c)&&!t.__p)try{if(t.constructor&&null!=t.constructor.getDerivedStateFromError)t.setState(t.constructor.getDerivedStateFromError(n));else{if(null==t.componentDidCatch)continue;t.componentDidCatch(n);}return k(t.__E=t)}catch(l){n=l;}throw n},r$1=f,o=0;

var t$2,r$2,u$1=[],i$1=n.__r;n.__r=function(n){i$1&&i$1(n),t$2=0,(r$2=n.__c).__H&&(r$2.__H.t=A$1(r$2.__H.t));};var f$1=n.diffed;n.diffed=function(n){f$1&&f$1(n);var t=n.__c;if(t){var r=t.__H;r&&(r.u=(r.u.some(function(n){n.ref&&(n.ref.current=n.createHandle());}),[]),r.i=A$1(r.i));}};var o$1=n.unmount;function e$2(t){n.__h&&n.__h(r$2);var u=r$2.__H||(r$2.__H={o:[],t:[],i:[],u:[]});return t>=u.o.length&&u.o.push({}),u.o[t]}function c$1(n){return a$1(q,n)}function a$1(n,u,i){var f=e$2(t$2++);return f.__c||(f.__c=r$2,f.v=[i?i(u):q(null,u),function(t){var r=n(f.v[0],t);f.v[0]!==r&&(f.v[0]=r,f.__c.setState({}));}]),f.v}function v$1(n,u){var i=e$2(t$2++);h$1(i.l,u)&&(i.v=n,i.l=u,r$2.__H.t.push(i),T$1(r$2));}n.unmount=function(n){o$1&&o$1(n);var t=n.__c;if(t){var r=t.__H;r&&r.o.forEach(function(n){return n.p&&n.p()});}};var T$1=function(){};function g$1(){u$1.some(function(n){n.s=!1,n.__P&&(n.__H.t=A$1(n.__H.t));}),u$1=[];}if("undefined"!=typeof window){var w$1=n.requestAnimationFrame;T$1=function(t){(!t.s&&(t.s=!0)&&1===u$1.push(t)||w$1!==n.requestAnimationFrame)&&(w$1=n.requestAnimationFrame,(n.requestAnimationFrame||function(n){var t=function(){clearTimeout(r),cancelAnimationFrame(u),setTimeout(n);},r=setTimeout(t,100),u=requestAnimationFrame(t);})(g$1));};}function A$1(n){return n.forEach(E),n.forEach(F),[]}function E(n){n.p&&n.p();}function F(n){var t=n.v();"function"==typeof t&&(n.p=t);}function h$1(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function q(n,t){return "function"==typeof t?t(n):t}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var preact = createCommonjsModule(function (module, exports) {
var n,l,u,t,r,i,o,e={},f=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n);}function p(n,l,u){var t,r,i,o,e=arguments;if(l=s({},l),arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(e[t]);if(null!=u&&(l.children=u),null!=n&&null!=n.defaultProps)for(r in n.defaultProps)void 0===l[r]&&(l[r]=n.defaultProps[r]);return o=l.key,null!=(i=l.ref)&&delete l.ref,null!=o&&delete l.key,h(n,l,o,i)}function h(l,u,t,r){var i={type:l,props:u,key:t,ref:r,__k:null,__p:null,__b:0,__e:null,l:null,__c:null,constructor:void 0};return n.vnode&&n.vnode(i),i}function v(n){return n.children}function y(n){if(null==n||"boolean"==typeof n)return null;if("string"==typeof n||"number"==typeof n)return h(null,n,null,null);if(null!=n.__e||null!=n.__c){var l=h(n.type,n.props,n.key,null);return l.__e=n.__e,l}return n}function d(n,l){this.props=n,this.context=l;}function m(n,l){if(null==l)return n.__p?m(n.__p,n.__p.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?m(n):null}function x(n){var l,u;if(null!=(n=n.__p)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return x(n)}}function w(l){(!l.__d&&(l.__d=!0)&&1===u.push(l)||r!==n.debounceRendering)&&(r=n.debounceRendering,(n.debounceRendering||t)(g));}function g(){var n;for(u.sort(function(n,l){return l.__v.__b-n.__v.__b});n=u.pop();)n.__d&&n.forceUpdate(!1);}function k(n,l,u,t,r,i,o,c,s){var p,h,v,y,d,x,w,g=u&&u.__k||f,k=g.length;if(c==e&&(c=null!=i?i[0]:k?m(u,0):null),p=0,l.__k=b(l.__k,function(u){if(null!=u){if(u.__p=l,u.__b=l.__b+1,null===(v=g[p])||v&&u.key==v.key&&u.type===v.type)g[p]=void 0;else for(h=0;h<k;h++){if((v=g[h])&&u.key==v.key&&u.type===v.type){g[h]=void 0;break}v=null;}if(y=T(n,u,v=v||e,t,r,i,o,null,c,s),(h=u.ref)&&v.ref!=h&&(w||(w=[])).push(h,u.__c||y,u),null!=y){if(null==x&&(x=y),null!=u.l)y=u.l,u.l=null;else if(i==v||y!=c||null==y.parentNode){n:if(null==c||c.parentNode!==n)n.appendChild(y);else{for(d=c,h=0;(d=d.nextSibling)&&h<k;h+=2)if(d==y)break n;n.insertBefore(y,c);}"option"==l.type&&(n.value="");}c=y.nextSibling,"function"==typeof l.type&&(l.l=y);}}return p++,u}),l.__e=x,null!=i&&"function"!=typeof l.type)for(p=i.length;p--;)null!=i[p]&&a(i[p]);for(p=k;p--;)null!=g[p]&&A(g[p],g[p]);if(w)for(p=0;p<w.length;p++)z(w[p],w[++p],w[++p]);}function b(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var t=0;t<n.length;t++)b(n[t],l,u);else u.push(l?l(y(n)):n);return u}function _(n,l,u,t,r){var i;for(i in u)i in l||P(n,i,null,u[i],t);for(i in l)r&&"function"!=typeof l[i]||"value"===i||"checked"===i||u[i]===l[i]||P(n,i,l[i],u[i],t);}function C(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":u||"";}function P(n,l,u,t,r){var i,o,e,f,c;if("key"===(l=r?"className"===l?"class":l:"class"===l?"className":l)||"children"===l);else if("style"===l)if(i=n.style,"string"==typeof u)i.cssText=u;else{if("string"==typeof t&&(i.cssText="",t=null),t)for(o in t)u&&o in u||C(i,o,"");if(u)for(e in u)t&&u[e]===t[e]||C(i,e,u[e]);}else"o"===l[0]&&"n"===l[1]?(f=l!==(l=l.replace(/Capture$/,"")),c=l.toLowerCase(),l=(c in n?c:l).slice(2),u?(t||n.addEventListener(l,N,f),(n.u||(n.u={}))[l]=u):n.removeEventListener(l,N,f)):"list"!==l&&"tagName"!==l&&"form"!==l&&!r&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u?n.removeAttribute(l):n.setAttribute(l,u));}function N(l){return this.u[l.type](n.event?n.event(l):l)}function T(l,u,t,r,i,o,e,f,c,a){var p,h,y,m,x,w,g,b,_,C,P=u.type;if(void 0!==u.constructor)return null;(p=n.__b)&&p(u);try{n:if("function"==typeof P){if(b=u.props,_=(p=P.contextType)&&r[p.__c],C=p?_?_.props.value:p.__p:r,t.__c?g=(h=u.__c=t.__c).__p=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(b,C):(u.__c=h=new d(b,C),h.constructor=P,h.render=D),_&&_.sub(h),h.props=b,h.state||(h.state={}),h.context=C,h.__n=r,y=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&s(h.__s==h.state?h.__s=s({},h.__s):h.__s,P.getDerivedStateFromProps(b,h.__s)),y)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&e.push(h);else{if(null==P.getDerivedStateFromProps&&null==f&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(b,C),!f&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(b,h.__s,C)){for(h.props=b,h.state=h.__s,h.__d=!1,h.__v=u,u.__e=null!=c?c!==t.__e?c:t.__e:null,u.__k=t.__k,p=0;p<u.__k.length;p++)u.__k[p]&&(u.__k[p].__p=u);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(b,h.__s,C);}for(m=h.props,x=h.state,h.context=C,h.props=b,h.state=h.__s,(p=n.__r)&&p(u),h.__d=!1,h.__v=u,h.__P=l,p=h.render(h.props,h.state,h.context),u.__k=null!=p&&p.type==v&&null==p.key?p.props.children:p,null!=h.getChildContext&&(r=s(s({},r),h.getChildContext())),y||null==h.getSnapshotBeforeUpdate||(w=h.getSnapshotBeforeUpdate(m,x)),k(l,u,t,r,i,o,e,c,a),h.base=u.__e;p=h.__h.pop();)h.__s&&(h.state=h.__s),p.call(h);y||null==m||null==h.componentDidUpdate||h.componentDidUpdate(m,x,w),g&&(h.__E=h.__p=null);}else u.__e=j(t.__e,u,t,r,i,o,e,a);(p=n.diffed)&&p(u);}catch(l){n.__e(l,u,t);}return u.__e}function $(l,u){for(var t;t=l.pop();)try{t.componentDidMount();}catch(l){n.__e(l,t.__v);}n.__c&&n.__c(u);}function j(n,l,u,t,r,i,o,c){var s,a,p,h,v=u.props,y=l.props;if(r="svg"===l.type||r,null==n&&null!=i)for(s=0;s<i.length;s++)if(null!=(a=i[s])&&(null===l.type?3===a.nodeType:a.localName===l.type)){n=a,i[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(y);n=r?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type),i=null;}return null===l.type?v!==y&&(null!=i&&(i[i.indexOf(n)]=null),n.data=y):l!==u&&(null!=i&&(i=f.slice.call(n.childNodes)),p=(v=u.props||e).dangerouslySetInnerHTML,h=y.dangerouslySetInnerHTML,c||(h||p)&&(h&&p&&h.__html==p.__html||(n.innerHTML=h&&h.__html||"")),_(n,y,v,r,c),l.__k=l.props.children,h||k(n,l,u,t,"foreignObject"!==l.type&&r,i,o,e,c),c||("value"in y&&void 0!==y.value&&y.value!==n.value&&(n.value=null==y.value?"":y.value),"checked"in y&&void 0!==y.checked&&y.checked!==n.checked&&(n.checked=y.checked))),n}function z(l,u,t){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,t);}}function A(l,u,t){var r,i,o;if(n.unmount&&n.unmount(l),(r=l.ref)&&z(r,null,u),t||"function"==typeof l.type||(t=null!=(i=l.__e)),l.__e=l.l=null,null!=(r=l.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount();}catch(l){n.__e(l,u);}r.base=r.__P=null;}if(r=l.__k)for(o=0;o<r.length;o++)r[o]&&A(r[o],u,t);null!=i&&a(i);}function D(n,l,u){return this.constructor(n,u)}function H(l,u,t){var r,o,c;n.__p&&n.__p(l,u),o=(r=t===i)?null:t&&t.__k||u.__k,l=p(v,null,[l]),c=[],T(u,r?u.__k=l:(t||u).__k=l,o||e,e,void 0!==u.ownerSVGElement,t&&!r?[t]:o?null:f.slice.call(u.childNodes),c,!1,t||e,r),$(c,l);}n={},l=function(n){return null!=n&&void 0===n.constructor},d.prototype.setState=function(n,l){var u=this.__s!==this.state&&this.__s||(this.__s=s({},this.state));("function"!=typeof n||(n=n(u,this.props)))&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),w(this));},d.prototype.forceUpdate=function(n){var l,u,t,r=this.__v,i=this.__v.__e,o=this.__P;o&&(l=!1!==n,u=[],t=T(o,r,s({},r),this.__n,void 0!==o.ownerSVGElement,null,u,l,null==i?m(r):i),$(u,r),t!=i&&x(r)),n&&n();},d.prototype.render=v,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,r=n.debounceRendering,n.__e=function(n,l,u){for(var t;l=l.__p;)if((t=l.__c)&&!t.__p)try{if(t.constructor&&null!=t.constructor.getDerivedStateFromError)t.setState(t.constructor.getDerivedStateFromError(n));else{if(null==t.componentDidCatch)continue;t.componentDidCatch(n);}return w(t.__E=t)}catch(l){n=l;}throw n},i=e,o=0,exports.render=H,exports.hydrate=function(n,l){H(n,l,i);},exports.createElement=p,exports.h=p,exports.Fragment=v,exports.createRef=function(){return {}},exports.isValidElement=l,exports.Component=d,exports.cloneElement=function(n,l){return l=s(s({},n.props),l),arguments.length>2&&(l.children=f.slice.call(arguments,2)),h(n.type,l,l.key||n.key,l.ref||n.ref)},exports.createContext=function(n){var l={},u={__c:"__cC"+o++,__p:n,Consumer:function(n,l){return this.shouldComponentUpdate=function(n,u,t){return t!==l},n.children(l)},Provider:function(n){var t,r=this;return this.getChildContext||(t=[],this.getChildContext=function(){return l[u.__c]=r,l},this.shouldComponentUpdate=function(n){t.some(function(l){l.__P&&(l.context=n.value,w(l));});},this.sub=function(n){t.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){t.splice(t.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Consumer.contextType=u,u},exports.toChildArray=b,exports._e=A,exports.options=n;

});
var preact_1 = preact.render;
var preact_2 = preact.hydrate;
var preact_3 = preact.createElement;
var preact_4 = preact.h;
var preact_5 = preact.Fragment;
var preact_6 = preact.createRef;
var preact_7 = preact.isValidElement;
var preact_8 = preact.Component;
var preact_9 = preact.cloneElement;
var preact_10 = preact.createContext;
var preact_11 = preact.toChildArray;
var preact_12 = preact._e;
var preact_13 = preact.options;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var middleCardStyle = {
  'margin-left': 4,
  'margin-right': 4
};
var firstCardStyle = {
  'margin-left': 0,
  'margin-right': 4
};
var lastCardStyle = {
  'margin-left': 4,
  'margin-right': 0
};
var cardTitleStyle = {
  'color': 'white',
  'font-weight': 400,
  'text-transform': 'uppercase',
  'font-size': 15,
  'font-family': 'Hurme',
  'margin-top': 8,
  'margin-bottom': 4
};
var cartSubtitleStyle = {
  'font-size': 14,
  'font-weight': 400,
  'font-family': 'Hurme',
  'margin': 0,
  'color': '#9da2a5'
};
var cardImageStyle = {
  width: 320,
  height: 180
};

var getCardStyle = function getCardStyle(position) {
  switch (position) {
    case 'first':
      return firstCardStyle;

    case 'last':
      return lastCardStyle;

    case 'middle':
      return middleCardStyle;
  }
};

var createCard = function createCard(_ref) {
  var Box = _ref.Box,
      Text = _ref.Text,
      Image = _ref.Image;
  return function (_ref2) {
    var imageURL = _ref2.imageURL,
        title = _ref2.title,
        subtitle = _ref2.subtitle,
        _ref2$position = _ref2.position,
        position = _ref2$position === void 0 ? 'middle' : _ref2$position;
    var cardStyle = getCardStyle(position);
    return preact.createElement(Box, {
      style: cardStyle
    }, preact.createElement(Image, {
      style: cardImageStyle,
      source: imageURL
    }), preact.createElement(Text, {
      style: cardTitleStyle,
      text: "The Block"
    }), preact.createElement(Text, {
      style: cartSubtitleStyle,
      text: "Episode 28"
    }));
  };
};

var railTitleStyle = {
  'color': 'white',
  'font-family': 'Hurme',
  'font-size': 20,
  'font-weight': 600,
  'margin': 0,
  'margin-bottom': 10
};
var railCardContainerStyle = {
  'display': 'flex',
  'flex-direction': 'row'
};

var createRail = function createRail(_ref3, Card) {
  var Box = _ref3.Box,
      Text = _ref3.Text,
      Image = _ref3.Image;
  return function (_ref4
  /*: RailProps*/
  ) {
    var cards = _ref4.cards;
    return preact.createElement(Box, null, preact.createElement(Text, {
      style: railTitleStyle,
      text: "Recently Added"
    }), preact.createElement(Box, {
      style: railCardContainerStyle
    }, cards.map(function (card) {
      return preact.createElement(Card, {
        subtitle: card.subtitle,
        title: card.title,
        imageURL: card.imageURL,
        route: card.route
      });
    })));
  };
};

var createRailComponents = function createRailComponents(primitives) {
  var Card = createCard(primitives);
  var Rail = createRail(primitives, Card);
  return {
    Card: Card,
    Rail: Rail
  };
};

var createNineNowComponents = function createNineNowComponents(primitives
/*: Primitives*/
) {
  return _objectSpread2({}, createRailComponents(primitives));
};

var primitives$1 = {
  Text: function Text(props) {
    return h("p", {
      style: props.style
    }, props.text);
  },
  Box: function Box(props) {
    return h("div", {
      style: props.style
    }, props.children);
  },
  Image: function Image(props) {
    return h("img", {
      style: props.style,
      src: props.source
    });
  }
};

var _createNineNowCompone = createNineNowComponents(primitives$1),
    Card = _createNineNowCompone.Card,
    Rail = _createNineNowCompone.Rail;

var Homepage = function Homepage(_ref) {
  var children = _ref.children;
  return h("div", {
    "class": "homepage"
  }, children);
};

var NineNowWeb = function NineNowWeb() {
  var _useState = c$1(null),
      _useState2 = _slicedToArray(_useState, 2),
      homepageData = _useState2[0],
      setHomePageData = _useState2[1];

  v$1(function () {
    var client = src_1('http://localhost:1243', t(fetch, Headers));
    client.getHomepage().then(function (homepage) {
      return setHomePageData(homepage);
    })["catch"](function (error) {
      return console.error(error);
    });
  }, []);

  if (homepageData) {
    var rails = homepageData.rails;
    return h(Homepage, null, rails.map(function (rail) {
      return h(Rail, {
        cards: rail.cards,
        callToAction: rail.callToAction
      });
    }));
  }

  return 'Loading';
};

var main = function main() {
  var body = document.body;

  if (body) {
    var reactRoot = document.createElement('div');
    body.append(reactRoot);
    I(h(NineNowWeb, null), reactRoot);
  }
};

main();
