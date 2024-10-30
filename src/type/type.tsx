export type Movie = {
    "@type": string;
    item: {
        "@type": string;
        url: string;
        name: string;
        alternateName: string;
        description: string;
        image: string;
        aggregateRating: {
            "@type": string;
            bestRating: number;
            worstRating: number;
            ratingValue: number;
            ratingCount: number;
        };
        contentRating: string;
        genre: string;
        duration: string;
    }
}

export type MovieResponse = {
    "@type": string;
    itemListElement: Movie[];
    "@context": string,
    name: string,
    description: string,
}

export {}