/**
 * Canonical pet breed catalog for Asty Petshop Manager.
 *
 * This module is the single source of truth for:
 * - the breed names the UI suggests,
 * - the legacy/misspelled aliases that should still resolve,
 * - and the fuzzy matching used when writing a pet.
 *
 * It is imported by both the backend (normalization before Prisma writes) and
 * the frontend (searchable autocomplete). The catalog is intentionally broad
 * enough to cover the common dog and cat breeds seen in a grooming salon.
 *
 * Unknown values are not discarded: `normalizePetBreed` keeps the cleaned
 * text so custom/rare breeds can still be stored. When a value is recognized,
 * the canonical catalog spelling is persisted instead.
 */

interface PetBreedDefinitionShape {
    readonly name: string;
    readonly species: "dog" | "cat";
    readonly aliases: readonly string[];
}

export const PET_BREED_DEFINITIONS = [
    // Popular dog breeds first: this is also the order shown when the
    // autocomplete is focused before the user types.
    {
        name: "Pug",
        species: "dog",
        aliases: ["carlino", "pug chino"],
    },
    {
        name: "Poodle",
        species: "dog",
        aliases: [
            "caniche",
            "pudle",
            "pudel",
            "podier",
            "podier negro",
            "poodle negro",
            "poodle toy",
            "poodle miniatura",
            "caniche toy",
            "caniche miniatura",
            "poodle frances",
        ],
    },
    {
        name: "Golden Retriever",
        species: "dog",
        aliases: ["golden", "goldn", "golden retriver", "golden retriever dorado"],
    },
    {
        name: "Labrador Retriever",
        species: "dog",
        aliases: ["labrador", "lab", "labrador dorado", "labrador negro"],
    },
    {
        name: "Husky Siberiano",
        species: "dog",
        aliases: ["husky", "huski", "josky", "siberian husky"],
    },
    {
        name: "Schnauzer",
        species: "dog",
        aliases: ["sanuser", "esnauser", "shnauzer", "snauzer", "schnauzer miniatura", "schnauzer gigante"],
    },
    {
        name: "Cocker Spaniel",
        species: "dog",
        aliases: ["cocker", "coker", "koker", "cockel", "cocker ingles"],
    },
    {
        name: "Chihuahua",
        species: "dog",
        aliases: ["chihuahueno", "chihuahueño", "chihuahita", "chihuahua miniatura"],
    },
    {
        name: "Yorkshire Terrier",
        species: "dog",
        aliases: ["yorkie", "yorkshire", "yorki", "yorshire"],
    },
    {
        name: "Shih Tzu",
        species: "dog",
        aliases: ["shitzu", "chipzu", "chitzu"],
    },
    {
        name: "Maltés",
        species: "dog",
        aliases: ["bichon maltes", "maltese"],
    },
    {
        name: "Bichón Frisé",
        species: "dog",
        aliases: ["bichon", "bichon frise", "bichon frisse"],
    },
    {
        name: "Bulldog Francés",
        species: "dog",
        aliases: ["bulldog frances", "french bulldog", "frenchie", "bulldog fraces"],
    },
    {
        name: "Bulldog Inglés",
        species: "dog",
        aliases: ["bulldog ingles", "english bulldog", "bulldog"],
    },
    {
        name: "Beagle",
        species: "dog",
        aliases: ["bigle", "beagel"],
    },
    {
        name: "Border Collie",
        species: "dog",
        aliases: ["border", "bordir collie", "border colli"],
    },
    {
        name: "Pastor Alemán",
        species: "dog",
        aliases: [
            "pastor",
            "pastor aleman",
            "ovejero",
            "ovejero aleman",
            "german shepherd",
            "alsatian",
            "pastor alsaciano",
        ],
    },
    {
        name: "Pastor Blanco Suizo",
        species: "dog",
        aliases: ["pastor suizo", "pastor blanco", "white swiss shepherd", "swiss shepherd"],
    },
    {
        name: "Pastor Australiano",
        species: "dog",
        aliases: ["pastor australiano", "australian shepherd", "aussie"],
    },
    {
        name: "Pastor Belga",
        species: "dog",
        aliases: ["pastor belga", "malinois", "belgian shepherd"],
    },
    {
        name: "Collie",
        species: "dog",
        aliases: ["koli", "colli", "rough collie"],
    },
    {
        name: "Pomerania",
        species: "dog",
        aliases: ["pomeranian", "pomeranio", "pom"],
    },
    {
        name: "Dachshund",
        species: "dog",
        aliases: ["salchicha", "perro salchicha", "teckel", "dackel"],
    },
    {
        name: "Rottweiler",
        species: "dog",
        aliases: ["rotweiler", "rott"],
    },
    {
        name: "Doberman",
        species: "dog",
        aliases: ["doberman pinscher", "dobermann", "dobberman"],
    },
    {
        name: "Boxer",
        species: "dog",
        aliases: ["boxer", "boxer aleman"],
    },
    {
        name: "Gran Danés",
        species: "dog",
        aliases: ["gran danes", "dogo aleman", "great dane", "alano"],
    },
    {
        name: "San Bernardo",
        species: "dog",
        aliases: ["san bernardo", "san bernard", "sambernardo", "saint bernard"],
    },
    {
        name: "Mastín Inglés",
        species: "dog",
        aliases: ["mastin", "mastiff", "english mastiff", "mastin ingles"],
    },
    {
        name: "Mastín Napolitano",
        species: "dog",
        aliases: ["mastin napolitano", "neapolitan mastiff", "mastino napoletano"],
    },
    {
        name: "Bullmastiff",
        species: "dog",
        aliases: ["bull mastiff", "bullmastin"],
    },
    {
        name: "Mastín Tibetano",
        species: "dog",
        aliases: ["mastin tibetano", "tibetan mastiff"],
    },
    {
        name: "Dogo Argentino",
        species: "dog",
        aliases: ["dogo", "dogo argentino", "argentine dogo"],
    },
    {
        name: "Dogo de Burdeos",
        species: "dog",
        aliases: ["dogo de burdeos", "dogo burdeos", "burdeos", "french mastiff"],
    },
    {
        name: "American Pit Bull Terrier",
        species: "dog",
        aliases: ["pitbull", "pit bull", "pitbull terrier", "american pitbull", "pitbull americano"],
    },
    {
        name: "American Staffordshire Terrier",
        species: "dog",
        aliases: ["amstaff", "staffordshire", "stafford", "american staffordshire"],
    },
    {
        name: "American Bully",
        species: "dog",
        aliases: ["bully", "american bully"],
    },
    {
        name: "Bull Terrier",
        species: "dog",
        aliases: ["bullterrier"],
    },
    {
        name: "Boston Terrier",
        species: "dog",
        aliases: ["boston"],
    },
    {
        name: "Jack Russell Terrier",
        species: "dog",
        aliases: ["jack russell", "jack russel", "jack", "parson russell"],
    },
    {
        name: "Fox Terrier",
        species: "dog",
        aliases: ["fox", "fox terrier pelo duro", "fox terrier pelo liso"],
    },
    {
        name: "West Highland White Terrier",
        species: "dog",
        aliases: ["westie", "west highland", "west highland white terrier"],
    },
    {
        name: "Scottish Terrier",
        species: "dog",
        aliases: ["scottie", "scottish terrier"],
    },
    {
        name: "Cairn Terrier",
        species: "dog",
        aliases: ["cairn"],
    },
    {
        name: "Pinscher Miniatura",
        species: "dog",
        aliases: ["pinscher", "min pin", "miniature pinscher", "pinscher mini"],
    },
    {
        name: "Lhasa Apso",
        species: "dog",
        aliases: ["lhasa", "lasa apso"],
    },
    {
        name: "Pekinés",
        species: "dog",
        aliases: ["pekin", "pekingese"],
    },
    {
        name: "Chow Chow",
        species: "dog",
        aliases: ["chow", "chowchow"],
    },
    {
        name: "Shar Pei",
        species: "dog",
        aliases: ["sharpei", "shar-pei"],
    },
    {
        name: "Akita",
        species: "dog",
        aliases: ["akita inu", "akita americano"],
    },
    {
        name: "Shiba Inu",
        species: "dog",
        aliases: ["shiba"],
    },
    {
        name: "Samoyedo",
        species: "dog",
        aliases: ["samoyed"],
    },
    {
        name: "Alaskan Malamute",
        species: "dog",
        aliases: ["malamute", "malamut"],
    },
    {
        name: "Terranova",
        species: "dog",
        aliases: ["newfoundland", "newfoundland dog"],
    },
    {
        name: "Boyero de Berna",
        species: "dog",
        aliases: ["boyero de berna", "bernese mountain dog", "bernes", "berner sennenhund"],
    },
    {
        name: "Boyero de Flandes",
        species: "dog",
        aliases: ["bouvier des flandres", "bouvier", "boyero de flandes"],
    },
    {
        name: "Leonberger",
        species: "dog",
        aliases: ["leonberg"],
    },
    {
        name: "Cane Corso",
        species: "dog",
        aliases: ["corso", "italian mastiff"],
    },
    {
        name: "Presa Canario",
        species: "dog",
        aliases: ["perro de presa canario", "dogo canario"],
    },
    {
        name: "Fila Brasileño",
        species: "dog",
        aliases: ["fila brasileno", "fila brasileiro", "fila"],
    },
    {
        name: "Braco de Weimar",
        species: "dog",
        aliases: ["weimaraner", "braco weimar"],
    },
    {
        name: "Pointer",
        species: "dog",
        aliases: ["pointer ingles", "english pointer"],
    },
    {
        name: "Setter Irlandés",
        species: "dog",
        aliases: ["setter irlandes", "irish setter", "setter rojo"],
    },
    {
        name: "Setter Inglés",
        species: "dog",
        aliases: ["setter ingles", "english setter"],
    },
    {
        name: "Bretón",
        species: "dog",
        aliases: ["breton", "brittany", "spaniel breton"],
    },
    {
        name: "Springer Spaniel",
        species: "dog",
        aliases: ["springer", "english springer spaniel"],
    },
    {
        name: "Vizsla",
        species: "dog",
        aliases: ["hungarian vizsla"],
    },
    {
        name: "Sabueso",
        species: "dog",
        aliases: ["hound", "sabueso español", "sabueso comun"],
    },
    {
        name: "Bloodhound",
        species: "dog",
        aliases: ["sabueso de san huberto"],
    },
    {
        name: "Basset Hound",
        species: "dog",
        aliases: ["basset", "basset hound"],
    },
    {
        name: "Galgo",
        species: "dog",
        aliases: ["galgo español", "greyhound", "galgo ingles"],
    },
    {
        name: "Lebrel Afgano",
        species: "dog",
        aliases: ["afghan hound", "afgano"],
    },
    {
        name: "Borzoi",
        species: "dog",
        aliases: ["lebrel ruso"],
    },
    {
        name: "Podenco",
        species: "dog",
        aliases: ["podenco andaluz", "podenco ibicenco"],
    },
    {
        name: "Crestado Chino",
        species: "dog",
        aliases: ["chinese crested", "crestado"],
    },
    {
        name: "Xoloitzcuintle",
        species: "dog",
        aliases: ["xolo", "perro pelon mexicano", "mexican hairless"],
    },
    {
        name: "Papillón",
        species: "dog",
        aliases: ["papillon", "papilon", "spaniel enano"],
    },
    {
        name: "Corgi",
        species: "dog",
        aliases: ["welsh corgi", "pembroke", "corgi gales", "corgi galés"],
    },
    {
        name: "Dálmata",
        species: "dog",
        aliases: ["dalmatian"],
    },
    {
        name: "Perro de Agua Español",
        species: "dog",
        aliases: ["spanish water dog", "perro de agua"],
    },
    {
        name: "Bobtail",
        species: "dog",
        aliases: ["old english sheepdog"],
    },
    {
        name: "Pastor de Shetland",
        species: "dog",
        aliases: ["shetland", "sheltie", "shetland sheepdog"],
    },
    {
        name: "Mestizo",
        species: "dog",
        aliases: ["mestiza", "mestizo gis", "mixto", "mixta", "cruce", "cruzado", "cruzada", "mixed", "mixed breed"],
    },
    {
        name: "Criollo",
        species: "dog",
        aliases: ["criolla", "criollito", "criollo de la calle"],
    },

    // Cat breeds
    {
        name: "Persa",
        species: "cat",
        aliases: ["gato persa", "persian"],
    },
    {
        name: "Siamés",
        species: "cat",
        aliases: ["gato siames", "siamese"],
    },
    {
        name: "Maine Coon",
        species: "cat",
        aliases: ["main coon", "mainecon", "gato maine coon"],
    },
    {
        name: "Ragdoll",
        species: "cat",
        aliases: ["rag doll"],
    },
    {
        name: "Bengalí",
        species: "cat",
        aliases: ["bengal", "bengala", "gato bengali"],
    },
    {
        name: "Abisinio",
        species: "cat",
        aliases: ["abyssinian", "gato abisinio"],
    },
    {
        name: "Británico de Pelo Corto",
        species: "cat",
        aliases: ["british shorthair", "british", "gato britanico"],
    },
    {
        name: "Ruso Azul",
        species: "cat",
        aliases: ["azul ruso", "russian blue"],
    },
    {
        name: "Scottish Fold",
        species: "cat",
        aliases: ["fold escoces"],
    },
    {
        name: "Esfinge",
        species: "cat",
        aliases: ["sphynx", "sphinx", "gato esfinge"],
    },
    {
        name: "Bosque de Noruega",
        species: "cat",
        aliases: ["norwegian forest cat", "noruego del bosque", "bosque noruego"],
    },
    {
        name: "Angora Turco",
        species: "cat",
        aliases: ["turkish angora", "angora"],
    },
    {
        name: "Gato Siberiano",
        species: "cat",
        aliases: ["gato siberiano", "siberian cat"],
    },
    {
        name: "Devon Rex",
        species: "cat",
        aliases: ["devon"],
    },
    {
        name: "Cornish Rex",
        species: "cat",
        aliases: ["cornish"],
    },
    {
        name: "Munchkin",
        species: "cat",
        aliases: ["gato munchkin"],
    },
    {
        name: "Manx",
        species: "cat",
        aliases: ["gato manx"],
    },
    {
        name: "Chartreux",
        species: "cat",
        aliases: ["cartujo"],
    },
    {
        name: "Burmés",
        species: "cat",
        aliases: ["burmese", "burman"],
    },
    {
        name: "Ocicat",
        species: "cat",
        aliases: [],
    },
    {
        name: "Savannah",
        species: "cat",
        aliases: ["savana"],
    },
    {
        name: "Europeo de Pelo Corto",
        species: "cat",
        aliases: ["european shorthair", "europeo pelo corto"],
    },
    {
        name: "Exótico de Pelo Corto",
        species: "cat",
        aliases: ["exotic shorthair", "exotico pelo corto"],
    },
    {
        name: "Himalayo",
        species: "cat",
        aliases: ["himalayan", "gato himalayo"],
    },
    {
        name: "Turco Van",
        species: "cat",
        aliases: ["turkish van", "van turco"],
    },
    {
        name: "Somalí",
        species: "cat",
        aliases: ["somali", "gato somali"],
    },
    {
        name: "Birmano",
        species: "cat",
        aliases: ["birman", "sagrado de birmania"],
    },
] as const satisfies readonly PetBreedDefinitionShape[];

export type PetBreedDefinition = (typeof PET_BREED_DEFINITIONS)[number];
export type PetBreed = PetBreedDefinition["name"];
export type PetSpecies = PetBreedDefinition["species"];

export const PET_BREEDS: readonly PetBreed[] = PET_BREED_DEFINITIONS.map(
    definition => definition.name,
);

export const PET_BREED_BY_NAME: ReadonlyMap<PetBreed, PetBreedDefinition> = new Map(
    PET_BREED_DEFINITIONS.map(definition => [definition.name, definition]),
);

/**
 * Normalizes text for comparisons: lowercase, accent-insensitive, punctuation
 * collapsed to spaces. "Shih-Tzu", "SHIH TZU" and "shíh tzú" all become
 * "shih tzu".
 */
export const normalizeBreedText = (value: string | null | undefined): string => {
    if (typeof value !== "string") {
        return "";
    }

    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

/**
 * Cleans a free-text breed while preserving its original spelling. This is the
 * fallback for values that do not belong to the catalog.
 */
export const cleanPetBreedText = (value: string | null | undefined): string => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim().replace(/\s+/g, " ");
};

/**
 * Classic Levenshtein edit distance with two rows of memory. Inputs are
 * expected to be normalized already, but the function is case-sensitive and
 * accent-sensitive by design so it can also be reused directly.
 */
export const levenshteinDistance = (source: string, target: string): number => {
    if (source === target) {
        return 0;
    }

    if (source.length === 0) {
        return target.length;
    }

    if (target.length === 0) {
        return source.length;
    }

    const previous = new Array<number>(target.length + 1);
    const current = new Array<number>(target.length + 1);

    for (let column = 0; column <= target.length; column += 1) {
        previous[column] = column;
    }

    for (let row = 1; row <= source.length; row += 1) {
        current[0] = row;

        for (let column = 1; column <= target.length; column += 1) {
            const substitutionCost = source[row - 1] === target[column - 1] ? 0 : 1;
            current[column] = Math.min(
                current[column - 1] + 1,
                previous[column] + 1,
                previous[column - 1] + substitutionCost,
            );
        }

        for (let column = 0; column <= target.length; column += 1) {
            previous[column] = current[column];
        }
    }

    return previous[target.length];
};

export type PetBreedMatchKind = "exact" | "contains" | "prefix" | "fuzzy";

export interface PetBreedMatch {
    readonly breed: PetBreed;
    readonly species: PetSpecies;
    readonly kind: PetBreedMatchKind;
    /** The catalog term that produced the match (canonical name or alias). */
    readonly matchedText: string;
    readonly matchedAlias: boolean;
    readonly distance: number;
    /** 0..1, where 1 means an exact catalog match. */
    readonly confidence: number;
}

interface SearchTerm {
    readonly value: string;
    readonly isAlias: boolean;
}

interface BreedEntry {
    readonly breed: PetBreed;
    readonly species: PetSpecies;
    readonly normalizedName: string;
    readonly terms: readonly SearchTerm[];
    readonly order: number;
}

const CANONICAL_LOOKUP = new Map<string, PetBreed>();
const ALIAS_LOOKUP = new Map<string, PetBreed>();
const SEARCH_ENTRIES: BreedEntry[] = [];

for (const [order, definition] of PET_BREED_DEFINITIONS.entries()) {
    const normalizedName = normalizeBreedText(definition.name);
    const terms: SearchTerm[] = [{value: normalizedName, isAlias: false}];
    const seenTerms = new Set([normalizedName]);

    CANONICAL_LOOKUP.set(normalizedName, definition.name);

    for (const alias of definition.aliases) {
        const normalizedAlias = normalizeBreedText(alias);

        if (!normalizedAlias || seenTerms.has(normalizedAlias)) {
            continue;
        }

        seenTerms.add(normalizedAlias);
        ALIAS_LOOKUP.set(normalizedAlias, definition.name);
        terms.push({value: normalizedAlias, isAlias: true});
    }

    SEARCH_ENTRIES.push({
        breed: definition.name,
        species: definition.species,
        normalizedName,
        terms,
        order,
    });
}

/**
 * Returns catalog metadata for a canonical name (case/accent-insensitive).
 * Alias lookup is intentionally not fuzzy here; use `findPetBreed` for that.
 */
export const getPetBreedDefinition = (
    value: string | null | undefined,
): PetBreedDefinition | null => {
    const normalized = normalizeBreedText(value);
    const canonical = CANONICAL_LOOKUP.get(normalized);

    return canonical ? PET_BREED_BY_NAME.get(canonical) ?? null : null;
};

const hasWholePhrase = (query: string, term: string): boolean => {
    if (term.length < 3) {
        return false;
    }

    return ` ${query} `.includes(` ${term} `);
};

const maxFuzzyDistance = (length: number): number => {
    if (length <= 4) {
        return 1;
    }

    if (length <= 7) {
        return 2;
    }

    return 3;
};

/**
 * A breed field often receives size, colour or coat words on their own. They
 * are useful inside a catalog name ("schnauzer gigante") but they must not be
 * persisted as a guessed breed when no name was typed.
 */
const NON_DISTINCTIVE_BREED_WORDS = new Set([
    "adulto", "cachorro", "joven", "senior", "macho", "hembra",
    "toy", "mini", "miniatura", "gigante", "enano", "enana",
    "pequeno", "pequena", "mediano", "mediana", "grande",
    "pelo", "corto", "corta", "largo", "larga", "duro", "dura", "liso", "lisa",
    "negro", "negra", "blanco", "blanca", "marron", "gris", "dorado", "dorada",
    "azul", "rojo", "roja", "atigrado", "atigrada", "bicolor", "tricolor",
    "crema", "chocolate", "canela", "arena", "plateado", "plateada",
    "calle", "color", "comun", "raza",
]);

interface FuzzyWordMatch {
    readonly variant: string;
    readonly distance: number;
    readonly maxLength: number;
    readonly similarity: number;
}

/**
 * Compares the query against the full term and, for canonical names, its
 * words. Comparing words separately is what lets "goldn" resolve to
 * "Golden Retriever" and "huski" to "Husky Siberiano". Alias words are
 * intentionally skipped: legacy aliases such as "mestizo gis" contain noise
 * that would otherwise attract unrelated typos.
 */
const getBestFuzzyWordMatch = (
    query: string,
    term: string,
    includeWords = true,
): FuzzyWordMatch => {
    const variants = new Set<string>([term]);

    if (includeWords) {
        for (const word of term.split(" ")) {
            if (word.length >= 3) {
                variants.add(word);
            }
        }
    }

    let best: FuzzyWordMatch | null = null;

    for (const variant of variants) {
        const distance = levenshteinDistance(query, variant);
        const maxLength = Math.max(query.length, variant.length);
        const similarity = 1 - distance / maxLength;

        if (!best ||
            similarity > best.similarity ||
            (similarity === best.similarity && distance < best.distance)) {
            best = {variant, distance, maxLength, similarity};
        }
    }

    return best ?? {variant: term, distance: query.length + term.length, maxLength: 1, similarity: 0};
};

const isFuzzySearchCandidate = (query: string, match: FuzzyWordMatch): boolean => {
    if (query.length < 3 || match.distance > maxFuzzyDistance(match.maxLength)) {
        return false;
    }

    return match.similarity >= 0.55;
};

const isFuzzyResolveCandidate = (query: string, match: FuzzyWordMatch): boolean => {
    const shortestLength = Math.min(query.length, match.variant.length);

    if (query.length < 3 || match.distance > maxFuzzyDistance(shortestLength)) {
        return false;
    }

    // Never resolve to a size/colour/coat modifier on its own.
    if (NON_DISTINCTIVE_BREED_WORDS.has(match.variant)) {
        return false;
    }

    // A different first letter is usually a different word, not a typo.
    if (query[0] !== match.variant[0]) {
        return false;
    }

    return match.similarity >= 0.6;
};

interface FuzzyBreedCandidate {
    readonly entry: BreedEntry;
    readonly term: SearchTerm;
    readonly match: FuzzyWordMatch;
}

const compareFuzzyCandidates = (a: FuzzyBreedCandidate, b: FuzzyBreedCandidate): number => (
    b.match.similarity - a.match.similarity ||
    a.match.distance - b.match.distance ||
    a.entry.order - b.entry.order
);

const areFuzzyCandidatesAmbiguous = (
    first: FuzzyBreedCandidate,
    second: FuzzyBreedCandidate,
): boolean => (
    first.entry.breed !== second.entry.breed &&
    first.match.distance === second.match.distance &&
    first.match.similarity === second.match.similarity
);

/**
 * Resolves a free-text breed to the catalog. This is the strict path used for
 * persistence:
 *
 * 1. exact canonical name or alias,
 * 2. the text contains a complete catalog term ("golden retriever macho"),
 * 3. an unambiguous prefix ("pood" -> Poodle, "gold" -> Golden Retriever),
 * 4. a conservative fuzzy match ("puh"/"pugg" -> Pug).
 *
 * Short or genuinely ambiguous queries ("pu", "siberiano") deliberately do not
 * resolve automatically; the UI shows suggestions instead. Ambiguous aliases
 * are handled explicitly in the catalog.
 */
export const findPetBreed = (
    value: string | null | undefined,
): PetBreedMatch | null => {
    const query = normalizeBreedText(value);

    if (!query) {
        return null;
    }

    const canonical = CANONICAL_LOOKUP.get(query);

    if (canonical) {
        return {
            breed: canonical,
            species: PET_BREED_BY_NAME.get(canonical)?.species ?? "dog",
            kind: "exact",
            matchedText: canonical,
            matchedAlias: false,
            distance: 0,
            confidence: 1,
        };
    }

    const alias = ALIAS_LOOKUP.get(query);

    if (alias) {
        return {
            breed: alias,
            species: PET_BREED_BY_NAME.get(alias)?.species ?? "dog",
            kind: "exact",
            matchedText: query,
            matchedAlias: true,
            distance: 0,
            confidence: 1,
        };
    }

    // The input may be a full sentence or include extra words. Prefer the
    // longest catalog term contained as a whole phrase; only that longest
    // term can be ambiguous. A longer match later in the catalog wins.
    let containment: {entry: BreedEntry; term: SearchTerm} | null = null;
    let containmentAmbiguous = false;

    for (const entry of SEARCH_ENTRIES) {
        for (const term of entry.terms) {
            if (!hasWholePhrase(query, term.value)) {
                continue;
            }

            if (!containment || term.value.length > containment.term.value.length) {
                containment = {entry, term};
                containmentAmbiguous = false;
            } else if (
                term.value.length === containment.term.value.length &&
                entry.breed !== containment.entry.breed
            ) {
                containmentAmbiguous = true;
            }
        }
    }

    if (containment && containmentAmbiguous) {
        return null;
    }

    if (containment) {
        return {
            breed: containment.entry.breed,
            species: containment.entry.species,
            kind: "contains",
            matchedText: containment.term.value,
            matchedAlias: containment.term.isAlias,
            distance: 0,
            confidence: 0.95,
        };
    }

    // A standalone modifier ("toy", "negro", "mini") is not a breed.
    if (NON_DISTINCTIVE_BREED_WORDS.has(query)) {
        return null;
    }

    // Unambiguous prefix/word-prefix. "pood" and "gold" resolve; "pas" and
    // "retriever" remain suggestions because several breeds match.
    if (query.length >= 3) {
        const prefixBreeds = new Map<PetBreed, {entry: BreedEntry; term: SearchTerm}>();

        for (const entry of SEARCH_ENTRIES) {
            for (const term of entry.terms) {
                const words = term.value.split(" ");
                const termStarts = term.value.startsWith(query);
                const wordStarts = words.some(word => (
                    word.startsWith(query) &&
                    !NON_DISTINCTIVE_BREED_WORDS.has(word)
                ));

                if (!termStarts && !wordStarts) {
                    continue;
                }

                const current = prefixBreeds.get(entry.breed);

                if (!current ||
                    (termStarts && !current.term.value.startsWith(query)) ||
                    (termStarts === current.term.value.startsWith(query) &&
                        term.value.length < current.term.value.length)) {
                    prefixBreeds.set(entry.breed, {entry, term});
                }
            }
        }

        if (prefixBreeds.size > 1) {
            return null;
        }

        if (prefixBreeds.size === 1) {
            const [match] = prefixBreeds.values();

            return {
                breed: match.entry.breed,
                species: match.entry.species,
                kind: "prefix",
                matchedText: match.term.value,
                matchedAlias: match.term.isAlias,
                distance: 0,
                confidence: 0.9,
            };
        }
    }

    // Conservative fuzzy matching.
    const fuzzyCandidates: FuzzyBreedCandidate[] = [];

    for (const entry of SEARCH_ENTRIES) {
        let best: FuzzyBreedCandidate | null = null;

        for (const term of entry.terms) {
            const match = getBestFuzzyWordMatch(query, term.value, !term.isAlias);

            if (!isFuzzyResolveCandidate(query, match)) {
                continue;
            }

            const candidate = {entry, term, match};

            if (!best ||
                match.similarity > best.match.similarity ||
                (match.similarity === best.match.similarity && match.distance < best.match.distance)) {
                best = candidate;
            }
        }

        if (best) {
            fuzzyCandidates.push(best);
        }
    }

    if (fuzzyCandidates.length === 0) {
        return null;
    }

    fuzzyCandidates.sort(compareFuzzyCandidates);

    if (fuzzyCandidates.length > 1 && areFuzzyCandidatesAmbiguous(fuzzyCandidates[0], fuzzyCandidates[1])) {
        return null;
    }

    const [best] = fuzzyCandidates;

    return {
        breed: best.entry.breed,
        species: best.entry.species,
        kind: "fuzzy",
        matchedText: best.match.variant,
        matchedAlias: best.term.isAlias,
        distance: best.match.distance,
        confidence: best.match.similarity,
    };
};

/**
 * Returns the canonical breed when recognized, otherwise the cleaned original
 * text. This is what controllers should write to Prisma.
 */
export const normalizePetBreed = (value: string | null | undefined): string => {
    const cleanValue = cleanPetBreedText(value);

    if (!cleanValue) {
        return "";
    }

    return findPetBreed(cleanValue)?.breed ?? cleanValue;
};

export interface PetBreedSuggestion {
    readonly breed: PetBreed;
    readonly species: PetSpecies;
    readonly score: number;
}

interface SuggestionCandidate {
    readonly suggestion: PetBreedSuggestion;
    readonly order: number;
}

/**
 * Ranks catalog entries for the searchable autocomplete.
 *
 * Ranking order: exact canonical, exact alias, prefix, word prefix, substring,
 * then fuzzy. "pu" therefore returns Pug and Poodle (the latter through its
 * "pudle"/"pudel" aliases), exactly as a user searching for those breeds would
 * expect. Unknown text is still allowed by the component and the backend.
 */
export const searchPetBreeds = (
    query: string | null | undefined,
    limit = 8,
): readonly PetBreedSuggestion[] => {
    const safeLimit = Math.max(0, Math.trunc(limit));
    const normalizedQuery = normalizeBreedText(query);
    const results = new Map<PetBreed, SuggestionCandidate>();

    if (safeLimit === 0) {
        return [];
    }

    if (!normalizedQuery) {
        return PET_BREED_DEFINITIONS
            .slice(0, safeLimit)
            .map(definition => ({
                breed: definition.name,
                species: definition.species,
                score: 0,
            }));
    }

    for (const entry of SEARCH_ENTRIES) {
        let bestScore: number | null = null;

        for (const term of entry.terms) {
            let score: number | null = null;

            if (term.value === normalizedQuery) {
                score = term.isAlias ? 0.1 : 0;
            } else if (term.value.startsWith(normalizedQuery)) {
                score = 1 + (term.value.length - normalizedQuery.length) / 1000;
            } else {
                const words = term.value.split(" ");
                const wordIndex = words.findIndex(word => word.startsWith(normalizedQuery));

                if (wordIndex >= 0) {
                    score = 2 + wordIndex / 100 +
                        (words[wordIndex].length - normalizedQuery.length) / 1000;
                } else if (normalizedQuery.length >= 2 && term.value.includes(normalizedQuery)) {
                    score = 3 + (term.value.length - normalizedQuery.length) / 1000;
                } else {
                    const fuzzy = getBestFuzzyWordMatch(normalizedQuery, term.value, !term.isAlias);

                    if (isFuzzySearchCandidate(normalizedQuery, fuzzy)) {
                        score = 4 + (1 - fuzzy.similarity) + fuzzy.distance / 100;
                    }
                }
            }

            if (score !== null && (bestScore === null || score < bestScore)) {
                bestScore = score;
            }
        }

        if (bestScore === null) {
            continue;
        }

        const current = results.get(entry.breed);

        if (!current || bestScore < current.suggestion.score) {
            results.set(entry.breed, {
                suggestion: {
                    breed: entry.breed,
                    species: entry.species,
                    score: bestScore,
                },
                order: entry.order,
            });
        }
    }

    return [...results.values()]
        .sort((a, b) => a.suggestion.score - b.suggestion.score || a.order - b.order)
        .slice(0, safeLimit)
        .map(candidate => candidate.suggestion);
};
