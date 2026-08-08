import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.25 3.5h15.5a1.25 1.25 0 0 1 1.25 1.25v2A1.25 1.25 0 0 1 20 8H4a1.25 1.25 0 0 1-1.25-1.25v-2A1.25 1.25 0 0 1 4.25 3.5Zm.75 5.75h14v9.75a1.75 1.75 0 0 1-1.75 1.75H6.75a1.75 1.75 0 0 1-1.75-1.75V9.25Zm4.75 1.25a.75.75 0 0 0-.75.75v5.5c0 .414.336.75.75.75h4.5c.414 0 .75-.336.75-.75v-5.5a.75.75 0 0 0-.75-.75h-4.5Z"
            />
        </svg>
    );
}
