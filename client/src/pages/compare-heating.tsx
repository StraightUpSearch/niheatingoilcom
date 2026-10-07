import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import {
  Flame, Zap, Droplets, Wind, ChevronRight, ChevronLeft,
  Home, Building2, ArrowRight, Info, CheckCircle, AlertTriangle, TrendingDown
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type FuelType = "kerosene" | "electric" | "heatpump" | "lpg";
type HouseType = "detached" | "semid" | "terraced" | "flat";
type Insulation = "poor" | "standard" | "excellent";

interface WizardState {
  fuel: FuelType | null;
  houseType: HouseType | null;
  bedrooms: number;
  postcode: string;
  insulation: Insulation | null;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const FUEL_CARDS: { id: FuelType; label: string; subtitle: string; icon: React.ReactNode; ni: string }[] = [
  {
    id: "kerosene",
    label: "Kerosene (Heating Oil)",
    subtitle: "Most common in NI",
    icon: <Flame className="w-7 h-7" />,
    ni: "~68% of NI homes",
  },
  {
    id: "heatpump",
    label: "Air Source Heat Pump",
    subtitle: "Low running cost",
    icon: <Wind className="w-7 h-7" />,
    ni: "Growing in NI",
  },
  {
    id: "electric",
    label: "Electric",
    subtitle: "No installation needed",
    icon: <Zap className="w-7 h-7" />,
    ni: "Storage heaters common",
  },
  {
    id: "lpg",
    label: "LPG",
    subtitle: "Off-grid alternative",
    icon: <Droplets className="w-7 h-7" />,
    ni: "Rural areas",
  },
];

const HOUSE_TYPES: { id: HouseType; label: string; icon: React.ReactNode }[] = [
  { id: "detached", label: "Detached", icon: <Home className="w-5 h-5" /> },
  { id: "semid", label: "Semi-detached", icon: <Home className="w-5 h-5" /> },
  { id: "terraced", label: "Terraced", icon: <Building2 className="w-5 h-5" /> },
  { id: "flat", label: "Flat", icon: <Building2 className="w-5 h-5" /> },
];

const INSULATION_CARDS: { id: Insulation; label: string; desc: string; tip: string }[] = [
  {
    id: "poor",
    label: "Poor",
    desc: "Single glazing, no loft insulation, solid walls",
    tip: "Older homes pre-1980 often fall here. Higher usage, larger bills.",
  },
  {
    id: "standard",
    label: "Standard",
    desc: "Double glazing, loft insulation, some draught-proofing",
    tip: "Most NI homes built after 1990. Average usage.",
  },
  {
    id: "excellent",
    label: "Excellent",
    desc: "Triple glazing, 270mm+ loft, cavity/external wall insulation",
    tip: "Well-retrofitted or new-build homes. Low usage.",
  },
];

// ─── Annual usage multipliers (litres for kerosene, kWh for electric) ─────────

function getUsageMultiplier(house: HouseType, bedrooms: number, insulation: Insulation): number {
  // Base kerosene litres/yr for 3-bed semi, standard insulation
  const base = 1200;
  const houseM: Record<HouseType, number> = { flat: 0.65, terraced: 0.8, semid: 1.0, detached: 1.3 };
  const bedM = 0.75 + bedrooms * 0.1;
  const insulM: Record<Insulation, number> = { poor: 1.35, standard: 1.0, excellent: 0.7 };
  return base * houseM[house] * bedM * insulM[insulation];
}

// ─── TCO data ─────────────────────────────────────────────────────────────────

function buildTcoData(
  fuelTypes: FuelType[],
  keroseneAnnual: number,
  electricAnnual: number,
  heatpumpAnnual: number,
  lpgAnnual: number,
  heatpumpUpfront: number,
): Array<{ year: number; kerosene?: number; electric?: number; heatpump?: number; lpg?: number }> {
  const costs: Record<FuelType, number> = {
    kerosene: keroseneAnnual,
    electric: electricAnnual,
    heatpump: heatpumpAnnual,
    lpg: lpgAnnual,
  };
  const upfront: Record<FuelType, number> = {
    kerosene: 200,   // annual service
    electric: 0,
    heatpump: heatpumpUpfront,
    lpg: 300,
  };
  return [0, 1, 5, 10, 15].map((year) => {
    const row: Record<string, number> = { year };
    fuelTypes.forEach((f) => {
      row[f] = Math.round(upfront[f] + costs[f] * year);
    });
    return row;
  });
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < step
                ? "bg-emerald-600 text-white"
                : i === step
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-8 transition-colors ${i < step ? "bg-emerald-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
      <span className="ml-2 text-xs text-gray-500">Step {step + 1} of {total}</span>
    </div>
  );
}

// ─── Step 1: Fuel type ────────────────────────────────────────────────────────

function StepFuel({ value, onChange }: { value: FuelType | null; onChange: (v: FuelType) => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">What fuel do you currently use — or want to compare?</h2>
      <p className="text-sm text-gray-500 mb-6">Select your current heating fuel or the one you are considering switching to.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FUEL_CARDS.map((f) => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              value === f.id
                ? "border-emerald-600 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <span className={`mt-0.5 ${value === f.id ? "text-emerald-600" : "text-gray-400"}`}>{f.icon}</span>
            <div>
              <p className={`font-semibold text-sm ${value === f.id ? "text-emerald-800" : "text-gray-900"}`}>{f.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.subtitle}</p>
              <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{f.ni}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Property ─────────────────────────────────────────────────────────

function StepProperty({
  houseType, bedrooms, postcode,
  onHouseType, onBedrooms, onPostcode,
}: {
  houseType: HouseType | null; bedrooms: number; postcode: string;
  onHouseType: (v: HouseType) => void; onBedrooms: (v: number) => void; onPostcode: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about your property</h2>
      <p className="text-sm text-gray-500 mb-6">This lets us estimate realistic annual costs for your home size.</p>

      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">House type</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {HOUSE_TYPES.map((h) => (
            <button
              key={h.id}
              onClick={() => onHouseType(h.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-xs font-medium transition-all ${
                houseType === h.id
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <span className={houseType === h.id ? "text-emerald-600" : "text-gray-400"}>{h.icon}</span>
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Number of bedrooms</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onBedrooms(n)}
              className={`w-10 h-10 rounded-lg border-2 text-sm font-bold transition-all ${
                bedrooms === n
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">BT postcode <span className="font-normal text-gray-400">(optional — for local price data)</span></p>
        <input
          type="text"
          value={postcode}
          onChange={(e) => onPostcode(e.target.value.toUpperCase())}
          placeholder="e.g. BT12 6AH"
          className="w-full sm:w-56 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
      </div>
    </div>
  );
}

// ─── Step 3: Insulation ───────────────────────────────────────────────────────

function StepInsulation({ value, onChange }: { value: Insulation | null; onChange: (v: Insulation) => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">How well-insulated is your home?</h2>
      <p className="text-sm text-gray-500 mb-6">Insulation has the biggest impact on annual heating costs.</p>
      <div className="space-y-3">
        {INSULATION_CARDS.map((ins) => (
          <button
            key={ins.id}
            onClick={() => onChange(ins.id)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              value === ins.id
                ? "border-emerald-600 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
              value === ins.id ? "border-emerald-600 bg-emerald-600" : "border-gray-300"
            }`} />
            <div>
              <p className={`font-semibold text-sm ${value === ins.id ? "text-emerald-800" : "text-gray-900"}`}>{ins.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{ins.desc}</p>
              <div className="flex items-start gap-1 mt-1.5">
                <Info className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500">{ins.tip}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Comparison results ───────────────────────────────────────────────────────

interface NISummary {
  cheapest: number;
  average: number;
  count: number;
}

function ComparisonResults({
  state,
  onReset,
}: {
  state: WizardState;
  onReset: () => void;
}) {
  const { data: niSummary } = useQuery<Record<number, NISummary>>({
    queryKey: ["/api/prices/ni-summary"],
    staleTime: 1000 * 60 * 30,
  });

  const [sortBy, setSortBy] = useState<"annual" | "upfront" | "tco10">("annual");
  const [grants, setGrants] = useState({ nihe: false, nisep: false, dfc: false });

  const house = state.houseType ?? "semid";
  const insulation = state.insulation ?? "standard";
  const usageLitres = getUsageMultiplier(house, state.bedrooms, insulation);

  // Kerosene annual cost from live prices
  const kerosenePpl = niSummary?.[500]
    ? niSummary[500].cheapest / 500
    : 0.72; // fallback p/litre
  const keroseneAnnual = Math.round(kerosenePpl * usageLitres);

  // Electric: ~30p/kWh, 1L kerosene ≈ 10kWh equiv, heat pump COP 3.2
  const electricAnnual = Math.round((usageLitres * 10 * 0.30));

  // Heat pump: same energy need / COP 3.2
  const heatpumpAnnual = Math.round((usageLitres * 10 * 0.30) / 3.2);
  const heatpumpUpfront = 10000;

  // LPG: ~£0.07/kWh equivalent
  const lpgAnnual = Math.round(usageLitres * 10 * 0.07);

  const activeFuels: FuelType[] = state.fuel
    ? [state.fuel, ...FUEL_CARDS.map((f) => f.id).filter((f) => f !== state.fuel)]
    : FUEL_CARDS.map((f) => f.id);

  const fuelData: Record<FuelType, { annual: number; upfront: number; tco10: number; label: string; colour: string }> = {
    kerosene: { annual: keroseneAnnual, upfront: 0, tco10: keroseneAnnual * 10, label: "Kerosene", colour: "#f97316" },
    electric: { annual: electricAnnual, upfront: 0, tco10: electricAnnual * 10, label: "Electric", colour: "#3b82f6" },
    heatpump: { annual: heatpumpAnnual, upfront: heatpumpUpfront, tco10: heatpumpUpfront + heatpumpAnnual * 10, label: "Heat Pump", colour: "#059669" },
    lpg: { annual: lpgAnnual, upfront: 0, tco10: lpgAnnual * 10, label: "LPG", colour: "#d97706" },
  };

  const sorted = [...activeFuels].sort((a, b) => fuelData[a][sortBy] - fuelData[b][sortBy]);

  const tcoChartData = buildTcoData(
    activeFuels,
    keroseneAnnual, electricAnnual, heatpumpAnnual, lpgAnnual, heatpumpUpfront,
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-60 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-4 lg:sticky lg:top-24">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sort results by</h3>
          {[
            { id: "annual" as const, label: "Annual running cost" },
            { id: "upfront" as const, label: "Upfront cost" },
            { id: "tco10" as const, label: "10-year total cost" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg mb-0.5 transition-colors ${
                sortBy === opt.id ? "bg-gray-900 text-white font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}

          <div className="mt-5 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">NI grant eligibility</h3>
            <p className="text-[11px] text-gray-400 mb-3">Toggle to see if grants reduce your costs</p>
            {[
              { id: "nihe" as const, label: "NIHE Affordable Warmth", desc: "Income &lt;£23k or disability" },
              { id: "nisep" as const, label: "NISEP Scheme", desc: "Income &lt;£28k" },
              { id: "dfc" as const, label: "DfC Oil Support", desc: "Income &lt;£30k or disability" },
            ].map((g) => (
              <label key={g.id} className="flex items-start gap-2 mb-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={grants[g.id]}
                  onChange={(e) => setGrants({ ...grants, [g.id]: e.target.checked })}
                  className="mt-0.5 accent-emerald-600"
                />
                <div>
                  <p className="text-xs font-medium text-gray-700 group-hover:text-gray-900">{g.label}</p>
                  <p className="text-[10px] text-gray-400" dangerouslySetInnerHTML={{ __html: g.desc }} />
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={onReset}
            className="mt-4 w-full text-xs text-gray-500 hover:text-gray-700 text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Start over
          </button>
        </div>
      </aside>

      {/* Cards + chart */}
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your heating cost comparison</h2>
          <p className="text-sm text-gray-500">
            Based on a {state.bedrooms}-bed {state.houseType ?? "home"} with {state.insulation ?? "standard"} insulation.
            {niSummary?.[500] && (
              <span className="ml-1">Using live NI oil price: {(niSummary[500].cheapest / 500 * 100).toFixed(1)}p/L.</span>
            )}
          </p>
        </div>

        {/* Heat pump UK BUS warning */}
        {activeFuels.includes("heatpump") && (
          <div className="flex items-start gap-3 p-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>UK Boiler Upgrade Scheme (BUS) is NOT available in Northern Ireland.</strong>{" "}
              NI homeowners should check NIHE Affordable Warmth, NISEP, and DfC schemes instead. Use the grant toggles on the left.
            </p>
          </div>
        )}

        {/* Comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {sorted.map((fuel, idx) => {
            const d = fuelData[fuel];
            const isSelected = fuel === state.fuel;
            const grantApplies = grants.nihe || grants.nisep || grants.dfc;
            const grantAmount = fuel === "heatpump" && grantApplies ? 3000 : fuel === "kerosene" && grants.dfc ? 200 : 0;
            return (
              <div
                key={fuel}
                className={`relative bg-white border-2 rounded-xl p-5 transition-all ${
                  isSelected ? "border-emerald-500 shadow-md shadow-emerald-100" : "border-gray-200"
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Your current fuel
                  </span>
                )}
                {idx === 0 && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded-full">
                    Cheapest {sortBy === "annual" ? "to run" : sortBy === "upfront" ? "to install" : "over 10 years"}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: d.colour }}>
                    {FUEL_CARDS.find((f) => f.id === fuel)?.icon}
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">{d.label}</span>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-extrabold text-gray-900">£{d.annual.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">/yr</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">estimated annual running cost</p>

                <div className="space-y-1.5 text-xs">
                  {d.upfront > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Typical install</span>
                      <span className="font-medium">~£{d.upfront.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">10-year total cost</span>
                    <span className="font-medium">£{d.tco10.toLocaleString()}</span>
                  </div>
                  {grantAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Potential grant</span>
                      <span className="font-semibold">-£{grantAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {fuel === "kerosene" && niSummary?.[500] && (
                  <p className="mt-3 text-[10px] text-green-700 font-medium">
                    Based on live NI best price: £{niSummary[500].cheapest.toFixed(2)} for 500L
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Savings insight */}
        {activeFuels.length > 1 && (() => {
          const cheapest = sorted[0];
          const expensive = sorted[sorted.length - 1];
          const annualSaving = fuelData[expensive].annual - fuelData[cheapest].annual;
          if (annualSaving <= 0) return null;
          return (
            <div className="flex items-start gap-3 p-4 mb-8 bg-green-50 border border-green-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">
                Switching from <strong>{fuelData[expensive].label}</strong> to{" "}
                <strong>{fuelData[cheapest].label}</strong> could save you around{" "}
                <strong>£{annualSaving.toLocaleString()}/year</strong> on running costs — £{(annualSaving * 10).toLocaleString()} over a decade.
              </p>
            </div>
          );
        })()}

        {/* TCO chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Cumulative total cost over time</h3>
          <p className="text-xs text-gray-500 mb-4">Includes install costs and annual running costs</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tcoChartData} margin={{ top: 4, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `yr ${v}`}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: number, name: string) => [`£${v.toLocaleString()}`, fuelData[name as FuelType]?.label ?? name]}
                labelFormatter={(l) => `Year ${l}`}
                contentStyle={{ fontSize: 11 }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              {activeFuels.map((fuel) => (
                <Line
                  key={fuel}
                  type="monotone"
                  dataKey={fuel}
                  stroke={fuelData[fuel].colour}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={fuelData[fuel].label}
                  isAnimationActive
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CTA */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Ready to compare live kerosene prices in your area?</p>
          <p className="text-xs text-gray-500 mb-4">See which suppliers cover your BT postcode, ranked cheapest first.</p>
          <Link
            href={state.postcode ? `/results?postcode=${encodeURIComponent(state.postcode)}&volume=500` : "/"}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Compare oil prices near me
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function CompareHeating() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [state, setState] = useState<WizardState>({
    fuel: null,
    houseType: null,
    bedrooms: 3,
    postcode: "",
    insulation: null,
  });

  const canNext = [
    !!state.fuel,
    !!state.houseType,
    !!state.insulation,
  ][step];

  const handleNext = () => {
    if (step === 2) { setDone(true); return; }
    setStep((s) => s + 1);
  };

  const handleReset = () => { setStep(0); setDone(false); setState({ fuel: null, houseType: null, bedrooms: 3, postcode: "", insulation: null }); };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "NI Heating Fuel Cost Comparison Tool",
    "description": "Compare annual running costs for kerosene, heat pumps, electric and LPG heating in Northern Ireland. Includes NI-specific grant information.",
    "url": "https://niheatingoil.com/compare-heating",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
        { "@type": "ListItem", "position": 2, "name": "Compare Heating Fuels", "item": "https://niheatingoil.com/compare-heating" },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="NI Heating Fuel Cost Comparison | Compare Kerosene, Heat Pumps & More"
        description="Compare annual heating costs for kerosene, air source heat pumps, electric, and LPG in Northern Ireland. Includes NI grant eligibility (NIHE, NISEP, DfC). Live oil prices."
        keywords="heating oil vs heat pump NI, kerosene vs electric heating Northern Ireland, NI heating costs, NIHE grant, NISEP grant, heat pump NI"
        canonicalUrl="https://niheatingoil.com/compare-heating"
        structuredData={structuredData}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">Compare Heating Fuels</span>
        </nav>

        {!done ? (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                NI Heating Fuel Cost Comparison
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Answer 3 questions to get a personalised estimate using live NI market prices.
              </p>
            </div>

            <ProgressBar step={step} total={3} />

            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              {step === 0 && (
                <StepFuel value={state.fuel} onChange={(v) => setState({ ...state, fuel: v })} />
              )}
              {step === 1 && (
                <StepProperty
                  houseType={state.houseType}
                  bedrooms={state.bedrooms}
                  postcode={state.postcode}
                  onHouseType={(v) => setState({ ...state, houseType: v })}
                  onBedrooms={(v) => setState({ ...state, bedrooms: v })}
                  onPostcode={(v) => setState({ ...state, postcode: v })}
                />
              )}
              {step === 2 && (
                <StepInsulation value={state.insulation} onChange={(v) => setState({ ...state, insulation: v })} />
              )}
            </div>

            <div className="flex items-center justify-between">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={handleNext}
                disabled={!canNext}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {step === 2 ? "Get comparison" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <ComparisonResults state={state} onReset={handleReset} />
        )}
      </main>

      <Footer />
    </div>
  );
}
