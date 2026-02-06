/**
 * Centralized asset path configuration
 * All asset paths should be referenced from this file
 */

const getBasePath = () => {
    // In Astro, import.meta.env.BASE_URL is available at build time
    // For this config file, we'll use a helper function in components
    return '/';
};

export const assetPaths = {
    // Brand assets
    brand: {
        logo: 'logo.svg',
        logoBlackWhite: 'logo-BW.svg',
        logoPWA: 'kenichi_brand_pwa.svg',
        icon: 'favicon.svg',
    },

    // Social media images
    social: {
        ogImage: 'og-image.svg',
        twitterCard: 'twitter-image.svg',
    },

    // PWA icons
    pwa: {
        icon192: 'pwa-icon-192.png',
        icon512: 'pwa-icon-512.png',
        favicon: 'favicon.svg',
    },

    // Placeholders
    placeholders: {
        blog: 'blog-placeholder.svg',
        blue: 'placeholder-blue.svg',
        green: 'placeholder-green.svg',
        orange: 'placeholder-orange.svg',
        pink: 'placeholder-pink.svg',
    },

    // Other assets
    other: {
        flowLogo: 'flow-logo.png',
    },
};

/**
 * Helper function to get full asset URL
 * Use this in Astro components where import.meta.env.BASE_URL is available
 */
export function getAssetUrl(path: string, baseUrl: string = '/'): string {
    return `${baseUrl}${path}`;
}

/**
 * Get asset path with base URL
 * For use in components: getAssetPath(assetPaths.brand.logo, import.meta.env.BASE_URL)
 */
export function getAssetPath(relativePath: string, baseUrl: string = '/'): string {
    return getAssetUrl(relativePath, baseUrl);
}
