// CMS Content Loader for Alquiler Calatayud
async function loadCMSContent() {
    try {
        const response = await fetch('content.json');
        const data = await response.json();
        
        document.querySelectorAll('[data-cms]').forEach(el => {
            const path = el.getAttribute('data-cms').split('.');
            let value = data;
            path.forEach(key => { value = value ? value[key] : null; });
            
            if (value !== undefined && value !== null) {
                if (el.tagName === 'IMG') {
                    el.src = value;
                } else if (el.hasAttribute('data-cms-attr')) {
                    const attr = el.getAttribute('data-cms-attr');
                    el.setAttribute(attr, value);
                } else {
                    el.innerHTML = value;
                }
            }
        });

        // Special handling for galleries (lists)
        document.querySelectorAll('[data-cms-list]').forEach(container => {
            const path = container.getAttribute('data-cms-list').split('.');
            let items = data;
            path.forEach(key => { items = items ? items[key] : null; });

            if (Array.isArray(items)) {
                const template = container.querySelector('[data-cms-template]');
                if (template) {
                    container.innerHTML = ''; // Clear
                    items.forEach(item => {
                        const clone = template.cloneNode(true);
                        clone.removeAttribute('data-cms-template');
                        clone.style.display = '';
                        
                        // Fill clone with item data
                        clone.querySelectorAll('[data-cms-item]').forEach(subEl => {
                             const subKey = subEl.getAttribute('data-cms-item');
                             if (subEl.tagName === 'IMG') subEl.src = item[subKey];
                             else subEl.innerHTML = item[subKey];
                        });
                        container.appendChild(clone);
                    });
                }
            }
        });
    } catch (e) { console.error("CMS load error:", e); }
}

window.addEventListener('DOMContentLoaded', loadCMSContent);
