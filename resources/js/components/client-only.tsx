import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';

interface ClientOnlyProps {
    children: ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasMounted(() => true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return <>{children}</>;
};

export default ClientOnly;
