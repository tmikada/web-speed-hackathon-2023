type FontFaceSource = {
  family: string;
  source: string;
  descripter: FontFaceDescriptors;
};

const FONT_FACE_SOURCES: FontFaceSource[] = [
  {
    descripter: {
      display: 'block',
      style: 'normal',
      weight: '700',
    },
    family: 'Noto Serif JP',
    // source: "url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap')",
    source: "url('/fonts/NotoSerifJP-Bold2.woff2')",
  },
  {
    descripter: {
      display: 'block',
      style: 'normal',
      weight: '400',
    },
    family: 'Noto Serif JP',
    // source: "url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400&display=swap')",
    source: "url('/fonts/NotoSerifJP-Regular2.woff2')",  },
];

export async function loadFonts() {
  console.log("loadFonts");
  const fontFaces = FONT_FACE_SOURCES.map(({ descripter, family, source }) => new FontFace(family, source, descripter));
  const fonts: FontFace[] = [];

  for (const fontFace of fontFaces) {
    const font = await fontFace.load();
    fonts.push(font);
    console.log(font.family);
  }

  for (const font of fontFaces) {
    document.fonts.add(font);
  }
}
