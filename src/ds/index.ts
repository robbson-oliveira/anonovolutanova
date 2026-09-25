/**
 * Entrada pública do design system.
 *
 * As páginas importam daqui e de mais lugar nenhum. A pasta está estruturada
 * como um pacote: nada aqui dentro importa de fora do DS, então extrair para
 * `packages/ui` depois é mover a pasta, não refatorar.
 */

export { Container } from "@ds/primitives/Container";
export { Section } from "@ds/primitives/Section";
export { Heading, Text, Eyebrow } from "@ds/primitives/Text";
export { Button } from "@ds/primitives/Button";
export { Badge } from "@ds/primitives/Badge";
export { Card } from "@ds/primitives/Card";
export { Marquee } from "@ds/primitives/Marquee";
export { Carousel } from "@ds/primitives/Carousel";
export { Accordion, type AccordionItem } from "@ds/primitives/Accordion";
export { Tabs, type TabItem } from "@ds/primitives/Tabs";
export {
  EditionSelector,
  type EditionOption,
} from "@ds/primitives/EditionSelector";
export { BookCover } from "@ds/primitives/BookCover";

export { Reveal, RevealGroup, REVEAL_READY_SCRIPT } from "@ds/motion/Reveal";
export { Counter } from "@ds/motion/Counter";

export { cn } from "@ds/utils/cn";

export {
  IconBase,
  type IconProps,
  IconSparkle,
  IconArrowRight,
  IconCheck,
  IconPlus,
  IconMinus,
  IconChevronLeft,
  IconChevronRight,
  IconStar,
  IconAccount,
  IconClose,
  IconAsterisk,
  IconGiftBox,
  IconMail,
  IconPhone,
  IconCalendar,
  IconBasket,
  IconLock,
  IconMapPin,
  IconPackage,
  IconCreditCard,
  IconPix,
  IconArrowLeft,
  IconChevronUp,
  IconOitavario,
  IconNovenaImaculada,
  IconSeteDomingosSaoJose,
  IconAniversarios,
  IconTrisagio,
  IconOutrasDatas,
} from "@ds/icons";
