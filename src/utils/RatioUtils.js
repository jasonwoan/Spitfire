/*global SPITFIRE*/

// Ported to JS from CasaLib AS3
// http://casalib.org/
SPITFIRE.RatioUtils = SPITFIRE.RatioUtils || {
  widthToHeight: function(size) {
    return size.width() / size.height();
  },
  
  heightToWidth: function(size) {
    return size.height() / size.width();
  },
  
  scale: function(size, amount, snapToPixel) {
    snapToPixel = snapToPixel || true;
    return SPITFIRE.RatioUtils._defineRect(size, size.width() * amount.decimalPercentage(), size.height() * amount.decimalPercentage(), snapToPixel);
  },
  
  /**
   *  Scales the width of an area while preserving aspect ratio.
   *
   *  @param size: The area's width and height expressed as a <code>Rectangle</code>. The <code>Rectangle</code>'s <code>x</code> and <code>y</code> values are ignored.
   *  @param height: The new height of the area.
	 *  @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
	 */
  scaleWidth: function(size, height, snapToPixel) {
    snapToPixel = snapToPixel || true;
    return SPITFIRE.RatioUtils._defineRect(size, height * SPITFIRE.RatioUtils.widthToHeight(size), height, snapToPixel);
  },
  
  /**
   *  Scales the height of an area while preserving aspect ratio.
   *
   *  @param size: The area's width and height expressed as a <code>Rectangle</code>. The <code>Rectangle</code>'s <code>x</code> and <code>y</code> values are ignored.
   *  @param width: The new width of the area.
   *  @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
   */
  scaleHeight: function(size, width, snapToPixel) {
    snapToPixel = snapToPixel || true;
    return SPITFIRE.RatioUtils._defineRect(size, width, width * SPITFIRE.RatioUtils.heightToWidth(size), snapToPixel);
  },
  
  scaleToFill: function(size, bounds, snapToPixel) {
    snapToPixel = snapToPixel || true;
    var scaled = SPITFIRE.RatioUtils.scaleHeight(size, bounds.width(), snapToPixel);
		
		if (scaled.height() < bounds.height()) {
			scaled = SPITFIRE.RatioUtils.scaleWidth(size, bounds.height(), snapToPixel);
		}
		
		return scaled;
  },
  
  scaleToFit: function(size, bounds, snapToPixel) {
    snapToPixel = snapToPixel || true;
    var scaled = SPITFIRE.RatioUtils.scaleHeight(size, bounds.width(), snapToPixel);
		
		if (scaled.height() > bounds.height()) {
			scaled = SPITFIRE.RatioUtils.scaleWidth(size, bounds.height(), snapToPixel);
		}
		
		return scaled;
  },
  
  _defineRect: function(size, width, height, snapToPixel) {
    var scaled = size.clone();
    scaled.width(snapToPixel ? ~~(width) : width);
    scaled.height(snapToPixel ? ~~(height) : height);
    
    return scaled;
  }
};