import type { PluggableList, Plugin } from "unified";
import type { Root as HashRoot, Element } from "hast";
import type { QuartzTransformerPlugin } from "@quartz-community/types";
import type { Options } from "./types";
import { defaultOptions } from "./types";

import { visit } from "unist-util-visit";

const rehypeClickableImages: Plugin<[], HashRoot> = () => {
  return (tree: HashRoot) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "img" || parent === undefined || index === undefined) {
        return;
      }

      const originalSrc = node.properties?.src;
      if (!originalSrc) return;

      const originalAlt = node.properties?.alt || "";

      const existingClass = node.properties.className;
      const classArray: (string | number)[] = Array.isArray(existingClass)
        ? existingClass
        : existingClass != null && existingClass !== true && existingClass !== false
          ? [existingClass as string | number]
          : [];

      node.properties = {
        ...node.properties,
        className: [...classArray, "lightbox-image"],
        "data-caption": originalAlt,
        "data-src": originalSrc,
        "data-alt": originalAlt,
        loading: "lazy",
      };

      const wrapper = {
        type: "element" as const,
        tagName: "div",
        properties: {
          className: ["lightbox-wrapper"],
          "data-lightbox": "true",
        },
        children: [node],
      } satisfies Element;

      parent.children[index] = wrapper;
    });
  };
};

export const ClickableImages: QuartzTransformerPlugin<Options> = (userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts };

  return {
    name: "ClickableImages",
    htmlPlugins(): PluggableList {
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

html.lightbox-open {
  overflow: hidden !important;
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
}`,
          },
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
      document.documentElement.classList.add('lightbox-open');
 
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
      document.documentElement.classList.remove('lightbox-open');
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
          var src = img.src || img.getAttribute('data-src');
          var caption = img.getAttribute('data-caption') || '';
          openLightbox(src, caption, img);
        }
      });
    });
 
    if (window.addCleanup) {
      window.addCleanup(function () {
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
        document.body.classList.remove('lightbox-open');
        document.documentElement.classList.remove('lightbox-open');
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
`,
          },
        ],
      };
    },
  };
};
