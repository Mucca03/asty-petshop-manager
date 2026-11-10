import {useEffect, useId, useMemo, useRef, useState} from "react";
import type {ChangeEvent, KeyboardEvent} from "react";
import {findPetBreed, searchPetBreeds} from "../domain/petBreeds.ts";

interface BreedAutocompleteProps {
    id: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

const MAX_SUGGESTIONS = 8;

const SPECIES_LABELS = {
    dog: "Perro",
    cat: "Gato",
} as const;

/**
 * Searchable breed combobox backed by the shared canonical catalog.
 *
 * The visible text input keeps `name`, so existing FormData-based forms keep
 * working. On blur, a recognized value is rewritten to its canonical breed;
 * unknown values are preserved so users can still register a rare breed.
 */
const BreedAutocomplete = ({
    id,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
}: BreedAutocompleteProps) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const generatedId = useId().replace(/:/g, "");
    const listboxId = `${id}-breed-listbox-${generatedId}`;
    const suggestions = useMemo(
        () => searchPetBreeds(value, MAX_SUGGESTIONS),
        [value],
    );
    const safeActiveIndex = activeIndex >= 0 && activeIndex < suggestions.length
        ? activeIndex
        : -1;

    useEffect(() => {
        const form = inputRef.current?.form;

        if (!form) {
            return;
        }

        const closeOnReset = () => {
            setOpen(false);
            setActiveIndex(-1);
        };

        form.addEventListener("reset", closeOnReset);

        return () => form.removeEventListener("reset", closeOnReset);
    }, []);

    const chooseBreed = (breed: string) => {
        onChange(breed);
        setOpen(false);
        setActiveIndex(-1);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
        setOpen(true);
        setActiveIndex(-1);
    };

    const handleFocus = () => {
        setOpen(true);
    };

    const handleBlur = () => {
        const match = findPetBreed(value);

        setOpen(false);
        setActiveIndex(-1);

        if (match && match.breed !== value) {
            onChange(match.breed);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();

            if (!open) {
                setOpen(true);
                setActiveIndex(suggestions.length > 0 ? 0 : -1);
                return;
            }

            setActiveIndex(current => (
                suggestions.length === 0
                    ? -1
                    : current >= suggestions.length - 1
                        ? 0
                        : current + 1
            ));
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            if (!open) {
                setOpen(true);
                setActiveIndex(suggestions.length > 0 ? suggestions.length - 1 : -1);
                return;
            }

            setActiveIndex(current => (
                suggestions.length === 0
                    ? -1
                    : current <= 0
                        ? suggestions.length - 1
                        : current - 1
            ));
            return;
        }

        if (event.key === "Enter" && open && safeActiveIndex >= 0) {
            event.preventDefault();
            chooseBreed(suggestions[safeActiveIndex].breed);
            return;
        }

        if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
            setActiveIndex(-1);
        }
    };

    const handleClear = () => {
        onChange("");
        setOpen(true);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    return (
        <div className="breed-autocomplete">
            <div className="breed-input-shell">
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type="text"
                    role="combobox"
                    aria-label="Raza mascota"
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={open && suggestions.length > 0 ? listboxId : undefined}
                    aria-activedescendant={safeActiveIndex >= 0
                        ? `${listboxId}-option-${safeActiveIndex}`
                        : undefined}
                    autoComplete="off"
                    spellCheck={false}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                />
                {value && !disabled && (
                    <button
                        type="button"
                        className="breed-clear"
                        aria-label="Borrar raza"
                        onMouseDown={event => event.preventDefault()}
                        onClick={handleClear}
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                )}
            </div>

            {open && (
                <div className="breed-popover">
                    {suggestions.length > 0 ? (
                        <ul
                            id={listboxId}
                            className="breed-options"
                            role="listbox"
                            aria-label="Razas sugeridas"
                            onMouseDown={event => event.preventDefault()}
                        >
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={suggestion.breed}
                                    id={`${listboxId}-option-${index}`}
                                    role="option"
                                    aria-label={`${suggestion.breed}, ${SPECIES_LABELS[suggestion.species]}`}
                                    aria-selected={index === safeActiveIndex}
                                    className={`breed-option${index === safeActiveIndex ? " breed-option-active" : ""}`}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => chooseBreed(suggestion.breed)}
                                >
                                    <span className="breed-option-name">{suggestion.breed}</span>
                                    <span className="breed-option-species">
                                        {SPECIES_LABELS[suggestion.species]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="breed-option-empty" role="status">
                            Sin coincidencias. Se guardará la raza escrita.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BreedAutocomplete;
