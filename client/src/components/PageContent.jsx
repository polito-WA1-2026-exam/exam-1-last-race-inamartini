function PageComponent({ title, children }) {
    return (
        <div className="page">
            <h1 className="page-title">{title}</h1>

            <div className="page-content">
                {children}
            </div>
        </div>
    )
}

export default PageComponent