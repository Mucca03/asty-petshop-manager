import assert from "node:assert/strict";
import test from "node:test";
import {
    cleanPetBreedText,
    findPetBreed,
    getPetBreedDefinition,
    levenshteinDistance,
    normalizeBreedText,
    normalizePetBreed,
    PET_BREED_DEFINITIONS,
    PET_BREEDS,
    searchPetBreeds,
} from "../../shared/petBreeds";

test("normalizes breed text for accent-insensitive comparisons", () => {
    assert.equal(normalizeBreedText("  Shih-Tzu  "), "shih tzu");
    assert.equal(normalizeBreedText("Dálmata"), "dalmata");
    assert.equal(normalizeBreedText("BICHÓN FRISÉ"), "bichon frise");
    assert.equal(normalizeBreedText("Poodle Negro"), "poodle negro");
    assert.equal(normalizeBreedText(""), "");
    assert.equal(normalizeBreedText(null), "");
    assert.equal(normalizeBreedText(undefined), "");
    assert.equal(cleanPetBreedText("  Pastor   Alemán  "), "Pastor Alemán");
});

test("computes Levenshtein distance", () => {
    assert.equal(levenshteinDistance("pug", "puh"), 1);
    assert.equal(levenshteinDistance("pug", "pugg"), 1);
    assert.equal(levenshteinDistance("kitten", "sitting"), 3);
    assert.equal(levenshteinDistance("", "abc"), 3);
    assert.equal(levenshteinDistance("abc", ""), 3);
    assert.equal(levenshteinDistance("same", "same"), 0);
});

test("keeps canonical names unique and aliases unambiguous", () => {
    const canonicalByNormalized = new Map<string, string>();

    for (const definition of PET_BREED_DEFINITIONS) {
        const normalizedName = normalizeBreedText(definition.name);

        assert.ok(normalizedName.length > 0);
        assert.equal(
            canonicalByNormalized.has(normalizedName),
            false,
            `duplicate canonical breed: ${definition.name}`,
        );
        canonicalByNormalized.set(normalizedName, definition.name);
    }

    const aliasOwners = new Map<string, string>();

    for (const definition of PET_BREED_DEFINITIONS) {
        for (const alias of definition.aliases) {
            const normalizedAlias = normalizeBreedText(alias);

            assert.ok(normalizedAlias.length > 0, `empty alias in ${definition.name}`);

            const existingOwner = aliasOwners.get(normalizedAlias);
            assert.ok(
                !existingOwner || existingOwner === definition.name,
                `alias "${alias}" is shared by ${existingOwner} and ${definition.name}`,
            );

            const canonicalOwner = canonicalByNormalized.get(normalizedAlias);
            assert.ok(
                !canonicalOwner || canonicalOwner === definition.name,
                `alias "${alias}" of ${definition.name} collides with canonical ${canonicalOwner}`,
            );

            aliasOwners.set(normalizedAlias, definition.name);
        }
    }

    assert.ok(PET_BREEDS.length >= 50);
    assert.equal(getPetBreedDefinition("pug")?.name, "Pug");
    assert.equal(getPetBreedDefinition("DÁLMATA")?.name, "Dálmata");
    assert.equal(getPetBreedDefinition("caniche"), null);
});

test("resolves exact canonical names and legacy aliases", () => {
    assert.equal(normalizePetBreed("Pug"), "Pug");
    assert.equal(normalizePetBreed("poodle"), "Poodle");
    assert.equal(normalizePetBreed("caniche"), "Poodle");
    assert.equal(normalizePetBreed("PUDLE"), "Poodle");
    assert.equal(normalizePetBreed("podier negro"), "Poodle");
    assert.equal(normalizePetBreed("golden"), "Golden Retriever");
    assert.equal(normalizePetBreed("husky"), "Husky Siberiano");
    assert.equal(normalizePetBreed("sanuser"), "Schnauzer");
    assert.equal(normalizePetBreed("koker"), "Cocker Spaniel");
    assert.equal(normalizePetBreed("koli"), "Collie");
    assert.equal(normalizePetBreed("chipzu"), "Shih Tzu");
    assert.equal(normalizePetBreed("mestizo gis"), "Mestizo");
    assert.equal(normalizePetBreed("pastor"), "Pastor Alemán");
    assert.equal(normalizePetBreed("pastor blanco suizo"), "Pastor Blanco Suizo");
    assert.equal(normalizePetBreed("pastor suizo"), "Pastor Blanco Suizo");
    assert.equal(normalizePetBreed("  Golden   Retriever  "), "Golden Retriever");
    assert.equal(normalizePetBreed("DÁLMATA"), "Dálmata");
});

test("resolves noisy values with conservative fuzzy matching", () => {
    assert.equal(findPetBreed("puh")?.breed, "Pug");
    assert.equal(findPetBreed("puh")?.kind, "fuzzy");
    assert.equal(findPetBreed("pugg")?.breed, "Pug");
    assert.equal(findPetBreed("goldn")?.breed, "Golden Retriever");
    assert.equal(findPetBreed("huski")?.breed, "Husky Siberiano");
    assert.equal(findPetBreed("chihuahau")?.breed, "Chihuahua");
    assert.equal(findPetBreed("dobberman")?.breed, "Doberman");

    // Short or genuinely ambiguous prefixes stay as suggestions, not writes.
    assert.equal(findPetBreed("pu"), null);
    assert.equal(findPetBreed("past"), null);
    assert.equal(findPetBreed("retriever"), null);
    assert.equal(findPetBreed("siberiano"), null);
    assert.equal(findPetBreed("toy"), null);
    assert.equal(findPetBreed("toyy"), null);
    assert.equal(findPetBreed("calle"), null);
    assert.equal(findPetBreed("call"), null);
    assert.equal(findPetBreed("gigante"), null);
    assert.equal(findPetBreed("gig"), null);
    assert.equal(findPetBreed("azul"), null);

    // Full aliases that contain those modifiers still resolve.
    assert.equal(normalizePetBreed("poodle toy"), "Poodle");
    assert.equal(normalizePetBreed("schnauzer gigante"), "Schnauzer");
    assert.equal(normalizePetBreed("criollo de la calle"), "Criollo");

    assert.equal(normalizePetBreed("puh"), "Pug");
    assert.equal(normalizePetBreed("pugg"), "Pug");
    assert.equal(normalizePetBreed("goldn"), "Golden Retriever");
    assert.equal(normalizePetBreed("huski"), "Husky Siberiano");
});

test("resolves unambiguous prefixes and breeds inside longer text", () => {
    assert.equal(findPetBreed("pood")?.breed, "Poodle");
    assert.equal(findPetBreed("pood")?.kind, "prefix");
    assert.equal(findPetBreed("gold")?.breed, "Golden Retriever");
    assert.equal(findPetBreed("golden retriever macho")?.breed, "Golden Retriever");
    assert.equal(findPetBreed("golden retriever macho")?.kind, "contains");
    assert.equal(findPetBreed("pastor aleman negro")?.breed, "Pastor Alemán");
    assert.equal(findPetBreed("dogo de burdeos cachorro")?.breed, "Dogo de Burdeos");
    assert.equal(findPetBreed("mi poodle negro")?.breed, "Poodle");
    assert.equal(findPetBreed("dogo")?.breed, "Dogo Argentino");
    assert.equal(findPetBreed("mastin")?.breed, "Mastín Inglés");
});

test("preserves custom breeds and clears empty values", () => {
    assert.equal(normalizePetBreed("  raza   inventada  "), "raza inventada");
    assert.equal(normalizePetBreed("Perro de la calle"), "Perro de la calle");
    assert.equal(normalizePetBreed(""), "");
    assert.equal(normalizePetBreed("   "), "");
    assert.equal(normalizePetBreed(null), "");
    assert.equal(normalizePetBreed(undefined), "");
});

test("ranks autocomplete suggestions for the searchable UI", () => {
    const pu = searchPetBreeds("pu").map(suggestion => suggestion.breed);

    assert.deepEqual(pu.slice(0, 2), ["Pug", "Poodle"]);
    assert.equal(searchPetBreeds("puh")[0]?.breed, "Pug");
    assert.equal(searchPetBreeds("poodle")[0]?.breed, "Poodle");
    assert.equal(searchPetBreeds("caniche")[0]?.breed, "Poodle");
    assert.equal(searchPetBreeds("toy")[0]?.breed, "Poodle");
    assert.equal(searchPetBreeds("calle")[0]?.breed, "Criollo");
    assert.equal(searchPetBreeds("")[0]?.breed, "Pug");
    assert.equal(searchPetBreeds("", 8).length, 8);
    assert.equal(searchPetBreeds("pu", 1).length, 1);
    assert.deepEqual(searchPetBreeds("zzzz"), []);
});
