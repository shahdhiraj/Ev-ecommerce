export type ProductAvailability = "In Stock" | "Out of Stock" | "Custom Order"

export type ProductVariant = {
  id: string
  label: string
  color: string
  sku: string
  available: boolean
  image?: string
}

export type ProductDetailData = {
  model: string
  gallery: string[]
  variants: ProductVariant[]
  importEligibility: "Verified eligible" | "Review required" | "Restricted" | "Unknown"
  specifications: Record<string, string | null>
  compatibility: string[]
  includedItems: string[]
  warranty: string | null
}

export type Product = {
  id: string
  brand: string
  name: string
  price: number | null
  category: "EV Parts"
  subcategory: string
  voltage: "400V" | "800V" | "900V" | "12V"
  region: "USA" | "UK" | "Japan" | "Korea" | "Europe" | "China" | "Australia"
  availability: ProductAvailability
  image: string
  description: string
  attributes: string[]
  productType: string
  rating: number | null
  createdAt: number
  popularity: number
  detail?: ProductDetailData
}

const images = {
  motor: "/images/subsystems/powertrain-motor.jpg",
  motorAlt: "/images/hero/apex-900-dyno.jpg",
  inverter: "/images/subsystems/sic-inverter.jpg",
  battery: "/images/subsystems/battery-pack.jpg",
  brakes: "/images/subsystems/carbon-brakes.jpg",
  wallbox: "/images/subsystems/charging-station.jpg",
  chargerPort:
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=88",
  adapter:
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=88",
  aero: "/images/subsystems/carbon-aero.jpg",
  wheels:
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=88",
  suspension:
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=88",
  cockpit:
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=88",
  cooling: "/images/subsystems/sic-inverter.jpg",
  harness:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=88",
}

const product = (
  id: string,
  brand: string,
  name: string,
  price: number | null,
  subcategory: string,
  voltage: "400V" | "800V" | "900V" | "12V",
  region: Product["region"],
  availability: ProductAvailability,
  image: string,
  productType: string,
  attributes: string[],
  description: string,
  createdAt: number,
  popularity: number,
): Product => ({
  id,
  brand,
  name,
  price,
  category: "EV Parts",
  subcategory,
  voltage,
  region,
  availability,
  image,
  productType,
  attributes,
  description,
  createdAt,
  popularity,
  rating: 4.9,
})

export const catalogue: Product[] = [
  product(
    "apex-900-axial-flux-motor",
    "ABC EV Performance",
    "ABC EV Apex-900 Dual Axial Flux Motor Kit (720 kW / 1,150 Nm)",
    485000,
    "Powertrain & Motors",
    "800V",
    "Europe",
    "In Stock",
    images.motor,
    "Electric Traction Motor",
    [
      "800V High Voltage",
      "Axial Flux",
      "Liquid Cooled",
      "720 kW Peak",
      "1,150 Nm Torque",
      "Direct-Drive",
    ],
    "Ultra-compact dual axial-flux electric powertrain producing 720 kW (965 HP) with continuous liquid-glycol stator cooling for high-performance EV builds and hyper-conversions.",
    12,
    100,
  ),
  product(
    "silicon-carbide-800v-inverter",
    "BorgWarner EV",
    "ViperSiC 800V Dual Silicon Carbide Traction Inverter (750A Peak)",
    342000,
    "Power Electronics & Inverters",
    "800V",
    "USA",
    "In Stock",
    images.inverter,
    "Traction Inverter",
    [
      "800V High Voltage",
      "Silicon Carbide (SiC)",
      "99.4% Efficiency",
      "CAN FD",
      "Dual Motor Control",
    ],
    "Next-generation 800V Silicon Carbide power module delivering 99.4% switching efficiency, ultra-low thermal dissipation, and ASIL-D functional safety certification.",
    16,
    97,
  ),
  product(
    "quantum-82kwh-battery-pack",
    "Envision AESC",
    "QuantumCell 82 kWh LFP Blade Battery Module with Smart BMS (800V)",
    890000,
    "Battery & BMS",
    "800V",
    "Japan",
    "In Stock",
    images.battery,
    "High-Voltage Battery Pack",
    [
      "800V Architecture",
      "LFP Blade Chemistry",
      "4C Ultra-Fast Charge",
      "Integrated Smart BMS",
      "Zero Thermal Runaway",
    ],
    "Structural battery pack module utilizing advanced prism LFP cells with zero thermal propagation, capable of 10% to 80% charging in just 14 minutes.",
    22,
    98,
  ),
  product(
    "brembo-carbon-ceramic-ev",
    "Brembo EV-R",
    "Brembo EV-R 420mm Carbon-Ceramic Regenerative Brake System",
    275000,
    "Brakes & Suspension",
    "400V",
    "Europe",
    "In Stock",
    images.brakes,
    "Ceramic Brake Kit",
    [
      "Carbon Ceramic",
      "420mm Drilled Rotors",
      "6-Piston Monobloc",
      "Regen-Brake Blending",
      "Track Approved",
    ],
    "Extreme lightweight carbon-ceramic braking package designed specifically to blend mechanical braking with EV regenerative deceleration without thermal fade.",
    25,
    95,
  ),
  product(
    "volt-pulse-22kw-wallbox",
    "VoltPulse Systems",
    "VoltPulse Pro 22kW Bi-Directional V2H / V2G Smart Home Wallbox",
    128000,
    "Charging & Wallboxes",
    "400V",
    "Europe",
    "In Stock",
    images.wallbox,
    "EV Fast Charger",
    [
      "22kW AC Fast",
      "Bi-Directional V2G",
      "OCPP 2.0.1",
      "Dynamic Solar Sync",
      "RFID & Mobile App",
      "IP65 Weatherproof",
    ],
    "Commercial-grade bi-directional intelligent EV charging station capable of feeding vehicle battery power back to your home grid during peak utility hours.",
    30,
    94,
  ),
  product(
    "ccs2-to-nacs-ultra-adapter",
    "ApexCharge Tech",
    "ApexCharge 250kW Liquid-Cooled CCS2 to NACS Supercharger Adapter",
    38500,
    "Charging & Wallboxes",
    "900V",
    "USA",
    "In Stock",
    images.adapter,
    "Charging Adapter",
    [
      "250kW Rated",
      "CCS2 to NACS",
      "Active Thermal Sensor",
      "IP67 Waterproof",
      "UL 2251 Certified",
    ],
    "Certified heavy-duty high-speed adapter enabling Tesla and NACS equipped vehicles to utilize global CCS2 fast-charging infrastructure at full 250 kW speed.",
    35,
    96,
  ),
  product(
    "aerovolt-dry-carbon-aero",
    "AeroVolt Works",
    "AeroVolt Dry-Carbon Underbody Aero Splitter & Rear Diffuser Kit",
    168000,
    "Aero & Carbon Performance",
    "400V",
    "Japan",
    "In Stock",
    images.aero,
    "Carbon Aero Kit",
    [
      "Pre-Preg Dry Carbon",
      "Wind Tunnel Tested",
      "140kg Downforce",
      "Cd -0.02 Drag Reduction",
      "Titanium Hardware",
    ],
    "Autoclave-cured 3K dry carbon aerodynamic ground effects package engineered to lower EV drag coefficient by 0.02 Cd while stabilizing high-speed battery airflow.",
    19,
    91,
  ),
  product(
    "bilstein-ev-adaptive-coilovers",
    "Bilstein EV Performance",
    "Bilstein EV-Ride Magnetic Adaptive Coilover Suspension System",
    215000,
    "Brakes & Suspension",
    "12V",
    "Europe",
    "In Stock",
    images.suspension,
    "Active Suspension",
    [
      "Active Magnetic Ride",
      "Millisecond Damping",
      "EV Curb-Weight Calibrated",
      "Bluetooth App Tuning",
      "In-Cabin Controls",
    ],
    "Electronically regulated coilover dampers calibrated specifically for the instant torque and heavy battery floorpan dynamics of modern performance EVs.",
    28,
    89,
  ),
  product(
    "neurodrive-oled-cockpit-hud",
    "NeuroDrive Labs",
    "NeuroDrive 12.3-inch Curved OLED Digital Instrument Cluster & Telemetry HUD",
    142000,
    "Cockpit & Telemetry",
    "12V",
    "Korea",
    "In Stock",
    images.cockpit,
    "Digital Cluster & HUD",
    [
      '12.3" Curved OLED',
      "CAN Bus Telemetry",
      "Battery Thermal Map",
      "0-100 km/h Lap Timer",
      "Apple CarPlay & Android Auto",
    ],
    "High-resolution automotive-grade digital driver cockpit displaying live inverter switching thermals, cell voltage variance, instantaneous kW draw, and lap analytics.",
    34,
    93,
  ),
  product(
    "cryovolt-800v-battery-chiller",
    "CryoVolt Dynamics",
    "CryoVolt 800V High-Capacity Battery Chiller & Heat Pump Module (14 kW)",
    195000,
    "Thermal & Cooling Systems",
    "800V",
    "Europe",
    "In Stock",
    images.cooling,
    "Thermal Management",
    [
      "800V High Voltage",
      "14 kW Cooling Capacity",
      "R290 Eco-Fluid",
      "10,000 RPM Magnetic Pump",
      "Extreme Climate Certified",
    ],
    "High-output liquid thermal conditioning module preventing battery throttling during repeated high-speed acceleration runs and 350kW DC fast-charging sessions.",
    37,
    88,
  ),
  product(
    "apex-forged-21-aero-wheels",
    "ApexForged Wheels",
    "ApexForged 21-inch Monoblock Lightweight Aero Turbine Wheels (Set of 4)",
    289000,
    "Aero & Carbon Performance",
    "400V",
    "USA",
    "In Stock",
    images.wheels,
    "Forged EV Wheels",
    [
      "6061-T6 Aerospace Aluminum",
      "Detachable Carbon Aero Blades",
      "-4.6kg Unsprung Weight",
      "EV Load Rated 950kg",
      "Bespoke Offsets",
    ],
    "Aerospace-grade forged monoblock wheelset with removable carbon aero blades designed to increase motorway electric cruising range by up to 6.2%.",
    41,
    92,
  ),
  product(
    "ampshield-hvil-harness-kit",
    "AmpShield High-Voltage",
    "AmpShield 1,200V / 600A Dual-Shielded Orange Cable Harness Kit",
    64000,
    "Power Electronics & Inverters",
    "900V",
    "Europe",
    "In Stock",
    images.harness,
    "High Voltage Harness",
    [
      "1,200V Rated",
      "600A Continuous",
      "HVIL Safety Interlock",
      "EMC Class 5 Shielding",
      "IP68 Waterproof Terminals",
    ],
    "Certified OEM-spec orange high-voltage cable loom with integrated high-voltage interlock loop (HVIL) circuit for maximum workshop and driving safety.",
    45,
    86,
  ),
]

catalogue[0].detail = {
  model: "APEX-900-DUAL",
  gallery: [
    images.motor,
    images.motorAlt,
    images.inverter,
    images.cooling,
    images.harness,
  ],
  variants: [
    {
      id: "800v-dual",
      label: "800V Dual Motor (720 kW)",
      color: "#00d2ff",
      sku: "APEX-900-800V-DUAL",
      available: true,
      image: images.motor,
    },
    {
      id: "400v-single",
      label: "400V Single Motor (360 kW)",
      color: "#38bdf8",
      sku: "APEX-900-400V-SGL",
      available: true,
      image: images.motorAlt,
    },
    {
      id: "track-spec",
      label: "900V Track-Spec (850 kW)",
      color: "#10b981",
      sku: "APEX-900-900V-RACE",
      available: true,
      image: images.motor,
    },
  ],
  importEligibility: "Verified eligible",
  specifications: {
    "Operating Voltage Architecture":
      "800V Nominal (600V - 920V Operating Range)",
    "Peak Output Power": "720 kW (965.5 BHP)",
    "Peak Motor Torque": "1,150 Nm (Instant from 0 RPM)",
    "Maximum Rotor Speed": "22,000 RPM",
    "Motor Topology": "Dual-Rotor Axial Flux Synchronous Permanent Magnet",
    "Power Inverter Compatibility":
      "Silicon Carbide (SiC) & High-Frequency IGBT",
    "Cooling System": "Direct Liquid-Glycol Stator & Rotor Core Cooling",
    "Weight & Packaging":
      "48.5 kg Total Assembly Weight (Power-to-weight: 14.8 kW/kg)",
    "Communication Protocol": "Dual CAN-FD / Ethernet AVB Automotive Interface",
    "Safety & Certifications":
      "ISO 26262 ASIL-D Functional Safety, IP68 Ingress Protection",
  },
  compatibility: [
    "Tesla Model S Plaid & Model 3 Performance Conversion Platforms",
    "Porsche Taycan & Audi e-tron GT 800V Electrical Architectures",
    "Hyundai E-GMP Platforms (Ioniq 5 N, Ioniq 6, Kia EV6 GT)",
    "Rivian R1T / R1S Custom High-Output Off-Road Builds",
    "Universal Custom EV Hypercar and Restomod Tubular Chassis Platforms",
  ],
  includedItems: [
    "ABC EV Apex-900 Dual Axial Flux Motor Stator/Rotor Assembly",
    "Integrated Planetary Reduction Gearbox (9.3:1 Ratio)",
    "AmpShield IP68 800V High-Current Harness Connectors",
    "Pre-calibrated Digital Resolver & Temperature Sensor Loom",
    "CNC Billet Mounting Brackets & Titanium Hardware",
    "Official Dynamometer Calibration Certificate & Firmware Package",
  ],
  warranty: "5 Years / 150,000 km Manufacturer High-Voltage Warranty",
}

// Generate detail data for other products so PDP is rich across every item
catalogue.forEach((item, index) => {
  if (index === 0) return
  item.detail = {
    model: `${item.brand.replace(/\s+/g, "-").toUpperCase()}-${item.id.slice(0, 8).toUpperCase()}`,
    gallery: [
      item.image,
      images.motor,
      images.motorAlt,
      images.battery,
      images.brakes,
    ].filter((img, idx, arr) => arr.indexOf(img) === idx),
    variants: [
      {
        id: "standard",
        label: `Standard ${item.voltage}`,
        color: "#00d2ff",
        sku: `${item.id.toUpperCase()}-STD`,
        available: item.availability !== "Out of Stock",
        image: item.image,
      },
      {
        id: "pro",
        label: `Pro Performance Edition`,
        color: "#10b981",
        sku: `${item.id.toUpperCase()}-PRO`,
        available: true,
        image: item.image,
      },
    ],
    importEligibility: "Verified eligible",
    specifications: {
      "System Voltage": item.voltage,
      "Product Type": item.productType,
      "Engineering Grade": "Tier-1 Automotive OEM Standard",
      "Operating Temperature": "-40°C to +105°C Continuous",
      "Ingress Protection": "IP67 / IP68 Submersion Rated",
      "Warranty Coverage": "3 to 5 Year Manufacturer EV Warranty",
    },
    compatibility: [
      "Tesla Model 3, Model Y, Model S, Model X",
      "Porsche Taycan & Audi e-tron GT (800V Architecture)",
      "Hyundai Ioniq 5 / 6 & Kia EV6 (E-GMP Architecture)",
      "Universal Custom EV Conversions & Fleet Implementations",
    ],
    includedItems: [
      `${item.name} Main Unit`,
      "Automotive-grade mounting bracket & hardware",
      "Installation guide & wiring schematic booklet",
      "Factory inspection certificate & QR serial lookup",
    ],
    warranty: "3 Years Comprehensive EV Performance Warranty",
  }
})

export const catalogueBrands = [
  ...new Set(catalogue.map((item) => item.brand)),
].sort()
export const catalogueRegions = [
  ...new Set(catalogue.map((item) => item.region)),
].sort()
export const catalogueCategories = ["EV Parts"] as const
export const catalogueSubcategories = [
  ...new Set(catalogue.map((item) => item.subcategory)),
].sort()
export const catalogueVoltages = ["400V", "800V", "900V", "12V"] as const
