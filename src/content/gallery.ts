/**
 * Photos of the test gallery (`/galeria-teste#fotos-reais`).
 *
 * Replace `src` / `alt` / `width` / `height` when real product photos arrive.
 * Width and height are the file's pixel size: the mosaic reserves that ratio
 * and PhotoSwipe uses it to zoom without a jump. Even indexes go to the left
 * column, odd indexes to the right.
 *
 * Nothing in the repo is a photograph of the printed agenda. The files below
 * are the existing cover and page renders, used only so the motion and the
 * lightbox can be tried. The section says so on the page.
 */
export type GalleryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const GALLERY_TITLE = "Fotos reais do produto";

export const GALLERY_LEAD =
  "Veja de perto a capa, as páginas e os detalhes da sua agenda.";

export const GALLERY_PLACEHOLDER_NOTE =
  "Imagens ilustrativas para testar a galeria; fotos reais em breve";

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: "/img/capa-color.webp",
    alt: "Ilustração da capa da Edição Color",
    width: 514,
    height: 634,
  },
  {
    src: "/img/agenda-diaria.webp",
    alt: "Ilustração da agenda aberta na página diária",
    width: 1045,
    height: 845,
  },
  {
    src: "/img/capa-classica.webp",
    alt: "Ilustração da capa da Edição Clássica",
    width: 472,
    height: 600,
  },
  {
    src: "/img/agenda-propositos-mes.webp",
    alt: "Ilustração da agenda aberta no propósito do mês",
    width: 1216,
    height: 861,
  },
  {
    src: "/img/planner-diario.webp",
    alt: "Ilustração do Planner Diário",
    width: 642,
    height: 472,
  },
  {
    src: "/img/agenda-planos-metas.webp",
    alt: "Ilustração da agenda aberta em planos e metas",
    width: 1178,
    height: 930,
  },
  {
    src: "/img/capa-solo.webp",
    alt: "Ilustração da capa da agenda, vista de frente",
    width: 360,
    height: 464,
  },
  {
    src: "/img/agenda-planejamento-financeiro.webp",
    alt: "Ilustração da agenda aberta no planejamento financeiro",
    width: 1145,
    height: 927,
  },
  {
    src: "/img/interna-vida-oracao.png",
    alt: "Ilustração da página de vida de oração",
    width: 1804,
    height: 2740,
  },
  {
    src: "/img/bloco-notas-color.webp",
    alt: "Ilustração do bloco de notas da Edição Color",
    width: 1036,
    height: 764,
  },
];

export type GalleryColumnItem = { photo: GalleryPhoto; index: number };

/** Left column is the even items, right column the odd ones. */
export function galleryColumns(photos: readonly GalleryPhoto[]): {
  left: GalleryColumnItem[];
  right: GalleryColumnItem[];
} {
  const left: GalleryColumnItem[] = [];
  const right: GalleryColumnItem[] = [];
  photos.forEach((photo, index) => {
    (index % 2 === 0 ? left : right).push({ photo, index });
  });
  return { left, right };
}
