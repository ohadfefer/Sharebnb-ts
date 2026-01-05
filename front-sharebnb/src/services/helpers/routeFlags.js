// Central place to define where the tabbar should be hidden
export const hideTabbarMatchers = [
    /^\/stay\/[^/]+$/,                // stay details
    /^\/auth\/?/,                     // auth flow
    /^\/hosting\/?/,                  // host tools
    /^\/order\/.+\/confirmation$/,    // confirmation page
];

export function shouldHideTabbar(pathname) {
    return hideTabbarMatchers.some(rx => rx.test(pathname));
}
