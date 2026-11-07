/**
 * Real photos of the test gallery (`/galeria-teste#fotos-reais`).
 *
 * `src` is the cropped mosaic file (4:3 or 3:4). `fullSrc` is the uncropped
 * file opened in the lightbox, at its real pixel size. Three family photos
 * are 720px wide; they are not enlarged.
 *
 * The prepared order put every extra horizontal frame in column B, so that
 * column was shorter. Each column now has nine portraits and three
 * landscapes, and near-duplicate shots are not neighbors.
 */
export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  fullSrc: string;
  fullWidth: number;
  fullHeight: number;
  alt: string;
  /** A rises, B descends. */
  column: "A" | "B";
};

export const GALLERY_TITLE = "Fotos reais do produto";

export const GALLERY_LEAD =
  "Veja de perto a capa, as páginas e os detalhes da sua agenda.";

const thumb = (name: string) => `/img/galeria/thumb/${name}.webp`;
const full = (name: string) => `/img/galeria/full/${name}.webp`;

type Frame = {
  name: string;
  alt: string;
  column: "A" | "B";
  thumbWidth: number;
  thumbHeight: number;
  fullWidth: number;
  fullHeight: number;
};

const frame = ({
  name,
  alt,
  column,
  thumbWidth,
  thumbHeight,
  fullWidth,
  fullHeight,
}: Frame): GalleryPhoto => ({
  src: thumb(name),
  width: thumbWidth,
  height: thumbHeight,
  fullSrc: full(name),
  fullWidth,
  fullHeight,
  alt,
  column,
});

const portrait = (
  name: string,
  alt: string,
  column: "A" | "B",
  small = false,
): GalleryPhoto =>
  frame({
    name,
    alt,
    column,
    thumbWidth: small ? 720 : 900,
    thumbHeight: small ? 960 : 1200,
    fullWidth: small ? 720 : 1012,
    fullHeight: small ? 1280 : 1800,
  });

const landscape = (name: string, alt: string, column: "A" | "B"): GalleryPhoto =>
  frame({
    name,
    alt,
    column,
    thumbWidth: 900,
    thumbHeight: 675,
  fullWidth: 1800,
  // The breakfast photo is a wider original; every other 4:3 full is 1350 tall.
  fullHeight: name.endsWith("mesa-01") ? 1013 : 1350,
  });

/** Column A, top to bottom. Nine 3:4 frames and three 4:3 frames. */
const COLUMN_A: GalleryPhoto[] = [
  portrait(
    "agenda-catolica-2027-classica-capa-azul-marinho-dourado-05",
    "Agenda Clássica com capa azul-marinho e título em dourado sobre mesa clara",
    "A",
  ),
  portrait(
    "agenda-catolica-2027-pagina-abril-ilustracao-pato-08",
    "Agenda aberta na abertura de abril, com ilustração de pato em aquarela",
    "A",
  ),
  landscape(
    "agenda-catolica-2027-color-capa-cafe-da-manha-mesa-01",
    "Agenda Color com capa de patos em aquarela sobre jogo americano, ao lado de café e bolo",
    "A",
  ),
  portrait(
    "agenda-catolica-2027-mae-filhas-lendo-sofa-16",
    "Mãe e duas filhas no sofá folheando a agenda juntas",
    "A",
  ),
  portrait(
    "agenda-catolica-2027-pagina-julho-ilustracao-barco-04",
    "Agenda aberta na abertura de julho, com ilustração de um barco em aquarela",
    "A",
  ),
  landscape(
    "agenda-catolica-2027-color-cafe-bolo-vista-superior-20",
    "Vista de cima da agenda Color com caneta, café e fatia de bolo",
    "A",
  ),
  portrait(
    "agenda-catolica-2027-pagina-hoje-patos-agua-15",
    "Página diária com a frase Patos à água sendo preenchida à caneta",
    "A",
  ),
  portrait(
    "agenda-catolica-2027-color-capa-jardim-cafe-12",
    "Agenda Color sobre mesa branca no jardim, com taça, café e caneta",
    "A",
  ),
  landscape(
    "agenda-catolica-2027-color-capa-caneta-dourada-cafe-02",
    "Agenda Color fechada com caneta dourada ao lado de uma xícara de café",
    "A",
  ),
  portrait(
    "agenda-catolica-2027-pagina-marco-planejamento-semanal-09",
    "Páginas de março abertas com anotações, ao lado de café e caneta dourada",
    "A",
  ),
  portrait(
    "agenda-catolica-2027-familia-agenda-aberta-sofa-19",
    "Mãe e filhas sentadas no sofá com a agenda aberta",
    "A",
    true,
  ),
  portrait(
    "agenda-catolica-2027-color-capa-taca-caneta-06",
    "Agenda Color sobre mesa redonda com taça de água e caneta dourada",
    "A",
  ),
];

/** Column B, top to bottom. Same mix of heights, landscapes offset from A. */
const COLUMN_B: GalleryPhoto[] = [
  portrait(
    "agenda-catolica-2027-pagina-junho-paisagem-montanha-10",
    "Abertura de junho com paisagem de montanha em aquarela e caneta dourada",
    "B",
  ),
  landscape(
    "agenda-catolica-2027-color-capa-cafe-bolo-jogo-americano-24",
    "Agenda Color e caneta dourada ao lado de café e bolo sobre jogo americano",
    "B",
  ),
  portrait(
    "agenda-catolica-2027-pagina-hoje-escrita-mao-13",
    "Mão escrevendo na página diária Hoje, com a agenda Color ao fundo",
    "B",
  ),
  portrait(
    "agenda-catolica-2027-mae-filhas-folheando-agenda-17",
    "Mãe lê a agenda com as filhas no colo, em sala iluminada",
    "B",
    true,
  ),
  landscape(
    "agenda-catolica-2027-color-caneta-mesa-cafe-22",
    "Agenda Color com caneta dourada sobre a capa, ao lado de café e bolo",
    "B",
  ),
  portrait(
    "agenda-catolica-2027-pagina-junho-paisagem-cafe-11",
    "Agenda aberta em junho com ilustração de montanha e lago, ao lado de café",
    "B",
  ),
  portrait(
    "agenda-catolica-2027-color-capa-taca-caneta-variacao-07",
    "Agenda Color com caneta dourada e taça de água, em enquadramento semelhante",
    "B",
  ),
  landscape(
    "agenda-catolica-2027-color-mesa-posta-cafe-bolo-21",
    "Agenda Color sobre jogo americano com xícara de café e bolo",
    "B",
  ),
  portrait(
    "agenda-catolica-2027-pagina-escrita-caneta-dourada-23",
    "Mão escrevendo com caneta dourada em página de anotações da agenda",
    "B",
  ),
  portrait(
    "agenda-catolica-2027-familia-leitura-agenda-color-18",
    "Mãe e filhas sorridentes olhando as páginas da agenda",
    "B",
    true,
  ),
  portrait(
    "agenda-catolica-2027-pagina-hoje-escrita-cafe-14",
    "Pessoa preenchendo a página diária com ilustração de pato e café ao lado",
    "B",
  ),
  portrait(
    "agenda-catolica-2027-color-capa-espiral-dourado-detalhe-03",
    "Detalhe da capa da agenda Color com espiral dourado e xícara de café ao fundo",
    "B",
  ),
];

/** Lightbox order alternates the columns; each column keeps the list above. */
export const GALLERY_PHOTOS: GalleryPhoto[] = COLUMN_A.flatMap((photo, index) => [
  photo,
  COLUMN_B[index],
]);

export type GalleryColumnItem = { photo: GalleryPhoto; index: number };

export function galleryColumns(photos: readonly GalleryPhoto[]): {
  left: GalleryColumnItem[];
  right: GalleryColumnItem[];
} {
  const left: GalleryColumnItem[] = [];
  const right: GalleryColumnItem[] = [];
  photos.forEach((photo, index) => {
    (photo.column === "A" ? left : right).push({ photo, index });
  });
  return { left, right };
}
