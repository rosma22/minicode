
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 8598, hash: '16a415316029f918be72d40fe85c66c7ccbac9b2f5b8f7f41e12e1c5a226369a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1005, hash: '39098d2078aaca3a31c082f0f9d3dcec2a2e4fe7236c88b288d232a1bf8be689', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 93508, hash: '96bce31dba71499413911a37989199f3a5ae538f4e6c2f68aaf7daa3c2c0aae2', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-ZXVJCOTJ.css': {size: 58505, hash: 'AtGoIMY/Te4', text: () => import('./assets-chunks/styles-ZXVJCOTJ_css.mjs').then(m => m.default)}
  },
};
