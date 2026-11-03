import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const imagesDir = path.join(publicDir, "images");
const appDir = path.join(rootDir, "src", "app");

await fs.mkdir(imagesDir, { recursive: true });

// 1. EMBLEM SVG (512 x 512)
const emblemSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFDF7" />
      <stop offset="85%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FDE68A" />
    </radialGradient>
    <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B91C1C" />
      <stop offset="50%" stop-color="#991B1B" />
      <stop offset="100%" stop-color="#7F1D1D" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#7F1D1D" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Outer Ring with Traditional Dots -->
  <circle cx="256" cy="256" r="240" fill="url(#bgGrad)" stroke="#991B1B" stroke-width="12" filter="url(#shadow)"/>
  <circle cx="256" cy="256" r="222" fill="none" stroke="#D97706" stroke-width="3" stroke-dasharray="6 8"/>
  <circle cx="256" cy="256" r="208" fill="none" stroke="#991B1B" stroke-width="2"/>

  <!-- Traditional Sun Rays / Grain Burst -->
  <g stroke="#D97706" stroke-width="3" stroke-linecap="round" opacity="0.8">
    <line x1="256" y1="56" x2="256" y2="76" />
    <line x1="256" y1="436" x2="256" y2="456" />
    <line x1="56" y1="256" x2="76" y2="256" />
    <line x1="436" y1="256" x2="456" y2="256" />
    <line x1="115" y1="115" x2="129" y2="129" />
    <line x1="383" y1="383" x2="397" y2="397" />
    <line x1="115" y1="397" x2="129" y2="383" />
    <line x1="383" y1="129" x2="397" y2="115" />
  </g>

  <!-- Sacred Kalash / Handi Icon in Center -->
  <!-- Base of Kalash -->
  <path d="M196 360 C196 372, 316 372, 316 360 L300 348 L212 348 Z" fill="url(#goldGrad)" />
  <!-- Body of Pot -->
  <path d="M176 270 C160 330, 210 350, 256 350 C302 350, 352 330, 336 270 C330 240, 300 230, 280 220 L232 220 C212 230, 182 240, 176 270 Z" fill="url(#terracottaGrad)" />
  <!-- Traditional Neck Band -->
  <path d="M220 220 L292 220 L288 206 L224 206 Z" fill="url(#goldGrad)" stroke="#7F1D1D" stroke-width="2"/>
  <ellipse cx="256" cy="204" rx="40" ry="10" fill="#F59E0B" stroke="#991B1B" stroke-width="3"/>

  <!-- Wheat Sheaf / Sacred Coconut / Flame atop Kalash -->
  <!-- Sacred Diya Flame -->
  <path d="M256 120 C240 155, 230 178, 230 196 C230 210, 242 220, 256 220 C270 220, 282 210, 282 196 C282 178, 272 155, 256 120 Z" fill="url(#goldGrad)" />
  <path d="M256 142 C248 165, 242 180, 242 192 C242 200, 248 208, 256 208 C264 208, 270 200, 270 192 C270 180, 264 165, 256 142 Z" fill="#FDE68A" />

  <!-- Symmetrical Grain / Wheat Ears flanking the Kalash -->
  <g fill="url(#goldGrad)" stroke="#991B1B" stroke-width="1.5">
    <!-- Left Wheat Grains -->
    <path d="M165 240 C145 220, 135 190, 150 175 C165 190, 165 220, 165 240 Z" />
    <path d="M185 200 C170 175, 165 150, 185 140 C195 160, 190 185, 185 200 Z" />
    <path d="M210 170 C200 145, 202 120, 218 115 C224 135, 218 158, 210 170 Z" />
    <!-- Right Wheat Grains -->
    <path d="M347 240 C367 220, 377 190, 362 175 C347 190, 347 220, 347 240 Z" />
    <path d="M327 200 C342 175, 347 150, 327 140 C317 160, 322 185, 327 200 Z" />
    <path d="M302 170 C312 145, 310 120, 294 115 C288 135, 294 158, 302 170 Z" />
  </g>

  <!-- Traditional Motif Bands across Pot -->
  <path d="M188 280 Q256 305 324 280" fill="none" stroke="#FEF3C7" stroke-width="4" stroke-linecap="round"/>
  <circle cx="230" cy="292" r="4" fill="#FEF3C7"/>
  <circle cx="256" cy="296" r="5" fill="#FEF3C7"/>
  <circle cx="282" cy="292" r="4" fill="#FEF3C7"/>

  <!-- Ribbon Banner at Bottom with "ESTD 2026" or "BIHAR" -->
  <path d="M160 400 L352 400 L340 432 L172 432 Z" fill="url(#terracottaGrad)" stroke="#D97706" stroke-width="3"/>
  <text x="256" y="422" font-family="Georgia, serif" font-size="19" font-weight="900" fill="#FFFDF7" text-anchor="middle" letter-spacing="4">PATNA • BIHAR</text>
</svg>
`;

// 2. FULL HORIZONTAL LOGO SVG (640 x 160)
const fullLogoSvg = `
<svg width="640" height="160" viewBox="0 0 640 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="logoBgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFDF7" />
      <stop offset="90%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FDE68A" />
    </radialGradient>
    <linearGradient id="logoTerraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9B381E" />
      <stop offset="100%" stop-color="#7C2D12" />
    </linearGradient>
    <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
  </defs>

  <!-- Left: Emblem Seal (scaled into 140x140 at x=10, y=10) -->
  <g transform="translate(10, 10) scale(0.2734)">
    <!-- Outer Ring -->
    <circle cx="256" cy="256" r="240" fill="url(#logoBgGrad)" stroke="#9B381E" stroke-width="14"/>
    <circle cx="256" cy="256" r="222" fill="none" stroke="#D97706" stroke-width="4" stroke-dasharray="6 8"/>
    <circle cx="256" cy="256" r="208" fill="none" stroke="#9B381E" stroke-width="2"/>

    <!-- Handi / Kalash -->
    <path d="M196 360 C196 372, 316 372, 316 360 L300 348 L212 348 Z" fill="url(#logoGoldGrad)" />
    <path d="M176 270 C160 330, 210 350, 256 350 C302 350, 352 330, 336 270 C330 240, 300 230, 280 220 L232 220 C212 230, 182 240, 176 270 Z" fill="url(#logoTerraGrad)" />
    <path d="M220 220 L292 220 L288 206 L224 206 Z" fill="url(#logoGoldGrad)" stroke="#7C2D12" stroke-width="2"/>
    <ellipse cx="256" cy="204" rx="40" ry="10" fill="#F59E0B" stroke="#9B381E" stroke-width="3"/>

    <!-- Flame / Wheat -->
    <path d="M256 120 C240 155, 230 178, 230 196 C230 210, 242 220, 256 220 C270 220, 282 210, 282 196 C282 178, 272 155, 256 120 Z" fill="url(#logoGoldGrad)" />
    <path d="M256 142 C248 165, 242 180, 242 192 C242 200, 248 208, 256 208 C264 208, 270 200, 270 192 C270 180, 264 165, 256 142 Z" fill="#FDE68A" />

    <!-- Grains -->
    <g fill="url(#logoGoldGrad)" stroke="#9B381E" stroke-width="2">
      <path d="M165 240 C145 220, 135 190, 150 175 C165 190, 165 220, 165 240 Z" />
      <path d="M185 200 C170 175, 165 150, 185 140 C195 160, 190 185, 185 200 Z" />
      <path d="M347 240 C367 220, 377 190, 362 175 C347 190, 347 220, 347 240 Z" />
      <path d="M327 200 C342 175, 347 150, 327 140 C317 160, 322 185, 327 200 Z" />
    </g>
    <!-- Bands -->
    <path d="M188 280 Q256 305 324 280" fill="none" stroke="#FEF3C7" stroke-width="5" stroke-linecap="round"/>
    <circle cx="256" cy="296" r="6" fill="#FEF3C7"/>
  </g>

  <!-- Right: Typography -->
  <g transform="translate(165, 0)">
    <!-- Brand Name with Colon -->
    <text x="0" y="78" font-family="'Playfair Display', Georgia, 'Times New Roman', serif" font-size="46" font-weight="900" fill="#9B381E" letter-spacing="-0.5">
      BIHARI BITES:
    </text>

    <!-- Tagline: SWAD ASLI • CRUNCH DESI -->
    <text x="3" y="112" font-family="'Cinzel', 'Trajan Pro', Georgia, serif" font-size="16" font-weight="800" fill="#B45309" letter-spacing="4">
      SWAD ASLI • CRUNCH DESI
    </text>

    <!-- Heritage Flourish Divider -->
    <g stroke="#D97706" stroke-width="1.5" opacity="0.85">
      <line x1="3" y1="126" x2="160" y2="126" />
      <circle cx="166" cy="126" r="2.5" fill="#9B381E" />
      <polygon points="174,123 180,126 174,129" fill="#D97706"/>
      <circle cx="188" cy="126" r="2.5" fill="#9B381E" />
      <line x1="194" y1="126" x2="350" y2="126" />
    </g>

    <text x="3" y="145" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#78350F" letter-spacing="1.5">
      ARTISANAL DELICACIES • HANDCRAFTED IN BIHAR
    </text>
  </g>
</svg>
`;

// 3. OPEN GRAPH (OG) BANNER SVG (1200 x 630 - Centered Safe Zone for WhatsApp & Social)
const ogBannerSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ogBg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#451A03" />
      <stop offset="60%" stop-color="#2A1810" />
      <stop offset="100%" stop-color="#180C07" />
    </radialGradient>
    <linearGradient id="ogGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="ogTerra" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="50%" stop-color="#DC2626" />
      <stop offset="100%" stop-color="#991B1B" />
    </linearGradient>
  </defs>

  <!-- Deep Warm Mahogany Background -->
  <rect width="1200" height="630" fill="url(#ogBg)"/>

  <!-- Ornate Golden Borders (Indian Heritage Style) -->
  <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="url(#ogGold)" stroke-width="2" opacity="0.65"/>
  <rect x="34" y="34" width="1132" height="562" rx="12" fill="none" stroke="#F59E0B" stroke-width="1" stroke-dasharray="8 8" opacity="0.35"/>

  <!-- Corner Ornaments -->
  <g fill="#F59E0B" opacity="0.8">
    <circle cx="44" cy="44" r="5" />
    <circle cx="1156" cy="44" r="5" />
    <circle cx="44" cy="586" r="5" />
    <circle cx="1156" cy="586" r="5" />
  </g>

  <!-- Top Trust Pill -->
  <g transform="translate(390, 52)">
    <rect width="420" height="34" rx="17" fill="#F59E0B" fill-opacity="0.18" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="210" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#FDE68A" text-anchor="middle" letter-spacing="2.5">
      AUTHENTIC BIHAR PANTRY • 100% SHUDDH DESI
    </text>
  </g>

  <!-- Center Emblem Seal (Scaled at center x=600, y=105) -->
  <g transform="translate(545, 105) scale(0.215)">
    <circle cx="256" cy="256" r="240" fill="#FFFDF7" stroke="#991B1B" stroke-width="14"/>
    <circle cx="256" cy="256" r="222" fill="none" stroke="#D97706" stroke-width="4" stroke-dasharray="6 8"/>
    <circle cx="256" cy="256" r="208" fill="none" stroke="#991B1B" stroke-width="2"/>
    <path d="M196 360 C196 372, 316 372, 316 360 L300 348 L212 348 Z" fill="#D97706" />
    <path d="M176 270 C160 330, 210 350, 256 350 C302 350, 352 330, 336 270 C330 240, 300 230, 280 220 L232 220 C212 230, 182 240, 176 270 Z" fill="#991B1B" />
    <ellipse cx="256" cy="204" rx="40" ry="10" fill="#F59E0B" stroke="#991B1B" stroke-width="3"/>
    <path d="M256 120 C240 155, 230 178, 230 196 C230 210, 242 220, 256 220 C270 220, 282 210, 282 196 C282 178, 272 155, 256 120 Z" fill="#F59E0B" />
    <path d="M256 142 C248 165, 242 180, 242 192 C242 200, 248 208, 256 208 C264 208, 270 200, 270 192 C270 180, 264 165, 256 142 Z" fill="#FDE68A" />
  </g>

  <!-- Main Headline (Centered) -->
  <text x="600" y="275" font-family="'Playfair Display', Georgia, serif" font-size="64" font-weight="900" fill="#FFFDF7" text-anchor="middle" letter-spacing="-0.5">
    BIHARI BITES:
  </text>
  <text x="600" y="322" font-family="'Cinzel', Georgia, serif" font-size="28" font-weight="800" fill="url(#ogGold)" text-anchor="middle" letter-spacing="5">
    SWAD ASLI • CRUNCH DESI
  </text>

  <!-- Tagline / Subtitle (Centered) -->
  <text x="600" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="500" fill="#E5E7EB" text-anchor="middle">
    Handcrafted Khasta Thekua, Stone-Ground Sattu &amp; Sun-Cured Bharua Aachar
  </text>
  <text x="600" y="395" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400" fill="#9CA3AF" text-anchor="middle">
    Made fresh in Patna using heirloom recipes • Pure Cow Desi Ghee • Fast Pan-India Delivery
  </text>

  <!-- 4 Delicacy Badges Row (Centered) -->
  <g transform="translate(85, 435)">
    <!-- Badge 1: Thekua -->
    <rect x="0" y="0" width="240" height="76" rx="14" fill="#3A1C14" stroke="#78350F" stroke-width="1.5"/>
    <text x="18" y="34" font-family="system-ui" font-size="22">🥮</text>
    <text x="50" y="32" font-family="'Playfair Display', Georgia, serif" font-size="16" font-weight="800" fill="#FFFDF7">Khasta Thekua</text>
    <text x="50" y="56" font-family="system-ui" font-size="12" font-weight="600" fill="#FCD34D">Shuddh Cow Desi Ghee</text>

    <!-- Badge 2: Sattu -->
    <rect x="265" y="0" width="240" height="76" rx="14" fill="#3A1C14" stroke="#78350F" stroke-width="1.5"/>
    <text x="283" y="34" font-family="system-ui" font-size="22">🌾</text>
    <text x="315" y="32" font-family="'Playfair Display', Georgia, serif" font-size="16" font-weight="800" fill="#FFFDF7">Chana Sattu</text>
    <text x="315" y="56" font-family="system-ui" font-size="12" font-weight="600" fill="#FCD34D">Stone-Ground Roasted</text>

    <!-- Badge 3: Aachar -->
    <rect x="530" y="0" width="240" height="76" rx="14" fill="#3A1C14" stroke="#78350F" stroke-width="1.5"/>
    <text x="548" y="34" font-family="system-ui" font-size="22">🌶️</text>
    <text x="580" y="32" font-family="'Playfair Display', Georgia, serif" font-size="16" font-weight="800" fill="#FFFDF7">Bharua Aachar</text>
    <text x="580" y="56" font-family="system-ui" font-size="12" font-weight="600" fill="#FCD34D">Sun-Cured Lal Mirch</text>

    <!-- Badge 4: Ghee -->
    <rect x="795" y="0" width="235" height="76" rx="14" fill="#3A1C14" stroke="#78350F" stroke-width="1.5"/>
    <text x="813" y="34" font-family="system-ui" font-size="22">🧈</text>
    <text x="845" y="32" font-family="'Playfair Display', Georgia, serif" font-size="16" font-weight="800" fill="#FFFDF7">Bilona Cow Ghee</text>
    <text x="845" y="56" font-family="system-ui" font-size="12" font-weight="600" fill="#FCD34D">Danedar Aromatic</text>
  </g>

  <!-- Bottom Bar: URL & Helpline (Centered) -->
  <g transform="translate(0, 560)">
    <text x="600" y="0" font-family="'Cinzel', Georgia, serif" font-size="18" font-weight="900" fill="url(#ogGold)" text-anchor="middle" letter-spacing="3">
      BIHARIBITES.COM • PAN-INDIA DELIVERY • WHATSAPP: +91 7281991952
    </text>
  </g>
</svg>
`;

console.log("Writing SVG assets...");
await fs.writeFile(path.join(imagesDir, "logo-emblem.svg"), emblemSvg.trim());
await fs.writeFile(path.join(imagesDir, "logo.svg"), fullLogoSvg.trim());
await fs.writeFile(path.join(publicDir, "og-image.svg"), ogBannerSvg.trim());

console.log("Generating PNG, ICO and WebP assets with Sharp...");

// 1. Logo PNG (high-res 1280 x 320)
await sharp(Buffer.from(fullLogoSvg))
  .resize(1280, 320)
  .png({ quality: 100 })
  .toFile(path.join(imagesDir, "logo.png"));

// 2. Emblem PNG (512 x 512)
await sharp(Buffer.from(emblemSvg))
  .resize(512, 512)
  .png({ quality: 100 })
  .toFile(path.join(imagesDir, "logo-emblem.png"));

// 3. Favicon & App Icons
await sharp(Buffer.from(emblemSvg))
  .resize(512, 512)
  .png({ quality: 100 })
  .toFile(path.join(appDir, "icon.png"));

await sharp(Buffer.from(emblemSvg))
  .resize(180, 180)
  .png({ quality: 100 })
  .toFile(path.join(appDir, "apple-icon.png"));

await sharp(Buffer.from(emblemSvg))
  .resize(32, 32)
  .png({ quality: 100 })
  .toFile(path.join(publicDir, "favicon.ico"));

await sharp(Buffer.from(emblemSvg))
  .resize(32, 32)
  .png({ quality: 100 })
  .toFile(path.join(appDir, "favicon.ico"));

await sharp(Buffer.from(emblemSvg))
  .resize(192, 192)
  .png({ quality: 100 })
  .toFile(path.join(publicDir, "icon.png"));

// 4. OpenGraph Image (1200 x 630) - High-compatibility JPEG under 200KB for WhatsApp & Socials
await sharp(Buffer.from(ogBannerSvg))
  .resize(1200, 630)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(publicDir, "og-image.jpg"));

await sharp(Buffer.from(ogBannerSvg))
  .resize(1200, 630)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(appDir, "opengraph-image.jpg"));

// Clean up old png if it exists
try {
  await fs.unlink(path.join(appDir, "opengraph-image.png"));
} catch {}

console.log("All brand assets successfully generated!");
