/**
 * Where the planner cutout sits in its square.
 *
 * The selector measures the WooCommerce file (shadow included in the opaque
 * box) and scales the subject up. The cart shows the same file smaller, and
 * that scale clips the sheet on the right. `plannerPaperFocus` is the cart
 * placement: the drop shadow is ignored and the paper itself is centered.
 * Tuned in Chrome on the 300px rendition of planner-diario-semanal-1 so the
 * paper's left/right and top/bottom margins match within 1px at 72–112px.
 */

type Cover = {
  coverBox: { x: number; y: number; width: number; height: number };
  coverSize: { width: number; height: number };
};

type Focus = {
  x: number;
  y: number;
  width: number;
  height: number;
  fileAspect: number;
  scale?: number;
};

function coverFocus(cover: Cover): Focus {
  return {
    x: cover.coverBox.x / cover.coverSize.width,
    y: cover.coverBox.y / cover.coverSize.height,
    width: cover.coverBox.width / cover.coverSize.width,
    height: cover.coverBox.height / cover.coverSize.height,
    fileAspect: cover.coverSize.height / cover.coverSize.width,
  };
}

/** Selector thumb. Uses a measured subject box when the offer has one. */
export function plannerThumbFocus(e: Cover & {
  image: { bounds?: { aspect: number; x: number; y: number; width: number; height: number } } | null;
}): Focus {
  const measured = e.image?.bounds;
  // No measurement: the local cover box already describes that file. Scaling
  // it would move a different photo (the Woo cutout) by the wrong amount.
  if (!measured || measured.aspect <= 0) return coverFocus(e);
  const box = {
    x: measured.x,
    y: measured.y,
    width: measured.width,
    height: measured.height,
    fileAspect: 1 / measured.aspect,
  };
  const subjectW = box.fileAspect < 1 ? box.width : box.width * box.fileAspect;
  const subjectH = box.fileAspect < 1 ? box.height * box.fileAspect : box.height;
  const scale = subjectW > 0 && subjectH > 0 ? Math.min(0.88 / subjectW, 0.88 / subjectH) : 1;
  return { ...box, scale: Math.min(Math.max(scale, 1), 1.45) };
}

/**
 * Cart thumb. The paper's center in the 300×221 file, chosen so
 * `translate(4.40%, 3.60%)` puts that sheet in the middle of the square.
 */
export function plannerPaperFocus(image: { src: string } | null, cover: Cover): Focus {
  if (!image) return coverFocus(cover);
  const fileAspect = 221 / 300;
  const cx = 0.456;
  const cy = 0.45113;
  const width = 0.67667;
  const height = 0.70588;
  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height,
    fileAspect,
  };
}
