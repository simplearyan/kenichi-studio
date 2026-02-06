export const pwaConfig = {
    name: 'Kenichi Studio - Animation & Diagrams',
    shortName: 'Kenichi',
    description: 'Create animated diagrams, motion graphics, and export videos directly from your browser. Free online animation studio with no installation required.',
    themeColor: '#3b82f6',
    backgroundColor: '#111827',

    // Icon paths (relative paths, BASE_URL will be prepended in components)
    icons: {
        favicon: 'assets/icons/favicon.svg',
        appleTouchIcon: 'assets/icons/icon-192.png',
        icon192: 'assets/icons/icon-192.png',
        icon512: 'assets/icons/icon-512.png',
    },

    // Manifest path
    manifestPath: 'manifest.json',

    // Service worker
    serviceWorker: {
        path: 'sw.js',
        scope: '/',
    },
};
