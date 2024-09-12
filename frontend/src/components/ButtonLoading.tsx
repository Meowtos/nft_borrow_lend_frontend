interface ButtonLoadingProps {
    className: string;
}
export function ButtonLoading({ className }: ButtonLoadingProps) {
    return (
        <button className={className} type="button" disabled>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span className="visually-hidden" role="status">Loading...</span>
        </button>
    )
}