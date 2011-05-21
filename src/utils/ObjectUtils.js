/*global SPITFIRE*/

SPITFIRE.ObjectUtils = {};

//--------------------------------------
// getItemByKeys()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByKeys() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ObjectUtils.getKeyByValue = function(inObject, value) {
  for (var key in inObject) {
    if (inObject[key] === value) {
      return key;
    }
  }
  
  return undefined;
};