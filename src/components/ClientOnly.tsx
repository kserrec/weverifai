'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

/**
 * ClientOnly ensures its children are only rendered on the client side.
 * This prevents hydration mismatches for components that need access to
 * browser APIs or have different server/client rendered output.
 */
export function ClientOnly({ children }: ClientOnlyProps): ReactNode {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
} 