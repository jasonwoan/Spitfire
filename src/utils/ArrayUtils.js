/*global SPITFIRE*/

SPITFIRE.ArrayUtils = {};

//--------------------------------------
// getItemByKeys()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByKeys() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ArrayUtils.getItemByKeys = function(inArray, keyValues) {
  var i = -1,
      item, j,
      hasKeys;
  
  while (++i < inArray.length) {
    item = inArray[i];
    hasKeys = true;
    
    for (j in keyValues) {
      if (!item.hasOwnProperty(j) || item[j] !== keyValues[j]) {
        hasKeys = false;
      }
    }
        
    if (hasKeys) {
      return item;
    }
  }
  
  return undefined;
};

//--------------------------------------
// getItemsByKeys()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemsByKeys() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ArrayUtils.getItemsByKeys = function(inArray, keyValues) {
  var t = [],
      i = -1,
      item, j,
      hasKeys;
  
  while (++i < inArray.length) {
    item = inArray[i];
    hasKeys = true;
    
    for (j in keyValues) {
      if (!item.hasOwnProperty(j) || item[j] !== keyValues[j]) {
        hasKeys = false;
      }
    }
        
    if (hasKeys) {
      t.push(item);
    }
  }
  
  return t;
};

//--------------------------------------
// getItemByAnyKey()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByAnyKey() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ArrayUtils.getItemByAnyKey = function(inArray, keyValues) {
  var i = -1,
      item, j;
  
  while (++i < inArray.length) {
    item = inArray[i];
    
    for (j in keyValues) {
      if (!item.hasOwnProperty(j) || item[j] !== keyValues[j]) {
        return item;
      }
    }
  }
  
  return undefined;
};

//--------------------------------------
// getItemsByAnyKey()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemsByAnyKey() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ArrayUtils.getItemsByAnyKey = function(inArray, keyValues) {
  var t = [],
      i = -1,
      item, j,
      hasKeys;
  
  while (++i < inArray.length) {
    item = inArray[i];
    hasKeys = true;
    
    for (j in keyValues) {
      if (!item.hasOwnProperty(j) || item[j] !== keyValues[j]) {
        t.push(item);
        
        break;
      }
    }
  }
  
  return t;
};

//--------------------------------------
// getItemByKey()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByKey() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ArrayUtils.getItemByKey = function(inArray, key, match) {
  var i, len, item;
  for (i = 0, len = inArray.length; i < len; i += 1) {
    item = inArray[i];
    if (item.hasOwnProperty(key)) {
      if (item[key] === match) {
        return item;
      }
    }
  }
  
  return undefined;
};

//--------------------------------------
// getItemsByKey()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemsByKey() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ArrayUtils.getItemsByKey = function(inArray, key, match) {
  var i, len, item,
      t = [];
  for (i = 0, len = inArray.length; i < len; i += 1) {
    item = inArray[i];
    if (item.hasOwnProperty(key)) {
      if (item[key] === match) {
        t.push(item);
      }
    }
  }
  
  return t;
};

SPITFIRE.ArrayUtils.hasValue = function(inArray, value) {
  var i, len;
  for (i = 0, len = inArray.length; i < len; i += 1) {
		if (inArray[i] === value) {
			return true;
		}
  }
  
  return false;
};