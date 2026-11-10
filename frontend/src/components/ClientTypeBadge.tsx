interface ClientTypeBadgeProps {
    isRecurring: boolean;
    long?: boolean;
}

const ClientTypeBadge = ({isRecurring, long = false}: ClientTypeBadgeProps) => {
    const label = isRecurring
        ? (long ? "Cliente recurrente" : "Recurrente")
        : (long ? "Cliente nuevo" : "Nuevo");

    return (
        <span className={`client-type-badge ${isRecurring ? "client-type-recurring" : "client-type-new"}`}>
            {label}
        </span>
    );
};

export default ClientTypeBadge;
