import { useEffect } from 'react';

const SITE_NAME = 'Gaivota FM 98.1 · Tramandaí/RS';
const DEFAULT_DESCRIPTION =
	'Gaivota FM 98.1: música, informação e histórias de Tramandaí e do litoral norte do Rio Grande do Sul.';
const SOCIAL_IMAGE_PATH = '/gaivota-fm-logo.svg';

type PageMetadataProps = {
	title: string;
	description?: string;
	noIndex?: boolean;
};

function setMetaTag(
	attribute: 'name' | 'property',
	key: string,
	content: string,
) {
	let element = document.head.querySelector<HTMLMetaElement>(
		`meta[${attribute}="${key}"]`,
	);
	if (!element) {
		element = document.createElement('meta');
		element.setAttribute(attribute, key);
		document.head.appendChild(element);
	}
	element.setAttribute('content', content);
}

function setCanonicalUrl(url: string) {
	let element = document.head.querySelector<HTMLLinkElement>(
		'link[rel="canonical"]',
	);
	if (!element) {
		element = document.createElement('link');
		element.setAttribute('rel', 'canonical');
		document.head.appendChild(element);
	}
	element.setAttribute('href', url);
}

export function PageMetadata({
	title,
	description = DEFAULT_DESCRIPTION,
	noIndex = false,
}: PageMetadataProps) {
	useEffect(() => {
		const pageTitle = `${title} · ${SITE_NAME}`;
		const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
		const imageUrl = `${window.location.origin}${SOCIAL_IMAGE_PATH}`;

		document.title = pageTitle;
		setCanonicalUrl(canonicalUrl);
		setMetaTag('name', 'description', description);
		setMetaTag(
			'name',
			'robots',
			noIndex ? 'noindex, nofollow' : 'index, follow',
		);
		setMetaTag('property', 'og:title', pageTitle);
		setMetaTag('property', 'og:description', description);
		setMetaTag('property', 'og:type', 'website');
		setMetaTag('property', 'og:url', canonicalUrl);
		setMetaTag('property', 'og:site_name', SITE_NAME);
		setMetaTag('property', 'og:locale', 'pt_BR');
		setMetaTag('property', 'og:image', imageUrl);
		setMetaTag('name', 'twitter:card', 'summary');
		setMetaTag('name', 'twitter:title', pageTitle);
		setMetaTag('name', 'twitter:description', description);
		setMetaTag('name', 'twitter:image', imageUrl);
	}, [description, noIndex, title]);

	return null;
}
