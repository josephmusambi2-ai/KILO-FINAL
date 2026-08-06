/* ============================================================
   PRODUCT CATALOG — this is the STARTER catalog that ships
   with the site. Prices, stock, and fitment below are
   placeholders — check and correct every one before you rely
   on it, especially fitment years and prices.

   You normally won't edit this file by hand anymore — use
   admin.html instead (Manage Store), which lets you add,
   edit, delete, and upload photos for parts from a normal
   form, then download an updated copy of this file to
   publish. See DEPLOY-GITHUB.md, section "Publishing admin
   changes".

   Fields:
   `id`          unique SKU/code, never reuse one
   `brand`       one of SHOP_CONFIG brands, or "Universal"
   `category`    must match a category in config.js
   `image`       optional — a URL or an uploaded photo (added
                 automatically by admin.html). Leave it out
                 and the site shows a plain placeholder tile.
   ============================================================ */

const DEFAULT_PRODUCTS = [
  {
    id: "BRK-TOY-1001",
    name: "Front Brake Pad Set — Ceramic",
    brand: "Toyota",
    category: "Brakes",
    price: 3900,
    stock: 6,
    fitment: "Toyota Fielder/Axio 2007–2015, Toyota Allion 2007–2015",
    description: "Front Brake Pad Set — Ceramic — quality aftermarket replacement part."
  },
  {
    id: "BRK-SUB-1001",
    name: "Front Brake Pad Set — Ceramic",
    brand: "Subaru",
    category: "Brakes",
    price: 2800,
    stock: 3,
    fitment: "Subaru Legacy/Outback 2010–2020, Subaru Forester 2010–2020",
    description: "Front Brake Pad Set — Ceramic — quality aftermarket replacement part."
  },
  {
    id: "BRK-NIS-1001",
    name: "Rear Brake Pad Set",
    brand: "Nissan",
    category: "Brakes",
    price: 3600,
    stock: 22,
    fitment: "Nissan Navara 2005–2013, Nissan Juke 2005–2013",
    description: "Rear Brake Pad Set — quality aftermarket replacement part."
  },
  {
    id: "BRK-SUZ-1001",
    name: "Rear Brake Pad Set",
    brand: "Suzuki",
    category: "Brakes",
    price: 3700,
    stock: 3,
    fitment: "Suzuki Swift 2010–2019, Suzuki Vitara/Escudo 2010–2019",
    description: "Rear Brake Pad Set — quality aftermarket replacement part."
  },
  {
    id: "BRK-SUB-1002",
    name: "Front Brake Disc Rotor (Pair)",
    brand: "Subaru",
    category: "Brakes",
    price: 7600,
    stock: 16,
    fitment: "Subaru Impreza 2007–2015, Subaru Legacy/Outback 2007–2015",
    description: "Front Brake Disc Rotor (Pair) — quality aftermarket replacement part."
  },
  {
    id: "BRK-MAZ-1001",
    name: "Front Brake Disc Rotor (Pair)",
    brand: "Mazda",
    category: "Brakes",
    price: 6300,
    stock: 18,
    fitment: "Mazda Demio 2009–2016, Mazda Familia 2009–2016",
    description: "Front Brake Disc Rotor (Pair) — quality aftermarket replacement part."
  },
  {
    id: "BRK-SUZ-1002",
    name: "Rear Brake Disc Rotor (Pair)",
    brand: "Suzuki",
    category: "Brakes",
    price: 6500,
    stock: 14,
    fitment: "Suzuki Alto 2009–2016, Suzuki Swift 2009–2016",
    description: "Rear Brake Disc Rotor (Pair) — quality aftermarket replacement part."
  },
  {
    id: "BRK-TOY-1002",
    name: "Rear Brake Disc Rotor (Pair)",
    brand: "Toyota",
    category: "Brakes",
    price: 4900,
    stock: 10,
    fitment: "Toyota Hilux Vigo 2012–2019, Toyota Allion 2012–2019",
    description: "Rear Brake Disc Rotor (Pair) — quality aftermarket replacement part."
  },
  {
    id: "BRK-MAZ-1002",
    name: "Rear Brake Disc Rotor (Pair)",
    brand: "Mazda",
    category: "Brakes",
    price: 6000,
    stock: 12,
    fitment: "Mazda CX-5 2007–2014, Mazda Demio 2007–2014",
    description: "Rear Brake Disc Rotor (Pair) — quality aftermarket replacement part."
  },
  {
    id: "BRK-SUB-1003",
    name: "Brake Caliper — Front Left",
    brand: "Subaru",
    category: "Brakes",
    price: 8700,
    stock: 5,
    fitment: "Subaru Impreza 2007–2016, Subaru Legacy/Outback 2007–2016",
    description: "Brake Caliper — Front Left — quality aftermarket replacement part."
  },
  {
    id: "BRK-HON-1001",
    name: "Brake Caliper — Front Left",
    brand: "Honda",
    category: "Brakes",
    price: 7000,
    stock: 25,
    fitment: "Honda CR-V 2012–2020, Honda Vezel 2012–2020",
    description: "Brake Caliper — Front Left — quality aftermarket replacement part."
  },
  {
    id: "BRK-NIS-1002",
    name: "Brake Caliper — Front Left",
    brand: "Nissan",
    category: "Brakes",
    price: 8600,
    stock: 16,
    fitment: "Nissan Wingroad 2012–2020, Nissan Tiida 2012–2020",
    description: "Brake Caliper — Front Left — quality aftermarket replacement part."
  },
  {
    id: "ENG-NIS-1001",
    name: "Timing Belt Kit with Water Pump",
    brand: "Nissan",
    category: "Engine",
    price: 8800,
    stock: 16,
    fitment: "Nissan Tiida 2008–2015, Nissan Wingroad 2008–2015",
    description: "Timing Belt Kit with Water Pump — quality aftermarket replacement part."
  },
  {
    id: "ENG-TOY-1001",
    name: "Timing Belt Kit with Water Pump",
    brand: "Toyota",
    category: "Engine",
    price: 8400,
    stock: 12,
    fitment: "Toyota Allion 2009–2019, Toyota RAV4 2009–2019",
    description: "Timing Belt Kit with Water Pump — quality aftermarket replacement part."
  },
  {
    id: "ENG-NIS-1002",
    name: "Timing Chain Kit",
    brand: "Nissan",
    category: "Engine",
    price: 11900,
    stock: 20,
    fitment: "Nissan Navara 2008–2018, Nissan Juke 2008–2018",
    description: "Timing Chain Kit — quality aftermarket replacement part."
  },
  {
    id: "ENG-SUB-1001",
    name: "Timing Chain Kit",
    brand: "Subaru",
    category: "Engine",
    price: 8700,
    stock: 4,
    fitment: "Subaru Impreza 2007–2017, Subaru Forester 2007–2017",
    description: "Timing Chain Kit — quality aftermarket replacement part."
  },
  {
    id: "ENG-NIS-1003",
    name: "Spark Plug Set (4pcs) — Iridium",
    brand: "Nissan",
    category: "Engine",
    price: 4400,
    stock: 20,
    fitment: "Nissan Note 2010–2017, Nissan Wingroad 2010–2017",
    description: "Spark Plug Set (4pcs) — Iridium — quality aftermarket replacement part."
  },
  {
    id: "ENG-SUB-1002",
    name: "Spark Plug Set (4pcs) — Iridium",
    brand: "Subaru",
    category: "Engine",
    price: 4900,
    stock: 3,
    fitment: "Subaru Legacy/Outback 2010–2019, Subaru Impreza 2010–2019",
    description: "Spark Plug Set (4pcs) — Iridium — quality aftermarket replacement part."
  },
  {
    id: "ENG-SUB-1003",
    name: "Alternator — Remanufactured",
    brand: "Subaru",
    category: "Engine",
    price: 13200,
    stock: 8,
    fitment: "Subaru Impreza 2005–2014, Subaru Legacy/Outback 2005–2014",
    description: "Alternator — Remanufactured — quality aftermarket replacement part."
  },
  {
    id: "ENG-MIT-1001",
    name: "Alternator — Remanufactured",
    brand: "Mitsubishi",
    category: "Engine",
    price: 13700,
    stock: 8,
    fitment: "Mitsubishi L200 2012–2021, Mitsubishi Outlander 2012–2021",
    description: "Alternator — Remanufactured — quality aftermarket replacement part."
  },
  {
    id: "ENG-SUZ-1001",
    name: "Starter Motor — Remanufactured",
    brand: "Suzuki",
    category: "Engine",
    price: 14300,
    stock: 8,
    fitment: "Suzuki Vitara/Escudo 2007–2016, Suzuki Swift 2007–2016",
    description: "Starter Motor — Remanufactured — quality aftermarket replacement part."
  },
  {
    id: "ENG-SUB-1004",
    name: "Starter Motor — Remanufactured",
    brand: "Subaru",
    category: "Engine",
    price: 12600,
    stock: 3,
    fitment: "Subaru Legacy/Outback 2010–2019, Subaru Forester 2010–2019",
    description: "Starter Motor — Remanufactured — quality aftermarket replacement part."
  },
  {
    id: "ENG-HON-1001",
    name: "Engine Mount — Front",
    brand: "Honda",
    category: "Engine",
    price: 3700,
    stock: 30,
    fitment: "Honda CR-V 2007–2014, Honda Fit 2007–2014",
    description: "Engine Mount — Front — quality aftermarket replacement part."
  },
  {
    id: "ENG-SUZ-1002",
    name: "Engine Mount — Front",
    brand: "Suzuki",
    category: "Engine",
    price: 5200,
    stock: 8,
    fitment: "Suzuki Swift 2007–2017, Suzuki Alto 2007–2017",
    description: "Engine Mount — Front — quality aftermarket replacement part."
  },
  {
    id: "ENG-MIT-1002",
    name: "Fuel Pump — Electric In-Tank",
    brand: "Mitsubishi",
    category: "Engine",
    price: 8400,
    stock: 20,
    fitment: "Mitsubishi Pajero 2012–2020, Mitsubishi Lancer 2012–2020",
    description: "Fuel Pump — Electric In-Tank — quality aftermarket replacement part."
  },
  {
    id: "ENG-SUZ-1003",
    name: "Fuel Pump — Electric In-Tank",
    brand: "Suzuki",
    category: "Engine",
    price: 7200,
    stock: 10,
    fitment: "Suzuki Alto 2009–2019, Suzuki Vitara/Escudo 2009–2019",
    description: "Fuel Pump — Electric In-Tank — quality aftermarket replacement part."
  },
  {
    id: "ENG-MAZ-1001",
    name: "Fuel Pump — Electric In-Tank",
    brand: "Mazda",
    category: "Engine",
    price: 7900,
    stock: 10,
    fitment: "Mazda Axela 2008–2015, Mazda Demio 2008–2015",
    description: "Fuel Pump — Electric In-Tank — quality aftermarket replacement part."
  },
  {
    id: "SUS-TOY-1001",
    name: "Front Shock Absorber (Pair)",
    brand: "Toyota",
    category: "Suspension",
    price: 9500,
    stock: 16,
    fitment: "Toyota Corolla 2005–2012, Toyota Allion 2005–2012",
    description: "Front Shock Absorber (Pair) — quality aftermarket replacement part."
  },
  {
    id: "SUS-SUB-1001",
    name: "Front Shock Absorber (Pair)",
    brand: "Subaru",
    category: "Suspension",
    price: 7400,
    stock: 7,
    fitment: "Subaru Forester 2008–2018, Subaru Legacy/Outback 2008–2018",
    description: "Front Shock Absorber (Pair) — quality aftermarket replacement part."
  },
  {
    id: "SUS-NIS-1001",
    name: "Rear Shock Absorber (Pair)",
    brand: "Nissan",
    category: "Suspension",
    price: 7300,
    stock: 22,
    fitment: "Nissan Note 2005–2015, Nissan X-Trail 2005–2015",
    description: "Rear Shock Absorber (Pair) — quality aftermarket replacement part."
  },
  {
    id: "SUS-MAZ-1001",
    name: "Rear Shock Absorber (Pair)",
    brand: "Mazda",
    category: "Suspension",
    price: 8300,
    stock: 6,
    fitment: "Mazda Familia 2012–2019, Mazda Axela 2012–2019",
    description: "Rear Shock Absorber (Pair) — quality aftermarket replacement part."
  },
  {
    id: "SUS-SUB-1002",
    name: "Rear Shock Absorber (Pair)",
    brand: "Subaru",
    category: "Suspension",
    price: 8700,
    stock: 6,
    fitment: "Subaru Forester 2012–2021, Subaru Impreza 2012–2021",
    description: "Rear Shock Absorber (Pair) — quality aftermarket replacement part."
  },
  {
    id: "SUS-NIS-1002",
    name: "Control Arm — Lower Front Left",
    brand: "Nissan",
    category: "Suspension",
    price: 4300,
    stock: 12,
    fitment: "Nissan Navara 2007–2017, Nissan Wingroad 2007–2017",
    description: "Control Arm — Lower Front Left — quality aftermarket replacement part."
  },
  {
    id: "SUS-SUZ-1001",
    name: "Control Arm — Lower Front Left",
    brand: "Suzuki",
    category: "Suspension",
    price: 5500,
    stock: 6,
    fitment: "Suzuki Vitara/Escudo 2005–2015, Suzuki Swift 2005–2015",
    description: "Control Arm — Lower Front Left — quality aftermarket replacement part."
  },
  {
    id: "SUS-SUB-1003",
    name: "Control Arm — Lower Front Right",
    brand: "Subaru",
    category: "Suspension",
    price: 5100,
    stock: 30,
    fitment: "Subaru Forester 2007–2015, Subaru Legacy/Outback 2007–2015",
    description: "Control Arm — Lower Front Right — quality aftermarket replacement part."
  },
  {
    id: "SUS-MIT-1001",
    name: "Control Arm — Lower Front Right",
    brand: "Mitsubishi",
    category: "Suspension",
    price: 4300,
    stock: 20,
    fitment: "Mitsubishi L200 2009–2016, Mitsubishi Outlander 2009–2016",
    description: "Control Arm — Lower Front Right — quality aftermarket replacement part."
  },
  {
    id: "SUS-MAZ-1002",
    name: "Coil Spring Set — Rear",
    brand: "Mazda",
    category: "Suspension",
    price: 5200,
    stock: 9,
    fitment: "Mazda Familia 2009–2019, Mazda Axela 2009–2019",
    description: "Coil Spring Set — Rear — quality aftermarket replacement part."
  },
  {
    id: "SUS-HON-1001",
    name: "Coil Spring Set — Rear",
    brand: "Honda",
    category: "Suspension",
    price: 5800,
    stock: 4,
    fitment: "Honda Vezel 2005–2012, Honda Fit 2005–2012",
    description: "Coil Spring Set — Rear — quality aftermarket replacement part."
  },
  {
    id: "SUS-MIT-1002",
    name: "Stabilizer Link — Front",
    brand: "Mitsubishi",
    category: "Suspension",
    price: 1400,
    stock: 5,
    fitment: "Mitsubishi Pajero 2010–2017, Mitsubishi Outlander 2010–2017",
    description: "Stabilizer Link — Front — quality aftermarket replacement part."
  },
  {
    id: "SUS-MAZ-1003",
    name: "Stabilizer Link — Front",
    brand: "Mazda",
    category: "Suspension",
    price: 1300,
    stock: 10,
    fitment: "Mazda Demio 2007–2017, Mazda CX-5 2007–2017",
    description: "Stabilizer Link — Front — quality aftermarket replacement part."
  },
  {
    id: "SUS-MIT-1003",
    name: "Tie Rod End — Outer",
    brand: "Mitsubishi",
    category: "Suspension",
    price: 1900,
    stock: 9,
    fitment: "Mitsubishi L200 2010–2019, Mitsubishi Lancer 2010–2019",
    description: "Tie Rod End — Outer — quality aftermarket replacement part."
  },
  {
    id: "SUS-TOY-1002",
    name: "Tie Rod End — Outer",
    brand: "Toyota",
    category: "Suspension",
    price: 1700,
    stock: 14,
    fitment: "Toyota Hilux Vigo 2008–2018, Toyota Allion 2008–2018",
    description: "Tie Rod End — Outer — quality aftermarket replacement part."
  },
  {
    id: "ELE-HON-1001",
    name: "Ignition Coil Pack",
    brand: "Honda",
    category: "Electrical",
    price: 2900,
    stock: 9,
    fitment: "Honda Civic 2010–2017, Honda Vezel 2010–2017",
    description: "Ignition Coil Pack — quality aftermarket replacement part."
  },
  {
    id: "ELE-TOY-1001",
    name: "Ignition Coil Pack",
    brand: "Toyota",
    category: "Electrical",
    price: 2900,
    stock: 10,
    fitment: "Toyota Probox 2007–2016, Toyota Fielder/Axio 2007–2016",
    description: "Ignition Coil Pack — quality aftermarket replacement part."
  },
  {
    id: "ELE-SUB-1001",
    name: "Ignition Coil Pack",
    brand: "Subaru",
    category: "Electrical",
    price: 4100,
    stock: 14,
    fitment: "Subaru Impreza 2007–2017, Subaru Legacy/Outback 2007–2017",
    description: "Ignition Coil Pack — quality aftermarket replacement part."
  },
  {
    id: "ELE-SUB-1002",
    name: "ABS Wheel Speed Sensor — Front",
    brand: "Subaru",
    category: "Electrical",
    price: 2500,
    stock: 6,
    fitment: "Subaru Impreza 2007–2016, Subaru Forester 2007–2016",
    description: "ABS Wheel Speed Sensor — Front — quality aftermarket replacement part."
  },
  {
    id: "ELE-MIT-1001",
    name: "ABS Wheel Speed Sensor — Front",
    brand: "Mitsubishi",
    category: "Electrical",
    price: 3500,
    stock: 16,
    fitment: "Mitsubishi Pajero 2008–2016, Mitsubishi L200 2008–2016",
    description: "ABS Wheel Speed Sensor — Front — quality aftermarket replacement part."
  },
  {
    id: "ELE-SUB-1003",
    name: "Crankshaft Position Sensor",
    brand: "Subaru",
    category: "Electrical",
    price: 2700,
    stock: 22,
    fitment: "Subaru Impreza 2008–2015, Subaru Legacy/Outback 2008–2015",
    description: "Crankshaft Position Sensor — quality aftermarket replacement part."
  },
  {
    id: "ELE-SUZ-1001",
    name: "Crankshaft Position Sensor",
    brand: "Suzuki",
    category: "Electrical",
    price: 3800,
    stock: 7,
    fitment: "Suzuki Vitara/Escudo 2005–2014, Suzuki Swift 2005–2014",
    description: "Crankshaft Position Sensor — quality aftermarket replacement part."
  },
  {
    id: "ELE-NIS-1001",
    name: "Mass Air Flow Sensor",
    brand: "Nissan",
    category: "Electrical",
    price: 5800,
    stock: 5,
    fitment: "Nissan Navara 2010–2017, Nissan Wingroad 2010–2017",
    description: "Mass Air Flow Sensor — quality aftermarket replacement part."
  },
  {
    id: "ELE-SUB-1004",
    name: "Mass Air Flow Sensor",
    brand: "Subaru",
    category: "Electrical",
    price: 8100,
    stock: 18,
    fitment: "Subaru Legacy/Outback 2010–2017, Subaru Forester 2010–2017",
    description: "Mass Air Flow Sensor — quality aftermarket replacement part."
  },
  {
    id: "ELE-MAZ-1001",
    name: "Mass Air Flow Sensor",
    brand: "Mazda",
    category: "Electrical",
    price: 6400,
    stock: 18,
    fitment: "Mazda Axela 2007–2014, Mazda Familia 2007–2014",
    description: "Mass Air Flow Sensor — quality aftermarket replacement part."
  },
  {
    id: "ELE-HON-1002",
    name: "Oxygen Sensor",
    brand: "Honda",
    category: "Electrical",
    price: 4900,
    stock: 22,
    fitment: "Honda CR-V 2005–2014, Honda Vezel 2005–2014",
    description: "Oxygen Sensor — quality aftermarket replacement part."
  },
  {
    id: "ELE-NIS-1002",
    name: "Oxygen Sensor",
    brand: "Nissan",
    category: "Electrical",
    price: 3700,
    stock: 22,
    fitment: "Nissan Navara 2007–2015, Nissan Note 2007–2015",
    description: "Oxygen Sensor — quality aftermarket replacement part."
  },
  {
    id: "FIL-NIS-1001",
    name: "Engine Air Filter",
    brand: "Nissan",
    category: "Filters",
    price: 1200,
    stock: 8,
    fitment: "Nissan Tiida 2012–2020, Nissan Wingroad 2012–2020",
    description: "Engine Air Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-SUB-1001",
    name: "Engine Air Filter",
    brand: "Subaru",
    category: "Filters",
    price: 1300,
    stock: 10,
    fitment: "Subaru Legacy/Outback 2009–2016, Subaru Forester 2009–2016",
    description: "Engine Air Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-SUZ-1001",
    name: "Oil Filter",
    brand: "Suzuki",
    category: "Filters",
    price: 550,
    stock: 9,
    fitment: "Suzuki Vitara/Escudo 2007–2015, Suzuki Alto 2007–2015",
    description: "Oil Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-MAZ-1001",
    name: "Oil Filter",
    brand: "Mazda",
    category: "Filters",
    price: 750,
    stock: 18,
    fitment: "Mazda Familia 2008–2015, Mazda Axela 2008–2015",
    description: "Oil Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-SUB-1002",
    name: "Cabin Pollen Filter",
    brand: "Subaru",
    category: "Filters",
    price: 1600,
    stock: 12,
    fitment: "Subaru Forester 2008–2016, Subaru Legacy/Outback 2008–2016",
    description: "Cabin Pollen Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-MIT-1001",
    name: "Cabin Pollen Filter",
    brand: "Mitsubishi",
    category: "Filters",
    price: 1400,
    stock: 16,
    fitment: "Mitsubishi Outlander 2010–2020, Mitsubishi L200 2010–2020",
    description: "Cabin Pollen Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-HON-1001",
    name: "Cabin Pollen Filter",
    brand: "Honda",
    category: "Filters",
    price: 1500,
    stock: 9,
    fitment: "Honda Civic 2010–2017, Honda Vezel 2010–2017",
    description: "Cabin Pollen Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-TOY-1001",
    name: "Fuel Filter",
    brand: "Toyota",
    category: "Filters",
    price: 1500,
    stock: 16,
    fitment: "Toyota Corolla 2008–2018, Toyota Allion 2008–2018",
    description: "Fuel Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-SUB-1003",
    name: "Fuel Filter",
    brand: "Subaru",
    category: "Filters",
    price: 1800,
    stock: 14,
    fitment: "Subaru Legacy/Outback 2012–2019, Subaru Impreza 2012–2019",
    description: "Fuel Filter — quality aftermarket replacement part."
  },
  {
    id: "FIL-MAZ-1002",
    name: "Fuel Filter",
    brand: "Mazda",
    category: "Filters",
    price: 1600,
    stock: 9,
    fitment: "Mazda Familia 2009–2018, Mazda Axela 2009–2018",
    description: "Fuel Filter — quality aftermarket replacement part."
  },
  {
    id: "LGT-SUB-1001",
    name: "Headlight Assembly — Left",
    brand: "Subaru",
    category: "Lighting",
    price: 9400,
    stock: 14,
    fitment: "Subaru Legacy/Outback 2009–2016, Subaru Impreza 2009–2016",
    description: "Headlight Assembly — Left — quality aftermarket replacement part."
  },
  {
    id: "LGT-MAZ-1001",
    name: "Headlight Assembly — Left",
    brand: "Mazda",
    category: "Lighting",
    price: 10400,
    stock: 25,
    fitment: "Mazda Axela 2010–2019, Mazda Familia 2010–2019",
    description: "Headlight Assembly — Left — quality aftermarket replacement part."
  },
  {
    id: "LGT-NIS-1001",
    name: "Headlight Assembly — Left",
    brand: "Nissan",
    category: "Lighting",
    price: 8500,
    stock: 5,
    fitment: "Nissan Wingroad 2010–2020, Nissan Note 2010–2020",
    description: "Headlight Assembly — Left — quality aftermarket replacement part."
  },
  {
    id: "LGT-MIT-1001",
    name: "Headlight Assembly — Right",
    brand: "Mitsubishi",
    category: "Lighting",
    price: 8900,
    stock: 9,
    fitment: "Mitsubishi Lancer 2007–2016, Mitsubishi Outlander 2007–2016",
    description: "Headlight Assembly — Right — quality aftermarket replacement part."
  },
  {
    id: "LGT-SUB-1002",
    name: "Headlight Assembly — Right",
    brand: "Subaru",
    category: "Lighting",
    price: 10500,
    stock: 5,
    fitment: "Subaru Forester 2005–2013, Subaru Legacy/Outback 2005–2013",
    description: "Headlight Assembly — Right — quality aftermarket replacement part."
  },
  {
    id: "LGT-SUZ-1001",
    name: "Headlight Assembly — Right",
    brand: "Suzuki",
    category: "Lighting",
    price: 9900,
    stock: 30,
    fitment: "Suzuki Vitara/Escudo 2012–2020, Suzuki Alto 2012–2020",
    description: "Headlight Assembly — Right — quality aftermarket replacement part."
  },
  {
    id: "LGT-NIS-1002",
    name: "Tail Light Assembly — Left",
    brand: "Nissan",
    category: "Lighting",
    price: 6400,
    stock: 25,
    fitment: "Nissan X-Trail 2007–2015, Nissan Wingroad 2007–2015",
    description: "Tail Light Assembly — Left — quality aftermarket replacement part."
  },
  {
    id: "LGT-SUZ-1002",
    name: "Tail Light Assembly — Left",
    brand: "Suzuki",
    category: "Lighting",
    price: 4600,
    stock: 25,
    fitment: "Suzuki Swift 2005–2015, Suzuki Alto 2005–2015",
    description: "Tail Light Assembly — Left — quality aftermarket replacement part."
  },
  {
    id: "LGT-TOY-1001",
    name: "Tail Light Assembly — Left",
    brand: "Toyota",
    category: "Lighting",
    price: 5900,
    stock: 25,
    fitment: "Toyota Probox 2009–2019, Toyota Hilux Vigo 2009–2019",
    description: "Tail Light Assembly — Left — quality aftermarket replacement part."
  },
  {
    id: "LGT-SUB-1003",
    name: "LED Fog Light Kit",
    brand: "Subaru",
    category: "Lighting",
    price: 4700,
    stock: 10,
    fitment: "Subaru Impreza 2007–2016, Subaru Legacy/Outback 2007–2016",
    description: "LED Fog Light Kit — quality aftermarket replacement part."
  },
  {
    id: "LGT-MAZ-1002",
    name: "LED Fog Light Kit",
    brand: "Mazda",
    category: "Lighting",
    price: 3900,
    stock: 12,
    fitment: "Mazda CX-5 2005–2014, Mazda Axela 2005–2014",
    description: "LED Fog Light Kit — quality aftermarket replacement part."
  },
  {
    id: "BDY-HON-1001",
    name: "Side Mirror — Right, Power Fold",
    brand: "Honda",
    category: "Body & Exterior",
    price: 4600,
    stock: 9,
    fitment: "Honda CR-V 2007–2017, Honda Fit 2007–2017",
    description: "Side Mirror — Right, Power Fold — quality aftermarket replacement part."
  },
  {
    id: "BDY-MIT-1001",
    name: "Side Mirror — Right, Power Fold",
    brand: "Mitsubishi",
    category: "Body & Exterior",
    price: 5900,
    stock: 25,
    fitment: "Mitsubishi Outlander 2009–2018, Mitsubishi Pajero 2009–2018",
    description: "Side Mirror — Right, Power Fold — quality aftermarket replacement part."
  },
  {
    id: "BDY-TOY-1001",
    name: "Side Mirror — Right, Power Fold",
    brand: "Toyota",
    category: "Body & Exterior",
    price: 5400,
    stock: 3,
    fitment: "Toyota Prado 2007–2017, Toyota Corolla 2007–2017",
    description: "Side Mirror — Right, Power Fold — quality aftermarket replacement part."
  },
  {
    id: "BDY-MAZ-1001",
    name: "Side Mirror — Left, Power Fold",
    brand: "Mazda",
    category: "Body & Exterior",
    price: 5700,
    stock: 10,
    fitment: "Mazda CX-5 2009–2017, Mazda Axela 2009–2017",
    description: "Side Mirror — Left, Power Fold — quality aftermarket replacement part."
  },
  {
    id: "BDY-TOY-1002",
    name: "Side Mirror — Left, Power Fold",
    brand: "Toyota",
    category: "Body & Exterior",
    price: 5400,
    stock: 16,
    fitment: "Toyota Fielder/Axio 2009–2016, Toyota Prado 2009–2016",
    description: "Side Mirror — Left, Power Fold — quality aftermarket replacement part."
  },
  {
    id: "BDY-HON-1002",
    name: "Side Mirror — Left, Power Fold",
    brand: "Honda",
    category: "Body & Exterior",
    price: 4600,
    stock: 3,
    fitment: "Honda Civic 2007–2017, Honda Vezel 2007–2017",
    description: "Side Mirror — Left, Power Fold — quality aftermarket replacement part."
  },
  {
    id: "BDY-MIT-1002",
    name: "Front Bumper Grille",
    brand: "Mitsubishi",
    category: "Body & Exterior",
    price: 4900,
    stock: 8,
    fitment: "Mitsubishi Outlander 2009–2017, Mitsubishi Lancer 2009–2017",
    description: "Front Bumper Grille — quality aftermarket replacement part."
  },
  {
    id: "BDY-SUZ-1001",
    name: "Front Bumper Grille",
    brand: "Suzuki",
    category: "Body & Exterior",
    price: 4100,
    stock: 25,
    fitment: "Suzuki Swift 2009–2018, Suzuki Vitara/Escudo 2009–2018",
    description: "Front Bumper Grille — quality aftermarket replacement part."
  },
  {
    id: "BDY-TOY-1003",
    name: "Front Bumper Grille",
    brand: "Toyota",
    category: "Body & Exterior",
    price: 4800,
    stock: 12,
    fitment: "Toyota Hilux Vigo 2009–2018, Toyota Probox 2009–2018",
    description: "Front Bumper Grille — quality aftermarket replacement part."
  },
  {
    id: "BDY-MAZ-1002",
    name: "Wiper Blade Set",
    brand: "Mazda",
    category: "Body & Exterior",
    price: 1200,
    stock: 3,
    fitment: "Mazda Demio 2007–2014, Mazda Axela 2007–2014",
    description: "Wiper Blade Set — quality aftermarket replacement part."
  },
  {
    id: "BDY-TOY-1004",
    name: "Wiper Blade Set",
    brand: "Toyota",
    category: "Body & Exterior",
    price: 1500,
    stock: 7,
    fitment: "Toyota Allion 2005–2013, Toyota Probox 2005–2013",
    description: "Wiper Blade Set — quality aftermarket replacement part."
  },
  {
    id: "BDY-SUB-1001",
    name: "Door Handle — Outer Front Left",
    brand: "Subaru",
    category: "Body & Exterior",
    price: 2300,
    stock: 8,
    fitment: "Subaru Forester 2012–2021, Subaru Impreza 2012–2021",
    description: "Door Handle — Outer Front Left — quality aftermarket replacement part."
  },
  {
    id: "BDY-TOY-1005",
    name: "Door Handle — Outer Front Left",
    brand: "Toyota",
    category: "Body & Exterior",
    price: 2700,
    stock: 3,
    fitment: "Toyota Vitz/Yaris 2008–2015, Toyota Premio 2008–2015",
    description: "Door Handle — Outer Front Left — quality aftermarket replacement part."
  },
  {
    id: "BDY-MIT-1003",
    name: "Door Handle — Outer Front Left",
    brand: "Mitsubishi",
    category: "Body & Exterior",
    price: 2400,
    stock: 9,
    fitment: "Mitsubishi Lancer 2012–2022, Mitsubishi L200 2012–2022",
    description: "Door Handle — Outer Front Left — quality aftermarket replacement part."
  },
  {
    id: "COOL-MIT-1001",
    name: "Radiator — Aluminum Core",
    brand: "Mitsubishi",
    category: "Cooling System",
    price: 12000,
    stock: 6,
    fitment: "Mitsubishi Pajero 2012–2021, Mitsubishi Outlander 2012–2021",
    description: "Radiator — Aluminum Core — quality aftermarket replacement part."
  },
  {
    id: "COOL-SUB-1001",
    name: "Radiator — Aluminum Core",
    brand: "Subaru",
    category: "Cooling System",
    price: 12400,
    stock: 18,
    fitment: "Subaru Legacy/Outback 2008–2018, Subaru Forester 2008–2018",
    description: "Radiator — Aluminum Core — quality aftermarket replacement part."
  },
  {
    id: "COOL-MIT-1002",
    name: "Radiator Cooling Fan Assembly",
    brand: "Mitsubishi",
    category: "Cooling System",
    price: 7100,
    stock: 22,
    fitment: "Mitsubishi Lancer 2009–2019, Mitsubishi Outlander 2009–2019",
    description: "Radiator Cooling Fan Assembly — quality aftermarket replacement part."
  },
  {
    id: "COOL-SUB-1002",
    name: "Radiator Cooling Fan Assembly",
    brand: "Subaru",
    category: "Cooling System",
    price: 9200,
    stock: 8,
    fitment: "Subaru Impreza 2012–2020, Subaru Legacy/Outback 2012–2020",
    description: "Radiator Cooling Fan Assembly — quality aftermarket replacement part."
  },
  {
    id: "COOL-MIT-1003",
    name: "Thermostat with Housing",
    brand: "Mitsubishi",
    category: "Cooling System",
    price: 2300,
    stock: 10,
    fitment: "Mitsubishi L200 2012–2021, Mitsubishi Pajero 2012–2021",
    description: "Thermostat with Housing — quality aftermarket replacement part."
  },
  {
    id: "COOL-SUZ-1001",
    name: "Thermostat with Housing",
    brand: "Suzuki",
    category: "Cooling System",
    price: 2500,
    stock: 20,
    fitment: "Suzuki Swift 2009–2017, Suzuki Vitara/Escudo 2009–2017",
    description: "Thermostat with Housing — quality aftermarket replacement part."
  },
  {
    id: "COOL-MAZ-1001",
    name: "Thermostat with Housing",
    brand: "Mazda",
    category: "Cooling System",
    price: 2000,
    stock: 30,
    fitment: "Mazda CX-5 2009–2018, Mazda Demio 2009–2018",
    description: "Thermostat with Housing — quality aftermarket replacement part."
  },
  {
    id: "COOL-HON-1001",
    name: "Water Pump",
    brand: "Honda",
    category: "Cooling System",
    price: 4900,
    stock: 3,
    fitment: "Honda Vezel 2010–2019, Honda CR-V 2010–2019",
    description: "Water Pump — quality aftermarket replacement part."
  },
  {
    id: "COOL-SUZ-1002",
    name: "Water Pump",
    brand: "Suzuki",
    category: "Cooling System",
    price: 4500,
    stock: 30,
    fitment: "Suzuki Alto 2005–2013, Suzuki Swift 2005–2013",
    description: "Water Pump — quality aftermarket replacement part."
  },
  {
    id: "BRG-SUB-1001",
    name: "Wheel Bearing — Front",
    brand: "Subaru",
    category: "Bearings",
    price: 2300,
    stock: 14,
    fitment: "Subaru Legacy/Outback 2009–2016, Subaru Impreza 2009–2016",
    description: "Wheel Bearing — Front — quality aftermarket replacement part."
  },
  {
    id: "BRG-MAZ-1001",
    name: "Wheel Bearing — Front",
    brand: "Mazda",
    category: "Bearings",
    price: 2600,
    stock: 18,
    fitment: "Mazda Axela 2012–2020, Mazda Familia 2012–2020",
    description: "Wheel Bearing — Front — quality aftermarket replacement part."
  },
  {
    id: "BRG-MIT-1001",
    name: "Wheel Bearing — Rear",
    brand: "Mitsubishi",
    category: "Bearings",
    price: 2500,
    stock: 25,
    fitment: "Mitsubishi L200 2010–2019, Mitsubishi Lancer 2010–2019",
    description: "Wheel Bearing — Rear — quality aftermarket replacement part."
  },
  {
    id: "BRG-SUZ-1001",
    name: "Wheel Bearing — Rear",
    brand: "Suzuki",
    category: "Bearings",
    price: 2100,
    stock: 9,
    fitment: "Suzuki Vitara/Escudo 2008–2016, Suzuki Alto 2008–2016",
    description: "Wheel Bearing — Rear — quality aftermarket replacement part."
  },
  {
    id: "BRG-HON-1001",
    name: "Wheel Bearing — Rear",
    brand: "Honda",
    category: "Bearings",
    price: 2300,
    stock: 9,
    fitment: "Honda Vezel 2012–2020, Honda Fit 2012–2020",
    description: "Wheel Bearing — Rear — quality aftermarket replacement part."
  },
  {
    id: "BRG-HON-1002",
    name: "Wheel Hub Bearing Assembly — Front",
    brand: "Honda",
    category: "Bearings",
    price: 4500,
    stock: 18,
    fitment: "Honda Vezel 2007–2016, Honda Fit 2007–2016",
    description: "Wheel Hub Bearing Assembly — Front — quality aftermarket replacement part."
  },
  {
    id: "BRG-SUB-1002",
    name: "Wheel Hub Bearing Assembly — Front",
    brand: "Subaru",
    category: "Bearings",
    price: 4600,
    stock: 4,
    fitment: "Subaru Forester 2005–2013, Subaru Impreza 2005–2013",
    description: "Wheel Hub Bearing Assembly — Front — quality aftermarket replacement part."
  },
  {
    id: "BRG-MIT-1002",
    name: "Wheel Hub Bearing Assembly — Front",
    brand: "Mitsubishi",
    category: "Bearings",
    price: 5300,
    stock: 6,
    fitment: "Mitsubishi Outlander 2008–2016, Mitsubishi Lancer 2008–2016",
    description: "Wheel Hub Bearing Assembly — Front — quality aftermarket replacement part."
  },
  {
    id: "OIL-1001",
    name: "Engine Oil 5W-30 Fully Synthetic — 4L",
    brand: "Universal",
    category: "Oils & Fluids",
    price: 3900,
    stock: 20,
    fitment: "Universal — check owner's manual for spec match",
    description: "API SN rated fully synthetic engine oil."
  },
  {
    id: "OIL-1002",
    name: "Engine Oil 5W-40 Fully Synthetic — 4L",
    brand: "Universal",
    category: "Oils & Fluids",
    price: 4100,
    stock: 40,
    fitment: "Universal — check owner's manual for spec match",
    description: "API SN rated fully synthetic engine oil, wider temperature range."
  },
  {
    id: "OIL-1003",
    name: "Engine Oil 15W-40 Semi-Synthetic — 4L",
    brand: "Universal",
    category: "Oils & Fluids",
    price: 2600,
    stock: 60,
    fitment: "Universal — older petrol and diesel engines",
    description: "Semi-synthetic engine oil for high-mileage engines."
  },
  {
    id: "OIL-1004",
    name: "Automatic Transmission Fluid (ATF) — 4L",
    brand: "Universal",
    category: "Oils & Fluids",
    price: 3400,
    stock: 60,
    fitment: "Universal — check owner's manual for spec match",
    description: "For automatic gearboxes and torque converters."
  },
  {
    id: "OIL-1005",
    name: "Gear Oil 80W-90 — 1L",
    brand: "Universal",
    category: "Oils & Fluids",
    price: 950,
    stock: 60,
    fitment: "Universal — manual transmissions and differentials",
    description: "Mineral gear oil for manual gearboxes and diffs."
  },
  {
    id: "OIL-1006",
    name: "Brake Fluid DOT 4 — 500ml",
    brand: "Universal",
    category: "Oils & Fluids",
    price: 650,
    stock: 45,
    fitment: "Universal — all vehicles requiring DOT 4",
    description: "High boiling point synthetic brake fluid."
  },
  {
    id: "OIL-1007",
    name: "Power Steering Fluid — 1L",
    brand: "Universal",
    category: "Oils & Fluids",
    price: 1100,
    stock: 30,
    fitment: "Universal — hydraulic power steering systems",
    description: "For hydraulic power steering systems."
  },
  {
    id: "OIL-1008",
    name: "Coolant / Antifreeze — 5L",
    brand: "Universal",
    category: "Oils & Fluids",
    price: 1800,
    stock: 20,
    fitment: "Universal — pre-mixed, safe for all metals",
    description: "Long-life pre-mixed coolant, red, silicate-free."
  },
  {
    id: "ELE-UNI-1001",
    name: "Car Battery 12V 65Ah",
    brand: "Universal",
    category: "Electrical",
    price: 9800,
    stock: 20,
    fitment: "Universal — most sedans and small SUVs",
    description: "Maintenance-free lead-acid battery, 18-month warranty."
  },
  {
    id: "ELE-UNI-1002",
    name: "Car Battery 12V 45Ah",
    brand: "Universal",
    category: "Electrical",
    price: 7200,
    stock: 18,
    fitment: "Universal — compact cars and hatchbacks",
    description: "Maintenance-free lead-acid battery, 12-month warranty."
  }
];
