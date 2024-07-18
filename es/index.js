import get from 'lodash/get';
import reduce from 'lodash/reduce';
import split from 'lodash/split';
import includes from 'lodash/includes';
import endsWith from 'lodash/endsWith';
import isEqual from 'lodash/isEqual';
import toString from 'lodash/toString';
import trim from 'lodash/trim';
import findIndex from 'lodash/findIndex';
import concat from 'lodash/concat';
import join from 'lodash/join';
import curry from 'lodash/curry';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

const detectArrayOfObject = (pathElement)=>includes(pathElement, '[{') && endsWith(pathElement, '}]');
const parsePathElement = (pathElement)=>{
    if (detectArrayOfObject(pathElement)) {
        const elements = split(pathElement, '[{');
        const objectString = trim(elements[1], '[{}]');
        const key = elements[0];
        const selector = split(objectString, '=')[0];
        const value = split(objectString, '=')[1];
        return {
            key,
            selector,
            value
        };
    }
    return undefined;
};
const getFromPath = (origin, path)=>{
    if (!path) {
        return origin;
    }
    return get(origin, path);
};
// Path shapes:
// a.b
// a[0].b
// a[{id=1}].b
// [0].b
// [{id=1}].b
const normalizePath = (origin, path = '')=>{
    const magicRegex = new RegExp(/\.(?![^[]*\])/, 'g');
    const pathElements = split(path, magicRegex);
    const newValue = reduce(pathElements, (result, pathElement)=>{
        if (detectArrayOfObject(pathElement)) {
            const { key, selector, value } = parsePathElement(pathElement);
            const newPathArray = key ? concat(result, key) : result;
            const newPath = join(newPathArray, '.');
            const valueFromKey = getFromPath(origin, newPath);
            const newIndex = findIndex(valueFromKey, (objectInArray)=>isEqual(toString(get(objectInArray, selector)), value));
            return concat(result, `${key}[${newIndex}]`);
        }
        return concat(result, pathElement);
    }, []);
    return join(newValue, '.');
};
const getDeepPathFunction = (path, origin)=>normalizePath(origin, path);
const getDeepPath = curry(getDeepPathFunction);
// NormalizeGet
const normalizedGetFunction = (path, origin)=>{
    const normalizedPath = normalizePath(origin, path);
    return get(origin, normalizedPath);
};
const deepGet = curry(normalizedGetFunction);
// NormalizeSet
const normalizedSetFunction = (path, data, origin)=>{
    const normalizedPath = normalizePath(origin, path);
    const newOrigin = cloneDeep(origin);
    set(newOrigin, normalizedPath, data);
    return newOrigin;
};
const deepSet = curry(normalizedSetFunction);
// NormalizeUpdate
const normalizedUpdateFunction = (path, updateFunction, origin)=>{
    const normalizedPath = normalizePath(origin, path);
    const newOrigin = cloneDeep(origin);
    const oldData = get(origin, normalizedPath);
    const newData = updateFunction(oldData);
    set(newOrigin, normalizedPath, newData);
    return newOrigin;
};
const deepUpdate = curry(normalizedUpdateFunction);

export { deepGet, deepSet, deepUpdate, normalizePath as default, detectArrayOfObject, getDeepPath, normalizePath, normalizedGetFunction, normalizedSetFunction, normalizedUpdateFunction, parsePathElement };
