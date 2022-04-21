// This configuration is the system default, and you need to modify the settings, just add the modifications to the src/config/config.js. It can also be modified directly in this file
module.exports = {
  lang: 'EN',                           //Languages, available in CN (simplified), HK (traditional), US (English), and other languages can be extended
  theme: {                              //topic
    color: '#0071ce',                   //Theme color
    mode: 'dark',                       //Theme modes are available in dark, light, and night
    success: '#52c41a',                 //The success color
    warning: '#faad14',                 //Warning color
    error: '#f5222f',                   //The wrong color
  },
  layout: 'side',                       //Navigation layout, optional side and head, side navigation and top navigation, respectively
  fixedHeader: false,                   //Fixed head status bar, true: fixed, false: not fixed
  fixedSideBar: true,                   //Fixed sidebar, true: fixed, false: not fixed
  fixedTabs: false,                      //Fixed header, true: fixed, false: not fixed
  pageWidth: 'fixed',                   //Content area width, fixed: fixed width, fluid: streaming width
  weekMode: false,                      //Color weak mode, true: on, false: not on
  multiPage: false,                     //Multi-page sign mode, true: on, false: not on
  cachePage: true,                      //Whether page data is cached, only in multi-page sign mode, true cache, false not cached
  hideSetting: false,                   //Hide Settings Drawer, true:Hidden, false: Not Hidden
  systemName: 'NEAR P2P',         //The system name
  copyright: '2021 GlobalDv C.A',     //copyright
  asyncRoutes: false,                   //Asynchronous load route, true:on, false: not on
  showPageTitle: true,                  //Whether to display the page title (page title in the PageLayout layout), true: display, false: not display
  filterMenu: true,                    //Filter menus according to permissions, true:filtering, false: not filtering
  animate: {                            //Animation settings
    disabled: false,                    //Disable animation, true:disabled, false: enabled
    name: 'bounce',                     //Animation effects, supported animation effects can be referenced ./animate.config.js
    direction: 'left'                   //Animation direction, the direction of the animation when switching pages, reference ./animate.config.js
  },
  footerLinks: [                        //Link at the bottom of the page, 'link: 'Link Address', name: 'Name/Display Text', icon: 'Icon, support for ant design vue icon library'.
    {link: 'http://dvconsultores.com/', name: 'GlobalDv'},
    {link: 'https://github.com/dvconsultores/nearp2p', icon: 'github'},
    {link: 'mailto:admin@p2p.com', icon: 'mail'},
    {link: 'https://near.org/', name: 'NEAR'},
    {link: 'https://t.me/nearp2p', name: 'Telegram'},
    {link: 'https://nearp2p.com/legal/Series_Operating_Agreement.pdf', name: ' Series Operating Agreement', icon: 'file-pdf'},
  ],
}
