export const awaitElement = (selector: string): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const getEl = () => document.querySelector(selector);
    let el = getEl();
    if (el) resolve(el);
    const mu = new MutationObserver(() => {
      el = getEl();
      if (el) {
        resolve(el);
        mu.disconnect();
      }
    });
    mu.observe(document.body, { childList: true, subtree: true });
  });
};
