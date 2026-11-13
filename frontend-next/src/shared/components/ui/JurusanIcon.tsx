import {
  Aperture, BriefcaseBusiness, Brush, CakeSlice, Calculator, Camera, ChefHat, Clapperboard, Code, Coffee, CookingPot, Cpu, CreditCard, Croissant, Database, Factory, FileText, Film, FlaskConical, GitBranch, GraduationCap, Handshake, Landmark, Laptop, Leaf, Microscope, Package, Palette, PenTool, Printer, ScrollText, ShieldCheck, Smartphone, Sparkles, SprayCan, Store, Target, TrendingUp,
  type LucideIcon,
} from "lucide-react";

// Nama ikon yang tersimpan di data jurusan dipetakan ke komponen lucide.
const ICONS: Record<string, LucideIcon> = {
  Aperture,
  BriefcaseBusiness,
  Brush,
  CakeSlice,
  Calculator,
  Camera,
  ChefHat,
  Clapperboard,
  Code,
  Coffee,
  CookingPot,
  Cpu,
  CreditCard,
  Croissant,
  Database,
  Factory,
  FileText,
  Film,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Handshake,
  Landmark,
  Laptop,
  Leaf,
  Microscope,
  Package,
  Palette,
  PenTool,
  Printer,
  ScrollText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SprayCan,
  Store,
  Target,
  TrendingUp,
};

interface JurusanIconProps {
  name: string;
  size?: number;
  className?: string;
}

/** Ikon lucide berdasarkan nama yang disimpan di data jurusan. */
export default function JurusanIcon({ name, size = 18, className = "" }: JurusanIconProps) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
