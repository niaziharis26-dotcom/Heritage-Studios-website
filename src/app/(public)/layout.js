import db from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientCursor from '@/components/ClientCursor';
import WhatsAppButton from '@/components/WhatsAppButton';
import Script from 'next/script';

export default function PublicLayout({ children }) {
  // Check if we are in preview mode via query params
  // Since this is a server component layout, searchParams are not directly passed to layouts.
  // However, we can read headers or use middleware. Next.js App Router layouts cannot easily read query params.
  // But wait, the pages themselves can!
  // Alternatively, we can check drafts in database and if not empty, merge them.
  // Let's check db drafts. To be safe, we merge drafts into components/settings/nav/footer if the draft key exists.
  // Actually, we can read from drafts dynamically if we have a way.
  // Let's do a simple check: if drafts are present, we can merge them in layout so the preview page renders them.
  // Wait! If the user is on the actual public site (no preview), we don't want to show drafts.
  // Next.js App router: we can check if the request headers have referrer or host pointing to visual-editor, 
  // or we can just merge drafts in the page component instead by checking searchParams there, and pass a settings override.
  // Let's let page components and layout load drafts if query param is set.
  // But layout doesn't have query params in Server Components. We can use header x-url if middleware sets it,
  // or simple check: check if drafts should be loaded.
  // Let's write a simple helper or just load drafts for Header/Footer if drafts have keys.
  // Let's look at the database.json. We can read navigation and footer drafts.
  
  const drafts = db.get('drafts') || {};
  const settings = { ...(db.get('settings') || {}), ...(drafts.settings || {}) };
  const services = db.get('services') || [];
  
  // We can merge navigation/footer drafts if we are previewing.
  // For safety, let's read the real ones. If there is a draft, we can merge it.
  const navigation = { ...(db.get('navigation') || {}), ...(drafts.navigation || {}) };
  const footer = { ...(db.get('footer') || {}), ...(drafts.footer || {}) };

  return (
    <>
      <ClientCursor />
      <Header settings={settings} navigation={navigation} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <WhatsAppButton settings={settings} />
      <Footer settings={settings} services={services} footer={footer} />
      
      {/* CMS Bridge Script */}
      <Script id="cms-bridge" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (window.self === window.top) return; // Only run inside iframe
            
            let hoveredEl = null;
            let selectedEl = null;
            let overlay = null;
            
            // Create selection overlay in the preview context
            function createOverlay() {
              overlay = document.createElement('div');
              overlay.id = 'cms-preview-overlay';
              Object.assign(overlay.style, {
                position: 'absolute', pointerEvents: 'none', zIndex: '999999',
                border: '2px dashed #34d399', background: 'rgba(52, 211, 153, 0.05)',
                transition: 'all 0.1s ease', display: 'none', boxSizing: 'border-box'
              });
              
              const label = document.createElement('div');
              label.id = 'cms-preview-label';
              Object.assign(label.style, {
                position: 'absolute', top: '-24px', left: '-2px',
                background: '#059669', color: '#fff', padding: '2px 8px',
                borderRadius: '4px 4px 0 0', fontSize: '10px', fontWeight: 'bold',
                fontFamily: 'sans-serif', whiteSpace: 'nowrap'
              });
              overlay.appendChild(label);
              document.body.appendChild(overlay);
            }
            
            function updateOverlay(el, type = 'hover') {
              if (!overlay) createOverlay();
              if (!el) {
                overlay.style.display = 'none';
                return;
              }
              const rect = el.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
              
              Object.assign(overlay.style, {
                top: (rect.top + scrollTop) + 'px',
                left: (rect.left + scrollLeft) + 'px',
                width: rect.width + 'px',
                height: rect.height + 'px',
                display: 'block',
                border: type === 'selected' ? '2px solid #059669' : '2px dashed #34d399',
                background: type === 'selected' ? 'rgba(5, 150, 105, 0.03)' : 'rgba(52, 211, 153, 0.05)'
              });
              
              const label = overlay.querySelector('#cms-preview-label');
              if (label) {
                const name = el.getAttribute('data-cms-field') || el.getAttribute('data-cms-id') || el.tagName.toLowerCase();
                label.textContent = name.toUpperCase();
                label.style.background = type === 'selected' ? '#059669' : '#047857';
              }
            }
            
            // Helper to find closest editable element or block
            function findEditable(el) {
              while (el && el !== document.body) {
                if (el.hasAttribute('data-cms-field') || el.hasAttribute('data-cms-id') || 
                    ['h1','h2','h3','h4','h5','h6','p','span','a','button','img','li','section'].includes(el.tagName.toLowerCase())) {
                  return el;
                }
                el = el.parentElement;
              }
              return null;
            }

            // Resolve full hierarchy path for the selected element
            function getHierarchyPath(el) {
              const path = [];
              let curr = el;
              while (curr && curr !== document.body) {
                const id = curr.getAttribute('data-cms-id');
                const field = curr.getAttribute('data-cms-field');
                path.unshift({
                  tag: curr.tagName.toLowerCase(),
                  id: id || null,
                  field: field || null,
                  name: field || id || curr.tagName.toLowerCase()
                });
                curr = curr.parentElement;
              }
              return path;
            }

            window.addEventListener('mouseover', (e) => {
              const el = findEditable(e.target);
              if (el && el !== selectedEl) {
                hoveredEl = el;
                updateOverlay(el, 'hover');
              }
            });
            
            window.addEventListener('mouseout', (e) => {
              if (hoveredEl && !hoveredEl.contains(e.relatedTarget)) {
                hoveredEl = null;
                updateOverlay(selectedEl, 'selected');
              }
            });
            
            window.addEventListener('click', (e) => {
              const el = findEditable(e.target);
              if (el) {
                e.preventDefault();
                e.stopPropagation();
                selectedEl = el;
                updateOverlay(el, 'selected');
                
                // Get element metadata
                const id = el.getAttribute('data-cms-id') || el.closest('[data-cms-id]')?.getAttribute('data-cms-id');
                const field = el.getAttribute('data-cms-field');
                const hierarchy = getHierarchyPath(el);
                
                window.parent.postMessage({
                  type: 'element-selected',
                  sectionId: id,
                  fieldId: field,
                  tagName: el.tagName.toLowerCase(),
                  text: el.innerText || el.textContent || '',
                  src: el.src || null,
                  alt: el.alt || null,
                  hierarchy
                }, '*');
                
                // Enable live contentEditable on EVERY clicked element in the preview
                el.contentEditable = 'true';
                el.focus();
                
                const onBlur = () => {
                  el.contentEditable = 'false';
                  window.parent.postMessage({
                    type: 'inline-edit',
                    sectionId: id,
                    fieldId: field,
                    text: el.innerText || el.textContent || ''
                  }, '*');
                  el.removeEventListener('blur', onBlur);
                };
                el.addEventListener('blur', onBlur);
              }
            }, true);
            
            window.addEventListener('dblclick', (e) => {
              let linkEl = e.target.closest('a') || e.target.closest('[data-cms-id]');
              if (linkEl) {
                let href = linkEl.getAttribute('href') || linkEl.getAttribute('data-cms-url');
                if (!href && linkEl.tagName.toLowerCase() === 'a') {
                  try {
                    const urlObj = new URL(linkEl.href);
                    href = urlObj.pathname;
                  } catch (err) {}
                }
                if (href) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.parent.postMessage({
                    type: 'navigate-page',
                    path: href
                  }, '*');
                }
              }
            }, true);
            
            // Build DOM Component Tree
            function buildComponentTree(el) {
              if (el.nodeType !== Node.ELEMENT_NODE) return null;
              const tagName = el.tagName.toLowerCase();
              if (['script', 'style', 'link', 'meta', 'iframe', 'noscript'].includes(tagName)) return null;
              if (el.id === 'cms-preview-overlay') return null;

              const id = el.getAttribute('data-cms-id');
              const fieldId = el.getAttribute('data-cms-field');
              
              // Only include semantic/important tags or elements with CMS attributes
              const isSignificant = id || fieldId || ['header', 'footer', 'section', 'article', 'nav', 'main', 'aside'].includes(tagName) || (['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'a', 'img'].includes(tagName) && el.children.length === 0 && el.textContent.trim().length > 0) || (tagName === 'img');

              let node = null;
              if (isSignificant) {
                node = { id, fieldId, tagName, children: [] };
              }

              for (const child of el.childNodes) {
                const childNode = buildComponentTree(child);
                if (childNode) {
                  if (node) {
                    node.children.push(childNode);
                  } else {
                    // Flatten if current node is skipped
                    if (!node) node = { children: [] };
                    node.children.push(childNode);
                  }
                }
              }
              
              if (node && !node.tagName && node.children.length > 0) {
                  // return just children array to flatten, but this function expects a single object or null
                  // Instead of flattening, we just let the caller handle it. Wait, if it's not significant, we just return its children
                  // Let's modify slightly:
              }
              
              if (!isSignificant) {
                 // Return array of significant children to be merged by parent
                 const sigChildren = [];
                 for (const child of el.childNodes) {
                    const cNode = buildComponentTree(child);
                    if (cNode) {
                       if (Array.isArray(cNode)) sigChildren.push(...cNode);
                       else sigChildren.push(cNode);
                    }
                 }
                 return sigChildren.length > 0 ? sigChildren : null;
              }
              
              return node;
            }

            function sendTreeUpdate() {
              const root = document.querySelector('body > main') || document.body;
              let tree = buildComponentTree(root);
              if (tree && !Array.isArray(tree)) tree = [tree];
              if (!tree) tree = [];
              
              window.parent.postMessage({ type: 'dom-tree-update', tree }, '*');
            }

            // Observe DOM changes to keep tree updated
            const observer = new MutationObserver(() => {
              if (window._cmsTreeTimeout) clearTimeout(window._cmsTreeTimeout);
              window._cmsTreeTimeout = setTimeout(sendTreeUpdate, 500);
            });
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            
            // Initial send
            setTimeout(sendTreeUpdate, 500);
            
            // Listen for selection from parent sidebar to focus/scroll
            window.addEventListener('message', (e) => {
              if (!e.data) return;
              
              if (e.data.type === 'scroll-to-section') {
                const target = document.querySelector('[data-cms-id="' + e.data.sectionId + '"]');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  selectedEl = target;
                  updateOverlay(target, 'selected');
                }
              }
              
              if (e.data.type === 'apply-style') {
                const { sectionId, fieldId, styles } = e.data;
                const selector = fieldId 
                  ? '[data-cms-id="' + sectionId + '"] [data-cms-field="' + fieldId + '"]'
                  : '[data-cms-id="' + sectionId + '"]';
                const target = document.querySelector(selector);
                if (target && styles) {
                  Object.assign(target.style, styles);
                  updateOverlay(target, 'selected');
                }
              }
            });
          })();
        `
      }} />
    </>
  );
}
