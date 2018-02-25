(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var invariant = require('invariant');

var hasOwnProperty = Object.prototype.hasOwnProperty;
var splice = Array.prototype.splice;

var toString = Object.prototype.toString
var type = function(obj) {
  return toString.call(obj).slice(8, -1);
}

var assign = Object.assign || /* istanbul ignore next */ function assign(target, source) {
  getAllKeys(source).forEach(function(key) {
    if (hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  });
  return target;
};

var getAllKeys = typeof Object.getOwnPropertySymbols === 'function' ?
  function(obj) { return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj)) } :
  /* istanbul ignore next */ function(obj) { return Object.keys(obj) };

/* istanbul ignore next */
function copy(object) {
  if (Array.isArray(object)) {
    return assign(object.constructor(object.length), object)
  } else if (type(object) === 'Map') {
    return new Map(object)
  } else if (type(object) === 'Set') {
    return new Set(object)
  } else if (object && typeof object === 'object') {
    var prototype = object.constructor && object.constructor.prototype
    return assign(Object.create(prototype || null), object);
  } else {
    return object;
  }
}

function newContext() {
  var commands = assign({}, defaultCommands);
  update.extend = function(directive, fn) {
    commands[directive] = fn;
  };
  update.isEquals = function(a, b) { return a === b; };

  return update;

  function update(object, spec) {
    if (typeof spec === 'function') {
      return spec(object);
    }

    if (!(Array.isArray(object) && Array.isArray(spec))) {
      invariant(
        !Array.isArray(spec),
        'update(): You provided an invalid spec to update(). The spec may ' +
        'not contain an array except as the value of $set, $push, $unshift, ' +
        '$splice or any custom command allowing an array value.'
      );
    }

    invariant(
      typeof spec === 'object' && spec !== null,
      'update(): You provided an invalid spec to update(). The spec and ' +
      'every included key path must be plain objects containing one of the ' +
      'following commands: %s.',
      Object.keys(commands).join(', ')
    );

    var nextObject = object;
    var index, key;
    getAllKeys(spec).forEach(function(key) {
      if (hasOwnProperty.call(commands, key)) {
        var objectWasNextObject = object === nextObject;
        nextObject = commands[key](spec[key], nextObject, spec, object);
        if (objectWasNextObject && update.isEquals(nextObject, object)) {
          nextObject = object;
        }
      } else {
        var nextValueForKey = update(object[key], spec[key]);
        if (!update.isEquals(nextValueForKey, nextObject[key]) || typeof nextValueForKey === 'undefined' && !hasOwnProperty.call(object, key)) {
          if (nextObject === object) {
            nextObject = copy(object);
          }
          nextObject[key] = nextValueForKey;
        }
      }
    })
    return nextObject;
  }

}

var defaultCommands = {
  $push: function(value, nextObject, spec) {
    invariantPushAndUnshift(nextObject, spec, '$push');
    return value.length ? nextObject.concat(value) : nextObject;
  },
  $unshift: function(value, nextObject, spec) {
    invariantPushAndUnshift(nextObject, spec, '$unshift');
    return value.length ? value.concat(nextObject) : nextObject;
  },
  $splice: function(value, nextObject, spec, originalObject) {
    invariantSplices(nextObject, spec);
    value.forEach(function(args) {
      invariantSplice(args);
      if (nextObject === originalObject && args.length) nextObject = copy(originalObject);
      splice.apply(nextObject, args);
    });
    return nextObject;
  },
  $set: function(value, nextObject, spec) {
    invariantSet(spec);
    return value;
  },
  $toggle: function(targets, nextObject) {
    invariantSpecArray(targets, '$toggle');
    var nextObjectCopy = targets.length ? copy(nextObject) : nextObject;

    targets.forEach(function(target) {
      nextObjectCopy[target] = !nextObject[target];
    });

    return nextObjectCopy;
  },
  $unset: function(value, nextObject, spec, originalObject) {
    invariantSpecArray(value, '$unset');
    value.forEach(function(key) {
      if (Object.hasOwnProperty.call(nextObject, key)) {
        if (nextObject === originalObject) nextObject = copy(originalObject);
        delete nextObject[key];
      }
    });
    return nextObject;
  },
  $add: function(value, nextObject, spec, originalObject) {
    invariantMapOrSet(nextObject, '$add');
    invariantSpecArray(value, '$add');
    if (type(nextObject) === 'Map') {
      value.forEach(function(pair) {
        var key = pair[0];
        var value = pair[1];
        if (nextObject === originalObject && nextObject.get(key) !== value) nextObject = copy(originalObject);
        nextObject.set(key, value);
      });
    } else {
      value.forEach(function(value) {
        if (nextObject === originalObject && !nextObject.has(value)) nextObject = copy(originalObject);
        nextObject.add(value);
      });
    }
    return nextObject;
  },
  $remove: function(value, nextObject, spec, originalObject) {
    invariantMapOrSet(nextObject, '$remove');
    invariantSpecArray(value, '$remove');
    value.forEach(function(key) {
      if (nextObject === originalObject && nextObject.has(key)) nextObject = copy(originalObject);
      nextObject.delete(key);
    });
    return nextObject;
  },
  $merge: function(value, nextObject, spec, originalObject) {
    invariantMerge(nextObject, value);
    getAllKeys(value).forEach(function(key) {
      if (value[key] !== nextObject[key]) {
        if (nextObject === originalObject) nextObject = copy(originalObject);
        nextObject[key] = value[key];
      }
    });
    return nextObject;
  },
  $apply: function(value, original) {
    invariantApply(value);
    return value(original);
  }
};

module.exports = newContext();
module.exports.newContext = newContext;

// invariants

function invariantPushAndUnshift(value, spec, command) {
  invariant(
    Array.isArray(value),
    'update(): expected target of %s to be an array; got %s.',
    command,
    value
  );
  invariantSpecArray(spec[command], command)
}

function invariantSpecArray(spec, command) {
  invariant(
    Array.isArray(spec),
    'update(): expected spec of %s to be an array; got %s. ' +
    'Did you forget to wrap your parameter in an array?',
    command,
    spec
  );
}

function invariantSplices(value, spec) {
  invariant(
    Array.isArray(value),
    'Expected $splice target to be an array; got %s',
    value
  );
  invariantSplice(spec['$splice']);
}

function invariantSplice(value) {
  invariant(
    Array.isArray(value),
    'update(): expected spec of $splice to be an array of arrays; got %s. ' +
    'Did you forget to wrap your parameters in an array?',
    value
  );
}

function invariantApply(fn) {
  invariant(
    typeof fn === 'function',
    'update(): expected spec of $apply to be a function; got %s.',
    fn
  );
}

function invariantSet(spec) {
  invariant(
    Object.keys(spec).length === 1,
    'Cannot have more than one key in an object with $set'
  );
}

function invariantMerge(target, specValue) {
  invariant(
    specValue && typeof specValue === 'object',
    'update(): $merge expects a spec of type \'object\'; got %s',
    specValue
  );
  invariant(
    target && typeof target === 'object',
    'update(): $merge expects a target of type \'object\'; got %s',
    target
  );
}

function invariantMapOrSet(target, command) {
  var typeOfTarget = type(target);
  invariant(
    typeOfTarget === 'Map' || typeOfTarget === 'Set',
    'update(): %s expects a target of type Set or Map; got %s',
    command,
    typeOfTarget
  );
}

},{"invariant":2}],2:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');

const CategoryTitle = props => {
  const {
    category
  } = props;

  return createElement({
    elementType: 'h3',
    innerText: category.name
  });
};

module.exports = CategoryTitle;

},{"libraries/element-creater":27}],5:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');

const MultipleChoiceOption = props => {
  const {
    selectedOption,
    correctAnswer,
    optionNo,
    option,
    multipleChoiceComponent,
    updateSelectedOption
  } = props;

  const optionRadioElementProps = {
    elementType: 'input',
    attributes: {
      'type': 'radio'
    },
    onClick: () => updateSelectedOption(multipleChoiceComponent, optionNo)
  };

  const optionTextProps = {
    elementType: 'span',
    innerText: option,
    style: {}
  };

  if (optionNo === selectedOption) {
    optionRadioElementProps.attributes.checked = true;
    optionTextProps.innerText = option + (correctAnswer === optionNo ? ' - Correct!' : ' - Incorrect!');
    optionTextProps.style.color = correctAnswer === optionNo ? 'green' : 'red';
  };

  const optionRadioElement = createElement(optionRadioElementProps);
  const optionTextElement = createElement(optionTextProps);

  return createElement({
    elementType: 'div',
    childrenElements: [optionRadioElement, optionTextElement]
  });
};

module.exports = MultipleChoiceOption;

},{"libraries/element-creater":27}],6:[function(require,module,exports){
const { component, createElement } = require('libraries/element-creater');
const update = require('immutability-helper');
const MultipleChoiceOption = require('./MultipleChoiceOption');

class MultipleChoiceQuestion extends component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null
    };
  }

  updateSelectedOption(thisComponent, selectedOption) {
    thisComponent.updateState(update(thisComponent.state, { selectedOption: { $set: selectedOption } }), thisComponent.renderedElement);
  }

  setRenderElement() {
    const {
      updateSelectedOption
    } = this;

    const {
      selectedOption
    } = this.state;

    const {
      material
    } = this.props;

    const multipleChoiceQuestionElementProps = {
      elementType: 'ol',
      childrenElements: material.options.map((option, index) => {
        return createElement({
          elementType: 'li',
          childrenElements: [MultipleChoiceOption({
            selectedOption,
            correctAnswer: material.correct_answer,
            optionNo: index,
            option,
            multipleChoiceComponent: this,
            updateSelectedOption
          })]
        });
      })
    };

    this.renderedElement = createElement(multipleChoiceQuestionElementProps);
  }
};

module.exports = MultipleChoiceQuestion;

},{"./MultipleChoiceOption":5,"immutability-helper":1,"libraries/element-creater":27}],7:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');

const Text = props => {
  const {
    material
  } = props;

  return createElement({
    elementType: 'em',
    innerText: material.description
  });
};

module.exports = Text;

},{"libraries/element-creater":27}],8:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');

const Youtube = props => {
  const {
    material
  } = props;

  return createElement({
    elementType: 'iframe',
    attributes: {
      'width': '280',
      'height': '160',
      'src': material.video_url,
      'frameborder': '0'
    }
  });
};

module.exports = Youtube;

},{"libraries/element-creater":27}],9:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');
const MultipleChoiceQuestion = require('./MultipleChoiceQuestion');
const Text = require('./Text');
const Youtube = require('./Youtube');

const MaterialList = props => {
  const {
    materials
  } = props;

  return createElement({
    elementType: 'ol',
    childrenElements: materials.map(material => {
      let materialDisplay;

      switch (material.materialType) {
        case 'MaterialMultipleChoiceQuestion':
          materialDisplay = new MultipleChoiceQuestion({ material }).render();
          break;
        case 'MaterialText':
          materialDisplay = Text({ material });
          break;
        case 'MaterialYoutube':
          materialDisplay = Youtube({ material });
          break;
      };

      return createElement({
        elementType: 'li',
        style: {
          'color': 'black',
          'cursor': 'auto'
        },
        innerText: material.title,
        childrenElements: [createElement({
          elementType: 'div',
          childrenElements: [materialDisplay]
        }), createElement({ elementType: 'br' })]
      });
    })
  });
};

module.exports = MaterialList;

},{"./MultipleChoiceQuestion":6,"./Text":7,"./Youtube":8,"libraries/element-creater":27}],10:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');
const MaterialList = require('./MaterialList');

const Lesson = props => {
  const {
    lesson,
    selectedLesson,
    appComponent,
    updateOpenedLesson
  } = props;

  const lessonElementProps = {
    elementType: 'li',
    style: {
      'color': 'blue',
      'cursor': 'pointer'
    },
    innerText: lesson.name
  };

  if (lesson.id === selectedLesson.id) {
    lessonElementProps.childrenElements = [MaterialList({ materials: lesson.materials })];
  } else {
    lessonElementProps.onClick = () => updateOpenedLesson(appComponent, lesson);
  };

  return createElement(lessonElementProps);
};

module.exports = Lesson;

},{"./MaterialList":9,"libraries/element-creater":27}],11:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');
const Lesson = require('./Lesson');

const LessonList = props => {
  const {
    lessons,
    appComponent,
    updateOpenedLesson,
    selectedLesson
  } = props;

  return createElement({
    elementType: 'ul',
    childrenElements: lessons.map(lesson => {
      return Lesson({ lesson, selectedLesson, appComponent, updateOpenedLesson });
    })
  });
};

module.exports = LessonList;

},{"./Lesson":10,"libraries/element-creater":27}],12:[function(require,module,exports){
const { component, createElement } = require('libraries/element-creater');
const CategoryTitle = require('./CategoryTitle');
const LessonList = require('./LessonList');

class Category extends component {
  constructor(props) {
    super(props);
  }

  setRenderElement() {
    const {
      appComponent,
      updateOpenedLesson,
      selectedLesson,
      category
    } = this.props;

    // render children categories recursively
    const subCategoryElements = category.categories.map(childCategory => {
      return new Category({
        appComponent,
        updateOpenedLesson,
        selectedLesson,
        category: childCategory
      }).render();
    });

    const categoryElementProps = {
      elementType: 'div',
      style: {
        'padding-left': '15px'
      },
      childrenElements: [CategoryTitle({ category })].concat(subCategoryElements)
    };

    const categoryElement = createElement(categoryElementProps);

    const categoryAndLessonElementProps = {
      elementType: 'div',
      childrenElements: [categoryElement, LessonList({
        lessons: category.lessons,
        appComponent,
        updateOpenedLesson,
        selectedLesson
      })]
    };

    this.renderedElement = createElement(categoryAndLessonElementProps);
  }
}

module.exports = Category;

},{"./CategoryTitle":4,"./LessonList":11,"libraries/element-creater":27}],13:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');

const CloseLessonButton = props => {
  const {
    lesson,
    appComponent,
    updateOpenedLesson
  } = props;

  closeLessonButtonElementProps = {
    elementType: 'button',
    innerText: 'Close Lesson',
    attributes: {},
    onClick: () => updateOpenedLesson(appComponent, {})

    // close lesson button only clickable when class is selected
  };if (!lesson.id) closeLessonButtonElementProps.attributes.disabled = true;

  return createElement(closeLessonButtonElementProps);
};

module.exports = CloseLessonButton;

},{"libraries/element-creater":27}],14:[function(require,module,exports){
const { createElement } = require('libraries/element-creater');
const CloseLessonButton = require('./CloseLessonButton');

const SelectedLesson = props => {
  const {
    lesson,
    appComponent,
    updateOpenedLesson
  } = props;

  return createElement({
    elementType: 'h2',
    innerText: 'Current Lesson: ' + (lesson.name || 'No Lesson Selected'),
    childrenElements: [createElement({ elementType: 'br' }), CloseLessonButton({ lesson, appComponent, updateOpenedLesson })]
  });
};

module.exports = SelectedLesson;

},{"./CloseLessonButton":13,"libraries/element-creater":27}],15:[function(require,module,exports){
const { component, createElement } = require('libraries/element-creater');
const update = require('immutability-helper');
const MockDatabase = require('../MockDatabase');
const SelectedLesson = require('./SelectedLesson');
const Category = require('./Category');

class App extends component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLesson: {}
    };

    this.updateOpenedLesson = this.updateOpenedLesson.bind(this);
  }

  updateOpenedLesson(thisComponent, lesson) {
    thisComponent.updateState(update(thisComponent.state, { selectedLesson: { $set: lesson } }), thisComponent.renderedElement);
  }

  setRenderElement() {
    const {
      updateOpenedLesson
    } = this;

    const {
      selectedLesson
    } = this.state;

    const categoryElementProps = {
      elementType: 'div',
      childrenElements: [SelectedLesson({
        lesson: selectedLesson,
        appComponent: this,
        updateOpenedLesson
      }), new Category({
        appComponent: this,
        updateOpenedLesson,
        selectedLesson,
        category: MockDatabase.categoryWithAllChildren(1)
      }).render()]
    };

    this.renderedElement = createElement(categoryElementProps);
  }
}

module.exports = App;

},{"../MockDatabase":16,"./Category":12,"./SelectedLesson":14,"immutability-helper":1,"libraries/element-creater":27}],16:[function(require,module,exports){
const update = require('immutability-helper');
const MaterialYoutube = require('./models/MaterialYoutube');
const MaterialText = require('./models/MaterialText');
const MaterialMultipleChoiceQuestion = require('./models/MaterialMultipleChoiceQuestion');
const LessonMaterial = require('./models/LessonMaterial');
const Lesson = require('./models/Lesson');
const CategoryLesson = require('./models/CategoryLesson');
const Category = require('./models/Category');
const CategoryRelationship = require('./models/CategoryRelationship');

const MockDatabase = {
  categoryWithAllChildren: function (categoryId) {
    const categoryWithAllChildren = this.findCategory(categoryId);

    categoryWithAllChildren.categories = this.findCategoryChildren(categoryId);
    // get child categories of child categories
    categoryWithAllChildren.categories.map((childCategory, index) => categoryWithAllChildren.categories[index] = this.categoryWithAllChildren(childCategory.id));

    categoryWithAllChildren.lessons = this.findCategoryLessons(categoryId);
    // get materials of lessons
    categoryWithAllChildren.lessons.map((categoryLesson, index) => categoryWithAllChildren.lessons[index].materials = this.findLessonMaterials(categoryLesson.id));

    return categoryWithAllChildren;
  },
  findMaterial: function (materialProps) {
    const { material_type, material_id } = materialProps;

    const MaterialModel = {
      MaterialYoutube: MaterialYoutube,
      MaterialText: MaterialText,
      MaterialMultipleChoiceQuestion: MaterialMultipleChoiceQuestion
    }[material_type];

    // add material type to object
    return update(MaterialModel.find(material => material.id === material_id), { materialType: { $set: material_type } });
  },
  findMaterialsByMaterialPropsArray: function (materialPropsArray) {
    const materialsArray = [];
    // don't use Array.filter to retain order
    materialPropsArray.forEach(materialProps => materialsArray.push(this.findMaterial(materialProps)));

    return materialsArray;
  },
  findLessonMaterials: function (lessonId) {
    const lessonMaterialObjects = LessonMaterial.filter(lessonMaterial => lessonMaterial.lesson_id === lessonId);
    // sort by index property
    const sortedlessonMaterialObjects = lessonMaterialObjects.sort((a, b) => a.index - b.index);
    const lessonMaterialProps = sortedlessonMaterialObjects.map(lessonMaterialObject => {
      return { material_type: lessonMaterialObject.material_type, material_id: lessonMaterialObject.material_id };
    });

    return this.findMaterialsByMaterialPropsArray(lessonMaterialProps);
  },
  findLesson: function (id) {
    return Lesson.find(lesson => lesson.id === id);
  },
  findLessonsByIdArray: function (idArray) {
    const lessonsArray = [];
    // don't use Array.filter to retain order
    idArray.forEach(id => lessonsArray.push(this.findLesson(id)));

    return lessonsArray;
  },
  findCategory: function (id) {
    return Category.find(category => category.id === id);
  },
  findCategoriesByIdArray: function (idArray) {
    const categoriesArray = [];
    // don't use Array.filter to retain order
    idArray.forEach(id => categoriesArray.push(this.findCategory(id)));

    return categoriesArray;
  },
  findCategoryChildren: function (categoryId) {
    const categoryRelationshipObjects = CategoryRelationship.filter(categoryRelationship => categoryRelationship.parent_category_id === categoryId);
    // sort by index property
    const sortedCategoryRelationshipObjects = categoryRelationshipObjects.sort((a, b) => a.index - b.index);
    const childCategoryIds = sortedCategoryRelationshipObjects.map(categoryRelationshipObject => categoryRelationshipObject.child_category_id);

    return this.findCategoriesByIdArray(childCategoryIds);
  },
  findCategoryLessons: function (categoryId) {
    const categoryLessonObjects = CategoryLesson.filter(lessonCategory => lessonCategory.category_id === categoryId);
    // sort by index property
    const sortedCategoryLessonObjects = categoryLessonObjects.sort((a, b) => a.index - b.index);
    const categoryLessonIds = sortedCategoryLessonObjects.map(categoryLessonObject => categoryLessonObject.lesson_id);

    return this.findLessonsByIdArray(categoryLessonIds);
  }
};

module.exports = MockDatabase;

},{"./models/Category":17,"./models/CategoryLesson":18,"./models/CategoryRelationship":19,"./models/Lesson":20,"./models/LessonMaterial":21,"./models/MaterialMultipleChoiceQuestion":22,"./models/MaterialText":23,"./models/MaterialYoutube":24,"immutability-helper":1}],17:[function(require,module,exports){
const Category = [{
  id: 1,
  name: "Top",
  description: "",
  active: true
}, {
  id: 2,
  name: "Programming",
  description: "Learn how to program.",
  active: true
}, {
  id: 3,
  name: "Programming Language Types",
  description: "List of programming language types.",
  active: true
}, {
  id: 4,
  name: "Objected-Oriented Language",
  description: "Category of object-oriented programming languages.",
  active: true
}, {
  id: 5,
  name: "Python",
  description: "Learn how to program in Python.",
  active: true
}, {
  id: 6,
  name: "Procedural Language",
  description: "Category of procedural programming languages.",
  active: true
}, {
  id: 7,
  name: "C",
  description: "Learn how to program in C.",
  active: true
}];

module.exports = Category;

},{}],18:[function(require,module,exports){
const CategoryLesson = [{
  id: 1,
  category_id: 5,
  lesson_id: 1,
  index: 1,
  active: true
}, {
  id: 2,
  category_id: 5,
  lesson_id: 2,
  index: 2,
  active: true
}, {
  id: 3,
  category_id: 7,
  lesson_id: 3,
  index: 1,
  active: true
}];

module.exports = CategoryLesson;

},{}],19:[function(require,module,exports){
const CategoryRelationship = [{
  id: 1,
  parent_category_id: 1,
  child_category_id: 2,
  index: 1,
  active: true
}, {
  id: 2,
  parent_category_id: 2,
  child_category_id: 3,
  index: 1,
  active: true
}, {
  id: 3,
  parent_category_id: 3,
  child_category_id: 4,
  index: 1,
  active: true
}, {
  id: 4,
  parent_category_id: 4,
  child_category_id: 5,
  index: 1,
  active: true
}, {
  id: 5,
  parent_category_id: 3,
  child_category_id: 6,
  index: 2,
  active: true
}, {
  id: 6,
  parent_category_id: 6,
  child_category_id: 7,
  index: 1,
  active: true
}];

module.exports = CategoryRelationship;

},{}],20:[function(require,module,exports){
const Lesson = [{
  id: 1,
  name: "Python Beginners",
  description: "Learn how to program in Python from zero with no programming experience.",
  active: true
}, {
  id: 2,
  name: "Python Intermediate",
  description: "Learn how to program in Python at an intermediate level.",
  active: true
}, {
  id: 3,
  name: "C Beginners",
  description: "Learn how to program in C from zero with no programming experience.",
  active: true
}];

module.exports = Lesson;

},{}],21:[function(require,module,exports){
const LessonMaterial = [{
  id: 1,
  lesson_id: 1,
  material_type: "MaterialText",
  material_id: 1,
  index: 1
}, {
  id: 2,
  lesson_id: 1,
  material_type: "MaterialYoutube",
  material_id: 1,
  index: 2
}, {
  id: 3,
  lesson_id: 1,
  material_type: "MaterialYoutube",
  material_id: 2,
  index: 3
}, {
  id: 4,
  lesson_id: 1,
  material_type: "MaterialYoutube",
  material_id: 3,
  index: 4
}, {
  id: 5,
  lesson_id: 1,
  material_type: "MaterialMultipleChoiceQuestion",
  material_id: 1,
  index: 5
}, {
  id: 6,
  lesson_id: 2,
  material_type: "MaterialYoutube",
  material_id: 4,
  index: 1
}, {
  id: 7,
  lesson_id: 2,
  material_type: "MaterialYoutube",
  material_id: 5,
  index: 2
}, {
  id: 8,
  lesson_id: 3,
  material_type: "MaterialText",
  material_id: 2,
  index: 1
}, {
  id: 8,
  lesson_id: 3,
  material_type: "MaterialYoutube",
  material_id: 6,
  index: 2
}, {
  id: 9,
  lesson_id: 3,
  material_type: "MaterialMultipleChoiceQuestion",
  material_id: 2,
  index: 3
}];

module.exports = LessonMaterial;

},{}],22:[function(require,module,exports){
const MaterialMultipleChoiceQuestion = [{
  id: 1,
  title: "Python Quiz - Easy",
  question: "What is the output of the following: print(\"Hello {name1} and {name2}\".format(name1='foo', name2='bin'))",
  options: ["Hello foo and bin", "Hello {name1} and {name2}", "Error", "Hello and"],
  correct_answer: 0,
  active: true
}, {
  id: 2,
  title: "C History Quiz",
  question: "C Programming was created at ______ by Dennis Ritchie.",
  options: ["Stanford Lab", "Haward University", "AT&T Bell Laboratory", "L&T Laboratory", "MIT University"],
  correct_answer: 2,
  active: true
}];

module.exports = MaterialMultipleChoiceQuestion;

},{}],23:[function(require,module,exports){
const MaterialText = [{
  id: 1,
  title: "Python Summary",
  description: "Python is an interpreted, object-oriented, high-level programming language with dynamic semantics. Its high-level built in data structures, combined with dynamic typing and dynamic binding, make it very attractive for Rapid Application Development, as well as for use as a scripting or glue language to connect existing components together. Python's simple, easy to learn syntax emphasizes readability and therefore reduces the cost of program maintenance.",
  active: true
}, {
  id: 2,
  title: "C Summary",
  description: "C has been used successfully for every type of programming problem imaginable from operating systems to spreadsheets to expert systems - and efficient compilers are available for machines ranging in power from the Apple Macintosh to the Cray supercomputers.",
  active: true
}];

module.exports = MaterialText;

},{}],24:[function(require,module,exports){
const MaterialYoutube = [{
  id: 1,
  title: "Python Lesson 1 - Install and Setup",
  description: "Learn how to install Python and setting up the Python development environment.",
  video_url: "https://www.youtube.com/embed/cpPG0bKHYKc",
  active: true
}, {
  id: 2,
  title: "Python Lesson 2 - Functions and Variables",
  description: "Learn how to create basic functions and how to define variables.",
  video_url: "https://www.youtube.com/embed/IEel7loz-ag",
  active: true
}, {
  id: 3,
  title: "Python Lesson 3 - Function Return Values and Debugging",
  description: "Learn how to declare functions with multiple arguments, functions that return values, and the basics of debugging using the PyCharm IDE.",
  video_url: "https://www.youtube.com/embed/uPwztoPBVWI",
  active: true
}, {
  id: 4,
  title: "Intermedia Python Programming - Part 1",
  description: "Video for a people with some experience in programming wanting to learn Python.",
  video_url: "https://www.youtube.com/embed/YSe9Tu_iNQQ",
  active: true
}, {
  id: 5,
  title: "Intermedia Python Programming - Part 2",
  description: "Video for a people with some experience in programming wanting to learn Python.",
  video_url: "https://www.youtube.com/embed/jA5LW3bR0Us",
  active: true
}, {
  id: 6,
  title: "C Programming Tutorial",
  description: "A comprehensive video tutorial for C.",
  video_url: "https://www.youtube.com/embed/CpG3oATGIs",
  active: true
}];

module.exports = MaterialYoutube;

},{}],25:[function(require,module,exports){
const { renderDocument } = require('libraries/document-renderer');
const App = require('./App');

document.addEventListener("DOMContentLoaded", function (event) {
  renderDocument(new App().render(), document.querySelector('#app'));
});

},{"./App":15,"libraries/document-renderer":26}],26:[function(require,module,exports){
function renderDocument(elements, DOMSelector) {
  DOMSelector.appendChild(elements);
}

module.exports = { renderDocument };

},{}],27:[function(require,module,exports){
class component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.renderedElement = '';
  }

  updateState(newState, componentElement) {
    this.state = newState;
    componentElement.parentNode.replaceChild(this.render(), componentElement);
  }

  setRenderElement() {

  }

  render() {
    this.setRenderElement();
    return this.renderedElement;
  }
}

function createElement(elementProperties) {
  const {
    elementType,
    style,
    attributes,
    innerText,
    onClick,
    childrenElements
  } = elementProperties;

  const element = document.createElement(elementType);

  if (style) Object.keys(style).forEach(function(styleName) {
    element.style[styleName] = style[styleName];
  })

  if (attributes) Object.keys(attributes).forEach(function(attributeName) {
    element.setAttribute(attributeName, attributes[attributeName]);
  });

  element.innerHTML = innerText || '';

  element.onclick = onClick

  if (childrenElements) childrenElements.forEach(function(child) {
    element.appendChild(child);
  });

  return element;
}

module.exports = { component, createElement };

},{}]},{},[25]);
