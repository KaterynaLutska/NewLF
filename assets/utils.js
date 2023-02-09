export const loadScript = (src, t) => {
    const existedScript = document.querySelector(`script[src="${src}"]`);
    return new Promise((res, rej) => {
        if(existedScript) {
            if(existedScript.hasAttribute('loaded')) {
                res();
            } else {
                const observer = new MutationObserver((mList, obs) => {
                    for(const m of mList) {
                        if(m.attributeName === 'loaded') {
                            obs.disconnect();
                            res();
                        }
                    }
                });
                observer.observe(existedScript, { attributes: true, childList: false, subtree: false });
            }            
        } else {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = () => {
                script.setAttribute('loaded', '');
                res();
            }
        }
    })
}

export const loadStyle = (src) => {
    const existedStyle = document.querySelector(`link[href="${src}"]`);
    if (!existedStyle) {
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        stylesheet.href = src;
        document.getElementsByTagName('head')[0].appendChild(stylesheet)
    }
}

export const debounce = (fn, wait) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    }
}

export const parseHTML = (text) => {
    return new DOMParser().parseFromString(text, 'text/html');
}

export const hideElement = (element) => {
    element.setAttribute('hidden', '');
}

export const showElement = (element) => {
    element.removeAttribute('hidden');
}

export const setActive = (element) => {
    element.classList.add('!active');
}

export const unsetActive = (element) => {
    element.classList.remove('!active');
}

export const updateURLParams = (newParams, sectionId, customUrl) => {
    const isFormData = newParams instanceof FormData;
    const url = new URL(customUrl || window.location.href);
    const params = new URLSearchParams(isFormData ? newParams : url.search);

    if (!isFormData) {
        for (const param in newParams) {
            const value = newParams[param];
            if (value) {
                params.set(param, value);
            } else {
                params.delete(param);
            }
            
        }
    }

    const currentURL = `${window.location.pathname}?${params.toString()}`;

    let queryURL;

    if(!sectionId) {
        queryURL = customUrl ? `${customUrl}?${params.toString()}` : currentURL;
    } else {
        params.set('section_id', sectionId);
        queryURL = `${customUrl || window.location.pathname}?${params.toString()}`;
    }

    return { queryURL, currentURL };
}

export const historyPush = (URL) => {
    window.history.pushState({ URL }, '', URL);
}

export const setInnerHTML = function(elm, html) {
    elm.replaceChildren(html);
    Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes)
        .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
};
