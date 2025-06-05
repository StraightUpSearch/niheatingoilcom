# UI Mockup: Enhanced Quote Form for NiHeatingOil.com

## Overview
This mockup describes an improved quote form that combines BoilerJuice's simplicity with NI-specific enhancements to increase conversion rates.

## Desktop Layout (1200px+)

### Hero Section
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🔥 Get Your Heating Oil Quote in 10 Seconds                  │
│                                                                 │
│  Northern Ireland's most trusted heating oil comparison site    │
│  ⭐⭐⭐⭐⭐ 4.8/5 from 2,847 reviews                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    INSTANT QUOTE FORM                    │  │
│  │                                                          │  │
│  │  📍 Your Postcode                                       │  │
│  │  ┌──────────────────────────────────┐                  │  │
│  │  │ BT [________________]            │ 📍 Detect       │  │
│  │  └──────────────────────────────────┘                  │  │
│  │                                                          │  │
│  │  🛢️ How Much Oil?                                      │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │  │
│  │  │  300L   │ │  500L   │ │  900L   │ │ Custom  │     │  │
│  │  │ £165*   │ │ £275*   │ │ £495*   │ │         │     │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │  │
│  │  *Estimated price for your area                         │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │       🔥 GET INSTANT PRICES →                   │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  │                                                          │  │
│  │  🔒 No registration required • 🚚 Free delivery       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  💰 23 people in County Down saved £487 this week             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Interactive Elements

#### 1. Smart Postcode Field
- Auto-detects location with permission
- Shows county name when typing (e.g., "BT1 - Belfast City Centre")
- Validates BT postcodes only
- Error message: "Och, we only cover Northern Ireland postcodes (BT)"

#### 2. Volume Selection Cards
- Pre-selected based on most common (500L)
- Shows estimated price range for postcode
- Hover effect with slight elevation
- Custom option expands inline input

#### 3. Dynamic Social Proof
- Updates every 30 seconds
- Shows real savings from user's county
- Alternates between different metrics:
  - "X people saved £Y this week"
  - "Average savings: £Z per order"
  - "X% chose 500L in your area"

## Mobile Layout (< 768px)

```
┌─────────────────────────┐
│  🔥 Quick Quote         │
│  10 seconds • No signup │
│                         │
│  📍 Postcode            │
│  ┌───────────────────┐  │
│  │ BT____________   │  │
│  └───────────────────┘  │
│                         │
│  🛢️ Select Amount      │
│  ┌───────────────────┐  │
│  │     300L          │  │
│  │   £165-185       │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │     500L ✓        │  │
│  │   £275-295       │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │     900L          │  │
│  │   £495-515       │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │   GET PRICES →    │  │
│  └───────────────────┘  │
│                         │
│  ⭐⭐⭐⭐⭐ 2,847 reviews │
└─────────────────────────┘
```

## Advanced Features

### 1. Progressive Disclosure
After clicking "Get Instant Prices":
- Optional email for price alerts
- Delivery urgency selector
- Tank type (if affects price)

### 2. Smart Defaults
- Remember last postcode (cookie)
- Suggest volume based on:
  - Previous orders
  - Time of year
  - Typical usage in area

### 3. Trust Indicators
- SSL padlock animation on focus
- "Your data is safe" tooltip
- Live supplier count
- BBC News logo with link

### 4. Micro-interactions
- Smooth transitions between states
- Haptic feedback on mobile
- Success animation on submission
- Loading state with oil drop animation

## Conversion Optimization

### Above the Fold
- All critical elements visible
- No scrolling required
- Clear value proposition
- Social proof immediately visible

### Friction Reduction
- Only 2 required fields
- No registration needed
- Smart suggestions
- Clear pricing expectations

### Urgency Creation
- "Lock price for 24 hours"
- "Prices updated 2 hours ago"
- "3 orders in your area today"
- Winter warning banner (seasonal)

## A/B Testing Opportunities

### Version A: Current
- Standard form layout
- 3 separate fields
- Submit button at bottom

### Version B: Enhanced
- Card-based selection
- Visual price indicators
- Inline validation
- Progress indicator

### Metrics to Track
- Form completion rate
- Time to complete
- Field error rate
- Conversion to quote view

## Technical Implementation

### Frontend
```javascript
// React component structure
<QuoteForm>
  <PostcodeInput 
    autoDetect={true}
    validation="BT-only"
    showCounty={true}
  />
  <VolumeSelector
    options={[300, 500, 900, 'custom']}
    showPrices={true}
    default={500}
  />
  <SubmitButton
    text="Get Instant Prices"
    loadingText="Finding best prices..."
  />
  <TrustIndicators />
</QuoteForm>
```

### Performance
- Lazy load price data
- Debounce postcode lookup
- Prefetch common postcodes
- Cache recent searches

### Analytics
- Track every interaction
- Heatmap form fields
- Monitor drop-off points
- Session replay for errors

## Success Metrics

### Target Improvements
- Form completion: +25%
- Time to quote: -40%
- Mobile conversion: +30%
- Return visitors: +20%

### User Feedback Goals
- "Easiest quote I've gotten"
- "Faster than calling around"
- "Love the price estimates"
- "Works great on my phone"