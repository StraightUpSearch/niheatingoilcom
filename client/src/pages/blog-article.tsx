import { useParams } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { ArrowLeft, Clock, Calendar, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const articles: Record<string, {
  title: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  content: string;
}> = {
  "cheapest-time-buy-heating-oil-northern-ireland": {
    title: "When Is the Cheapest Time to Buy Heating Oil in Northern Ireland?",
    category: "Buying Guide",
    author: "NI Heating Oil Team",
    publishDate: "2026-09-14",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=600&fit=crop&crop=center",
    content: `
      <p>If you heat your home with oil in Northern Ireland, when you buy matters almost as much as where you buy. The difference between filling your tank at the right time and the wrong time can easily be £80–£150 on a standard 500-litre order.</p>

      <p>Here's a month-by-month breakdown of what to expect and when to act.</p>

      <h2>May to August: The Cheapest Window</h2>
      <p>Heating oil demand drops sharply once the weather warms up. Suppliers still have fuel to shift, so competition for orders is stronger and per-litre prices tend to sit at their lowest point of the year.</p>

      <p>If you have a 500L or 900L tank, filling it between May and August is the single most effective way to cut your annual heating bill. You're buying when most people aren't thinking about oil at all — and that's exactly why it's cheaper.</p>

      <p>Historically, June and July have been the cheapest months in Northern Ireland, though the exact low point varies year to year depending on global crude oil prices and currency movements.</p>

      <h2>September to October: Prices Start to Climb</h2>
      <p>As autumn approaches, homeowners start checking their tank levels and placing orders. Demand rises, and so do prices. September is still reasonable in most years — but by October, the seasonal markup is noticeable.</p>

      <p>If you missed the summer window, September is your last chance to buy at relatively low prices before winter demand kicks in fully.</p>

      <h2>November to February: Peak Pricing</h2>
      <p>This is the most expensive period. Everyone needs oil, cold snaps create sudden demand spikes, and suppliers have less room to negotiate. Prices in January are typically 10–20% higher than the June low.</p>

      <p>If your tank runs low in mid-winter, you have no choice but to pay the going rate. That's why the best strategy isn't just about timing — it's about having a tank large enough to avoid being forced to buy at peak prices.</p>

      <h2>March to April: Prices Ease Off</h2>
      <p>As temperatures rise and heating demand fades, prices start dropping again. March can still be expensive if winter was harsh, but by April you're usually back into reasonable territory.</p>

      <h2>What Actually Drives NI Heating Oil Prices?</h2>
      <p>Local supply and demand set the seasonal pattern, but the underlying price is driven by global factors:</p>
      <ul>
        <li><strong>Crude oil prices</strong> — kerosene tracks Brent crude. When crude rises, heating oil follows within days.</li>
        <li><strong>GBP/USD exchange rate</strong> — oil is traded in dollars. A weaker pound means higher prices in the UK, even if crude hasn't moved.</li>
        <li><strong>OPEC production decisions</strong> — output cuts tighten supply globally and push prices up.</li>
        <li><strong>Weather</strong> — an unexpectedly cold spell in Europe increases demand for heating fuels across the board.</li>
      </ul>

      <h2>Practical Steps to Pay Less</h2>
      <ol>
        <li><strong>Fill your tank in summer</strong> — the single biggest saving available to you.</li>
        <li><strong>Compare prices every time</strong> — supplier pricing varies significantly. Use our <a href="/" style="color:#2563eb;">price comparison tool</a> before every order.</li>
        <li><strong>Don't let your tank run empty</strong> — keep at least 25% capacity so you can wait for a dip rather than buying in a panic.</li>
        <li><strong>Set up price alerts</strong> — get notified when prices drop in your postcode area.</li>
        <li><strong>Consider a larger tank</strong> — a 900L tank lets you buy once a year at the best price, instead of three or four orders spread across the calendar.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>Buy in summer if you can, avoid January if you can, and always compare suppliers. Those three habits alone will save you real money every year — no complicated strategy needed.</p>
    `
  },

  "find-best-heating-oil-prices-northern-ireland": {
    title: "How to Find the Best Heating Oil Prices in Northern Ireland",
    category: "Comparison Guide",
    author: "NI Heating Oil Team",
    publishDate: "2026-09-14",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&crop=center",
    content: `
      <p>Northern Ireland has dozens of heating oil suppliers, and on any given day the price difference between the cheapest and most expensive can be £40–£80 for a 500-litre order. Finding the best price isn't complicated, but most households don't do it — and that costs real money over time.</p>

      <h2>Why Prices Vary Between Suppliers</h2>
      <p>Heating oil suppliers set their own prices based on several factors: their wholesale purchase price, delivery costs (which depend on distance from their depot to your door), how full their delivery schedule is, and how aggressively they're competing for orders at that moment.</p>

      <p>A supplier based in Ballymena may be significantly cheaper for a delivery to Antrim than a supplier based in Newry — simply because of the route. Equally, a supplier trying to fill their tanker schedule on a quiet Tuesday might drop their per-litre price to attract orders.</p>

      <p>The upshot: prices change often, and the cheapest supplier last month may not be the cheapest today.</p>

      <h2>How to Compare Prices Properly</h2>
      <p>The most reliable way to compare is to check multiple suppliers for the same volume and delivery area at the same time. Here's the practical approach:</p>

      <ol>
        <li><strong>Use a comparison tool</strong> — enter your BT postcode and the volume you need on our <a href="/" style="color:#2563eb;">price comparison page</a>. You'll see live prices from suppliers that deliver to your area, ranked cheapest first.</li>
        <li><strong>Compare total cost, not just per-litre price</strong> — some suppliers quote excluding VAT, others including. Some add a delivery charge. Always look at the total you'll actually pay.</li>
        <li><strong>Check before every order</strong> — supplier rankings shift week to week. The five minutes it takes to compare before each purchase will save you more over a year than almost any other household economy.</li>
      </ol>

      <h2>What About Phone Quotes?</h2>
      <p>Calling suppliers directly still works, but it's slow and you'll rarely call more than two or three before settling on one. Online comparison lets you see ten or more suppliers instantly, side by side, for your exact postcode and volume. Use the phone to confirm or negotiate after you've identified the best online price.</p>

      <h2>Bulk Orders and Group Buying</h2>
      <p>Per-litre prices drop with larger orders. The jump from 300L to 500L typically saves 2–4p per litre. If you have a 900L tank, filling it in one go gives you the best per-litre rate available.</p>

      <p>Community buying groups — where neighbours pool orders to negotiate bulk rates — can push prices even lower. A group ordering 3,000–5,000 litres together has genuine bargaining power. Ask around locally or check community Facebook groups; several exist across NI.</p>

      <h2>Timing Matters Too</h2>
      <p>The cheapest prices tend to appear between May and August when demand is low. January and February are typically the most expensive months. If your tank allows it, buying in summer for winter use is the most straightforward way to save.</p>

      <p>Read our <a href="/blog/cheapest-time-buy-heating-oil-northern-ireland" style="color:#2563eb;">guide to the cheapest time to buy</a> for a detailed month-by-month breakdown.</p>

      <h2>Price Alerts Save Effort</h2>
      <p>If you don't want to check prices manually every week, set up a price alert. When prices in your area drop below a level you're comfortable with, you'll get a notification and can order at the right moment without any ongoing effort.</p>

      <h2>Summary</h2>
      <p>Compare every time you order. Buy larger volumes when you can. Time your purchases for summer if possible. And never assume your usual supplier is still the cheapest — check the numbers. These habits don't take much time, and the savings add up quickly.</p>
    `
  },

  "heating-oil-tank-sizes": {
    title: "Heating Oil Tank Sizes in Northern Ireland: Comparing 300L, 500L, and 900L Options",
    category: "Equipment Guide",
    author: "NI Heating Oil Team",
    publishDate: "2025-06-03",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=600&fit=crop&crop=center",
    content: `
      <p>Choosing the right heating oil tank is one of those decisions that doesn't feel urgent until it's too late — you're running on fumes in January and the next delivery is three days away. Getting the size right from the start saves money, hassle, and those 3am panics when the boiler cuts out.</p>

      <p>Here's everything you need to know about the three most common tank sizes in Northern Ireland.</p>

      <h2>The 300-Litre Tank</h2>
      <p>A 300L tank is the smallest practical option for home heating. It suits flats, small terraced houses, or properties where outdoor space is tight. The tank itself is compact — typically around 900mm wide — so it can fit in places a larger tank simply can't.</p>

      <p><strong>The downside?</strong> You'll be ordering deliveries far more often. Most NI suppliers have a minimum drop of 200–500 litres, so a 300L tank leaves you with little buffer. If prices spike in winter (and they do), you're forced to buy at the worst possible time because you simply can't wait.</p>

      <p>A 300L tank works well if you supplement with other heating sources, use heating oil only seasonally, or live somewhere that keeps fuel consumption genuinely low. For a full-time family home, it's rarely the right call.</p>

      <h2>The 500-Litre Tank</h2>
      <p>The 500L tank is the most common choice for semi-detached and detached homes across Northern Ireland. It hits a reasonable balance: enough capacity to take advantage of bulk pricing, small enough to fit in most gardens without dominating the space.</p>

      <p>A typical three-bedroom NI home burns through roughly 1,000–1,500 litres per year, depending on insulation, how warm you keep the house, and whether you're working from home. A 500L tank means two or three deliveries a year — manageable, and you can time at least one of them for summer when prices are usually lower.</p>

      <p>Most suppliers offer their best per-litre pricing at 500L orders, which aligns nicely with a full tank refill. You're not leaving any price advantage on the table.</p>

      <h2>The 900-Litre Tank</h2>
      <p>If you have the space and a larger home, a 900L tank changes the economics considerably. You can fill it once in spring or early summer at the year's lowest prices, then coast through winter without a single top-up delivery. That's one delivery a year, not three.</p>

      <p>Larger tanks also mean you're never in the position of having to order because you're running low, regardless of what prices are doing. That flexibility is worth real money over time.</p>

      <p>The practical considerations: a 900L tank is substantial. You'll need a solid base — typically a concrete pad — and clear access for the tanker. Some properties simply don't have the space, and garden aesthetics matter to many people. Bunded tanks (a tank within a tank, required in many locations under NI environmental regulations) add further to the overall footprint.</p>

      <h2>Bunded vs Single-Skin Tanks</h2>
      <p>Worth mentioning here because it affects size and cost: NI regulations increasingly require bunded tanks, especially near watercourses, drains, or in areas with a higher environmental risk. A bunded tank has an outer shell that contains any leak, preventing ground or water contamination.</p>

      <p>Bunded tanks cost more upfront — typically £150–£350 extra — but they're often legally required and reduce your liability significantly. If you're replacing an old single-skin tank, check with your supplier whether a bunded version is needed for your site.</p>

      <h2>Quick Comparison</h2>
      <table style="width:100%;border-collapse:collapse;margin:1.5rem 0;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:0.75rem;text-align:left;border:1px solid #e5e7eb;">Tank Size</th>
            <th style="padding:0.75rem;text-align:left;border:1px solid #e5e7eb;">Best For</th>
            <th style="padding:0.75rem;text-align:left;border:1px solid #e5e7eb;">Deliveries/Year</th>
            <th style="padding:0.75rem;text-align:left;border:1px solid #e5e7eb;">Typical Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">300L</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">Flats, small homes, supplementary heating</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">4–6+</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">£300–£500</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">500L</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">Semi-detached / detached family homes</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">2–3</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">£450–£700</td>
          </tr>
          <tr>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">900L</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">Larger homes, farm properties, maximum flexibility</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">1–2</td>
            <td style="padding:0.75rem;border:1px solid #e5e7eb;">£700–£1,100</td>
          </tr>
        </tbody>
      </table>
      <p style="font-size:0.875rem;color:#6b7280;">Prices are approximate and include installation. Bunded versions add roughly £150–£350. Get at least two quotes before committing.</p>

      <h2>What to Do Before You Buy</h2>
      <p>Measure your available space carefully, check access for a delivery tanker (they need to get within about 30 metres of the tank), and confirm whether a bunded tank is required for your site. Then get quotes from at least two installers — prices vary considerably across Northern Ireland.</p>

      <p>Once your tank is in place, compare oil prices before every delivery using our <a href="/" style="color:#2563eb;">price comparison tool</a> to make sure you're not overpaying on the fuel itself.</p>
    `
  },

  "best-time-buy-heating-oil-northern-ireland": {
    title: "Best Time to Buy Heating Oil in NI: Key Tips for Saving Money",
    category: "Money Saving",
    author: "NI Heating Oil Team",
    publishDate: "2025-06-02",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop&crop=center",
    content: `
      <p>Heating oil prices in Northern Ireland move with global oil markets, and those markets don't stand still. The difference between buying at the right time and the wrong time can be £100–£200 on a 500-litre order — real money over the course of a year.</p>

      <p>Here's how to think about timing your purchases.</p>

      <h2>Summer Is Usually the Cheapest Time</h2>
      <p>The pattern isn't guaranteed — global events can upend everything — but as a general rule, heating oil is cheaper in the warmer months. The reason is simple: demand drops when people aren't heating their homes, so suppliers compete harder for the orders they do get.</p>

      <p>June, July, and August have historically offered the best prices in NI. If you have a large enough tank (500L or above), filling it in summer for winter use is the single most reliable way to reduce your annual heating costs. You're buying when nobody else wants it.</p>

      <h2>Avoid January and February If You Can</h2>
      <p>These are the worst months to be shopping for heating oil. Demand is at its peak, everyone's scrambling to top up, and suppliers know it. Prices are typically 5–15% higher than summer levels, and delivery slots get booked up fast in cold snaps.</p>

      <p>The households that suffer most are those with small tanks who have no choice but to buy in winter. If that's you, the long-term answer is a larger tank. In the short term, setting up price alerts (through your account on this site) means you catch any temporary dips that do occur.</p>

      <h2>Watch the Oil Price Indices</h2>
      <p>NI heating oil prices broadly track the wholesale price of kerosene, which tracks crude oil. When news breaks about OPEC production decisions, geopolitical instability in oil-producing regions, or significant currency movements (GBP/USD matters because oil trades in dollars), expect prices to move within days.</p>

      <p>You don't need to become an oil trader. Just pay loose attention to fuel news, and if prices have risen sharply, wait a few weeks before ordering if your tank level allows. If prices have dropped, order sooner rather than later.</p>

      <h2>Compare Prices Every Time</h2>
      <p>This one's straightforward but often overlooked: prices vary significantly between suppliers even on the same day for the same postcode. The difference between the cheapest and most expensive supplier for a 500L order is regularly £40–£80.</p>

      <p>Use our <a href="/" style="color:#2563eb;">price comparison tool</a> every time you order. It takes 30 seconds and frequently saves you a meaningful amount. Loyalty to one supplier, without checking competitors, is expensive loyalty.</p>

      <h2>Order in Bulk Where Possible</h2>
      <p>Suppliers charge less per litre for larger orders. The jump in per-litre price between a 300L order and a 500L order is often 2–4p per litre. At 500 litres, that's £10–£20 saved just by ordering more in one go.</p>

      <p>If your tank is genuinely too small to take advantage of this, consider whether upgrading to a 500L or 900L tank makes financial sense over the medium term. The tank pays for itself faster than most people expect.</p>

      <h2>Consider a Community Buying Group</h2>
      <p>Several areas across Northern Ireland have informal or formal oil buying groups, where neighbours pool their orders to negotiate bulk rates. If one exists in your area, joining is usually free and the savings are real. If one doesn't exist, starting one is simpler than it sounds — a WhatsApp group and a willing organiser is all it takes.</p>

      <h2>The Simplest Rule</h2>
      <p>Keep your tank at least a quarter full throughout winter, so you always have the option to wait a few days for a better price. Never let it run dry — emergency deliveries cost more, and some suppliers charge a call-out fee. Fill up in summer when you can. And always compare prices before you order.</p>
    `
  },

  "how-to-dispose-heating-oil-northern-ireland": {
    title: "How to Properly Dispose of Home Heating Oil in N.Ireland: Safe and Legal Methods",
    category: "Safety Guide",
    author: "NI Heating Oil Team",
    publishDate: "2025-06-01",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=600&fit=crop&crop=center",
    content: `
      <p>Old, contaminated, or surplus heating oil isn't something you can just tip down a drain or leave in a skip. In Northern Ireland, improper disposal of oil is a criminal offence under the Water (Northern Ireland) Order 1999, and the fines are significant. More importantly, even a small amount of oil can contaminate a large volume of groundwater.</p>

      <p>Here's how to handle it legally and safely.</p>

      <h2>Can You Still Use Old Heating Oil?</h2>
      <p>First, check whether the oil is actually unusable. Heating oil (kerosene) stored properly in a clean tank has a shelf life of several years. If it looks clear or pale yellow and doesn't have a strong sour smell, it may still be perfectly usable.</p>

      <p>Have it tested if you're unsure — some oil suppliers and labs will test a sample cheaply. Reusing good oil is always the best outcome: no disposal hassle, no cost.</p>

      <p>Oil that has degraded, been contaminated with water, or turned dark and cloudy is a different matter and needs proper disposal.</p>

      <h2>Contact a Licensed Waste Carrier</h2>
      <p>The primary route for disposing of heating oil in Northern Ireland is through a licensed waste carrier. These are companies registered with the Northern Ireland Environment Agency (NIEA) to handle hazardous waste. They will collect the oil and take it to an authorised facility for recycling or safe disposal.</p>

      <p>To verify a carrier is licensed, check the NIEA's public register. Using an unlicensed carrier doesn't remove your legal liability — if they dump the oil illegally, you can still face prosecution.</p>

      <p>Expect to pay for this service. Collection costs vary by volume and location, but budgeting £50–£150 for a tank removal is typical.</p>

      <h2>Your Supplier May Take It Back</h2>
      <p>If you're switching suppliers or decommissioning a tank, it's worth calling your current or previous supplier to ask whether they'll remove the remaining oil. Some will buy it back at a reduced rate if it's still usable. Others will arrange disposal as part of a tank removal service.</p>

      <p>This is often the cheapest and simplest route, so always ask before going elsewhere.</p>

      <h2>Household Recycling Centres</h2>
      <p>Most NI councils operate household recycling centres (HRCs) that accept small quantities of waste oil. These accept cooking oil and engine oil, and some will take heating oil in small quantities — but policies vary by council and site.</p>

      <p>Call your local council before making a trip. Bring the oil in a sealed, clearly labelled container. Do not mix it with other liquids.</p>

      <p>For large volumes (anything over about 25 litres), HRCs are unlikely to help — you'll need a licensed collector.</p>

      <h2>What You Must Never Do</h2>
      <ul style="margin:1rem 0;padding-left:1.5rem;">
        <li style="margin-bottom:0.5rem;">Pour oil down a drain, sink, or toilet — this is illegal and causes serious damage to sewage systems and waterways</li>
        <li style="margin-bottom:0.5rem;">Pour oil onto soil or into a compost bin — oil is persistent in soil and can leach into groundwater</li>
        <li style="margin-bottom:0.5rem;">Burn the oil yourself unless you have appropriate equipment — burning oil improperly produces toxic fumes</li>
        <li style="margin-bottom:0.5rem;">Put it in general waste or a skip — oil is classified as hazardous waste and doesn't belong with general rubbish</li>
        <li style="margin-bottom:0.5rem;">Give it to an unlicensed collector — you remain liable for how it's ultimately disposed of</li>
      </ul>

      <h2>Decommissioning a Tank</h2>
      <p>If you're removing an old tank entirely, hire a professional tank cleaning and removal company. They will drain any remaining oil, clean out sludge (which can be more hazardous than the oil itself), remove the tank, and dispose of everything legally. Many also provide a waste transfer note, which is your legal proof that disposal was handled correctly.</p>

      <p>Keep that waste transfer note. If a question ever arises about the disposal, it's your evidence that you acted legally and responsibly.</p>

      <h2>Reporting a Spill</h2>
      <p>If oil has already escaped — from a tank leak, a delivery spillage, or an accident — contact the NIEA Pollution Hotline immediately on <strong>0800 807 060</strong> (available 24 hours). Early reporting reduces both environmental damage and your legal exposure. Don't try to clean up a significant spill yourself; containment before specialist help can make things worse.</p>
    `
  },

  "heating-oil-tank-maintenance-guide": {
    title: "Heating Oil Tank Maintenance Guide for Northern Ireland Homes",
    category: "Maintenance",
    author: "NI Heating Oil Team",
    publishDate: "2025-05-30",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=600&fit=crop&crop=center",
    content: `
      <p>A well-maintained heating oil tank can last 20–25 years. A neglected one can fail in 10, and the consequences range from an expensive replacement to a serious environmental incident with legal implications. Regular maintenance is genuinely worth doing.</p>

      <p>This guide covers what to check, when to check it, and when to call a professional.</p>

      <h2>Annual Visual Inspection</h2>
      <p>Once a year — late summer or early autumn is ideal, before the winter heating season — walk around your tank and look carefully at the following:</p>

      <h3>The Tank Body</h3>
      <p>Look for any signs of rust, discolouration, or physical damage. On steel tanks, surface rust is common and manageable; rust that has eaten through the tank wall is not. Any holes, cracks, or significant corrosion means the tank needs replacing.</p>

      <p>For plastic (polyethylene) tanks — now the most common type in NI — look for cracks, crazing (a network of fine surface cracks), or any distortion in the tank's shape. UV exposure degrades plastic over time, which is why tanks should be positioned out of direct sunlight where possible or fitted with a UV-resistant coating.</p>

      <h3>The Legs and Base</h3>
      <p>The tank must sit on a stable, level base. Check that the legs (on legged tanks) haven't corroded or sunk, and that a concrete or paved base hasn't cracked or subsided. An unstable tank puts stress on pipework and fittings, eventually causing leaks.</p>

      <h3>Pipework and Fittings</h3>
      <p>Trace the oil supply pipe from the tank to the boiler. Look for any signs of oil residue, staining, or dampness along the pipe route — these suggest a slow leak. Check all joints and connections for tightness. Pay particular attention to the filter housing and any flexible connectors, which are common failure points.</p>

      <h3>The Fill Point and Vent</h3>
      <p>The fill point (where deliveries are pumped in) should have a secure cap. The vent pipe (which allows air in as oil is used) should be clear and unobstructed — a blocked vent can cause the tank to collapse inward. Both should be accessible to delivery drivers without obstruction.</p>

      <h2>Checking for Water Contamination</h2>
      <p>Water in your heating oil is a common problem and a significant one. Water sinks to the bottom of the tank and corrodes it from the inside. It also grows bacterial sludge that blocks filters and damages boilers.</p>

      <p>Use a water-finding paste (available from plumbing suppliers) on a dipstick. Apply paste to the end of the stick, lower it to the tank bottom, and withdraw it. If the paste changes colour (usually from yellow to red), water is present.</p>

      <p>Small amounts of water can be treated with an oil additive that disperses it. Larger amounts need draining by a professional. If sludge has formed, a tank clean is necessary.</p>

      <h2>The Oil Filter</h2>
      <p>Most heating systems have an oil filter between the tank and the boiler. Check and replace this annually, or more often if you notice your boiler firing up poorly or cutting out. A blocked filter is one of the most common causes of boiler problems in NI homes, and it's one of the cheapest fixes.</p>

      <p>Filters cost a few pounds and take minutes to replace. Don't neglect them.</p>

      <h2>Bunded Tank Checks</h2>
      <p>If you have a bunded tank (a tank within a tank), the outer bund is designed to catch leaks from the inner tank. Check the sight glass or inspection point on the bund — if there's oil in the outer bund, the inner tank is leaking and needs immediate attention.</p>

      <p>Do not pump oil out of the bund yourself. Contact a licensed contractor who can assess the inner tank and dispose of any bund contents legally.</p>

      <h2>Winter Preparation</h2>
      <p>Before the cold weather arrives:</p>
      <ul style="margin:1rem 0;padding-left:1.5rem;">
        <li style="margin-bottom:0.5rem;">Top up to at least half-full — running low in a cold snap means waiting for a delivery slot that may not come quickly</li>
        <li style="margin-bottom:0.5rem;">Check that the area around the tank will stay accessible for delivery tankers even in ice or snow</li>
        <li style="margin-bottom:0.5rem;">Lag any exposed pipework to prevent freezing — a frozen oil line means no heating</li>
        <li style="margin-bottom:0.5rem;">Clear any vegetation that has grown around the tank over summer; overgrowth holds moisture and accelerates corrosion</li>
      </ul>

      <h2>When to Call a Professional</h2>
      <p>Some things should not be DIY. Call a qualified technician if you find:</p>
      <ul style="margin:1rem 0;padding-left:1.5rem;">
        <li style="margin-bottom:0.5rem;">Any active leak or oil staining on the ground</li>
        <li style="margin-bottom:0.5rem;">Significant corrosion or structural damage to the tank</li>
        <li style="margin-bottom:0.5rem;">Oil in the bund of a bunded tank</li>
        <li style="margin-bottom:0.5rem;">Sludge buildup requiring a professional tank clean</li>
        <li style="margin-bottom:0.5rem;">Any work on the oil supply pipe or boiler connections</li>
      </ul>

      <p>Oil tank work in Northern Ireland should be carried out by OFTEC (Oil Firing Technical Association) registered technicians, who are trained and insured for this type of work.</p>

      <h2>Tank Lifespan and Replacement</h2>
      <p>A plastic bunded tank installed today should last 20–25 years with reasonable care. Older steel tanks that have been in place for more than 15–20 years warrant careful assessment — even if they look fine externally, internal corrosion may have progressed significantly.</p>

      <p>If in doubt, a qualified OFTEC technician can assess whether your tank has meaningful life left or whether replacement is the sensible call. A proactive replacement on your terms is considerably less disruptive than an emergency failure.</p>
    `
  },

  "how-to-save-money-heating-oil": {
    title: "How to Save Money on Heating Oil: Expert Tips for Northern Ireland Homeowners",
    category: "Money Saving",
    author: "NI Heating Oil Team",
    publishDate: "2025-05-28",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&h=600&fit=crop&crop=center",
    content: `
      <p>Heating oil is one of the larger household bills for the roughly 68% of rural Northern Ireland homes that depend on it. Unlike gas, there's no network tariff — you're buying from a competitive market, which means the decisions you make genuinely affect what you pay.</p>

      <p>Here are the most effective ways to reduce your annual heating oil spend.</p>

      <h2>1. Always Compare Prices Before You Order</h2>
      <p>This is the single most impactful thing you can do. Prices between suppliers for the same postcode on the same day routinely vary by 4–6p per litre. On a 500-litre order, that's £20–£30 saved in about 30 seconds of comparison.</p>

      <p>Use our <a href="/" style="color:#2563eb;">price comparison tool</a> every single time you order. Don't assume your usual supplier is competitive — they may have been last time and not this time. There's no loyalty bonus in the heating oil market; comparison is just part of the routine.</p>

      <h2>2. Order in Summer</h2>
      <p>Demand is low from April to September, and prices usually follow. Filling your tank in May or June for the following winter often saves 5–12p per litre compared to January prices. On 500 litres, that's £25–£60 in real savings for doing nothing other than ordering earlier.</p>

      <p>You need a tank large enough to make this worthwhile — a 300L tank doesn't store enough to meaningfully pre-buy. If you're on a small tank and heating costs are a concern, upgrading to a 500L is worth considering.</p>

      <h2>3. Order More Per Delivery</h2>
      <p>Suppliers price per litre, and bigger orders get cheaper per-litre rates. The discount between a 300-litre order and a 500-litre order is typically 2–5p per litre. At 500 litres, that's £10–£25 saved just by ordering more in one go.</p>

      <p>This only works if you actually have the tank capacity. But if you're regularly ordering 300L into a 500L tank, you're leaving money on the table twice: once on the per-litre rate, and once on delivery costs spread over more trips.</p>

      <h2>4. Join or Start a Buying Group</h2>
      <p>Buying groups — where neighbours pool orders to negotiate better prices — are more common in rural NI than most people realise. A group ordering 5,000+ litres can often negotiate 3–6p per litre below the going market rate.</p>

      <p>If a group already operates in your area, joining is usually straightforward. If not, starting one takes very little effort: a group chat, a willing coordinator, and a phone call to a few suppliers asking for a bulk rate. Parish newsletters, community Facebook groups, and local noticeboards are effective ways to recruit neighbours.</p>

      <h2>5. Keep the Tank Topped Up (Slightly)</h2>
      <p>Running your tank very low forces you to order regardless of current prices. You lose negotiating flexibility — you have to buy, even if prices are at a seasonal peak.</p>

      <p>Keeping the tank at 25–30% capacity as a minimum means you always have a few weeks of buffer. That buffer is what lets you wait for a price dip or time your order for a mid-week delivery (some suppliers are slightly cheaper midweek than on Fridays).</p>

      <h2>6. Service Your Boiler Annually</h2>
      <p>An inefficient boiler burns more oil for the same heat output. An annual service — typically £60–£100 from an OFTEC-registered technician — keeps combustion efficiency high and often pays for itself in reduced fuel consumption within the year.</p>

      <p>A poorly tuned boiler can be running at 70–75% efficiency instead of the 90%+ it should achieve. That 15–20% difference in fuel burn adds up considerably over a heating season.</p>

      <h2>7. Improve Your Home's Insulation</h2>
      <p>No amount of savvy purchasing makes up for heat leaking through an uninsulated roof or draughty windows. The Energy Saving Trust estimates that proper loft insulation saves around £150–£200 per year in a typical home. Cavity wall insulation saves a similar amount.</p>

      <p>NI homeowners may be eligible for grants through the Home Energy Conservation scheme or the Affordable Warmth scheme. Contact the NI Housing Executive to check eligibility — the schemes are means-tested but worth investigating.</p>

      <h2>8. Use a Programmable Thermostat</h2>
      <p>Heating rooms when no one is home is a surprisingly common and expensive habit. A programmable or smart thermostat pays for itself quickly by matching your heating schedule to when you're actually in and need warmth.</p>

      <p>Dropping the thermostat by just 1°C can reduce consumption by around 10%, according to the Energy Saving Trust. If you're currently keeping rooms at 22°C, cooling to 20°C costs noticeably less.</p>

      <h2>9. Set Up Price Alerts</h2>
      <p>Price alerts notify you when heating oil in your area drops below a threshold you set. They mean you don't have to check prices manually every week — the system does it for you.</p>

      <p>Create a free account on this site to set up alerts for your postcode. When prices dip, you'll get a notification and can order at the right moment without having to think about it.</p>

      <h2>The Numbers Add Up</h2>
      <p>If you compare prices every order, order in summer, and keep your boiler serviced, it's realistic to save £150–£300 per year compared to a household that does none of these things. None of the steps above require significant effort or upfront cost — they're just habits worth building.</p>
    `
  }
};

export default function BlogArticle() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">This article doesn't exist or has been moved.</p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://niheatingoil.com/blog/${slug}`;
  const seoTitle = `${article.title} | NI Heating Oil`;
  const seoDescription = `${article.title} — expert guide for Northern Ireland homeowners. Compare live heating oil prices from local suppliers at NI Heating Oil.`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niheatingoil.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://niheatingoil.com/blog" },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": canonicalUrl }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "image": article.image,
      "datePublished": article.publishDate,
      "author": { "@type": "Person", "name": article.author },
      "publisher": { "@type": "Organization", "name": "NI Heating Oil", "url": "https://niheatingoil.com" },
      "url": canonicalUrl
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500 mb-4 gap-1">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="hover:text-gray-700">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-700 truncate max-w-xs">{article.title}</span>
          </nav>

          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {article.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center text-gray-600 text-sm gap-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(article.publishDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {article.readTime}
                  </div>
                </div>
              </div>

              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Find the cheapest heating oil near you
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Compare prices from suppliers across Northern Ireland in seconds.
                  </p>
                  <Button asChild className="bg-orange-500 hover:bg-orange-600">
                    <Link href="/">Compare prices</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
