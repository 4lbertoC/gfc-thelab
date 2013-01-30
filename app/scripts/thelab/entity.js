define(['jquery'], function ($) {
	'use strict';
	/**
	 *	Base class for objects that have a representation on the DOM.
	 */

	/* Private variables */
	var _marginLeft = 45;
	var _marginTop = 20;
	var _marginRight = 120;
	var _marginBottom = 55;
	var _margins = [_marginTop, _marginRight, _marginBottom, _marginLeft];

	var Entity = function () {

	};
	Entity.prototype = {
		addToParent: function (entityDomNode, refDomNode, dimensions) {
			/**
			 *	Adds the entity to the parent at a random position.
			 *  @param entityDomNode {HTMLElement} The entity's DOM node.
			 *  @param refDomNode {HTMLElement} The parent's DOM node.
			 *  @param dimensions {Array.<number>} The size of the entity expressed as [width, height].
			 */
			if((refDomNode instanceof HTMLElement) && (entityDomNode instanceof HTMLElement) && (dimensions instanceof Array) && (dimensions.length > 1)) {
				var position = this.calculatePositionInParent(refDomNode, dimensions);
				if(position.length > 1) {
					$(entityDomNode).css({
						'transform': 'translate3d(' + position[0] + 'px,' + position[1] + 'px,0)'
					});
					// entityDomNode.style.left = position[0] + 'px';
					// entityDomNode.style.top = position[1] + 'px';
				}
				refDomNode.appendChild(entityDomNode);
			}
		},
		calculatePositionInParent: function (refDomNode, dimensions, optMargins) {
			/**
			 *	Return [-1, -1] if the bugterium is too big for its container.
			 *	@param refDomNode {HTMLElement} The parent element.
			 *	@param dimensions {Array.<number>} The size of the element expressed as [width, height].
			 *	@param optMargins {Array.<number>=} The margins of the parent element, expressed as:
			 *		[marginTop, marginRight, marginBottom, marginLeft]. If not given, uses default.
			 *  @return {Array} The calculated position.
			 */
			if(refDomNode instanceof HTMLElement) {
				var margins = optMargins || _margins;
				var w = refDomNode.offsetWidth;
				var h = refDomNode.offsetHeight;
				var maxX = w - dimensions[0] - margins[1];
				var maxY = h - dimensions[1] - margins[2];
				if(maxX < margins[3] || maxY < margins[0]) {
					return [-1, -1];
				}
				var x = margins[3] + (Math.random() * maxX);
				var y = margins[0] + (Math.random() * maxY);
				return [x, y];
			} else {
				return [];
			}
		}
	};
	return Entity;
});