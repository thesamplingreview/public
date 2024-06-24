/**
 * Empty object
 *
 * @param  {object}  obj - object to check
 * @return boolean
 */
export function isEmptyObj(obj) {
  return !(obj && Object.keys(obj).length);
}

/**
 * Is email string
 *
 * @param  {string}  str - string to check
 * @return boolean
 */
export function isEmail(str) {
  return str.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

/**
 * Get nested object value using dot pattern
 *
 * @param  {object}  obj - object
 * @param  {string}  path - dotted string path
 * @return Any
 */
export function getValue(obj, path) {
  return path
    .replace(/\[|\]\.?/g, '.')
    .split('.')
    .filter((s) => s)
    .reduce((acc, val) => acc && acc[val], obj);
}

/**
 * Compare array if matched
 *
 * @param  {array}  arr1
 * @param  {array}  arr2
 * @return boolean
 */
export function isArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Format number to readable string
 *
 * @param  {int}  number
 * @param  {any}  fallback
 * @return string
 */
export function formatNumber(number, fallback = '-') {
  return !Number.isNaN(number) ? number.toLocaleString() : fallback;
}

/**
 * Format number to humanize string
 *
 * @param  {int}  number
 * @param  {any}  fallback
 * @return string
 */
export function formatNumberGroup(number, fallback = '-') {
  if (Number.isNaN(number)) {
    return fallback;
  }
  if (number < 1000) {
    return number.toString();
  }
  // thousand
  if (number < 1000000) {
    const result = (number / 1000);
    return result % 1 === 0 ? `${result.toFixed(0)}k` : `${result.toFixed(1)}k`;
  }
  // millions
  const result = (number / 1000000);
  return result % 1 === 0 ? `${result.toFixed(0)}m` : `${result.toFixed(1)}m`;
}

/**
 * Format bytes to humanize string
 *
 * @param  {int}  bytes
 * @return string
 */
export function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const fileSize = parseFloat((bytes / (k ** i)).toFixed(2));
  return `${fileSize} ${sizes[i]}`;
}

/**
 * Get all input from <form>
 *
 * @param  {FormElement}  form
 * @param  {array}  ignore - ignore field
 * @return object
 */
export function getFormData(form, ignore = []) {
  const formData = new FormData(form);
  const input = {};
  formData.forEach((value, key) => {
    if (!ignore.includes(key)) {
      input[key] = value;
    }
  });

  return input;
}

/**
 * Convert object to formData
 *
 * @param  {object}  input
 * @param  {FormData}  formData - internal
 * @param  {string}  parentKey - internal
 * @return FormData
 */
export function toFormData(input, formData = null, parentKey = '') {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  Object.keys(input).forEach((key) => {
    const propName = parentKey ? `${parentKey}[${key}]` : key;
    const value = input[key];

    // skip if null
    if (value === null) {
      return;
    }

    /* eslint-disable brace-style */
    // File support (window only)
    if (value instanceof File || value instanceof Blob) {
      formData.append(propName, value);
    }
    // boolean
    else if (typeof value === 'boolean') {
      if (value) {
        formData.append(propName, value);
      }
    }
    // object -> re-loop
    else if (typeof value === 'object' && !Array.isArray(value)) {
      toFormData(value, formData, propName);
    }
    // array -> re-loop each
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item === null) {
          return;
        }
        if (typeof item === 'object') {
          toFormData(item, formData, `${propName}[${index}]`);
        }
        else if (item instanceof File || item instanceof Blob) {
          formData.append(`${propName}[${index}]`, item);
        }
        else if (typeof item === 'boolean') {
          if (item) {
            formData.append(`${propName}[${index}]`, item);
          }
        }
        else {
          formData.append(`${propName}[${index}]`, item);
        }
      });
    }
    // others
    else {
      formData.append(propName, value);
    }
    /* eslint-enable brace-style */
  });
  return formData;
}

/**
 * Dynamic string with data mapping
 *
 * @param  {string}  str
 * @param  {object}  data
 * @return string
 */
export function toStringWithData(str, data = {}) {
  return str.replace(/%%(.*?)%%/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}
