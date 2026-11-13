import type { ReactNode } from "react";
import {
  Award,
  BellRing,
  BookOpen,
  Bot,
  Briefcase,
  CalendarDays,
  Camera,
  ChefHat,
  CircleQuestionMark,
  ClipboardCheck,
  CodeXml,
  Clock,
  Coins,
  CookingPot,
  Factory,
  FingerprintPattern,
  FlaskConical,
  Flag,
  Gift,
  Handshake,
  Hourglass,
  KeyRound,
  Landmark,
  Laptop,
  Leaf,
  Lightbulb,
  Lock,
  Mail,
  Medal,
  Music,
  Newspaper,
  NotebookPen,
  Package,
  Palette,
  PencilLine,
  PenTool,
  PiggyBank,
  Puzzle,
  Rocket,
  ScrollText,
  Search,
  Shirt,
  ShoppingBag,
  Sprout,
  Stamp,
  Star,
  Trophy,
  Utensils,
  Volleyball,
  Wheat,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Ornamen dekoratif (coretan, bunga, roda gigi, dll.) untuk mengisi ruang kosong
 * di sekitar section. Warna mengikuti `currentColor`, jadi cukup diberi kelas
 * `text-*` — pakai warna emblem: biru (tint-strong/brand), kuning (sun), hijau (lime).
 * Murni hiasan: aria-hidden dan tidak menangkap klik.
 */

interface OrnamentProps {
  className?: string;
}

function Svg({ viewBox, className = "", children }: { viewBox: string; className?: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false" className={`pointer-events-none ${className}`}>
      {children}
    </svg>
  );
}

const PETAL_ANGLES = [0, 45, 90, 135];
const BURST_ANGLES = [-80, -40, 0, 40, 80];
const GEAR_TEETH = [0, 45, 90, 135, 180, 225, 270, 315];

/** Bunga delapan kelopak. */
export function OrnamentFlower({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <g fill="currentColor">
        {PETAL_ANGLES.map((angle) => (
          <ellipse key={angle} cx="50" cy="50" rx="13" ry="46" transform={`rotate(${angle} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="9" fill="white" opacity="0.55" />
    </Svg>
  );
}

/** Semburan garis pendek, seperti tanda "berkilau". */
export function OrnamentBurst({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <g stroke="currentColor" strokeWidth="11" strokeLinecap="round">
        {BURST_ANGLES.map((angle) => (
          <line key={angle} x1="50" y1="30" x2="50" y2="6" transform={`rotate(${angle} 50 70)`} />
        ))}
      </g>
    </Svg>
  );
}

/** Coretan lengkung besar yang masuk dari tepi kanan, berputar, lalu keluar lagi. */
export function OrnamentSquiggle({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 320 620" className={className}>
      <path
        d="M330 18C230 30 128 70 140 160C150 238 258 250 262 176C266 104 150 108 112 196C70 294 128 420 330 452"
        fill="none"
        stroke="currentColor"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Bintang empat sudut (kilau). */
export function OrnamentSparkle({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M50 0C54 34 66 46 100 50C66 54 54 66 50 100C46 66 34 54 0 50C34 46 46 34 50 0Z" fill="currentColor" />
    </Svg>
  );
}

/** Roda gigi, merujuk roda gigi pada emblem sekolah. */
export function OrnamentGear({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <g fill="currentColor">
        {GEAR_TEETH.map((angle) => (
          <rect key={angle} x="42" y="2" width="16" height="22" rx="4" transform={`rotate(${angle} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="16" />
    </Svg>
  );
}

/** Lingkaran garis. */
export function OrnamentRing({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" />
    </Svg>
  );
}

/** Dua cincin bertaut — simbol kemitraan. */
export function OrnamentLinkedRings({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 100 60" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="7">
        <circle cx="34" cy="30" r="25" />
        <circle cx="66" cy="30" r="25" />
      </g>
    </Svg>
  );
}

/** Rute putus-putus yang berakhir di pin lokasi. */
export function OrnamentRoute({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 200 120" className={className}>
      <path
        d="M8 108C52 108 46 44 96 52S150 104 180 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1 14"
      />
      <path d="M180 4a16 16 0 0 1 16 16c0 12-16 28-16 28s-16-16-16-28a16 16 0 0 1 16-16Z" fill="currentColor" />
      <circle cx="180" cy="20" r="6" fill="white" />
    </Svg>
  );
}

/** Garis zig-zag. */
export function OrnamentZigzag({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 120 40" className={className}>
      <polyline
        points="6,30 24,10 42,30 60,10 78,30 96,10 114,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Garis bergelombang. */
export function OrnamentWave({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 128 40" className={className}>
      <path d="M4 20Q19 4 34 20T64 20T94 20T124 20" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    </Svg>
  );
}

/** Topi toga wisuda. */
export function OrnamentCap({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 100 76" className={className}>
      <g fill="currentColor">
        <path d="M50 8 96 28 50 48 4 28Z" />
        <path d="M24 40v16c0 9 52 9 52 0V40L50 51Z" />
        <circle cx="88" cy="58" r="5" />
      </g>
      <path d="M88 32v24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

/** Balon percakapan dengan tiga titik. */
export function OrnamentBubble({ className }: OrnamentProps) {
  return (
    <Svg viewBox="0 0 100 92" className={className}>
      <path
        d="M16 6h68a12 12 0 0 1 12 12v38a12 12 0 0 1-12 12H42L24 86V68h-8A12 12 0 0 1 4 56V18A12 12 0 0 1 16 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <g fill="currentColor">
        <circle cx="32" cy="37" r="6" />
        <circle cx="50" cy="37" r="6" />
        <circle cx="68" cy="37" r="6" />
      </g>
    </Svg>
  );
}

/**
 * Ornamen bertema halaman (koran untuk berita, koper untuk BKK, piala untuk prestasi, dst.),
 * dibangun dari ikon garis lucide agar tebal garisnya selaras dengan ornamen garis di atas.
 * `h-auto` membuat tinggi mengikuti rasio viewBox, jadi cukup atur lebarnya dengan `w-*`.
 */
function lineOrnament(Icon: LucideIcon, name: string) {
  function LineOrnament({ className = "" }: OrnamentProps) {
    return <Icon aria-hidden="true" focusable="false" strokeWidth={2} className={`pointer-events-none h-auto ${className}`} />;
  }
  LineOrnament.displayName = `Ornament${name}`;
  return LineOrnament;
}

export const OrnamentAward = lineOrnament(Award, "Award");
export const OrnamentBell = lineOrnament(BellRing, "Bell");
export const OrnamentBook = lineOrnament(BookOpen, "Book");
export const OrnamentBot = lineOrnament(Bot, "Bot");
export const OrnamentBriefcase = lineOrnament(Briefcase, "Briefcase");
export const OrnamentCalendar = lineOrnament(CalendarDays, "Calendar");
export const OrnamentCamera = lineOrnament(Camera, "Camera");
export const OrnamentChefHat = lineOrnament(ChefHat, "ChefHat");
export const OrnamentChecklist = lineOrnament(ClipboardCheck, "Checklist");
export const OrnamentClock = lineOrnament(Clock, "Clock");
export const OrnamentCode = lineOrnament(CodeXml, "Code");
export const OrnamentCoins = lineOrnament(Coins, "Coins");
export const OrnamentCookingPot = lineOrnament(CookingPot, "CookingPot");
export const OrnamentFactory = lineOrnament(Factory, "Factory");
export const OrnamentFingerprint = lineOrnament(FingerprintPattern, "Fingerprint");
export const OrnamentFlag = lineOrnament(Flag, "Flag");
export const OrnamentFlask = lineOrnament(FlaskConical, "Flask");
export const OrnamentGift = lineOrnament(Gift, "Gift");
export const OrnamentHandshake = lineOrnament(Handshake, "Handshake");
export const OrnamentHourglass = lineOrnament(Hourglass, "Hourglass");
export const OrnamentKey = lineOrnament(KeyRound, "Key");
export const OrnamentLandmark = lineOrnament(Landmark, "Landmark");
export const OrnamentLaptop = lineOrnament(Laptop, "Laptop");
export const OrnamentLeaf = lineOrnament(Leaf, "Leaf");
export const OrnamentLightbulb = lineOrnament(Lightbulb, "Lightbulb");
export const OrnamentLock = lineOrnament(Lock, "Lock");
export const OrnamentMail = lineOrnament(Mail, "Mail");
export const OrnamentMedal = lineOrnament(Medal, "Medal");
export const OrnamentMusic = lineOrnament(Music, "Music");
export const OrnamentNewspaper = lineOrnament(Newspaper, "Newspaper");
export const OrnamentNotebook = lineOrnament(NotebookPen, "Notebook");
export const OrnamentPackage = lineOrnament(Package, "Package");
export const OrnamentPalette = lineOrnament(Palette, "Palette");
export const OrnamentPencil = lineOrnament(PencilLine, "Pencil");
export const OrnamentPenTool = lineOrnament(PenTool, "PenTool");
export const OrnamentPiggyBank = lineOrnament(PiggyBank, "PiggyBank");
export const OrnamentPuzzle = lineOrnament(Puzzle, "Puzzle");
export const OrnamentQuestion = lineOrnament(CircleQuestionMark, "Question");
export const OrnamentRocket = lineOrnament(Rocket, "Rocket");
export const OrnamentScroll = lineOrnament(ScrollText, "Scroll");
export const OrnamentSearch = lineOrnament(Search, "Search");
export const OrnamentShirt = lineOrnament(Shirt, "Shirt");
export const OrnamentShoppingBag = lineOrnament(ShoppingBag, "ShoppingBag");
export const OrnamentSprout = lineOrnament(Sprout, "Sprout");
export const OrnamentStamp = lineOrnament(Stamp, "Stamp");
export const OrnamentStar = lineOrnament(Star, "Star");
export const OrnamentTrophy = lineOrnament(Trophy, "Trophy");
export const OrnamentUtensils = lineOrnament(Utensils, "Utensils");
export const OrnamentVolleyball = lineOrnament(Volleyball, "Volleyball");
export const OrnamentWheat = lineOrnament(Wheat, "Wheat");
export const OrnamentWrench = lineOrnament(Wrench, "Wrench");
