import { MacroCategory, WineItem } from '../types';

export const RAW_DATA = `Bollicine~~~ASTI VILLA ROSA|g-BRACHETTO, COCCHI|g-PROSECCO EXTRA DRY LA VILLA|PROSECCO SUPER.NINO FRANCO|PROSECCO 375 SANTA MARGARITA|Prosecco lunetta retail rndc|CHIARETTO SPUMANTE|GRASPAROSSA EXTRA DRY, BATTAGLIOLA|MILLESIMATO SOAVE Tamellini BRUT|PRIET BLANC MONTE BIANCO BRUT|ERBALUCE BRUT MILLESIMATO G. BRUNO|FRANCIACORTA, BERLUCCHI|FRANCIA, SATEN monogram|FERRARI, BRUT|FERRARI ROSE 375|FERRARI PERLE BRUT|FRANCIA ROSATO Bellavista VINT 18|FRANCIACORTA BRUT, LA SCALA BELLAVISTA|FRANCIA CA DEL BOSCO 750|FRANCIA CA DEL BOSCO 375|BLANC DE BLANC ALTA LANGA CONTATTO|PROSECCO SUI LEVITI BRUT NATURE BORTOLOTI|FRANCIACORTA AMINANTE BARONE PIZZINI|FRANCIA CA DEL BOSCO DOSAGE ZERO|FRANCIA CA BOSCO ANNA MARIA CLEMENTE|cipriani belini retail only 200l|cirprianii bellini retail only 750ml|ROSSINI CANELLA RETAIL ONLY|MIMOSA CANELLA RETAIL ONLY
Bianchi~Sicilia~~LIGHEA ZIBBIBO, DONNAFUGATA|GRILLO-GORGHI TONDI|LA SEGRETA, PLANETA|G--ETNA BIANCO, tornatore|ETNA BIANCO benanti|CHARDONNAY, PLANETA
Rosati~Sicilia~~ETNA ROSATO GRACI
Bianchi~Calabria~~PECORELLO IPPOLITO|CIRO BIANCO VUMBACA
Rosati~Calabria~~G-CIRO, ROSATO
Bianchi~Basilicata~~BASILICATO BIANCO, MANFREDI|GRECO DI MATERA
Bianchi~Puglia~~GRAVINA, BOTROMAGNO|VERDECA, ALICE|VERDECA, VINEFRA
Bianchi~Campania~~FALANGHINA SANINO|GRECO TUFO, TERRADO|TRAMONTI COSTA D'AMALFI tenuta s francesco|LACRYMA CHRISTI, CASASETARO|ISCHIA-BIANCOLELLO-MAZZELLA|FIANO, ALFONSO ROTOLO|FIANO, BECHAR AVELLINO|PALAGRELLO t PRINCIPE
Bianchi~Sardegna~~VERMENTINO, ARGIOLAS|VERMENTINO GALLURA, SERENATA|SAMAS, AGRICOLA PUNICA (VERM-CHARD)
Bianchi~Molise~~BIFERNO DOC, GIRONA|VINCENZO, TREBBIANO blend
Bianchi~Abruzzo~~TREBBIANO CATALDI|g-PECORINO, PASSOFINO|TREBBIANO EMEDIO PEPE
Rosati~Abruzzo~~CERASUOLO, ROSINA|MONTPLC ROSATO, CIRELLI WINE O ANARCHY
Bianchi~Lazio~~EST EST RST, FALESCO|FRASCATI, PALLAVICINI|BELLONE, CASALE DI GIGLIO|FERENTANO, COTARELLA
Bianchi~Marche~~PECORINO,VELONESI OFFIDA|VERDICCHIO, METALICA zoli|VERDICCHIO, LACANOSA CASTELLI JESI
Bianchi~Toscana~Bollicine~SANGIOVES BRUT, VILLA CALCINAIA
Bianchi~Toscana~~CHARDONNAY, BANFI|TREBBIANO L'ERTA|VERNACCIA, LASTRA|VERMENTINO, PAGLIATURA|xANSONICA CECILIA
Bianchi~Umbria~~ASSISI BIANCO|ORVIETO, ARGILAE
Bianchi~Liguria~~VERMENTINO, LUNAE|PIGATO, BRUNA|MAREA 5 TERRE, BISSON
Rosati~Liguria~~BISSON CILIEGIOLO
Bianchi~Emilia-Romagna~~LAMBRUSCA|MALVASIA, BULLI|PIGNOLETTO, ORSI|ALBANA, PODERE LA BERTA
Rosati~Emilia-Romagna~~GIANDON, FARNETTO|FORTANA, SET E MEZ
Bianchi~Veneto~~G-PINOT GRIGIO CASETTO|LUGANA, ALLEGRINI|?GLERA, MONGARDA|G-SOAVE, PIEROPAN|SOAVE LA ROCCA
Rosati~Veneto~~CHIARETTO, BARDOLINO
Bianchi~Friuli Venezia Giulia~~FRIULANO, SCARBOLO|RIBOLLA GIALLA , Marco Sara|PINOT GRIGIO JERMANN|CHARDONNAY, VIE DE ROMANS|DREAMS, JERMANN|VINTAGE TUNINA, JERMANN|RADIKON, OSLAVE 500ML SAUV-CHARD
Bianchi~Piemonte~~g-MOSCATO, f bruna|MOSCATO, NIVOLE|ARNEIS,MONTEBERTOTTO|GAVI DI GAVI BROGLIA|TIMORASSO, MASSA
Rosati~Piemonte~~ROSY, PIO CESARE NEBBIOLO
Bianchi~Trentino-Alto Adige~~MULLER THURGAU,MACH|VELTLINER, ADLER|SAUVIGNON, GIRLAN|KERNER, ABBAZIA|GEWURTZTRAM, TRAMIN|RIESLING PACHERHOF|PINOT GRIGIO, FORADORI|PINOT BIANCO, TERLAN
Bianchi~Lombardia~~CHARDONNAY CA DEL BOSCO
Bianchi~Valle d'Aosta~~BLANC DE MORGEX, PAVES|BLANC DE MORGEX, ERMES PAVESE|PETIT ARVINE, GROSEAN
Rossi~Sicilia~~FRAPPATO, SAN TRESA|NERO D'AVOLA, TONNINO|*ETNA ROSSO, TORNTORE|PERRICONE, BAGLIO INGARDIA|CERASUOLO VITORIA, MANETI|ETNA ROSSO, BENANTI|LIPERI ISLAND, OSSIDANA|NERO D'AVOLA, PISCIOTTO|ETNA ROSSO , IDDA
Rossi~Calabria~~LAMEZIA, STATTI|ODOARI ROSSO, 1480|CIRO RISERVA, LIBRANDI|CIRO RISERVA, RIPE DEL FALCO
Rossi~Basilicata~~AGLIANICO VULTURE ELENA FUCCI|AGLIANICO VULTURE RE MANFFEDI|AGLIANICO VULTURE SUPERIORE DAGINESTRA
Rossi~Puglia~~NERO DI TROIA|NEGROAMARO SALICE SALENTINO Decastris RISRVA|ZINF, WANTED|PRIMITIVO DI MANDURIA TINAZZI
Rossi~Campania~~GRAGNANO, COST. SORRENTINA|AGLIANICO TERREDORO|LACRYMA CRISTI RED MASTRO|ISCHIA ROSSO Mazzella|*AGLIANICO A. ROTOLO|COSTIERA AMALFI, T. FRANCESCO|TAURASI FEUDI SAN|POMPEII VILLA DEI MISTERI
Rossi~Sardegna~~MONICA|CANNONAU, SELLA MOSCA|CARIGNANO|SUPER SARDINIAN BARRUA AGRICOLA PUNICA
Rossi~Molise~~SANG-MONT OSCO ROSSO|CABERNET DIMAJO|TINTILIA DEL MOLISE, T.Giulio|DON LUIGI DI MAJO, MONTEPUL RISERVA
Rossi~Abruzzo~~G-MONTEPULCIANO, PASSOFINO|MONTEPULCIANO JASCI|MONTPULCIANO, NICODEMI|MONTEPULCIANO, CATALDI|MONTEPULCIANO TIBERIO|MONTEPULCIANO EMIDIO PEPE
Rossi~Lazio~~CESANESE PIGLIO, VICINALE|CESANESE, DAMIANO ciolli-olevano romano|PETIT VERDOT, CASALE
Rossi~Marche~~LACRIMA MORRA, BUSCARETO|ROSSO PICENO superiore santori|VERNACCIA NERA, LA MORA
Rossi~Toscana~~MORELLINO DI SCANSANO, HEBA|MONTEREGGIO, CONTI BONAFAC|MONTECARLO, BUON AMICO|CARMIGNANO RSV, LE FARNETE|SYRAH,ROMITORO|MAREMMA TOSCANA, AURELLO|VINO NOBILE, AVIGNONESE|MAZZEI, CABERNET|ROSSO DELL'ELBA, SAVERIO
Rossi~Toscana~Chianti~CHIANTI SENESE, LASTRA|CHIANTI CLASS, SAN FELICE|CHIANTI PISA FIBBIANO|G-CHIANTI, CASALFORNO|CHIANTI, BRANCAIAI|CHIANTI CLASS, TENUTA MOCENINI|CHIANTI RISERVA TIGNANELLO|CHIANTI CLASSIC GRAN SELEZ RICASOLI BROLIO|CHIANTI GRAN SEL V.CALCIN VIGNA BASTIGNANO
Rossi~Toscana~Montalcino~ROSSO MONTAL, ARGIANO|ROSSO MONTAL, BANFI|BRUNELLO VITANZA|BRUNELLO CIACCI|BRUNELLO COL D'ORCIA|BRUNELLO VAL DI SUGA|BRUNELLO FOSSACOLE|BRUNELLO BANFI|BRUNELLO BARBI|BRUNELLO, ARGIANO 2018|Brunello, Argiano 2020|BRUNELLO ARGIANO 1.5|BRUNNELLO, IL PIOGGIONE|BRUNELLO, BIONDI SANTI
Rossi~Toscana~Supertuscan~G-SUPERTUSCAN NC ARGIANO|S.TUSCAN, MODUS|IL SEGGIO, SUPERTUSCAN|GUADO LA TASSO BRUC|VIL CALCINAIA MERLOT CASARSA|VIGORELLO, SAN FELICE|ORNELAIA, LE VOLTE|ORNELAIA|ANTINORI, TIGNANELLO|SASSACAIA, SAN GUIDO|SOLAIA
Rossi~Umbria~~ASSISI ROSSO|MONTEFALCO ROS, SCIACC|SAGRANTINO, COLPETRONE|SAGRANTINO, PAOLO BEA
Rossi~Liguria~~ROSSESE DOLC PERRINO|ORMAESCO, GUGLIERAME
Rossi~Emilia-Romagna~~G-LAMBRUSCO, NICCHIA|CLETO CHIARLI SORBARA|DRY LAMBRSCO CONCERTO|GRASPAROSSA 15 BATTAGLIOLA|SANGIOVESE CONDELLO|SANGIOVESE CESARI RISERVA
Rossi~Veneto~~BARDOLINO CLASSICO CASSETTO|G-VALPOLICELLA, ALLEGRINI|VALPOLICELLA, EDERLE|CABERNET DUGAL|RIPASSO ZOVO|RIPASSO, TOMASSI|RABOSO RISERVA ITALO CESCON
Rossi~Veneto~Amarone~AMARONE, JULIET|AMARONE MONTE ZOVO|AMARONE, TOMASSI|AMARONE RIGHETTI…add back to list|AMARONE SPERI|AMARONE BUGLIONI|AMARONE, PRA|AMARONE ALLEGRINI|AMARONE, BERTANI|VALPOICELLA DAL FORNO|AMARONE DAL FORNO
Rossi~Friuli Venezia Giulia~~xxxg-PINOT NERO, JERMANN|REFOSCO, LUISA|SCHIOPPETINO, RONCHI CIALLA RINERA
Rossi~Trentino-Alto Adige~~SCHIAVA, ELENA WALCH|LAGREIN, PLATTEN|PINOT NOIR, GIRLAN PATRICIA|TERELDEGO, FORADORI|PINOT NOIR, MAZZON BLAUBURGUND|SAN LEONARDO, GONZAGA VIG DOLMIT
Rossi~Piemonte~~GRIGNOLINO PAVIA|G-BARBERA D'ASTI , RATTI|NEBBIOLO CLARE LANGHE|NEBBIOLO, RATTI|BARBERA D'ALBA PIO CESARE|NIZZA BARBERA|DOLCETTO DOGL, S. LUIGI|RUCHE, BAVA|GAJA, MORESCO|LESSONA, NOAH|GHEMME, CHIOSSO|BOCA, CARLONE|GATTINARA, TRAVAGLIANI|CAREMA, FERRANDO
Rossi~Piemonte~Barolo~g-BAROLO PAESI TUOI|BAROLO BOSIO VERDUNO|BAROLO, GUIDOBONO COSTEMONFORTE|BAROLO ca viola NOVELLO|BAROLO BRICCO MAIOLICA DIANA D'ALBA|BAROLO, MARCENASCO LA MORRA|BAROLO MARCESNASCO 1.5L|BAROLO FONTANAFREDDA MGA LA ROSA|BAROLO LA SPINETTI GARETTI GRINZANE CAVOUR|BAROLO VIETTI CASTGLIONE FALETTO|BAROLO MANTOETTO CHERASCO|BAROLO VIBERTI SAN PIETRO RISERVA|BAROLO, BORGOGNO (BAROLO)|BAROLO BRUNA GRIMALDI MGA BADARINA SERRALUNGA|BAROLO, OLIVERO MGA BRICCO AMBROGIO-RODDI|BAROLO,M. CHIARLO MGA CEREQUIOI|BAROLO, ALDO CONTERNO MGA BUSSIA|BAROLO, BENI BAST MGA BOSCARETTO|BAROLO ELVIO COGNO MGA RAVERA NOVELLO|BAROLO PIO CESARE MGA ORNATO SERRALUNGA|BAROLO PIO CESARE MGA MOSCONI 2021|BAROLO, RATTI MGA ANNUZIATA LA MORRA|BAROLO RATTI MGA SERRADINERI LA MORRA|BAROLO, MARCHESI MGA SARMASSA|BAROLO, MARCHESI MGA CANUBI-BAROLO|BAROLO, BOVIO 3 LITER LA MORRA|BAROLO, FONTANAFREDDA LAZZARITO 2000|BAROLO, FONTANAFR LAZZARITODELIZIA 1996
Rossi~Piemonte~Barbaresco~BARBARESCO, CASTELLO DI NEIVE|BARBERESCO, PRODUTTORI|BARBARESCO CASCINA VANO NEIVE MGA CANOVA|BARBARESCO ALBINO ROCCA OVELLO MGA LORETO-BARB|BARBARESCO LANO MGA ROCCHE MASSALUPO-SAN ROCCO|BARBARESCO PIO CESAREMGA BRICCO-TREISO|BARBARESCO PRODUTTORI MGA PAJE-BARBAR|BARBARESCO, GAJA (BARB)|BARBARESCO, GAJA CRU COSTA RUSSI-BARB
Rossi~Lombardia~~LAMBRUSCO, GIANO MONTAVA|BONARDA, CAST LUZZANO|VALTELLINA, NINO NEGRI|VALTELLINA, MAMETE PROVOSTINI|VALTELLINA SFRUSAT RAINOLDI
Rossi~Valle d'Aosta~~TORETTE GROSJEAN|PINOT NOIR, OTTIN|FUMIN, OTTIN|DONNAS, CAVES COOP|ENFER D'AVREIR. THOMAIN
Dolci~~~Albana Passito, Casa Lola|Passito di Pantelleria, Donnafugata|POMELE|BAROLO CHINATO|VIN SANTO, S. FELICE375|Passito di sagrantino`;

// Acronyms and special tokens that should remain uppercase
const UPPERCASE_TOKENS = new Set([
  'DOC',
  'DOCG',
  'IGT',
  'MGA',
  'RSV',
  'NC',
  'RST',
  'RNDC',
  'CRU',
]);

// Small connecting words in Italian / French / English that should remain lowercase unless at the start of a title or phrase
const LOWERCASE_WORDS = new Set([
  'di', 'del', 'della', 'delle', 'dei', 'degli', 'da', 'dal', 'dalla',
  'e', 'ed', 'o', 'a', 'al', 'alla', 'alle', 'agli',
  'in', 'con', 'su', 'per', 'tra', 'fra',
  'il', 'lo', 'la', 'i', 'gli', 'le',
  'de', 'du', 'des', 'et', 'en',
  'of', 'the', 'and'
]);

export function normalizeWineName(str: string): string {
  if (!str) return '';

  let prefix = '';
  let rest = str.trim();

  // Match special prefixes like g-, G-, xxxg-, G--, *, ?, x
  const prefixMatch = rest.match(/^([*?xX]+|-+|g-|G-|xxxg-|G--)\s*/);
  if (prefixMatch) {
    prefix = prefixMatch[0];
    rest = rest.slice(prefix.length);
  }

  // Split into words while keeping separators (spaces, commas, hyphens, slashes, periods, apostrophes, parenthesis)
  const parts = rest.split(/([\s,.\-/'"()]+)/);

  let wordIndex = 0;
  const normalizedParts = parts.map((part) => {
    if (!part) return '';
    // If it's pure delimiter, return as is
    if (/^[\s,.\-/'"()]+$/.test(part)) {
      if (part.includes(',') || part.includes('.')) {
        // Reset word index after comma/period for sub-clause capitalizations
        wordIndex = 0;
      }
      return part;
    }

    const trimmed = part;
    const upper = trimmed.toUpperCase();

    // Check if it's an acronym like DOC, DOCG, MGA, etc.
    if (UPPERCASE_TOKENS.has(upper)) {
      wordIndex++;
      return upper;
    }

    // Check volume/vintage: e.g. 750ml, 1.5L, 200l, 375ml, 2018, 2020, 2021
    if (/^\d+(\.\d+)?[a-zA-Z]*$/.test(trimmed)) {
      wordIndex++;
      if (/^\d+(ml|ML)$/i.test(trimmed)) {
        return trimmed.toLowerCase();
      }
      if (/^\d+(\.\d+)?[lL]$/i.test(trimmed)) {
        return trimmed.slice(0, -1) + 'L';
      }
      return trimmed;
    }

    const lower = trimmed.toLowerCase();

    // Handle contractions like d'Amalfi, dell'Elba, ca', c'
    if (/^[dDlLcC]['’]/.test(lower)) {
      const apostropheIdx = lower.indexOf("'") !== -1 ? lower.indexOf("'") : lower.indexOf("’");
      const letter = lower.slice(0, apostropheIdx + 1);
      const after = lower.slice(apostropheIdx + 1);
      wordIndex++;
      if (after.length > 0) {
        return letter.toLowerCase() + after.charAt(0).toUpperCase() + after.slice(1);
      }
      return letter.toLowerCase();
    }

    // Handle ca del bosco -> Ca' del Bosco
    if (lower === 'ca') {
      wordIndex++;
      return "Ca'";
    }

    // If it's a lowercase particle and not the first word of the segment
    if (wordIndex > 0 && LOWERCASE_WORDS.has(lower)) {
      wordIndex++;
      return lower;
    }

    wordIndex++;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });

  return prefix + normalizedParts.join('');
}

export const BASE_WINES: WineItem[] = [];
RAW_DATA.split('\n').forEach((line) => {
  if (!line.trim()) return;
  const [m, r, g, ns] = line.split('~');
  ns.split('|').forEach((n) => {
    if (!n.trim()) return;
    BASE_WINES.push({
      id: String(BASE_WINES.length),
      m: m as MacroCategory,
      r: r || '',
      g: g || '',
      n: normalizeWineName(n.trim()),
    });
  });
});

export const CATEGORY_INFO: Record<MacroCategory, { key: MacroCategory; label: string }> = {
  Bollicine: { key: 'Bollicine', label: 'Sparkling' },
  Bianchi: { key: 'Bianchi', label: 'Whites' },
  Rosati: { key: 'Rosati', label: 'Rosés' },
  Rossi: { key: 'Rossi', label: 'Reds' },
  Dolci: { key: 'Dolci', label: 'Dessert' },
};

export const REGION_TRANSLATIONS: Record<string, string> = {
  'Sicilia': 'Sicily',
  'Calabria': 'Calabria',
  'Basilicata': 'Basilicata',
  'Puglia': 'Puglia',
  'Campania': 'Campania',
  'Sardegna': 'Sardinia',
  'Molise': 'Molise',
  'Abruzzo': 'Abruzzo',
  'Lazio': 'Lazio',
  'Marche': 'Marche',
  'Toscana': 'Tuscany',
  'Umbria': 'Umbria',
  'Liguria': 'Liguria',
  'Emilia-Romagna': 'Emilia-Romagna',
  'Veneto': 'Veneto',
  'Friuli Venezia Giulia': 'Friuli Venezia Giulia',
  'Trentino-Alto Adige': 'Trentino-Alto Adige',
  'Piemonte': 'Piedmont',
  'Lombardia': 'Lombardy',
  "Valle d'Aosta": "Aosta Valley",
};

export const GROUP_TRANSLATIONS: Record<string, string> = {
  'Bollicine': 'Sparkling',
  'Chianti': 'Chianti',
  'Montalcino': 'Montalcino',
  'Supertuscan': 'Super Tuscan',
  'Amarone': 'Amarone',
  'Barolo': 'Barolo',
  'Barbaresco': 'Barbaresco',
};

export function getRegionLabel(region: string): string {
  return REGION_TRANSLATIONS[region] || region;
}

export function getGroupLabel(group: string): string {
  return GROUP_TRANSLATIONS[group] || group;
}

export function getCategoryLabel(category: MacroCategory): string {
  return CATEGORY_INFO[category]?.label || category;
}

// All regions from the base list in their original order of appearance
export const ALL_BASE_REGIONS: string[] = [
  ...new Set(BASE_WINES.filter((b) => b.r).map((b) => b.r)),
];
