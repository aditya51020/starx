import { Helmet } from 'react-helmet-async';

export default function Meta({ title, description, keywords, image, url }) {
    const siteTitle = "StarX Realty";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || "Find your dream home with StarX Realty."} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || "Find your dream home with StarX Realty."} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || "Find your dream home with StarX Realty."} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
