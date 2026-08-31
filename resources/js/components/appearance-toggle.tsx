import { Moon, Sun } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggle({
    className,
    ...props
}: ComponentProps<typeof Button>) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            {...props}
            className={cn('shrink-0', className)}
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            aria-label={
                isDark ? 'Switch to light theme' : 'Switch to dark theme'
            }
            aria-pressed={isDark}
            data-test="appearance-toggle"
        >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
    );
}
