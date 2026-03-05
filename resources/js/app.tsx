import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import '../css/app.css';
import { initHttp } from '@/bootstrap';
import { initializeTheme } from './hooks/use-appearance';

await initHttp();

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        hydrateRoot(
            el,
            <StrictMode>
                <App {...props} />
            </StrictMode>
        )
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
