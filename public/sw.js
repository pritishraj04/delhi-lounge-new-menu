if (!self.define) {
  let e,
    a = {};
  const i = (i, o) => (
    (i = new URL(i + ".js", o).href),
    a[i] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = i), (e.onload = a), document.head.appendChild(e));
        } else ((e = i), importScripts(i), a());
      }).then(() => {
        let e = a[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (o, d) => {
    const r =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[r]) return;
    let n = {};
    const c = (e) => i(e, r),
      f = { module: { uri: r }, exports: n, require: c };
    a[r] = Promise.all(o.map((e) => f[e] || c(e))).then((e) => (d(...e), n));
  };
}
define(["./workbox-87b8d583"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "c146851d8952a6621a1a3397546d423c",
        },
        {
          url: "/_next/static/chunks/117-cc707d09b3e930ce.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/292.0f35a13f3a0e9b02.js",
          revision: "0f35a13f3a0e9b02",
        },
        {
          url: "/_next/static/chunks/630-0a787d7e15fafa9d.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/935.048acb7305377251.js",
          revision: "048acb7305377251",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-40c80ecbd1b6af59.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/app/layout-889a803c06b7d436.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/app/loading-4fe98d3e7baa0c87.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/app/page-dd158c800befe7ff.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/fd9d1056-182ecd18cdd342a6.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/framework-f66176bb897dc684.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/main-3ab7c8c087d47583.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/main-app-403dfc152d4f6c53.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/pages/_app-72b849fbd24ac258.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/pages/_error-7ba65e1336b92748.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-7dd3aef1f8cb8580.js",
          revision: "vrCLyWsshlvQNha4zseAJ",
        },
        {
          url: "/_next/static/css/924a10f1f1dc1644.css",
          revision: "924a10f1f1dc1644",
        },
        {
          url: "/_next/static/css/bb6aee537f95582b.css",
          revision: "bb6aee537f95582b",
        },
        {
          url: "/_next/static/media/26a46d62cd723877-s.woff2",
          revision: "befd9c0fdfa3d8a645d5f95717ed6420",
        },
        {
          url: "/_next/static/media/3e57fe4abb1c4cae-s.woff2",
          revision: "ae3c8d5a747b137e316ac574e6f888e9",
        },
        {
          url: "/_next/static/media/4486f70b101e60d9-s.woff2",
          revision: "2afb718eb4add6612c4beda4316a6853",
        },
        {
          url: "/_next/static/media/55c55f0601d81cf3-s.woff2",
          revision: "43828e14271c77b87e3ed582dbff9f74",
        },
        {
          url: "/_next/static/media/581909926a08bbc8-s.woff2",
          revision: "f0b86e7c24f455280b8df606b89af891",
        },
        {
          url: "/_next/static/media/6d93bde91c0c2823-s.woff2",
          revision: "621a07228c8ccbfd647918f1021b4868",
        },
        {
          url: "/_next/static/media/97e0cb1ae144a2a9-s.woff2",
          revision: "e360c61c5bd8d90639fd4503c829c2dc",
        },
        {
          url: "/_next/static/media/a34f9d1faa5f3315-s.p.woff2",
          revision: "d4fe31e6a2aebc06b8d6e558c9141119",
        },
        {
          url: "/_next/static/media/ae80e08d9fcae03a-s.woff2",
          revision: "f142159132d476906e58556be82b5609",
        },
        {
          url: "/_next/static/media/dcc209c0b1ab30af-s.p.woff2",
          revision: "88a5f5c3dc76c2e00867f94ea2f3b7f2",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/vrCLyWsshlvQNha4zseAJ/_buildManifest.js",
          revision: "c155cce658e53418dec34664328b51ac",
        },
        {
          url: "/_next/static/vrCLyWsshlvQNha4zseAJ/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/browserconfig.xml",
          revision: "51c03b33e7366c4a6679596b566d4d6b",
        },
        {
          url: "/data/bar-menu.csv",
          revision: "97e904292b839f56038d3b019bd35143",
        },
        {
          url: "/data/food-menu.csv",
          revision: "2517cf07c5a6c3584c89e60478a70db6",
        },
        {
          url: "/delhi-lounge-logo.png",
          revision: "49f5458d03ecc765c8905d7cfa89c368",
        },
        {
          url: "/icons/icon-128x128.png",
          revision: "51a8e4f92302e11d61616f55f068bd13",
        },
        {
          url: "/icons/icon-144x144.png",
          revision: "05ab99fe42dce117e9263724da9f811e",
        },
        {
          url: "/icons/icon-152x152.png",
          revision: "83d081e96b222614552891723ce75cba",
        },
        {
          url: "/icons/icon-16x16.png",
          revision: "7a76a33907fc6dc629a49d466a7d56a4",
        },
        {
          url: "/icons/icon-192x192.png",
          revision: "2c4309d60bbb412d4f4864242e42c87c",
        },
        {
          url: "/icons/icon-32x32.png",
          revision: "b6d95febe3b1fa78f4811f83b9c9920a",
        },
        {
          url: "/icons/icon-384x384.png",
          revision: "7998616137e83a078ddeee078e57c2af",
        },
        {
          url: "/icons/icon-512x512.png",
          revision: "2fba2ffa4741f0b3bde39d714e9de403",
        },
        {
          url: "/icons/icon-72x72.png",
          revision: "65be25f60e3119457d2045f7f8371e93",
        },
        {
          url: "/icons/icon-96x96.png",
          revision: "e3f0f9b0374796567b1596062e3e6c79",
        },
        {
          url: "/img/bar-menu/aam-panna-mule.jpg",
          revision: "a629db92380b6d9c4e475096880dc30e",
        },
        {
          url: "/img/bar-menu/banarasi-boulevardier.jpg",
          revision: "4dcc719e5fefddf82cfcbe5f5dd05979",
        },
        {
          url: "/img/bar-menu/beat-the-heat.jpg",
          revision: "62732d6dd145d144cce72cac22e06e4d",
        },
        {
          url: "/img/bar-menu/betel-leaf-paloma.jpg",
          revision: "f030d747eaaf479a05050d31ae195a63",
        },
        {
          url: "/img/bar-menu/buransh-hiball.jpg",
          revision: "11e33d115b0701051fd6f9ba5d1c7e58",
        },
        {
          url: "/img/bar-menu/dr-gogias-prescription.jpg",
          revision: "6a2fe2692db9c1e300577bc124552df3",
        },
        {
          url: "/img/bar-menu/dusk-till-dawn.jpg",
          revision: "b9d59e517ee6c6221d6d7bcc98018ab7",
        },
        {
          url: "/img/bar-menu/elderflower-fizz-copy.jpg",
          revision: "b17b2270ae84278f0db069c7f0ccbb83",
        },
        {
          url: "/img/bar-menu/falsa-hiball.jpg",
          revision: "76a928ccee994bd340244f095770a6d5",
        },
        {
          url: "/img/bar-menu/filter-kaapi-martini.jpg",
          revision: "f1a92941e3f2556e8652a8037061c6de",
        },
        {
          url: "/img/bar-menu/gondhraj-lemonade.jpg",
          revision: "f6851c3d57e4b7f84e163f452b12b160",
        },
        {
          url: "/img/bar-menu/guava-dark-stormy.jpg",
          revision: "ffe2fcc8249c3c0c358640e3b250660c",
        },
        {
          url: "/img/bar-menu/i-got-no-chill.jpg",
          revision: "47aa69a054146d2138783480bfa6e7be",
        },
        {
          url: "/img/bar-menu/kashmiri-kahwa-julep.jpg",
          revision: "847ada3563625bca35bb2905a17ea6e3",
        },
        {
          url: "/img/bar-menu/kiwi-mint-lemonade.jpg",
          revision: "ae34fdc0a45ea47d25b8d2e7b45b0c63",
        },
        {
          url: "/img/bar-menu/laal-saag-martini.jpg",
          revision: "5ea2d9ff1b37da0fabd3394a2273fcc0",
        },
        {
          url: "/img/bar-menu/lipton-di-chai.jpg",
          revision: "d0ddcb9644d4fb6ffbf5cb2ee5a1ab36",
        },
        {
          url: "/img/bar-menu/plum-galangal-fizz.jpg",
          revision: "0a1e5c9b0b8d97a766399cca34d68306",
        },
        {
          url: "/img/bar-menu/raw-mango-picante.jpg",
          revision: "93155138fb8797e0b40871427431427e",
        },
        {
          url: "/img/bar-menu/royal-vodka-sour.jpg",
          revision: "870fd82d020536554350ce90fd5ef1aa",
        },
        {
          url: "/img/bar-menu/spicy-corn-margarita-.jpg",
          revision: "63ff86c5b763495f18c6eaa44b33ba31",
        },
        {
          url: "/img/bar-menu/sugarcane.jpg",
          revision: "03cfa36ed8cb3e3c9bbf914838fb1251",
        },
        {
          url: "/img/bar-menu/summer-essentials-copy.jpg",
          revision: "49c6753740eb204cd00c9cfd5d55178c",
        },
        {
          url: "/img/bar-menu/tamring-whisky-sour.jpg",
          revision: "adef2fd2c689a44c2fd1c66fd0bc6ca0",
        },
        {
          url: "/img/bar-menu/tellicherry-pepper.jpg",
          revision: "cfbdf918eec43cde6337530ead24df8a",
        },
        {
          url: "/img/bar-menu/tropic-city.jpg",
          revision: "9335efaef14c1db48a38b8ca9870b6a8",
        },
        {
          url: "/img/bar-menu/tropic-tingle.jpg",
          revision: "a99e9c31c9a5b465c6e306b21e17bd50",
        },
        {
          url: "/img/bar-menu/turmeric-gin-old-fashioned.jpg",
          revision: "3b238fb4cc57723211245203c876cf29",
        },
        {
          url: "/img/bar-menu/very-berry-sour.jpg",
          revision: "87b039fc7e95b54870fb1bfd141b1af9",
        },
        {
          url: "/img/events/christmas.jpg",
          revision: "2181414da8af8a21453e0eacd551d8d9",
        },
        {
          url: "/img/food-menu/almond-gucchi-korma.jpg",
          revision: "2181414da8af8a21453e0eacd551d8d9",
        },
        {
          url: "/img/food-menu/aloo-gobhi.jpg",
          revision: "a762a07870879b551092f94f8ac9678d",
        },
        {
          url: "/img/food-menu/amritsari-patties-kulcha-chana.jpg",
          revision: "9014e64e07c2d0a0d7cbd83978f43fbc",
        },
        {
          url: "/img/food-menu/anardana-boondi-raita.jpg",
          revision: "b32fe8a1cc8dc3ff6990d547f669bc71",
        },
        {
          url: "/img/food-menu/andhra-scallops.jpg",
          revision: "9f98a83cf19758942dc916e5fb0791c8",
        },
        {
          url: "/img/food-menu/asparagus-coconut-shorba.jpg",
          revision: "0c99add361f6b8b9db92f6437dc1a387",
        },
        {
          url: "/img/food-menu/assorted-bread-basket.jpg",
          revision: "ca6ed126a865063906d3cf1d1490dac9",
        },
        {
          url: "/img/food-menu/baileys-rasmalai.jpg",
          revision: "7f31c5764b09ad6e963153a2695d274a",
        },
        {
          url: "/img/food-menu/bakre-ke-nakhre.jpg",
          revision: "677be61f5be72cd038a153227dc83c74",
        },
        {
          url: "/img/food-menu/basil-paneer-rarah.jpg",
          revision: "4687753b4a900896c5125170191591d4",
        },
        {
          url: "/img/food-menu/basket-chaat.jpg",
          revision: "e062bdb06a6d0320def616d168abdb88",
        },
        {
          url: "/img/food-menu/betroot-shammi-labgeer.jpg",
          revision: "ed24ca7a73682200bec2fea08a0b4d8e",
        },
        {
          url: "/img/food-menu/bhalla-papdi-chaat.jpg",
          revision: "ef496916f4e95a463f88ce79a671d138",
        },
        {
          url: "/img/food-menu/bullet-kebab.jpg",
          revision: "3f958025591a20f20405c6b04fe07548",
        },
        {
          url: "/img/food-menu/burrhani-raita.jpg",
          revision: "d3d3d75e7adb855187d0632b22d7a351",
        },
        {
          url: "/img/food-menu/butter-laccha-paratha.jpg",
          revision: "44111de3314c4fa20b4d36f514680ecb",
        },
        {
          url: "/img/food-menu/butter-naan.jpg",
          revision: "7c4cdb79cd4e462b67832ab7e0cdc44a",
        },
        {
          url: "/img/food-menu/butter-tandoori-roti.jpg",
          revision: "4f77ebd4e45b39d04aff2691ea4e7375",
        },
        {
          url: "/img/food-menu/charcoal-roasted-baingan-bharta.jpg",
          revision: "21cd8baa73ccbdb112b85705a2286569",
        },
        {
          url: "/img/food-menu/cheese-naan.jpg",
          revision: "c8c17e8be28a34083d9dfacdae78dc7d",
        },
        {
          url: "/img/food-menu/cherry-pineapple-raita.jpg",
          revision: "4fb0984dde921b1e793a35d60abfdb97",
        },
        {
          url: "/img/food-menu/chicatown-chilli-cottage-cheese.jpg",
          revision: "ad5beaf25a717b2cf5966f8997f186af",
        },
        {
          url: "/img/food-menu/chicken-cheese-kulcha.jpg",
          revision: "6bd058be398f63d2ec56e7cfa1b36edc",
        },
        {
          url: "/img/food-menu/chicken-fenugreek-shorba.jpg",
          revision: "982959eeebe0f421b52ff4faf27a3045",
        },
        {
          url: "/img/food-menu/chicken-khurchan.jpg",
          revision: "de1ab2b83443cfdf5030b5cf77fd69b3",
        },
        {
          url: "/img/food-menu/chicken-malai-tikka.jpg",
          revision: "65a2e84d1dcc3a0b983578df2e412569",
        },
        {
          url: "/img/food-menu/chicken-reshmi-kebab.jpg",
          revision: "63cb517b1d2898093c3647e0712c5a9f",
        },
        {
          url: "/img/food-menu/chicken-tikka-masala.jpg",
          revision: "29da59935deba3545d72c670138ff9f0",
        },
        {
          url: "/img/food-menu/chicken-tikka.jpg",
          revision: "37f992aca96e7b3329163d129d034fd6",
        },
        {
          url: "/img/food-menu/chilian-sea-bass-coconut-curry.jpg",
          revision: "227643f946f3d8262dd2219796ad4adf",
        },
        {
          url: "/img/food-menu/chinatown-chili-chicken.jpg",
          revision: "3ff9c70338a7d01cdb31400b1eed294c",
        },
        {
          url: "/img/food-menu/chur-chur-naan.jpg",
          revision: "cf3e8a67585e66f794635c122367247b",
        },
        {
          url: "/img/food-menu/cumin-coriander-rice.jpg",
          revision: "ff26d57354b6949e2e671dd87dc01e12",
        },
        {
          url: "/img/food-menu/custard-gulab-jamun.jpg",
          revision: "8e7f3165d1f1b6958c517f6b665269fc",
        },
        {
          url: "/img/food-menu/dal-tadka.jpg",
          revision: "87148ec52c267edc0cd761210ebe3ea4",
        },
        {
          url: "/img/food-menu/delhi-lounge-butter-chicken.jpg",
          revision: "3a730bbc9ba624e9d8e4d2289c62f531",
        },
        {
          url: "/img/food-menu/delhi-lounge-dal-makhani.jpg",
          revision: "56159959b088f6c9603e8b4e5242a7ce",
        },
        {
          url: "/img/food-menu/delhi-lounge-tawa-chicken.jpg",
          revision: "cae1ceec4c12da843ad8e2bb5e039357",
        },
        {
          url: "/img/food-menu/dum-aloo-kashmiri.jpg",
          revision: "198e853eb617dd10ea08bfc938128ae0",
        },
        {
          url: "/img/food-menu/dum-chicken-parda-biryani.jpg",
          revision: "c77d363b97bc6b580007bd36cebe3d5f",
        },
        {
          url: "/img/food-menu/dum-jackfruit-parda-biryani.jpg",
          revision: "dbdf197c1bd6cd4922032bea45da6fa5",
        },
        {
          url: "/img/food-menu/dum-mutton-parda-biryani.jpg",
          revision: "6c3d8c0909d027d52f5ab4cb1597805f",
        },
        {
          url: "/img/food-menu/fish-tikka.jpg",
          revision: "193f3becafa0f40d0c2621d0a77d5265",
        },
        {
          url: "/img/food-menu/gajar-halwa.jpg",
          revision: "ea6c65ebeae7bf7d4f236509a554e745",
        },
        {
          url: "/img/food-menu/garden-grill-seekh-kebab.jpg",
          revision: "400bef8b7fd03176b3db81497fbbb6f9",
        },
        {
          url: "/img/food-menu/garlic-naan.jpg",
          revision: "c59f0511962e9df483579614c01b4a38",
        },
        {
          url: "/img/food-menu/gilafi-seekh.jpg",
          revision: "a8fefb9dffa3211c3dae689e7d541539",
        },
        {
          url: "/img/food-menu/goat-shank-nehari.jpg",
          revision: "4c07c4fab503df8ef076779ede1d69ae",
        },
        {
          url: "/img/food-menu/green-salad.jpg",
          revision: "e6ca7e8089d2e129c1294742603ee0ad",
        },
        {
          url: "/img/food-menu/gulab-jamun.jpg",
          revision: "506a55b9e00b0cade8359191a594cf30",
        },
        {
          url: "/img/food-menu/gulkand-rabri-mousse.jpg",
          revision: "2bd1e2fedf5f6d08db0345e91f39c870",
        },
        {
          url: "/img/food-menu/imag.jpg",
          revision: "4c2d966721afcdb57badd8a3e02a93d7",
        },
        {
          url: "/img/food-menu/imperial-raan.jpg",
          revision: "7420b7b4922f0d65a86a1d3f7a9032ec",
        },
        {
          url: "/img/food-menu/jack-fruit-tikka.jpg",
          revision: "b8b3b85ff19ad3e3e4de73c78fa2644a",
        },
        {
          url: "/img/food-menu/jaggery-rasgulla.jpg",
          revision: "abdf8e28f24b27cbf82f7ae2dbb7c109",
        },
        {
          url: "/img/food-menu/kadhai-prawns.jpg",
          revision: "3899f4e610d67e39e152b79948683517",
        },
        {
          url: "/img/food-menu/kaju-methi-malai-matar.jpg",
          revision: "b269490759131c62f2bcc539fd26b415",
        },
        {
          url: "/img/food-menu/kali-mirch-chicken.jpg",
          revision: "19603895b7155bc08fafa86ff2902311",
        },
        {
          url: "/img/food-menu/karol-bagh-aloo-tikki.jpg",
          revision: "05205f0e70176064d0d887dc2efe2463",
        },
        {
          url: "/img/food-menu/khameeri-roti-pistachio.jpg",
          revision: "74d3bfccefd4843963c79abccc362433",
        },
        {
          url: "/img/food-menu/khamiri-roti-plain.jpg",
          revision: "20b018f33c2f75081f839350170090f2",
        },
        {
          url: "/img/food-menu/khamiri-rroti-plain.jpg",
          revision: "2329c170e9c0470c12aec3727d6e8776",
        },
        {
          url: "/img/food-menu/khumbh-ki-galouti.jpg",
          revision: "47417a26699b99a6cc8250554aff4b67",
        },
        {
          url: "/img/food-menu/korma-chicken.jpg",
          revision: "e532f0b154ea9e6449b0f8d592302797",
        },
        {
          url: "/img/food-menu/kulcha-aloo-pyaz.jpg",
          revision: "d11073c5dfa382de1459281f35de9e30",
        },
        {
          url: "/img/food-menu/kulcha-onion.jpg",
          revision: "f6fde0616fd479dedae7829549be2688",
        },
        {
          url: "/img/food-menu/kulcha-patties.jpg",
          revision: "2d4b2c2452536a7d6e463b580ddc1ec3",
        },
        {
          url: "/img/food-menu/kulfi-falooda.jpg",
          revision: "7b5bde04ec475636b874a844ada37b44",
        },
        {
          url: "/img/food-menu/lagan-ki-bataer.jpg",
          revision: "10f870bc69c294fbc9ec366144ad57d0",
        },
        {
          url: "/img/food-menu/malai-brocolli-tikka copy.jpg",
          revision: "09baf2cb83a3753a6ac6910c4b6faf79",
        },
        {
          url: "/img/food-menu/malai-brocolli-tikka.jpg",
          revision: "e3cf9679f8542b8d82cfc530e7bbcc27",
        },
        {
          url: "/img/food-menu/malai-kofta.jpg",
          revision: "ca9e7ce01ec84f663e5408b2823cd0d9",
        },
        {
          url: "/img/food-menu/mango-avocado-salad.jpg",
          revision: "754c9e7c8f7d5fdc3b6a4f85bba4aaf5",
        },
        {
          url: "/img/food-menu/matar-ke-kebab copy.jpg",
          revision: "6cb070ca899512729619d32d63e7f7a2",
        },
        {
          url: "/img/food-menu/matar-ke-kebab.jpg",
          revision: "4377d8addcc313966ff0f474dc26f444",
        },
        {
          url: "/img/food-menu/mint-lachha-paratha.jpg",
          revision: "ee4f3dd69150823be53ba4cb39ced3ba",
        },
        {
          url: "/img/food-menu/mirchi-laccha-paratha.jpg",
          revision: "b2c128cf33772228e9320bb7b42bfcd9",
        },
        {
          url: "/img/food-menu/missi-roti-plain.jpg",
          revision: "5a807f3926c531a017311aa0f8237ace",
        },
        {
          url: "/img/food-menu/missi-roti.jpg",
          revision: "bc2968d25ac315bc8b386d5039e25683",
        },
        {
          url: "/img/food-menu/mixed-vegetable-raita.jpg",
          revision: "7199d274bc33b51bc8903a8e96960370",
        },
        {
          url: "/img/food-menu/moong-dal-halwa.jpg",
          revision: "a69bf6f389d93235e8a4018ff413d4cb",
        },
        {
          url: "/img/food-menu/morels-pulao.jpg",
          revision: "937ed636af801924a67208409affe736",
        },
        {
          url: "/img/food-menu/mutton-galouti-kebab.jpg",
          revision: "8c7821d2ad2d42ea21fe66e8e3882994",
        },
        {
          url: "/img/food-menu/mutton-korma.jpg",
          revision: "e25ab508027f01d15bc466f1bf006efd",
        },
        {
          url: "/img/food-menu/mutton-rogan-josh.jpg",
          revision: "95d2b3004eeb97040037fa428ac4d373",
        },
        {
          url: "/img/food-menu/mutton-seekh-gilafi.jpg",
          revision: "bcda1d735c0199d16ba727591d36d40c",
        },
        {
          url: "/img/food-menu/palak-paneer.jpg",
          revision: "42eec881d774a1cdaf2681c2de2d8c2b",
        },
        {
          url: "/img/food-menu/palak-patta-chaat.jpg",
          revision: "a5b8da834a5225ed5efae5066174e888",
        },
        {
          url: "/img/food-menu/paneer-khurchan.jpg",
          revision: "afe67644a6d83f338d569ebd1dcba34f",
        },
        {
          url: "/img/food-menu/paneer-tikka-masala.jpg",
          revision: "e4fa67a5b786bb0afe3876a7e27a3cbc",
        },
        {
          url: "/img/food-menu/pani-puri.jpg",
          revision: "7fcdc14f4c764edf107d31444a4b5695",
        },
        {
          url: "/img/food-menu/papdi-chaat.jpg",
          revision: "2656c194dde86f33a54cb9120001595f",
        },
        {
          url: "/img/food-menu/plain-laccha-paratha.jpg",
          revision: "1d4d28764848af98d28ef356b5c1a918",
        },
        {
          url: "/img/food-menu/plain-naan.jpg",
          revision: "774612ccfcbde67250a175953b22dac7",
        },
        {
          url: "/img/food-menu/plain-tandoori-roti.jpg",
          revision: "868ef3c835b2504406b978885bbc13a2",
        },
        {
          url: "/img/food-menu/pomegranate-quinoa-salad.jpg",
          revision: "05a938e07d865a52c44b784f2211b085",
        },
        {
          url: "/img/food-menu/purani-dilli-chole-bhature.jpg",
          revision: "c10cda016db234df3becbada4d5f8643",
        },
        {
          url: "/img/food-menu/purani-dilli-ke-aloo-kachalu.jpg",
          revision: "6046d6cd7227e88beab0010f922d2922",
        },
        {
          url: "/img/food-menu/reshmi-seekh-kebab.jpg",
          revision: "334dbfd991db5ead46dd18fb3a88e3b5",
        },
        {
          url: "/img/food-menu/saag-chicken.jpg",
          revision: "9d79afffab10c4e39f7e9782e23e057e",
        },
        {
          url: "/img/food-menu/saffron-rabri.jpg",
          revision: "25046b66ba1961f6f8236bfb5c6fb754",
        },
        {
          url: "/img/food-menu/saloni-salmon-tikka.jpg",
          revision: "5a26bcab5e346ee311d3a0d4937e301c",
        },
        {
          url: "/img/food-menu/samosa-chaat.jpg",
          revision: "19a7cf0b9c4371c94afa9f4086fbbcc1",
        },
        {
          url: "/img/food-menu/samosa-platter.jpg",
          revision: "ea1657c03146d5ffe1afd29679d86510",
        },
        {
          url: "/img/food-menu/sarson-ka-saag-makke-ki-roti.jpg",
          revision: "6aa71d323f46e033e48e734bf5b9e418",
        },
        {
          url: "/img/food-menu/scotch-whiskey-naan.jpg",
          revision: "10fe9e9e5a50bdb8a777ac89a6372643",
        },
        {
          url: "/img/food-menu/shahi-paneer.jpg",
          revision: "68fc3af48b12d966d234a3a69790f758",
        },
        {
          url: "/img/food-menu/smokey-tomato-shorba.jpg",
          revision: "10b3efd53d63a052375c0a9b5707b3d7",
        },
        {
          url: "/img/food-menu/steam-rice.jpg",
          revision: "c9f87f4c369dff07fd21350494bea237",
        },
        {
          url: "/img/food-menu/steamed-basmati-rice.jpg",
          revision: "c9f87f4c369dff07fd21350494bea237",
        },
        {
          url: "/img/food-menu/tandoori-chicken-(full).jpg",
          revision: "50b0516478b62ce46d4af9602446cd35",
        },
        {
          url: "/img/food-menu/tandoori-chicken-(half).jpg",
          revision: "c627ea404f5fe766c169fdfb620b62f8",
        },
        {
          url: "/img/food-menu/tandoori-cottage-cheese.jpg",
          revision: "c0bda4d9ba565a710481ca2eb9b99455",
        },
        {
          url: "/img/food-menu/tandoori-lamb-chops.jpg",
          revision: "dd59d561f232bb62b14ae8c905f0bf10",
        },
        {
          url: "/img/food-menu/tandoori-pomfret.jpg",
          revision: "32614923fed61072dadde91e776c9018",
        },
        {
          url: "/img/food-menu/tandoori-prawns.jpg",
          revision: "d553597dcb4fbe39f366082e6fdccd78",
        },
        {
          url: "/img/food-menu/tandoori-quail.jpg",
          revision: "e1a0371e3bcdc8810615775d32a9aab4",
        },
        {
          url: "/img/food-menu/tandoori-russet-potatoes.jpg",
          revision: "64ce53905d7d47cca320f192456b1c4b",
        },
        {
          url: "/img/food-menu/tandoori-salad.jpg",
          revision: "2c2bd3dee9f2cf3e9e1cbff1ddde372f",
        },
        {
          url: "/img/food-menu/tawa-masala-seekh-kebab.jpg",
          revision: "8e5115d50fb427bf7107621a74a96e96",
        },
        { url: "/manifest.json", revision: "c332929427a95ecafe5e250dfa99d51d" },
        {
          url: "/placeholder.svg",
          revision: "35707bd9960ba5281c72af927b79291f",
        },
        {
          url: "/sample-bar-menu.csv",
          revision: "97e904292b839f56038d3b019bd35143",
        },
        {
          url: "/sample-food-menu.csv",
          revision: "2517cf07c5a6c3584c89e60478a70db6",
        },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: i,
              state: o,
            }) =>
              a && "opaqueredirect" === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: "OK",
                    headers: a.headers,
                  })
                : a,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https?.*/,
      new e.NetworkFirst({
        cacheName: "offlineCache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 86400 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(png|jpg|jpeg|svg|gif|webp)$/,
      new e.CacheFirst({
        cacheName: "images",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(js|css|woff|woff2|ttf|eot)$/,
      new e.CacheFirst({
        cacheName: "static-resources",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/data\/food-menu\.csv$/,
      new e.StaleWhileRevalidate({
        cacheName: "menu-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/data\/bar-menu\.csv$/,
      new e.StaleWhileRevalidate({
        cacheName: "menu-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
