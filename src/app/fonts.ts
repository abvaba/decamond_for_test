// app/fonts.ts
import localFont from 'next/font/local';

export const vazirFont = localFont({
    src: [
      {
        path: '../../public/fonts/Vazirmatn-FD-Light.woff2',
        weight: '300',
        style: 'normal',
      },
      {
        path: '../../public/fonts/Vazirmatn[wght].woff2',
        weight: '100 900',
        style: 'normal'
      }, {
        path: '../../public/fonts/Vazirmatn-FD-Thin.woff2',
        weight: '100',
        style: 'normal',
      }, {
        path: '../../public/fonts/Vazirmatn-FD-ExtraLight.woff2',
        weight: '200',
        style: 'normal'
      }

      , {
        path: '../../public/fonts/Vazirmatn-FD-Light.woff2',
        weight: '300',
        style: 'normal',
      }

      , {
        path: '../../public/fonts/Vazirmatn-FD-Regular.woff2',
        weight: '400',
        style: 'normal',
      }

      , {
        path: '../../public/fonts/Vazirmatn-FD-Medium.woff2',
        weight: '500',
        style: 'normal',
      }

      , {
        path: '../../public/fonts/Vazirmatn-FD-SemiBold.woff2',
        weight: '600',
        style: 'normal',

      }

      , {
        path: '../../public/fonts/Vazirmatn-FD-Bold.woff2',
        weight: '700',
        style: 'normal',

      }

      , {
        path: '../../public/fonts/Vazirmatn-FD-ExtraBold.woff2',
        weight: '800',
        style: 'normal',

      }

      , {
        path: '../../public/fonts/Vazirmatn-FD-Black.woff2',
        weight: '900',
        style: 'normal',
      }
    ],
    display: 'swap',
    variable:
      '--font-vazir',
    // For Persian/Arabic fonts, adjust font fallback:
    adjustFontFallback:
      'Arial', // or 'Tahoma' for better Arabic support
  })
;
