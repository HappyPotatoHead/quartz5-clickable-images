import { createRequire } from 'module';

createRequire(import.meta.url);

// src/types.ts
var defaultOptions = {
  minScaleFactor: 1.5,
  maxScaleFactor: 3,
  borderRadius: "8px"
};

// node_modules/unist-util-is/lib/index.js
var convert = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  (function(test) {
    if (test === null || test === void 0) {
      return ok;
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        propertiesFactory(
          /** @type {Props} */
          test
        )
      );
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  })
);
function anyFactory(tests) {
  const checks = [];
  let index = -1;
  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index2 = -1;
    while (++index2 < checks.length) {
      if (checks[index2].apply(this, parameters)) return true;
    }
    return false;
  }
}
function propertiesFactory(check) {
  const checkAsRecord = (
    /** @type {Record<string, unknown>} */
    check
  );
  return castFactory(all);
  function all(node) {
    const nodeAsRecord = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      node
    );
    let key;
    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node) {
    return node && node.type === check;
  }
}
function castFactory(testFunction) {
  return check;
  function check(value, index, parent) {
    return Boolean(
      looksLikeANode(value) && testFunction.call(
        this,
        value,
        typeof index === "number" ? index : void 0,
        parent || void 0
      )
    );
  }
}
function ok() {
  return true;
}
function looksLikeANode(value) {
  return value !== null && typeof value === "object" && "type" in value;
}

// node_modules/unist-util-visit-parents/lib/color.node.js
function color(d) {
  return "\x1B[33m" + d + "\x1B[39m";
}

// node_modules/unist-util-visit-parents/lib/index.js
var empty = [];
var CONTINUE = true;
var EXIT = false;
var SKIP = "skip";
function visitParents(tree, test, visitor, reverse) {
  let check;
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
  } else {
    check = test;
  }
  const is2 = convert(check);
  const step = reverse ? -1 : 1;
  factory(tree, void 0, [])();
  function factory(node, index, parents) {
    const value = (
      /** @type {Record<string, unknown>} */
      node && typeof node === "object" ? node : {}
    );
    if (typeof value.type === "string") {
      const name = (
        // `hast`
        typeof value.tagName === "string" ? value.tagName : (
          // `xast`
          typeof value.name === "string" ? value.name : void 0
        )
      );
      Object.defineProperty(visit2, "name", {
        value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")"
      });
    }
    return visit2;
    function visit2() {
      let result = empty;
      let subresult;
      let offset;
      let grandparents;
      if (!test || is2(node, index, parents[parents.length - 1] || void 0)) {
        result = toResult(visitor(node, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }
      if ("children" in node && node.children) {
        const nodeAsParent = (
          /** @type {UnistParent} */
          node
        );
        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step;
          grandparents = parents.concat(nodeAsParent);
          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset];
            subresult = factory(child, offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
      }
      return result;
    }
  }
}
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return value === null || value === void 0 ? empty : [value];
}

// node_modules/unist-util-visit/lib/index.js
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  let reverse;
  let test;
  let visitor;
  {
    test = testOrVisitor;
    visitor = visitorOrReverse;
    reverse = maybeReverse;
  }
  visitParents(tree, test, overload, reverse);
  function overload(node, parents) {
    const parent = parents[parents.length - 1];
    const index = parent ? parent.children.indexOf(node) : void 0;
    return visitor(node, index, parent);
  }
}

// src/transformer.ts
var rehypeClickableImages = () => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "img" || parent === void 0 || index === void 0) {
        return;
      }
      const originalSrc = node.properties?.src;
      if (!originalSrc) return;
      const originalAlt = node.properties?.alt || "";
      const existingClass = node.properties.className;
      const classArray = Array.isArray(existingClass) ? existingClass : existingClass != null && existingClass !== true && existingClass !== false ? [existingClass] : [];
      node.properties = {
        ...node.properties,
        className: [...classArray, "lightbox-image"],
        "data-caption": originalAlt,
        "data-src": originalSrc,
        "data-alt": originalAlt,
        loading: "lazy"
      };
      const wrapper = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["lightbox-wrapper"],
          "data-lightbox": "true"
        },
        children: [node]
      };
      parent.children[index] = wrapper;
    });
  };
};
var ClickableImages = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "ClickableImages",
    htmlPlugins() {
      return [[rehypeClickableImages, opts]];
    },
    externalResources() {
      return {
        css: [
          {
            inline: true,
            content: `
.lightbox-caption {
  margin-top: 14px;
  color: #CECDC3;
  font-size: 0.95rem;
  line-height: 1.4;
  display: flex;
  text-align: center;
  max-width:90vw;
}

.lightbox-wrapper {
  display: inline-block;
  cursor:pointer;
  transition:transform 0.2s ease;
  margin: 0;
}
              
.lightbox-wrapper:hover {
  transform: scale(1.02);
}
              
.lightbox-image {
  max-width: 100%;
  height: auto;
  border-radius: ${opts.borderRadius};
  box-shadow: 0 4px 8px rgba(16, 15, 15, 0.1);
  transition: box-shadow 0.2s ease;
}
              
.lightbox-image:hover {
  box-shadow: 0 8px 16px rgba(16, 15, 15, 0.1);
}
              
.lightbox-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  background: rgba(16, 15, 15, 0.6);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity:0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  backdrop-filter: blur(5px);
}
              
.lightbox-modal.active {
  opacity: 1;
  visibility: visible;
}
              
.lightbox-modal img{
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: ${opts.borderRadius};
  box-shadow: 0 20px 40px rgba(16, 15, 15, 0.4);
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.lightbox-modal.active img {
  transform: scale(1);
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right:30px;
  font-size: 2rem;
  color: #CECDC3;
  cursor: pointer;
  z-index: 101;
  background: rgba(16, 15, 15, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.8);
}

body.lightbox-open {
  overflow: hidden;
}

@media (max-width: 768px){
  .lightbox-modal img {
    max-width: 95%;
    max-height: 95%;
  }
  .lightbox-close {
    top: 10px;
    right: 15px;
    font-size: 1.5rem;
    width: 35px;
    height: 35px;
  }
}`
          }
        ],
        js: [
          {
            contentType: "inline",
            loadTime: "afterDOMReady",
            script: `(function () {
  var MIN_SCALE = ${opts.minScaleFactor};
  var MAX_SCALE = ${opts.maxScaleFactor};
 
  function initLightbox() {
    var existingModal = document.querySelector('.lightbox-modal');
    if (existingModal) existingModal.remove();
 
    var modal = document.createElement('div');
    modal.className = 'lightbox-modal';
 
    var closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
 
    var modalImg = document.createElement('img');
    modalImg.style.display = 'none';
 
    var captionEl = document.createElement('div');
    captionEl.className = 'lightbox-caption';
 
    modal.appendChild(closeBtn);
    modal.appendChild(modalImg);
    modal.appendChild(captionEl);
    document.body.appendChild(modal);
 
    function openLightbox(imageSrc, caption, originalImg) {
      modalImg.src = imageSrc;
      modalImg.alt = caption || '';
      modalImg.style.display = 'block';
      captionEl.textContent = caption || '';
      captionEl.style.display = caption ? 'block' : 'none';
      modal.classList.add('active');
      document.body.classList.add('lightbox-open');
 
      var preloadImg = new Image();
      preloadImg.onload = function () {
        modalImg.src = imageSrc;
 
        var originalRect = originalImg ? originalImg.getBoundingClientRect() : null;
        var originalDisplayWidth = originalRect ? originalRect.width : 0;
        var originalDisplayHeight = originalRect ? originalRect.height : 0;
 
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var imageWidth = preloadImg.naturalWidth;
        var imageHeight = preloadImg.naturalHeight;
 
        var minDisplayWidth = Math.max(
          originalDisplayWidth * MIN_SCALE,
          Math.min(500, viewportWidth * 0.7)
        );
        var minDisplayHeight = Math.max(
          originalDisplayHeight * MIN_SCALE,
          Math.min(400, viewportHeight * 0.7)
        );
 
        var scaleForWidth = minDisplayWidth / imageWidth;
        var scaleForHeight = minDisplayHeight / imageHeight;
        var minScale = Math.max(scaleForWidth, scaleForHeight, 1);
 
        var maxScale = Math.min(
          MAX_SCALE,
          (viewportWidth * 0.9) / imageWidth,
          (viewportHeight * 0.9) / imageHeight
        );
        var finalScale = Math.min(minScale, maxScale);
 
        var targetWidth = Math.min(imageWidth * finalScale, viewportWidth * 0.9);
        modalImg.style.width = targetWidth + 'px';
        modalImg.style.height = 'auto';
      };
      preloadImg.src = imageSrc;
    }
 
    function closeLightbox() {
      captionEl.textContent = '';
      modal.classList.remove('active');
      document.body.classList.remove('lightbox-open');
      setTimeout(function () {
        modalImg.style.display = 'none';
        modalImg.src = '';
      }, 300);
    }
 
    closeBtn.addEventListener('click', closeLightbox);
 
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeLightbox();
    });
 
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeLightbox();
    });
 
    document.querySelectorAll('.lightbox-wrapper').forEach(function (wrapper) {
      wrapper.addEventListener('click', function (e) {
        e.preventDefault();
        var img = wrapper.querySelector('.lightbox-image');
        if (img) {
          var src = img.getAttribute('data-src') || img.src;
          var caption = img.getAttribute('data-caption') || '';
          openLightbox(src, caption, img);
        }
      });
    });
 
    if (window.addCleanup) {
      window.addCleanup(function () {
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
        document.body.classList.remove('lightbox-open');
      });
    }
  }
 
  document.addEventListener('nav', initLightbox);
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
`
          }
        ]
      };
    }
  };
};

export { ClickableImages };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map