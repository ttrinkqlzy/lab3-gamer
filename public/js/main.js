/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   popperGenerator: () => (/* binding */ popperGenerator)
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isLayoutViewport)
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* binding */ afterMain),
/* harmony export */   afterRead: () => (/* binding */ afterRead),
/* harmony export */   afterWrite: () => (/* binding */ afterWrite),
/* harmony export */   auto: () => (/* binding */ auto),
/* harmony export */   basePlacements: () => (/* binding */ basePlacements),
/* harmony export */   beforeMain: () => (/* binding */ beforeMain),
/* harmony export */   beforeRead: () => (/* binding */ beforeRead),
/* harmony export */   beforeWrite: () => (/* binding */ beforeWrite),
/* harmony export */   bottom: () => (/* binding */ bottom),
/* harmony export */   clippingParents: () => (/* binding */ clippingParents),
/* harmony export */   end: () => (/* binding */ end),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   main: () => (/* binding */ main),
/* harmony export */   modifierPhases: () => (/* binding */ modifierPhases),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   popper: () => (/* binding */ popper),
/* harmony export */   read: () => (/* binding */ read),
/* harmony export */   reference: () => (/* binding */ reference),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   top: () => (/* binding */ top),
/* harmony export */   variationPlacements: () => (/* binding */ variationPlacements),
/* harmony export */   viewport: () => (/* binding */ viewport),
/* harmony export */   write: () => (/* binding */ write)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterMain),
/* harmony export */   afterRead: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterRead),
/* harmony export */   afterWrite: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterWrite),
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.arrow),
/* harmony export */   auto: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.auto),
/* harmony export */   basePlacements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements),
/* harmony export */   beforeMain: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeMain),
/* harmony export */   beforeRead: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeRead),
/* harmony export */   beforeWrite: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeWrite),
/* harmony export */   bottom: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom),
/* harmony export */   clippingParents: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.computeStyles),
/* harmony export */   createPopper: () => (/* reexport safe */ _popper_js__WEBPACK_IMPORTED_MODULE_4__.createPopper),
/* harmony export */   createPopperBase: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__.createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   end: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.end),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.hide),
/* harmony export */   left: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.left),
/* harmony export */   main: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.main),
/* harmony export */   modifierPhases: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.offset),
/* harmony export */   placements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements),
/* harmony export */   popper: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.preventOverflow),
/* harmony export */   read: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.read),
/* harmony export */   reference: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference),
/* harmony export */   right: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.right),
/* harmony export */   start: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.start),
/* harmony export */   top: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.top),
/* harmony export */   variationPlacements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements),
/* harmony export */   viewport: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport),
/* harmony export */   write: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.write)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popper.js */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");








 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   mapToStyles: () => (/* binding */ mapToStyles)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   arrow: () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   computeStyles: () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   flip: () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   hide: () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   offset: () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   distanceAndSkiddingToXY: () => (/* binding */ distanceAndSkiddingToXY)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   round: () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUAString)
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   within: () => (/* binding */ within),
/* harmony export */   withinMaxClamp: () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./resources/js/main.js":
/*!******************************!*\
  !*** ./resources/js/main.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fortawesome_fontawesome_free_css_all_min_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @fortawesome/fontawesome-free/css/all.min.css */ "./node_modules/@fortawesome/fontawesome-free/css/all.min.css");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.esm.js");
/* harmony import */ var _images_logitech_gpro_jpg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../images/logitech-gpro.jpg */ "./resources/images/logitech-gpro.jpg");
/* harmony import */ var _images_razer_viper_jpg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../images/razer-viper.jpg */ "./resources/images/razer-viper.jpg");
/* harmony import */ var _images_hyperx_alloy_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../images/hyperx-alloy.jpg */ "./resources/images/hyperx-alloy.jpg");
/* harmony import */ var _images_steelseries_apex_jpg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../images/steelseries-apex.jpg */ "./resources/images/steelseries-apex.jpg");
/* harmony import */ var _images_razer_goliathus_jpg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../images/razer-goliathus.jpg */ "./resources/images/razer-goliathus.jpg");
//подключение иконок fontawesome


//подключение bootstrap как модуля


//подключение картинок через импорт, чтобы webpack их скопировал






//данные товаров, структура одинаковая, отличается содержимое
var products = [{
  img: _images_logitech_gpro_jpg__WEBPACK_IMPORTED_MODULE_2__["default"],
  type: 'Игровая мышь',
  title: 'Logitech G Pro X Superlight',
  shortDesc: 'Сенсор HERO 25K, вес 63 г.',
  fullDesc: 'Беспроводная игровая мышь с сенсором HERO 25K. Ускорение до 40 G, вес всего 63 грамма. Идеальна для шутеров.',
  hintWord: 'HERO 25K',
  //слово, которое станет подсказкой
  hintText: 'Оптический сенсор с максимальным разрешением 25 600 DPI'
}, {
  img: _images_razer_viper_jpg__WEBPACK_IMPORTED_MODULE_3__["default"],
  type: 'Игровая мышь',
  title: 'Razer Viper V2 Pro',
  shortDesc: 'Сенсор Focus Pro 30K, вес 58 г.',
  fullDesc: 'Симметричная беспроводная мышь с сенсором Focus Pro 30K. Ускорение 70 G, вес 58 грамм.',
  hintWord: 'Focus Pro 30K',
  hintText: 'Сенсор с разрешением 30 000 DPI'
}, {
  img: _images_hyperx_alloy_jpg__WEBPACK_IMPORTED_MODULE_4__["default"],
  type: 'Механическая клавиатура',
  title: 'HyperX Alloy Origins 60',
  shortDesc: 'Переключатели HyperX Red, форм-фактор 60%.',
  fullDesc: 'Компактная механическая клавиатура формата 60%. Переключатели HyperX Red, кейкапы PBT double-shot. Вес 780 г.',
  hintWord: 'HyperX Red',
  hintText: 'Линейные механические переключатели без тактильной отдачи'
}, {
  img: _images_steelseries_apex_jpg__WEBPACK_IMPORTED_MODULE_5__["default"],
  type: 'Механическая клавиатура',
  title: 'SteelSeries Apex Pro TKL',
  shortDesc: 'Аналоговые переключатели OmniPoint.',
  fullDesc: 'Клавиатура с настраиваемыми аналоговыми переключателями OmniPoint. Регулируемая точка срабатывания, вес 900 г.',
  hintWord: 'OmniPoint',
  hintText: 'Точка срабатывания от 0.4 до 3.6 мм'
}, {
  img: _images_razer_goliathus_jpg__WEBPACK_IMPORTED_MODULE_6__["default"],
  type: 'Игровой коврик',
  title: 'Razer Goliathus Chroma Extended',
  shortDesc: 'Размер 940×410 мм, тканевый.',
  fullDesc: 'Расширенный игровой коврик 940×410×4 мм. Тканевое покрытие, прошитый край, подсветка Chroma RGB.',
  hintWord: 'Chroma',
  hintText: 'Подсветка Razer с 16.8 млн цветов'
}];

//генерация карточек
//классы col-12 col-sm-6 col-lg-4 из сетки bootstrap
//классы card, card-body, card-title из компонента card
var row = document.getElementById('cardsRow');
products.forEach(function (p, idx) {
  var col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-4'; //адаптив 1/2/3 колонки
  col.innerHTML = "\n    <div class=\"card product-card h-100\">\n      <div class=\"card-img-wrapper\">\n        <img src=\"".concat(p.img, "\" class=\"card-img-top\" alt=\"").concat(p.title, "\" title=\"").concat(p.title, "\">\n        <span class=\"card-type\">").concat(p.type, "</span>\n      </div>\n      <div class=\"card-body d-flex flex-column\">\n        <h5 class=\"card-title\">").concat(p.title, "</h5>\n        <p class=\"card-text small flex-grow-1\">").concat(p.shortDesc, "</p>\n        <button class=\"btn btn-primary btn-sm mt-2\" data-index=\"").concat(idx, "\">\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</button>\n      </div>\n    </div>\n  ");
  row.appendChild(col);
});

//инициализация модалки
var modalEl = document.getElementById('infoModal');
var modal = new bootstrap__WEBPACK_IMPORTED_MODULE_1__.Modal(modalEl);
var modalTitle = document.getElementById('modalTitle');
var modalImage = document.getElementById('modalImage');
var modalText = document.getElementById('modalText');
var currentIndex = 0; //номер открытого товара
var currentPopover = null; //ссылка на активный popover

//функция заполняет модалку товаром под номером i
function renderModal(i) {
  //зацикливаем индекс, чтобы не выйти за границы массива
  currentIndex = (i + products.length) % products.length;
  var p = products[currentIndex];

  //уничтожаем старый popover, иначе они накопятся
  if (currentPopover) {
    currentPopover.dispose();
    currentPopover = null;
  }
  modalTitle.textContent = p.title;
  modalImage.src = p.img;
  modalImage.alt = p.title;
  modalImage.title = p.title;

  //popover через bootstrap
  //оборачиваем слово-подсказку в span с атрибутами data-bs
  modalText.innerHTML = p.fullDesc.replace(p.hintWord, "<span class=\"hint\" tabindex=\"0\"\n      data-bs-toggle=\"popover\"\n      data-bs-content=\"".concat(p.hintText, "\">").concat(p.hintWord, "</span>"));
  var hintEl = modalText.querySelector('.hint');
  if (hintEl) {
    currentPopover = new bootstrap__WEBPACK_IMPORTED_MODULE_1__.Popover(hintEl, {
      trigger: 'click',
      //открывается по клику
      placement: 'top',
      //сверху от слова
      container: 'body' //вынести в body, чтобы не обрезался рамкой модалки
    });
  }
}

//открытие модалки по кнопке подробнее
document.querySelectorAll('[data-index]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    renderModal(Number(btn.dataset.index)); //берём номер из data-index
    modal.show();
  });
});

//кнопки-стрелки внутри модалки
document.getElementById('prevBtn').addEventListener('click', function () {
  return renderModal(currentIndex - 1);
});
document.getElementById('nextBtn').addEventListener('click', function () {
  return renderModal(currentIndex + 1);
});

//переключение стрелками клавиатуры РУ
document.addEventListener('keydown', function (e) {
  if (!modalEl.classList.contains('show')) return; //только если модалка открыта
  if (e.key === 'ArrowLeft') renderModal(currentIndex - 1);
  if (e.key === 'ArrowRight') renderModal(currentIndex + 1);
});

//тост
//autohide false, чтобы иконка крутилась бесконечно
var toastEl = document.getElementById('loadToast');
var toast = new bootstrap__WEBPACK_IMPORTED_MODULE_1__.Toast(toastEl, {
  autohide: false
});
document.getElementById('loadBtn').addEventListener('click', function () {
  return toast.show();
});

//заглушка для кнопки оформить заказ
document.getElementById('orderBtn').addEventListener('click', function () {
  alert('Спасибо за интерес! Менеджер свяжется с вами в течение 15 минут.');
});

/***/ }),

/***/ "./node_modules/bootstrap/dist/js/bootstrap.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/bootstrap/dist/js/bootstrap.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alert: () => (/* binding */ Alert),
/* harmony export */   Button: () => (/* binding */ Button),
/* harmony export */   Carousel: () => (/* binding */ Carousel),
/* harmony export */   Collapse: () => (/* binding */ Collapse),
/* harmony export */   Dropdown: () => (/* binding */ Dropdown),
/* harmony export */   Modal: () => (/* binding */ Modal),
/* harmony export */   Offcanvas: () => (/* binding */ Offcanvas),
/* harmony export */   Popover: () => (/* binding */ Popover),
/* harmony export */   ScrollSpy: () => (/* binding */ ScrollSpy),
/* harmony export */   Tab: () => (/* binding */ Tab),
/* harmony export */   Toast: () => (/* binding */ Toast),
/* harmony export */   Tooltip: () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/index.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/*!
  * Bootstrap v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */


/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const elementMap = new Map();
const Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }
    const instanceMap = elementMap.get(element);

    // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }
    instanceMap.set(key, instance);
  },
  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }
    return null;
  },
  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }
    const instanceMap = elementMap.get(element);
    instanceMap.delete(key);

    // free up element references if there are no instances left for an element
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend';

/**
 * Properly escape IDs selectors to handle weird IDs
 * @param {string} selector
 * @returns {string}
 */
const parseSelector = selector => {
  if (selector && window.CSS && window.CSS.escape) {
    // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
    selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
  }
  return selector;
};

// Shout-out Angus Croll (https://goo.gl/pxwQGp)
const toType = object => {
  if (object === null || object === undefined) {
    return `${object}`;
  }
  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};

/**
 * Public Util API
 */

const getUID = prefix => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));
  return prefix;
};
const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  }

  // Get transition-duration of the element
  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay);

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};
const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};
const isElement = object => {
  if (!object || typeof object !== 'object') {
    return false;
  }
  if (typeof object.jquery !== 'undefined') {
    object = object[0];
  }
  return typeof object.nodeType !== 'undefined';
};
const getElement = object => {
  // it's a jQuery object or a node element
  if (isElement(object)) {
    return object.jquery ? object[0] : object;
  }
  if (typeof object === 'string' && object.length > 0) {
    return document.querySelector(parseSelector(object));
  }
  return null;
};
const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }
  const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  // Handle `details` element as its content may falsie appear visible when it is closed
  const closedDetails = element.closest('details:not([open])');
  if (!closedDetails) {
    return elementIsVisible;
  }
  if (closedDetails !== element) {
    const summary = element.closest('summary');
    if (summary && summary.parentNode !== closedDetails) {
      return false;
    }
    if (summary === null) {
      return false;
    }
  }
  return elementIsVisible;
};
const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }
  if (element.classList.contains('disabled')) {
    return true;
  }
  if (typeof element.disabled !== 'undefined') {
    return element.disabled;
  }
  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};
const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null;
  }

  // Can find the shadow root otherwise it'll return the document
  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }
  if (element instanceof ShadowRoot) {
    return element;
  }

  // when we don't find a shadow root
  if (!element.parentNode) {
    return null;
  }
  return findShadowRoot(element.parentNode);
};
const noop = () => {};

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = element => {
  element.offsetHeight; // eslint-disable-line no-unused-expressions
};
const getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return window.jQuery;
  }
  return null;
};
const DOMContentLoadedCallbacks = [];
const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        for (const callback of DOMContentLoadedCallbacks) {
          callback();
        }
      });
    }
    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};
const isRTL = () => document.documentElement.dir === 'rtl';
const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */
    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;
      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};
const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
  return typeof possibleCallback === 'function' ? possibleCallback.call(...args) : defaultValue;
};
const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }
  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;
  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }
    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };
  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};

/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  const listLength = list.length;
  let index = list.indexOf(activeElement);

  // if the element does not exist in the list return an element
  // depending on the direction and if cycle is allowed
  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
  }
  index += shouldGetNext ? 1 : -1;
  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }
  return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

/**
 * Private methods
 */

function makeEventUid(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}
function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}
function bootstrapHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, {
      delegateTarget: element
    });
    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }
    return fn.apply(element, [event]);
  };
}
function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);
    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }
        hydrateObj(event, {
          delegateTarget: target
        });
        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }
        return fn.apply(target, [event]);
      }
    }
  };
}
function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}
function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string';
  // TODO: tooltip passes `false` instead of selector, so we need to check
  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);
  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }
  return [isDelegated, callable, typeEvent];
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }
  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };
    callable = wrapFunction(callable);
  }
  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }
  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, isDelegated);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);
  if (!fn) {
    return;
  }
  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}
function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}
const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },
  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },
  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }
    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');
    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }
      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }
    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }
    for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');
      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  },
  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }
    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    let jQueryEvent = null;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);
      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }
    const evt = hydrateObj(new Event(event, {
      bubbles,
      cancelable: true
    }), args);
    if (defaultPrevented) {
      evt.preventDefault();
    }
    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }
    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault();
    }
    return evt;
  }
};
function hydrateObj(obj, meta = {}) {
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch (_unused) {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        }
      });
    }
  }
  return obj;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

function normalizeData(value) {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (value === Number(value).toString()) {
    return Number(value);
  }
  if (value === '' || value === 'null') {
    return null;
  }
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (_unused) {
    return value;
  }
}
function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
}
const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },
  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },
  getDataAttributes(element) {
    if (!element) {
      return {};
    }
    const attributes = {};
    const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, '');
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    }
    return attributes;
  },
  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Class definition
 */

class Config {
  // Getters
  static get Default() {
    return {};
  }
  static get DefaultType() {
    return {};
  }
  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    return config;
  }
  _mergeConfigObj(config, element) {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

    return {
      ...this.constructor.Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    };
  }
  _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    for (const [property, expectedTypes] of Object.entries(configTypes)) {
      const value = config[property];
      const valueType = isElement(value) ? 'element' : toType(value);
      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const VERSION = '5.3.8';

/**
 * Class definition
 */

class BaseComponent extends Config {
  constructor(element, config) {
    super();
    element = getElement(element);
    if (!element) {
      return;
    }
    this._element = element;
    this._config = this._getConfig(config);
    Data.set(this._element, this.constructor.DATA_KEY, this);
  }

  // Public
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }

  // Private
  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }

  // Static
  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }
  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
  }
  static get VERSION() {
    return VERSION;
  }
  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
  static eventName(name) {
    return `${name}${this.EVENT_KEY}`;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target');
  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href');

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
      return null;
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    }
    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
  }
  return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null;
};
const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },
  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },
  children(element, selector) {
    return [].concat(...element.children).filter(child => child.matches(selector));
  },
  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode.closest(selector);
    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }
    return parents;
  },
  prev(element, selector) {
    let previous = element.previousElementSibling;
    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }
      previous = previous.previousElementSibling;
    }
    return [];
  },
  // TODO: this is now unused; remove later along with prev()
  next(element, selector) {
    let next = element.nextElementSibling;
    while (next) {
      if (next.matches(selector)) {
        return [next];
      }
      next = next.nextElementSibling;
    }
    return [];
  },
  focusableChildren(element) {
    const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
  },
  getSelectorFromElement(element) {
    const selector = getSelector(element);
    if (selector) {
      return SelectorEngine.findOne(selector) ? selector : null;
    }
    return null;
  },
  getElementFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.findOne(selector) : null;
  },
  getMultipleElementsFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.find(selector) : [];
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target);

    // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
    instance[method]();
  });
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$f = 'alert';
const DATA_KEY$a = 'bs.alert';
const EVENT_KEY$b = `.${DATA_KEY$a}`;
const EVENT_CLOSE = `close${EVENT_KEY$b}`;
const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
const CLASS_NAME_FADE$5 = 'fade';
const CLASS_NAME_SHOW$8 = 'show';

/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$f;
  }

  // Public
  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
    if (closeEvent.defaultPrevented) {
      return;
    }
    this._element.classList.remove(CLASS_NAME_SHOW$8);
    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  }

  // Private
  _destroyElement() {
    this._element.remove();
    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Alert, 'close');

/**
 * jQuery
 */

defineJQueryPlugin(Alert);

/**
 * --------------------------------------------------------------------------
 * Bootstrap button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$e = 'button';
const DATA_KEY$9 = 'bs.button';
const EVENT_KEY$a = `.${DATA_KEY$9}`;
const DATA_API_KEY$6 = '.data-api';
const CLASS_NAME_ACTIVE$3 = 'active';
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;

/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$e;
  }

  // Public
  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);
      if (config === 'toggle') {
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button);
  data.toggle();
});

/**
 * jQuery
 */

defineJQueryPlugin(Button);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/swipe.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$d = 'swipe';
const EVENT_KEY$9 = '.bs.swipe';
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
const CLASS_NAME_POINTER_EVENT = 'pointer-event';
const SWIPE_THRESHOLD = 40;
const Default$c = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
};
const DefaultType$c = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)'
};

/**
 * Class definition
 */

class Swipe extends Config {
  constructor(element, config) {
    super();
    this._element = element;
    if (!element || !Swipe.isSupported()) {
      return;
    }
    this._config = this._getConfig(config);
    this._deltaX = 0;
    this._supportPointerEvents = Boolean(window.PointerEvent);
    this._initEvents();
  }

  // Getters
  static get Default() {
    return Default$c;
  }
  static get DefaultType() {
    return DefaultType$c;
  }
  static get NAME() {
    return NAME$d;
  }

  // Public
  dispose() {
    EventHandler.off(this._element, EVENT_KEY$9);
  }

  // Private
  _start(event) {
    if (!this._supportPointerEvents) {
      this._deltaX = event.touches[0].clientX;
      return;
    }
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX;
    }
  }
  _end(event) {
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX - this._deltaX;
    }
    this._handleSwipe();
    execute(this._config.endCallback);
  }
  _move(event) {
    this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
  }
  _handleSwipe() {
    const absDeltaX = Math.abs(this._deltaX);
    if (absDeltaX <= SWIPE_THRESHOLD) {
      return;
    }
    const direction = absDeltaX / this._deltaX;
    this._deltaX = 0;
    if (!direction) {
      return;
    }
    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
  }
  _initEvents() {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
      EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));
      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
    }
  }
  _eventIsPointerPenTouch(event) {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
  }

  // Static
  static isSupported() {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$c = 'carousel';
const DATA_KEY$8 = 'bs.carousel';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$5 = '.data-api';
const ARROW_LEFT_KEY$1 = 'ArrowLeft';
const ARROW_RIGHT_KEY$1 = 'ArrowRight';
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const ORDER_NEXT = 'next';
const ORDER_PREV = 'prev';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
const EVENT_SLID = `slid${EVENT_KEY$8}`;
const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE$2 = 'active';
const CLASS_NAME_SLIDE = 'slide';
const CLASS_NAME_END = 'carousel-item-end';
const CLASS_NAME_START = 'carousel-item-start';
const CLASS_NAME_NEXT = 'carousel-item-next';
const CLASS_NAME_PREV = 'carousel-item-prev';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ITEM = '.carousel-item';
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_ITEM_IMG = '.carousel-item img';
const SELECTOR_INDICATORS = '.carousel-indicators';
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
};
const Default$b = {
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  ride: false,
  touch: true,
  wrap: true
};
const DefaultType$b = {
  interval: '(number|boolean)',
  // TODO:v6 remove boolean support
  keyboard: 'boolean',
  pause: '(string|boolean)',
  ride: '(boolean|string)',
  touch: 'boolean',
  wrap: 'boolean'
};

/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._interval = null;
    this._activeElement = null;
    this._isSliding = false;
    this.touchTimeout = null;
    this._swipeHelper = null;
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
    this._addEventListeners();
    if (this._config.ride === CLASS_NAME_CAROUSEL) {
      this.cycle();
    }
  }

  // Getters
  static get Default() {
    return Default$b;
  }
  static get DefaultType() {
    return DefaultType$b;
  }
  static get NAME() {
    return NAME$c;
  }

  // Public
  next() {
    this._slide(ORDER_NEXT);
  }
  nextWhenVisible() {
    // FIXME TODO use `document.visibilityState`
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }
  prev() {
    this._slide(ORDER_PREV);
  }
  pause() {
    if (this._isSliding) {
      triggerTransitionEnd(this._element);
    }
    this._clearInterval();
  }
  cycle() {
    this._clearInterval();
    this._updateInterval();
    this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
  }
  _maybeEnableCycle() {
    if (!this._config.ride) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
      return;
    }
    this.cycle();
  }
  to(index) {
    const items = this._getItems();
    if (index > items.length - 1 || index < 0) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }
    const activeIndex = this._getItemIndex(this._getActive());
    if (activeIndex === index) {
      return;
    }
    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
    this._slide(order, items[index]);
  }
  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose();
    }
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    config.defaultInterval = config.interval;
    return config;
  }
  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
    }
    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
      EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
    }
    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners();
    }
  }
  _addTouchEventListeners() {
    for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
    }
    const endCallBack = () => {
      if (this._config.pause !== 'hover') {
        return;
      }

      // If it's a touch-enabled device, mouseenter/leave are fired as
      // part of the mouse compatibility events on first tap - the carousel
      // would stop cycling until user tapped out of it;
      // here, we listen for touchend, explicitly pause the carousel
      // (as if it's the second time we tap on it, mouseenter compat event
      // is NOT fired) and after a timeout (to allow for mouse compatibility
      // events to fire) we explicitly restart cycling

      this.pause();
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }
      this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
    };
    const swipeConfig = {
      leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
      rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
      endCallback: endCallBack
    };
    this._swipeHelper = new Swipe(this._element, swipeConfig);
  }
  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }
    const direction = KEY_TO_DIRECTION[event.key];
    if (direction) {
      event.preventDefault();
      this._slide(this._directionToOrder(direction));
    }
  }
  _getItemIndex(element) {
    return this._getItems().indexOf(element);
  }
  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return;
    }
    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
    activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
    activeIndicator.removeAttribute('aria-current');
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
      newActiveIndicator.setAttribute('aria-current', 'true');
    }
  }
  _updateInterval() {
    const element = this._activeElement || this._getActive();
    if (!element) {
      return;
    }
    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
    this._config.interval = elementInterval || this._config.defaultInterval;
  }
  _slide(order, element = null) {
    if (this._isSliding) {
      return;
    }
    const activeElement = this._getActive();
    const isNext = order === ORDER_NEXT;
    const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
    if (nextElement === activeElement) {
      return;
    }
    const nextElementIndex = this._getItemIndex(nextElement);
    const triggerEvent = eventName => {
      return EventHandler.trigger(this._element, eventName, {
        relatedTarget: nextElement,
        direction: this._orderToDirection(order),
        from: this._getItemIndex(activeElement),
        to: nextElementIndex
      });
    };
    const slideEvent = triggerEvent(EVENT_SLIDE);
    if (slideEvent.defaultPrevented) {
      return;
    }
    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      // TODO: change tests that use empty divs to avoid this check
      return;
    }
    const isCycling = Boolean(this._interval);
    this.pause();
    this._isSliding = true;
    this._setActiveIndicatorElement(nextElementIndex);
    this._activeElement = nextElement;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    nextElement.classList.add(orderClassName);
    reflow(nextElement);
    activeElement.classList.add(directionalClassName);
    nextElement.classList.add(directionalClassName);
    const completeCallBack = () => {
      nextElement.classList.remove(directionalClassName, orderClassName);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
      this._isSliding = false;
      triggerEvent(EVENT_SLID);
    };
    this._queueCallback(completeCallBack, activeElement, this._isAnimated());
    if (isCycling) {
      this.cycle();
    }
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_SLIDE);
  }
  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  }
  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }
  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
  _directionToOrder(direction) {
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }
    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }
  _orderToDirection(order) {
    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Carousel.getOrCreateInstance(this, config);
      if (typeof config === 'number') {
        data.to(config);
        return;
      }
      if (typeof config === 'string') {
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }
  event.preventDefault();
  const carousel = Carousel.getOrCreateInstance(target);
  const slideIndex = this.getAttribute('data-bs-slide-to');
  if (slideIndex) {
    carousel.to(slideIndex);
    carousel._maybeEnableCycle();
    return;
  }
  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next();
    carousel._maybeEnableCycle();
    return;
  }
  carousel.prev();
  carousel._maybeEnableCycle();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel);
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$b = 'collapse';
const DATA_KEY$7 = 'bs.collapse';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const DATA_API_KEY$4 = '.data-api';
const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
const CLASS_NAME_SHOW$7 = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
const Default$a = {
  parent: null,
  toggle: true
};
const DefaultType$a = {
  parent: '(null|element)',
  toggle: 'boolean'
};

/**
 * Class definition
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isTransitioning = false;
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
    for (const elem of toggleList) {
      const selector = SelectorEngine.getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);
      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem);
      }
    }
    this._initializeChildren();
    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }
    if (this._config.toggle) {
      this.toggle();
    }
  }

  // Getters
  static get Default() {
    return Default$a;
  }
  static get DefaultType() {
    return DefaultType$a;
  }
  static get NAME() {
    return NAME$b;
  }

  // Public
  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }
  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }
    let activeChildren = [];

    // find active children
    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
        toggle: false
      }));
    }
    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    for (const activeInstance of activeChildren) {
      activeInstance.hide();
    }
    const dimension = this._getDimension();
    this._element.classList.remove(CLASS_NAME_COLLAPSE);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.style[dimension] = 0;
    this._addAriaAndCollapsedClass(this._triggerArray, true);
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      this._element.style[dimension] = '';
      EventHandler.trigger(this._element, EVENT_SHOWN$6);
    };
    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;
    this._queueCallback(complete, this._element, true);
    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    const dimension = this._getDimension();
    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
    for (const trigger of this._triggerArray) {
      const element = SelectorEngine.getElementFromSelector(trigger);
      if (element && !this._isShown(element)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE);
      EventHandler.trigger(this._element, EVENT_HIDDEN$6);
    };
    this._element.style[dimension] = '';
    this._queueCallback(complete, this._element, true);
  }

  // Private
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  }
  _configAfterMerge(config) {
    config.toggle = Boolean(config.toggle); // Coerce string values
    config.parent = getElement(config.parent);
    return config;
  }
  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }
  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }
    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
    for (const element of children) {
      const selected = SelectorEngine.getElementFromSelector(element);
      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    }
  }
  _getFirstLevelChildren(selector) {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
    // remove children if greater depth
    return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
  }
  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }
    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
      element.setAttribute('aria-expanded', isOpen);
    }
  }

  // Static
  static jQueryInterface(config) {
    const _config = {};
    if (typeof config === 'string' && /show|hide/.test(config)) {
      _config.toggle = false;
    }
    return this.each(function () {
      const data = Collapse.getOrCreateInstance(this, _config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }
  for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(Collapse);

/**
 * --------------------------------------------------------------------------
 * Bootstrap dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$a = 'dropdown';
const DATA_KEY$6 = 'bs.dropdown';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const DATA_API_KEY$3 = '.data-api';
const ESCAPE_KEY$2 = 'Escape';
const TAB_KEY$1 = 'Tab';
const ARROW_UP_KEY$1 = 'ArrowUp';
const ARROW_DOWN_KEY$1 = 'ArrowDown';
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
const CLASS_NAME_SHOW$6 = 'show';
const CLASS_NAME_DROPUP = 'dropup';
const CLASS_NAME_DROPEND = 'dropend';
const CLASS_NAME_DROPSTART = 'dropstart';
const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
const SELECTOR_MENU = '.dropdown-menu';
const SELECTOR_NAVBAR = '.navbar';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
const PLACEMENT_TOPCENTER = 'top';
const PLACEMENT_BOTTOMCENTER = 'bottom';
const Default$9 = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  popperConfig: null,
  reference: 'toggle'
};
const DefaultType$9 = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  popperConfig: '(null|object|function)',
  reference: '(string|element|object)'
};

/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._popper = null;
    this._parent = this._element.parentNode; // dropdown wrapper
    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
    this._inNavbar = this._detectNavbar();
  }

  // Getters
  static get Default() {
    return Default$9;
  }
  static get DefaultType() {
    return DefaultType$9;
  }
  static get NAME() {
    return NAME$a;
  }

  // Public
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._element) || this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._createPopper();

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    this._element.focus();
    this._element.setAttribute('aria-expanded', true);
    this._menu.classList.add(CLASS_NAME_SHOW$6);
    this._element.classList.add(CLASS_NAME_SHOW$6);
    EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
  }
  hide() {
    if (isDisabled(this._element) || !this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    this._completeHide(relatedTarget);
  }
  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }
    super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar();
    if (this._popper) {
      this._popper.update();
    }
  }

  // Private
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    if (this._popper) {
      this._popper.destroy();
    }
    this._menu.classList.remove(CLASS_NAME_SHOW$6);
    this._element.classList.remove(CLASS_NAME_SHOW$6);
    this._element.setAttribute('aria-expanded', 'false');
    Manipulator.removeDataAttribute(this._menu, 'popper');
    EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
  }
  _getConfig(config) {
    config = super._getConfig(config);
    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }
    return config;
  }
  _createPopper() {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org/docs/v2/)');
    }
    let referenceElement = this._element;
    if (this._config.reference === 'parent') {
      referenceElement = this._parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference;
    }
    const popperConfig = this._getPopperConfig();
    this._popper = _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(referenceElement, this._menu, popperConfig);
  }
  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$6);
  }
  _getPlacement() {
    const parentDropdown = this._parent;
    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER;
    }

    // We need to trim the value because custom properties can also include spaces
    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }
    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }
  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null;
  }
  _getOffset() {
    const {
      offset
    } = this._config;
    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }
    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }
    return offset;
  }
  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }]
    };

    // Disable Popper if we have a static display or Dropdown is in Navbar
    if (this._inNavbar || this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // TODO: v6 remove
      defaultBsPopperConfig.modifiers = [{
        name: 'applyStyles',
        enabled: false
      }];
    }
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [undefined, defaultBsPopperConfig])
    };
  }
  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));
    if (!items.length) {
      return;
    }

    // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
  static clearMenus(event) {
    if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
      return;
    }
    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
    for (const toggle of openToggles) {
      const context = Dropdown.getInstance(toggle);
      if (!context || context._config.autoClose === false) {
        continue;
      }
      const composedPath = event.composedPath();
      const isMenuTarget = composedPath.includes(context._menu);
      if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
        continue;
      }

      // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
      if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue;
      }
      const relatedTarget = {
        relatedTarget: context._element
      };
      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }
      context._completeHide(relatedTarget);
    }
  }
  static dataApiKeydownHandler(event) {
    // If not an UP | DOWN | ESCAPE key => not a dropdown command
    // If input/textarea && if key is other than ESCAPE => not a dropdown command

    const isInput = /input|textarea/i.test(event.target.tagName);
    const isEscapeEvent = event.key === ESCAPE_KEY$2;
    const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
    if (!isUpOrDownEvent && !isEscapeEvent) {
      return;
    }
    if (isInput && !isEscapeEvent) {
      return;
    }
    event.preventDefault();

    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
    const instance = Dropdown.getOrCreateInstance(getToggleButton);
    if (isUpOrDownEvent) {
      event.stopPropagation();
      instance.show();
      instance._selectMenuItem(event);
      return;
    }
    if (instance._isShown()) {
      // else is escape and we check if it is shown
      event.stopPropagation();
      instance.hide();
      getToggleButton.focus();
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});

/**
 * jQuery
 */

defineJQueryPlugin(Dropdown);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$9 = 'backdrop';
const CLASS_NAME_FADE$4 = 'fade';
const CLASS_NAME_SHOW$5 = 'show';
const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
const Default$8 = {
  className: 'modal-backdrop',
  clickCallback: null,
  isAnimated: false,
  isVisible: true,
  // if false, we use the backdrop helper without adding any element to the dom
  rootElement: 'body' // give the choice to place backdrop under different elements
};
const DefaultType$8 = {
  className: 'string',
  clickCallback: '(function|null)',
  isAnimated: 'boolean',
  isVisible: 'boolean',
  rootElement: '(element|string)'
};

/**
 * Class definition
 */

class Backdrop extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isAppended = false;
    this._element = null;
  }

  // Getters
  static get Default() {
    return Default$8;
  }
  static get DefaultType() {
    return DefaultType$8;
  }
  static get NAME() {
    return NAME$9;
  }

  // Public
  show(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._append();
    const element = this._getElement();
    if (this._config.isAnimated) {
      reflow(element);
    }
    element.classList.add(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      execute(callback);
    });
  }
  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._getElement().classList.remove(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      this.dispose();
      execute(callback);
    });
  }
  dispose() {
    if (!this._isAppended) {
      return;
    }
    EventHandler.off(this._element, EVENT_MOUSEDOWN);
    this._element.remove();
    this._isAppended = false;
  }

  // Private
  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement('div');
      backdrop.className = this._config.className;
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4);
      }
      this._element = backdrop;
    }
    return this._element;
  }
  _configAfterMerge(config) {
    // use getElement() with the default "body" to get a fresh Element on each instantiation
    config.rootElement = getElement(config.rootElement);
    return config;
  }
  _append() {
    if (this._isAppended) {
      return;
    }
    const element = this._getElement();
    this._config.rootElement.append(element);
    EventHandler.on(element, EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback);
    });
    this._isAppended = true;
  }
  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/focustrap.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$8 = 'focustrap';
const DATA_KEY$5 = 'bs.focustrap';
const EVENT_KEY$5 = `.${DATA_KEY$5}`;
const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
const TAB_KEY = 'Tab';
const TAB_NAV_FORWARD = 'forward';
const TAB_NAV_BACKWARD = 'backward';
const Default$7 = {
  autofocus: true,
  trapElement: null // The element to trap focus inside of
};
const DefaultType$7 = {
  autofocus: 'boolean',
  trapElement: 'element'
};

/**
 * Class definition
 */

class FocusTrap extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  }

  // Getters
  static get Default() {
    return Default$7;
  }
  static get DefaultType() {
    return DefaultType$7;
  }
  static get NAME() {
    return NAME$8;
  }

  // Public
  activate() {
    if (this._isActive) {
      return;
    }
    if (this._config.autofocus) {
      this._config.trapElement.focus();
    }
    EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop
    EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
    this._isActive = true;
  }
  deactivate() {
    if (!this._isActive) {
      return;
    }
    this._isActive = false;
    EventHandler.off(document, EVENT_KEY$5);
  }

  // Private
  _handleFocusin(event) {
    const {
      trapElement
    } = this._config;
    if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
      return;
    }
    const elements = SelectorEngine.focusableChildren(trapElement);
    if (elements.length === 0) {
      trapElement.focus();
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus();
    } else {
      elements[0].focus();
    }
  }
  _handleKeydown(event) {
    if (event.key !== TAB_KEY) {
      return;
    }
    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
const PROPERTY_PADDING = 'padding-right';
const PROPERTY_MARGIN = 'margin-right';

/**
 * Class definition
 */

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }

  // Public
  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  hide() {
    const width = this.getWidth();
    this._disableOverFlow();
    // give padding to element to balance the hidden scrollbar width
    this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
  }
  reset() {
    this._resetElementAttributes(this._element, 'overflow');
    this._resetElementAttributes(this._element, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }

  // Private
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow');
    this._element.style.overflow = 'hidden';
  }
  _setElementAttributes(selector, styleProperty, callback) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = element => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }
      this._saveInitialAttribute(element, styleProperty);
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _saveInitialAttribute(element, styleProperty) {
    const actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProperty, actualValue);
    }
  }
  _resetElementAttributes(selector, styleProperty) {
    const manipulationCallBack = element => {
      const value = Manipulator.getDataAttribute(element, styleProperty);
      // We only want to remove the property if the value is `null`; the value can also be zero
      if (value === null) {
        element.style.removeProperty(styleProperty);
        return;
      }
      Manipulator.removeDataAttribute(element, styleProperty);
      element.style.setProperty(styleProperty, value);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _applyManipulationCallback(selector, callBack) {
    if (isElement(selector)) {
      callBack(selector);
      return;
    }
    for (const sel of SelectorEngine.find(selector, this._element)) {
      callBack(sel);
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$7 = 'modal';
const DATA_KEY$4 = 'bs.modal';
const EVENT_KEY$4 = `.${DATA_KEY$4}`;
const DATA_API_KEY$2 = '.data-api';
const ESCAPE_KEY$1 = 'Escape';
const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE$3 = 'fade';
const CLASS_NAME_SHOW$4 = 'show';
const CLASS_NAME_STATIC = 'modal-static';
const OPEN_SELECTOR$1 = '.modal.show';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
const Default$6 = {
  backdrop: true,
  focus: true,
  keyboard: true
};
const DefaultType$6 = {
  backdrop: '(boolean|string)',
  focus: 'boolean',
  keyboard: 'boolean'
};

/**
 * Class definition
 */

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();
    this._addEventListeners();
  }

  // Getters
  static get Default() {
    return Default$6;
  }
  static get DefaultType() {
    return DefaultType$6;
  }
  static get NAME() {
    return NAME$7;
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._isTransitioning = true;
    this._scrollBar.hide();
    document.body.classList.add(CLASS_NAME_OPEN);
    this._adjustDialog();
    this._backdrop.show(() => this._showElement(relatedTarget));
  }
  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isShown = false;
    this._isTransitioning = true;
    this._focustrap.deactivate();
    this._element.classList.remove(CLASS_NAME_SHOW$4);
    this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
  }
  dispose() {
    EventHandler.off(window, EVENT_KEY$4);
    EventHandler.off(this._dialog, EVENT_KEY$4);
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }

  // Private
  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value,
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _showElement(relatedTarget) {
    // try to append dynamic modal
    if (!document.body.contains(this._element)) {
      document.body.append(this._element);
    }
    this._element.style.display = 'block';
    this._element.removeAttribute('aria-hidden');
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.scrollTop = 0;
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW$4);
    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate();
      }
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$4, {
        relatedTarget
      });
    };
    this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
      if (event.key !== ESCAPE_KEY$1) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      this._triggerBackdropTransition();
    });
    EventHandler.on(window, EVENT_RESIZE$1, () => {
      if (this._isShown && !this._isTransitioning) {
        this._adjustDialog();
      }
    });
    EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
      // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
      EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
        if (this._element !== event.target || this._element !== event2.target) {
          return;
        }
        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
          return;
        }
        if (this._config.backdrop) {
          this.hide();
        }
      });
    });
  }
  _hideModal() {
    this._element.style.display = 'none';
    this._element.setAttribute('aria-hidden', true);
    this._element.removeAttribute('aria-modal');
    this._element.removeAttribute('role');
    this._isTransitioning = false;
    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._scrollBar.reset();
      EventHandler.trigger(this._element, EVENT_HIDDEN$4);
    });
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE$3);
  }
  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const initialOverflowY = this._element.style.overflowY;
    // return if the following background transition hasn't yet completed
    if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
      return;
    }
    if (!isModalOverflowing) {
      this._element.style.overflowY = 'hidden';
    }
    this._element.classList.add(CLASS_NAME_STATIC);
    this._queueCallback(() => {
      this._element.classList.remove(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.style.overflowY = initialOverflowY;
      }, this._dialog);
    }, this._dialog);
    this._element.focus();
  }

  /**
   * The following methods are used to handle overflowing modals
   */

  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;
    if (isBodyOverflowing && !isModalOverflowing) {
      const property = isRTL() ? 'paddingLeft' : 'paddingRight';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
    if (!isBodyOverflowing && isModalOverflowing) {
      const property = isRTL() ? 'paddingRight' : 'paddingLeft';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  }

  // Static
  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](relatedTarget);
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  EventHandler.one(target, EVENT_SHOW$4, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$4, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  });

  // avoid conflict when clicking modal toggler while another one is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
  if (alreadyOpen) {
    Modal.getInstance(alreadyOpen).hide();
  }
  const data = Modal.getOrCreateInstance(target);
  data.toggle(this);
});
enableDismissTrigger(Modal);

/**
 * jQuery
 */

defineJQueryPlugin(Modal);

/**
 * --------------------------------------------------------------------------
 * Bootstrap offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$6 = 'offcanvas';
const DATA_KEY$3 = 'bs.offcanvas';
const EVENT_KEY$3 = `.${DATA_KEY$3}`;
const DATA_API_KEY$1 = '.data-api';
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
const ESCAPE_KEY = 'Escape';
const CLASS_NAME_SHOW$3 = 'show';
const CLASS_NAME_SHOWING$1 = 'showing';
const CLASS_NAME_HIDING = 'hiding';
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
const OPEN_SELECTOR = '.offcanvas.show';
const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
const Default$5 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
const DefaultType$5 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
};

/**
 * Class definition
 */

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._addEventListeners();
  }

  // Getters
  static get Default() {
    return Default$5;
  }
  static get DefaultType() {
    return DefaultType$5;
  }
  static get NAME() {
    return NAME$6;
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._backdrop.show();
    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.classList.add(CLASS_NAME_SHOWING$1);
    const completeCallBack = () => {
      if (!this._config.scroll || this._config.backdrop) {
        this._focustrap.activate();
      }
      this._element.classList.add(CLASS_NAME_SHOW$3);
      this._element.classList.remove(CLASS_NAME_SHOWING$1);
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._element, true);
  }
  hide() {
    if (!this._isShown) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._focustrap.deactivate();
    this._element.blur();
    this._isShown = false;
    this._element.classList.add(CLASS_NAME_HIDING);
    this._backdrop.hide();
    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    };
    this._queueCallback(completeCallback, this._element, true);
  }
  dispose() {
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }

  // Private
  _initializeBackDrop() {
    const clickCallback = () => {
      if (this._config.backdrop === 'static') {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        return;
      }
      this.hide();
    };

    // 'static' option will be translated to true, and booleans will keep their value
    const isVisible = Boolean(this._config.backdrop);
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: isVisible ? clickCallback : null
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    });
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  EventHandler.one(target, EVENT_HIDDEN$3, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus();
    }
  });

  // avoid conflict when clicking a toggler of an offcanvas, while another is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide();
  }
  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(selector).show();
  }
});
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Offcanvas.getOrCreateInstance(element).hide();
    }
  }
});
enableDismissTrigger(Offcanvas);

/**
 * jQuery
 */

defineJQueryPlugin(Offcanvas);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

// js-docs-start allow-list
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  dd: [],
  div: [],
  dl: [],
  dt: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
// js-docs-end allow-list

const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);

/**
 * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
 * contexts.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
 */
const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase();
  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
    }
    return true;
  }

  // Check if a regular expression validates the attribute.
  return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }
  if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    return sanitizeFunction(unsafeHtml);
  }
  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase();
    if (!Object.keys(allowList).includes(elementName)) {
      element.remove();
      continue;
    }
    const attributeList = [].concat(...element.attributes);
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    }
  }
  return createdDocument.body.innerHTML;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/template-factory.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$5 = 'TemplateFactory';
const Default$4 = {
  allowList: DefaultAllowlist,
  content: {},
  // { selector : text ,  selector2 : text2 , }
  extraClass: '',
  html: false,
  sanitize: true,
  sanitizeFn: null,
  template: '<div></div>'
};
const DefaultType$4 = {
  allowList: 'object',
  content: 'object',
  extraClass: '(string|function)',
  html: 'boolean',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  template: 'string'
};
const DefaultContentType = {
  entry: '(string|element|function|null)',
  selector: '(string|element)'
};

/**
 * Class definition
 */

class TemplateFactory extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
  }

  // Getters
  static get Default() {
    return Default$4;
  }
  static get DefaultType() {
    return DefaultType$4;
  }
  static get NAME() {
    return NAME$5;
  }

  // Public
  getContent() {
    return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
  }
  hasContent() {
    return this.getContent().length > 0;
  }
  changeContent(content) {
    this._checkContent(content);
    this._config.content = {
      ...this._config.content,
      ...content
    };
    return this;
  }
  toHtml() {
    const templateWrapper = document.createElement('div');
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector);
    }
    const template = templateWrapper.children[0];
    const extraClass = this._resolvePossibleFunction(this._config.extraClass);
    if (extraClass) {
      template.classList.add(...extraClass.split(' '));
    }
    return template;
  }

  // Private
  _typeCheckConfig(config) {
    super._typeCheckConfig(config);
    this._checkContent(config.content);
  }
  _checkContent(arg) {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({
        selector,
        entry: content
      }, DefaultContentType);
    }
  }
  _setContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);
    if (!templateElement) {
      return;
    }
    content = this._resolvePossibleFunction(content);
    if (!content) {
      templateElement.remove();
      return;
    }
    if (isElement(content)) {
      this._putElementInTemplate(getElement(content), templateElement);
      return;
    }
    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content);
      return;
    }
    templateElement.textContent = content;
  }
  _maybeSanitize(arg) {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [undefined, this]);
  }
  _putElementInTemplate(element, templateElement) {
    if (this._config.html) {
      templateElement.innerHTML = '';
      templateElement.append(element);
      return;
    }
    templateElement.textContent = element.textContent;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$4 = 'tooltip';
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
const CLASS_NAME_FADE$2 = 'fade';
const CLASS_NAME_MODAL = 'modal';
const CLASS_NAME_SHOW$2 = 'show';
const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
const EVENT_MODAL_HIDE = 'hide.bs.modal';
const TRIGGER_HOVER = 'hover';
const TRIGGER_FOCUS = 'focus';
const TRIGGER_CLICK = 'click';
const TRIGGER_MANUAL = 'manual';
const EVENT_HIDE$2 = 'hide';
const EVENT_HIDDEN$2 = 'hidden';
const EVENT_SHOW$2 = 'show';
const EVENT_SHOWN$2 = 'shown';
const EVENT_INSERTED = 'inserted';
const EVENT_CLICK$1 = 'click';
const EVENT_FOCUSIN$1 = 'focusin';
const EVENT_FOCUSOUT$1 = 'focusout';
const EVENT_MOUSEENTER = 'mouseenter';
const EVENT_MOUSELEAVE = 'mouseleave';
const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
};
const Default$3 = {
  allowList: DefaultAllowlist,
  animation: true,
  boundary: 'clippingParents',
  container: false,
  customClass: '',
  delay: 0,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  html: false,
  offset: [0, 6],
  placement: 'top',
  popperConfig: null,
  sanitize: true,
  sanitizeFn: null,
  selector: false,
  template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
  title: '',
  trigger: 'hover focus'
};
const DefaultType$3 = {
  allowList: 'object',
  animation: 'boolean',
  boundary: '(string|element)',
  container: '(string|element|boolean)',
  customClass: '(string|function)',
  delay: '(number|object)',
  fallbackPlacements: 'array',
  html: 'boolean',
  offset: '(array|string|function)',
  placement: '(string|function)',
  popperConfig: '(null|object|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  selector: '(string|boolean)',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string'
};

/**
 * Class definition
 */

class Tooltip extends BaseComponent {
  constructor(element, config) {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org/docs/v2/)');
    }
    super(element, config);

    // Private
    this._isEnabled = true;
    this._timeout = 0;
    this._isHovered = null;
    this._activeTrigger = {};
    this._popper = null;
    this._templateFactory = null;
    this._newContent = null;

    // Protected
    this.tip = null;
    this._setListeners();
    if (!this._config.selector) {
      this._fixTitle();
    }
  }

  // Getters
  static get Default() {
    return Default$3;
  }
  static get DefaultType() {
    return DefaultType$3;
  }
  static get NAME() {
    return NAME$4;
  }

  // Public
  enable() {
    this._isEnabled = true;
  }
  disable() {
    this._isEnabled = false;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle() {
    if (!this._isEnabled) {
      return;
    }
    if (this._isShown()) {
      this._leave();
      return;
    }
    this._enter();
  }
  dispose() {
    clearTimeout(this._timeout);
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    if (this._element.getAttribute('data-bs-original-title')) {
      this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
    }
    this._disposePopper();
    super.dispose();
  }
  show() {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }
    if (!(this._isWithContent() && this._isEnabled)) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
    const shadowRoot = findShadowRoot(this._element);
    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    }

    // TODO: v6 remove this or make it optional
    this._disposePopper();
    const tip = this._getTipElement();
    this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
    const {
      container
    } = this._config;
    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
    }
    this._popper = this._createPopper(tip);
    tip.classList.add(CLASS_NAME_SHOW$2);

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    const complete = () => {
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
      if (this._isHovered === false) {
        this._leave();
      }
      this._isHovered = false;
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  hide() {
    if (!this._isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
    if (hideEvent.defaultPrevented) {
      return;
    }
    const tip = this._getTipElement();
    tip.classList.remove(CLASS_NAME_SHOW$2);

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;
    this._isHovered = null; // it is a trick to support manual triggering

    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }
      if (!this._isHovered) {
        this._disposePopper();
      }
      this._element.removeAttribute('aria-describedby');
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  update() {
    if (this._popper) {
      this._popper.update();
    }
  }

  // Protected
  _isWithContent() {
    return Boolean(this._getTitle());
  }
  _getTipElement() {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
    }
    return this.tip;
  }
  _createTipElement(content) {
    const tip = this._getTemplateFactory(content).toHtml();

    // TODO: remove this check in v6
    if (!tip) {
      return null;
    }
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    // TODO: v6 the following can be achieved with CSS only
    tip.classList.add(`bs-${this.constructor.NAME}-auto`);
    const tipId = getUID(this.constructor.NAME).toString();
    tip.setAttribute('id', tipId);
    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE$2);
    }
    return tip;
  }
  setContent(content) {
    this._newContent = content;
    if (this._isShown()) {
      this._disposePopper();
      this.show();
    }
  }
  _getTemplateFactory(content) {
    if (this._templateFactory) {
      this._templateFactory.changeContent(content);
    } else {
      this._templateFactory = new TemplateFactory({
        ...this._config,
        // the `content` var has to be after `this._config`
        // to override config.content in case of popover
        content,
        extraClass: this._resolvePossibleFunction(this._config.customClass)
      });
    }
    return this._templateFactory;
  }
  _getContentForTemplate() {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    };
  }
  _getTitle() {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
  }

  // Private
  _initializeOnDelegatedTarget(event) {
    return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
  }
  _isAnimated() {
    return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
  }
  _isShown() {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
  }
  _createPopper(tip) {
    const placement = execute(this._config.placement, [this, tip, this._element]);
    const attachment = AttachmentMap[placement.toUpperCase()];
    return _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(this._element, tip, this._getPopperConfig(attachment));
  }
  _getOffset() {
    const {
      offset
    } = this._config;
    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }
    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }
    return offset;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [this._element, this._element]);
  }
  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: 'flip',
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'arrow',
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: 'preSetPlacement',
        enabled: true,
        phase: 'beforeMain',
        fn: data => {
          // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
          // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
          this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
        }
      }]
    };
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [undefined, defaultBsPopperConfig])
    };
  }
  _setListeners() {
    const triggers = this._config.trigger.split(' ');
    for (const trigger of triggers) {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[TRIGGER_CLICK] = !(context._isShown() && context._activeTrigger[TRIGGER_CLICK]);
          context.toggle();
        });
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
        EventHandler.on(this._element, eventIn, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
          context._enter();
        });
        EventHandler.on(this._element, eventOut, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
          context._leave();
        });
      }
    }
    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };
    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  }
  _fixTitle() {
    const title = this._element.getAttribute('title');
    if (!title) {
      return;
    }
    if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
      this._element.setAttribute('aria-label', title);
    }
    this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
    this._element.removeAttribute('title');
  }
  _enter() {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true;
      return;
    }
    this._isHovered = true;
    this._setTimeout(() => {
      if (this._isHovered) {
        this.show();
      }
    }, this._config.delay.show);
  }
  _leave() {
    if (this._isWithActiveTrigger()) {
      return;
    }
    this._isHovered = false;
    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide();
      }
    }, this._config.delay.hide);
  }
  _setTimeout(handler, timeout) {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(handler, timeout);
  }
  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(true);
  }
  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);
    for (const dataAttribute of Object.keys(dataAttributes)) {
      if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
        delete dataAttributes[dataAttribute];
      }
    }
    config = {
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    };
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    config.container = config.container === false ? document.body : getElement(config.container);
    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      };
    }
    if (typeof config.title === 'number') {
      config.title = config.title.toString();
    }
    if (typeof config.content === 'number') {
      config.content = config.content.toString();
    }
    return config;
  }
  _getDelegateConfig() {
    const config = {};
    for (const [key, value] of Object.entries(this._config)) {
      if (this.constructor.Default[key] !== value) {
        config[key] = value;
      }
    }
    config.selector = false;
    config.trigger = 'manual';

    // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`
    return config;
  }
  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
    if (this.tip) {
      this.tip.remove();
      this.tip = null;
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tooltip.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * jQuery
 */

defineJQueryPlugin(Tooltip);

/**
 * --------------------------------------------------------------------------
 * Bootstrap popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$3 = 'popover';
const SELECTOR_TITLE = '.popover-header';
const SELECTOR_CONTENT = '.popover-body';
const Default$2 = {
  ...Tooltip.Default,
  content: '',
  offset: [0, 8],
  placement: 'right',
  template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
  trigger: 'click'
};
const DefaultType$2 = {
  ...Tooltip.DefaultType,
  content: '(null|string|element|function)'
};

/**
 * Class definition
 */

class Popover extends Tooltip {
  // Getters
  static get Default() {
    return Default$2;
  }
  static get DefaultType() {
    return DefaultType$2;
  }
  static get NAME() {
    return NAME$3;
  }

  // Overrides
  _isWithContent() {
    return this._getTitle() || this._getContent();
  }

  // Private
  _getContentForTemplate() {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      [SELECTOR_CONTENT]: this._getContent()
    };
  }
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * jQuery
 */

defineJQueryPlugin(Popover);

/**
 * --------------------------------------------------------------------------
 * Bootstrap scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$2 = 'scrollspy';
const DATA_KEY$2 = 'bs.scrollspy';
const EVENT_KEY$2 = `.${DATA_KEY$2}`;
const DATA_API_KEY = '.data-api';
const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
const EVENT_CLICK = `click${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_TARGET_LINKS = '[href]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
const Default$1 = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: '0px 0px -25%',
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
};
const DefaultType$1 = {
  offset: '(number|null)',
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: 'string',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array'
};

/**
 * Class definition
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element, config);

    // this._element is the observablesContainer and config.target the menu links wrapper
    this._targetLinks = new Map();
    this._observableSections = new Map();
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
    this._activeTarget = null;
    this._observer = null;
    this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    };
    this.refresh(); // initialize
  }

  // Getters
  static get Default() {
    return Default$1;
  }
  static get DefaultType() {
    return DefaultType$1;
  }
  static get NAME() {
    return NAME$2;
  }

  // Public
  refresh() {
    this._initializeTargetsAndObservables();
    this._maybeEnableSmoothScroll();
    if (this._observer) {
      this._observer.disconnect();
    } else {
      this._observer = this._getNewObserver();
    }
    for (const section of this._observableSections.values()) {
      this._observer.observe(section);
    }
  }
  dispose() {
    this._observer.disconnect();
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
    config.target = getElement(config.target) || document.body;

    // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
    config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
    }
    return config;
  }
  _maybeEnableSmoothScroll() {
    if (!this._config.smoothScroll) {
      return;
    }

    // unregister any previous listeners
    EventHandler.off(this._config.target, EVENT_CLICK);
    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const observableSection = this._observableSections.get(event.target.hash);
      if (observableSection) {
        event.preventDefault();
        const root = this._rootElement || window;
        const height = observableSection.offsetTop - this._element.offsetTop;
        if (root.scrollTo) {
          root.scrollTo({
            top: height,
            behavior: 'smooth'
          });
          return;
        }

        // Chrome 60 doesn't support `scrollTo`
        root.scrollTop = height;
      }
    });
  }
  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    };
    return new IntersectionObserver(entries => this._observerCallback(entries), options);
  }

  // The logic of selection
  _observerCallback(entries) {
    const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
    const activate = entry => {
      this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
      this._process(targetElement(entry));
    };
    const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
    const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = parentScrollTop;
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this._activeTarget = null;
        this._clearActiveClass(targetElement(entry));
        continue;
      }
      const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
      // if we are scrolling down, pick the bigger offsetTop
      if (userScrollsDown && entryIsLowerThanPrevious) {
        activate(entry);
        // if parent isn't scrolled, let's keep the first visible item, breaking the iteration
        if (!parentScrollTop) {
          return;
        }
        continue;
      }

      // if we are scrolling up, pick the smallest offsetTop
      if (!userScrollsDown && !entryIsLowerThanPrevious) {
        activate(entry);
      }
    }
  }
  _initializeTargetsAndObservables() {
    this._targetLinks = new Map();
    this._observableSections = new Map();
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
    for (const anchor of targetLinks) {
      // ensure that the anchor has an id and is not disabled
      if (!anchor.hash || isDisabled(anchor)) {
        continue;
      }
      const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);

      // ensure that the observableSection exists & is visible
      if (isVisible(observableSection)) {
        this._targetLinks.set(decodeURI(anchor.hash), anchor);
        this._observableSections.set(anchor.hash, observableSection);
      }
    }
  }
  _process(target) {
    if (this._activeTarget === target) {
      return;
    }
    this._clearActiveClass(this._config.target);
    this._activeTarget = target;
    target.classList.add(CLASS_NAME_ACTIVE$1);
    this._activateParents(target);
    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }
  _activateParents(target) {
    // Activate dropdown parents
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
      return;
    }
    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE$1);
      }
    }
  }
  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE$1);
    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE$1);
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy);
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(ScrollSpy);

/**
 * --------------------------------------------------------------------------
 * Bootstrap tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$1 = 'tab';
const DATA_KEY$1 = 'bs.tab';
const EVENT_KEY$1 = `.${DATA_KEY$1}`;
const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const HOME_KEY = 'Home';
const END_KEY = 'End';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_FADE$1 = 'fade';
const CLASS_NAME_SHOW$1 = 'show';
const CLASS_DROPDOWN = 'dropdown';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
const SELECTOR_OUTER = '.nav-item, .list-group-item';
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // TODO: could only be `tab` in v6
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;

/**
 * Class definition
 */

class Tab extends BaseComponent {
  constructor(element) {
    super(element);
    this._parent = this._element.closest(SELECTOR_TAB_PANEL);
    if (!this._parent) {
      return;
      // TODO: should throw exception in v6
      // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
    }

    // Set up initial aria attributes
    this._setInitialAttributes(this._parent, this._getChildren());
    EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
  }

  // Getters
  static get NAME() {
    return NAME$1;
  }

  // Public
  show() {
    // Shows this elem and deactivate the active sibling if exists
    const innerElem = this._element;
    if (this._elemIsActive(innerElem)) {
      return;
    }

    // Search for active tab on same parent to deactivate it
    const active = this._getActiveElem();
    const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
      relatedTarget: innerElem
    }) : null;
    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
      relatedTarget: active
    });
    if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
      return;
    }
    this._deactivate(active, innerElem);
    this._activate(innerElem, active);
  }

  // Private
  _activate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.add(CLASS_NAME_ACTIVE);
    this._activate(SelectorEngine.getElementFromSelector(element)); // Search and activate/show the proper section

    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.add(CLASS_NAME_SHOW$1);
        return;
      }
      element.removeAttribute('tabindex');
      element.setAttribute('aria-selected', true);
      this._toggleDropDown(element, true);
      EventHandler.trigger(element, EVENT_SHOWN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _deactivate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.remove(CLASS_NAME_ACTIVE);
    element.blur();
    this._deactivate(SelectorEngine.getElementFromSelector(element)); // Search and deactivate the shown section too

    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.remove(CLASS_NAME_SHOW$1);
        return;
      }
      element.setAttribute('aria-selected', false);
      element.setAttribute('tabindex', '-1');
      this._toggleDropDown(element, false);
      EventHandler.trigger(element, EVENT_HIDDEN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _keydown(event) {
    if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
      return;
    }
    event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page
    event.preventDefault();
    const children = this._getChildren().filter(element => !isDisabled(element));
    let nextActiveElement;
    if ([HOME_KEY, END_KEY].includes(event.key)) {
      nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
    } else {
      const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
      nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
    }
    if (nextActiveElement) {
      nextActiveElement.focus({
        preventScroll: true
      });
      Tab.getOrCreateInstance(nextActiveElement).show();
    }
  }
  _getChildren() {
    // collection of inner elements
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
  }
  _getActiveElem() {
    return this._getChildren().find(child => this._elemIsActive(child)) || null;
  }
  _setInitialAttributes(parent, children) {
    this._setAttributeIfNotExists(parent, 'role', 'tablist');
    for (const child of children) {
      this._setInitialAttributesOnChild(child);
    }
  }
  _setInitialAttributesOnChild(child) {
    child = this._getInnerElement(child);
    const isActive = this._elemIsActive(child);
    const outerElem = this._getOuterElement(child);
    child.setAttribute('aria-selected', isActive);
    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
    }
    if (!isActive) {
      child.setAttribute('tabindex', '-1');
    }
    this._setAttributeIfNotExists(child, 'role', 'tab');

    // set attributes to the related panel too
    this._setInitialAttributesOnTargetPanel(child);
  }
  _setInitialAttributesOnTargetPanel(child) {
    const target = SelectorEngine.getElementFromSelector(child);
    if (!target) {
      return;
    }
    this._setAttributeIfNotExists(target, 'role', 'tabpanel');
    if (child.id) {
      this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`);
    }
  }
  _toggleDropDown(element, open) {
    const outerElem = this._getOuterElement(element);
    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return;
    }
    const toggle = (selector, className) => {
      const element = SelectorEngine.findOne(selector, outerElem);
      if (element) {
        element.classList.toggle(className, open);
      }
    };
    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
    outerElem.setAttribute('aria-expanded', open);
  }
  _setAttributeIfNotExists(element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value);
    }
  }
  _elemIsActive(elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE);
  }

  // Try to get the inner element (usually the .nav-link)
  _getInnerElement(elem) {
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
  }

  // Try to get the outer element (usually the .nav-item)
  _getOuterElement(elem) {
    return elem.closest(SELECTOR_OUTER) || elem;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  Tab.getOrCreateInstance(this).show();
});

/**
 * Initialize on focus
 */
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
    Tab.getOrCreateInstance(element);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Tab);

/**
 * --------------------------------------------------------------------------
 * Bootstrap toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'toast';
const DATA_KEY = 'bs.toast';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
};
const Default = {
  animation: true,
  autohide: true,
  delay: 5000
};

/**
 * Class definition
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;
    this._setListeners();
  }

  // Getters
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }

  // Public
  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._clearTimeout();
    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }
    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);
      EventHandler.trigger(this._element, EVENT_SHOWN);
      this._maybeScheduleHide();
    };
    this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  hide() {
    if (!this.isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };
    this._element.classList.add(CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout();
    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }
    super.dispose();
  }
  isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }

  // Private
  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }
    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }
  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout':
        {
          this._hasMouseInteraction = isInteracting;
          break;
        }
      case 'focusin':
      case 'focusout':
        {
          this._hasKeyboardInteraction = isInteracting;
          break;
        }
    }
    if (isInteracting) {
      this._clearTimeout();
      return;
    }
    const nextElement = event.relatedTarget;
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }
    this._maybeScheduleHide();
  }
  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
  }
  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      }
    });
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Toast);

/**
 * jQuery
 */

defineJQueryPlugin(Toast);


//# sourceMappingURL=bootstrap.esm.js.map


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/laravel-mix/node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/@fortawesome/fontawesome-free/css/all.min.css":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/laravel-mix/node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/@fortawesome/fontawesome-free/css/all.min.css ***!
  \*******************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _webfonts_fa_brands_400_woff2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../webfonts/fa-brands-400.woff2 */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2");
/* harmony import */ var _webfonts_fa_regular_400_woff2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webfonts/fa-regular-400.woff2 */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2");
/* harmony import */ var _webfonts_fa_solid_900_woff2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../webfonts/fa-solid-900.woff2 */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2");
/* harmony import */ var _webfonts_fa_v4compatibility_woff2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../webfonts/fa-v4compatibility.woff2 */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.woff2");
// Imports






var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_brands_400_woff2__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_regular_400_woff2__WEBPACK_IMPORTED_MODULE_3__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_solid_900_woff2__WEBPACK_IMPORTED_MODULE_4__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_v4compatibility_woff2__WEBPACK_IMPORTED_MODULE_5__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*!\n * Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com\n * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)\n * Copyright 2026 Fonticons, Inc.\n */\n.fa,.fa-brands,.fa-classic,.fa-regular,.fa-solid,.fab,.far,.fas{--_fa-family:var(--fa-family,var(--fa-style-family,\"Font Awesome 7 Free\"));-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:var(--fa-display,inline-block);font-family:var(--_fa-family);font-feature-settings:normal;font-style:normal;font-synthesis:none;font-variant:normal;font-weight:var(--fa-style,900);line-height:1;text-align:center;text-rendering:auto;width:var(--fa-width,1.25em)}:is(.fas,.far,.fab,.fa-solid,.fa-regular,.fa-brands,.fa-classic,.fa):before{content:var(--fa)/\"\"}@supports not (content:\"\"/\"\"){:is(.fas,.far,.fab,.fa-solid,.fa-regular,.fa-brands,.fa-classic,.fa):before{content:var(--fa)}}.fa-1x{font-size:1em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-6x{font-size:6em}.fa-7x{font-size:7em}.fa-8x{font-size:8em}.fa-9x{font-size:9em}.fa-10x{font-size:10em}.fa-2xs{font-size:.625em;line-height:.1em;vertical-align:.225em}.fa-xs{font-size:.75em;line-height:.08333em;vertical-align:.125em}.fa-sm{font-size:.875em;line-height:.07143em;vertical-align:.05357em}.fa-lg{font-size:1.25em;line-height:.05em;vertical-align:-.075em}.fa-xl{font-size:1.5em;line-height:.04167em;vertical-align:-.125em}.fa-2xl{font-size:2em;line-height:.03125em;vertical-align:-.1875em}.fa-width-auto{--fa-width:auto}.fa-fw,.fa-width-fixed{--fa-width:1.25em}.fa-canvas-square{padding-block:.125em;margin-block-end:-.125em}.fa-canvas-roomy{padding-block:.25em;padding-inline:.125em;margin-block-end:-.25em;box-sizing:content-box}.fa-ul{list-style-type:none;margin-inline-start:var(--fa-li-margin,2.5em);padding-inline-start:0}.fa-ul>li{position:relative}.fa-li{inset-inline-start:calc(var(--fa-li-width, 2em)*-1);position:absolute;text-align:center;width:var(--fa-li-width,2em);line-height:inherit}.fa-border{border-radius:var(--fa-border-radius,.1em);border:var(--fa-border-width,.0625em) var(--fa-border-style,solid) var(--fa-border-color,#eee);box-sizing:var(--fa-border-box-sizing,content-box);padding:var(--fa-border-padding,.1875em .25em)}.fa-pull-left,.fa-pull-start{float:inline-start;margin-inline-end:var(--fa-pull-margin,.3em)}.fa-pull-end,.fa-pull-right{float:inline-end;margin-inline-start:var(--fa-pull-margin,.3em)}.fa-beat{animation-name:fa-beat;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-bounce{animation-name:fa-bounce;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,cubic-bezier(.28,.84,.42,1))}.fa-fade{animation-name:fa-fade;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-beat-fade,.fa-fade{animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s)}.fa-beat-fade{animation-name:fa-beat-fade;animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-flip{animation-name:fa-flip;animation-duration:var(--fa-animation-duration,1.5s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-flip,.fa-flip-360{animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal)}.fa-flip-360{animation-name:fa-flip-360;animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-shake{animation-name:fa-shake;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,.75s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out)}.fa-spin{animation-name:fa-spin;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,2s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,linear)}.fa-spin-reverse{--fa-animation-direction:reverse}.fa-pulse,.fa-spin-pulse{animation-name:fa-spin;animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,1s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,steps(8))}.fa-spin-snap{animation-name:fa-spin-snap;animation-duration:var(--fa-animation-duration,3s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,linear)}.fa-spin-snap,.fa-spin-snap-4{animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal)}.fa-spin-snap-4{animation-name:fa-spin-snap-4;animation-duration:var(--fa-animation-duration,2.4s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,linear)}.fa-spin-snap-8{animation-name:fa-spin-snap-8;animation-duration:var(--fa-animation-duration,4s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,linear)}.fa-buzz,.fa-spin-snap-8{animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal)}.fa-buzz{animation-name:fa-buzz;animation-duration:var(--fa-animation-duration,.6s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,linear)}.fa-wag{animation-name:fa-wag;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,.9s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-out);transform-origin:bottom center}.fa-float{animation-name:fa-float;animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal);animation-duration:var(--fa-animation-duration,3s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-in-out);will-change:transform}.fa-swing{animation-name:fa-swing;animation-duration:var(--fa-animation-duration,1.2s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-out);transform-origin:top center}.fa-jello,.fa-swing{animation-delay:var(--fa-animation-delay,0s);animation-direction:var(--fa-animation-direction,normal)}.fa-jello{animation-name:fa-jello;animation-duration:var(--fa-animation-duration,.9s);animation-iteration-count:var(--fa-animation-iteration-count,infinite);animation-timing-function:var(--fa-animation-timing,ease-out)}@media (prefers-reduced-motion:reduce){.fa-beat,.fa-beat-fade,.fa-bounce,.fa-buzz,.fa-fade,.fa-flip,.fa-flip-360,.fa-float,.fa-jello,.fa-pulse,.fa-shake,.fa-spin,.fa-spin-pulse,.fa-spin-snap,.fa-spin-snap-4,.fa-spin-snap-8,.fa-swing,.fa-wag{animation:none!important;transition:none!important}}@keyframes fa-beat{0%{transform:scale(1)}25%{transform:scale(calc(var(--fa-beat-scale, 1.25)*1.25))}45%{transform:scale(calc(var(--fa-beat-scale, 1.22)*1.22))}65%{transform:scale(calc(var(--fa-beat-scale, 1.25)*1.25))}90%{transform:scale(1)}}@keyframes fa-bounce{0%{transform:scale(1) translateY(0);animation-timing-function:var(--fa-animation-timing)}14%{transform:scale(var(--fa-bounce-start-scale-x,1.06),var(--fa-bounce-start-scale-y,.94)) translateY(var(--fa-bounce-anticipation,3px));animation-timing-function:cubic-bezier(.33,0,.66,.33)}32%{transform:scale(var(--fa-bounce-jump-scale-x,.94),var(--fa-bounce-jump-scale-y,1.12)) translateY(calc(var(--fa-bounce-height, .5em)*-1));animation-timing-function:cubic-bezier(.33,.66,.66,1)}52%{transform:scale(1) translateY(calc(var(--fa-bounce-height, .5em)*-1*1.1));animation-timing-function:cubic-bezier(.5,0,1,.5)}70%{transform:scale(var(--fa-bounce-land-scale-x,1.06),var(--fa-bounce-land-scale-y,.92)) translateY(0);animation-timing-function:cubic-bezier(.33,.33,.66,1)}85%{transform:scale(.98,1.04) translateY(calc(-2px*var(--fa-bounce-rebound, 1)));animation-timing-function:cubic-bezier(.33,0,.66,1)}to{transform:scale(1) translateY(0)}}@keyframes fa-fade{0%{opacity:1;transform:scale(1);animation-timing-function:cubic-bezier(.2,0,.4,1)}40%{opacity:var(--fa-fade-opacity,.4);transform:scale(.98);animation-timing-function:cubic-bezier(.4,0,.6,1)}to{opacity:1;transform:scale(1)}}@keyframes fa-beat-fade{0%{opacity:var(--fa-beat-fade-opacity,.4);transform:scale(1);animation-timing-function:cubic-bezier(.2,0,.4,1)}25%{opacity:calc(var(--fa-beat-fade-opacity, .4) + .4);transform:scale(var(--fa-beat-fade-scale,1.28));animation-timing-function:cubic-bezier(.4,0,.6,1)}45%{opacity:1;transform:scale(var(--fa-beat-fade-scale,1.25));animation-timing-function:cubic-bezier(.4,0,.2,1)}65%{opacity:calc(var(--fa-beat-fade-opacity, .4) + .4);transform:scale(var(--fa-beat-fade-scale,1.28));animation-timing-function:cubic-bezier(.4,0,.6,1)}to{opacity:var(--fa-beat-fade-opacity,.4);transform:scale(1)}}@keyframes fa-flip{0%{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),0deg);animation-timing-function:cubic-bezier(.2,0,.4,1)}8%{transform:perspective(2em) scale(var(--fa-flip-anticipation-scale,.95)) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),0deg);animation-timing-function:cubic-bezier(.33,0,.66,.33)}35%{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),calc(var(--fa-flip-angle, -1turn)*0.6));animation-timing-function:linear}65%{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),calc(var(--fa-flip-angle, -1turn)*0.5));animation-timing-function:cubic-bezier(.33,.66,.66,1)}92%{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),calc(var(--fa-flip-angle, -1turn)*var(--fa-flip-overshoot, 1.04)));animation-timing-function:cubic-bezier(.33,0,.66,1)}to{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),var(--fa-flip-angle,-1turn))}}@keyframes fa-flip-360{0%{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),0deg);animation-timing-function:cubic-bezier(.2,0,.4,1)}8%{transform:perspective(2em) scale(var(--fa-flip-anticipation-scale,.95)) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),0deg);animation-timing-function:cubic-bezier(.33,0,.66,.33)}50%{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),calc(var(--fa-flip-angle, -1turn)*0.6));animation-timing-function:cubic-bezier(.33,.66,.66,1)}80%{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),calc(var(--fa-flip-angle, -1turn)*var(--fa-flip-overshoot, 1.04)));animation-timing-function:cubic-bezier(.33,0,.66,1)}to{transform:perspective(2em) scale(1) rotate3d(var(--fa-flip-x,0),var(--fa-flip-y,1),var(--fa-flip-z,0),var(--fa-flip-angle,-1turn))}}@keyframes fa-shake{0%{transform:rotate(0deg);animation-timing-function:cubic-bezier(.2,0,.8,1)}8%{transform:rotate(35deg) translateX(1px);animation-timing-function:cubic-bezier(.3,0,.7,1)}20%{transform:rotate(-22deg) translateX(-1px);animation-timing-function:cubic-bezier(.3,0,.7,1)}35%{transform:rotate(15deg) translateX(1px);animation-timing-function:cubic-bezier(.3,0,.7,1)}50%{transform:rotate(-9deg);animation-timing-function:cubic-bezier(.4,0,.6,1)}65%{transform:rotate(5deg);animation-timing-function:cubic-bezier(.4,0,.6,1)}78%{transform:rotate(-3deg);animation-timing-function:cubic-bezier(.4,0,.6,1)}90%{transform:rotate(1deg);animation-timing-function:cubic-bezier(.4,0,.2,1)}to{transform:rotate(0deg)}}@keyframes fa-spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes fa-spin-snap{0%{transform:rotate(0deg);animation-timing-function:cubic-bezier(0,0,.2,1)}12%{transform:rotate(60deg);animation-timing-function:cubic-bezier(.8,0,1,1)}16.67%{transform:rotate(60deg);animation-timing-function:cubic-bezier(0,0,.2,1)}28.67%{transform:rotate(120deg);animation-timing-function:cubic-bezier(.8,0,1,1)}33.33%{transform:rotate(120deg);animation-timing-function:cubic-bezier(0,0,.2,1)}45.33%{transform:rotate(180deg);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:rotate(180deg);animation-timing-function:cubic-bezier(0,0,.2,1)}62%{transform:rotate(240deg);animation-timing-function:cubic-bezier(.8,0,1,1)}66.67%{transform:rotate(240deg);animation-timing-function:cubic-bezier(0,0,.2,1)}78.67%{transform:rotate(300deg);animation-timing-function:cubic-bezier(.8,0,1,1)}83.33%{transform:rotate(300deg);animation-timing-function:cubic-bezier(0,0,.2,1)}95.33%{transform:rotate(1turn);animation-timing-function:cubic-bezier(.8,0,1,1)}to{transform:rotate(1turn)}}@keyframes fa-spin-snap-4{0%{transform:rotate(0deg);animation-timing-function:cubic-bezier(0,0,.2,1)}15%{transform:rotate(90deg);animation-timing-function:cubic-bezier(.8,0,1,1)}25%{transform:rotate(90deg);animation-timing-function:cubic-bezier(0,0,.2,1)}40%{transform:rotate(180deg);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:rotate(180deg);animation-timing-function:cubic-bezier(0,0,.2,1)}65%{transform:rotate(270deg);animation-timing-function:cubic-bezier(.8,0,1,1)}75%{transform:rotate(270deg);animation-timing-function:cubic-bezier(0,0,.2,1)}90%{transform:rotate(1turn);animation-timing-function:cubic-bezier(.8,0,1,1)}to{transform:rotate(1turn)}}@keyframes fa-spin-snap-8{0%{transform:rotate(0deg);animation-timing-function:cubic-bezier(0,0,.2,1)}9%{transform:rotate(45deg);animation-timing-function:cubic-bezier(.8,0,1,1)}12.5%{transform:rotate(45deg);animation-timing-function:cubic-bezier(0,0,.2,1)}21.5%{transform:rotate(90deg);animation-timing-function:cubic-bezier(.8,0,1,1)}25%{transform:rotate(90deg);animation-timing-function:cubic-bezier(0,0,.2,1)}34%{transform:rotate(135deg);animation-timing-function:cubic-bezier(.8,0,1,1)}37.5%{transform:rotate(135deg);animation-timing-function:cubic-bezier(0,0,.2,1)}46.5%{transform:rotate(180deg);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:rotate(180deg);animation-timing-function:cubic-bezier(0,0,.2,1)}59%{transform:rotate(225deg);animation-timing-function:cubic-bezier(.8,0,1,1)}62.5%{transform:rotate(225deg);animation-timing-function:cubic-bezier(0,0,.2,1)}71.5%{transform:rotate(270deg);animation-timing-function:cubic-bezier(.8,0,1,1)}75%{transform:rotate(270deg);animation-timing-function:cubic-bezier(0,0,.2,1)}84%{transform:rotate(315deg);animation-timing-function:cubic-bezier(.8,0,1,1)}87.5%{transform:rotate(315deg);animation-timing-function:cubic-bezier(0,0,.2,1)}96.5%{transform:rotate(1turn);animation-timing-function:cubic-bezier(.8,0,1,1)}to{transform:rotate(1turn)}}@keyframes fa-buzz{0%{transform:translateX(0) rotate(0deg);animation-timing-function:cubic-bezier(.1,0,.9,1)}5%{transform:translateX(var(--fa-buzz-distance,4px)) rotate(.5deg)}10%{transform:translateX(calc(var(--fa-buzz-distance, 4px)*-1)) rotate(-.5deg)}15%{transform:translateX(var(--fa-buzz-distance,4px)) rotate(.3deg)}20%{transform:translateX(calc(var(--fa-buzz-distance, 4px)*-1)) rotate(-.3deg)}25%{transform:translateX(calc(var(--fa-buzz-distance, 4px)*0.7)) rotate(.2deg)}30%{transform:translateX(calc(var(--fa-buzz-distance, 4px)*-1*0.7)) rotate(-.2deg)}35%{transform:translateX(calc(var(--fa-buzz-distance, 4px)*0.4)) rotate(.1deg)}40%{transform:translateX(0) rotate(0deg)}to{transform:translateX(0) rotate(0deg)}}@keyframes fa-wag{0%{transform:rotate(0deg);animation-timing-function:cubic-bezier(.2,0,.6,1)}12%{transform:rotate(var(--fa-wag-angle,12deg));animation-timing-function:cubic-bezier(.4,0,.2,1)}24%{transform:rotate(2deg);animation-timing-function:cubic-bezier(.2,0,.6,1)}36%{transform:rotate(calc(var(--fa-wag-angle, 12deg)*0.85));animation-timing-function:cubic-bezier(.4,0,.2,1)}48%{transform:rotate(1deg);animation-timing-function:cubic-bezier(.2,0,.6,1)}58%{transform:rotate(calc(var(--fa-wag-angle, 12deg)*0.6));animation-timing-function:cubic-bezier(.4,0,.2,1)}68%{transform:rotate(0deg)}to{transform:rotate(0deg)}}@keyframes fa-float{0%{transform:translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x,1.02),var(--fa-float-squash-y,.98));animation-timing-function:cubic-bezier(.33,0,.66,.33)}15%{transform:translateY(calc(var(--fa-float-height, 6px)*-0.4)) translateX(var(--fa-float-drift,1px)) rotate(var(--fa-float-tilt,1deg)) scale(1);animation-timing-function:cubic-bezier(.33,.66,.66,1)}35%{transform:translateY(calc(var(--fa-float-height, 6px)*-1)) translateX(0) rotate(0deg) scale(var(--fa-float-stretch-x,.98),var(--fa-float-stretch-y,1.03));animation-timing-function:cubic-bezier(.5,0,.5,0)}50%{transform:translateY(calc(var(--fa-float-height, 6px)*-0.92)) translateX(calc(var(--fa-float-drift, 1px)*-0.5)) rotate(calc(var(--fa-float-tilt, 1deg)*-0.5)) scale(.995,1.01);animation-timing-function:cubic-bezier(.33,0,.66,.33)}70%{transform:translateY(calc(var(--fa-float-height, 6px)*-0.3)) translateX(calc(var(--fa-float-drift, 1px)*-1)) rotate(calc(var(--fa-float-tilt, 1deg)*-1)) scale(1);animation-timing-function:cubic-bezier(.33,.66,.66,1)}90%{transform:translateY(calc(var(--fa-float-height, 6px)*0.05)) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x,1.02),var(--fa-float-squash-y,.98));animation-timing-function:cubic-bezier(.33,0,.66,1)}to{transform:translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x,1.02),var(--fa-float-squash-y,.98))}}@keyframes fa-swing{0%{transform:rotate(0deg);animation-timing-function:cubic-bezier(.2,0,.8,1)}8%{transform:rotate(var(--fa-swing-angle,22deg));animation-timing-function:cubic-bezier(.3,0,.7,1)}18%{transform:rotate(calc(var(--fa-swing-angle, 22deg)*-1*0.85));animation-timing-function:cubic-bezier(.3,0,.7,1)}28%{transform:rotate(calc(var(--fa-swing-angle, 22deg)*0.65));animation-timing-function:cubic-bezier(.35,0,.65,1)}38%{transform:rotate(calc(var(--fa-swing-angle, 22deg)*-1*0.45));animation-timing-function:cubic-bezier(.4,0,.6,1)}48%{transform:rotate(calc(var(--fa-swing-angle, 22deg)*0.25));animation-timing-function:cubic-bezier(.4,0,.6,1)}56%{transform:rotate(calc(var(--fa-swing-angle, 22deg)*-1*0.1));animation-timing-function:cubic-bezier(.4,0,.6,1)}64%{transform:rotate(0deg)}to{transform:rotate(0deg)}}@keyframes fa-jello{0%{transform:scale(1);animation-timing-function:cubic-bezier(.2,0,.8,1)}12%{transform:scale(var(--fa-jello-scale-x,1.15),calc(2 - var(--fa-jello-scale-x, 1.15)));animation-timing-function:cubic-bezier(.3,0,.7,1)}24%{transform:scale(calc(2 - var(--fa-jello-scale-y, 1.12)),var(--fa-jello-scale-y,1.12));animation-timing-function:cubic-bezier(.3,0,.7,1)}36%{transform:scale(calc(.5 + var(--fa-jello-scale-x, 1.15)*0.5),calc(1.5 - var(--fa-jello-scale-x, 1.15)*0.5));animation-timing-function:cubic-bezier(.4,0,.6,1)}48%{transform:scale(calc(1.3 - var(--fa-jello-scale-y, 1.12)*0.3),calc(.7 + var(--fa-jello-scale-y, 1.12)*0.3));animation-timing-function:cubic-bezier(.4,0,.6,1)}58%{transform:scale(1.02,.98);animation-timing-function:cubic-bezier(.4,0,.2,1)}68%{transform:scale(1)}to{transform:scale(1)}}.fa-rotate-90{transform:rotate(90deg)}.fa-rotate-180{transform:rotate(180deg)}.fa-rotate-270{transform:rotate(270deg)}.fa-flip-horizontal{transform:scaleX(-1)}.fa-flip-vertical{transform:scaleY(-1)}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical{transform:scale(-1)}.fa-rotate-by{transform:rotate(var(--fa-rotate-angle,0))}.fa-stack{display:inline-block;height:2em;line-height:2em;position:relative;vertical-align:middle;width:2.5em}.fa-stack-1x,.fa-stack-2x{--fa-width:100%;inset:0;position:absolute;text-align:center;width:var(--fa-width);z-index:var(--fa-stack-z-index,auto)}.fa-stack-1x{line-height:inherit}.fa-stack-2x{font-size:2em}.fa-inverse{color:var(--fa-inverse,#fff)}\n\n.fa-0{--fa:\"\\30 \"}.fa-1{--fa:\"\\31 \"}.fa-2{--fa:\"\\32 \"}.fa-3{--fa:\"\\33 \"}.fa-4{--fa:\"\\34 \"}.fa-5{--fa:\"\\35 \"}.fa-6{--fa:\"\\36 \"}.fa-7{--fa:\"\\37 \"}.fa-8{--fa:\"\\38 \"}.fa-9{--fa:\"\\39 \"}.fa-exclamation{--fa:\"\\!\"}.fa-hashtag{--fa:\"\\#\"}.fa-dollar,.fa-dollar-sign,.fa-usd{--fa:\"\\$\"}.fa-percent,.fa-percentage{--fa:\"\\%\"}.fa-asterisk{--fa:\"\\*\"}.fa-add,.fa-plus{--fa:\"\\+\"}.fa-less-than{--fa:\"\\<\"}.fa-equals{--fa:\"\\=\"}.fa-greater-than{--fa:\"\\>\"}.fa-question{--fa:\"\\?\"}.fa-at{--fa:\"\\@\"}.fa-a{--fa:\"A\"}.fa-b{--fa:\"B\"}.fa-c{--fa:\"C\"}.fa-d{--fa:\"D\"}.fa-e{--fa:\"E\"}.fa-f{--fa:\"F\"}.fa-g{--fa:\"G\"}.fa-h{--fa:\"H\"}.fa-i{--fa:\"I\"}.fa-j{--fa:\"J\"}.fa-k{--fa:\"K\"}.fa-l{--fa:\"L\"}.fa-m{--fa:\"M\"}.fa-n{--fa:\"N\"}.fa-o{--fa:\"O\"}.fa-p{--fa:\"P\"}.fa-q{--fa:\"Q\"}.fa-r{--fa:\"R\"}.fa-s{--fa:\"S\"}.fa-t{--fa:\"T\"}.fa-u{--fa:\"U\"}.fa-v{--fa:\"V\"}.fa-w{--fa:\"W\"}.fa-x{--fa:\"X\"}.fa-y{--fa:\"Y\"}.fa-z{--fa:\"Z\"}.fa-faucet{--fa:\"\\e005\"}.fa-faucet-drip{--fa:\"\\e006\"}.fa-house-chimney-window{--fa:\"\\e00d\"}.fa-house-signal{--fa:\"\\e012\"}.fa-temperature-arrow-down,.fa-temperature-down{--fa:\"\\e03f\"}.fa-temperature-arrow-up,.fa-temperature-up{--fa:\"\\e040\"}.fa-trailer{--fa:\"\\e041\"}.fa-bacteria{--fa:\"\\e059\"}.fa-bacterium{--fa:\"\\e05a\"}.fa-box-tissue{--fa:\"\\e05b\"}.fa-hand-holding-medical{--fa:\"\\e05c\"}.fa-hand-sparkles{--fa:\"\\e05d\"}.fa-hands-bubbles,.fa-hands-wash{--fa:\"\\e05e\"}.fa-handshake-alt-slash,.fa-handshake-simple-slash,.fa-handshake-slash{--fa:\"\\e060\"}.fa-head-side-cough{--fa:\"\\e061\"}.fa-head-side-cough-slash{--fa:\"\\e062\"}.fa-head-side-mask{--fa:\"\\e063\"}.fa-head-side-virus{--fa:\"\\e064\"}.fa-house-chimney-user{--fa:\"\\e065\"}.fa-house-laptop,.fa-laptop-house{--fa:\"\\e066\"}.fa-lungs-virus{--fa:\"\\e067\"}.fa-people-arrows,.fa-people-arrows-left-right{--fa:\"\\e068\"}.fa-plane-slash{--fa:\"\\e069\"}.fa-pump-medical{--fa:\"\\e06a\"}.fa-pump-soap{--fa:\"\\e06b\"}.fa-shield-virus{--fa:\"\\e06c\"}.fa-sink{--fa:\"\\e06d\"}.fa-soap{--fa:\"\\e06e\"}.fa-stopwatch-20{--fa:\"\\e06f\"}.fa-shop-slash,.fa-store-alt-slash{--fa:\"\\e070\"}.fa-store-slash{--fa:\"\\e071\"}.fa-toilet-paper-slash{--fa:\"\\e072\"}.fa-users-slash{--fa:\"\\e073\"}.fa-virus{--fa:\"\\e074\"}.fa-virus-slash{--fa:\"\\e075\"}.fa-viruses{--fa:\"\\e076\"}.fa-vest{--fa:\"\\e085\"}.fa-vest-patches{--fa:\"\\e086\"}.fa-arrow-trend-down{--fa:\"\\e097\"}.fa-arrow-trend-up{--fa:\"\\e098\"}.fa-arrow-up-from-bracket{--fa:\"\\e09a\"}.fa-austral-sign{--fa:\"\\e0a9\"}.fa-baht-sign{--fa:\"\\e0ac\"}.fa-bitcoin-sign{--fa:\"\\e0b4\"}.fa-bolt-lightning{--fa:\"\\e0b7\"}.fa-book-bookmark{--fa:\"\\e0bb\"}.fa-camera-rotate{--fa:\"\\e0d8\"}.fa-cedi-sign{--fa:\"\\e0df\"}.fa-chart-column{--fa:\"\\e0e3\"}.fa-chart-gantt{--fa:\"\\e0e4\"}.fa-clapperboard{--fa:\"\\e131\"}.fa-closed-captioning-slash{--fa:\"\\e135\"}.fa-clover{--fa:\"\\e139\"}.fa-code-compare{--fa:\"\\e13a\"}.fa-code-fork{--fa:\"\\e13b\"}.fa-code-pull-request{--fa:\"\\e13c\"}.fa-colon-sign{--fa:\"\\e140\"}.fa-cruzeiro-sign{--fa:\"\\e152\"}.fa-display{--fa:\"\\e163\"}.fa-dong-sign{--fa:\"\\e169\"}.fa-elevator{--fa:\"\\e16d\"}.fa-filter-circle-xmark{--fa:\"\\e17b\"}.fa-florin-sign{--fa:\"\\e184\"}.fa-folder-closed{--fa:\"\\e185\"}.fa-franc-sign{--fa:\"\\e18f\"}.fa-guarani-sign{--fa:\"\\e19a\"}.fa-gun{--fa:\"\\e19b\"}.fa-hands-clapping{--fa:\"\\e1a8\"}.fa-home-user,.fa-house-user{--fa:\"\\e1b0\"}.fa-indian-rupee,.fa-indian-rupee-sign,.fa-inr{--fa:\"\\e1bc\"}.fa-kip-sign{--fa:\"\\e1c4\"}.fa-lari-sign{--fa:\"\\e1c8\"}.fa-litecoin-sign{--fa:\"\\e1d3\"}.fa-manat-sign{--fa:\"\\e1d5\"}.fa-mask-face{--fa:\"\\e1d7\"}.fa-mill-sign{--fa:\"\\e1ed\"}.fa-money-bills{--fa:\"\\e1f3\"}.fa-naira-sign{--fa:\"\\e1f6\"}.fa-notdef{--fa:\"\\e1fe\"}.fa-panorama{--fa:\"\\e209\"}.fa-peseta-sign{--fa:\"\\e221\"}.fa-peso-sign{--fa:\"\\e222\"}.fa-plane-up{--fa:\"\\e22d\"}.fa-rupiah-sign{--fa:\"\\e23d\"}.fa-stairs{--fa:\"\\e289\"}.fa-timeline{--fa:\"\\e29c\"}.fa-truck-front{--fa:\"\\e2b7\"}.fa-try,.fa-turkish-lira,.fa-turkish-lira-sign{--fa:\"\\e2bb\"}.fa-vault{--fa:\"\\e2c5\"}.fa-magic-wand-sparkles,.fa-wand-magic-sparkles{--fa:\"\\e2ca\"}.fa-wheat-alt,.fa-wheat-awn{--fa:\"\\e2cd\"}.fa-wheelchair-alt,.fa-wheelchair-move{--fa:\"\\e2ce\"}.fa-bangladeshi-taka-sign{--fa:\"\\e2e6\"}.fa-bowl-rice{--fa:\"\\e2eb\"}.fa-person-pregnant{--fa:\"\\e31e\"}.fa-home-lg,.fa-house-chimney{--fa:\"\\e3af\"}.fa-house-crack{--fa:\"\\e3b1\"}.fa-house-medical{--fa:\"\\e3b2\"}.fa-cent-sign{--fa:\"\\e3f5\"}.fa-plus-minus{--fa:\"\\e43c\"}.fa-sailboat{--fa:\"\\e445\"}.fa-section{--fa:\"\\e447\"}.fa-shrimp{--fa:\"\\e448\"}.fa-brazilian-real-sign{--fa:\"\\e46c\"}.fa-chart-simple{--fa:\"\\e473\"}.fa-diagram-next{--fa:\"\\e476\"}.fa-diagram-predecessor{--fa:\"\\e477\"}.fa-diagram-successor{--fa:\"\\e47a\"}.fa-earth-oceania,.fa-globe-oceania{--fa:\"\\e47b\"}.fa-bug-slash{--fa:\"\\e490\"}.fa-file-circle-plus{--fa:\"\\e494\"}.fa-shop-lock{--fa:\"\\e4a5\"}.fa-virus-covid{--fa:\"\\e4a8\"}.fa-virus-covid-slash{--fa:\"\\e4a9\"}.fa-anchor-circle-check{--fa:\"\\e4aa\"}.fa-anchor-circle-exclamation{--fa:\"\\e4ab\"}.fa-anchor-circle-xmark{--fa:\"\\e4ac\"}.fa-anchor-lock{--fa:\"\\e4ad\"}.fa-arrow-down-up-across-line{--fa:\"\\e4af\"}.fa-arrow-down-up-lock{--fa:\"\\e4b0\"}.fa-arrow-right-to-city{--fa:\"\\e4b3\"}.fa-arrow-up-from-ground-water{--fa:\"\\e4b5\"}.fa-arrow-up-from-water-pump{--fa:\"\\e4b6\"}.fa-arrow-up-right-dots{--fa:\"\\e4b7\"}.fa-arrows-down-to-line{--fa:\"\\e4b8\"}.fa-arrows-down-to-people{--fa:\"\\e4b9\"}.fa-arrows-left-right-to-line{--fa:\"\\e4ba\"}.fa-arrows-spin{--fa:\"\\e4bb\"}.fa-arrows-split-up-and-left{--fa:\"\\e4bc\"}.fa-arrows-to-circle{--fa:\"\\e4bd\"}.fa-arrows-to-dot{--fa:\"\\e4be\"}.fa-arrows-to-eye{--fa:\"\\e4bf\"}.fa-arrows-turn-right{--fa:\"\\e4c0\"}.fa-arrows-turn-to-dots{--fa:\"\\e4c1\"}.fa-arrows-up-to-line{--fa:\"\\e4c2\"}.fa-bore-hole{--fa:\"\\e4c3\"}.fa-bottle-droplet{--fa:\"\\e4c4\"}.fa-bottle-water{--fa:\"\\e4c5\"}.fa-bowl-food{--fa:\"\\e4c6\"}.fa-boxes-packing{--fa:\"\\e4c7\"}.fa-bridge{--fa:\"\\e4c8\"}.fa-bridge-circle-check{--fa:\"\\e4c9\"}.fa-bridge-circle-exclamation{--fa:\"\\e4ca\"}.fa-bridge-circle-xmark{--fa:\"\\e4cb\"}.fa-bridge-lock{--fa:\"\\e4cc\"}.fa-bridge-water{--fa:\"\\e4ce\"}.fa-bucket{--fa:\"\\e4cf\"}.fa-bugs{--fa:\"\\e4d0\"}.fa-building-circle-arrow-right{--fa:\"\\e4d1\"}.fa-building-circle-check{--fa:\"\\e4d2\"}.fa-building-circle-exclamation{--fa:\"\\e4d3\"}.fa-building-circle-xmark{--fa:\"\\e4d4\"}.fa-building-flag{--fa:\"\\e4d5\"}.fa-building-lock{--fa:\"\\e4d6\"}.fa-building-ngo{--fa:\"\\e4d7\"}.fa-building-shield{--fa:\"\\e4d8\"}.fa-building-un{--fa:\"\\e4d9\"}.fa-building-user{--fa:\"\\e4da\"}.fa-building-wheat{--fa:\"\\e4db\"}.fa-burst{--fa:\"\\e4dc\"}.fa-car-on{--fa:\"\\e4dd\"}.fa-car-tunnel{--fa:\"\\e4de\"}.fa-child-combatant,.fa-child-rifle{--fa:\"\\e4e0\"}.fa-children{--fa:\"\\e4e1\"}.fa-circle-nodes{--fa:\"\\e4e2\"}.fa-clipboard-question{--fa:\"\\e4e3\"}.fa-cloud-showers-water{--fa:\"\\e4e4\"}.fa-computer{--fa:\"\\e4e5\"}.fa-cubes-stacked{--fa:\"\\e4e6\"}.fa-envelope-circle-check{--fa:\"\\e4e8\"}.fa-explosion{--fa:\"\\e4e9\"}.fa-ferry{--fa:\"\\e4ea\"}.fa-file-circle-exclamation{--fa:\"\\e4eb\"}.fa-file-circle-minus{--fa:\"\\e4ed\"}.fa-file-circle-question{--fa:\"\\e4ef\"}.fa-file-shield{--fa:\"\\e4f0\"}.fa-fire-burner{--fa:\"\\e4f1\"}.fa-fish-fins{--fa:\"\\e4f2\"}.fa-flask-vial{--fa:\"\\e4f3\"}.fa-glass-water{--fa:\"\\e4f4\"}.fa-glass-water-droplet{--fa:\"\\e4f5\"}.fa-group-arrows-rotate{--fa:\"\\e4f6\"}.fa-hand-holding-hand{--fa:\"\\e4f7\"}.fa-handcuffs{--fa:\"\\e4f8\"}.fa-hands-bound{--fa:\"\\e4f9\"}.fa-hands-holding-child{--fa:\"\\e4fa\"}.fa-hands-holding-circle{--fa:\"\\e4fb\"}.fa-heart-circle-bolt{--fa:\"\\e4fc\"}.fa-heart-circle-check{--fa:\"\\e4fd\"}.fa-heart-circle-exclamation{--fa:\"\\e4fe\"}.fa-heart-circle-minus{--fa:\"\\e4ff\"}.fa-heart-circle-plus{--fa:\"\\e500\"}.fa-heart-circle-xmark{--fa:\"\\e501\"}.fa-helicopter-symbol{--fa:\"\\e502\"}.fa-helmet-un{--fa:\"\\e503\"}.fa-hill-avalanche{--fa:\"\\e507\"}.fa-hill-rockslide{--fa:\"\\e508\"}.fa-house-circle-check{--fa:\"\\e509\"}.fa-house-circle-exclamation{--fa:\"\\e50a\"}.fa-house-circle-xmark{--fa:\"\\e50b\"}.fa-house-fire{--fa:\"\\e50c\"}.fa-house-flag{--fa:\"\\e50d\"}.fa-house-flood-water{--fa:\"\\e50e\"}.fa-house-flood-water-circle-arrow-right{--fa:\"\\e50f\"}.fa-house-lock{--fa:\"\\e510\"}.fa-house-medical-circle-check{--fa:\"\\e511\"}.fa-house-medical-circle-exclamation{--fa:\"\\e512\"}.fa-house-medical-circle-xmark{--fa:\"\\e513\"}.fa-house-medical-flag{--fa:\"\\e514\"}.fa-house-tsunami{--fa:\"\\e515\"}.fa-jar{--fa:\"\\e516\"}.fa-jar-wheat{--fa:\"\\e517\"}.fa-jet-fighter-up{--fa:\"\\e518\"}.fa-jug-detergent{--fa:\"\\e519\"}.fa-kitchen-set{--fa:\"\\e51a\"}.fa-land-mine-on{--fa:\"\\e51b\"}.fa-landmark-flag{--fa:\"\\e51c\"}.fa-laptop-file{--fa:\"\\e51d\"}.fa-lines-leaning{--fa:\"\\e51e\"}.fa-location-pin-lock{--fa:\"\\e51f\"}.fa-locust{--fa:\"\\e520\"}.fa-magnifying-glass-arrow-right{--fa:\"\\e521\"}.fa-magnifying-glass-chart{--fa:\"\\e522\"}.fa-mars-and-venus-burst{--fa:\"\\e523\"}.fa-mask-ventilator{--fa:\"\\e524\"}.fa-mattress-pillow{--fa:\"\\e525\"}.fa-mobile-retro{--fa:\"\\e527\"}.fa-money-bill-transfer{--fa:\"\\e528\"}.fa-money-bill-trend-up{--fa:\"\\e529\"}.fa-money-bill-wheat{--fa:\"\\e52a\"}.fa-mosquito{--fa:\"\\e52b\"}.fa-mosquito-net{--fa:\"\\e52c\"}.fa-mound{--fa:\"\\e52d\"}.fa-mountain-city{--fa:\"\\e52e\"}.fa-mountain-sun{--fa:\"\\e52f\"}.fa-oil-well{--fa:\"\\e532\"}.fa-people-group{--fa:\"\\e533\"}.fa-people-line{--fa:\"\\e534\"}.fa-people-pulling{--fa:\"\\e535\"}.fa-people-robbery{--fa:\"\\e536\"}.fa-people-roof{--fa:\"\\e537\"}.fa-person-arrow-down-to-line{--fa:\"\\e538\"}.fa-person-arrow-up-from-line{--fa:\"\\e539\"}.fa-person-breastfeeding{--fa:\"\\e53a\"}.fa-person-burst{--fa:\"\\e53b\"}.fa-person-cane{--fa:\"\\e53c\"}.fa-person-chalkboard{--fa:\"\\e53d\"}.fa-person-circle-check{--fa:\"\\e53e\"}.fa-person-circle-exclamation{--fa:\"\\e53f\"}.fa-person-circle-minus{--fa:\"\\e540\"}.fa-person-circle-plus{--fa:\"\\e541\"}.fa-person-circle-question{--fa:\"\\e542\"}.fa-person-circle-xmark{--fa:\"\\e543\"}.fa-person-dress-burst{--fa:\"\\e544\"}.fa-person-drowning{--fa:\"\\e545\"}.fa-person-falling{--fa:\"\\e546\"}.fa-person-falling-burst{--fa:\"\\e547\"}.fa-person-half-dress{--fa:\"\\e548\"}.fa-person-harassing{--fa:\"\\e549\"}.fa-person-military-pointing{--fa:\"\\e54a\"}.fa-person-military-rifle{--fa:\"\\e54b\"}.fa-person-military-to-person{--fa:\"\\e54c\"}.fa-person-rays{--fa:\"\\e54d\"}.fa-person-rifle{--fa:\"\\e54e\"}.fa-person-shelter{--fa:\"\\e54f\"}.fa-person-walking-arrow-loop-left{--fa:\"\\e551\"}.fa-person-walking-arrow-right{--fa:\"\\e552\"}.fa-person-walking-dashed-line-arrow-right{--fa:\"\\e553\"}.fa-person-walking-luggage{--fa:\"\\e554\"}.fa-plane-circle-check{--fa:\"\\e555\"}.fa-plane-circle-exclamation{--fa:\"\\e556\"}.fa-plane-circle-xmark{--fa:\"\\e557\"}.fa-plane-lock{--fa:\"\\e558\"}.fa-plate-wheat{--fa:\"\\e55a\"}.fa-plug-circle-bolt{--fa:\"\\e55b\"}.fa-plug-circle-check{--fa:\"\\e55c\"}.fa-plug-circle-exclamation{--fa:\"\\e55d\"}.fa-plug-circle-minus{--fa:\"\\e55e\"}.fa-plug-circle-plus{--fa:\"\\e55f\"}.fa-plug-circle-xmark{--fa:\"\\e560\"}.fa-ranking-star{--fa:\"\\e561\"}.fa-road-barrier{--fa:\"\\e562\"}.fa-road-bridge{--fa:\"\\e563\"}.fa-road-circle-check{--fa:\"\\e564\"}.fa-road-circle-exclamation{--fa:\"\\e565\"}.fa-road-circle-xmark{--fa:\"\\e566\"}.fa-road-lock{--fa:\"\\e567\"}.fa-road-spikes{--fa:\"\\e568\"}.fa-rug{--fa:\"\\e569\"}.fa-sack-xmark{--fa:\"\\e56a\"}.fa-school-circle-check{--fa:\"\\e56b\"}.fa-school-circle-exclamation{--fa:\"\\e56c\"}.fa-school-circle-xmark{--fa:\"\\e56d\"}.fa-school-flag{--fa:\"\\e56e\"}.fa-school-lock{--fa:\"\\e56f\"}.fa-sheet-plastic{--fa:\"\\e571\"}.fa-shield-cat{--fa:\"\\e572\"}.fa-shield-dog{--fa:\"\\e573\"}.fa-shield-heart{--fa:\"\\e574\"}.fa-square-nfi{--fa:\"\\e576\"}.fa-square-person-confined{--fa:\"\\e577\"}.fa-square-virus{--fa:\"\\e578\"}.fa-rod-asclepius,.fa-rod-snake,.fa-staff-aesculapius,.fa-staff-snake{--fa:\"\\e579\"}.fa-sun-plant-wilt{--fa:\"\\e57a\"}.fa-tarp{--fa:\"\\e57b\"}.fa-tarp-droplet{--fa:\"\\e57c\"}.fa-tent{--fa:\"\\e57d\"}.fa-tent-arrow-down-to-line{--fa:\"\\e57e\"}.fa-tent-arrow-left-right{--fa:\"\\e57f\"}.fa-tent-arrow-turn-left{--fa:\"\\e580\"}.fa-tent-arrows-down{--fa:\"\\e581\"}.fa-tents{--fa:\"\\e582\"}.fa-toilet-portable{--fa:\"\\e583\"}.fa-toilets-portable{--fa:\"\\e584\"}.fa-tower-cell{--fa:\"\\e585\"}.fa-tower-observation{--fa:\"\\e586\"}.fa-tree-city{--fa:\"\\e587\"}.fa-trowel{--fa:\"\\e589\"}.fa-trowel-bricks{--fa:\"\\e58a\"}.fa-truck-arrow-right{--fa:\"\\e58b\"}.fa-truck-droplet{--fa:\"\\e58c\"}.fa-truck-field{--fa:\"\\e58d\"}.fa-truck-field-un{--fa:\"\\e58e\"}.fa-truck-plane{--fa:\"\\e58f\"}.fa-users-between-lines{--fa:\"\\e591\"}.fa-users-line{--fa:\"\\e592\"}.fa-users-rays{--fa:\"\\e593\"}.fa-users-rectangle{--fa:\"\\e594\"}.fa-users-viewfinder{--fa:\"\\e595\"}.fa-vial-circle-check{--fa:\"\\e596\"}.fa-vial-virus{--fa:\"\\e597\"}.fa-wheat-awn-circle-exclamation{--fa:\"\\e598\"}.fa-worm{--fa:\"\\e599\"}.fa-xmarks-lines{--fa:\"\\e59a\"}.fa-child-dress{--fa:\"\\e59c\"}.fa-child-reaching{--fa:\"\\e59d\"}.fa-file-circle-check{--fa:\"\\e5a0\"}.fa-file-circle-xmark{--fa:\"\\e5a1\"}.fa-person-through-window{--fa:\"\\e5a9\"}.fa-plant-wilt{--fa:\"\\e5aa\"}.fa-stapler{--fa:\"\\e5af\"}.fa-train-tram{--fa:\"\\e5b4\"}.fa-table-cells-column-lock{--fa:\"\\e678\"}.fa-table-cells-row-lock{--fa:\"\\e67a\"}.fa-thumb-tack-slash,.fa-thumbtack-slash{--fa:\"\\e68f\"}.fa-table-cells-row-unlock{--fa:\"\\e691\"}.fa-chart-diagram{--fa:\"\\e695\"}.fa-comment-nodes{--fa:\"\\e696\"}.fa-file-fragment{--fa:\"\\e697\"}.fa-file-half-dashed{--fa:\"\\e698\"}.fa-hexagon-nodes{--fa:\"\\e699\"}.fa-hexagon-nodes-bolt{--fa:\"\\e69a\"}.fa-square-binary{--fa:\"\\e69b\"}.fa-pentagon{--fa:\"\\e790\"}.fa-non-binary{--fa:\"\\e807\"}.fa-spiral{--fa:\"\\e80a\"}.fa-picture-in-picture{--fa:\"\\e80b\"}.fa-mobile-vibrate{--fa:\"\\e816\"}.fa-single-quote-left{--fa:\"\\e81b\"}.fa-single-quote-right{--fa:\"\\e81c\"}.fa-bus-side{--fa:\"\\e81d\"}.fa-heptagon,.fa-septagon{--fa:\"\\e820\"}.fa-aquarius{--fa:\"\\e845\"}.fa-aries{--fa:\"\\e846\"}.fa-cancer{--fa:\"\\e847\"}.fa-capricorn{--fa:\"\\e848\"}.fa-gemini{--fa:\"\\e849\"}.fa-leo{--fa:\"\\e84a\"}.fa-libra{--fa:\"\\e84b\"}.fa-pisces{--fa:\"\\e84c\"}.fa-sagittarius{--fa:\"\\e84d\"}.fa-scorpio{--fa:\"\\e84e\"}.fa-taurus{--fa:\"\\e84f\"}.fa-virgo{--fa:\"\\e850\"}.fa-glass-martini,.fa-martini-glass-empty{--fa:\"\\f000\"}.fa-music{--fa:\"\\f001\"}.fa-magnifying-glass,.fa-search{--fa:\"\\f002\"}.fa-heart{--fa:\"\\f004\"}.fa-star{--fa:\"\\f005\"}.fa-user,.fa-user-alt,.fa-user-large{--fa:\"\\f007\"}.fa-film,.fa-film-alt,.fa-film-simple{--fa:\"\\f008\"}.fa-table-cells-large,.fa-th-large{--fa:\"\\f009\"}.fa-table-cells,.fa-th{--fa:\"\\f00a\"}.fa-table-list,.fa-th-list{--fa:\"\\f00b\"}.fa-check{--fa:\"\\f00c\"}.fa-close,.fa-multiply,.fa-remove,.fa-times,.fa-xmark{--fa:\"\\f00d\"}.fa-magnifying-glass-plus,.fa-search-plus{--fa:\"\\f00e\"}.fa-magnifying-glass-minus,.fa-search-minus{--fa:\"\\f010\"}.fa-power-off{--fa:\"\\f011\"}.fa-signal,.fa-signal-5,.fa-signal-perfect{--fa:\"\\f012\"}.fa-cog,.fa-gear{--fa:\"\\f013\"}.fa-home,.fa-home-alt,.fa-home-lg-alt,.fa-house{--fa:\"\\f015\"}.fa-clock,.fa-clock-four{--fa:\"\\f017\"}.fa-road{--fa:\"\\f018\"}.fa-download{--fa:\"\\f019\"}.fa-inbox{--fa:\"\\f01c\"}.fa-arrow-right-rotate,.fa-arrow-rotate-forward,.fa-arrow-rotate-right,.fa-redo{--fa:\"\\f01e\"}.fa-arrows-rotate,.fa-refresh,.fa-sync{--fa:\"\\f021\"}.fa-list-alt,.fa-rectangle-list{--fa:\"\\f022\"}.fa-lock{--fa:\"\\f023\"}.fa-flag{--fa:\"\\f024\"}.fa-headphones,.fa-headphones-alt,.fa-headphones-simple{--fa:\"\\f025\"}.fa-volume-off{--fa:\"\\f026\"}.fa-volume-down,.fa-volume-low{--fa:\"\\f027\"}.fa-volume-high,.fa-volume-up{--fa:\"\\f028\"}.fa-qrcode{--fa:\"\\f029\"}.fa-barcode{--fa:\"\\f02a\"}.fa-tag{--fa:\"\\f02b\"}.fa-tags{--fa:\"\\f02c\"}.fa-book{--fa:\"\\f02d\"}.fa-bookmark{--fa:\"\\f02e\"}.fa-print{--fa:\"\\f02f\"}.fa-camera,.fa-camera-alt{--fa:\"\\f030\"}.fa-font{--fa:\"\\f031\"}.fa-bold{--fa:\"\\f032\"}.fa-italic{--fa:\"\\f033\"}.fa-text-height{--fa:\"\\f034\"}.fa-text-width{--fa:\"\\f035\"}.fa-align-left{--fa:\"\\f036\"}.fa-align-center{--fa:\"\\f037\"}.fa-align-right{--fa:\"\\f038\"}.fa-align-justify{--fa:\"\\f039\"}.fa-list,.fa-list-squares{--fa:\"\\f03a\"}.fa-dedent,.fa-outdent{--fa:\"\\f03b\"}.fa-indent{--fa:\"\\f03c\"}.fa-video,.fa-video-camera{--fa:\"\\f03d\"}.fa-image{--fa:\"\\f03e\"}.fa-location-pin,.fa-map-marker{--fa:\"\\f041\"}.fa-adjust,.fa-circle-half-stroke{--fa:\"\\f042\"}.fa-droplet,.fa-tint{--fa:\"\\f043\"}.fa-edit,.fa-pen-to-square{--fa:\"\\f044\"}.fa-arrows,.fa-arrows-up-down-left-right{--fa:\"\\f047\"}.fa-backward-step,.fa-step-backward{--fa:\"\\f048\"}.fa-backward-fast,.fa-fast-backward{--fa:\"\\f049\"}.fa-backward{--fa:\"\\f04a\"}.fa-play{--fa:\"\\f04b\"}.fa-pause{--fa:\"\\f04c\"}.fa-stop{--fa:\"\\f04d\"}.fa-forward{--fa:\"\\f04e\"}.fa-fast-forward,.fa-forward-fast{--fa:\"\\f050\"}.fa-forward-step,.fa-step-forward{--fa:\"\\f051\"}.fa-eject{--fa:\"\\f052\"}.fa-chevron-left{--fa:\"\\f053\"}.fa-chevron-right{--fa:\"\\f054\"}.fa-circle-plus,.fa-plus-circle{--fa:\"\\f055\"}.fa-circle-minus,.fa-minus-circle{--fa:\"\\f056\"}.fa-circle-xmark,.fa-times-circle,.fa-xmark-circle{--fa:\"\\f057\"}.fa-check-circle,.fa-circle-check{--fa:\"\\f058\"}.fa-circle-question,.fa-question-circle{--fa:\"\\f059\"}.fa-circle-info,.fa-info-circle{--fa:\"\\f05a\"}.fa-crosshairs{--fa:\"\\f05b\"}.fa-ban,.fa-cancel{--fa:\"\\f05e\"}.fa-arrow-left{--fa:\"\\f060\"}.fa-arrow-right{--fa:\"\\f061\"}.fa-arrow-up{--fa:\"\\f062\"}.fa-arrow-down{--fa:\"\\f063\"}.fa-mail-forward,.fa-share{--fa:\"\\f064\"}.fa-expand{--fa:\"\\f065\"}.fa-compress{--fa:\"\\f066\"}.fa-minus,.fa-subtract{--fa:\"\\f068\"}.fa-circle-exclamation,.fa-exclamation-circle{--fa:\"\\f06a\"}.fa-gift{--fa:\"\\f06b\"}.fa-leaf{--fa:\"\\f06c\"}.fa-fire{--fa:\"\\f06d\"}.fa-eye{--fa:\"\\f06e\"}.fa-eye-slash{--fa:\"\\f070\"}.fa-exclamation-triangle,.fa-triangle-exclamation,.fa-warning{--fa:\"\\f071\"}.fa-plane{--fa:\"\\f072\"}.fa-calendar-alt,.fa-calendar-days{--fa:\"\\f073\"}.fa-random,.fa-shuffle{--fa:\"\\f074\"}.fa-comment{--fa:\"\\f075\"}.fa-magnet{--fa:\"\\f076\"}.fa-chevron-up{--fa:\"\\f077\"}.fa-chevron-down{--fa:\"\\f078\"}.fa-retweet{--fa:\"\\f079\"}.fa-cart-shopping,.fa-shopping-cart{--fa:\"\\f07a\"}.fa-folder,.fa-folder-blank{--fa:\"\\f07b\"}.fa-folder-open{--fa:\"\\f07c\"}.fa-arrows-up-down,.fa-arrows-v{--fa:\"\\f07d\"}.fa-arrows-h,.fa-arrows-left-right{--fa:\"\\f07e\"}.fa-bar-chart,.fa-chart-bar{--fa:\"\\f080\"}.fa-camera-retro{--fa:\"\\f083\"}.fa-key{--fa:\"\\f084\"}.fa-cogs,.fa-gears{--fa:\"\\f085\"}.fa-comments{--fa:\"\\f086\"}.fa-star-half{--fa:\"\\f089\"}.fa-arrow-right-from-bracket,.fa-sign-out{--fa:\"\\f08b\"}.fa-thumb-tack,.fa-thumbtack{--fa:\"\\f08d\"}.fa-arrow-up-right-from-square,.fa-external-link{--fa:\"\\f08e\"}.fa-arrow-right-to-bracket,.fa-sign-in{--fa:\"\\f090\"}.fa-trophy{--fa:\"\\f091\"}.fa-upload{--fa:\"\\f093\"}.fa-lemon{--fa:\"\\f094\"}.fa-phone{--fa:\"\\f095\"}.fa-phone-square,.fa-square-phone{--fa:\"\\f098\"}.fa-unlock{--fa:\"\\f09c\"}.fa-credit-card,.fa-credit-card-alt{--fa:\"\\f09d\"}.fa-feed,.fa-rss{--fa:\"\\f09e\"}.fa-hard-drive,.fa-hdd{--fa:\"\\f0a0\"}.fa-bullhorn{--fa:\"\\f0a1\"}.fa-certificate{--fa:\"\\f0a3\"}.fa-hand-point-right{--fa:\"\\f0a4\"}.fa-hand-point-left{--fa:\"\\f0a5\"}.fa-hand-point-up{--fa:\"\\f0a6\"}.fa-hand-point-down{--fa:\"\\f0a7\"}.fa-arrow-circle-left,.fa-circle-arrow-left{--fa:\"\\f0a8\"}.fa-arrow-circle-right,.fa-circle-arrow-right{--fa:\"\\f0a9\"}.fa-arrow-circle-up,.fa-circle-arrow-up{--fa:\"\\f0aa\"}.fa-arrow-circle-down,.fa-circle-arrow-down{--fa:\"\\f0ab\"}.fa-globe{--fa:\"\\f0ac\"}.fa-wrench{--fa:\"\\f0ad\"}.fa-list-check,.fa-tasks{--fa:\"\\f0ae\"}.fa-filter{--fa:\"\\f0b0\"}.fa-briefcase{--fa:\"\\f0b1\"}.fa-arrows-alt,.fa-up-down-left-right{--fa:\"\\f0b2\"}.fa-users{--fa:\"\\f0c0\"}.fa-chain,.fa-link{--fa:\"\\f0c1\"}.fa-cloud{--fa:\"\\f0c2\"}.fa-flask{--fa:\"\\f0c3\"}.fa-cut,.fa-scissors{--fa:\"\\f0c4\"}.fa-copy{--fa:\"\\f0c5\"}.fa-paperclip{--fa:\"\\f0c6\"}.fa-floppy-disk,.fa-save{--fa:\"\\f0c7\"}.fa-square{--fa:\"\\f0c8\"}.fa-bars,.fa-navicon{--fa:\"\\f0c9\"}.fa-list-dots,.fa-list-ul{--fa:\"\\f0ca\"}.fa-list-1-2,.fa-list-numeric,.fa-list-ol{--fa:\"\\f0cb\"}.fa-strikethrough{--fa:\"\\f0cc\"}.fa-underline{--fa:\"\\f0cd\"}.fa-table{--fa:\"\\f0ce\"}.fa-magic,.fa-wand-magic{--fa:\"\\f0d0\"}.fa-truck{--fa:\"\\f0d1\"}.fa-money-bill{--fa:\"\\f0d6\"}.fa-caret-down{--fa:\"\\f0d7\"}.fa-caret-up{--fa:\"\\f0d8\"}.fa-caret-left{--fa:\"\\f0d9\"}.fa-caret-right{--fa:\"\\f0da\"}.fa-columns,.fa-table-columns{--fa:\"\\f0db\"}.fa-sort,.fa-unsorted{--fa:\"\\f0dc\"}.fa-sort-desc,.fa-sort-down{--fa:\"\\f0dd\"}.fa-sort-asc,.fa-sort-up{--fa:\"\\f0de\"}.fa-envelope{--fa:\"\\f0e0\"}.fa-arrow-left-rotate,.fa-arrow-rotate-back,.fa-arrow-rotate-backward,.fa-arrow-rotate-left,.fa-undo{--fa:\"\\f0e2\"}.fa-gavel,.fa-legal{--fa:\"\\f0e3\"}.fa-bolt,.fa-zap{--fa:\"\\f0e7\"}.fa-sitemap{--fa:\"\\f0e8\"}.fa-umbrella{--fa:\"\\f0e9\"}.fa-file-clipboard,.fa-paste{--fa:\"\\f0ea\"}.fa-lightbulb{--fa:\"\\f0eb\"}.fa-arrow-right-arrow-left,.fa-exchange{--fa:\"\\f0ec\"}.fa-cloud-arrow-down,.fa-cloud-download,.fa-cloud-download-alt{--fa:\"\\f0ed\"}.fa-cloud-arrow-up,.fa-cloud-upload,.fa-cloud-upload-alt{--fa:\"\\f0ee\"}.fa-user-doctor,.fa-user-md{--fa:\"\\f0f0\"}.fa-stethoscope{--fa:\"\\f0f1\"}.fa-suitcase{--fa:\"\\f0f2\"}.fa-bell{--fa:\"\\f0f3\"}.fa-coffee,.fa-mug-saucer{--fa:\"\\f0f4\"}.fa-hospital,.fa-hospital-alt,.fa-hospital-wide{--fa:\"\\f0f8\"}.fa-ambulance,.fa-truck-medical{--fa:\"\\f0f9\"}.fa-medkit,.fa-suitcase-medical{--fa:\"\\f0fa\"}.fa-fighter-jet,.fa-jet-fighter{--fa:\"\\f0fb\"}.fa-beer,.fa-beer-mug-empty{--fa:\"\\f0fc\"}.fa-h-square,.fa-square-h{--fa:\"\\f0fd\"}.fa-plus-square,.fa-square-plus{--fa:\"\\f0fe\"}.fa-angle-double-left,.fa-angles-left{--fa:\"\\f100\"}.fa-angle-double-right,.fa-angles-right{--fa:\"\\f101\"}.fa-angle-double-up,.fa-angles-up{--fa:\"\\f102\"}.fa-angle-double-down,.fa-angles-down{--fa:\"\\f103\"}.fa-angle-left{--fa:\"\\f104\"}.fa-angle-right{--fa:\"\\f105\"}.fa-angle-up{--fa:\"\\f106\"}.fa-angle-down{--fa:\"\\f107\"}.fa-laptop{--fa:\"\\f109\"}.fa-tablet-button{--fa:\"\\f10a\"}.fa-mobile-button{--fa:\"\\f10b\"}.fa-quote-left,.fa-quote-left-alt{--fa:\"\\f10d\"}.fa-quote-right,.fa-quote-right-alt{--fa:\"\\f10e\"}.fa-spinner{--fa:\"\\f110\"}.fa-circle{--fa:\"\\f111\"}.fa-face-smile,.fa-smile{--fa:\"\\f118\"}.fa-face-frown,.fa-frown{--fa:\"\\f119\"}.fa-face-meh,.fa-meh{--fa:\"\\f11a\"}.fa-gamepad{--fa:\"\\f11b\"}.fa-keyboard{--fa:\"\\f11c\"}.fa-flag-checkered{--fa:\"\\f11e\"}.fa-terminal{--fa:\"\\f120\"}.fa-code{--fa:\"\\f121\"}.fa-mail-reply-all,.fa-reply-all{--fa:\"\\f122\"}.fa-location-arrow{--fa:\"\\f124\"}.fa-crop{--fa:\"\\f125\"}.fa-code-branch{--fa:\"\\f126\"}.fa-chain-broken,.fa-chain-slash,.fa-link-slash,.fa-unlink{--fa:\"\\f127\"}.fa-info{--fa:\"\\f129\"}.fa-superscript{--fa:\"\\f12b\"}.fa-subscript{--fa:\"\\f12c\"}.fa-eraser{--fa:\"\\f12d\"}.fa-puzzle-piece{--fa:\"\\f12e\"}.fa-microphone{--fa:\"\\f130\"}.fa-microphone-slash{--fa:\"\\f131\"}.fa-shield,.fa-shield-blank{--fa:\"\\f132\"}.fa-calendar{--fa:\"\\f133\"}.fa-fire-extinguisher{--fa:\"\\f134\"}.fa-rocket{--fa:\"\\f135\"}.fa-chevron-circle-left,.fa-circle-chevron-left{--fa:\"\\f137\"}.fa-chevron-circle-right,.fa-circle-chevron-right{--fa:\"\\f138\"}.fa-chevron-circle-up,.fa-circle-chevron-up{--fa:\"\\f139\"}.fa-chevron-circle-down,.fa-circle-chevron-down{--fa:\"\\f13a\"}.fa-anchor{--fa:\"\\f13d\"}.fa-unlock-alt,.fa-unlock-keyhole{--fa:\"\\f13e\"}.fa-bullseye{--fa:\"\\f140\"}.fa-ellipsis,.fa-ellipsis-h{--fa:\"\\f141\"}.fa-ellipsis-v,.fa-ellipsis-vertical{--fa:\"\\f142\"}.fa-rss-square,.fa-square-rss{--fa:\"\\f143\"}.fa-circle-play,.fa-play-circle{--fa:\"\\f144\"}.fa-ticket{--fa:\"\\f145\"}.fa-minus-square,.fa-square-minus{--fa:\"\\f146\"}.fa-arrow-turn-up,.fa-level-up{--fa:\"\\f148\"}.fa-arrow-turn-down,.fa-level-down{--fa:\"\\f149\"}.fa-check-square,.fa-square-check{--fa:\"\\f14a\"}.fa-pen-square,.fa-pencil-square,.fa-square-pen{--fa:\"\\f14b\"}.fa-external-link-square,.fa-square-arrow-up-right{--fa:\"\\f14c\"}.fa-share-from-square,.fa-share-square{--fa:\"\\f14d\"}.fa-compass{--fa:\"\\f14e\"}.fa-caret-square-down,.fa-square-caret-down{--fa:\"\\f150\"}.fa-caret-square-up,.fa-square-caret-up{--fa:\"\\f151\"}.fa-caret-square-right,.fa-square-caret-right{--fa:\"\\f152\"}.fa-eur,.fa-euro,.fa-euro-sign{--fa:\"\\f153\"}.fa-gbp,.fa-pound-sign,.fa-sterling-sign{--fa:\"\\f154\"}.fa-rupee,.fa-rupee-sign{--fa:\"\\f156\"}.fa-cny,.fa-jpy,.fa-rmb,.fa-yen,.fa-yen-sign{--fa:\"\\f157\"}.fa-rouble,.fa-rub,.fa-ruble,.fa-ruble-sign{--fa:\"\\f158\"}.fa-krw,.fa-won,.fa-won-sign{--fa:\"\\f159\"}.fa-file{--fa:\"\\f15b\"}.fa-file-alt,.fa-file-lines,.fa-file-text{--fa:\"\\f15c\"}.fa-arrow-down-a-z,.fa-sort-alpha-asc,.fa-sort-alpha-down{--fa:\"\\f15d\"}.fa-arrow-up-a-z,.fa-sort-alpha-up{--fa:\"\\f15e\"}.fa-arrow-down-wide-short,.fa-sort-amount-asc,.fa-sort-amount-down{--fa:\"\\f160\"}.fa-arrow-up-wide-short,.fa-sort-amount-up{--fa:\"\\f161\"}.fa-arrow-down-1-9,.fa-sort-numeric-asc,.fa-sort-numeric-down{--fa:\"\\f162\"}.fa-arrow-up-1-9,.fa-sort-numeric-up{--fa:\"\\f163\"}.fa-thumbs-up{--fa:\"\\f164\"}.fa-thumbs-down{--fa:\"\\f165\"}.fa-arrow-down-long,.fa-long-arrow-down{--fa:\"\\f175\"}.fa-arrow-up-long,.fa-long-arrow-up{--fa:\"\\f176\"}.fa-arrow-left-long,.fa-long-arrow-left{--fa:\"\\f177\"}.fa-arrow-right-long,.fa-long-arrow-right{--fa:\"\\f178\"}.fa-female,.fa-person-dress{--fa:\"\\f182\"}.fa-male,.fa-person{--fa:\"\\f183\"}.fa-sun{--fa:\"\\f185\"}.fa-moon{--fa:\"\\f186\"}.fa-archive,.fa-box-archive{--fa:\"\\f187\"}.fa-bug{--fa:\"\\f188\"}.fa-caret-square-left,.fa-square-caret-left{--fa:\"\\f191\"}.fa-circle-dot,.fa-dot-circle{--fa:\"\\f192\"}.fa-wheelchair{--fa:\"\\f193\"}.fa-lira-sign{--fa:\"\\f195\"}.fa-shuttle-space,.fa-space-shuttle{--fa:\"\\f197\"}.fa-envelope-square,.fa-square-envelope{--fa:\"\\f199\"}.fa-bank,.fa-building-columns,.fa-institution,.fa-museum,.fa-university{--fa:\"\\f19c\"}.fa-graduation-cap,.fa-mortar-board{--fa:\"\\f19d\"}.fa-language{--fa:\"\\f1ab\"}.fa-fax{--fa:\"\\f1ac\"}.fa-building{--fa:\"\\f1ad\"}.fa-child{--fa:\"\\f1ae\"}.fa-paw{--fa:\"\\f1b0\"}.fa-cube{--fa:\"\\f1b2\"}.fa-cubes{--fa:\"\\f1b3\"}.fa-recycle{--fa:\"\\f1b8\"}.fa-automobile,.fa-car{--fa:\"\\f1b9\"}.fa-cab,.fa-taxi{--fa:\"\\f1ba\"}.fa-tree{--fa:\"\\f1bb\"}.fa-database{--fa:\"\\f1c0\"}.fa-file-pdf{--fa:\"\\f1c1\"}.fa-file-word{--fa:\"\\f1c2\"}.fa-file-excel{--fa:\"\\f1c3\"}.fa-file-powerpoint{--fa:\"\\f1c4\"}.fa-file-image{--fa:\"\\f1c5\"}.fa-file-archive,.fa-file-zipper{--fa:\"\\f1c6\"}.fa-file-audio{--fa:\"\\f1c7\"}.fa-file-video{--fa:\"\\f1c8\"}.fa-file-code{--fa:\"\\f1c9\"}.fa-life-ring{--fa:\"\\f1cd\"}.fa-circle-notch{--fa:\"\\f1ce\"}.fa-paper-plane{--fa:\"\\f1d8\"}.fa-clock-rotate-left,.fa-history{--fa:\"\\f1da\"}.fa-header,.fa-heading{--fa:\"\\f1dc\"}.fa-paragraph{--fa:\"\\f1dd\"}.fa-sliders,.fa-sliders-h{--fa:\"\\f1de\"}.fa-share-alt,.fa-share-nodes{--fa:\"\\f1e0\"}.fa-share-alt-square,.fa-square-share-nodes{--fa:\"\\f1e1\"}.fa-bomb{--fa:\"\\f1e2\"}.fa-futbol,.fa-futbol-ball,.fa-soccer-ball{--fa:\"\\f1e3\"}.fa-teletype,.fa-tty{--fa:\"\\f1e4\"}.fa-binoculars{--fa:\"\\f1e5\"}.fa-plug{--fa:\"\\f1e6\"}.fa-newspaper{--fa:\"\\f1ea\"}.fa-wifi,.fa-wifi-3,.fa-wifi-strong{--fa:\"\\f1eb\"}.fa-calculator{--fa:\"\\f1ec\"}.fa-bell-slash{--fa:\"\\f1f6\"}.fa-trash{--fa:\"\\f1f8\"}.fa-copyright{--fa:\"\\f1f9\"}.fa-eye-dropper,.fa-eye-dropper-empty,.fa-eyedropper{--fa:\"\\f1fb\"}.fa-paint-brush,.fa-paintbrush{--fa:\"\\f1fc\"}.fa-birthday-cake,.fa-cake,.fa-cake-candles{--fa:\"\\f1fd\"}.fa-area-chart,.fa-chart-area{--fa:\"\\f1fe\"}.fa-chart-pie,.fa-pie-chart{--fa:\"\\f200\"}.fa-chart-line,.fa-line-chart{--fa:\"\\f201\"}.fa-toggle-off{--fa:\"\\f204\"}.fa-toggle-on{--fa:\"\\f205\"}.fa-bicycle{--fa:\"\\f206\"}.fa-bus{--fa:\"\\f207\"}.fa-closed-captioning{--fa:\"\\f20a\"}.fa-ils,.fa-shekel,.fa-shekel-sign,.fa-sheqel,.fa-sheqel-sign{--fa:\"\\f20b\"}.fa-cart-plus{--fa:\"\\f217\"}.fa-cart-arrow-down{--fa:\"\\f218\"}.fa-diamond{--fa:\"\\f219\"}.fa-ship{--fa:\"\\f21a\"}.fa-user-secret{--fa:\"\\f21b\"}.fa-motorcycle{--fa:\"\\f21c\"}.fa-street-view{--fa:\"\\f21d\"}.fa-heart-pulse,.fa-heartbeat{--fa:\"\\f21e\"}.fa-venus{--fa:\"\\f221\"}.fa-mars{--fa:\"\\f222\"}.fa-mercury{--fa:\"\\f223\"}.fa-mars-and-venus{--fa:\"\\f224\"}.fa-transgender,.fa-transgender-alt{--fa:\"\\f225\"}.fa-venus-double{--fa:\"\\f226\"}.fa-mars-double{--fa:\"\\f227\"}.fa-venus-mars{--fa:\"\\f228\"}.fa-mars-stroke{--fa:\"\\f229\"}.fa-mars-stroke-up,.fa-mars-stroke-v{--fa:\"\\f22a\"}.fa-mars-stroke-h,.fa-mars-stroke-right{--fa:\"\\f22b\"}.fa-neuter{--fa:\"\\f22c\"}.fa-genderless{--fa:\"\\f22d\"}.fa-server{--fa:\"\\f233\"}.fa-user-plus{--fa:\"\\f234\"}.fa-user-times,.fa-user-xmark{--fa:\"\\f235\"}.fa-bed{--fa:\"\\f236\"}.fa-train{--fa:\"\\f238\"}.fa-subway,.fa-train-subway{--fa:\"\\f239\"}.fa-battery,.fa-battery-5,.fa-battery-full{--fa:\"\\f240\"}.fa-battery-4,.fa-battery-three-quarters{--fa:\"\\f241\"}.fa-battery-3,.fa-battery-half{--fa:\"\\f242\"}.fa-battery-2,.fa-battery-quarter{--fa:\"\\f243\"}.fa-battery-0,.fa-battery-empty{--fa:\"\\f244\"}.fa-arrow-pointer,.fa-mouse-pointer{--fa:\"\\f245\"}.fa-i-cursor{--fa:\"\\f246\"}.fa-object-group{--fa:\"\\f247\"}.fa-object-ungroup{--fa:\"\\f248\"}.fa-note-sticky,.fa-sticky-note{--fa:\"\\f249\"}.fa-clone{--fa:\"\\f24d\"}.fa-balance-scale,.fa-scale-balanced{--fa:\"\\f24e\"}.fa-hourglass-1,.fa-hourglass-start{--fa:\"\\f251\"}.fa-hourglass-2,.fa-hourglass-half{--fa:\"\\f252\"}.fa-hourglass-3,.fa-hourglass-end{--fa:\"\\f253\"}.fa-hourglass,.fa-hourglass-empty{--fa:\"\\f254\"}.fa-hand-back-fist,.fa-hand-rock{--fa:\"\\f255\"}.fa-hand,.fa-hand-paper{--fa:\"\\f256\"}.fa-hand-scissors{--fa:\"\\f257\"}.fa-hand-lizard{--fa:\"\\f258\"}.fa-hand-spock{--fa:\"\\f259\"}.fa-hand-pointer{--fa:\"\\f25a\"}.fa-hand-peace{--fa:\"\\f25b\"}.fa-trademark{--fa:\"\\f25c\"}.fa-registered{--fa:\"\\f25d\"}.fa-television,.fa-tv,.fa-tv-alt{--fa:\"\\f26c\"}.fa-calendar-plus{--fa:\"\\f271\"}.fa-calendar-minus{--fa:\"\\f272\"}.fa-calendar-times,.fa-calendar-xmark{--fa:\"\\f273\"}.fa-calendar-check{--fa:\"\\f274\"}.fa-industry{--fa:\"\\f275\"}.fa-map-pin{--fa:\"\\f276\"}.fa-map-signs,.fa-signs-post{--fa:\"\\f277\"}.fa-map{--fa:\"\\f279\"}.fa-comment-alt,.fa-message{--fa:\"\\f27a\"}.fa-circle-pause,.fa-pause-circle{--fa:\"\\f28b\"}.fa-circle-stop,.fa-stop-circle{--fa:\"\\f28d\"}.fa-bag-shopping,.fa-shopping-bag{--fa:\"\\f290\"}.fa-basket-shopping,.fa-shopping-basket{--fa:\"\\f291\"}.fa-universal-access{--fa:\"\\f29a\"}.fa-blind,.fa-person-walking-with-cane{--fa:\"\\f29d\"}.fa-audio-description{--fa:\"\\f29e\"}.fa-phone-volume,.fa-volume-control-phone{--fa:\"\\f2a0\"}.fa-braille{--fa:\"\\f2a1\"}.fa-assistive-listening-systems,.fa-ear-listen{--fa:\"\\f2a2\"}.fa-american-sign-language-interpreting,.fa-asl-interpreting,.fa-hands-american-sign-language-interpreting,.fa-hands-asl-interpreting{--fa:\"\\f2a3\"}.fa-deaf,.fa-deafness,.fa-ear-deaf,.fa-hard-of-hearing{--fa:\"\\f2a4\"}.fa-hands,.fa-sign-language,.fa-signing{--fa:\"\\f2a7\"}.fa-eye-low-vision,.fa-low-vision{--fa:\"\\f2a8\"}.fa-handshake,.fa-handshake-alt,.fa-handshake-simple{--fa:\"\\f2b5\"}.fa-envelope-open{--fa:\"\\f2b6\"}.fa-address-book,.fa-contact-book{--fa:\"\\f2b9\"}.fa-address-card,.fa-contact-card,.fa-vcard{--fa:\"\\f2bb\"}.fa-circle-user,.fa-user-circle{--fa:\"\\f2bd\"}.fa-id-badge{--fa:\"\\f2c1\"}.fa-drivers-license,.fa-id-card{--fa:\"\\f2c2\"}.fa-temperature-4,.fa-temperature-full,.fa-thermometer-4,.fa-thermometer-full{--fa:\"\\f2c7\"}.fa-temperature-3,.fa-temperature-three-quarters,.fa-thermometer-3,.fa-thermometer-three-quarters{--fa:\"\\f2c8\"}.fa-temperature-2,.fa-temperature-half,.fa-thermometer-2,.fa-thermometer-half{--fa:\"\\f2c9\"}.fa-temperature-1,.fa-temperature-quarter,.fa-thermometer-1,.fa-thermometer-quarter{--fa:\"\\f2ca\"}.fa-temperature-0,.fa-temperature-empty,.fa-thermometer-0,.fa-thermometer-empty{--fa:\"\\f2cb\"}.fa-shower{--fa:\"\\f2cc\"}.fa-bath,.fa-bathtub{--fa:\"\\f2cd\"}.fa-podcast{--fa:\"\\f2ce\"}.fa-window-maximize{--fa:\"\\f2d0\"}.fa-window-minimize{--fa:\"\\f2d1\"}.fa-window-restore{--fa:\"\\f2d2\"}.fa-square-xmark,.fa-times-square,.fa-xmark-square{--fa:\"\\f2d3\"}.fa-microchip{--fa:\"\\f2db\"}.fa-snowflake{--fa:\"\\f2dc\"}.fa-spoon,.fa-utensil-spoon{--fa:\"\\f2e5\"}.fa-cutlery,.fa-utensils{--fa:\"\\f2e7\"}.fa-rotate-back,.fa-rotate-backward,.fa-rotate-left,.fa-undo-alt{--fa:\"\\f2ea\"}.fa-trash-alt,.fa-trash-can{--fa:\"\\f2ed\"}.fa-rotate,.fa-sync-alt{--fa:\"\\f2f1\"}.fa-stopwatch{--fa:\"\\f2f2\"}.fa-right-from-bracket,.fa-sign-out-alt{--fa:\"\\f2f5\"}.fa-right-to-bracket,.fa-sign-in-alt{--fa:\"\\f2f6\"}.fa-redo-alt,.fa-rotate-forward,.fa-rotate-right{--fa:\"\\f2f9\"}.fa-poo{--fa:\"\\f2fe\"}.fa-images{--fa:\"\\f302\"}.fa-pencil,.fa-pencil-alt{--fa:\"\\f303\"}.fa-pen{--fa:\"\\f304\"}.fa-pen-alt,.fa-pen-clip{--fa:\"\\f305\"}.fa-octagon{--fa:\"\\f306\"}.fa-down-long,.fa-long-arrow-alt-down{--fa:\"\\f309\"}.fa-left-long,.fa-long-arrow-alt-left{--fa:\"\\f30a\"}.fa-long-arrow-alt-right,.fa-right-long{--fa:\"\\f30b\"}.fa-long-arrow-alt-up,.fa-up-long{--fa:\"\\f30c\"}.fa-hexagon{--fa:\"\\f312\"}.fa-file-edit,.fa-file-pen{--fa:\"\\f31c\"}.fa-expand-arrows-alt,.fa-maximize{--fa:\"\\f31e\"}.fa-clipboard{--fa:\"\\f328\"}.fa-arrows-alt-h,.fa-left-right{--fa:\"\\f337\"}.fa-arrows-alt-v,.fa-up-down{--fa:\"\\f338\"}.fa-alarm-clock{--fa:\"\\f34e\"}.fa-arrow-alt-circle-down,.fa-circle-down{--fa:\"\\f358\"}.fa-arrow-alt-circle-left,.fa-circle-left{--fa:\"\\f359\"}.fa-arrow-alt-circle-right,.fa-circle-right{--fa:\"\\f35a\"}.fa-arrow-alt-circle-up,.fa-circle-up{--fa:\"\\f35b\"}.fa-external-link-alt,.fa-up-right-from-square{--fa:\"\\f35d\"}.fa-external-link-square-alt,.fa-square-up-right{--fa:\"\\f360\"}.fa-exchange-alt,.fa-right-left{--fa:\"\\f362\"}.fa-repeat{--fa:\"\\f363\"}.fa-code-commit{--fa:\"\\f386\"}.fa-code-merge{--fa:\"\\f387\"}.fa-desktop,.fa-desktop-alt{--fa:\"\\f390\"}.fa-gem{--fa:\"\\f3a5\"}.fa-level-down-alt,.fa-turn-down{--fa:\"\\f3be\"}.fa-level-up-alt,.fa-turn-up{--fa:\"\\f3bf\"}.fa-lock-open{--fa:\"\\f3c1\"}.fa-location-dot,.fa-map-marker-alt{--fa:\"\\f3c5\"}.fa-microphone-alt,.fa-microphone-lines{--fa:\"\\f3c9\"}.fa-mobile-alt,.fa-mobile-screen-button{--fa:\"\\f3cd\"}.fa-mobile,.fa-mobile-android,.fa-mobile-phone{--fa:\"\\f3ce\"}.fa-mobile-android-alt,.fa-mobile-screen{--fa:\"\\f3cf\"}.fa-money-bill-1,.fa-money-bill-alt{--fa:\"\\f3d1\"}.fa-phone-slash{--fa:\"\\f3dd\"}.fa-image-portrait,.fa-portrait{--fa:\"\\f3e0\"}.fa-mail-reply,.fa-reply{--fa:\"\\f3e5\"}.fa-shield-alt,.fa-shield-halved{--fa:\"\\f3ed\"}.fa-tablet-alt,.fa-tablet-screen-button{--fa:\"\\f3fa\"}.fa-tablet,.fa-tablet-android{--fa:\"\\f3fb\"}.fa-ticket-alt,.fa-ticket-simple{--fa:\"\\f3ff\"}.fa-rectangle-times,.fa-rectangle-xmark,.fa-times-rectangle,.fa-window-close{--fa:\"\\f410\"}.fa-compress-alt,.fa-down-left-and-up-right-to-center{--fa:\"\\f422\"}.fa-expand-alt,.fa-up-right-and-down-left-from-center{--fa:\"\\f424\"}.fa-baseball-bat-ball{--fa:\"\\f432\"}.fa-baseball,.fa-baseball-ball{--fa:\"\\f433\"}.fa-basketball,.fa-basketball-ball{--fa:\"\\f434\"}.fa-bowling-ball{--fa:\"\\f436\"}.fa-chess{--fa:\"\\f439\"}.fa-chess-bishop{--fa:\"\\f43a\"}.fa-chess-board{--fa:\"\\f43c\"}.fa-chess-king{--fa:\"\\f43f\"}.fa-chess-knight{--fa:\"\\f441\"}.fa-chess-pawn{--fa:\"\\f443\"}.fa-chess-queen{--fa:\"\\f445\"}.fa-chess-rook{--fa:\"\\f447\"}.fa-dumbbell{--fa:\"\\f44b\"}.fa-football,.fa-football-ball{--fa:\"\\f44e\"}.fa-golf-ball,.fa-golf-ball-tee{--fa:\"\\f450\"}.fa-hockey-puck{--fa:\"\\f453\"}.fa-broom-ball,.fa-quidditch,.fa-quidditch-broom-ball{--fa:\"\\f458\"}.fa-square-full{--fa:\"\\f45c\"}.fa-ping-pong-paddle-ball,.fa-table-tennis,.fa-table-tennis-paddle-ball{--fa:\"\\f45d\"}.fa-volleyball,.fa-volleyball-ball{--fa:\"\\f45f\"}.fa-allergies,.fa-hand-dots{--fa:\"\\f461\"}.fa-band-aid,.fa-bandage{--fa:\"\\f462\"}.fa-box{--fa:\"\\f466\"}.fa-boxes,.fa-boxes-alt,.fa-boxes-stacked{--fa:\"\\f468\"}.fa-briefcase-medical{--fa:\"\\f469\"}.fa-burn,.fa-fire-flame-simple{--fa:\"\\f46a\"}.fa-capsules{--fa:\"\\f46b\"}.fa-clipboard-check{--fa:\"\\f46c\"}.fa-clipboard-list{--fa:\"\\f46d\"}.fa-diagnoses,.fa-person-dots-from-line{--fa:\"\\f470\"}.fa-dna{--fa:\"\\f471\"}.fa-dolly,.fa-dolly-box{--fa:\"\\f472\"}.fa-cart-flatbed,.fa-dolly-flatbed{--fa:\"\\f474\"}.fa-file-medical{--fa:\"\\f477\"}.fa-file-medical-alt,.fa-file-waveform{--fa:\"\\f478\"}.fa-first-aid,.fa-kit-medical{--fa:\"\\f479\"}.fa-circle-h,.fa-hospital-symbol{--fa:\"\\f47e\"}.fa-id-card-alt,.fa-id-card-clip{--fa:\"\\f47f\"}.fa-notes-medical{--fa:\"\\f481\"}.fa-pallet{--fa:\"\\f482\"}.fa-pills{--fa:\"\\f484\"}.fa-prescription-bottle{--fa:\"\\f485\"}.fa-prescription-bottle-alt,.fa-prescription-bottle-medical{--fa:\"\\f486\"}.fa-bed-pulse,.fa-procedures{--fa:\"\\f487\"}.fa-shipping-fast,.fa-truck-fast{--fa:\"\\f48b\"}.fa-smoking{--fa:\"\\f48d\"}.fa-syringe{--fa:\"\\f48e\"}.fa-tablets{--fa:\"\\f490\"}.fa-thermometer{--fa:\"\\f491\"}.fa-vial{--fa:\"\\f492\"}.fa-vials{--fa:\"\\f493\"}.fa-warehouse{--fa:\"\\f494\"}.fa-weight,.fa-weight-scale{--fa:\"\\f496\"}.fa-x-ray{--fa:\"\\f497\"}.fa-box-open{--fa:\"\\f49e\"}.fa-comment-dots,.fa-commenting{--fa:\"\\f4ad\"}.fa-comment-slash{--fa:\"\\f4b3\"}.fa-couch{--fa:\"\\f4b8\"}.fa-circle-dollar-to-slot,.fa-donate{--fa:\"\\f4b9\"}.fa-dove{--fa:\"\\f4ba\"}.fa-hand-holding{--fa:\"\\f4bd\"}.fa-hand-holding-heart{--fa:\"\\f4be\"}.fa-hand-holding-dollar,.fa-hand-holding-usd{--fa:\"\\f4c0\"}.fa-hand-holding-droplet,.fa-hand-holding-water{--fa:\"\\f4c1\"}.fa-hands-holding{--fa:\"\\f4c2\"}.fa-hands-helping,.fa-handshake-angle{--fa:\"\\f4c4\"}.fa-parachute-box{--fa:\"\\f4cd\"}.fa-people-carry,.fa-people-carry-box{--fa:\"\\f4ce\"}.fa-piggy-bank{--fa:\"\\f4d3\"}.fa-ribbon{--fa:\"\\f4d6\"}.fa-route{--fa:\"\\f4d7\"}.fa-seedling,.fa-sprout{--fa:\"\\f4d8\"}.fa-sign,.fa-sign-hanging{--fa:\"\\f4d9\"}.fa-face-smile-wink,.fa-smile-wink{--fa:\"\\f4da\"}.fa-tape{--fa:\"\\f4db\"}.fa-truck-loading,.fa-truck-ramp-box{--fa:\"\\f4de\"}.fa-truck-moving{--fa:\"\\f4df\"}.fa-video-slash{--fa:\"\\f4e2\"}.fa-wine-glass{--fa:\"\\f4e3\"}.fa-user-astronaut{--fa:\"\\f4fb\"}.fa-user-check{--fa:\"\\f4fc\"}.fa-user-clock{--fa:\"\\f4fd\"}.fa-user-cog,.fa-user-gear{--fa:\"\\f4fe\"}.fa-user-edit,.fa-user-pen{--fa:\"\\f4ff\"}.fa-user-friends,.fa-user-group{--fa:\"\\f500\"}.fa-user-graduate{--fa:\"\\f501\"}.fa-user-lock{--fa:\"\\f502\"}.fa-user-minus{--fa:\"\\f503\"}.fa-user-ninja{--fa:\"\\f504\"}.fa-user-shield{--fa:\"\\f505\"}.fa-user-alt-slash,.fa-user-large-slash,.fa-user-slash{--fa:\"\\f506\"}.fa-user-tag{--fa:\"\\f507\"}.fa-user-tie{--fa:\"\\f508\"}.fa-users-cog,.fa-users-gear{--fa:\"\\f509\"}.fa-balance-scale-left,.fa-scale-unbalanced{--fa:\"\\f515\"}.fa-balance-scale-right,.fa-scale-unbalanced-flip{--fa:\"\\f516\"}.fa-blender{--fa:\"\\f517\"}.fa-book-open{--fa:\"\\f518\"}.fa-broadcast-tower,.fa-tower-broadcast{--fa:\"\\f519\"}.fa-broom{--fa:\"\\f51a\"}.fa-blackboard,.fa-chalkboard{--fa:\"\\f51b\"}.fa-chalkboard-teacher,.fa-chalkboard-user{--fa:\"\\f51c\"}.fa-church{--fa:\"\\f51d\"}.fa-coins{--fa:\"\\f51e\"}.fa-compact-disc{--fa:\"\\f51f\"}.fa-crow{--fa:\"\\f520\"}.fa-crown{--fa:\"\\f521\"}.fa-dice{--fa:\"\\f522\"}.fa-dice-five{--fa:\"\\f523\"}.fa-dice-four{--fa:\"\\f524\"}.fa-dice-one{--fa:\"\\f525\"}.fa-dice-six{--fa:\"\\f526\"}.fa-dice-three{--fa:\"\\f527\"}.fa-dice-two{--fa:\"\\f528\"}.fa-divide{--fa:\"\\f529\"}.fa-door-closed{--fa:\"\\f52a\"}.fa-door-open{--fa:\"\\f52b\"}.fa-feather{--fa:\"\\f52d\"}.fa-frog{--fa:\"\\f52e\"}.fa-gas-pump{--fa:\"\\f52f\"}.fa-glasses{--fa:\"\\f530\"}.fa-greater-than-equal{--fa:\"\\f532\"}.fa-helicopter{--fa:\"\\f533\"}.fa-infinity{--fa:\"\\f534\"}.fa-kiwi-bird{--fa:\"\\f535\"}.fa-less-than-equal{--fa:\"\\f537\"}.fa-memory{--fa:\"\\f538\"}.fa-microphone-alt-slash,.fa-microphone-lines-slash{--fa:\"\\f539\"}.fa-money-bill-wave{--fa:\"\\f53a\"}.fa-money-bill-1-wave,.fa-money-bill-wave-alt{--fa:\"\\f53b\"}.fa-money-check{--fa:\"\\f53c\"}.fa-money-check-alt,.fa-money-check-dollar{--fa:\"\\f53d\"}.fa-not-equal{--fa:\"\\f53e\"}.fa-palette{--fa:\"\\f53f\"}.fa-parking,.fa-square-parking{--fa:\"\\f540\"}.fa-diagram-project,.fa-project-diagram{--fa:\"\\f542\"}.fa-receipt{--fa:\"\\f543\"}.fa-robot{--fa:\"\\f544\"}.fa-ruler{--fa:\"\\f545\"}.fa-ruler-combined{--fa:\"\\f546\"}.fa-ruler-horizontal{--fa:\"\\f547\"}.fa-ruler-vertical{--fa:\"\\f548\"}.fa-school{--fa:\"\\f549\"}.fa-screwdriver{--fa:\"\\f54a\"}.fa-shoe-prints{--fa:\"\\f54b\"}.fa-skull{--fa:\"\\f54c\"}.fa-ban-smoking,.fa-smoking-ban{--fa:\"\\f54d\"}.fa-store{--fa:\"\\f54e\"}.fa-shop,.fa-store-alt{--fa:\"\\f54f\"}.fa-bars-staggered,.fa-reorder,.fa-stream{--fa:\"\\f550\"}.fa-stroopwafel{--fa:\"\\f551\"}.fa-toolbox{--fa:\"\\f552\"}.fa-shirt,.fa-t-shirt,.fa-tshirt{--fa:\"\\f553\"}.fa-person-walking,.fa-walking{--fa:\"\\f554\"}.fa-wallet{--fa:\"\\f555\"}.fa-angry,.fa-face-angry{--fa:\"\\f556\"}.fa-archway{--fa:\"\\f557\"}.fa-atlas,.fa-book-atlas{--fa:\"\\f558\"}.fa-award{--fa:\"\\f559\"}.fa-backspace,.fa-delete-left{--fa:\"\\f55a\"}.fa-bezier-curve{--fa:\"\\f55b\"}.fa-bong{--fa:\"\\f55c\"}.fa-brush{--fa:\"\\f55d\"}.fa-bus-alt,.fa-bus-simple{--fa:\"\\f55e\"}.fa-cannabis{--fa:\"\\f55f\"}.fa-check-double{--fa:\"\\f560\"}.fa-cocktail,.fa-martini-glass-citrus{--fa:\"\\f561\"}.fa-bell-concierge,.fa-concierge-bell{--fa:\"\\f562\"}.fa-cookie{--fa:\"\\f563\"}.fa-cookie-bite{--fa:\"\\f564\"}.fa-crop-alt,.fa-crop-simple{--fa:\"\\f565\"}.fa-digital-tachograph,.fa-tachograph-digital{--fa:\"\\f566\"}.fa-dizzy,.fa-face-dizzy{--fa:\"\\f567\"}.fa-compass-drafting,.fa-drafting-compass{--fa:\"\\f568\"}.fa-drum{--fa:\"\\f569\"}.fa-drum-steelpan{--fa:\"\\f56a\"}.fa-feather-alt,.fa-feather-pointed{--fa:\"\\f56b\"}.fa-file-contract{--fa:\"\\f56c\"}.fa-file-arrow-down,.fa-file-download{--fa:\"\\f56d\"}.fa-arrow-right-from-file,.fa-file-export{--fa:\"\\f56e\"}.fa-arrow-right-to-file,.fa-file-import{--fa:\"\\f56f\"}.fa-file-invoice{--fa:\"\\f570\"}.fa-file-invoice-dollar{--fa:\"\\f571\"}.fa-file-prescription{--fa:\"\\f572\"}.fa-file-signature{--fa:\"\\f573\"}.fa-file-arrow-up,.fa-file-upload{--fa:\"\\f574\"}.fa-fill{--fa:\"\\f575\"}.fa-fill-drip{--fa:\"\\f576\"}.fa-fingerprint{--fa:\"\\f577\"}.fa-fish{--fa:\"\\f578\"}.fa-face-flushed,.fa-flushed{--fa:\"\\f579\"}.fa-face-frown-open,.fa-frown-open{--fa:\"\\f57a\"}.fa-glass-martini-alt,.fa-martini-glass{--fa:\"\\f57b\"}.fa-earth-africa,.fa-globe-africa{--fa:\"\\f57c\"}.fa-earth,.fa-earth-america,.fa-earth-americas,.fa-globe-americas{--fa:\"\\f57d\"}.fa-earth-asia,.fa-globe-asia{--fa:\"\\f57e\"}.fa-face-grimace,.fa-grimace{--fa:\"\\f57f\"}.fa-face-grin,.fa-grin{--fa:\"\\f580\"}.fa-face-grin-wide,.fa-grin-alt{--fa:\"\\f581\"}.fa-face-grin-beam,.fa-grin-beam{--fa:\"\\f582\"}.fa-face-grin-beam-sweat,.fa-grin-beam-sweat{--fa:\"\\f583\"}.fa-face-grin-hearts,.fa-grin-hearts{--fa:\"\\f584\"}.fa-face-grin-squint,.fa-grin-squint{--fa:\"\\f585\"}.fa-face-grin-squint-tears,.fa-grin-squint-tears{--fa:\"\\f586\"}.fa-face-grin-stars,.fa-grin-stars{--fa:\"\\f587\"}.fa-face-grin-tears,.fa-grin-tears{--fa:\"\\f588\"}.fa-face-grin-tongue,.fa-grin-tongue{--fa:\"\\f589\"}.fa-face-grin-tongue-squint,.fa-grin-tongue-squint{--fa:\"\\f58a\"}.fa-face-grin-tongue-wink,.fa-grin-tongue-wink{--fa:\"\\f58b\"}.fa-face-grin-wink,.fa-grin-wink{--fa:\"\\f58c\"}.fa-grid-horizontal,.fa-grip,.fa-grip-horizontal{--fa:\"\\f58d\"}.fa-grid-vertical,.fa-grip-vertical{--fa:\"\\f58e\"}.fa-headset{--fa:\"\\f590\"}.fa-highlighter{--fa:\"\\f591\"}.fa-hot-tub,.fa-hot-tub-person{--fa:\"\\f593\"}.fa-hotel{--fa:\"\\f594\"}.fa-joint{--fa:\"\\f595\"}.fa-face-kiss,.fa-kiss{--fa:\"\\f596\"}.fa-face-kiss-beam,.fa-kiss-beam{--fa:\"\\f597\"}.fa-face-kiss-wink-heart,.fa-kiss-wink-heart{--fa:\"\\f598\"}.fa-face-laugh,.fa-laugh{--fa:\"\\f599\"}.fa-face-laugh-beam,.fa-laugh-beam{--fa:\"\\f59a\"}.fa-face-laugh-squint,.fa-laugh-squint{--fa:\"\\f59b\"}.fa-face-laugh-wink,.fa-laugh-wink{--fa:\"\\f59c\"}.fa-cart-flatbed-suitcase,.fa-luggage-cart{--fa:\"\\f59d\"}.fa-map-location,.fa-map-marked{--fa:\"\\f59f\"}.fa-map-location-dot,.fa-map-marked-alt{--fa:\"\\f5a0\"}.fa-marker{--fa:\"\\f5a1\"}.fa-medal{--fa:\"\\f5a2\"}.fa-face-meh-blank,.fa-meh-blank{--fa:\"\\f5a4\"}.fa-face-rolling-eyes,.fa-meh-rolling-eyes{--fa:\"\\f5a5\"}.fa-monument{--fa:\"\\f5a6\"}.fa-mortar-pestle{--fa:\"\\f5a7\"}.fa-paint-roller{--fa:\"\\f5aa\"}.fa-passport{--fa:\"\\f5ab\"}.fa-pen-fancy{--fa:\"\\f5ac\"}.fa-pen-nib{--fa:\"\\f5ad\"}.fa-pen-ruler,.fa-pencil-ruler{--fa:\"\\f5ae\"}.fa-plane-arrival{--fa:\"\\f5af\"}.fa-plane-departure{--fa:\"\\f5b0\"}.fa-prescription{--fa:\"\\f5b1\"}.fa-face-sad-cry,.fa-sad-cry{--fa:\"\\f5b3\"}.fa-face-sad-tear,.fa-sad-tear{--fa:\"\\f5b4\"}.fa-shuttle-van,.fa-van-shuttle{--fa:\"\\f5b6\"}.fa-signature{--fa:\"\\f5b7\"}.fa-face-smile-beam,.fa-smile-beam{--fa:\"\\f5b8\"}.fa-solar-panel{--fa:\"\\f5ba\"}.fa-lotus,.fa-spa{--fa:\"\\f5bb\"}.fa-splotch{--fa:\"\\f5bc\"}.fa-spray-can{--fa:\"\\f5bd\"}.fa-stamp{--fa:\"\\f5bf\"}.fa-star-half-alt,.fa-star-half-stroke{--fa:\"\\f5c0\"}.fa-suitcase-rolling{--fa:\"\\f5c1\"}.fa-face-surprise,.fa-surprise{--fa:\"\\f5c2\"}.fa-swatchbook{--fa:\"\\f5c3\"}.fa-person-swimming,.fa-swimmer{--fa:\"\\f5c4\"}.fa-ladder-water,.fa-swimming-pool,.fa-water-ladder{--fa:\"\\f5c5\"}.fa-droplet-slash,.fa-tint-slash{--fa:\"\\f5c7\"}.fa-face-tired,.fa-tired{--fa:\"\\f5c8\"}.fa-tooth{--fa:\"\\f5c9\"}.fa-umbrella-beach{--fa:\"\\f5ca\"}.fa-weight-hanging{--fa:\"\\f5cd\"}.fa-wine-glass-alt,.fa-wine-glass-empty{--fa:\"\\f5ce\"}.fa-air-freshener,.fa-spray-can-sparkles{--fa:\"\\f5d0\"}.fa-apple-alt,.fa-apple-whole{--fa:\"\\f5d1\"}.fa-atom{--fa:\"\\f5d2\"}.fa-bone{--fa:\"\\f5d7\"}.fa-book-open-reader,.fa-book-reader{--fa:\"\\f5da\"}.fa-brain{--fa:\"\\f5dc\"}.fa-car-alt,.fa-car-rear{--fa:\"\\f5de\"}.fa-battery-car,.fa-car-battery{--fa:\"\\f5df\"}.fa-car-burst,.fa-car-crash{--fa:\"\\f5e1\"}.fa-car-side{--fa:\"\\f5e4\"}.fa-charging-station{--fa:\"\\f5e7\"}.fa-diamond-turn-right,.fa-directions{--fa:\"\\f5eb\"}.fa-draw-polygon,.fa-vector-polygon{--fa:\"\\f5ee\"}.fa-laptop-code{--fa:\"\\f5fc\"}.fa-layer-group{--fa:\"\\f5fd\"}.fa-location,.fa-location-crosshairs{--fa:\"\\f601\"}.fa-lungs{--fa:\"\\f604\"}.fa-microscope{--fa:\"\\f610\"}.fa-oil-can{--fa:\"\\f613\"}.fa-poop{--fa:\"\\f619\"}.fa-shapes,.fa-triangle-circle-square{--fa:\"\\f61f\"}.fa-star-of-life{--fa:\"\\f621\"}.fa-dashboard,.fa-gauge,.fa-gauge-med,.fa-tachometer-alt-average{--fa:\"\\f624\"}.fa-gauge-high,.fa-tachometer-alt,.fa-tachometer-alt-fast{--fa:\"\\f625\"}.fa-gauge-simple,.fa-gauge-simple-med,.fa-tachometer-average{--fa:\"\\f629\"}.fa-gauge-simple-high,.fa-tachometer,.fa-tachometer-fast{--fa:\"\\f62a\"}.fa-teeth{--fa:\"\\f62e\"}.fa-teeth-open{--fa:\"\\f62f\"}.fa-masks-theater,.fa-theater-masks{--fa:\"\\f630\"}.fa-traffic-light{--fa:\"\\f637\"}.fa-truck-monster{--fa:\"\\f63b\"}.fa-truck-pickup{--fa:\"\\f63c\"}.fa-ad,.fa-rectangle-ad{--fa:\"\\f641\"}.fa-ankh{--fa:\"\\f644\"}.fa-bible,.fa-book-bible{--fa:\"\\f647\"}.fa-briefcase-clock,.fa-business-time{--fa:\"\\f64a\"}.fa-city{--fa:\"\\f64f\"}.fa-comment-dollar{--fa:\"\\f651\"}.fa-comments-dollar{--fa:\"\\f653\"}.fa-cross{--fa:\"\\f654\"}.fa-dharmachakra{--fa:\"\\f655\"}.fa-envelope-open-text{--fa:\"\\f658\"}.fa-folder-minus{--fa:\"\\f65d\"}.fa-folder-plus{--fa:\"\\f65e\"}.fa-filter-circle-dollar,.fa-funnel-dollar{--fa:\"\\f662\"}.fa-gopuram{--fa:\"\\f664\"}.fa-hamsa{--fa:\"\\f665\"}.fa-bahai,.fa-haykal{--fa:\"\\f666\"}.fa-jedi{--fa:\"\\f669\"}.fa-book-journal-whills,.fa-journal-whills{--fa:\"\\f66a\"}.fa-kaaba{--fa:\"\\f66b\"}.fa-khanda{--fa:\"\\f66d\"}.fa-landmark{--fa:\"\\f66f\"}.fa-envelopes-bulk,.fa-mail-bulk{--fa:\"\\f674\"}.fa-menorah{--fa:\"\\f676\"}.fa-mosque{--fa:\"\\f678\"}.fa-om{--fa:\"\\f679\"}.fa-pastafarianism,.fa-spaghetti-monster-flying{--fa:\"\\f67b\"}.fa-peace{--fa:\"\\f67c\"}.fa-place-of-worship{--fa:\"\\f67f\"}.fa-poll,.fa-square-poll-vertical{--fa:\"\\f681\"}.fa-poll-h,.fa-square-poll-horizontal{--fa:\"\\f682\"}.fa-person-praying,.fa-pray{--fa:\"\\f683\"}.fa-hands-praying,.fa-praying-hands{--fa:\"\\f684\"}.fa-book-quran,.fa-quran{--fa:\"\\f687\"}.fa-magnifying-glass-dollar,.fa-search-dollar{--fa:\"\\f688\"}.fa-magnifying-glass-location,.fa-search-location{--fa:\"\\f689\"}.fa-socks{--fa:\"\\f696\"}.fa-square-root-alt,.fa-square-root-variable{--fa:\"\\f698\"}.fa-star-and-crescent{--fa:\"\\f699\"}.fa-star-of-david{--fa:\"\\f69a\"}.fa-synagogue{--fa:\"\\f69b\"}.fa-scroll-torah,.fa-torah{--fa:\"\\f6a0\"}.fa-torii-gate{--fa:\"\\f6a1\"}.fa-vihara{--fa:\"\\f6a7\"}.fa-volume,.fa-volume-medium{--fa:\"\\f6a8\"}.fa-volume-mute,.fa-volume-times,.fa-volume-xmark{--fa:\"\\f6a9\"}.fa-yin-yang{--fa:\"\\f6ad\"}.fa-blender-phone{--fa:\"\\f6b6\"}.fa-book-dead,.fa-book-skull{--fa:\"\\f6b7\"}.fa-campground{--fa:\"\\f6bb\"}.fa-cat{--fa:\"\\f6be\"}.fa-chair{--fa:\"\\f6c0\"}.fa-cloud-moon{--fa:\"\\f6c3\"}.fa-cloud-sun{--fa:\"\\f6c4\"}.fa-cow{--fa:\"\\f6c8\"}.fa-dice-d20{--fa:\"\\f6cf\"}.fa-dice-d6{--fa:\"\\f6d1\"}.fa-dog{--fa:\"\\f6d3\"}.fa-dragon{--fa:\"\\f6d5\"}.fa-drumstick-bite{--fa:\"\\f6d7\"}.fa-dungeon{--fa:\"\\f6d9\"}.fa-file-csv{--fa:\"\\f6dd\"}.fa-fist-raised,.fa-hand-fist{--fa:\"\\f6de\"}.fa-ghost{--fa:\"\\f6e2\"}.fa-hammer{--fa:\"\\f6e3\"}.fa-hanukiah{--fa:\"\\f6e6\"}.fa-hat-wizard{--fa:\"\\f6e8\"}.fa-hiking,.fa-person-hiking{--fa:\"\\f6ec\"}.fa-hippo{--fa:\"\\f6ed\"}.fa-horse{--fa:\"\\f6f0\"}.fa-house-chimney-crack,.fa-house-damage{--fa:\"\\f6f1\"}.fa-hryvnia,.fa-hryvnia-sign{--fa:\"\\f6f2\"}.fa-mask{--fa:\"\\f6fa\"}.fa-mountain{--fa:\"\\f6fc\"}.fa-network-wired{--fa:\"\\f6ff\"}.fa-otter{--fa:\"\\f700\"}.fa-ring{--fa:\"\\f70b\"}.fa-person-running,.fa-running{--fa:\"\\f70c\"}.fa-scroll{--fa:\"\\f70e\"}.fa-skull-crossbones{--fa:\"\\f714\"}.fa-slash{--fa:\"\\f715\"}.fa-spider{--fa:\"\\f717\"}.fa-toilet-paper,.fa-toilet-paper-alt,.fa-toilet-paper-blank{--fa:\"\\f71e\"}.fa-tractor{--fa:\"\\f722\"}.fa-user-injured{--fa:\"\\f728\"}.fa-vr-cardboard{--fa:\"\\f729\"}.fa-wand-sparkles{--fa:\"\\f72b\"}.fa-wind{--fa:\"\\f72e\"}.fa-wine-bottle{--fa:\"\\f72f\"}.fa-cloud-meatball{--fa:\"\\f73b\"}.fa-cloud-moon-rain{--fa:\"\\f73c\"}.fa-cloud-rain{--fa:\"\\f73d\"}.fa-cloud-showers-heavy{--fa:\"\\f740\"}.fa-cloud-sun-rain{--fa:\"\\f743\"}.fa-democrat{--fa:\"\\f747\"}.fa-flag-usa{--fa:\"\\f74d\"}.fa-hurricane{--fa:\"\\f751\"}.fa-landmark-alt,.fa-landmark-dome{--fa:\"\\f752\"}.fa-meteor{--fa:\"\\f753\"}.fa-person-booth{--fa:\"\\f756\"}.fa-poo-bolt,.fa-poo-storm{--fa:\"\\f75a\"}.fa-rainbow{--fa:\"\\f75b\"}.fa-republican{--fa:\"\\f75e\"}.fa-smog{--fa:\"\\f75f\"}.fa-temperature-high{--fa:\"\\f769\"}.fa-temperature-low{--fa:\"\\f76b\"}.fa-cloud-bolt,.fa-thunderstorm{--fa:\"\\f76c\"}.fa-tornado{--fa:\"\\f76f\"}.fa-volcano{--fa:\"\\f770\"}.fa-check-to-slot,.fa-vote-yea{--fa:\"\\f772\"}.fa-water{--fa:\"\\f773\"}.fa-baby{--fa:\"\\f77c\"}.fa-baby-carriage,.fa-carriage-baby{--fa:\"\\f77d\"}.fa-biohazard{--fa:\"\\f780\"}.fa-blog{--fa:\"\\f781\"}.fa-calendar-day{--fa:\"\\f783\"}.fa-calendar-week{--fa:\"\\f784\"}.fa-candy-cane{--fa:\"\\f786\"}.fa-carrot{--fa:\"\\f787\"}.fa-cash-register{--fa:\"\\f788\"}.fa-compress-arrows-alt,.fa-minimize{--fa:\"\\f78c\"}.fa-dumpster{--fa:\"\\f793\"}.fa-dumpster-fire{--fa:\"\\f794\"}.fa-ethernet{--fa:\"\\f796\"}.fa-gifts{--fa:\"\\f79c\"}.fa-champagne-glasses,.fa-glass-cheers{--fa:\"\\f79f\"}.fa-glass-whiskey,.fa-whiskey-glass{--fa:\"\\f7a0\"}.fa-earth-europe,.fa-globe-europe{--fa:\"\\f7a2\"}.fa-grip-lines{--fa:\"\\f7a4\"}.fa-grip-lines-vertical{--fa:\"\\f7a5\"}.fa-guitar{--fa:\"\\f7a6\"}.fa-heart-broken,.fa-heart-crack{--fa:\"\\f7a9\"}.fa-holly-berry{--fa:\"\\f7aa\"}.fa-horse-head{--fa:\"\\f7ab\"}.fa-icicles{--fa:\"\\f7ad\"}.fa-igloo{--fa:\"\\f7ae\"}.fa-mitten{--fa:\"\\f7b5\"}.fa-mug-hot{--fa:\"\\f7b6\"}.fa-radiation{--fa:\"\\f7b9\"}.fa-circle-radiation,.fa-radiation-alt{--fa:\"\\f7ba\"}.fa-restroom{--fa:\"\\f7bd\"}.fa-satellite{--fa:\"\\f7bf\"}.fa-satellite-dish{--fa:\"\\f7c0\"}.fa-sd-card{--fa:\"\\f7c2\"}.fa-sim-card{--fa:\"\\f7c4\"}.fa-person-skating,.fa-skating{--fa:\"\\f7c5\"}.fa-person-skiing,.fa-skiing{--fa:\"\\f7c9\"}.fa-person-skiing-nordic,.fa-skiing-nordic{--fa:\"\\f7ca\"}.fa-sleigh{--fa:\"\\f7cc\"}.fa-comment-sms,.fa-sms{--fa:\"\\f7cd\"}.fa-person-snowboarding,.fa-snowboarding{--fa:\"\\f7ce\"}.fa-snowman{--fa:\"\\f7d0\"}.fa-snowplow{--fa:\"\\f7d2\"}.fa-tenge,.fa-tenge-sign{--fa:\"\\f7d7\"}.fa-toilet{--fa:\"\\f7d8\"}.fa-screwdriver-wrench,.fa-tools{--fa:\"\\f7d9\"}.fa-cable-car,.fa-tram{--fa:\"\\f7da\"}.fa-fire-alt,.fa-fire-flame-curved{--fa:\"\\f7e4\"}.fa-bacon{--fa:\"\\f7e5\"}.fa-book-medical{--fa:\"\\f7e6\"}.fa-bread-slice{--fa:\"\\f7ec\"}.fa-cheese{--fa:\"\\f7ef\"}.fa-clinic-medical,.fa-house-chimney-medical{--fa:\"\\f7f2\"}.fa-clipboard-user{--fa:\"\\f7f3\"}.fa-comment-medical{--fa:\"\\f7f5\"}.fa-crutch{--fa:\"\\f7f7\"}.fa-disease{--fa:\"\\f7fa\"}.fa-egg{--fa:\"\\f7fb\"}.fa-folder-tree{--fa:\"\\f802\"}.fa-burger,.fa-hamburger{--fa:\"\\f805\"}.fa-hand-middle-finger{--fa:\"\\f806\"}.fa-hard-hat,.fa-hat-hard,.fa-helmet-safety{--fa:\"\\f807\"}.fa-hospital-user{--fa:\"\\f80d\"}.fa-hotdog{--fa:\"\\f80f\"}.fa-ice-cream{--fa:\"\\f810\"}.fa-laptop-medical{--fa:\"\\f812\"}.fa-pager{--fa:\"\\f815\"}.fa-pepper-hot{--fa:\"\\f816\"}.fa-pizza-slice{--fa:\"\\f818\"}.fa-sack-dollar{--fa:\"\\f81d\"}.fa-book-tanakh,.fa-tanakh{--fa:\"\\f827\"}.fa-bars-progress,.fa-tasks-alt{--fa:\"\\f828\"}.fa-trash-arrow-up,.fa-trash-restore{--fa:\"\\f829\"}.fa-trash-can-arrow-up,.fa-trash-restore-alt{--fa:\"\\f82a\"}.fa-user-nurse{--fa:\"\\f82f\"}.fa-wave-square{--fa:\"\\f83e\"}.fa-biking,.fa-person-biking{--fa:\"\\f84a\"}.fa-border-all{--fa:\"\\f84c\"}.fa-border-none{--fa:\"\\f850\"}.fa-border-style,.fa-border-top-left{--fa:\"\\f853\"}.fa-digging,.fa-person-digging{--fa:\"\\f85e\"}.fa-fan{--fa:\"\\f863\"}.fa-heart-music-camera-bolt,.fa-icons{--fa:\"\\f86d\"}.fa-phone-alt,.fa-phone-flip{--fa:\"\\f879\"}.fa-phone-square-alt,.fa-square-phone-flip{--fa:\"\\f87b\"}.fa-photo-film,.fa-photo-video{--fa:\"\\f87c\"}.fa-remove-format,.fa-text-slash{--fa:\"\\f87d\"}.fa-arrow-down-z-a,.fa-sort-alpha-desc,.fa-sort-alpha-down-alt{--fa:\"\\f881\"}.fa-arrow-up-z-a,.fa-sort-alpha-up-alt{--fa:\"\\f882\"}.fa-arrow-down-short-wide,.fa-sort-amount-desc,.fa-sort-amount-down-alt{--fa:\"\\f884\"}.fa-arrow-up-short-wide,.fa-sort-amount-up-alt{--fa:\"\\f885\"}.fa-arrow-down-9-1,.fa-sort-numeric-desc,.fa-sort-numeric-down-alt{--fa:\"\\f886\"}.fa-arrow-up-9-1,.fa-sort-numeric-up-alt{--fa:\"\\f887\"}.fa-spell-check{--fa:\"\\f891\"}.fa-voicemail{--fa:\"\\f897\"}.fa-hat-cowboy{--fa:\"\\f8c0\"}.fa-hat-cowboy-side{--fa:\"\\f8c1\"}.fa-computer-mouse,.fa-mouse{--fa:\"\\f8cc\"}.fa-radio{--fa:\"\\f8d7\"}.fa-record-vinyl{--fa:\"\\f8d9\"}.fa-walkie-talkie{--fa:\"\\f8ef\"}.fa-caravan{--fa:\"\\f8ff\"}\n:host,:root{--fa-family-brands:\"Font Awesome 7 Brands\";--fa-font-brands:normal 400 1em/1 var(--fa-family-brands)}@font-face{font-family:\"Font Awesome 7 Brands\";font-style:normal;font-weight:400;font-display:block;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ")}.fa-brands,.fa-classic.fa-brands,.fab{--fa-family:var(--fa-family-brands);--fa-style:400}.fa-firefox-browser{--fa:\"\\e007\"}.fa-ideal{--fa:\"\\e013\"}.fa-microblog{--fa:\"\\e01a\"}.fa-pied-piper-square,.fa-square-pied-piper{--fa:\"\\e01e\"}.fa-unity{--fa:\"\\e049\"}.fa-dailymotion{--fa:\"\\e052\"}.fa-instagram-square,.fa-square-instagram{--fa:\"\\e055\"}.fa-mixer{--fa:\"\\e056\"}.fa-shopify{--fa:\"\\e057\"}.fa-deezer{--fa:\"\\e077\"}.fa-edge-legacy{--fa:\"\\e078\"}.fa-google-pay{--fa:\"\\e079\"}.fa-rust{--fa:\"\\e07a\"}.fa-tiktok{--fa:\"\\e07b\"}.fa-unsplash{--fa:\"\\e07c\"}.fa-cloudflare{--fa:\"\\e07d\"}.fa-guilded{--fa:\"\\e07e\"}.fa-hive{--fa:\"\\e07f\"}.fa-42-group,.fa-innosoft{--fa:\"\\e080\"}.fa-instalod{--fa:\"\\e081\"}.fa-octopus-deploy{--fa:\"\\e082\"}.fa-perbyte{--fa:\"\\e083\"}.fa-uncharted{--fa:\"\\e084\"}.fa-watchman-monitoring{--fa:\"\\e087\"}.fa-wodu{--fa:\"\\e088\"}.fa-wirsindhandwerk,.fa-wsh{--fa:\"\\e2d0\"}.fa-bots{--fa:\"\\e340\"}.fa-cmplid{--fa:\"\\e360\"}.fa-bilibili{--fa:\"\\e3d9\"}.fa-golang{--fa:\"\\e40f\"}.fa-pix{--fa:\"\\e43a\"}.fa-sitrox{--fa:\"\\e44a\"}.fa-hashnode{--fa:\"\\e499\"}.fa-meta{--fa:\"\\e49b\"}.fa-padlet{--fa:\"\\e4a0\"}.fa-nfc-directional{--fa:\"\\e530\"}.fa-nfc-symbol{--fa:\"\\e531\"}.fa-screenpal{--fa:\"\\e570\"}.fa-space-awesome{--fa:\"\\e5ac\"}.fa-square-font-awesome{--fa:\"\\e5ad\"}.fa-gitlab-square,.fa-square-gitlab{--fa:\"\\e5ae\"}.fa-odysee{--fa:\"\\e5c6\"}.fa-stubber{--fa:\"\\e5c7\"}.fa-debian{--fa:\"\\e60b\"}.fa-shoelace{--fa:\"\\e60c\"}.fa-threads{--fa:\"\\e618\"}.fa-square-threads{--fa:\"\\e619\"}.fa-square-x-twitter{--fa:\"\\e61a\"}.fa-x-twitter{--fa:\"\\e61b\"}.fa-opensuse{--fa:\"\\e62b\"}.fa-letterboxd{--fa:\"\\e62d\"}.fa-square-letterboxd{--fa:\"\\e62e\"}.fa-mintbit{--fa:\"\\e62f\"}.fa-google-scholar{--fa:\"\\e63b\"}.fa-brave{--fa:\"\\e63c\"}.fa-brave-reverse{--fa:\"\\e63d\"}.fa-pixiv{--fa:\"\\e640\"}.fa-upwork{--fa:\"\\e641\"}.fa-webflow{--fa:\"\\e65c\"}.fa-signal-messenger{--fa:\"\\e663\"}.fa-bluesky{--fa:\"\\e671\"}.fa-jxl{--fa:\"\\e67b\"}.fa-square-upwork{--fa:\"\\e67c\"}.fa-web-awesome{--fa:\"\\e682\"}.fa-square-web-awesome{--fa:\"\\e683\"}.fa-square-web-awesome-stroke{--fa:\"\\e684\"}.fa-dart-lang{--fa:\"\\e693\"}.fa-flutter{--fa:\"\\e694\"}.fa-files-pinwheel{--fa:\"\\e69f\"}.fa-css{--fa:\"\\e6a2\"}.fa-square-bluesky{--fa:\"\\e6a3\"}.fa-openai{--fa:\"\\e7cf\"}.fa-square-linkedin{--fa:\"\\e7d0\"}.fa-cash-app{--fa:\"\\e7d4\"}.fa-disqus{--fa:\"\\e7d5\"}.fa-11ty,.fa-eleventy{--fa:\"\\e7d6\"}.fa-kakao-talk{--fa:\"\\e7d7\"}.fa-linktree{--fa:\"\\e7d8\"}.fa-notion{--fa:\"\\e7d9\"}.fa-pandora{--fa:\"\\e7da\"}.fa-pixelfed{--fa:\"\\e7db\"}.fa-tidal{--fa:\"\\e7dc\"}.fa-vsco{--fa:\"\\e7dd\"}.fa-w3c{--fa:\"\\e7de\"}.fa-lumon{--fa:\"\\e7e2\"}.fa-lumon-drop{--fa:\"\\e7e3\"}.fa-square-figma{--fa:\"\\e7e4\"}.fa-tex{--fa:\"\\e7ff\"}.fa-duolingo{--fa:\"\\e812\"}.fa-supportnow{--fa:\"\\e833\"}.fa-tor-browser{--fa:\"\\e838\"}.fa-typescript{--fa:\"\\e840\"}.fa-square-deskpro{--fa:\"\\e844\"}.fa-circle-zulip{--fa:\"\\e851\"}.fa-julia{--fa:\"\\e852\"}.fa-zulip{--fa:\"\\e853\"}.fa-unison{--fa:\"\\e854\"}.fa-bgg,.fa-board-game-geek{--fa:\"\\e855\"}.fa-ko-fi{--fa:\"\\e856\"}.fa-kubernetes{--fa:\"\\e857\"}.fa-postgresql{--fa:\"\\e858\"}.fa-scaleway{--fa:\"\\e859\"}.fa-venmo{--fa:\"\\e85a\"}.fa-venmo-v{--fa:\"\\e85b\"}.fa-unreal-engine{--fa:\"\\e85c\"}.fa-globaleaks{--fa:\"\\e85d\"}.fa-solana{--fa:\"\\e85e\"}.fa-threema{--fa:\"\\e85f\"}.fa-forgejo{--fa:\"\\e860\"}.fa-claude{--fa:\"\\e861\"}.fa-gitee{--fa:\"\\e863\"}.fa-xmpp{--fa:\"\\e864\"}.fa-fediverse{--fa:\"\\e865\"}.fa-tailwind-css{--fa:\"\\e866\"}.fa-arch-linux{--fa:\"\\e867\"}.fa-svelte{--fa:\"\\e868\"}.fa-hugging-face{--fa:\"\\e869\"}.fa-leetcode{--fa:\"\\e86a\"}.fa-openstreetmap{--fa:\"\\e86b\"}.fa-ultralytics{--fa:\"\\e86d\"}.fa-ultralytics-hub{--fa:\"\\e86e\"}.fa-ultralytics-yolo{--fa:\"\\e86f\"}.fa-obsidian{--fa:\"\\e879\"}.fa-zoom{--fa:\"\\e87b\"}.fa-vim{--fa:\"\\e88a\"}.fa-symfonycasts{--fa:\"\\e8ab\"}.fa-build-awesome{--fa:\"\\e8ac\"}.fa-codeberg{--fa:\"\\e8ad\"}.fa-devpost{--fa:\"\\e8ae\"}.fa-internet-archive{--fa:\"\\e8b1\"}.fa-lets-encrypt{--fa:\"\\e8b2\"}.fa-matrix{--fa:\"\\e8b3\"}.fa-mattermost{--fa:\"\\e8b4\"}.fa-nextcloud{--fa:\"\\e8b5\"}.fa-roblox-creator-studio{--fa:\"\\e8b6\"}.fa-square-build-awesome-stroke{--fa:\"\\e8b7\"}.fa-substack{--fa:\"\\e8b8\"}.fa-tesla{--fa:\"\\e8b9\"}.fa-xrp{--fa:\"\\e8ba\"}.fa-xrpl{--fa:\"\\e8bb\"}.fa-youtube-shorts{--fa:\"\\e8bc\"}.fa-ror{--fa:\"\\e8bd\"}.fa-visual-studio{--fa:\"\\e8be\"}.fa-dolibarr{--fa:\"\\e8bf\"}.fa-obs-studio{--fa:\"\\e8c0\"}.fa-storybook{--fa:\"\\e8c1\"}.fa-a11y-project{--fa:\"\\e8c2\"}.fa-copilot{--fa:\"\\e8c7\"}.fa-square-twitter,.fa-twitter-square{--fa:\"\\f081\"}.fa-facebook-square,.fa-square-facebook{--fa:\"\\f082\"}.fa-linkedin{--fa:\"\\f08c\"}.fa-github-square,.fa-square-github{--fa:\"\\f092\"}.fa-twitter{--fa:\"\\f099\"}.fa-facebook{--fa:\"\\f09a\"}.fa-github{--fa:\"\\f09b\"}.fa-pinterest{--fa:\"\\f0d2\"}.fa-pinterest-square,.fa-square-pinterest{--fa:\"\\f0d3\"}.fa-google-plus-square,.fa-square-google-plus{--fa:\"\\f0d4\"}.fa-google-plus-g{--fa:\"\\f0d5\"}.fa-linkedin-in{--fa:\"\\f0e1\"}.fa-github-alt{--fa:\"\\f113\"}.fa-maxcdn{--fa:\"\\f136\"}.fa-html5{--fa:\"\\f13b\"}.fa-css3{--fa:\"\\f13c\"}.fa-btc{--fa:\"\\f15a\"}.fa-youtube{--fa:\"\\f167\"}.fa-xing{--fa:\"\\f168\"}.fa-square-xing,.fa-xing-square{--fa:\"\\f169\"}.fa-dropbox{--fa:\"\\f16b\"}.fa-stack-overflow{--fa:\"\\f16c\"}.fa-instagram{--fa:\"\\f16d\"}.fa-flickr{--fa:\"\\f16e\"}.fa-adn{--fa:\"\\f170\"}.fa-bitbucket{--fa:\"\\f171\"}.fa-tumblr{--fa:\"\\f173\"}.fa-square-tumblr,.fa-tumblr-square{--fa:\"\\f174\"}.fa-apple{--fa:\"\\f179\"}.fa-windows{--fa:\"\\f17a\"}.fa-android{--fa:\"\\f17b\"}.fa-linux{--fa:\"\\f17c\"}.fa-dribbble{--fa:\"\\f17d\"}.fa-skype{--fa:\"\\f17e\"}.fa-foursquare{--fa:\"\\f180\"}.fa-trello{--fa:\"\\f181\"}.fa-gratipay{--fa:\"\\f184\"}.fa-vk{--fa:\"\\f189\"}.fa-weibo{--fa:\"\\f18a\"}.fa-renren{--fa:\"\\f18b\"}.fa-pagelines{--fa:\"\\f18c\"}.fa-stack-exchange{--fa:\"\\f18d\"}.fa-square-vimeo,.fa-vimeo-square{--fa:\"\\f194\"}.fa-slack,.fa-slack-hash{--fa:\"\\f198\"}.fa-wordpress{--fa:\"\\f19a\"}.fa-openid{--fa:\"\\f19b\"}.fa-yahoo{--fa:\"\\f19e\"}.fa-google{--fa:\"\\f1a0\"}.fa-reddit{--fa:\"\\f1a1\"}.fa-reddit-square,.fa-square-reddit{--fa:\"\\f1a2\"}.fa-stumbleupon-circle{--fa:\"\\f1a3\"}.fa-stumbleupon{--fa:\"\\f1a4\"}.fa-delicious{--fa:\"\\f1a5\"}.fa-digg{--fa:\"\\f1a6\"}.fa-pied-piper-pp{--fa:\"\\f1a7\"}.fa-pied-piper-alt{--fa:\"\\f1a8\"}.fa-drupal{--fa:\"\\f1a9\"}.fa-joomla{--fa:\"\\f1aa\"}.fa-behance{--fa:\"\\f1b4\"}.fa-behance-square,.fa-square-behance{--fa:\"\\f1b5\"}.fa-steam{--fa:\"\\f1b6\"}.fa-square-steam,.fa-steam-square{--fa:\"\\f1b7\"}.fa-spotify{--fa:\"\\f1bc\"}.fa-deviantart{--fa:\"\\f1bd\"}.fa-soundcloud{--fa:\"\\f1be\"}.fa-vine{--fa:\"\\f1ca\"}.fa-codepen{--fa:\"\\f1cb\"}.fa-jsfiddle{--fa:\"\\f1cc\"}.fa-rebel{--fa:\"\\f1d0\"}.fa-empire{--fa:\"\\f1d1\"}.fa-git-square,.fa-square-git{--fa:\"\\f1d2\"}.fa-git{--fa:\"\\f1d3\"}.fa-hacker-news{--fa:\"\\f1d4\"}.fa-tencent-weibo{--fa:\"\\f1d5\"}.fa-qq{--fa:\"\\f1d6\"}.fa-weixin{--fa:\"\\f1d7\"}.fa-slideshare{--fa:\"\\f1e7\"}.fa-twitch{--fa:\"\\f1e8\"}.fa-yelp{--fa:\"\\f1e9\"}.fa-paypal{--fa:\"\\f1ed\"}.fa-google-wallet{--fa:\"\\f1ee\"}.fa-cc-visa{--fa:\"\\f1f0\"}.fa-cc-mastercard{--fa:\"\\f1f1\"}.fa-cc-discover{--fa:\"\\f1f2\"}.fa-cc-amex{--fa:\"\\f1f3\"}.fa-cc-paypal{--fa:\"\\f1f4\"}.fa-cc-stripe{--fa:\"\\f1f5\"}.fa-lastfm{--fa:\"\\f202\"}.fa-lastfm-square,.fa-square-lastfm{--fa:\"\\f203\"}.fa-ioxhost{--fa:\"\\f208\"}.fa-angellist{--fa:\"\\f209\"}.fa-buysellads{--fa:\"\\f20d\"}.fa-connectdevelop{--fa:\"\\f20e\"}.fa-dashcube{--fa:\"\\f210\"}.fa-forumbee{--fa:\"\\f211\"}.fa-leanpub{--fa:\"\\f212\"}.fa-sellsy{--fa:\"\\f213\"}.fa-shirtsinbulk{--fa:\"\\f214\"}.fa-simplybuilt{--fa:\"\\f215\"}.fa-skyatlas{--fa:\"\\f216\"}.fa-pinterest-p{--fa:\"\\f231\"}.fa-whatsapp{--fa:\"\\f232\"}.fa-viacoin{--fa:\"\\f237\"}.fa-medium,.fa-medium-m{--fa:\"\\f23a\"}.fa-y-combinator{--fa:\"\\f23b\"}.fa-optin-monster{--fa:\"\\f23c\"}.fa-opencart{--fa:\"\\f23d\"}.fa-expeditedssl{--fa:\"\\f23e\"}.fa-cc-jcb{--fa:\"\\f24b\"}.fa-cc-diners-club{--fa:\"\\f24c\"}.fa-creative-commons{--fa:\"\\f25e\"}.fa-gg{--fa:\"\\f260\"}.fa-gg-circle{--fa:\"\\f261\"}.fa-odnoklassniki{--fa:\"\\f263\"}.fa-odnoklassniki-square,.fa-square-odnoklassniki{--fa:\"\\f264\"}.fa-get-pocket{--fa:\"\\f265\"}.fa-wikipedia-w{--fa:\"\\f266\"}.fa-safari{--fa:\"\\f267\"}.fa-chrome{--fa:\"\\f268\"}.fa-firefox{--fa:\"\\f269\"}.fa-opera{--fa:\"\\f26a\"}.fa-internet-explorer{--fa:\"\\f26b\"}.fa-contao{--fa:\"\\f26d\"}.fa-500px{--fa:\"\\f26e\"}.fa-amazon{--fa:\"\\f270\"}.fa-houzz{--fa:\"\\f27c\"}.fa-vimeo-v{--fa:\"\\f27d\"}.fa-black-tie{--fa:\"\\f27e\"}.fa-fonticons{--fa:\"\\f280\"}.fa-reddit-alien{--fa:\"\\f281\"}.fa-edge{--fa:\"\\f282\"}.fa-codiepie{--fa:\"\\f284\"}.fa-modx{--fa:\"\\f285\"}.fa-fort-awesome{--fa:\"\\f286\"}.fa-usb{--fa:\"\\f287\"}.fa-product-hunt{--fa:\"\\f288\"}.fa-mixcloud{--fa:\"\\f289\"}.fa-scribd{--fa:\"\\f28a\"}.fa-bluetooth{--fa:\"\\f293\"}.fa-bluetooth-b{--fa:\"\\f294\"}.fa-gitlab{--fa:\"\\f296\"}.fa-wpbeginner{--fa:\"\\f297\"}.fa-wpforms{--fa:\"\\f298\"}.fa-envira{--fa:\"\\f299\"}.fa-glide{--fa:\"\\f2a5\"}.fa-glide-g{--fa:\"\\f2a6\"}.fa-viadeo{--fa:\"\\f2a9\"}.fa-square-viadeo,.fa-viadeo-square{--fa:\"\\f2aa\"}.fa-snapchat,.fa-snapchat-ghost{--fa:\"\\f2ab\"}.fa-snapchat-square,.fa-square-snapchat{--fa:\"\\f2ad\"}.fa-pied-piper{--fa:\"\\f2ae\"}.fa-first-order{--fa:\"\\f2b0\"}.fa-yoast{--fa:\"\\f2b1\"}.fa-themeisle{--fa:\"\\f2b2\"}.fa-google-plus{--fa:\"\\f2b3\"}.fa-font-awesome,.fa-font-awesome-flag,.fa-font-awesome-logo-full{--fa:\"\\f2b4\"}.fa-linode{--fa:\"\\f2b8\"}.fa-quora{--fa:\"\\f2c4\"}.fa-free-code-camp{--fa:\"\\f2c5\"}.fa-telegram,.fa-telegram-plane{--fa:\"\\f2c6\"}.fa-bandcamp{--fa:\"\\f2d5\"}.fa-grav{--fa:\"\\f2d6\"}.fa-etsy{--fa:\"\\f2d7\"}.fa-imdb{--fa:\"\\f2d8\"}.fa-ravelry{--fa:\"\\f2d9\"}.fa-sellcast{--fa:\"\\f2da\"}.fa-superpowers{--fa:\"\\f2dd\"}.fa-wpexplorer{--fa:\"\\f2de\"}.fa-meetup{--fa:\"\\f2e0\"}.fa-font-awesome-alt,.fa-square-font-awesome-stroke{--fa:\"\\f35c\"}.fa-accessible-icon{--fa:\"\\f368\"}.fa-accusoft{--fa:\"\\f369\"}.fa-adversal{--fa:\"\\f36a\"}.fa-affiliatetheme{--fa:\"\\f36b\"}.fa-algolia{--fa:\"\\f36c\"}.fa-amilia{--fa:\"\\f36d\"}.fa-angrycreative{--fa:\"\\f36e\"}.fa-app-store{--fa:\"\\f36f\"}.fa-app-store-ios{--fa:\"\\f370\"}.fa-apper{--fa:\"\\f371\"}.fa-asymmetrik{--fa:\"\\f372\"}.fa-audible{--fa:\"\\f373\"}.fa-avianex{--fa:\"\\f374\"}.fa-aws{--fa:\"\\f375\"}.fa-bimobject{--fa:\"\\f378\"}.fa-bitcoin{--fa:\"\\f379\"}.fa-bity{--fa:\"\\f37a\"}.fa-blackberry{--fa:\"\\f37b\"}.fa-blogger{--fa:\"\\f37c\"}.fa-blogger-b{--fa:\"\\f37d\"}.fa-buromobelexperte{--fa:\"\\f37f\"}.fa-centercode{--fa:\"\\f380\"}.fa-cloudscale{--fa:\"\\f383\"}.fa-cloudsmith{--fa:\"\\f384\"}.fa-cloudversify{--fa:\"\\f385\"}.fa-cpanel{--fa:\"\\f388\"}.fa-css3-alt{--fa:\"\\f38b\"}.fa-cuttlefish{--fa:\"\\f38c\"}.fa-d-and-d{--fa:\"\\f38d\"}.fa-deploydog{--fa:\"\\f38e\"}.fa-deskpro{--fa:\"\\f38f\"}.fa-digital-ocean{--fa:\"\\f391\"}.fa-discord{--fa:\"\\f392\"}.fa-discourse{--fa:\"\\f393\"}.fa-dochub{--fa:\"\\f394\"}.fa-docker{--fa:\"\\f395\"}.fa-draft2digital{--fa:\"\\f396\"}.fa-dribbble-square,.fa-square-dribbble{--fa:\"\\f397\"}.fa-dyalog{--fa:\"\\f399\"}.fa-earlybirds{--fa:\"\\f39a\"}.fa-erlang{--fa:\"\\f39d\"}.fa-facebook-f{--fa:\"\\f39e\"}.fa-facebook-messenger{--fa:\"\\f39f\"}.fa-firstdraft{--fa:\"\\f3a1\"}.fa-fonticons-fi{--fa:\"\\f3a2\"}.fa-fort-awesome-alt{--fa:\"\\f3a3\"}.fa-freebsd{--fa:\"\\f3a4\"}.fa-gitkraken{--fa:\"\\f3a6\"}.fa-gofore{--fa:\"\\f3a7\"}.fa-goodreads{--fa:\"\\f3a8\"}.fa-goodreads-g{--fa:\"\\f3a9\"}.fa-google-drive{--fa:\"\\f3aa\"}.fa-google-play{--fa:\"\\f3ab\"}.fa-gripfire{--fa:\"\\f3ac\"}.fa-grunt{--fa:\"\\f3ad\"}.fa-gulp{--fa:\"\\f3ae\"}.fa-hacker-news-square,.fa-square-hacker-news{--fa:\"\\f3af\"}.fa-hire-a-helper{--fa:\"\\f3b0\"}.fa-hotjar{--fa:\"\\f3b1\"}.fa-hubspot{--fa:\"\\f3b2\"}.fa-itunes{--fa:\"\\f3b4\"}.fa-itunes-note{--fa:\"\\f3b5\"}.fa-jenkins{--fa:\"\\f3b6\"}.fa-joget{--fa:\"\\f3b7\"}.fa-js{--fa:\"\\f3b8\"}.fa-js-square,.fa-square-js{--fa:\"\\f3b9\"}.fa-keycdn{--fa:\"\\f3ba\"}.fa-kickstarter,.fa-square-kickstarter{--fa:\"\\f3bb\"}.fa-kickstarter-k{--fa:\"\\f3bc\"}.fa-laravel{--fa:\"\\f3bd\"}.fa-line{--fa:\"\\f3c0\"}.fa-lyft{--fa:\"\\f3c3\"}.fa-magento{--fa:\"\\f3c4\"}.fa-medapps{--fa:\"\\f3c6\"}.fa-medrt{--fa:\"\\f3c8\"}.fa-microsoft{--fa:\"\\f3ca\"}.fa-mix{--fa:\"\\f3cb\"}.fa-mizuni{--fa:\"\\f3cc\"}.fa-monero{--fa:\"\\f3d0\"}.fa-napster{--fa:\"\\f3d2\"}.fa-node-js{--fa:\"\\f3d3\"}.fa-npm{--fa:\"\\f3d4\"}.fa-ns8{--fa:\"\\f3d5\"}.fa-nutritionix{--fa:\"\\f3d6\"}.fa-page4{--fa:\"\\f3d7\"}.fa-palfed{--fa:\"\\f3d8\"}.fa-patreon{--fa:\"\\f3d9\"}.fa-periscope{--fa:\"\\f3da\"}.fa-phabricator{--fa:\"\\f3db\"}.fa-phoenix-framework{--fa:\"\\f3dc\"}.fa-playstation{--fa:\"\\f3df\"}.fa-pushed{--fa:\"\\f3e1\"}.fa-python{--fa:\"\\f3e2\"}.fa-red-river{--fa:\"\\f3e3\"}.fa-rendact,.fa-wpressr{--fa:\"\\f3e4\"}.fa-replyd{--fa:\"\\f3e6\"}.fa-resolving{--fa:\"\\f3e7\"}.fa-rocketchat{--fa:\"\\f3e8\"}.fa-rockrms{--fa:\"\\f3e9\"}.fa-schlix{--fa:\"\\f3ea\"}.fa-searchengin{--fa:\"\\f3eb\"}.fa-servicestack{--fa:\"\\f3ec\"}.fa-sistrix{--fa:\"\\f3ee\"}.fa-speakap{--fa:\"\\f3f3\"}.fa-staylinked{--fa:\"\\f3f5\"}.fa-steam-symbol{--fa:\"\\f3f6\"}.fa-sticker-mule{--fa:\"\\f3f7\"}.fa-studiovinari{--fa:\"\\f3f8\"}.fa-supple{--fa:\"\\f3f9\"}.fa-uber{--fa:\"\\f402\"}.fa-uikit{--fa:\"\\f403\"}.fa-uniregistry{--fa:\"\\f404\"}.fa-untappd{--fa:\"\\f405\"}.fa-ussunnah{--fa:\"\\f407\"}.fa-vaadin{--fa:\"\\f408\"}.fa-viber{--fa:\"\\f409\"}.fa-vimeo{--fa:\"\\f40a\"}.fa-vnv{--fa:\"\\f40b\"}.fa-square-whatsapp,.fa-whatsapp-square{--fa:\"\\f40c\"}.fa-whmcs{--fa:\"\\f40d\"}.fa-wordpress-simple{--fa:\"\\f411\"}.fa-xbox{--fa:\"\\f412\"}.fa-yandex{--fa:\"\\f413\"}.fa-yandex-international{--fa:\"\\f414\"}.fa-apple-pay{--fa:\"\\f415\"}.fa-cc-apple-pay{--fa:\"\\f416\"}.fa-fly{--fa:\"\\f417\"}.fa-node{--fa:\"\\f419\"}.fa-osi{--fa:\"\\f41a\"}.fa-react{--fa:\"\\f41b\"}.fa-autoprefixer{--fa:\"\\f41c\"}.fa-less{--fa:\"\\f41d\"}.fa-sass{--fa:\"\\f41e\"}.fa-vuejs{--fa:\"\\f41f\"}.fa-angular{--fa:\"\\f420\"}.fa-aviato{--fa:\"\\f421\"}.fa-ember{--fa:\"\\f423\"}.fa-gitter{--fa:\"\\f426\"}.fa-hooli{--fa:\"\\f427\"}.fa-strava{--fa:\"\\f428\"}.fa-stripe{--fa:\"\\f429\"}.fa-stripe-s{--fa:\"\\f42a\"}.fa-typo3{--fa:\"\\f42b\"}.fa-amazon-pay{--fa:\"\\f42c\"}.fa-cc-amazon-pay{--fa:\"\\f42d\"}.fa-ethereum{--fa:\"\\f42e\"}.fa-korvue{--fa:\"\\f42f\"}.fa-elementor{--fa:\"\\f430\"}.fa-square-youtube,.fa-youtube-square{--fa:\"\\f431\"}.fa-flipboard{--fa:\"\\f44d\"}.fa-hips{--fa:\"\\f452\"}.fa-php{--fa:\"\\f457\"}.fa-quinscape{--fa:\"\\f459\"}.fa-readme{--fa:\"\\f4d5\"}.fa-java{--fa:\"\\f4e4\"}.fa-pied-piper-hat{--fa:\"\\f4e5\"}.fa-creative-commons-by{--fa:\"\\f4e7\"}.fa-creative-commons-nc{--fa:\"\\f4e8\"}.fa-creative-commons-nc-eu{--fa:\"\\f4e9\"}.fa-creative-commons-nc-jp{--fa:\"\\f4ea\"}.fa-creative-commons-nd{--fa:\"\\f4eb\"}.fa-creative-commons-pd{--fa:\"\\f4ec\"}.fa-creative-commons-pd-alt{--fa:\"\\f4ed\"}.fa-creative-commons-remix{--fa:\"\\f4ee\"}.fa-creative-commons-sa{--fa:\"\\f4ef\"}.fa-creative-commons-sampling{--fa:\"\\f4f0\"}.fa-creative-commons-sampling-plus{--fa:\"\\f4f1\"}.fa-creative-commons-share{--fa:\"\\f4f2\"}.fa-creative-commons-zero{--fa:\"\\f4f3\"}.fa-ebay{--fa:\"\\f4f4\"}.fa-keybase{--fa:\"\\f4f5\"}.fa-mastodon{--fa:\"\\f4f6\"}.fa-r-project{--fa:\"\\f4f7\"}.fa-researchgate{--fa:\"\\f4f8\"}.fa-teamspeak{--fa:\"\\f4f9\"}.fa-first-order-alt{--fa:\"\\f50a\"}.fa-fulcrum{--fa:\"\\f50b\"}.fa-galactic-republic{--fa:\"\\f50c\"}.fa-galactic-senate{--fa:\"\\f50d\"}.fa-jedi-order{--fa:\"\\f50e\"}.fa-mandalorian{--fa:\"\\f50f\"}.fa-old-republic{--fa:\"\\f510\"}.fa-phoenix-squadron{--fa:\"\\f511\"}.fa-sith{--fa:\"\\f512\"}.fa-trade-federation{--fa:\"\\f513\"}.fa-wolf-pack-battalion{--fa:\"\\f514\"}.fa-hornbill{--fa:\"\\f592\"}.fa-mailchimp{--fa:\"\\f59e\"}.fa-megaport{--fa:\"\\f5a3\"}.fa-nimblr{--fa:\"\\f5a8\"}.fa-rev{--fa:\"\\f5b2\"}.fa-shopware{--fa:\"\\f5b5\"}.fa-squarespace{--fa:\"\\f5be\"}.fa-themeco{--fa:\"\\f5c6\"}.fa-weebly{--fa:\"\\f5cc\"}.fa-wix{--fa:\"\\f5cf\"}.fa-ello{--fa:\"\\f5f1\"}.fa-hackerrank{--fa:\"\\f5f7\"}.fa-kaggle{--fa:\"\\f5fa\"}.fa-markdown{--fa:\"\\f60f\"}.fa-neos{--fa:\"\\f612\"}.fa-zhihu{--fa:\"\\f63f\"}.fa-alipay{--fa:\"\\f642\"}.fa-the-red-yeti{--fa:\"\\f69d\"}.fa-critical-role{--fa:\"\\f6c9\"}.fa-d-and-d-beyond{--fa:\"\\f6ca\"}.fa-dev{--fa:\"\\f6cc\"}.fa-fantasy-flight-games{--fa:\"\\f6dc\"}.fa-wizards-of-the-coast{--fa:\"\\f730\"}.fa-think-peaks{--fa:\"\\f731\"}.fa-reacteurope{--fa:\"\\f75d\"}.fa-artstation{--fa:\"\\f77a\"}.fa-atlassian{--fa:\"\\f77b\"}.fa-canadian-maple-leaf{--fa:\"\\f785\"}.fa-centos{--fa:\"\\f789\"}.fa-confluence{--fa:\"\\f78d\"}.fa-dhl{--fa:\"\\f790\"}.fa-diaspora{--fa:\"\\f791\"}.fa-fedex{--fa:\"\\f797\"}.fa-fedora{--fa:\"\\f798\"}.fa-figma{--fa:\"\\f799\"}.fa-intercom{--fa:\"\\f7af\"}.fa-invision{--fa:\"\\f7b0\"}.fa-jira{--fa:\"\\f7b1\"}.fa-mendeley{--fa:\"\\f7b3\"}.fa-raspberry-pi{--fa:\"\\f7bb\"}.fa-redhat{--fa:\"\\f7bc\"}.fa-sketch{--fa:\"\\f7c6\"}.fa-sourcetree{--fa:\"\\f7d3\"}.fa-suse{--fa:\"\\f7d6\"}.fa-ubuntu{--fa:\"\\f7df\"}.fa-ups{--fa:\"\\f7e0\"}.fa-usps{--fa:\"\\f7e1\"}.fa-yarn{--fa:\"\\f7e3\"}.fa-airbnb{--fa:\"\\f834\"}.fa-battle-net{--fa:\"\\f835\"}.fa-bootstrap{--fa:\"\\f836\"}.fa-buffer{--fa:\"\\f837\"}.fa-chromecast{--fa:\"\\f838\"}.fa-evernote{--fa:\"\\f839\"}.fa-itch-io{--fa:\"\\f83a\"}.fa-salesforce{--fa:\"\\f83b\"}.fa-speaker-deck{--fa:\"\\f83c\"}.fa-symfony{--fa:\"\\f83d\"}.fa-waze{--fa:\"\\f83f\"}.fa-yammer{--fa:\"\\f840\"}.fa-git-alt{--fa:\"\\f841\"}.fa-stackpath{--fa:\"\\f842\"}.fa-cotton-bureau{--fa:\"\\f89e\"}.fa-buy-n-large{--fa:\"\\f8a6\"}.fa-mdb{--fa:\"\\f8ca\"}.fa-orcid{--fa:\"\\f8d2\"}.fa-swift{--fa:\"\\f8e1\"}.fa-umbraco{--fa:\"\\f8e8\"}:host,:root{--fa-font-regular:normal 400 1em/1 var(--fa-family-classic)}@font-face{font-family:\"Font Awesome 7 Free\";font-style:normal;font-weight:400;font-display:block;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ")}.far{--fa-family:var(--fa-family-classic)}.fa-regular,.far{--fa-style:400}:host,:root{--fa-family-classic:\"Font Awesome 7 Free\";--fa-font-solid:normal 900 1em/1 var(--fa-family-classic);--fa-style-family-classic:var(--fa-family-classic)}@font-face{font-family:\"Font Awesome 7 Free\";font-style:normal;font-weight:900;font-display:block;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ")}.fas{--fa-style:900}.fa-classic,.fas{--fa-family:var(--fa-family-classic)}.fa-solid{--fa-style:900}@font-face{font-family:\"Font Awesome 5 Brands\";font-display:block;font-weight:400;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"woff2\")}@font-face{font-family:\"Font Awesome 5 Free\";font-display:block;font-weight:900;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format(\"woff2\")}@font-face{font-family:\"Font Awesome 5 Free\";font-display:block;font-weight:400;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format(\"woff2\")}@font-face{font-family:\"FontAwesome\";font-display:block;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format(\"woff2\")}@font-face{font-family:\"FontAwesome\";font-display:block;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"woff2\")}@font-face{font-family:\"FontAwesome\";font-display:block;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format(\"woff2\");unicode-range:u+f003,u+f006,u+f014,u+f016-f017,u+f01a-f01b,u+f01d,u+f022,u+f03e,u+f044,u+f046,u+f05c-f05d,u+f06e,u+f070,u+f087-f088,u+f08a,u+f094,u+f096-f097,u+f09d,u+f0a0,u+f0a2,u+f0a4-f0a7,u+f0c5,u+f0c7,u+f0e5-f0e6,u+f0eb,u+f0f6-f0f8,u+f10c,u+f114-f115,u+f118-f11a,u+f11c-f11d,u+f133,u+f147,u+f14e,u+f150-f152,u+f185-f186,u+f18e,u+f190-f192,u+f196,u+f1c1-f1c9,u+f1d9,u+f1db,u+f1e3,u+f1ea,u+f1f7,u+f1f9,u+f20a,u+f247-f248,u+f24a,u+f24d,u+f255-f25b,u+f25d,u+f271-f274,u+f278,u+f27b,u+f28c,u+f28e,u+f29c,u+f2b5,u+f2b7,u+f2ba,u+f2bc,u+f2be,u+f2c0-f2c1,u+f2c3,u+f2d0,u+f2d2,u+f2d4,u+f2dc}@font-face{font-family:\"FontAwesome\";font-display:block;src:url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") format(\"woff2\");unicode-range:u+f041,u+f047,u+f065-f066,u+f07d-f07e,u+f080,u+f08b,u+f08e,u+f090,u+f09a,u+f0ac,u+f0ae,u+f0b2,u+f0d0,u+f0d6,u+f0e4,u+f0ec,u+f10a-f10b,u+f123,u+f13e,u+f148-f149,u+f14c,u+f156,u+f15e,u+f160-f161,u+f163,u+f175-f178,u+f195,u+f1f8,u+f219,u+f27a}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./resources/images/hyperx-alloy.jpg":
/*!*******************************************!*\
  !*** ./resources/images/hyperx-alloy.jpg ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/images/hyperx-alloy.jpg?f2397bfc6ebe786f4a3365d5533485d1");

/***/ }),

/***/ "./resources/images/logitech-gpro.jpg":
/*!********************************************!*\
  !*** ./resources/images/logitech-gpro.jpg ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/images/logitech-gpro.jpg?44d20bfca957e93ff6c3cc9f64ac1fa7");

/***/ }),

/***/ "./resources/images/razer-goliathus.jpg":
/*!**********************************************!*\
  !*** ./resources/images/razer-goliathus.jpg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/images/razer-goliathus.jpg?e58300f37c10135a50ed72d238f079ff");

/***/ }),

/***/ "./resources/images/razer-viper.jpg":
/*!******************************************!*\
  !*** ./resources/images/razer-viper.jpg ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/images/razer-viper.jpg?45c6028470c99fa543a8ebd69e1435fc");

/***/ }),

/***/ "./resources/images/steelseries-apex.jpg":
/*!***********************************************!*\
  !*** ./resources/images/steelseries-apex.jpg ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/images/steelseries-apex.jpg?7360de94170e09e1ca665f75b5f0423f");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2":
/*!*********************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2 ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-brands-400.woff2?41062caea457897b1d3bb774c9554c7b");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2":
/*!**********************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2 ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-regular-400.woff2?fa2e58edfd73d8341e0738818fc63871");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2":
/*!********************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2 ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-solid-900.woff2?dcef2f69dbd5989a2e69679f671138e7");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.woff2":
/*!**************************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.woff2 ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-v4compatibility.woff2?2129bf071a83c1d49732c731eb27be7e");

/***/ }),

/***/ "./resources/scss/main.scss":
/*!**********************************!*\
  !*** ./resources/scss/main.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/css/all.min.css":
/*!********************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/css/all.min.css ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_laravel_mix_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_all_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!../../../laravel-mix/node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./all.min.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/laravel-mix/node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/@fortawesome/fontawesome-free/css/all.min.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_laravel_mix_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_all_min_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_laravel_mix_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_all_min_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/main": 0,
/******/ 			"css/main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/main"], () => (__webpack_require__("./resources/js/main.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/main"], () => (__webpack_require__("./resources/scss/main.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;