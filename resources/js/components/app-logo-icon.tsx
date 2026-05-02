import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 8h28l-4 8H14l-4-8Zm4 12h20v20h-6V28H20v12h-6V20Z"
            />
        </svg>
    );
}
